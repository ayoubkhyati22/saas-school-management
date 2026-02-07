/*
  # Add Avatars and Documents to Entities

  1. Changes to Existing Tables
    - `students`
      - Add `avatar_url` (text) - URL of student's avatar image
      - Add `administrative_documents` (jsonb) - Array of administrative documents with metadata
    
    - `teachers`
      - Add `avatar_url` (text) - URL of teacher's avatar image
      - Add `administrative_documents` (jsonb) - Array of administrative documents with metadata
    
    - `courses`
      - Add `documents` (jsonb) - Array of course materials/documents with metadata
    
    - `events`
      - Add `image_url` (text) - URL of event banner/image
    
    - `schools`
      - Add `logo_url` (text) - URL of school logo
      - Add `avatar_url` (text) - URL of school avatar/banner image

  2. Document Structure (JSONB)
    Each document in the arrays will have:
    - id: unique identifier
    - name: document name
    - url: document URL
    - type: document type (e.g., 'ID_CARD', 'CERTIFICATE', 'TRANSCRIPT', etc.)
    - uploadedAt: timestamp of upload
    - size: file size in bytes

  3. Security
    - All tables already have RLS enabled from previous migrations
    - Existing policies will continue to apply
*/

-- Add avatar and documents to students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE students ADD COLUMN avatar_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'students' AND column_name = 'administrative_documents'
  ) THEN
    ALTER TABLE students ADD COLUMN administrative_documents JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add avatar and documents to teachers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teachers' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE teachers ADD COLUMN avatar_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teachers' AND column_name = 'administrative_documents'
  ) THEN
    ALTER TABLE teachers ADD COLUMN administrative_documents JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add documents to courses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'documents'
  ) THEN
    ALTER TABLE courses ADD COLUMN documents JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add image to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE events ADD COLUMN image_url TEXT;
  END IF;
END $$;

-- Add logo and avatar to schools table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'schools' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE schools ADD COLUMN logo_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'schools' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE schools ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_avatar ON students(avatar_url) WHERE avatar_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_teachers_avatar ON teachers(avatar_url) WHERE avatar_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_image ON events(image_url) WHERE image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_schools_logo ON schools(logo_url) WHERE logo_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_schools_avatar ON schools(avatar_url) WHERE avatar_url IS NOT NULL;