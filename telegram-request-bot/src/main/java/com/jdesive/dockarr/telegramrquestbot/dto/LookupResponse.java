package com.jdesive.dockarr.telegramrquestbot.dto;

import lombok.Data;

@Data
public class LookupResponse {

    private String title;
    private String originalTitle;

    private String remotePoster;

    private String overview;
    private int year;
    private String certification;
    private String status;

}
