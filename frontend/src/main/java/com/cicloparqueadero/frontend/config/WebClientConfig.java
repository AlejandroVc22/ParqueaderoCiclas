package com.cicloparqueadero.frontend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${app.api.auth-url}")
    private String authUrl;

    @Value("${app.api.parqueadero-url}")
    private String parqueaderoUrl;

    @Bean(name = "authClient")
    public WebClient authClient() {
        return WebClient.builder()
                .baseUrl(authUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Bean(name = "parqueaderoClient")
    public WebClient parqueaderoClient() {
        return WebClient.builder()
                .baseUrl(parqueaderoUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
