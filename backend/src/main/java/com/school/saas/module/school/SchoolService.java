package com.school.saas.module.school;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface SchoolService {

    SchoolDTO create(CreateSchoolRequest request);

    SchoolDTO update(UUID id, UpdateSchoolRequest request);

    SchoolDTO getById(UUID id);

    SchoolDetailDTO getDetailById(UUID id);

    Page<SchoolDTO> getAll(Pageable pageable);

    List<SchoolDTO> getAllActive();

    void delete(UUID id);

    void activate(UUID id);

    void deactivate(UUID id);
}
