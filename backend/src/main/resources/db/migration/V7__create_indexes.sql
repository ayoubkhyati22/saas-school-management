-- =====================================================
-- Migration: V7 - Create Composite Indexes
-- =====================================================
-- Description:
--   This migration creates composite indexes to optimize common query patterns
--   and improve performance for frequently accessed data combinations.
--
-- Performance Optimizations:
--   - Multi-column indexes for filtering and sorting operations
--   - Indexes on commonly queried column combinations
--   - Support for reporting and analytics queries
--   - Optimization for tenant-scoped queries (school_id + other columns)
--
-- Indexes Created:
--   - Student query optimizations (school + status, classroom + status)
--   - Teacher query optimizations (school + status)
--   - Payment query optimizations (school + status, student + status)
--   - Notification query optimizations (user + read status)
--   - Chat message query optimizations (course + timestamp)
--   - Absence tracking optimizations (student + date)
--   - Audit log query optimizations (school + timestamp, user + timestamp)
--   - Issue tracking optimizations (school + status, assigned user + status)
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- =====================================================
-- Student Management Indexes
-- =====================================================
-- Optimize queries filtering students by school and status
-- Common use case: "Show all active students in a school"
CREATE INDEX IF NOT EXISTS idx_students_school_status
    ON students(school_id, status);

-- Optimize queries filtering students by classroom and status
-- Common use case: "Show all active students in a specific classroom"
CREATE INDEX IF NOT EXISTS idx_students_classroom_status
    ON students(class_room_id, status);

-- =====================================================
-- Teacher Management Indexes
-- =====================================================
-- Optimize queries filtering teachers by school and status
-- Common use case: "Show all active teachers in a school"
CREATE INDEX IF NOT EXISTS idx_teachers_school_status
    ON teachers(school_id, status);

-- =====================================================
-- Payment Management Indexes
-- =====================================================
-- Optimize queries filtering payments by school and status
-- Common use case: "Show all pending payments for a school"
CREATE INDEX IF NOT EXISTS idx_payments_school_status
    ON payments(school_id, status);

-- Optimize queries filtering payments by student and status
-- Common use case: "Show all outstanding payments for a student"
CREATE INDEX IF NOT EXISTS idx_payments_student_status
    ON payments(student_id, status);

-- =====================================================
-- Notification System Indexes
-- =====================================================
-- Optimize queries filtering notifications by user and read status
-- Common use case: "Show all unread notifications for a user"
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
    ON notifications(user_id, read_status);

-- =====================================================
-- Chat and Communication Indexes
-- =====================================================
-- Optimize queries retrieving chat messages for a course in chronological order
-- Common use case: "Show recent messages in a course chat"
CREATE INDEX IF NOT EXISTS idx_chat_messages_course_timestamp
    ON chat_messages(course_id, timestamp DESC);

-- =====================================================
-- Absence Tracking Indexes
-- =====================================================
-- Optimize queries filtering absences by student and date
-- Common use case: "Show absence history for a student"
CREATE INDEX IF NOT EXISTS idx_absences_student_date
    ON absences(student_id, date DESC);

-- =====================================================
-- Audit Log Indexes
-- =====================================================
-- Optimize queries filtering audit logs by school and timestamp
-- Common use case: "Show recent activity for a school"
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_timestamp
    ON audit_logs(school_id, timestamp DESC);

-- Optimize queries filtering audit logs by user and timestamp
-- Common use case: "Show activity history for a specific user"
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp
    ON audit_logs(user_id, timestamp DESC);

-- =====================================================
-- Issue Tracking Indexes
-- =====================================================
-- Optimize queries filtering issues by school and status
-- Common use case: "Show all open issues for a school"
CREATE INDEX IF NOT EXISTS idx_issues_school_status
    ON issues(school_id, status);

-- Optimize queries filtering issues by assigned user and status
-- Common use case: "Show all open issues assigned to a user"
CREATE INDEX IF NOT EXISTS idx_issues_assigned_status
    ON issues(assigned_to, status);

-- =====================================================
-- Index Summary
-- =====================================================
-- Total composite indexes created: 12
--
-- Performance benefits:
-- - Faster filtered queries on multi-tenant data
-- - Optimized sorting and pagination
-- - Reduced full table scans
-- - Improved query planner efficiency
-- - Better support for reporting and analytics
--
-- Note: PostgreSQL automatically uses these indexes when
-- the query planner determines they will improve performance.
-- =====================================================
