package com.school.saas.module.audit.mapper;

import com.school.saas.config.MapStructConfig;
import com.school.saas.module.audit.dto.AuditLogDTO;
import com.school.saas.module.audit.entity.AuditLog;
import org.mapstruct.Mapper;

@Mapper(config = MapStructConfig.class)
public interface AuditLogMapper {

    AuditLogDTO toDTO(AuditLog auditLog);

    AuditLog toEntity(AuditLogDTO auditLogDTO);
}
