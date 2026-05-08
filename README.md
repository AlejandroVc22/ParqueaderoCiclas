# 🚲 Ciclo-Parqueadero

> **Sistema Full-Stack dockerizado de gestión de ciclo-parqueadero** con arquitectura de **microservicios**, autenticación **JWT**, roles **ADMIN / USER**, **PostgreSQL + MySQL**, y un panel web moderno estilo dashboard SaaS oscuro.

---

## 📌 Tabla de contenidos

1. [Características](#-características)
2. [Tecnologías](#-tecnologías)
3. [Arquitectura](#-arquitectura)
4. [Estructura del proyecto](#-estructura-del-proyecto)
5. [Requisitos previos](#-requisitos-previos)
6. [Instalación y ejecución con Docker](#-instalación-y-ejecución-con-docker-recomendado)
7. [Ejecución manual (sin Docker)](#-ejecución-manual-sin-docker)
8. [Credenciales por defecto](#-credenciales-por-defecto)
9. [Endpoints del API](#-endpoints-del-api)
10. [Pruebas](#-pruebas)
11. [Variables de entorno](#-variables-de-entorno)
12. [Despliegue en la nube](#-despliegue-en-la-nube-render--railway)
13. [Solución de problemas](#-solución-de-problemas)

---

## ✨ Características

- ✅ **Arquitectura en capas**: Controllers, Services, Repositories, Models, DTOs, Routes y Middleware.
- ✅ **2 microservicios independientes** comunicados por JWT compartido:
  - `auth-service` → PostgreSQL → registro, login, perfil, roles, gestión de usuarios.
  - `parqueadero-service` → MySQL → CRUD completo de bicicletas con estados.
- ✅ **JWT** firmado con `jsonwebtoken` y contraseñas con `bcryptjs`.
- ✅ **Roles**: `ADMIN` (control total: crear, editar y eliminar) y `USER` (solo consulta de bicicletas).
- ✅ **Frontend React + Vite** con dashboard SaaS oscuro, responsive y animaciones.
- ✅ **Dockerfile por servicio** + `docker-compose.yml` que levanta todo con un solo comando.
- ✅ **Validaciones** con `express-validator`, manejo global de errores y CORS.
- ✅ **Admin sembrado automáticamente** al levantar el servicio Auth.
- ✅ **Listo para producción** y para desplegar en Render / Railway.

---

## 🛠️ Tecnologías

### Backend
- Node.js 20 + Express
- Sequelize ORM
- JWT (`jsonwebtoken`)
- bcryptjs
- `express-validator` · `helmet` · `cors` · `morgan`
- PostgreSQL 16 (Auth)
- MySQL 8 (Parqueadero)

### Frontend
- React 18 + Vite 5
- React Router DOM 6
- Axios
- Context API
- React Icons + React Hot Toast
- CSS personalizado (dashboard oscuro)

### Infraestructura
- Docker + Docker Compose
- Nginx (sirve el frontend en producción)

---

## 🏗️ Arquitectura

```
                         ┌────────────────────┐
                         │      Browser       │
                         └─────────┬──────────┘
                                   │ HTTP
                         ┌─────────▼──────────┐
                         │  Frontend (Nginx)  │  :5173
                         │  React + Vite      │
                         └─────┬────────┬─────┘
                               │        │
                  Axios JWT    │        │   Axios JWT
                               │        │
                ┌──────────────▼──┐  ┌──▼─────────────────┐
                │  auth-service   │  │ parqueadero-service │
                │   :4001         │  │   :4002             │
                │ (Node/Express)  │  │ (Node/Express)      │
                └────────┬────────┘  └────────┬────────────┘
                         │ Sequelize          │ Sequelize
                ┌────────▼────────┐  ┌────────▼────────┐
                │   PostgreSQL    │  │     MySQL       │
                │     :5432       │  │     :3306       │
                └─────────────────┘  └─────────────────┘
```

Cada microservicio respeta **arquitectura en capas**:

```
src/
├── config/         # Conexión a DB
├── models/         # Modelos Sequelize
├── repositories/   # Acceso a datos
├── services/       # Lógica de negocio
├── controllers/    # Entrada/salida HTTP
├── dtos/           # Data Transfer Objects
├── routes/         # Definición de endpoints
├── middleware/     # auth, validación, errores
├── utils/          # JWT, bcrypt, helpers
├── app.js          # Configuración de Express
└── server.js       # Bootstrap del servidor
```

---

## 📁 Estructura del proyecto

```
Parqueadero/
├── auth-service/                # Microservicio de autenticación (PostgreSQL)
│   ├── src/
│   │   ├── config/database.js
│   │   ├── controllers/auth.controller.js
│   │   ├── dtos/user.dto.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/user.model.js
│   │   ├── repositories/user.repository.js
│   │   ├── routes/auth.routes.js
│   │   ├── seed/admin.seed.js
│   │   ├── services/auth.service.js
│   │   ├── utils/{jwt.util.js,password.util.js}
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── parqueadero-service/         # Microservicio del parqueadero (MySQL)
│   ├── src/
│   │   ├── config/database.js
│   │   ├── controllers/bicicleta.controller.js
│   │   ├── dtos/bicicleta.dto.js
│   │   ├── middleware/
│   │   ├── models/bicicleta.model.js
│   │   ├── repositories/bicicleta.repository.js
│   │   ├── routes/bicicleta.routes.js
│   │   ├── services/bicicleta.service.js
│   │   ├── app.js
│   │   └── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/                    # React + Vite + Nginx
│   ├── src/
│   │   ├── api/                 # Clientes Axios
│   │   ├── components/          # Layout y UI reutilizable
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/               # Login, Register, Dashboard, Bicicletas, Usuarios
│   │   ├── styles/globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── index.html
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 📦 Requisitos previos

- **Docker Desktop** (Windows / macOS) o **Docker Engine + Docker Compose** (Linux).
- Puertos libres: `5173`, `4001`, `4002`, `5432`, `3306`.
- (Opcional para desarrollo manual) Node.js **20+**.

---

## 🚀 Instalación y ejecución con Docker (recomendado)

### 1. Clonar / descargar el proyecto

```bash
cd Parqueadero
```

### 2. (Opcional) Copiar el archivo de variables

```bash
cp .env.example .env
```

> Si no creas el `.env`, el `docker-compose.yml` usará valores por defecto, que ya son funcionales.

### 3. Levantar todo el stack

```bash
docker-compose up --build
```

Esto va a:

1. Construir la imagen de cada microservicio y del frontend.
2. Iniciar **PostgreSQL** y **MySQL** (con healthchecks).
3. Iniciar `auth-service` (puerto **4001**) y crear automáticamente el admin.
4. Iniciar `parqueadero-service` (puerto **4002**).
5. Iniciar el **frontend** servido por Nginx en el puerto **5173**.

### 4. Abrir en el navegador

```
http://localhost:5173
```

### 5. Detener el stack

```bash
docker-compose down
```

Para borrar también los datos de las bases de datos:

```bash
docker-compose down -v
```

---

## 🧑‍💻 Ejecución manual (sin Docker)

> Útil si quieres desarrollar con `nodemon`. Necesitarás PostgreSQL y MySQL instalados localmente.

### 1. Auth-service

```bash
cd auth-service
cp .env.example .env  # ajusta credenciales
npm install
npm run dev           # http://localhost:4001
```

### 2. Parqueadero-service

```bash
cd parqueadero-service
cp .env.example .env
npm install
npm run dev           # http://localhost:4002
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev           # http://localhost:5173
```

---

## 🔑 Credenciales por defecto

Al iniciar el `auth-service` se crea automáticamente un administrador:

| Campo      | Valor                              |
|------------|------------------------------------|
| Correo     | `admin@cicloparqueadero.com`       |
| Contraseña | `Admin123!`                        |
| Rol        | `ADMIN`                            |

Puedes registrar usuarios con rol `USER` desde la pantalla de **Registro**.

---

## 📡 Endpoints del API

### Auth-service (`http://localhost:4001`)

| Método | Endpoint               | Auth | Rol      | Descripción                          |
|--------|------------------------|------|----------|--------------------------------------|
| POST   | `/auth/register`       | ❌   | -        | Crea un usuario (rol por defecto USER) |
| POST   | `/auth/login`          | ❌   | -        | Inicia sesión y devuelve JWT          |
| GET    | `/auth/profile`        | ✅   | Cualquiera| Datos del usuario autenticado         |
| GET    | `/auth/users/count`    | ✅   | Cualquiera| Total de usuarios registrados         |
| GET    | `/auth/users`          | ✅   | ADMIN    | Lista todos los usuarios              |
| GET    | `/auth/validate`       | ✅   | Cualquiera| Valida un JWT                         |
| GET    | `/health`              | ❌   | -        | Healthcheck                           |

#### Body de ejemplo: `POST /auth/register`
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@correo.com",
  "password": "secret123",
  "rol": "USER"
}
```

#### Body de ejemplo: `POST /auth/login`
```json
{
  "correo": "admin@cicloparqueadero.com",
  "password": "Admin123!"
}
```

---

### Parqueadero-service (`http://localhost:4002`)

> Todas las rutas requieren `Authorization: Bearer <jwt>`.

| Método | Endpoint              | Rol         | Descripción                       |
|--------|-----------------------|-------------|-----------------------------------|
| GET    | `/bicicletas`         | USER, ADMIN | Lista bicicletas (filtros: `estado`, `search`) |
| GET    | `/bicicletas/stats`   | USER, ADMIN | Totales por estado                |
| GET    | `/bicicletas/:id`     | USER, ADMIN | Obtiene una bicicleta             |
| POST   | `/bicicletas`         | **ADMIN**   | Crea una bicicleta                |
| PUT    | `/bicicletas/:id`     | **ADMIN**   | Actualiza una bicicleta           |
| DELETE | `/bicicletas/:id`     | **ADMIN**   | Elimina una bicicleta             |
| GET    | `/health`             | -           | Healthcheck                       |

#### Body de ejemplo: `POST /bicicletas`
```json
{
  "propietario": "Ana López",
  "documento": "1023456789",
  "tipo_bicicleta": "Montaña",
  "color": "Rojo",
  "estado": "PARQUEADA",
  "observaciones": "Casco entregado en recepción"
}
```

---

## 🧪 Pruebas

### Probar desde el navegador

1. Abre `http://localhost:5173`.
2. Inicia sesión con las **credenciales por defecto** o regístrate.
3. Como **ADMIN** verás los módulos `Dashboard`, `Bicicletas` y `Usuarios`.
4. Como **USER**, solo verás `Dashboard` y `Bicicletas` (sin acciones de editar/eliminar).
5. Crea, edita y elimina bicicletas. Las estadísticas del dashboard se actualizan en tiempo real.

### Probar el API con curl

```bash
# 1. Login
curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@cicloparqueadero.com","password":"Admin123!"}'

# 2. Listar bicicletas (usa el token recibido arriba)
curl http://localhost:4002/bicicletas \
  -H "Authorization: Bearer <TOKEN>"

# 3. Crear bicicleta
curl -X POST http://localhost:4002/bicicletas \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"propietario":"Carlos","documento":"123","tipo_bicicleta":"Urbana","color":"Azul"}'
```

### Probar con Postman / Insomnia

Importa la URL base de cada servicio y usa el token del login en el header:

```
Authorization: Bearer <jwt-recibido>
```

---

## ⚙️ Variables de entorno

### Globales (raíz / `docker-compose`)
| Variable                    | Default                              |
|-----------------------------|--------------------------------------|
| `JWT_SECRET`                | `ciclo-parqueadero-super-secret-key…`|
| `JWT_EXPIRES_IN`            | `24h`                                |
| `POSTGRES_DB`               | `auth_db`                            |
| `POSTGRES_USER`             | `postgres`                           |
| `POSTGRES_PASSWORD`         | `postgres`                           |
| `MYSQL_DATABASE`            | `parqueadero_db`                     |
| `MYSQL_ROOT_PASSWORD`       | `root`                               |
| `ADMIN_EMAIL`               | `admin@cicloparqueadero.com`         |
| `ADMIN_PASSWORD`            | `Admin123!`                          |
| `VITE_AUTH_API_URL`         | `http://localhost:4001`              |
| `VITE_PARQUEADERO_API_URL`  | `http://localhost:4002`              |

### Auth-service
Ver [`auth-service/.env.example`](./auth-service/.env.example).

### Parqueadero-service
Ver [`parqueadero-service/.env.example`](./parqueadero-service/.env.example).

### Frontend
Ver [`frontend/.env.example`](./frontend/.env.example).
> ⚠️ Las variables `VITE_*` se consumen **en build time** del frontend. Si cambias las URLs, vuelve a construir la imagen.

---

## ☁️ Despliegue en la nube (Render / Railway)

El proyecto está listo para desplegarse en cualquier proveedor que soporte Dockerfiles.

### Opción A — Railway (recomendado, todo en un mismo proyecto)

1. Crea un proyecto nuevo en **Railway**.
2. Añade un servicio **PostgreSQL** y otro **MySQL** desde el catálogo (Railway entrega `DATABASE_URL`, host, puerto, usuario y password).
3. Crea **3 servicios** desde el repositorio (apuntando a cada Dockerfile):
   - `auth-service` → carpeta `auth-service`.
   - `parqueadero-service` → carpeta `parqueadero-service`.
   - `frontend` → carpeta `frontend`.
4. Configura las variables de entorno de cada servicio con los datos de las bases de Railway:
   - `auth-service`: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_*`.
   - `parqueadero-service`: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` (idéntico).
   - `frontend`: build args `VITE_AUTH_API_URL` y `VITE_PARQUEADERO_API_URL` apuntando a las URLs públicas de los microservicios.
5. Genera dominios públicos para los 3 servicios y vuelve a construir el frontend con esas URLs.

### Opción B — Render

1. Crea **PostgreSQL** y **MySQL** (el plan gratis de Render no incluye MySQL, puedes usar [PlanetScale](https://planetscale.com) o [Aiven](https://aiven.io)).
2. Crea **3 Web Services** tipo Docker, uno por carpeta.
3. Repite las variables de entorno como en Railway.
4. Para el frontend, en *Build Command* deja vacío (lo hace el Dockerfile) y configura las build args `VITE_*`.

### Notas de producción

- Cambia `JWT_SECRET` por uno fuerte (mínimo 64 caracteres aleatorios).
- Cambia `ADMIN_PASSWORD` después del primer login.
- Activa HTTPS en el dominio público.
- Cierra los puertos `5432` y `3306` al exterior (mantenlos solo en la red privada del proveedor).

---

## 🛟 Solución de problemas

| Problema | Solución |
|----------|----------|
| `auth-service` no conecta a Postgres | Espera ~30 s en el primer arranque o ejecuta `docker-compose up postgres` antes. El servicio reintenta 10 veces. |
| `parqueadero-service` no conecta a MySQL | MySQL 8 tarda 30-60 s la primera vez. El servicio reintenta 15 veces; si persiste, revisa `docker logs cp_mysql`. |
| Token inválido | Asegúrate de que **ambos microservicios** tienen el **mismo `JWT_SECRET`**. |
| CORS bloqueado | Ambos servicios ya permiten `*`. Si modificas, ajusta `cors({ origin })` en `app.js`. |
| Frontend muestra `Network Error` | Revisa que las variables `VITE_AUTH_API_URL` y `VITE_PARQUEADERO_API_URL` apunten a URLs accesibles desde el navegador. |
| Cambié variables `VITE_*` y no aplican | Reconstruye el frontend: `docker-compose up --build frontend`. |
| Quiero borrar la base de datos | `docker-compose down -v` |

---

## 📝 Licencia

Proyecto académico / educativo. Libre para usar, modificar y distribuir.

---

> Hecho con ❤️ para el examen final de Full-Stack & Microservicios.
