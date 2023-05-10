package com.jdesive.dockarr.telegramrquestbot.dto;

import lombok.Data;

@Data
public class MovieRequest {

    private int tmdbId;
    private String rootFolderPath;
    private boolean monitored;
    private int qualityProfileId;
    private String minimumAvailability;
    private String title;
    private AddOptionsRequest addOptions;

}
