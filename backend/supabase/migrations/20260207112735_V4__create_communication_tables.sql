-- =====================================================
-- Migration: V4 - Create Communication Tables
-- =====================================================
-- Description:
--   This migration creates the communication infrastructure including
--   chat messaging, notifications, and event management.
--
-- Tables Created:
--   - chat_messages: Course-based messaging system
--   - notifications: User notification delivery system
--   - events: School events and announcements
--
-- Enums Created:
--   - message_type: Types of chat messages
--   - notification_type: Categories of notifications
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE message_type AS ENUM ('TEXT', 'FILE', 'IMAGE', 'VIDEO', 'AUDIO', 'LINK');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM (
        'ASSIGNMENT',
        'GRADE',
        'ATTENDANCE',
        'ANNOUNCEMENT',
        'MESSAGE',
        'PAYMENT',
        'EVENT',
        'SYSTEM',
        'ALERT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: chat_messages
-- =====================================================
-- Course-based messaging system for communication between
-- teachers, students, and parents within a course context
CREATE TABLE IF NOT EXISTS chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    course_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    message text NOT NULL,
    message_type message_type NOT NULL DEFAULT 'TEXT',
    file_path text,
    timestamp timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_messages_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chat_messages_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chat_messages_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Table: notifications
-- =====================================================
-- System-wide notification delivery to users
-- Tracks read status and delivery timestamps
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    notification_type notification_type NOT NULL,
    read_status boolean NOT NULL DEFAULT false,
    sent_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Table: events
-- =====================================================
-- School events, announcements, and calendar items
-- Can target specific roles (e.g., students, teachers, parents, or all)
CREATE TABLE IF NOT EXISTS events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    event_type text NOT NULL,
    event_date timestamp with time zone NOT NULL,
    location text,
    target_role text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_events_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- =====================================================
-- Indexes for Communication Tables
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_chat_messages_school_id ON chat_messages(school_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_course_id ON chat_messages(course_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_message_type ON chat_messages(message_type);

CREATE INDEX IF NOT EXISTS idx_notifications_school_id ON notifications(school_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON notifications(read_status);
CREATE INDEX IF NOT EXISTS idx_notifications_notification_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_events_school_id ON events(school_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_target_role ON events(target_role);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);