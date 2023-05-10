package com.jdesive.dockarr.telegramrquestbot.telegram;

import com.google.common.collect.Lists;
import com.jdesive.dockarr.telegramrquestbot.dto.LookupResponse;
import com.jdesive.dockarr.telegramrquestbot.dto.RadarrLookupResponse;
import com.jdesive.dockarr.telegramrquestbot.dto.SonarrLookupResponse;
import com.jdesive.dockarr.telegramrquestbot.service.SonarrService;
import lombok.extern.slf4j.Slf4j;
import com.jdesive.dockarr.telegramrquestbot.models.ShowMessageData;
import com.jdesive.dockarr.telegramrquestbot.service.RadarrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Conditional;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.ActionType;
import org.telegram.telegrambots.meta.api.methods.send.SendChatAction;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageCaption;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageMedia;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.media.InputMediaPhoto;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@ConditionalOnProperty("${telegram.bot.enabled}")
public class UflixBot extends TelegramLongPollingBot {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.username}")
    private String botUsername;

    @Value("${telegram.bot.intakeChatId}")
    private long intakeChatId;

    @Value("${telegram.bot.intakeChat.enabled}")
    private boolean intakeChatEnabled;

    private final TaskScheduler scheduler;

    private final RadarrService radarrService;
    private final SonarrService sonarrService;

    private final Map<Integer, ShowMessageData> showMessageDataMap = new HashMap<>();

    @Autowired
    public UflixBot(TaskScheduler scheduler, RadarrService radarrService, SonarrService sonarrService) {
        this.scheduler = scheduler;
        this.radarrService = radarrService;
        this.sonarrService = sonarrService;
    }

    @Override
    public String getBotUsername() {
        return this.botUsername;
    }

    @Override
    public String getBotToken() {
        return this.botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {

        if (update.hasCallbackQuery()) {
            String action = update.getCallbackQuery().getData();
            Message message = update.getCallbackQuery().getMessage();
            ShowMessageData showMessageData = this.showMessageDataMap.get(message.getMessageId());
            log.info(message.getMessageId() + "");

            switch (action) {
                case "back":
                    if (showMessageData.getIndex() > 0) {
                        showMessageData.setIndex(showMessageData.getIndex() - 1);
                        this.editShowMessage(message, showMessageData.getData().get(showMessageData.getIndex()));
                        this.showMessageDataMap.replace(message.getMessageId(), showMessageData);
                    }
                    break;
                case "next":
                    if (showMessageData.getIndex() <= showMessageData.getData().size() - 2) {
                        showMessageData.setIndex(showMessageData.getIndex() + 1);
                        this.editShowMessage(message, showMessageData.getData().get(showMessageData.getIndex()));
                        this.showMessageDataMap.replace(message.getMessageId(), showMessageData);
                    }
                    break;
                case "add":
                    LookupResponse response = showMessageData.getData().get(showMessageData.getIndex());
                    if (response instanceof RadarrLookupResponse) {
                        this.radarrService.add((int) ((RadarrLookupResponse) response).getTmdbId(), response.getTitle());
                    } else if (response instanceof SonarrLookupResponse) {
                        this.radarrService.add((int) ((SonarrLookupResponse) response).getTvdbId(), response.getTitle());
                    }
                    this.sendRequestedMessage(response);
                default:
                    this.deleteMessage(update.getCallbackQuery().getMessage());
                    this.showMessageDataMap.remove(update.getCallbackQuery().getMessage().getMessageId());
                    break;
            }
        }

        if (update.hasMessage()) {

            if (update.getMessage().hasEntities() && update.getMessage().isCommand()) {

                if (!this.intakeChatEnabled || update.getMessage().getChatId() != this.intakeChatId) {
                    return;
                }

                // Commands from intake
                String command = update.getMessage().getText().replace("/", "").trim();

                if (command.equalsIgnoreCase("ping")) {
                    this.handlePing(update);
                }else if (command.startsWith("movie") || command.startsWith("tv")) {
                    this.handleSearch(update, command);
                }
            }

        }


    }

    private void startChatAction(ActionType actionType, long chatId) {
        SendChatAction chatAction = new SendChatAction();
        chatAction.setAction(actionType);
        chatAction.setChatId(chatId);
        try {
            this.execute(chatAction);
        } catch (TelegramApiException e) {
            log.error("Error sending telegram chat action", e);
        }
    }

    private void deleteMessage(Message message) {
        try {
            this.execute(new DeleteMessage(message.getChat().getId().toString(), message.getMessageId()));
        } catch (TelegramApiException e) {
            log.error("Error deleting telegram message", e);
        }
    }

    private Message sendMessage(Long chatId, String message) {
        try {
            return this.execute(new SendMessage(chatId.toString(), message));
        } catch (TelegramApiException e) {
            log.error("Error sending telegram message", e);
        }
        return null;
    }

    private void handlePing(Update update) {
        long chatId = update.getMessage().getChat().getId();
        this.deleteMessage(update.getMessage());
        Message message = this.sendMessage(chatId, "Pong!");

        if (message != null) {
            this.scheduler.schedule(() -> {
                this.deleteMessage(message);
            }, Instant.now().plus(Duration.of(10, ChronoUnit.SECONDS)));
        }
    }

    private void handleSearch(Update update, String command) {
        this.deleteMessage(update.getMessage());
        this.startChatAction(ActionType.TYPING, update.getMessage().getChatId());



        String term = update.getMessage().getText().substring(update.getMessage().getText().split(" ")[0].length()).trim();

        if (command.startsWith("movie")) {
            List<LookupResponse> responses = Lists.newArrayList(this.radarrService.search(term));

            Message result = this.sendShowMessage(responses.get(0), update.getMessage().getChatId().toString());
            if (result != null) {
                this.showMessageDataMap.put(result.getMessageId(), new ShowMessageData(0, responses));
            }
        } else if (command.startsWith("tv")) {
            List<LookupResponse> responses = Lists.newArrayList(this.sonarrService.search(term));

            Message result = this.sendShowMessage(responses.get(0), update.getMessage().getChatId().toString());
            if (result != null) {
                this.showMessageDataMap.put(result.getMessageId(), new ShowMessageData(0, responses));
            }
        }



    }

    private String getShowCaption(LookupResponse response) {
        return response.getTitle() + " (" + response.getYear() + ") - " + response.getStatus() + "\n" + response.getCertification() + "\n" + response.getOverview();
    }

    private void editShowMessage(Message message, LookupResponse response) {

        log.info("[EDIT] " + response.getRemotePoster());
        try {
            try {
                EditMessageMedia editMessageMedia = new EditMessageMedia();
                editMessageMedia.setMessageId(message.getMessageId());
                editMessageMedia.setChatId(message.getChatId());
                editMessageMedia.setMedia(new InputMediaPhoto(response.getRemotePoster()));
                this.execute(editMessageMedia);
            } catch (TelegramApiException ex) {
                EditMessageMedia editMessageMedia = new EditMessageMedia();
                editMessageMedia.setMessageId(message.getMessageId());
                editMessageMedia.setChatId(message.getChatId());
                editMessageMedia.setMedia(new InputMediaPhoto("https://www.verticalrail.com/wp-content/uploads/2015/05/404-Page-Not-Found.png"));
                this.execute(editMessageMedia);
            }

            EditMessageCaption editMessageCaption = new EditMessageCaption();
            editMessageCaption.setMessageId(message.getMessageId());
            editMessageCaption.setChatId(message.getChatId());
            editMessageCaption.setCaption(this.getShowCaption(response));
            editMessageCaption.setReplyMarkup(this.getShowMessageKeyboardMarkup(response));

            this.execute(editMessageCaption);
        } catch (TelegramApiException e) {
            log.error("Error editing telegram message", e);
        }
    }

    private InlineKeyboardMarkup getShowMessageKeyboardMarkup(LookupResponse response) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();

        List<List<InlineKeyboardButton>> keyboard = new ArrayList<>();

        InlineKeyboardButton back = new InlineKeyboardButton("<< Back");
        back.setCallbackData("back");

        InlineKeyboardButton tmdb = new InlineKeyboardButton("TMDB");
        if (response instanceof RadarrLookupResponse) {
            tmdb.setUrl("https://www.themoviedb.org/movie/" + ((RadarrLookupResponse) response).getTmdbId());
        } else if (response instanceof SonarrLookupResponse) {
            tmdb.setUrl("https://www.themoviedb.org/movie/" + ((SonarrLookupResponse) response).getTvdbId());
        }

        InlineKeyboardButton next = new InlineKeyboardButton("Next >>");
        next.setCallbackData("next");

        List<InlineKeyboardButton> buttons1 = new ArrayList<>(List.of(back, tmdb, next));

        InlineKeyboardButton add = new InlineKeyboardButton("Add");
        add.setCallbackData("add");
        InlineKeyboardButton cancel = new InlineKeyboardButton("Cancel");
        cancel.setCallbackData("exit");

        List<InlineKeyboardButton> buttons2 = new ArrayList<>(List.of(add, cancel));

        keyboard.add(buttons1);
        keyboard.add(buttons2);

        inlineKeyboardMarkup.setKeyboard(keyboard);
        return inlineKeyboardMarkup;
    }

    private Message sendShowMessage(LookupResponse response, String chatId) {

        try {
            log.info("[ADD] " + response.getRemotePoster());
            SendPhoto sendPhoto = new SendPhoto(chatId, new InputFile(response.getRemotePoster()));
            sendPhoto.setCaption(this.getShowCaption(response));
            sendPhoto.setReplyMarkup(this.getShowMessageKeyboardMarkup(response));
            return this.execute(sendPhoto);
        } catch (TelegramApiException e) {
            log.error("Error sending telegram message", e);
        }
        return null;
    }

    private void sendRequestedMessage(LookupResponse response) {

        SendPhoto sendPhoto = new SendPhoto();
        sendPhoto.setChatId(this.intakeChatId);
        sendPhoto.setPhoto(new InputFile(response.getRemotePoster()));
        sendPhoto.setCaption("Successfully Requested\n" + this.getShowCaption(response));
        try {
            this.execute(sendPhoto);
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }

    }

}
