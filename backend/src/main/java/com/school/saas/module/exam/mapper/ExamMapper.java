package com.school.saas.module.exam.mapper;

import com.school.saas.module.exam.Exam;
import com.school.saas.module.exam.ExamResult;
import com.school.saas.module.exam.dto.ExamDTO;
import com.school.saas.module.exam.dto.ExamResultDTO;
import org.springframework.stereotype.Component;

@Component
public class ExamMapper {

    public ExamDTO toDTO(Exam exam) {
        if (exam == null) {
            return null;
        }

        return ExamDTO.builder()
                .id(String.valueOf(exam.getId()))
                .schoolId(String.valueOf(exam.getSchoolId()))
                .classRoomId(exam.getClassRoom() != null ? String.valueOf(exam.getClassRoom().getId()) : null)
                .classRoomName(exam.getClassRoom() != null ? exam.getClassRoom().getName() : null)
                .courseId(exam.getCourse() != null ? String.valueOf(exam.getCourse().getId()) : null)
                .courseName(exam.getCourse() != null ? exam.getCourse().getSubject() : null)
                .courseCode(exam.getCourse() != null ? exam.getCourse().getSubjectCode() : null)
                .teacherId(exam.getTeacher() != null ? String.valueOf(exam.getTeacher().getId()) : null)
                .teacherName(exam.getTeacher() != null && exam.getTeacher().getUser() != null 
                        ? exam.getTeacher().getUser().getFirstName() + " " + exam.getTeacher().getUser().getLastName() 
                        : null)
                .specialityId(exam.getSpeciality() != null ? String.valueOf(exam.getSpeciality().getId()) : null)
                .specialityName(exam.getSpeciality() != null ? exam.getSpeciality().getName() : null)
                .title(exam.getTitle())
                .description(exam.getDescription())
                .examType(exam.getExamType())
                .examDate(exam.getExamDate())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .durationMinutes(exam.getDurationMinutes())
                .roomNumber(exam.getRoomNumber())
                .maxMarks(exam.getMaxMarks())
                .passingMarks(exam.getPassingMarks())
                .semester(exam.getSemester())
                .academicYear(exam.getAcademicYear())
                .status(exam.getStatus())
                .instructions(exam.getInstructions())
                .allowCalculators(exam.getAllowCalculators())
                .allowBooks(exam.getAllowBooks())
                .notes(exam.getNotes())
                .resultsPublished(exam.getResultsPublished())
                .resultsPublishedAt(exam.getResultsPublishedAt())
                .createdAt(exam.getCreatedAt())
                .updatedAt(exam.getUpdatedAt())
                .build();
    }

    public ExamResultDTO toResultDTO(ExamResult result) {
        if (result == null) {
            return null;
        }

        return ExamResultDTO.builder()
                .id(String.valueOf(result.getId()))
                .schoolId(String.valueOf(result.getSchoolId()))
                .examId(result.getExam() != null ? String.valueOf(result.getExam().getId()) : null)
                .examTitle(result.getExam() != null ? result.getExam().getTitle() : null)
                .studentId(result.getStudent() != null ? String.valueOf(result.getStudent().getId()) : null)
                .studentName(result.getStudent() != null && result.getStudent().getUser() != null
                        ? result.getStudent().getUser().getFirstName() + " " + result.getStudent().getUser().getLastName()
                        : null)
                .studentRegistrationNumber(result.getStudent() != null ? result.getStudent().getRegistrationNumber() : null)
                .marksObtained(result.getMarksObtained())
                .maxMarks(result.getMaxMarks())
                .percentage(result.getPercentage())
                .grade(result.getGrade())
                .status(result.getStatus())
                .remarks(result.getRemarks())
                .absent(result.getAbsent())
                .rank(result.getRank())
                .gradedBy(result.getGradedBy())
                .gradedAt(result.getGradedAt())
                .createdAt(result.getCreatedAt())
                .updatedAt(result.getUpdatedAt())
                .build();
    }
}
