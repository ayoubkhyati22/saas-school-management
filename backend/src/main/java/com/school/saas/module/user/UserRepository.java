package com.school.saas.module.user;

import com.school.saas.common.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    List<User> findBySchoolId(UUID schoolId);

    Page<User> findBySchoolId(UUID schoolId, Pageable pageable);

    List<User> findBySchoolIdAndRole(UUID schoolId, Role role);

    Page<User> findBySchoolIdAndRole(UUID schoolId, Role role, Pageable pageable);

    long countBySchoolIdAndRole(UUID schoolId, Role role);

    long countBySchoolId(UUID schoolId);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);

    List<User> findByRole(Role role);

    long countByRole(Role role);
}
