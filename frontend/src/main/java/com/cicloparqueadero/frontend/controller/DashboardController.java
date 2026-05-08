package com.cicloparqueadero.frontend.controller;

import com.cicloparqueadero.frontend.client.AuthApiClient;
import com.cicloparqueadero.frontend.client.ParqueaderoApiClient;
import com.cicloparqueadero.frontend.model.BicicletaView;
import com.cicloparqueadero.frontend.model.StatsView;
import com.cicloparqueadero.frontend.model.UserSession;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final ParqueaderoApiClient parqueaderoClient;
    private final AuthApiClient authClient;
    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        UserSession user = (UserSession) session.getAttribute("user");
        String token = user.getToken();

        StatsView stats = StatsView.builder().total(0).parqueadas(0).retiradas(0).usuarios(0).build();
        List<BicicletaView> recientes = new ArrayList<>();

        try {
            JsonNode statsNode = parqueaderoClient.stats(token).path("data");
            stats.setTotal(statsNode.path("total").asLong());
            stats.setParqueadas(statsNode.path("parqueadas").asLong());
            stats.setRetiradas(statsNode.path("retiradas").asLong());
        } catch (Exception ex) {
            model.addAttribute("error", "No se pudieron cargar las estadísticas");
        }

        try {
            stats.setUsuarios(authClient.usersCount(token));
        } catch (Exception ignored) {
            // No es crítico para el dashboard.
        }

        try {
            JsonNode listNode = parqueaderoClient.list(token, null, null).path("data");
            int max = Math.min(5, listNode.size());
            for (int i = 0; i < max; i++) {
                recientes.add(mapper.convertValue(listNode.get(i), BicicletaView.class));
            }
        } catch (Exception ignored) {
            // Fallback a lista vacía.
        }

        model.addAttribute("stats", stats);
        model.addAttribute("recientes", recientes);
        return "dashboard";
    }
}
