/*
  # Add storage bucket and policies

  1. New Features
    - Create designs storage bucket
    - Add storage policies for authenticated users
    - Add bucket size limits

  2. Security
    - Enable RLS for storage
    - Restrict access to user's own files
    - Add file type validation
*/

-- Create storage bucket for designs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('designs', 'designs', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Users can upload design files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'designs'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND (lower(storage.extension(name)) = ANY (ARRAY['png', 'jpg', 'jpeg', 'gif', 'svg']))
);

CREATE POLICY "Users can view their own designs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'designs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own designs"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'designs'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'designs'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND (lower(storage.extension(name)) = ANY (ARRAY['png', 'jpg', 'jpeg', 'gif', 'svg']))
);

CREATE POLICY "Users can delete their own designs"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'designs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Update bucket configuration
UPDATE storage.buckets
SET public = false,
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml']
WHERE id = 'designs';