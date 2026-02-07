-- =====================================================
-- Migration: V6 - Create Support Tables
-- =====================================================
-- Description:
--   This migration creates the support and administrative systems including
--   absence tracking, issue management, and comprehensive audit logging.
--
-- Tables Created:
--   - absences: Student absence records and justifications
--   - issues: Support ticket system for problem tracking
--   - issue_comments: Comment thread for issue resolution
--   - audit_logs: System-wide activity and change tracking
--
-- Enums Created:
--   - issue_status: Issue lifecycle states
--   - issue_priority: Issue urgency levels
--   - issue_type: Categories of issues
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE issue_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED', 'ON_HOLD');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE issue_type AS ENUM (
        'TECHNICAL',
        'BILLING',
        'ACADEMIC',
        'ATTENDANCE',
        'BEHAVIOR',
        'FACILITIES',
        'GENERAL',
        'FEATURE_REQUEST',
        'BUG_REPORT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: absences
-- =====================================================
-- Tracks student absences from courses
-- Includes justification status and supporting documentation
CREATE TABLE IF NOT EXISTS absences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    student_id uuid NOT NULL,
    course_id uuid NOT NULL,
    date date NOT NULL,
    reason text,
    justified boolean NOT NULL DEFAULT false,
    justification_document text,
    reported_by uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_absences_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_absences_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_absences_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_absences_reported_by
        FOREIGN KEY (reported_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT uq_absences_student_course_date
        UNIQUE (student_id, course_id, date)
);

-- Enable RLS
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Table: issues
-- =====================================================
-- Support ticket system for tracking problems and requests
-- Supports assignment to staff members for resolution
CREATE TABLE IF NOT EXISTS issues (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    reported_by uuid NOT NULL,
    assigned_to uuid,
    title text NOT NULL,
    description text NOT NULL,
    issue_type text NOT NULL,
    priority text NOT NULL DEFAULT 'MEDIUM',
    status text NOT NULL DEFAULT 'OPEN',
    resolution text,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issues_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_issues_reported_by
        FOREIGN KEY (reported_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_issues_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Table: issue_comments
-- =====================================================
-- Comment thread for issue discussions and updates
CREATE TABLE IF NOT EXISTS issue_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id uuid NOT NULL,
    user_id uuid NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_issue_comments_issue
        FOREIGN KEY (issue_id)
        REFERENCES issues(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_issue_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Table: audit_logs
-- =====================================================
-- Comprehensive audit trail for all system activities
-- Tracks changes to entities with before/after values
-- Includes user context, IP address, and user agent for security
CREATE TABLE IF NOT EXISTS audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid,
    user_id uuid,
    username text,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid,
    old_value text,
    new_value text,
    ip_address text,
    user_agent text,
    timestamp timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Note: audit_logs intentionally has no foreign key constraints
-- to preserve audit history even after referenced records are deleted

-- =====================================================
-- Indexes for Support Tables
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_absences_school_id ON absences(school_id);
CREATE INDEX IF NOT EXISTS idx_absences_student_id ON absences(student_id);
CREATE INDEX IF NOT EXISTS idx_absences_course_id ON absences(course_id);
CREATE INDEX IF NOT EXISTS idx_absences_date ON absences(date DESC);
CREATE INDEX IF NOT EXISTS idx_absences_justified ON absences(justified);
CREATE INDEX IF NOT EXISTS idx_absences_reported_by ON absences(reported_by);

CREATE INDEX IF NOT EXISTS idx_issues_school_id ON issues(school_id);
CREATE INDEX IF NOT EXISTS idx_issues_reported_by ON issues(reported_by);
CREATE INDEX IF NOT EXISTS idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority);
CREATE INDEX IF NOT EXISTS idx_issues_issue_type ON issues(issue_type);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_issue_comments_issue_id ON issue_comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_user_id ON issue_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_issue_comments_created_at ON issue_comments(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);