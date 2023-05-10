package com.jdesive.dockarr.telegramrquestbot.dto;

import lombok.Data;

@Data
public class SonarrLookupResponse extends LookupResponse{
    private long tvdbId;
}
