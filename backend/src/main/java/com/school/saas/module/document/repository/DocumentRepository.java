package com.school.saas.module.document.repository;

import com.school.saas.module.document.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findBySchoolIdAndEntityTypeAndEntityId(UUID schoolId, String entityType, UUID entityId);

    List<Document> findBySchoolId(UUID schoolId);

    @Query("SELECT COALESCE(SUM(d.fileSize), 0) FROM Document d WHERE d.schoolId = :schoolId")
    Long sumFileSizeBySchoolId(@Param("schoolId") UUID schoolId);

    List<Document> findByEntityTypeAndEntityId(String entityType, UUID entityId);
}
