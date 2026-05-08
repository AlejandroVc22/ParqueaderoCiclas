package com.cicloparqueadero.frontend.controller;

import com.cicloparqueadero.frontend.client.AuthApiClient;
import com.cicloparqueadero.frontend.model.UserSession;
import com.cicloparqueadero.frontend.util.ApiErrorParser;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class AuthWebController {

    private final AuthApiClient authClient;

    @GetMapping("/")
    public String index(HttpSession session) {
        Object user = session.getAttribute("user");
        return user != null ? "redirect:/dashboard" : "redirect:/login";
    }

    @GetMapping("/login")
    public String loginForm(HttpSession session) {
        if (session.getAttribute("user") != null) {
            return "redirect:/dashboard";
        }
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String correo,
                        @RequestParam String password,
                        HttpSession session,
                        RedirectAttributes redirect) {
        try {
            JsonNode resp = authClient.login(Map.of("correo", correo, "password", password));
            JsonNode data = resp.path("data");
            JsonNode userNode = data.path("user");

            UserSession u = UserSession.builder()
                    .id(userNode.path("id").asLong())
                    .nombre(userNode.path("nombre").asText())
                    .correo(userNode.path("correo").asText())
                    .rol(userNode.path("rol").asText("USER"))
                    .token(data.path("token").asText())
                    .build();

            session.setAttribute("user", u);
            redirect.addFlashAttribute("success", "Sesión iniciada correctamente");
            return "redirect:/dashboard";
        } catch (WebClientResponseException ex) {
            redirect.addFlashAttribute("error",
                    ApiErrorParser.extractMessage(ex, "Credenciales inválidas"));
            return "redirect:/login";
        } catch (Exception ex) {
            redirect.addFlashAttribute("error",
                    "No se pudo conectar al servicio de autenticación");
            return "redirect:/login";
        }
    }

    @GetMapping("/register")
    public String registerForm(HttpSession session) {
        if (session.getAttribute("user") != null) {
            return "redirect:/dashboard";
        }
        return "register";
    }

    @PostMapping("/register")
    public String register(@RequestParam String nombre,
                           @RequestParam String correo,
                           @RequestParam String password,
                           @RequestParam String confirm,
                           HttpSession session,
                           RedirectAttributes redirect) {
        if (!password.equals(confirm)) {
            redirect.addFlashAttribute("error", "Las contraseñas no coinciden");
            return "redirect:/register";
        }
        if (password.length() < 6) {
            redirect.addFlashAttribute("error", "La contraseña debe tener al menos 6 caracteres");
            return "redirect:/register";
        }
        try {
            JsonNode resp = authClient.register(Map.of(
                    "nombre", nombre,
                    "correo", correo,
                    "password", password,
                    "rol", "USER"
            ));
            JsonNode data = resp.path("data");
            JsonNode userNode = data.path("user");
            UserSession u = UserSession.builder()
                    .id(userNode.path("id").asLong())
                    .nombre(userNode.path("nombre").asText())
                    .correo(userNode.path("correo").asText())
                    .rol(userNode.path("rol").asText("USER"))
                    .token(data.path("token").asText())
                    .build();
            session.setAttribute("user", u);
            redirect.addFlashAttribute("success", "Cuenta creada exitosamente");
            return "redirect:/dashboard";
        } catch (WebClientResponseException ex) {
            redirect.addFlashAttribute("error",
                    ApiErrorParser.extractMessage(ex, "No se pudo registrar"));
            return "redirect:/register";
        } catch (Exception ex) {
            redirect.addFlashAttribute("error", "Error de conexión con el servidor");
            return "redirect:/register";
        }
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
