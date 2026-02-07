package com.school.saas.module.school;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<School, UUID> {

    List<School> findByActiveTrue();

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, UUID id);
}
