package com.cicloparqueadero.frontend.controller;

import com.cicloparqueadero.frontend.client.ParqueaderoApiClient;
import com.cicloparqueadero.frontend.model.BicicletaView;
import com.cicloparqueadero.frontend.model.UserSession;
import com.cicloparqueadero.frontend.util.ApiErrorParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/bicicletas")
@RequiredArgsConstructor
public class BicicletaWebController {

    private final ParqueaderoApiClient client;
    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping
    public String list(@RequestParam(required = false) String estado,
                       @RequestParam(required = false) String search,
                       HttpSession session,
                       Model model) {
        UserSession user = (UserSession) session.getAttribute("user");
        List<BicicletaView> bicicletas = new ArrayList<>();
        try {
            JsonNode data = client.list(user.getToken(), estado, search).path("data");
            for (JsonNode node : data) {
                bicicletas.add(mapper.convertValue(node, BicicletaView.class));
            }
        } catch (WebClientResponseException ex) {
            model.addAttribute("error",
                    ApiErrorParser.extractMessage(ex, "No se pudieron cargar las bicicletas"));
        } catch (Exception ex) {
            model.addAttribute("error", "Error de conexión con el servicio de parqueadero");
        }

        model.addAttribute("bicicletas", bicicletas);
        model.addAttribute("estado", estado);
        model.addAttribute("search", search);
        return "bicicletas/list";
    }

    @GetMapping("/nueva")
    public String createForm(HttpSession session, RedirectAttributes redirect, Model model) {
        if (!isAdmin(session)) {
            redirect.addFlashAttribute("error", "Solo los administradores pueden registrar bicicletas");
            return "redirect:/bicicletas";
        }
        model.addAttribute("bicicleta", new BicicletaView());
        model.addAttribute("editing", false);
        return "bicicletas/form";
    }

    @PostMapping("/nueva")
    public String create(@RequestParam String propietario,
                         @RequestParam String documento,
                         @RequestParam("tipo_bicicleta") String tipoBicicleta,
                         @RequestParam String color,
                         @RequestParam(defaultValue = "PARQUEADA") String estado,
                         @RequestParam(required = false) String observaciones,
                         HttpSession session,
                         RedirectAttributes redirect) {
        if (!isAdmin(session)) {
            redirect.addFlashAttribute("error", "Solo los administradores pueden registrar bicicletas");
            return "redirect:/bicicletas";
        }
        UserSession user = (UserSession) session.getAttribute("user");
        Map<String, Object> body = new HashMap<>();
        body.put("propietario", propietario);
        body.put("documento", documento);
        body.put("tipo_bicicleta", tipoBicicleta);
        body.put("color", color);
        body.put("estado", estado);
        body.put("observaciones", observaciones);
        try {
            client.create(user.getToken(), body);
            redirect.addFlashAttribute("success", "Bicicleta registrada exitosamente");
        } catch (WebClientResponseException ex) {
            redirect.addFlashAttribute("error",
                    ApiErrorParser.extractMessage(ex, "No se pudo crear la bicicleta"));
        }
        return "redirect:/bicicletas";
    }

    @GetMapping("/{id}/editar")
    public String editForm(@PathVariable Long id, HttpSession session,
                           RedirectAttributes redirect, Model model) {
        if (!isAdmin(session)) {
            redirect.addFlashAttribute("error", "Solo los administradores pueden editar bicicletas");
            return "redirect:/bicicletas";
        }
        UserSession user = (UserSession) session.getAttribute("user");
        try {
            JsonNode node = client.getById(user.getToken(), id).path("data");
            BicicletaView bici = mapper.convertValue(node, BicicletaView.class);
            model.addAttribute("bicicleta", bici);
            model.addAttribute("editing", true);
            return "bicicletas/form";
        } catch (Exception ex) {
            redirect.addFlashAttribute("error", "No se pudo cargar la bicicleta");
            return "redirect:/bicicletas";
        }
    }

    @PostMapping("/{id}/editar")
    public String update(@PathVariable Long id,
                         @RequestParam String propietario,
                         @RequestParam String documento,
                         @RequestParam("tipo_bicicleta") String tipoBicicleta,
                         @RequestParam String color,
                         @RequestParam String estado,
                         @RequestParam(required = false) String observaciones,
                         HttpSession session,
                         RedirectAttributes redirect) {
        if (!isAdmin(session)) {
            redirect.addFlashAttribute("error", "Solo los administradores pueden editar bicicletas");
            return "redirect:/bicicletas";
        }
        UserSession user = (UserSession) session.getAttribute("user");
        Map<String, Object> body = new HashMap<>();
        body.put("propietario", propietario);
        body.put("documento", documento);
        body.put("tipo_bicicleta", tipoBicicleta);
        body.put("color", color);
        body.put("estado", estado);
        body.put("observaciones", observaciones);
        try {
            client.update(user.getToken(), id, body);
            redirect.addFlashAttribute("success", "Bicicleta actualizada correctamente");
        } catch (WebClientResponseException ex) {
            redirect.addFlashAttribute("error",
                    ApiErrorParser.extractMessage(ex, "No se pudo actualizar la bicicleta"));
        }
        return "redirect:/bicicletas";
    }

    @PostMapping("/{id}/eliminar")
    public String delete(@PathVariable Long id, HttpSession session, RedirectAttributes redirect) {
        if (!isAdmin(session)) {
            redirect.addFlashAttribute("error", "Solo los administradores pueden eliminar bicicletas");
            return "redirect:/bicicletas";
        }
        UserSession user = (UserSession) session.getAttribute("user");
        try {
            client.delete(user.getToken(), id);
            redirect.addFlashAttribute("success", "Bicicleta eliminada correctamente");
        } catch (WebClientResponseException ex) {
            redirect.addFlashAttribute("error",
                    ApiErrorParser.extractMessage(ex, "No se pudo eliminar la bicicleta"));
        }
        return "redirect:/bicicletas";
    }

    private boolean isAdmin(HttpSession session) {
        UserSession user = (UserSession) session.getAttribute("user");
        return user != null && user.isAdmin();
    }
}
