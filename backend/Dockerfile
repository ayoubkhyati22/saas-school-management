FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/school-saas-platform-1.0.0.jar app.jar

RUN mkdir -p /app/storage

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
