package com.school.saas.module.user;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-02-22T18:22:27+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260128-0750, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDTO toDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDTO.UserDTOBuilder userDTO = UserDTO.builder();

        userDTO.email( user.getEmail() );
        userDTO.enabled( user.getEnabled() );
        userDTO.firstName( user.getFirstName() );
        userDTO.id( user.getId() );
        userDTO.lastLoginAt( user.getLastLoginAt() );
        userDTO.lastName( user.getLastName() );
        userDTO.phone( user.getPhone() );
        userDTO.role( user.getRole() );
        userDTO.schoolId( user.getSchoolId() );

        return userDTO.build();
    }

    @Override
    public User toEntity(CreateUserRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder<?, ?> user = User.builder();

        user.email( request.getEmail() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.phone( request.getPhone() );
        user.role( request.getRole() );
        user.schoolId( request.getSchoolId() );

        user.enabled( true );

        return user.build();
    }

    @Override
    public void updateEntity(UpdateUserRequest request, User user) {
        if ( request == null ) {
            return;
        }

        user.setEmail( request.getEmail() );
        user.setFirstName( request.getFirstName() );
        user.setLastName( request.getLastName() );
        user.setPhone( request.getPhone() );
    }
}
