package com.jdesive.dockarr.telegramrquestbot.service;

import com.jdesive.dockarr.telegramrquestbot.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SonarrService {

    @Value("${sonarr.apiToken}")
    private String apiToken;

    @Value("${sonarr.baseUrl}")
    private String baseUrl;

    @Value("${sonarr.rootFolderPath}")
    private String rootFolderPath;

    @Value("${sonarr.qualityProfileId}")
    private int qualityProfileId;

    @Autowired
    public SonarrService() {
    }

    public SonarrLookupResponse[] search(String term) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", this.apiToken);
        return restTemplate.exchange(this.baseUrl + "/api/v3/series/lookup?term=" + term, HttpMethod.GET, new HttpEntity<>(headers), SonarrLookupResponse[].class).getBody();
    }

    public ResponseEntity<Object> add(int tvdbId, String title) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", this.apiToken);

        SeriesRequest request = new SeriesRequest();
        request.setTvdbId(tvdbId);
        request.setTitle(title);
        request.setRootFolderPath(this.rootFolderPath);
        request.setMonitored(true);
        request.setQualityProfileId(this.qualityProfileId);
        request.setMinimumAvailability("released");
        request.setAddOptions(new AddOptionsRequest(true));

        return restTemplate.exchange(this.baseUrl + "/api/v3/series/", HttpMethod.POST, new HttpEntity<>(request, headers), Object.class);
    }

}
