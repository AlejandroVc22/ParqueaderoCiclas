package com.cicloparqueadero.frontend.interceptor;

import com.cicloparqueadero.frontend.model.UserSession;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * Inyecta el usuario de la sesión a cada vista para mostrar el menú correcto.
 */
@ControllerAdvice
public class GlobalAttributesAdvice {

    @ModelAttribute("currentUser")
    public UserSession currentUser(HttpSession session) {
        Object u = session.getAttribute("user");
        return u instanceof UserSession ? (UserSession) u : null;
    }
}
