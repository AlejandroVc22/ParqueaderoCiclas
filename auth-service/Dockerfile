# ============================================
# Stage 1: build con Maven
# ============================================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Cachear dependencias primero para acelerar builds posteriores.
COPY pom.xml ./
RUN mvn -B -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

# ============================================
# Stage 2: runtime ligero
# ============================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar solo el jar fat compilado.
COPY --from=build /app/target/auth-service.jar app.jar

ENV JAVA_OPTS="-Xms128m -Xmx512m"
ENV PORT=4001
EXPOSE 4001

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
