-- Create jobs table for job application tracking
CREATE TABLE public.jobs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  link TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  reasoning TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  cover_letter TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'applied', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON public.jobs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create policy to allow read access for anonymous users (for demo purposes)
CREATE POLICY "Allow read for anonymous users"
ON public.jobs
FOR SELECT
TO anon
USING (true);

-- Create index on score for efficient filtering
CREATE INDEX idx_jobs_score ON public.jobs(score);

-- Create index on status for efficient filtering
CREATE INDEX idx_jobs_status ON public.jobs(status);

-- Create index on created_at for sorting
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);