-- =====================================================
-- Migration: V2 - Create User Tables
-- =====================================================
-- Description:
--   This migration creates the user management schema including users,
--   students, teachers, parents, and their relationships.
--
-- Tables Created:
--   - users: Core authentication and user information
--   - students: Student-specific data and enrollment information
--   - teachers: Teacher employment and assignment data
--   - parents: Parent/guardian information
--   - parent_student: Many-to-many relationship between parents and students
--
-- Enums Created:
--   - gender_type: Gender options
--   - student_status: Student enrollment states
--   - teacher_status: Teacher employment states
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE student_status AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'SUSPENDED', 'DROPPED_OUT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE teacher_status AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED', 'RETIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: users
-- =====================================================
-- Core user authentication and profile information
-- Supports multi-tenancy with nullable school_id for super admins
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text,
    role text NOT NULL,
    enabled boolean NOT NULL DEFAULT true,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Table: students
-- =====================================================
-- Student enrollment and academic information
CREATE TABLE IF NOT EXISTS students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    school_id uuid NOT NULL,
    class_room_id uuid,
    registration_number text NOT NULL,
    birth_date date,
    gender text,
    enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
    status text NOT NULL DEFAULT 'ACTIVE',
    address text,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_students_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_students_registration_number_school
        UNIQUE (school_id, registration_number)
);

-- =====================================================
-- Table: teachers
-- =====================================================
-- Teacher employment and assignment information
CREATE TABLE IF NOT EXISTS teachers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    school_id uuid NOT NULL,
    speciality text,
    hire_date date NOT NULL,
    employee_number text NOT NULL,
    status text NOT NULL DEFAULT 'ACTIVE',
    salary decimal(12, 2),
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_teachers_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_teachers_employee_number_school
        UNIQUE (school_id, employee_number)
);

-- =====================================================
-- Table: parents
-- =====================================================
-- Parent/guardian information
CREATE TABLE IF NOT EXISTS parents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE,
    school_id uuid NOT NULL,
    occupation text,
    address text,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parents_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_parents_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Table: parent_student
-- =====================================================
-- Many-to-many relationship between parents and students
CREATE TABLE IF NOT EXISTS parent_student (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid NOT NULL,
    student_id uuid NOT NULL,
    is_primary_contact boolean NOT NULL DEFAULT false,
    relationship_type text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_parent_student_parent
        FOREIGN KEY (parent_id)
        REFERENCES parents(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_parent_student_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_parent_student
        UNIQUE (parent_id, student_id)
);

-- =====================================================
-- Indexes for User Tables
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_enabled ON users(enabled);

CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_class_room_id ON students(class_room_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_registration_number ON students(school_id, registration_number);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_status ON teachers(status);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_number ON teachers(school_id, employee_number);

CREATE INDEX IF NOT EXISTS idx_parents_user_id ON parents(user_id);
CREATE INDEX IF NOT EXISTS idx_parents_school_id ON parents(school_id);

CREATE INDEX IF NOT EXISTS idx_parent_student_parent_id ON parent_student(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student_id ON parent_student(student_id);