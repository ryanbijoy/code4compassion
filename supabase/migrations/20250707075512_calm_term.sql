/*
  # Add AI Analysis Results Storage

  1. New Tables
    - `institution_analysis`
      - `id` (uuid, primary key)
      - `submission_id` (uuid, foreign key to institution_submissions)
      - `institution_name` (text)
      - `analysis_content` (text, stores the AI analysis)
      - `animal_welfare_summary` (text)
      - `environmental_summary` (text)
      - `overall_assessment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `institution_analysis` table
    - Add policy for public read access to analysis results
*/

CREATE TABLE IF NOT EXISTS institution_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES institution_submissions(id),
  institution_name text NOT NULL,
  analysis_content text NOT NULL,
  animal_welfare_summary text,
  environmental_summary text,
  overall_assessment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE institution_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analysis results"
  ON institution_analysis
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service can insert analysis results"
  ON institution_analysis
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_institution_analysis_submission_id 
  ON institution_analysis(submission_id);

CREATE INDEX IF NOT EXISTS idx_institution_analysis_institution_name 
  ON institution_analysis(institution_name);