package com.jdesive.dockarr.telegramrquestbot.service;

import com.jdesive.dockarr.telegramrquestbot.dto.RadarrLookupResponse;
import com.jdesive.dockarr.telegramrquestbot.dto.AddOptionsRequest;
import com.jdesive.dockarr.telegramrquestbot.dto.MovieRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class RadarrService {

    @Value("${radarr.apiToken}")
    private String apiToken;

    @Value("${radarr.baseUrl}")
    private String baseUrl;

    @Value("${radarr.rootFolderPath}")
    private String rootFolderPath;

    @Value("${radarr.qualityProfileId}")
    private int qualityProfileId;

    @Autowired
    public RadarrService() {
    }

    public RadarrLookupResponse[] search(String term) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", this.apiToken);
        return restTemplate.exchange(this.baseUrl + "/api/v3/movie/lookup?term=" + term, HttpMethod.GET, new HttpEntity<>(headers), RadarrLookupResponse[].class).getBody();
    }

    public ResponseEntity<Object> add(int tmdbId, String title) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Api-Key", this.apiToken);

        MovieRequest request = new MovieRequest();
        request.setTmdbId(tmdbId);
        request.setTitle(title);
        request.setRootFolderPath(this.rootFolderPath);
        request.setMonitored(true);
        request.setQualityProfileId(this.qualityProfileId);
        request.setMinimumAvailability("released");
        request.setAddOptions(new AddOptionsRequest(true));

        return restTemplate.exchange(this.baseUrl + "/api/v3/movie/", HttpMethod.POST, new HttpEntity<>(request, headers), Object.class);
    }

}
