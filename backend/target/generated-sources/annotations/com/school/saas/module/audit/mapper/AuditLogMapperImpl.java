package com.school.saas.module.audit.mapper;

import com.school.saas.module.audit.dto.AuditLogDTO;
import com.school.saas.module.audit.entity.AuditLog;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-22T18:22:26+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class AuditLogMapperImpl implements AuditLogMapper {

    @Override
    public AuditLogDTO toDTO(AuditLog auditLog) {
        if ( auditLog == null ) {
            return null;
        }

        AuditLogDTO.AuditLogDTOBuilder auditLogDTO = AuditLogDTO.builder();

        auditLogDTO.action( auditLog.getAction() );
        auditLogDTO.createdAt( auditLog.getCreatedAt() );
        auditLogDTO.entityId( auditLog.getEntityId() );
        auditLogDTO.entityType( auditLog.getEntityType() );
        auditLogDTO.id( auditLog.getId() );
        auditLogDTO.ipAddress( auditLog.getIpAddress() );
        auditLogDTO.newValue( auditLog.getNewValue() );
        auditLogDTO.oldValue( auditLog.getOldValue() );
        auditLogDTO.schoolId( auditLog.getSchoolId() );
        auditLogDTO.timestamp( auditLog.getTimestamp() );
        auditLogDTO.userAgent( auditLog.getUserAgent() );
        auditLogDTO.userId( auditLog.getUserId() );
        auditLogDTO.username( auditLog.getUsername() );

        return auditLogDTO.build();
    }

    @Override
    public AuditLog toEntity(AuditLogDTO auditLogDTO) {
        if ( auditLogDTO == null ) {
            return null;
        }

        AuditLog.AuditLogBuilder<?, ?> auditLog = AuditLog.builder();

        auditLog.createdAt( auditLogDTO.getCreatedAt() );
        auditLog.id( auditLogDTO.getId() );
        auditLog.action( auditLogDTO.getAction() );
        auditLog.entityId( auditLogDTO.getEntityId() );
        auditLog.entityType( auditLogDTO.getEntityType() );
        auditLog.ipAddress( auditLogDTO.getIpAddress() );
        auditLog.newValue( auditLogDTO.getNewValue() );
        auditLog.oldValue( auditLogDTO.getOldValue() );
        auditLog.schoolId( auditLogDTO.getSchoolId() );
        auditLog.timestamp( auditLogDTO.getTimestamp() );
        auditLog.userAgent( auditLogDTO.getUserAgent() );
        auditLog.userId( auditLogDTO.getUserId() );
        auditLog.username( auditLogDTO.getUsername() );

        return auditLog.build();
    }
}
