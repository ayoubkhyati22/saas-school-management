package com.school.saas.module.parent.repository;

import com.school.saas.module.parent.Parent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentRepository extends JpaRepository<Parent, UUID> {

    Page<Parent> findBySchoolId(UUID schoolId, Pageable pageable);

    List<Parent> findBySchoolId(UUID schoolId);

    Optional<Parent> findByIdAndSchoolId(UUID id, UUID schoolId);

    Optional<Parent> findByUserIdAndSchoolId(UUID userId, UUID schoolId);

    long countBySchoolId(UUID schoolId);

    @Query("SELECT p FROM Parent p WHERE p.schoolId = :schoolId AND " +
           "(LOWER(p.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Parent> searchByKeyword(@Param("schoolId") UUID schoolId,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);
}
