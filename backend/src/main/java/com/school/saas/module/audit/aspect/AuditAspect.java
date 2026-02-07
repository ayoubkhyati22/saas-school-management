package com.school.saas.module.audit.aspect;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.school.saas.module.audit.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Around("@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
    public Object auditModifyingOperations(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        String methodName = method.getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();

        // Determine action type
        String action = determineAction(method);

        // Get request details
        HttpServletRequest request = getCurrentRequest();
        String ipAddress = request != null ? getClientIp(request) : null;
        String userAgent = request != null ? request.getHeader("User-Agent") : null;

        // Determine entity type from class name
        String entityType = extractEntityType(className);

        // Capture old value for UPDATE/DELETE operations
        String oldValue = null;
        Object[] args = joinPoint.getArgs();

        try {
            // Proceed with the actual operation
            Object result = joinPoint.proceed();

            // Extract entity ID from result or arguments
            UUID entityId = extractEntityId(result, args);

            // Capture new value
            String newValue = null;
            if (result != null && !isVoidOrResponseEntity(result)) {
                try {
                    newValue = objectMapper.writeValueAsString(result);
                } catch (JsonProcessingException e) {
                    log.warn("Failed to serialize result for audit log", e);
                    newValue = result.toString();
                }
            }

            // Log the action
            auditService.logActionWithDetails(action, entityType, entityId, oldValue, newValue,
                                             ipAddress, userAgent);

            return result;

        } catch (Exception e) {
            // Still log failed operations
            auditService.logActionWithDetails(action + "_FAILED", entityType, null, oldValue, null,
                                             ipAddress, userAgent);
            throw e;
        }
    }

    private String determineAction(Method method) {
        if (method.isAnnotationPresent(PostMapping.class)) {
            return "CREATE";
        } else if (method.isAnnotationPresent(PutMapping.class)) {
            return "UPDATE";
        } else if (method.isAnnotationPresent(DeleteMapping.class)) {
            return "DELETE";
        }
        return "UNKNOWN";
    }

    private String extractEntityType(String className) {
        // Remove "Controller" or "Service" suffix and convert to uppercase
        String entityType = className
            .replace("Controller", "")
            .replace("Service", "")
            .replaceAll("([a-z])([A-Z])", "$1_$2")
            .toUpperCase();

        return entityType;
    }

    private UUID extractEntityId(Object result, Object[] args) {
        // Try to extract ID from result
        if (result != null) {
            try {
                // Check if result has getId method
                Method getIdMethod = result.getClass().getMethod("getId");
                Object id = getIdMethod.invoke(result);
                if (id instanceof UUID) {
                    return (UUID) id;
                }
            } catch (Exception e) {
                // Ignore and try arguments
            }
        }

        // Try to extract ID from arguments
        for (Object arg : args) {
            if (arg instanceof UUID) {
                return (UUID) arg;
            }
        }

        return null;
    }

    private boolean isVoidOrResponseEntity(Object result) {
        if (result == null) {
            return true;
        }
        String className = result.getClass().getName();
        return className.contains("ResponseEntity") ||
               className.contains("ApiResponse") ||
               className.contains("PageResponse");
    }

    private HttpServletRequest getCurrentRequest() {
        try {
            ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            return attributes.getRequest();
        } catch (IllegalStateException e) {
            log.debug("No request context available");
            return null;
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String[] ipHeaders = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
        };

        for (String header : ipHeaders) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // Handle multiple IPs (comma-separated)
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }
                return ip;
            }
        }

        return request.getRemoteAddr();
    }
}
