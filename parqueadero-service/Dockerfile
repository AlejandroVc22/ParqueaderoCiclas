FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn -B -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -B -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/parqueadero-service.jar app.jar

ENV JAVA_OPTS="-Xms128m -Xmx512m"
ENV PORT=4002
EXPOSE 4002

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
