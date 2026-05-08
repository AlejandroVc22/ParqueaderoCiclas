# 🚀 Guía de despliegue en Render

Este documento te guía **paso a paso** para desplegar **Ciclo-Parqueadero** completo en producción usando:

- **Render** → PostgreSQL + 3 servicios web (auth, parqueadero, frontend).
- **Railway** (o Aiven / Clever Cloud) → MySQL gratuito.

> ⚠️ **Por qué un MySQL externo:** Render solo ofrece PostgreSQL. Como tu examen exige MySQL + PostgreSQL, mantenemos MySQL en otro proveedor que sí lo ofrece gratis.

---

## 📋 Resumen de lo que vas a desplegar

| Servicio                | Plataforma | Plan         | Tipo            |
|-------------------------|------------|--------------|-----------------|
| `cp-postgres`           | Render     | Free         | PostgreSQL DB   |
| `cp-mysql`              | Railway    | Free         | MySQL DB        |
| `cp-auth-service`       | Render     | Free         | Web (Docker)    |
| `cp-parqueadero-service`| Render     | Free         | Web (Docker)    |
| `cp-frontend`           | Render     | Free         | Web (Docker)    |

---

## ✅ Paso 0 — Subir el proyecto a GitHub

Render despliega desde un repo Git, así que primero necesitas el código en GitHub.

```bash
cd Parqueadero
git init
git add .
git commit -m "Ciclo-Parqueadero: deploy initial"
git branch -M main
```

Crea un repo nuevo en https://github.com/new (vacío, sin README) y sube tu código:

```bash
git remote add origin https://github.com/TU_USUARIO/ciclo-parqueadero.git
git push -u origin main
```

---

## ✅ Paso 1 — Aprovisionar MySQL en Railway (3 min)

1. Entra a **https://railway.com/** y entra con GitHub.
2. Click en **"New Project"** → **"Provision MySQL"**.
3. Espera ~30 s a que arranque.
4. Click en el servicio MySQL → pestaña **"Variables"**. Verás:

   ```
   MYSQL_DATABASE     = railway
   MYSQL_HOST         = containers-us-west-XXX.railway.app
   MYSQL_PORT         = 7XXX
   MYSQL_ROOT_PASSWORD = XXXXXXXXXXXX
   MYSQL_USER         = root
   ```

5. **Apunta esos 5 valores**, los necesitarás en el siguiente paso.
6. Opcional pero recomendado: cambia el nombre de la base a `parqueadero_db` ejecutando esto desde la pestaña **"Data"**:

   ```sql
   CREATE DATABASE IF NOT EXISTS parqueadero_db;
   ```

   Si no, deja `MYSQL_DATABASE=railway` y luego úsalo en `DB_NAME`.

