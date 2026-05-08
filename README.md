# 🚲 Ciclo-Parqueadero (Spring Boot)

> **Sistema Full-Stack dockerizado de gestión de ciclo-parqueadero** con arquitectura de **microservicios en Spring Boot 3**, autenticación **JWT**, roles **ADMIN / USER**, **PostgreSQL + MySQL**, y un frontend **Spring Boot + Thymeleaf** estilo dashboard SaaS oscuro.

---

## 📌 Tabla de contenidos

1. [Características](#-características)
2. [Tecnologías](#-tecnologías)
3. [Arquitectura](#-arquitectura)
4. [Estructura del proyecto](#-estructura-del-proyecto)
5. [Requisitos previos](#-requisitos-previos)
6. [Instalación y ejecución con Docker](#-instalación-y-ejecución-con-docker-recomendado)
7. [Ejecución manual sin Docker](#-ejecución-manual-sin-docker)
8. [Credenciales por defecto](#-credenciales-por-defecto)
9. [Endpoints del API](#-endpoints-del-api)
10. [Pruebas](#-pruebas)
11. [Variables de entorno](#-variables-de-entorno)
12. [Despliegue en Render](#-despliegue-en-render)

---

## ✨ Características

- ✅ **Arquitectura en capas Spring**: `controller → service → repository → entity → dto`.
- ✅ **2 microservicios independientes** comunicados por JWT compartido:
  - `auth-service` → PostgreSQL → Spring Security + JJWT + Spring Data JPA.
  - `parqueadero-service` → MySQL → JJWT + Spring Data JPA.
- ✅ **JWT** firmado con HS256 (`io.jsonwebtoken:jjwt`) y contraseñas con `BCryptPasswordEncoder`.
- ✅ **Roles**: `ADMIN` (control total) y `USER` (solo consulta).
- ✅ **Frontend Spring Boot + Thymeleaf** con dashboard SaaS oscuro responsivo (sidebar, navbar, cards, tablas, modales).
- ✅ **Dockerfile multi-stage** por servicio (build con Maven → runtime JRE Alpine).
- ✅ **docker-compose.yml** que levanta toda la pila (5 contenedores) con un comando.
- ✅ **Validaciones** con `jakarta.validation`, manejo global de errores (`@RestControllerAdvice`) y CORS.
- ✅ **Admin sembrado automáticamente** al levantar el servicio Auth.
- ✅ **Listo para producción** y para desplegar en Render con el `render.yaml` incluido.

---

## 🛠️ Tecnologías

### Backend
- **Java 17 + Maven**
- **Spring Boot 3.3.4**: Web, Data JPA, Security, Validation, Actuator, WebFlux (en frontend)
- **Spring Security** + `BCryptPasswordEncoder`
- **JJWT 0.12.6** para firma y verificación de tokens
- **Hibernate / JPA**
- **PostgreSQL 16** (Auth)
- **MySQL 8** (Parqueadero)
- **Lombok** para reducir boilerplate

### Frontend
- **Spring Boot 3 + Thymeleaf** (server-side rendering)
- **WebClient** para consumir las APIs REST
- **CSS personalizado** (dashboard oscuro estilo SaaS)
- **HttpSession** para mantener el JWT del usuario logueado

### Infraestructura
- **Docker** + **docker-compose**
- **Maven** multi-stage builds
- **Eclipse Temurin 17 JRE Alpine** como runtime ligero

---

## 🏗️ Arquitectura

```
                   ┌──────────────────────────┐
                   │   Browser del usuario    │
                   └──────────────┬───────────┘
                                  │ HTTP
                   ┌──────────────▼──────────────┐
                   │  cp-frontend  (Spring Boot) │
                   │      Thymeleaf  :8080       │
                   └──────┬─────────────┬────────┘
              WebClient   │             │  WebClient
              + JWT       │             │  + JWT
            ┌─────────────▼┐         ┌──▼─────────────────┐
            │ cp-auth-svc  │         │ cp-parqueadero-svc │
            │ Spring Boot  │         │ Spring Boot        │
            │   :4001      │         │   :4002            │
            └──────┬───────┘         └──────┬─────────────┘
                   │ JPA                    │ JPA
            ┌──────▼─────┐            ┌─────▼──────┐
            │ PostgreSQL │            │   MySQL    │
            │   :5432    │            │   :3306    │
            └────────────┘            └────────────┘
```

Cada microservicio respeta **arquitectura en capas estándar de Spring**:

```
src/main/java/com/cicloparqueadero/<servicio>/
├── controller/        # @RestController (REST endpoints)
├── service/           # @Service (lógica de negocio)
├── repository/        # @Repository (Spring Data JPA)
├── entity/            # @Entity (modelos JPA)
├── dto/               # Data Transfer Objects
├── config/            # @Configuration (Security, CORS, Beans)
├── security/          # JwtUtil, JwtAuthFilter, AuthenticatedUser
├── exception/         # GlobalExceptionHandler + excepciones custom
└── <Servicio>Application.java
```

---

## 📁 Estructura del proyecto

```
Parqueadero/
├── auth-service/                   ← Microservicio Auth (Spring Boot + Postgres)
│   ├── src/main/java/com/cicloparqueadero/auth/
│   │   ├── controller/  AuthController, HealthController
│   │   ├── service/     AuthService
│   │   ├── repository/  UserRepository
│   │   ├── entity/      User
│   │   ├── dto/         RegisterRequest, LoginRequest, AuthResponse, UserDTO, ApiResponse
│   │   ├── security/    JwtUtil, JwtAuthFilter, AuthenticatedUser
│   │   ├── config/      SecurityConfig, AdminSeeder
│   │   ├── exception/   GlobalExceptionHandler + custom exceptions
│   │   └── AuthServiceApplication.java
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   ├── Dockerfile
│   └── .env.example
│
├── parqueadero-service/            ← Microservicio Parqueadero (Spring Boot + MySQL)
│   ├── src/main/java/com/cicloparqueadero/parqueadero/
│   │   ├── controller/  BicicletaController, HealthController
│   │   ├── service/     BicicletaService
│   │   ├── repository/  BicicletaRepository
│   │   ├── entity/      Bicicleta
│   │   ├── dto/         BicicletaRequest, BicicletaDTO, StatsDTO, ApiResponse
│   │   ├── security/    JwtUtil, JwtAuthFilter, AuthenticatedUser
│   │   ├── config/      SecurityConfig
│   │   ├── exception/   GlobalExceptionHandler
│   │   └── ParqueaderoServiceApplication.java
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                       ← Spring Boot + Thymeleaf
│   ├── src/main/java/com/cicloparqueadero/frontend/
│   │   ├── controller/   AuthWebController, DashboardController, BicicletaWebController, UsuariosWebController, HealthWebController
│   │   ├── client/       AuthApiClient, ParqueaderoApiClient (WebClient)
│   │   ├── model/        UserSession, BicicletaView, StatsView
│   │   ├── interceptor/  AuthInterceptor, GlobalAttributesAdvice
│   │   ├── config/       WebClientConfig, WebMvcConfig
│   │   ├── util/         ApiErrorParser
│   │   └── FrontendApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── templates/    login, register, dashboard, bicicletas/*, usuarios, error, fragments/layout
│   │   └── static/css/main.css
│   ├── pom.xml
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml
├── render.yaml                     ← Blueprint para despliegue
├── DEPLOY.md                       ← Guía de despliegue paso a paso
├── .env.example
├── .gitignore
└── README.md
```

---

## 📦 Requisitos previos

- **Docker Desktop** (Windows / macOS) o **Docker Engine + Docker Compose** (Linux).
- Puertos libres: `8080`, `4001`, `4002`, `5432`, `3306`.
- (Opcional para desarrollo manual) **Java 17** + **Maven 3.9+**.

---

## 🚀 Instalación y ejecución con Docker (recomendado)

### 1. Clonar el repo

```bash
git clone https://github.com/AlejandroVc22/ParqueaderoCiclas.git
cd ParqueaderoCiclas
```

### 2. (Opcional) Copiar variables de entorno

```bash
cp .env.example .env
```

Si no creas el `.env`, los valores por defecto del `docker-compose.yml` son funcionales.

### 3. Levantar todo

```bash
docker-compose up --build
```

> ⏱️ La primera vez tarda **5-10 minutos** porque descarga imágenes Maven, Postgres, MySQL y compila los 3 proyectos.

Esto va a:
1. Construir las 3 imágenes (auth, parqueadero, frontend) con multi-stage Maven.
2. Iniciar **PostgreSQL** y **MySQL** (con healthchecks).
3. Iniciar `auth-service` (puerto **4001**) y crear automáticamente el admin.
4. Iniciar `parqueadero-service` (puerto **4002**).
5. Iniciar el **frontend Spring Boot** en el puerto **8080**.

### 4. Abrir en el navegador

```
http://localhost:8080
```

### 5. Detener

```bash
docker-compose down            # detiene
docker-compose down -v         # detiene + borra las bases de datos
```

---

## 🧑‍💻 Ejecución manual sin Docker

### 1. Auth-service

```bash
cd auth-service
cp .env.example .env
mvn spring-boot:run
# http://localhost:4001
```

### 2. Parqueadero-service

```bash
cd parqueadero-service
cp .env.example .env
mvn spring-boot:run
# http://localhost:4002
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
mvn spring-boot:run
# http://localhost:8080
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
| GET    | `/actuator/health`     | ❌   | -        | Healthcheck Spring Actuator           |

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
| GET    | `/bicicletas/{id}`    | USER, ADMIN | Obtiene una bicicleta             |
| POST   | `/bicicletas`         | **ADMIN**   | Crea una bicicleta                |
| PUT    | `/bicicletas/{id}`    | **ADMIN**   | Actualiza una bicicleta           |
| DELETE | `/bicicletas/{id}`    | **ADMIN**   | Elimina una bicicleta             |
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

1. Abre `http://localhost:8080`.
2. Inicia sesión con las **credenciales por defecto** o regístrate.
3. Como **ADMIN** verás los módulos `Dashboard`, `Bicicletas` y `Usuarios`.
4. Como **USER**, solo verás `Dashboard` y `Bicicletas` (sin acciones de crear/editar/eliminar).
5. Crea, edita y elimina bicicletas. Las estadísticas del dashboard se actualizan automáticamente.

### Probar el API con curl

```bash
# 1. Login
curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@cicloparqueadero.com","password":"Admin123!"}'

# 2. Listar bicicletas (usa el token recibido)
curl http://localhost:4002/bicicletas \
  -H "Authorization: Bearer <TOKEN>"

# 3. Crear bicicleta
curl -X POST http://localhost:4002/bicicletas \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"propietario":"Carlos","documento":"123","tipo_bicicleta":"Urbana","color":"Azul"}'
```

---

## ⚙️ Variables de entorno

### Globales (raíz / `docker-compose`)
| Variable                    | Default                              |
|-----------------------------|--------------------------------------|
| `JWT_SECRET`                | `ciclo-parqueadero-super-secret-...` |
| `JWT_EXPIRATION_MS`         | `86400000` (24 h)                    |
| `POSTGRES_DB`               | `auth_db`                            |
| `POSTGRES_USER`             | `postgres`                           |
| `POSTGRES_PASSWORD`         | `postgres`                           |
| `MYSQL_DATABASE`            | `parqueadero_db`                     |
| `MYSQL_ROOT_PASSWORD`       | `root`                               |
| `ADMIN_EMAIL`               | `admin@cicloparqueadero.com`         |
| `ADMIN_PASSWORD`            | `Admin123!`                          |

Cada servicio tiene además su propio `.env.example` con valores específicos.

> ⚠️ Para que el frontend conecte con los backends en docker-compose, las variables `AUTH_API_URL` y `PARQUEADERO_API_URL` apuntan a los nombres de los servicios (`http://auth-service:4001` y `http://parqueadero-service:4002`). En desarrollo local apuntan a `localhost`.

---

## ☁️ Despliegue en Render

Lee la guía completa paso a paso en [**`DEPLOY.md`**](./DEPLOY.md).

Resumen:

1. **MySQL externo** (Render no ofrece MySQL): aprovisiona uno gratis en **Railway**, **Aiven** o **Clever Cloud** y activa el **Public Networking** para obtener `host` + `puerto` públicos.
2. **Render Blueprint**: en el dashboard, **New + → Blueprint** → conecta el repo → Render lee el `render.yaml`.
3. **Variables a llenar**: el Blueprint pedirá los datos del MySQL externo y las URLs públicas de los backends para el frontend.
4. **Apply** → ~10 minutos → **Live** ✅

---

## 📝 Licencia

Proyecto académico / educativo. Libre para usar, modificar y distribuir.

---

> Hecho con ❤️ usando **Spring Boot 3 + Java 17 + Thymeleaf** para el examen final de Full-Stack & Microservicios.
