package com.school.saas.module.speciality.repository;

import com.school.saas.module.speciality.Speciality;
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
public interface SpecialityRepository extends JpaRepository<Speciality, UUID> {

    Page<Speciality> findBySchoolId(UUID schoolId, Pageable pageable);

    List<Speciality> findBySchoolId(UUID schoolId);

    List<Speciality> findBySchoolIdAndActiveTrue(UUID schoolId);

    Optional<Speciality> findByIdAndSchoolId(UUID id, UUID schoolId);

    boolean existsBySchoolIdAndCode(UUID schoolId, String code);

    boolean existsBySchoolIdAndCodeAndIdNot(UUID schoolId, String code, UUID id);

    long countBySchoolId(UUID schoolId);

    @Query("SELECT s FROM Speciality s WHERE s.schoolId = :schoolId AND " +
           "(LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.code) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Speciality> searchByKeyword(@Param("schoolId") UUID schoolId,
                                     @Param("keyword") String keyword,
                                     Pageable pageable);

    Page<Speciality> findBySchoolIdAndActiveTrue(UUID schoolId, Pageable pageable);
}
