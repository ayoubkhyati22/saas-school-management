package com.school.saas.module.school;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-22T18:22:26+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class SchoolMapperImpl implements SchoolMapper {

    @Override
    public SchoolDTO toDTO(School school) {
        if ( school == null ) {
            return null;
        }

        SchoolDTO.SchoolDTOBuilder schoolDTO = SchoolDTO.builder();

        schoolDTO.active( school.getActive() );
        schoolDTO.avatarUrl( school.getAvatarUrl() );
        schoolDTO.email( school.getEmail() );
        schoolDTO.id( school.getId() );
        schoolDTO.logoUrl( school.getLogoUrl() );
        schoolDTO.name( school.getName() );
        schoolDTO.phone( school.getPhone() );
        schoolDTO.registrationDate( school.getRegistrationDate() );

        return schoolDTO.build();
    }

    @Override
    public School toEntity(CreateSchoolRequest request) {
        if ( request == null ) {
            return null;
        }

        School.SchoolBuilder<?, ?> school = School.builder();

        school.address( request.getAddress() );
        school.avatarUrl( request.getAvatarUrl() );
        school.email( request.getEmail() );
        school.logoUrl( request.getLogoUrl() );
        school.name( request.getName() );
        school.phone( request.getPhone() );

        school.registrationDate( java.time.LocalDate.now() );
        school.active( true );

        return school.build();
    }

    @Override
    public void updateEntity(UpdateSchoolRequest request, School school) {
        if ( request == null ) {
            return;
        }

        school.setAddress( request.getAddress() );
        school.setAvatarUrl( request.getAvatarUrl() );
        school.setEmail( request.getEmail() );
        school.setLogoUrl( request.getLogoUrl() );
        school.setName( request.getName() );
        school.setPhone( request.getPhone() );
    }

    @Override
    public SchoolDetailDTO toDetailDTO(School school) {
        if ( school == null ) {
            return null;
        }

        SchoolDetailDTO.SchoolDetailDTOBuilder schoolDetailDTO = SchoolDetailDTO.builder();

        schoolDetailDTO.active( school.getActive() );
        schoolDetailDTO.address( school.getAddress() );
        schoolDetailDTO.avatarUrl( school.getAvatarUrl() );
        schoolDetailDTO.email( school.getEmail() );
        schoolDetailDTO.id( school.getId() );
        schoolDetailDTO.logoUrl( school.getLogoUrl() );
        schoolDetailDTO.name( school.getName() );
        schoolDetailDTO.phone( school.getPhone() );
        schoolDetailDTO.registrationDate( school.getRegistrationDate() );

        return schoolDetailDTO.build();
    }
}
