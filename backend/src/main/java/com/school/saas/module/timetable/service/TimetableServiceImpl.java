package com.school.saas.module.timetable.service;

import com.school.saas.exception.BadRequestException;
import com.school.saas.exception.ResourceNotFoundException;
import com.school.saas.security.TenantContext;
import com.school.saas.module.classroom.ClassRoom;
import com.school.saas.module.classroom.repository.ClassRoomRepository;
import com.school.saas.module.course.Course;
import com.school.saas.module.course.repository.CourseRepository;
import com.school.saas.module.speciality.Speciality;
import com.school.saas.module.speciality.repository.SpecialityRepository;
import com.school.saas.module.teacher.Teacher;
import com.school.saas.module.teacher.repository.TeacherRepository;
import com.school.saas.module.timetable.Timetable;
import com.school.saas.module.timetable.dto.*;
import com.school.saas.module.timetable.mapper.TimetableMapper;
import com.school.saas.module.timetable.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimetableServiceImpl implements TimetableService {

    private final TimetableRepository timetableRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final SpecialityRepository specialityRepository;
    private final TimetableMapper timetableMapper;

    @Override
    @Transactional
    public TimetableDetailDTO create(CreateTimetableRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Creating timetable for school: {}", schoolId);

        // Verify classroom belongs to school
        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(request.getClassRoomId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        // Verify teacher belongs to school
        Teacher teacher = teacherRepository.findByIdAndSchoolId(request.getTeacherId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        // Verify course belongs to school
        Course course = courseRepository.findByIdAndSchoolId(request.getCourseId(), schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Get speciality if provided
        Speciality speciality = null;
        if (request.getSpecialityId() != null) {
            speciality = specialityRepository.findByIdAndSchoolId(request.getSpecialityId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));
        }

        // Validate time slot
        if (request.getStartTime().isAfter(request.getEndTime()) || 
            request.getStartTime().equals(request.getEndTime())) {
            throw new BadRequestException("Start time must be before end time");
        }

        // Check for teacher conflicts
        if (timetableRepository.hasTeacherConflict(request.getTeacherId(), request.getDayOfWeek(),
                request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Teacher has a conflicting schedule at this time");
        }

        // Check for classroom conflicts
        if (timetableRepository.hasClassRoomConflict(request.getClassRoomId(), request.getDayOfWeek(),
                request.getStartTime(), request.getEndTime())) {
            throw new BadRequestException("Classroom is already booked at this time");
        }

        Timetable timetable = Timetable.builder()
                .schoolId(schoolId)
                .classRoom(classRoom)
                .teacher(teacher)
                .course(course)
                .speciality(speciality)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .roomNumber(request.getRoomNumber())
                .semester(request.getSemester())
                .academicYear(request.getAcademicYear())
                .notes(request.getNotes())
                .active(true)
                .build();

        timetable = timetableRepository.save(timetable);
        log.info("Timetable created successfully with ID: {}", timetable.getId());
        return timetableMapper.toDetailDTO(timetable);
    }

    @Override
    @Transactional
    public TimetableDetailDTO update(UUID id, UpdateTimetableRequest request) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Updating timetable: {} for school: {}", id, schoolId);

        Timetable timetable = timetableRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findByIdAndSchoolId(request.getTeacherId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            timetable.setTeacher(teacher);
        }
        if (request.getSpecialityId() != null) {
            Speciality speciality = specialityRepository.findByIdAndSchoolId(request.getSpecialityId(), schoolId)
                    .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));
            timetable.setSpeciality(speciality);
        }
        if (request.getDayOfWeek() != null) {
            timetable.setDayOfWeek(request.getDayOfWeek());
        }
        if (request.getStartTime() != null) {
            timetable.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            timetable.setEndTime(request.getEndTime());
        }
        if (request.getRoomNumber() != null) {
            timetable.setRoomNumber(request.getRoomNumber());
        }
        if (request.getSemester() != null) {
            timetable.setSemester(request.getSemester());
        }
        if (request.getAcademicYear() != null) {
            timetable.setAcademicYear(request.getAcademicYear());
        }
        if (request.getNotes() != null) {
            timetable.setNotes(request.getNotes());
        }
        if (request.getActive() != null) {
            timetable.setActive(request.getActive());
        }

        // Validate time slot if times are updated
        if (request.getStartTime() != null || request.getEndTime() != null) {
            if (timetable.getStartTime().isAfter(timetable.getEndTime()) || 
                timetable.getStartTime().equals(timetable.getEndTime())) {
                throw new BadRequestException("Start time must be before end time");
            }
        }

        timetable = timetableRepository.save(timetable);
        log.info("Timetable updated successfully: {}", id);
        return timetableMapper.toDetailDTO(timetable);
    }

    @Override
    @Transactional(readOnly = true)
    public TimetableDetailDTO getById(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetable: {} for school: {}", id, schoolId);

        Timetable timetable = timetableRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        return timetableMapper.toDetailDTO(timetable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TimetableDTO> getAll(Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching all timetables for school: {}", schoolId);

        Page<Timetable> timetables = timetableRepository.findBySchoolId(schoolId, pageable);
        return timetables.map(timetableMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableDTO> getByClassRoom(UUID classRoomId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for classroom: {} in school: {}", classRoomId, schoolId);

        // Verify classroom belongs to school
        classRoomRepository.findByIdAndSchoolId(classRoomId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        List<Timetable> timetables = timetableRepository.findByClassRoomId(classRoomId);
        return timetables.stream()
                .map(timetableMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableDTO> getByTeacher(UUID teacherId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for teacher: {} in school: {}", teacherId, schoolId);

        // Verify teacher belongs to school
        teacherRepository.findByIdAndSchoolId(teacherId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        List<Timetable> timetables = timetableRepository.findByTeacherId(teacherId);
        return timetables.stream()
                .map(timetableMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableDTO> getByCourse(UUID courseId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for course: {} in school: {}", courseId, schoolId);

        // Verify course belongs to school
        courseRepository.findByIdAndSchoolId(courseId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<Timetable> timetables = timetableRepository.findByCourseId(courseId);
        return timetables.stream()
                .map(timetableMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableDTO> getBySpeciality(UUID specialityId) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for speciality: {} in school: {}", specialityId, schoolId);

        // Verify speciality belongs to school
        specialityRepository.findByIdAndSchoolId(specialityId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        List<Timetable> timetables = timetableRepository.findBySpecialityId(specialityId);
        return timetables.stream()
                .map(timetableMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TimetableDTO> getByDayOfWeek(DayOfWeek dayOfWeek) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for day: {} in school: {}", dayOfWeek, schoolId);

        List<Timetable> timetables = timetableRepository.findBySchoolIdAndDayOfWeek(schoolId, dayOfWeek);
        return timetables.stream()
                .map(timetableMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TimetableDTO> getByAcademicYear(String academicYear, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for academic year: {} in school: {}", academicYear, schoolId);

        Page<Timetable> timetables = timetableRepository.findBySchoolIdAndAcademicYear(schoolId, academicYear, pageable);
        return timetables.map(timetableMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TimetableDTO> getBySemester(String semester, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching timetables for semester: {} in school: {}", semester, schoolId);

        Page<Timetable> timetables = timetableRepository.findBySchoolIdAndSemester(schoolId, semester, pageable);
        return timetables.map(timetableMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TimetableDTO> searchByKeyword(String keyword, Pageable pageable) {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Searching timetables with keyword: {} for school: {}", keyword, schoolId);

        Page<Timetable> timetables = timetableRepository.searchByKeyword(schoolId, keyword, pageable);
        return timetables.map(timetableMapper::toDTO);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deleting timetable: {} for school: {}", id, schoolId);

        Timetable timetable = timetableRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        timetableRepository.delete(timetable);
        log.info("Timetable deleted successfully: {}", id);
    }

    @Override
    @Transactional
    public void activate(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Activating timetable: {} for school: {}", id, schoolId);

        Timetable timetable = timetableRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        timetable.setActive(true);
        timetableRepository.save(timetable);
        log.info("Timetable activated successfully: {}", id);
    }

    @Override
    @Transactional
    public void deactivate(UUID id) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Deactivating timetable: {} for school: {}", id, schoolId);

        Timetable timetable = timetableRepository.findByIdAndSchoolId(id, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        timetable.setActive(false);
        timetableRepository.save(timetable);
        log.info("Timetable deactivated successfully: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public TimetableStatisticsDTO getStatistics() {
        UUID schoolId = TenantContext.getTenantId();
        log.debug("Fetching statistics for school: {}", schoolId);

        long totalSlots = timetableRepository.countBySchoolId(schoolId);
        long activeSlots = timetableRepository.countBySchoolIdAndActiveTrue(schoolId);
        long inactiveSlots = timetableRepository.countBySchoolIdAndActiveFalse(schoolId);

        List<Timetable> allTimetables = timetableRepository.findBySchoolId(schoolId);

        Map<String, Long> slotsByDayOfWeek = allTimetables.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDayOfWeek().toString(),
                        Collectors.counting()
                ));

        Map<String, Long> slotsByClassRoom = allTimetables.stream()
                .filter(t -> t.getClassRoom() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getClassRoom().getName(),
                        Collectors.counting()
                ));

        Map<String, Long> slotsByTeacher = allTimetables.stream()
                .filter(t -> t.getTeacher() != null && t.getTeacher().getUser() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getTeacher().getUser().getFirstName() + " " + t.getTeacher().getUser().getLastName(),
                        Collectors.counting()
                ));

        Map<String, Long> slotsByCourse = allTimetables.stream()
                .filter(t -> t.getCourse() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getCourse().getSubject(),
                        Collectors.counting()
                ));

        return TimetableStatisticsDTO.builder()
                .totalSlots(totalSlots)
                .activeSlots(activeSlots)
                .inactiveSlots(inactiveSlots)
                .slotsByDayOfWeek(slotsByDayOfWeek)
                .slotsByClassRoom(slotsByClassRoom)
                .slotsByTeacher(slotsByTeacher)
                .slotsByCourse(slotsByCourse)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportTimetableByTeacher(UUID teacherId, String academicYear) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Exporting timetable for teacher: {} in academic year: {}", teacherId, academicYear);

        Teacher teacher = teacherRepository.findByIdAndSchoolId(teacherId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        List<Timetable> timetables = timetableRepository.findActiveByTeacherAndAcademicYear(teacherId, academicYear);

        String teacherName = teacher.getUser().getFirstName() + " " + teacher.getUser().getLastName();
        String title = "Emploi du Temps - " + teacherName + " - " + academicYear;

        return generateTimetableExcel(timetables, title);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportTimetableByClassRoom(UUID classRoomId, String academicYear) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Exporting timetable for classroom: {} in academic year: {}", classRoomId, academicYear);

        ClassRoom classRoom = classRoomRepository.findByIdAndSchoolId(classRoomId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom not found"));

        List<Timetable> timetables = timetableRepository.findActiveByClassRoomAndAcademicYear(classRoomId, academicYear);

        String title = "Emploi du Temps - " + classRoom.getName() + " - " + academicYear;

        return generateTimetableExcel(timetables, title);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportTimetableByCourse(UUID courseId, String academicYear) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Exporting timetable for course: {} in academic year: {}", courseId, academicYear);

        Course course = courseRepository.findByIdAndSchoolId(courseId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        List<Timetable> timetables = timetableRepository.findActiveByCourseAndAcademicYear(courseId, academicYear);

        String title = "Emploi du Temps - " + course.getSubject() + " - " + academicYear;

        return generateTimetableExcel(timetables, title);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportTimetableBySpeciality(UUID specialityId, String academicYear) {
        UUID schoolId = TenantContext.getTenantId();
        log.info("Exporting timetable for speciality: {} in academic year: {}", specialityId, academicYear);

        Speciality speciality = specialityRepository.findByIdAndSchoolId(specialityId, schoolId)
                .orElseThrow(() -> new ResourceNotFoundException("Speciality not found"));

        List<Timetable> timetables = timetableRepository.findActiveBySpecialityAndAcademicYear(specialityId, academicYear);

        String title = "Emploi du Temps - " + speciality.getName() + " - " + academicYear;

        return generateTimetableExcel(timetables, title);
    }

    private byte[] generateTimetableExcel(List<Timetable> timetables, String title) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Emploi du Temps");

            // Create styles
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dayHeaderStyle = createDayHeaderStyle(workbook);
            CellStyle timeSlotStyle = createTimeSlotStyle(workbook);
            CellStyle courseStyle = createCourseStyle(workbook);
            CellStyle titleStyle = createTitleStyle(workbook);

            int rowNum = 0;

            // Title row
            Row titleRow = sheet.createRow(rowNum++);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(title);
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            rowNum++; // Empty row

            // Group timetables by day of week
            Map<DayOfWeek, List<Timetable>> timetablesByDay = timetables.stream()
                    .collect(Collectors.groupingBy(Timetable::getDayOfWeek, TreeMap::new, Collectors.toList()));

            // Days of week in order
            List<DayOfWeek> daysOfWeek = Arrays.asList(
                    DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                    DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
            );

            // Header row with time slots
            Row headerRow = sheet.createRow(rowNum++);
            String[] headers = {"Heure", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Get all unique time slots
            Set<String> timeSlots = new TreeSet<>();
            for (Timetable t : timetables) {
                String timeSlot = t.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) +
                                "-" + t.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"));
                timeSlots.add(timeSlot);
            }

            // Create timetable grid
            for (String timeSlot : timeSlots) {
                Row row = sheet.createRow(rowNum++);

                // Time slot cell
                Cell timeCell = row.createCell(0);
                timeCell.setCellValue(timeSlot);
                timeCell.setCellStyle(timeSlotStyle);

                // Course cells for each day
                for (int dayIndex = 0; dayIndex < 7; dayIndex++) {
                    DayOfWeek day = daysOfWeek.get(dayIndex);
                    Cell cell = row.createCell(dayIndex + 1);

                    List<Timetable> dayTimetables = timetablesByDay.getOrDefault(day, Collections.emptyList());
                    String currentTimeSlot = timeSlot;

                    Optional<Timetable> matchingTimetable = dayTimetables.stream()
                            .filter(t -> {
                                String tSlot = t.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) +
                                             "-" + t.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"));
                                return tSlot.equals(currentTimeSlot);
                            })
                            .findFirst();

                    if (matchingTimetable.isPresent()) {
                        Timetable t = matchingTimetable.get();
                        StringBuilder cellValue = new StringBuilder();
                        cellValue.append(t.getCourse().getSubject());
                        if (t.getCourse().getSubjectCode() != null) {
                            cellValue.append(" (").append(t.getCourse().getSubjectCode()).append(")");
                        }
                        if (t.getRoomNumber() != null) {
                            cellValue.append("\nSalle: ").append(t.getRoomNumber());
                        }
                        if (t.getTeacher() != null && t.getTeacher().getUser() != null) {
                            cellValue.append("\nProf: ").append(t.getTeacher().getUser().getFirstName())
                                    .append(" ").append(t.getTeacher().getUser().getLastName());
                        }
                        if (t.getClassRoom() != null) {
                            cellValue.append("\nClasse: ").append(t.getClassRoom().getName());
                        }

                        cell.setCellValue(cellValue.toString());
                        cell.setCellStyle(courseStyle);
                    } else {
                        cell.setCellValue("");
                        cell.setCellStyle(courseStyle);
                    }
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 1000);
            }

            workbook.write(out);
            return out.toByteArray();

        } catch (IOException e) {
            log.error("Error generating timetable Excel", e);
            throw new RuntimeException("Failed to generate timetable: " + e.getMessage());
        }
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createDayHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createTimeSlotStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 10);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createCourseStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 9);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setWrapText(true);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    private CellStyle createTitleStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 16);
        font.setColor(IndexedColors.DARK_BLUE.getIndex());
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
}
