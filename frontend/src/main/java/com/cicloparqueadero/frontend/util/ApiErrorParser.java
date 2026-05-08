package com.cicloparqueadero.frontend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.reactive.function.client.WebClientResponseException;

/**
 * Convierte excepciones de WebClient en mensajes amigables para mostrar en pantalla.
 */
public final class ApiErrorParser {

    private static final ObjectMapper mapper = new ObjectMapper();

    private ApiErrorParser() {}

    public static String extractMessage(WebClientResponseException ex, String defaultMsg) {
        String body = ex.getResponseBodyAsString();
        if (body == null || body.isBlank()) return defaultMsg;
        try {
            JsonNode root = mapper.readTree(body);
            if (root.has("message")) {
                return root.get("message").asText(defaultMsg);
            }
        } catch (Exception ignored) {
            // Si el body no es JSON, devolvemos el default.
        }
        return defaultMsg;
    }
}
