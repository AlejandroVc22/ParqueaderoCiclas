package com.cicloparqueadero.frontend.client;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

/**
 * Cliente HTTP que consume el microservicio parqueadero-service.
 */
@Component
@RequiredArgsConstructor
public class ParqueaderoApiClient {

    @Qualifier("parqueaderoClient")
    private final WebClient parqueaderoClient;

    public JsonNode list(String token, String estado, String search) {
        return parqueaderoClient.get()
                .uri(uri -> {
                    var b = uri.path("/bicicletas");
                    if (StringUtils.hasText(estado)) b.queryParam("estado", estado);
                    if (StringUtils.hasText(search)) b.queryParam("search", search);
                    return b.build();
                })
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public JsonNode getById(String token, Long id) {
        return parqueaderoClient.get().uri("/bicicletas/{id}", id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public JsonNode create(String token, Map<String, Object> body) {
        return parqueaderoClient.post().uri("/bicicletas")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public JsonNode update(String token, Long id, Map<String, Object> body) {
        return parqueaderoClient.put().uri("/bicicletas/{id}", id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public JsonNode delete(String token, Long id) {
        return parqueaderoClient.delete().uri("/bicicletas/{id}", id)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }

    public JsonNode stats(String token) {
        return parqueaderoClient.get().uri("/bicicletas/stats")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();
    }
}
