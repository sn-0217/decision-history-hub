# Spring Boot Actuator Setup for Health Dashboard

The Health Dashboard requires Spring Boot Actuator endpoints to be enabled. Follow these steps to configure your Spring Boot application:

## 1. Add Actuator Dependency

Add this to your `pom.xml` (Maven) or `build.gradle` (Gradle):

### Maven
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### Gradle
```gradle
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

## 2. Configure Application Properties

Add these properties to your `application.properties` or `application.yml`:

### application.properties
```properties
# Enable all actuator endpoints
management.endpoints.web.exposure.include=health,metrics
management.endpoint.health.show-details=always

# Optional: Change actuator base path (default is /actuator)
# management.endpoints.web.base-path=/actuator

# Enable specific metrics
management.metrics.export.simple.enabled=true
```

### application.yml
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      simple:
        enabled: true
```

## 3. Required Metrics Endpoints

The Health Dashboard requires these specific endpoints to be available:

- `/actuator/health` - General health check
- `/actuator/metrics/process.uptime` - Application uptime
- `/actuator/metrics/process.start.time` - Application start time
- `/actuator/metrics/jvm.memory.used` - JVM memory usage
- `/actuator/metrics/jvm.memory.max` - JVM maximum memory
- `/actuator/metrics/process.cpu.usage` - CPU usage
- `/actuator/metrics/disk.free` - Free disk space
- `/actuator/metrics/disk.total` - Total disk space
- `/actuator/metrics/http.server.requests.active` - Active HTTP requests
- `/actuator/metrics/jvm.threads.live` - Live JVM threads
- `/actuator/metrics/tomcat.sessions.active.current` - Active Tomcat sessions

## 4. Verify Endpoints

Once your Spring Boot application is running on `localhost:8080`, verify the endpoints:

```bash
# Test basic health endpoint
curl http://localhost:8080/actuator/health

# Test specific metric
curl http://localhost:8080/actuator/metrics/process.uptime
```

## 5. Security Considerations

For production environments, consider securing actuator endpoints:

```properties
# Secure actuator endpoints
management.security.enabled=true
spring.security.user.name=admin
spring.security.user.password=admin123
spring.security.user.roles=ACTUATOR
```

## 6. Troubleshooting

### Common Issues:

1. **404 Not Found**: Actuator dependency not added or endpoints not exposed
2. **403 Forbidden**: Security is enabled but credentials not provided
3. **Empty/0 values**: Metric not available or micrometer not configured
4. **CORS issues**: Add CORS configuration if frontend and backend on different ports

### Debug Steps:

1. Check if actuator is working: `curl http://localhost:8080/actuator/health`
2. List available metrics: `curl http://localhost:8080/actuator/metrics`
3. Check browser network tab for actual HTTP responses
4. Verify proxy configuration in vite.config.ts

## 7. Expected Response Format

Each metric endpoint should return JSON in this format:

```json
{
  "name": "process.uptime",
  "description": "The uptime of the Java virtual machine",
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "VALUE",
      "value": 3600.123
    }
  ]
}
```
