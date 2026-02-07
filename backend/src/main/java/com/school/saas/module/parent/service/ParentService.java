package com.school.saas.module.parent.service;

import com.school.saas.module.parent.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ParentService {
    ParentDetailDTO create(CreateParentRequest request);

    ParentDetailDTO update(UUID id, UpdateParentRequest request);

    ParentDetailDTO getById(UUID id);

    Page<ParentDTO> getAll(Pageable pageable);

    Page<ParentDTO> searchByKeyword(String keyword, Pageable pageable);

    void delete(UUID id);

    ParentStudentDTO linkStudent(UUID parentId, LinkStudentRequest request);

    void unlinkStudent(UUID parentId, UUID studentId);

    List<ParentStudentDTO> getChildren(UUID parentId);

    List<ParentDTO> getParentsByStudent(UUID studentId);
}
