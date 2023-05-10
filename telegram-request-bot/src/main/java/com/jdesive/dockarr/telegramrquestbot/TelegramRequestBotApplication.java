package com.jdesive.dockarr.telegramrquestbot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableEurekaClient
@SpringBootApplication
public class TelegramRequestBotApplication {

    public static void main(String[] args) {
        SpringApplication.run(TelegramRequestBotApplication.class, args);
    }

}
