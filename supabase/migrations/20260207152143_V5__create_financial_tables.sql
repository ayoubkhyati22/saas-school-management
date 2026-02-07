-- =====================================================
-- Migration: V5 - Create Financial Tables
-- =====================================================
-- Description:
--   This migration creates the financial management system including
--   payment tracking and document management.
--
-- Tables Created:
--   - payments: Student payment and billing records
--   - documents: Generic document storage for various entities
--
-- Enums Created:
--   - payment_status: Payment lifecycle states
--   - payment_type: Categories of payments
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_type AS ENUM (
        'TUITION',
        'REGISTRATION',
        'EXAM_FEE',
        'LIBRARY_FEE',
        'TRANSPORTATION',
        'UNIFORM',
        'BOOKS',
        'ACTIVITY_FEE',
        'LATE_FEE',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: payments
-- =====================================================
-- Tracks all financial transactions related to students
-- Includes tuition, fees, and other payments with full audit trail
CREATE TABLE IF NOT EXISTS payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    student_id uuid NOT NULL,
    amount decimal(12, 2) NOT NULL,
    payment_type text NOT NULL,
    status text NOT NULL DEFAULT 'PENDING',
    due_date date NOT NULL,
    paid_date date,
    invoice_number text,
    payment_method text,
    transaction_id text,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_payments_student
        FOREIGN KEY (student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_payments_amount_positive
        CHECK (amount >= 0)
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Table: documents
-- =====================================================
-- Generic document storage system for various entities
-- Supports attachments for students, teachers, courses, etc.
-- entity_type examples: 'STUDENT', 'TEACHER', 'COURSE', 'PAYMENT', 'APPLICATION'
CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    title text NOT NULL,
    file_path text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL DEFAULT 0,
    uploaded_by uuid NOT NULL,
    uploaded_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_documents_uploaded_by
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_documents_file_size_positive
        CHECK (file_size >= 0)
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Indexes for Financial Tables
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_payments_school_id ON payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_paid_date ON payments(paid_date);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_number ON payments(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

CREATE INDEX IF NOT EXISTS idx_documents_school_id ON documents(school_id);
CREATE INDEX IF NOT EXISTS idx_documents_entity_type_id ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_file_type ON documents(file_type);