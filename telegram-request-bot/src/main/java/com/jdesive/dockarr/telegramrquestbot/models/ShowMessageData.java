package com.jdesive.dockarr.telegramrquestbot.models;

import com.jdesive.dockarr.telegramrquestbot.dto.LookupResponse;
import com.jdesive.dockarr.telegramrquestbot.dto.RadarrLookupResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ShowMessageData {

    private int index;
    private List<LookupResponse> data;

}
