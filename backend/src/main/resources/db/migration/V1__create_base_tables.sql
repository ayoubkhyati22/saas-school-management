-- =====================================================
-- Migration: V1 - Create Base Tables
-- =====================================================
-- Description:
--   This migration creates the foundational schema for the School SaaS platform.
--   It establishes the core multi-tenant structure with schools, subscription plans,
--   plan features, and subscriptions.
--
-- Tables Created:
--   - schools: Main tenant table storing school information
--   - subscription_plans: Available subscription tiers and their limits
--   - plan_features: Feature flags for each subscription plan
--   - subscriptions: Active subscriptions linking schools to plans
--
-- Enums Created:
--   - role_type: User roles in the system
--   - subscription_status: States of subscription lifecycle
--   - billing_cycle: Billing frequency options
--
-- Author: School SaaS Development Team
-- Date: 2026-02-07
-- =====================================================

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE role_type AS ENUM ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED', 'TRIAL', 'PENDING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE billing_cycle AS ENUM ('MONTHLY', 'YEARLY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- Table: schools
-- =====================================================
-- Stores school (tenant) information
-- Each school represents a separate organization using the platform
CREATE TABLE IF NOT EXISTS schools (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text,
    email text,
    phone text,
    active boolean NOT NULL DEFAULT true,
    registration_date date NOT NULL DEFAULT CURRENT_DATE,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: subscription_plans
-- =====================================================
-- Defines available subscription tiers and their resource limits
CREATE TABLE IF NOT EXISTS subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    monthly_price decimal(10, 2) NOT NULL,
    yearly_price decimal(10, 2) NOT NULL,
    max_students integer NOT NULL,
    max_teachers integer NOT NULL,
    max_storage_gb integer NOT NULL,
    max_classes integer NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: plan_features
-- =====================================================
-- Stores feature flags for each subscription plan
CREATE TABLE IF NOT EXISTS plan_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_plan_id uuid NOT NULL,
    feature_type text NOT NULL,
    enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_plan_features_subscription_plan
        FOREIGN KEY (subscription_plan_id)
        REFERENCES subscription_plans(id)
        ON DELETE CASCADE
);

-- =====================================================
-- Table: subscriptions
-- =====================================================
-- Tracks active and historical subscriptions for each school
CREATE TABLE IF NOT EXISTS subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id uuid NOT NULL,
    subscription_plan_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    billing_cycle text NOT NULL,
    status text NOT NULL DEFAULT 'PENDING',
    auto_renew boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_subscriptions_school
        FOREIGN KEY (school_id)
        REFERENCES schools(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_subscription_plan
        FOREIGN KEY (subscription_plan_id)
        REFERENCES subscription_plans(id)
        ON DELETE RESTRICT
);

-- =====================================================
-- Indexes for Base Tables
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_schools_active ON schools(active);
CREATE INDEX IF NOT EXISTS idx_schools_registration_date ON schools(registration_date);

CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(active);

CREATE INDEX IF NOT EXISTS idx_plan_features_subscription_plan_id ON plan_features(subscription_plan_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_school_id ON subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_subscription_plan_id ON subscriptions(subscription_plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);
