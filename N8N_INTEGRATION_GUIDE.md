# N8N Integration Guide for EcoScore

## Overview
This guide explains how to integrate your n8n workflow with the EcoScore application to store detailed analysis results.

## Database Schema
The detailed analysis data is stored in the `detailed_institution_analysis` table with the following structure:

### Required Fields
- `submission_id` (uuid) - Links to the original submission
- `institution_name` (text) - Name of the institution
- `institution_type` (text) - Type: university, corporation, government, NGO, or other

### Analysis Data Fields
- `environmental_policy` (text) - Summary of environmental policies
- `carbon_emissions_report_link` (text) - Link to emissions report
- `carbon_emissions_details` (text) - Carbon footprint details
- `animal_welfare_policy` (text) - Animal welfare policies
- `vegan_options` (text) - Vegan accommodation details
- `certifications` (jsonb) - Array of certifications
- `ratings_reviews` (jsonb) - External ratings and reviews
- `scores` (jsonb) - Detailed scoring breakdown
- `overall_percentile_score` (integer) - Overall score 0-100
- `overall_grade` (text) - Letter grade (A+, A, B+, etc.)
- `sources` (jsonb) - Array of source URLs
- `overall_assessment` (jsonb) - Assessment summary and recommendations

## N8N Workflow Integration

### Step 1: Receive Webhook Data
Your n8n workflow should receive the submission data from the EcoScore form submission webhook.

### Step 2: Process Institution Analysis
Perform your AI analysis to generate the detailed evaluation data.

### Step 3: Format Response Data
Structure your response data according to this JSON format:

```json
{
  "name": "Institution Name",
  "type": "corporation",
  "environmental_policy": "Policy summary...",
  "carbon_emissions": {
    "latest_report": "https://example.com/report.pdf",
    "emission_details": "Emissions details..."
  },
  "animal_welfare_policy": "Animal welfare summary...",
  "vegan_options": "Vegan options or NA",
  "certifications": ["ISO 14001", "B Corp"],
  "ratings_or_reviews": "External reviews summary...",
  "scores": {
    "environmental_impact": {
      "percentage": 85
    },
    "animal_welfare": {
      "percentage": 78
    },
    "vegan_accommodation": {
      "percentage": 65
    }
  },
  "overall_percentile": {
    "total_score": "76"
  },
  "overall_grade": {
    "grade": "B+"
  },
  "sources": [
    "https://example.com/source1",
    "https://example.com/source2"
  ],
  "overall_assessment": {
    "summary": "Overall assessment summary...",
    "recommendations": [
      "Recommendation 1",
      "Recommendation 2"
    ]
  }
}
```

### Step 4: Store Results in Supabase
Use the Supabase HTTP node to insert the analysis results:

**Endpoint:** `POST https://your-supabase-url.supabase.co/rest/v1/detailed_institution_analysis`

**Headers:**
```
apikey: your-supabase-anon-key
Authorization: Bearer your-supabase-anon-key
Content-Type: application/json
Prefer: return=representation
```

**Body:** Transform your analysis data to match the database schema:
```json
{
  "submission_id": "{{ $node['Webhook'].json['submissionId'] }}",
  "institution_name": "{{ $node['AI Analysis'].json['name'] }}",
  "institution_type": "{{ $node['AI Analysis'].json['type'] }}",
  "environmental_policy": "{{ $node['AI Analysis'].json['environmental_policy'] }}",
  "carbon_emissions_report_link": "{{ $node['AI Analysis'].json['carbon_emissions']['latest_report'] }}",
  "carbon_emissions_details": "{{ $node['AI Analysis'].json['carbon_emissions']['emission_details'] }}",
  "animal_welfare_policy": "{{ $node['AI Analysis'].json['animal_welfare_policy'] }}",
  "vegan_options": "{{ $node['AI Analysis'].json['vegan_options'] }}",
  "certifications": {{ $node['AI Analysis'].json['certifications'] }},
  "ratings_reviews": "{{ $node['AI Analysis'].json['ratings_or_reviews'] }}",
  "scores": {{ $node['AI Analysis'].json['scores'] }},
  "overall_percentile_score": {{ parseInt($node['AI Analysis'].json['overall_percentile']['total_score']) }},
  "overall_grade": "{{ $node['AI Analysis'].json['overall_grade']['grade'] }}",
  "sources": {{ $node['AI Analysis'].json['sources'] }},
  "overall_assessment": {{ $node['AI Analysis'].json['overall_assessment'] }}
}
```

## Frontend Integration
The EcoScore frontend will automatically:
1. Poll for analysis results after form submission
2. Display detailed analysis when available
3. Show progress indicators during processing
4. Handle both basic and detailed analysis formats

## Testing
1. Submit an institution through the EcoScore form
2. Verify the webhook receives the submission data
3. Process the analysis in your n8n workflow
4. Store results in the database
5. Check that the frontend displays the detailed analysis

## Error Handling
- Ensure your n8n workflow handles API errors gracefully
- Include proper error logging for debugging
- Set appropriate timeouts for long-running analysis tasks
- Validate data formats before storing in the database

## Security Notes
- Use environment variables for API keys
- Validate webhook signatures if implemented
- Sanitize input data before processing
- Use HTTPS for all API communications