package com.cicloparqueadero.frontend.interceptor;

import com.cicloparqueadero.frontend.model.UserSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Set;

/**
 * Bloquea el acceso a las páginas protegidas si no hay sesión activa.
 * Las rutas públicas (login, register, css, js, health) están en {@code PUBLIC_URIS}.
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private static final Set<String> PUBLIC_URIS = Set.of(
            "/login", "/register", "/health", "/error", "/"
    );

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        String uri = request.getRequestURI();

        // Permitir recursos estáticos.
        if (uri.startsWith("/css") || uri.startsWith("/js") || uri.startsWith("/images")
                || uri.startsWith("/webjars") || uri.startsWith("/favicon")) {
            return true;
        }

        if (PUBLIC_URIS.contains(uri)) {
            return true;
        }

        HttpSession session = request.getSession(false);
        UserSession user = (session != null) ? (UserSession) session.getAttribute("user") : null;
        if (user == null || user.getToken() == null) {
            response.sendRedirect("/login");
            return false;
        }

        // Sólo ADMIN para /usuarios
        if (uri.startsWith("/usuarios") && !user.isAdmin()) {
            response.sendRedirect("/dashboard");
            return false;
        }

        return true;
    }
}
