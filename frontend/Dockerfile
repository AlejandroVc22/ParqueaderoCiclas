# Etapa 1: build de la aplicación
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servidor estático con nginx
FROM nginx:1.27-alpine

# Render expone el puerto vía $PORT; nginx escuchará ahí.
ENV PORT=80

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.d/40-runtime-env.sh

# Normaliza CRLF → LF (por si el archivo se editó en Windows) y da permisos.
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-runtime-env.sh \
    && chmod +x /docker-entrypoint.d/40-runtime-env.sh

EXPOSE 80

# La imagen de nginx ya provee un entrypoint que ejecuta los scripts en
# /docker-entrypoint.d/ y procesa las plantillas en /etc/nginx/templates/.
CMD ["nginx", "-g", "daemon off;"]
