# Etapa de compilación
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM openjdk:21-jdk
WORKDIR /app
COPY --from=build /app/target/dotserver.jar .
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "dotserver.jar"]
