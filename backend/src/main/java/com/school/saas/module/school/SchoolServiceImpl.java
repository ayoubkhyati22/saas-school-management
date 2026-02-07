package com.school.saas.module.school;

import com.school.saas.common.Role;
import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.module.subscription.Subscription;
import com.school.saas.module.subscription.SubscriptionMapper;
import com.school.saas.module.subscription.SubscriptionRepository;
import com.school.saas.module.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SchoolServiceImpl implements SchoolService {

    private final SchoolRepository schoolRepository;
    private final SchoolMapper schoolMapper;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionMapper subscriptionMapper;
    private final UserRepository userRepository;

    @Override
    public SchoolDTO create(CreateSchoolRequest request) {
        log.info("Creating new school with email: {}", request.getEmail());

        if (schoolRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("School with email " + request.getEmail() + " already exists");
        }

        School school = schoolMapper.toEntity(request);
        School saved = schoolRepository.save(school);

        log.info("School created successfully with ID: {}", saved.getId());
        return schoolMapper.toDTO(saved);
    }

    @Override
    public SchoolDTO update(UUID id, UpdateSchoolRequest request) {
        log.info("Updating school with ID: {}", id);

        School school = findSchoolById(id);

        if (request.getEmail() != null &&
            !request.getEmail().equals(school.getEmail()) &&
            schoolRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new BadRequestException("School with email " + request.getEmail() + " already exists");
        }

        schoolMapper.updateEntity(request, school);
        School updated = schoolRepository.save(school);

        log.info("School updated successfully with ID: {}", id);
        return schoolMapper.toDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public SchoolDTO getById(UUID id) {
        log.info("Fetching school with ID: {}", id);
        School school = findSchoolById(id);
        return schoolMapper.toDTO(school);
    }

    @Override
    @Transactional(readOnly = true)
    public SchoolDetailDTO getDetailById(UUID id) {
        log.info("Fetching school details with ID: {}", id);
        School school = findSchoolById(id);

        SchoolDetailDTO detailDTO = schoolMapper.toDetailDTO(school);

        // Get active subscription
        Optional<Subscription> activeSubscription = subscriptionRepository.findActiveBySchoolId(id);
        activeSubscription.ifPresent(subscription ->
            detailDTO.setActiveSubscription(subscriptionMapper.toDTO(subscription))
        );

        // Get counts
        Long studentCount = userRepository.countBySchoolIdAndRole(id, Role.STUDENT);
        Long teacherCount = userRepository.countBySchoolIdAndRole(id, Role.TEACHER);

        detailDTO.setTotalStudents(studentCount);
        detailDTO.setTotalTeachers(teacherCount);

        return detailDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SchoolDTO> getAll(Pageable pageable) {
        log.info("Fetching all schools with pagination");
        return schoolRepository.findAll(pageable)
                .map(schoolMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SchoolDTO> getAllActive() {
        log.info("Fetching all active schools");
        return schoolRepository.findByActiveTrue()
                .stream()
                .map(schoolMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(UUID id) {
        log.info("Deleting school with ID: {}", id);
        School school = findSchoolById(id);

        // Check if school has users
        long userCount = userRepository.countBySchoolId(id);
        if (userCount > 0) {
            throw new BadRequestException("Cannot delete school with existing users. Deactivate instead.");
        }

        schoolRepository.delete(school);
        log.info("School deleted successfully with ID: {}", id);
    }

    @Override
    public void activate(UUID id) {
        log.info("Activating school with ID: {}", id);
        School school = findSchoolById(id);
        school.setActive(true);
        schoolRepository.save(school);
        log.info("School activated successfully with ID: {}", id);
    }

    @Override
    public void deactivate(UUID id) {
        log.info("Deactivating school with ID: {}", id);
        School school = findSchoolById(id);
        school.setActive(false);
        schoolRepository.save(school);
        log.info("School deactivated successfully with ID: {}", id);
    }

    private School findSchoolById(UUID id) {
        return schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + id));
    }
}
