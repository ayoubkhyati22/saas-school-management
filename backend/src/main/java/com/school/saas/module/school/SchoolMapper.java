package com.school.saas.module.school;

import com.school.saas.config.MapStructConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(config = MapStructConfig.class)
public interface SchoolMapper {

    SchoolDTO toDTO(School school);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "registrationDate", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "active", expression = "java(true)")
    School toEntity(CreateSchoolRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "registrationDate", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateEntity(UpdateSchoolRequest request, @MappingTarget School school);

    @Mapping(target = "activeSubscription", ignore = true)
    @Mapping(target = "totalStudents", ignore = true)
    @Mapping(target = "totalTeachers", ignore = true)
    SchoolDetailDTO toDetailDTO(School school);
}
