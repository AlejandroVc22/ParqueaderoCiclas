package com.cicloparqueadero.frontend.client;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

/**
 * Cliente HTTP que consume el microservicio auth-service.
 * Reenvía el JWT al backend cuando se proporciona.
 */
@Component
@RequiredArgsConstructor
public class AuthApiClient {

    @Qualifier("authClient")
    private final WebClient authClient;

    public JsonNode register(Map<String, Object> body) {
        return authClient.post().uri("/auth/register")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public JsonNode login(Map<String, String> credentials) {
        return authClient.post().uri("/auth/login")
                .bodyValue(credentials)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public long usersCount(String token) {
        try {
            JsonNode resp = authClient.get().uri("/auth/users/count")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
            if (resp != null && resp.has("data")) {
                return resp.get("data").path("total").asLong(0);
            }
        } catch (WebClientResponseException ignored) {
            // Silencioso: si falla el conteo no rompemos el dashboard.
        }
        return 0L;
    }

    public JsonNode listUsers(String token) {
        return authClient.get().uri("/auth/users")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }
}
