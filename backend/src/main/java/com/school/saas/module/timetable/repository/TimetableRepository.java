package com.school.saas.module.timetable.repository;

import com.school.saas.module.timetable.Timetable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, UUID> {

    Page<Timetable> findBySchoolId(UUID schoolId, Pageable pageable);

    List<Timetable> findBySchoolId(UUID schoolId);

    Optional<Timetable> findByIdAndSchoolId(UUID id, UUID schoolId);

    List<Timetable> findByClassRoomId(UUID classRoomId);

    Page<Timetable> findByClassRoomId(UUID classRoomId, Pageable pageable);

    List<Timetable> findByTeacherId(UUID teacherId);

    Page<Timetable> findByTeacherId(UUID teacherId, Pageable pageable);

    List<Timetable> findByCourseId(UUID courseId);

    Page<Timetable> findByCourseId(UUID courseId, Pageable pageable);

    List<Timetable> findBySpecialityId(UUID specialityId);

    Page<Timetable> findBySpecialityId(UUID specialityId, Pageable pageable);

    List<Timetable> findBySchoolIdAndAcademicYear(UUID schoolId, String academicYear);

    Page<Timetable> findBySchoolIdAndAcademicYear(UUID schoolId, String academicYear, Pageable pageable);

    List<Timetable> findBySchoolIdAndSemester(UUID schoolId, String semester);

    Page<Timetable> findBySchoolIdAndSemester(UUID schoolId, String semester, Pageable pageable);

    List<Timetable> findByClassRoomIdAndDayOfWeek(UUID classRoomId, DayOfWeek dayOfWeek);

    List<Timetable> findByTeacherIdAndDayOfWeek(UUID teacherId, DayOfWeek dayOfWeek);

    List<Timetable> findBySchoolIdAndDayOfWeek(UUID schoolId, DayOfWeek dayOfWeek);

    long countBySchoolId(UUID schoolId);

    long countByClassRoomId(UUID classRoomId);

    long countByTeacherId(UUID teacherId);

    long countByCourseId(UUID courseId);

    long countBySchoolIdAndActiveTrue(UUID schoolId);

    long countBySchoolIdAndActiveFalse(UUID schoolId);

    @Query("SELECT t FROM Timetable t WHERE t.schoolId = :schoolId AND " +
           "(LOWER(t.course.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.course.subjectCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.classRoom.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Timetable> searchByKeyword(@Param("schoolId") UUID schoolId,
                                    @Param("keyword") String keyword,
                                    Pageable pageable);

    @Query("SELECT t FROM Timetable t WHERE t.classRoom.id = :classRoomId AND " +
           "t.academicYear = :academicYear AND t.active = true " +
           "ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findActiveByClassRoomAndAcademicYear(@Param("classRoomId") UUID classRoomId,
                                                          @Param("academicYear") String academicYear);

    @Query("SELECT t FROM Timetable t WHERE t.teacher.id = :teacherId AND " +
           "t.academicYear = :academicYear AND t.active = true " +
           "ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findActiveByTeacherAndAcademicYear(@Param("teacherId") UUID teacherId,
                                                        @Param("academicYear") String academicYear);

    @Query("SELECT t FROM Timetable t WHERE t.course.id = :courseId AND " +
           "t.academicYear = :academicYear AND t.active = true " +
           "ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findActiveByCourseAndAcademicYear(@Param("courseId") UUID courseId,
                                                       @Param("academicYear") String academicYear);

    @Query("SELECT t FROM Timetable t WHERE t.speciality.id = :specialityId AND " +
           "t.academicYear = :academicYear AND t.active = true " +
           "ORDER BY t.dayOfWeek, t.startTime")
    List<Timetable> findActiveBySpecialityAndAcademicYear(@Param("specialityId") UUID specialityId,
                                                           @Param("academicYear") String academicYear);

    @Query("SELECT COUNT(t) > 0 FROM Timetable t WHERE " +
           "t.teacher.id = :teacherId AND " +
           "t.dayOfWeek = :dayOfWeek AND " +
           "t.active = true AND " +
           "((t.startTime < :endTime AND t.endTime > :startTime))")
    boolean hasTeacherConflict(@Param("teacherId") UUID teacherId,
                              @Param("dayOfWeek") DayOfWeek dayOfWeek,
                              @Param("startTime") java.time.LocalTime startTime,
                              @Param("endTime") java.time.LocalTime endTime);

    @Query("SELECT COUNT(t) > 0 FROM Timetable t WHERE " +
           "t.classRoom.id = :classRoomId AND " +
           "t.dayOfWeek = :dayOfWeek AND " +
           "t.active = true AND " +
           "((t.startTime < :endTime AND t.endTime > :startTime))")
    boolean hasClassRoomConflict(@Param("classRoomId") UUID classRoomId,
                                @Param("dayOfWeek") DayOfWeek dayOfWeek,
                                @Param("startTime") java.time.LocalTime startTime,
                                @Param("endTime") java.time.LocalTime endTime);
}
