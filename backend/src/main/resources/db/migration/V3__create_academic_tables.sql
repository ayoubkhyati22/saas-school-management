-- =====================================================
-- Migration: V3 - Create Academic Tables
-- =====================================================
-- Description:
--   This migration creates the academic structure including classrooms,
--   courses, and course materials for the educational platform.
--
-- Tables Created:
--   - classrooms: Physical or virtual class groupings
--   - courses: Subject courses taught in classrooms
--   - course_materials: Educational resources and files for courses
--
-- Enums Created:
--   - semester_type: Academic term/semester options
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE semester_type AS ENUM ('FIRST_SEMESTER', 'SECOND_SEMESTER', 'SUMMER', 'FULL_YEAR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: classrooms
-- =====================================================
-- Represents class groupings/sections within a school
-- Links to a class teacher (homeroom teacher) who manages the classroom
CREATE TABLE IF NOT EXISTS classrooms (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    name text NOT NULL,
    level text NOT NULL,
    section text,
    academic_year text NOT NULL,
    capacity integer NOT NULL DEFAULT 30,
    class_teacher_id uuid,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_classrooms_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_classrooms_class_teacher
        FOREIGN KEY (class_teacher_id)
        REFERENCES teachers(id)
        ON DELETE SET NULL,
    CONSTRAINT uq_classrooms_name_year_school
        UNIQUE (school_id, name, academic_year)
);

-- Add foreign key constraint to students table for class_room_id
-- This is done here after classrooms table is created
DO $$ BEGIN
    ALTER TABLE students
    ADD CONSTRAINT fk_students_classroom
        FOREIGN KEY (class_room_id)
        REFERENCES classrooms(id)
        ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: courses
-- =====================================================
-- Subject courses taught within classrooms
-- Each course is taught by a teacher and belongs to a classroom
CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    class_room_id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    subject text NOT NULL,
    subject_code text NOT NULL,
    description text,
    schedule text,
    semester text NOT NULL DEFAULT 'FULL_YEAR',
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_courses_classroom
        FOREIGN KEY (class_room_id)
        REFERENCES classrooms(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_courses_teacher
        FOREIGN KEY (teacher_id)
        REFERENCES teachers(id)
        ON DELETE RESTRICT,
    CONSTRAINT uq_courses_subject_code_classroom
        UNIQUE (class_room_id, subject_code, semester)
);

-- =====================================================
-- Table: course_materials
-- =====================================================
-- Educational resources and files uploaded for courses
-- Includes lecture notes, assignments, reading materials, etc.
CREATE TABLE IF NOT EXISTS course_materials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL,
    school_id uuid NOT NULL,
    title text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    uploaded_by uuid NOT NULL,
    uploaded_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_course_materials_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_course_materials_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_course_materials_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =====================================================
-- Indexes for Academic Tables
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_classrooms_school_id ON classrooms(school_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_class_teacher_id ON classrooms(class_teacher_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_academic_year ON classrooms(academic_year);
CREATE INDEX IF NOT EXISTS idx_classrooms_level ON classrooms(level);

CREATE INDEX IF NOT EXISTS idx_courses_school_id ON courses(school_id);
CREATE INDEX IF NOT EXISTS idx_courses_class_room_id ON courses(class_room_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_subject_code ON courses(subject_code);

CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_school_id ON course_materials(school_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_uploaded_by ON course_materials(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_course_materials_uploaded_at ON course_materials(uploaded_at);
