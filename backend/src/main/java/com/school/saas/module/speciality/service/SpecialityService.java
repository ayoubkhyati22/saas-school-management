package com.school.saas.module.speciality.service;

import com.school.saas.module.speciality.dto.CreateSpecialityRequest;
import com.school.saas.module.speciality.dto.SpecialityDTO;
import com.school.saas.module.speciality.dto.UpdateSpecialityRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface SpecialityService {
    SpecialityDTO create(CreateSpecialityRequest request);

    SpecialityDTO update(UUID id, UpdateSpecialityRequest request);

    SpecialityDTO getById(UUID id);

    Page<SpecialityDTO> getAll(Pageable pageable);

    List<SpecialityDTO> getAllActive();

    Page<SpecialityDTO> searchByKeyword(String keyword, Pageable pageable);

    void delete(UUID id);

    void activate(UUID id);

    void deactivate(UUID id);
}
