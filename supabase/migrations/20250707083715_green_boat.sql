/*
  # Create comprehensive analysis schema for detailed n8n output

  1. New Tables
    - `detailed_institution_analysis`
      - Stores all the comprehensive data from n8n workflow
      - Includes environmental policies, animal welfare, scores, certifications
      - Structured JSON fields for complex data like ratings and scores
      - Links to original submission

  2. Security
    - Enable RLS on new table
    - Add policies for public read access
    - Add policies for service to insert analysis results
*/

CREATE TABLE IF NOT EXISTS detailed_institution_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES institution_submissions(id),
  institution_name text NOT NULL,
  institution_type text CHECK (institution_type IN ('university', 'corporation', 'government', 'NGO', 'other')),
  
  -- Environmental data
  environmental_policy text,
  carbon_emissions_report_link text,
  carbon_emissions_details text,
  
  -- Animal welfare data
  animal_welfare_policy text,
  vegan_options text,
  
  -- Certifications (stored as JSON array)
  certifications jsonb DEFAULT '[]'::jsonb,
  
  -- Ratings and reviews (stored as JSON object)
  ratings_reviews jsonb DEFAULT '{}'::jsonb,
  
  -- Detailed scores (stored as JSON object)
  scores jsonb DEFAULT '{}'::jsonb,
  
  -- Overall scores
  overall_percentile_score integer,
  overall_percentile_grade text,
  overall_grade_score integer,
  overall_grade text,
  
  -- Sources (stored as JSON array)
  sources jsonb DEFAULT '[]'::jsonb,
  
  -- Overall assessment (stored as JSON object)
  overall_assessment jsonb DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE detailed_institution_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read detailed analysis"
  ON detailed_institution_analysis
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service can insert detailed analysis"
  ON detailed_institution_analysis
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service can update detailed analysis"
  ON detailed_institution_analysis
  FOR UPDATE
  TO public
  USING (true);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_detailed_analysis_submission_id 
  ON detailed_institution_analysis(submission_id);

CREATE INDEX IF NOT EXISTS idx_detailed_analysis_institution_name 
  ON detailed_institution_analysis(institution_name);

CREATE INDEX IF NOT EXISTS idx_detailed_analysis_type 
  ON detailed_institution_analysis(institution_type);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_detailed_analysis_updated_at 
  BEFORE UPDATE ON detailed_institution_analysis 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();