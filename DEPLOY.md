# 🚀 Guía de despliegue en Render (Spring Boot)

Esta guía despliega **Ciclo-Parqueadero** completo:

- **Render** → PostgreSQL + 3 servicios web Spring Boot (auth, parqueadero, frontend Thymeleaf).
- **Railway** (o Aiven / Clever Cloud) → MySQL gratuito (Render no lo ofrece).

---

## ✅ Paso 0 — Repositorio en GitHub

```bash
git add .
git commit -m "Migración a Spring Boot"
git push origin main
```

---

## ✅ Paso 1 — Aprovisionar MySQL en Railway (3 min)

1. https://railway.com/ → login con GitHub.
2. **New Project** → **Provision MySQL**.
3. Click sobre el servicio MySQL → pestaña **"Settings"** → **"Networking"** → **"Generate Domain"** (Public Networking).
4. Pestaña **"Variables"**: copia los valores de:

| Variable Railway | Para usar como |
|---|---|
| `RAILWAY_TCP_PROXY_DOMAIN` | `DB_HOST` (público) |
| `RAILWAY_TCP_PROXY_PORT`  | `DB_PORT` (público) |
| `MYSQL_DATABASE`          | `DB_NAME` |
| `MYSQL_USER` (suele ser `root`) | `DB_USER` |
| `MYSQL_ROOT_PASSWORD`     | `DB_PASSWORD` |

> ⚠️ **No uses `mysql.railway.internal`**, ese es el host privado y solo funciona dentro de Railway. Necesitas el dominio público que aparece tras activar Public Networking.

---

## ✅ Paso 2 — Render Blueprint

1. https://dashboard.render.com/ → login con GitHub.
2. **New +** → **Blueprint**.
3. Selecciona tu repo `ParqueaderoCiclas`.
4. Render leerá `render.yaml` automáticamente.
5. Pegará los campos `sync: false`:

| Servicio | Variable | Valor |
|---|---|---|
| `cp-parqueadero-service` | `DB_HOST` | el `RAILWAY_TCP_PROXY_DOMAIN` (ej: `mainline.proxy.rlwy.net`) |
| `cp-parqueadero-service` | `DB_PORT` | el `RAILWAY_TCP_PROXY_PORT` (ej: `47473`) |
| `cp-parqueadero-service` | `DB_NAME` | `railway` (o el `MYSQL_DATABASE`) |
| `cp-parqueadero-service` | `DB_USER` | `root` |
| `cp-parqueadero-service` | `DB_PASSWORD` | el `MYSQL_ROOT_PASSWORD` |
| `cp-frontend` | `AUTH_API_URL` | `https://cp-auth-service.onrender.com` (lo verás tras crearse) |
| `cp-frontend` | `PARQUEADERO_API_URL` | `https://cp-parqueadero-service.onrender.com` |

> 💡 **Tip**: las URLs del frontend pueden quedar pendientes; si no las sabes aún, pon valores temporales y al terminar el deploy, edítalas en `cp-frontend` → **Environment** con las URLs públicas reales.

6. Click en **"Apply"** o **"Deploy Blueprint"**.

⏳ **Tarda 8-15 minutos** (Maven compila los 3 proyectos Spring Boot).

---

## ✅ Paso 3 — Verificar

Cuando los 4 recursos estén "Live":

```bash
# Salud de cada servicio
curl https://cp-auth-service.onrender.com/health
curl https://cp-parqueadero-service.onrender.com/health
curl https://cp-frontend.onrender.com/health

# Login
curl -X POST https://cp-auth-service.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@cicloparqueadero.com","password":"Admin123!"}'
```

Abre la app en el navegador:

```
https://cp-frontend.onrender.com
```

Login con `admin@cicloparqueadero.com / Admin123!`.

> ⚠️ La 1ª petición tras inactividad tarda **40-60 seg** porque Render despierta los servicios free.

---

## 🛟 Solución de problemas

| Síntoma | Solución |
|---|---|
| `parqueadero-service` con `ENOTFOUND ...railway.internal` | Estás usando la URL **privada**. Activa Public Networking en Railway y usa `RAILWAY_TCP_PROXY_DOMAIN` + `RAILWAY_TCP_PROXY_PORT`. |
| `Token inválido` al consultar bicicletas | El `JWT_SECRET` debe ser **idéntico** entre `cp-auth-service` y `cp-parqueadero-service`. |
| Frontend no se conecta a backends | Edita `AUTH_API_URL` y `PARQUEADERO_API_URL` en `cp-frontend` → Environment con las URLs reales (`https://cp-auth-service.onrender.com`). |
| `cp-frontend` se "suspende" | Plan free de Render limita 1-2 web services activos. Reduce o sube de plan. |
| El servicio queda "suspended by its owner" | Click en él → **"Resume Service"** o haz un **Manual Sync** del Blueprint. |

---

## 🔄 Actualizaciones

Push a `main` redespliega automáticamente (porque `autoDeploy: true` está activo).

```bash
git add .
git commit -m "feat: nueva mejora"
git push
```

---

## 📍 URLs típicas finales

```
https://cp-frontend.onrender.com
https://cp-auth-service.onrender.com
https://cp-parqueadero-service.onrender.com
```
