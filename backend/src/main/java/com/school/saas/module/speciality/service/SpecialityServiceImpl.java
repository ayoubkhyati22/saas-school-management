package com.school.saas.module.speciality.service;

import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.speciality.dto.CreateSpecialityRequest;
import com.school.saas.module.speciality.dto.SpecialityDTO;
import com.school.saas.module.speciality.dto.UpdateSpecialityRequest;
import com.school.saas.module.speciality.mapper.SpecialityMapper;
import com.school.saas.module.speciality.repository.SpecialityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpecialityServiceImpl implements SpecialityService {

    private final SpecialityRepository specialityRepository;
    private final SpecialityMapper specialityMapper;

    @Override
    @Transactional
    public SpecialityDTO create(CreateSpecialityRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating speciality for school: {}", schoolId);

        // Check if code already exists for this school
        if (specialityRepository.existsBySchoolIdAndCode(schoolId, request.getCode())) {
            throw new BadRequestException("Speciality with code " + request.getCode() + " already exists");
        }

        Speciality speciality = Speciality.builder()
                .schoolId(schoolId)
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .active(true)
                .build();

        speciality = specialityRepository.save(speciality);
        log.info("Speciality created successfully with ID: {}", speciality.getId());
        return specialityMapper.toDTO(speciality);
    }

    @Override
    @Transactional
    public SpecialityDTO update(UUID id, UpdateSpecialityRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating speciality: {} for school: {}", id, schoolId);

        Speciality speciality = specialityRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        // Check if code already exists for another speciality
        if (request.getCode() != null &&
            !request.getCode().equals(speciality.getCode()) &&
            specialityRepository.existsBySchoolIdAndCodeAndIdNot(schoolId, request.getCode(), id)) {
            throw new BadRequestException("Speciality with code " + request.getCode() + " already exists");
        }

        if (request.getName() != null) {
            speciality.setName(request.getName());
        }
        if (request.getCode() != null) {
            speciality.setCode(request.getCode());
        }
        if (request.getDescription() != null) {
            speciality.setDescription(request.getDescription());
        }
        if (request.getActive() != null) {
            speciality.setActive(request.getActive());
        }

        speciality = specialityRepository.save(speciality);
        log.info("Speciality updated successfully: {}", id);
        return specialityMapper.toDTO(speciality);
    }

    @Override
    @Transactional(readOnly = true)
    public SpecialityDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching speciality: {} for school: {}", id, schoolId);

        Speciality speciality = specialityRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        return specialityMapper.toDTO(speciality);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpecialityDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all specialities for school: {}", schoolId);

        Page<Speciality> specialities = specialityRepository.findBySchoolId(schoolId, pageable);
        return specialities.map(specialityMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpecialityDTO> getAllActive() {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all active specialities for school: {}", schoolId);

        List<Speciality> specialities = specialityRepository.findBySchoolIdAndActiveTrue(schoolId);
        return specialities.stream()
                .map(specialityMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SpecialityDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching specialities with keyword: {} for school: {}", keyword, schoolId);

        Page<Speciality> specialities = specialityRepository.searchByKeyword(schoolId, keyword, pageable);
        return specialities.map(specialityMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting speciality: {} for school: {}", id, schoolId);

        Speciality speciality = specialityRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        specialityRepository.delete(speciality);
        log.info("Speciality deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public void activate(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Activating speciality: {} for school: {}", id, schoolId);

        Speciality speciality = specialityRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        speciality.setActive(true);
        specialityRepository.save(speciality);
        log.info("Speciality activated successfully: {}", id);
    }

    @Override
    @Transactional
    public void deactivate(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deactivating speciality: {} for school: {}", id, schoolId);

        Speciality speciality = specialityRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        speciality.setActive(false);
        specialityRepository.save(speciality);
        log.info("Speciality deactivated successfully: {}", id);
    }
}
