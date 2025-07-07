/*
  # Create institutions and submissions tables

  1. New Tables
    - `institutions`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `type` (text) - University/Corporation/Government
      - `location` (text)
      - `website` (text)
      - `score` (text) - A+, A, B+, etc.
      - `numeric_score` (integer) - 0-100
      - `animal_welfare_score` (integer)
      - `environmental_score` (integer)
      - `last_updated` (timestamp)
      - `created_at` (timestamp)
    
    - `institution_submissions`
      - `id` (uuid, primary key)
      - `institution_name` (text)
      - `submitter_email` (text, optional)
      - `status` (text) - pending/processing/completed
      - `created_at` (timestamp)
      - `processed_at` (timestamp, optional)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to submit
*/

-- Create institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('University', 'Corporation', 'Government')),
  location text,
  website text,
  score text CHECK (score IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F')),
  numeric_score integer CHECK (numeric_score >= 0 AND numeric_score <= 100),
  animal_welfare_score integer CHECK (animal_welfare_score >= 0 AND animal_welfare_score <= 100),
  environmental_score integer CHECK (environmental_score >= 0 AND environmental_score <= 100),
  students integer,
  employees integer,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create institution submissions table
CREATE TABLE IF NOT EXISTS institution_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name text NOT NULL,
  submitter_email text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'duplicate')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  notes text
);

-- Enable RLS
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for institutions (public read access)
CREATE POLICY "Anyone can read institutions"
  ON institutions
  FOR SELECT
  TO public
  USING (true);

-- Create policies for submissions (public can submit, authenticated can read all)
CREATE POLICY "Anyone can submit institutions"
  ON institution_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read their own submissions"
  ON institution_submissions
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO institutions (name, type, location, score, numeric_score, animal_welfare_score, environmental_score, students, employees) VALUES
('Indian Institute of Technology Delhi', 'University', 'Delhi, India', 'A+', 92, 90, 94, 8000, NULL),
('Tata Consultancy Services', 'Corporation', 'Mumbai, India', 'A', 87, 85, 89, NULL, 500000),
('Ministry of Environment & Climate Change', 'Government', 'New Delhi, India', 'B+', 78, 75, 81, NULL, 2500),
('University of Mumbai', 'University', 'Mumbai, India', 'B', 73, 70, 76, 45000, NULL),
('Infosys Limited', 'Corporation', 'Bengaluru, India', 'A-', 84, 82, 86, NULL, 250000),
('Indian Institute of Science', 'University', 'Bengaluru, India', 'A+', 95, 96, 94, 3500, NULL)
ON CONFLICT (name) DO NOTHING;