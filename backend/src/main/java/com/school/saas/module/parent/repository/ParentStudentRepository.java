package com.school.saas.module.parent.repository;

import com.school.saas.module.parent.ParentStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentStudentRepository extends JpaRepository<ParentStudent, UUID> {

    List<ParentStudent> findByParentId(UUID parentId);

    List<ParentStudent> findByStudentId(UUID studentId);

    Optional<ParentStudent> findByParentIdAndStudentId(UUID parentId, UUID studentId);

    boolean existsByParentIdAndStudentId(UUID parentId, UUID studentId);

    void deleteByParentIdAndStudentId(UUID parentId, UUID studentId);

    long countByParentId(UUID parentId);

    long countByStudentId(UUID studentId);

    @Query("SELECT ps FROM ParentStudent ps WHERE ps.parent.schoolId = :schoolId AND ps.parent.id = :parentId")
    List<ParentStudent> findByParentIdAndSchoolId(@Param("parentId") UUID parentId,
                                                   @Param("schoolId") UUID schoolId);

    @Query("SELECT ps FROM ParentStudent ps WHERE ps.student.schoolId = :schoolId AND ps.student.id = :studentId")
    List<ParentStudent> findByStudentIdAndSchoolId(@Param("studentId") UUID studentId,
                                                    @Param("schoolId") UUID schoolId);
}
