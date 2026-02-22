package com.school.saas.module.school;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-12T11:17:35+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 19.0.1 (Oracle Corporation)"
)
@Component
public class SchoolMapperImpl implements SchoolMapper {

    @Override
    public SchoolDTO toDTO(School school) {
        if ( school == null ) {
            return null;
        }

        SchoolDTO.SchoolDTOBuilder schoolDTO = SchoolDTO.builder();

        schoolDTO.id( school.getId() );
        schoolDTO.name( school.getName() );
        schoolDTO.email( school.getEmail() );
        schoolDTO.phone( school.getPhone() );
        schoolDTO.active( school.getActive() );
        schoolDTO.registrationDate( school.getRegistrationDate() );
        schoolDTO.logoUrl( school.getLogoUrl() );
        schoolDTO.avatarUrl( school.getAvatarUrl() );

        return schoolDTO.build();
    }

    @Override
    public School toEntity(CreateSchoolRequest request) {
        if ( request == null ) {
            return null;
        }

        School.SchoolBuilder<?, ?> school = School.builder();

        school.name( request.getName() );
        school.address( request.getAddress() );
        school.email( request.getEmail() );
        school.phone( request.getPhone() );
        school.logoUrl( request.getLogoUrl() );
        school.avatarUrl( request.getAvatarUrl() );

        school.registrationDate( java.time.LocalDate.now() );
        school.active( true );

        return school.build();
    }

    @Override
    public void updateEntity(UpdateSchoolRequest request, School school) {
        if ( request == null ) {
            return;
        }

        school.setName( request.getName() );
        school.setAddress( request.getAddress() );
        school.setEmail( request.getEmail() );
        school.setPhone( request.getPhone() );
        school.setLogoUrl( request.getLogoUrl() );
        school.setAvatarUrl( request.getAvatarUrl() );
    }

    @Override
    public SchoolDetailDTO toDetailDTO(School school) {
        if ( school == null ) {
            return null;
        }

        SchoolDetailDTO.SchoolDetailDTOBuilder schoolDetailDTO = SchoolDetailDTO.builder();

        schoolDetailDTO.id( school.getId() );
        schoolDetailDTO.name( school.getName() );
        schoolDetailDTO.address( school.getAddress() );
        schoolDetailDTO.email( school.getEmail() );
        schoolDetailDTO.phone( school.getPhone() );
        schoolDetailDTO.active( school.getActive() );
        schoolDetailDTO.registrationDate( school.getRegistrationDate() );
        schoolDetailDTO.logoUrl( school.getLogoUrl() );
        schoolDetailDTO.avatarUrl( school.getAvatarUrl() );

        return schoolDetailDTO.build();
    }
}
