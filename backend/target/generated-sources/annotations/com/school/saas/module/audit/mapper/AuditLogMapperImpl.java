package com.school.saas.module.audit.mapper;

import com.school.saas.module.audit.dto.AuditLogDTO;
import com.school.saas.module.audit.entity.AuditLog;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-12T11:17:33+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 19.0.1 (Oracle Corporation)"
)
@Component
public class AuditLogMapperImpl implements AuditLogMapper {

    @Override
    public AuditLogDTO toDTO(AuditLog auditLog) {
        if ( auditLog == null ) {
            return null;
        }

        AuditLogDTO.AuditLogDTOBuilder auditLogDTO = AuditLogDTO.builder();

        auditLogDTO.id( auditLog.getId() );
        auditLogDTO.schoolId( auditLog.getSchoolId() );
        auditLogDTO.userId( auditLog.getUserId() );
        auditLogDTO.username( auditLog.getUsername() );
        auditLogDTO.action( auditLog.getAction() );
        auditLogDTO.entityType( auditLog.getEntityType() );
        auditLogDTO.entityId( auditLog.getEntityId() );
        auditLogDTO.oldValue( auditLog.getOldValue() );
        auditLogDTO.newValue( auditLog.getNewValue() );
        auditLogDTO.ipAddress( auditLog.getIpAddress() );
        auditLogDTO.userAgent( auditLog.getUserAgent() );
        auditLogDTO.timestamp( auditLog.getTimestamp() );
        auditLogDTO.createdAt( auditLog.getCreatedAt() );

        return auditLogDTO.build();
    }

    @Override
    public AuditLog toEntity(AuditLogDTO auditLogDTO) {
        if ( auditLogDTO == null ) {
            return null;
        }

        AuditLog.AuditLogBuilder<?, ?> auditLog = AuditLog.builder();

        auditLog.id( auditLogDTO.getId() );
        auditLog.createdAt( auditLogDTO.getCreatedAt() );
        auditLog.schoolId( auditLogDTO.getSchoolId() );
        auditLog.userId( auditLogDTO.getUserId() );
        auditLog.username( auditLogDTO.getUsername() );
        auditLog.action( auditLogDTO.getAction() );
        auditLog.entityType( auditLogDTO.getEntityType() );
        auditLog.entityId( auditLogDTO.getEntityId() );
        auditLog.oldValue( auditLogDTO.getOldValue() );
        auditLog.newValue( auditLogDTO.getNewValue() );
        auditLog.ipAddress( auditLogDTO.getIpAddress() );
        auditLog.userAgent( auditLogDTO.getUserAgent() );
        auditLog.timestamp( auditLogDTO.getTimestamp() );

        return auditLog.build();
    }
}
