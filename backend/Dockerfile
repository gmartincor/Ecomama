FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

RUN apk add --no-cache binutils && \
    rm -rf /var/cache/apk/*

COPY gradle gradle/
COPY gradlew gradlew.bat settings.gradle build.gradle ./

RUN --mount=type=cache,target=/root/.gradle \
    chmod +x gradlew && \
    ./gradlew dependencies --no-daemon || true

COPY src ./src

RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew build -x test --no-daemon && \
    java -Djarmode=layertools -jar build/libs/*.jar extract

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN apk add --no-cache --update \
    wget \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/* \
    && addgroup -S spring \
    && adduser -S spring -G spring \
    && chown -R spring:spring /app

COPY --from=builder --chown=spring:spring /build/dependencies/ ./
COPY --from=builder --chown=spring:spring /build/spring-boot-loader/ ./
COPY --from=builder --chown=spring:spring /build/snapshot-dependencies/ ./
COPY --from=builder --chown=spring:spring /build/application/ ./

USER spring:spring

ENV JAVA_OPTS="-XX:+UseContainerSupport \
    -XX:MaxRAMPercentage=75.0 \
    -XX:InitialRAMPercentage=50.0 \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication \
    -XX:+OptimizeStringConcat \
    -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
