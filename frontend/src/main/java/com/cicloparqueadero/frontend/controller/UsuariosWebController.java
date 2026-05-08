package com.cicloparqueadero.frontend.controller;

import com.cicloparqueadero.frontend.client.AuthApiClient;
import com.cicloparqueadero.frontend.model.UserSession;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuariosWebController {

    private final AuthApiClient authClient;

    @GetMapping
    public String list(HttpSession session, Model model) {
        UserSession user = (UserSession) session.getAttribute("user");
        List<UsuarioRow> users = new ArrayList<>();
        try {
            JsonNode resp = authClient.listUsers(user.getToken());
            JsonNode data = resp.path("data");
            for (JsonNode node : data) {
                users.add(UsuarioRow.from(node));
            }
        } catch (Exception ex) {
            model.addAttribute("error", "No se pudieron cargar los usuarios");
        }
        model.addAttribute("usuarios", users);
        return "usuarios";
    }

    @Data
    public static class UsuarioRow {
        private Long id;
        private String nombre;
        private String correo;
        private String rol;
        private LocalDateTime createdAt;

        public static UsuarioRow from(JsonNode node) {
            UsuarioRow u = new UsuarioRow();
            u.id = node.path("id").asLong();
            u.nombre = node.path("nombre").asText();
            u.correo = node.path("correo").asText();
            u.rol = node.path("rol").asText();
            String created = node.path("createdAt").asText(null);
            if (created != null && !created.isBlank()) {
                try { u.createdAt = LocalDateTime.parse(created); } catch (Exception ignored) {}
            }
            return u;
        }
    }
}