> 💡 **Alternativas a Railway:**
> - [Aiven](https://aiven.io) → 1 mes free trial (requiere tarjeta).
> - [Clever Cloud](https://clever-cloud.com) → plan DEV gratis 10 MB sin tarjeta.

---

## ✅ Paso 2 — Desplegar todo en Render con un solo click

### Opción A: usando el Blueprint (recomendado)

1. Entra a **https://dashboard.render.com/** y entra con GitHub.
2. Click **"New +"** → **"Blueprint"**.
3. Elige el repo `ciclo-parqueadero`.
4. Render detectará automáticamente el archivo `render.yaml`.
5. Click **"Apply"**.

Render te pedirá rellenar las variables marcadas como `sync: false` (los datos del MySQL externo). Pégalos en este orden:

| Variable                       | Valor                                          |
|--------------------------------|------------------------------------------------|
| `cp-parqueadero-service.DB_HOST`     | `MYSQL_HOST` de Railway (ej: `containers-us-west-XXX.railway.app`) |
| `cp-parqueadero-service.DB_PORT`     | `MYSQL_PORT` de Railway (ej: `7XXX`)           |
| `cp-parqueadero-service.DB_NAME`     | `parqueadero_db` o el `MYSQL_DATABASE` de Railway |
| `cp-parqueadero-service.DB_USER`     | `root`                                         |
| `cp-parqueadero-service.DB_PASSWORD` | `MYSQL_ROOT_PASSWORD` de Railway               |

Click **"Apply"** y Render comenzará a construir todo. **Tarda entre 5 y 12 minutos** la primera vez.

### Opción B: manual (servicio por servicio)

Si prefieres no usar el Blueprint, crea cada uno desde el dashboard:

#### B.1 PostgreSQL
- **New +** → **PostgreSQL** → Name: `cp-postgres`, Plan: `Free` → Create.
- Copia los **valores internos** (Internal Database URL).

#### B.2 auth-service
- **New +** → **Web Service** → conecta el repo.
- Configura:
  - **Name:** `cp-auth-service`
  - **Root Directory:** `auth-service`
  - **Runtime:** `Docker`
  - **Plan:** Free
- En **Environment** añade:

  ```
  NODE_ENV=production
  PORT=4001
  DB_HOST=<host interno de cp-postgres>
  DB_PORT=5432
  DB_NAME=<database de cp-postgres>
  DB_USER=<user de cp-postgres>
  DB_PASSWORD=<password de cp-postgres>
  JWT_SECRET=<una cadena larga aleatoria, mínimo 32 chars>
  JWT_EXPIRES_IN=24h
  ADMIN_NAME=Administrador
  ADMIN_EMAIL=admin@cicloparqueadero.com
  ADMIN_PASSWORD=Admin123!
  ```
- **Health Check Path:** `/health`
- Crea el servicio. Al terminar, **copia su URL pública** (ej: `https://cp-auth-service.onrender.com`).

#### B.3 parqueadero-service
- **New +** → **Web Service** → mismo repo.
- Configura:
  - **Name:** `cp-parqueadero-service`
  - **Root Directory:** `parqueadero-service`
  - **Runtime:** `Docker`
  - **Plan:** Free
- En **Environment**:

  ```
  NODE_ENV=production
  PORT=4002
  DB_HOST=<MYSQL_HOST de Railway>
  DB_PORT=<MYSQL_PORT de Railway>
  DB_NAME=parqueadero_db
  DB_USER=root
  DB_PASSWORD=<MYSQL_ROOT_PASSWORD de Railway>
  JWT_SECRET=<EXACTAMENTE el mismo de cp-auth-service>
  ```
- **Health Check Path:** `/health`
- Crea el servicio y **copia su URL pública**.

#### B.4 frontend
- **New +** → **Web Service** → mismo repo.
- Configura:
  - **Name:** `cp-frontend`
  - **Root Directory:** `frontend`
  - **Runtime:** `Docker`
  - **Plan:** Free
- En **Environment**:

  ```
  AUTH_API_URL=https://cp-auth-service.onrender.com
  PARQUEADERO_API_URL=https://cp-parqueadero-service.onrender.com
  ```
- Crea el servicio.

---

## ✅ Paso 3 — Verificar que todo funciona

Cuando Render termine el deploy, abre cada URL y prueba:

```bash
# 1. Salud del auth
curl https://cp-auth-service.onrender.com/health

# 2. Salud del parqueadero
curl https://cp-parqueadero-service.onrender.com/health

# 3. Login del admin
curl -X POST https://cp-auth-service.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@cicloparqueadero.com","password":"Admin123!"}'
```

Luego abre la app en tu navegador:

```
https://cp-frontend.onrender.com
```

Inicia sesión con:
- **Correo:** `admin@cicloparqueadero.com`
- **Contraseña:** `Admin123!`

---

## 🛡️ Recomendaciones de producción

1. **Cambia `ADMIN_PASSWORD`** después del primer login.
2. **Genera un `JWT_SECRET` fuerte** (mínimo 64 caracteres aleatorios). Si usaste el Blueprint, Render ya generó uno.
3. Render **duerme** los servicios free después de 15 min sin tráfico → la primera petición tras un periodo inactivo tarda ~30 s en responder. Es normal.
4. Para evitar la suspensión: actualiza al plan **Starter** ($7/mes por servicio) o configura un cron/ping cada 10 min usando https://uptimerobot.com.

---

## 🛟 Solución de problemas

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| Frontend muestra `Network Error` o 401 | Las URLs `AUTH_API_URL` / `PARQUEADERO_API_URL` no apuntan a las URLs públicas correctas | Revisa las env vars del frontend en Render → Settings → Environment. Render redeploya solo. |
| `Token inválido` al iniciar sesión | `JWT_SECRET` distinto entre auth-service y parqueadero-service | En Render, copia el JWT_SECRET de `cp-auth-service` y pégalo idéntico en `cp-parqueadero-service` |
| `parqueadero-service` no conecta a MySQL | Datos de Railway incorrectos | Verifica `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` desde la pestaña Variables de Railway |
| `auth-service` no arranca | Postgres aún no estaba listo | Reinicia el servicio (botón "Manual Deploy" → "Clear cache & deploy") |
| Cambié `AUTH_API_URL` y el frontend sigue usando la vieja | Caché del navegador | `Ctrl + F5` o abrir en ventana de incógnito. El archivo `env.js` tiene `Cache-Control: no-store`. |
| CORS bloqueado | Algún navegador estricto | Ambos backends ya permiten `*`. Si lo restringiste, ajusta `cors({ origin: 'https://cp-frontend.onrender.com' })` |

---

## 🔄 Actualizaciones posteriores

Cualquier cambio que hagas en `main` se desplegará automáticamente porque `autoDeploy: true` está activo.

```bash
git add .
git commit -m "feat: nueva mejora"
git push
```

Render detecta el push y reconstruye los servicios afectados.

---

## 📍 URLs típicas finales

```
Frontend         → https://cp-frontend.onrender.com
Auth API         → https://cp-auth-service.onrender.com
Parqueadero API  → https://cp-parqueadero-service.onrender.com
PostgreSQL       → (interno, accesible solo desde otros servicios de Render)
MySQL            → containers-us-west-XXX.railway.app:7XXX (Railway)
```

---

> ¡Listo! Tu sistema está en producción y accesible desde cualquier parte del mundo. 🌐
