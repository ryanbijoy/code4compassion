import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Institution {
  id: string;
  name: string;
  type: 'University' | 'Corporation' | 'Government';
  location?: string;
  website?: string;
  score?: string;
  numeric_score?: number;
  animal_welfare_score?: number;
  environmental_score?: number;
  students?: number;
  employees?: number;
  last_updated: string;
  created_at: string;
}

export interface InstitutionSubmission {
  id: string;
  institution_name: string;
  submitter_email?: string;
  status: 'pending' | 'processing' | 'completed' | 'duplicate';
  created_at: string;
  processed_at?: string;
  notes?: string;
}

export interface InstitutionAnalysis {
  id: string;
  submission_id: string;
  institution_name: string;
  analysis_content: string;
  animal_welfare_summary?: string;
  environmental_summary?: string;
  overall_assessment?: string;
  created_at: string;
}

export interface DetailedInstitutionAnalysis {
  id: string;
  submission_id: string;
  institution_name: string;
  institution_type: 'university' | 'corporation' | 'government' | 'NGO' | 'other';
  environmental_policy?: string;
  carbon_emissions_report_link?: string;
  carbon_emissions_details?: string;
  animal_welfare_policy?: string;
  vegan_options?: string;
  certifications: string[] | string;
  ratings_reviews: string;
  scores: {
    environmental_impact: {
      percentage: number;
    };
    animal_welfare: {
      percentage: number;
    };
    vegan_accommodation?: {
      percentage: number | string;
    };
  };
  overall_percentile_score: number;
  overall_percentile_grade: string;
  overall_grade_score: number;
  overall_grade: string;
  sources: string[];
  overall_assessment: {
    summary?: string;
    recommendations?: string[];
    environmental?: string;
    animal_welfare?: string;
    vegan?: string;
  };
  created_at: string;
  updated_at: string;
}

// Database functions
export const institutionService = {
  // Get all institutions with optional filtering
  async getInstitutions(filters?: {
    type?: string;
    search?: string;
    sortBy?: 'score' | 'name' | 'created_at';
  }) {
    let query = supabase
      .from('institutions')
      .select('*');

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    if (filters?.sortBy === 'score') {
      query = query.order('numeric_score', { ascending: false });
    } else if (filters?.sortBy === 'name') {
      query = query.order('name', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as Institution[];
  },

  // Submit a new institution
  async submitInstitution(institutionName: string, submitterEmail?: string) {
    // First check if institution already exists
    const { data: existingInstitution } = await supabase
      .from('institutions')
      .select('name')
      .ilike('name', institutionName)
      .single();

    const status = existingInstitution ? 'duplicate' : 'pending';

    const { data, error } = await supabase
      .from('institution_submissions')
      .insert({
        institution_name: institutionName,
        submitter_email: submitterEmail,
        status
      })
      .select()
      .single();

    if (error) throw error;
    return data as InstitutionSubmission;
  },

  // Get submission by ID
  async getSubmission(id: string) {
    const { data, error } = await supabase
      .from('institution_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as InstitutionSubmission;
  },

  // Get recent submissions
  async getRecentSubmissions(limit = 10) {
    const { data, error } = await supabase
      .from('institution_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as InstitutionSubmission[];
  },

  // Store analysis results from n8n
  async storeAnalysis(submissionId: string, institutionName: string, analysisContent: string) {
    // Parse the analysis content to extract sections
    const animalWelfareMatch = analysisContent.match(/\*\*Animal Welfare:\*\*(.*?)(?=\*\*|$)/s);
    const environmentalMatch = analysisContent.match(/\*\*Environmental Practices:\*\*(.*?)(?=\*\*|$)/s);
    const overallMatch = analysisContent.match(/\*\*Overall Assessment:\*\*(.*?)(?=\*\*|$)/s);

    const { data, error } = await supabase
      .from('institution_analysis')
      .insert({
        submission_id: submissionId,
        institution_name: institutionName,
        analysis_content: analysisContent,
        animal_welfare_summary: animalWelfareMatch?.[1]?.trim(),
        environmental_summary: environmentalMatch?.[1]?.trim(),
        overall_assessment: overallMatch?.[1]?.trim()
      })
      .select()
      .single();

    if (error) throw error;
    return data as InstitutionAnalysis;
  },

  // Store detailed analysis results from n8n (NEW FORMAT)
  async storeDetailedAnalysis(submissionId: string, analysisData: any) {
    const { data, error } = await supabase
      .from('detailed_institution_analysis')
      .insert({
        submission_id: submissionId,
        institution_name: analysisData.name,
        institution_type: analysisData.type,
        environmental_policy: analysisData.environmental_policy,
        carbon_emissions_report_link: analysisData.carbon_emissions?.latest_report,
        carbon_emissions_details: analysisData.carbon_emissions?.emission_details,
        animal_welfare_policy: analysisData.animal_welfare_policy,
        vegan_options: analysisData.vegan_options,
        certifications: analysisData.certifications || [],
        ratings_reviews: analysisData.ratings_or_reviews || '',
        scores: analysisData.scores || {},
        overall_percentile_score: parseInt(analysisData.overall_percentile?.total_score) || 0,
        overall_percentile_grade: analysisData.overall_percentile?.grade || 'NA',
        overall_grade_score: parseInt(analysisData.overall_grade?.average_score) || 0,
        overall_grade: analysisData.overall_grade?.grade || 'NA',
        sources: analysisData.sources || [],
        overall_assessment: analysisData.overall_assessment || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data as DetailedInstitutionAnalysis;
  },

  // Get analysis by submission ID
  async getAnalysisBySubmissionId(submissionId: string) {
    const { data, error } = await supabase
      .from('institution_analysis')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data as InstitutionAnalysis | null;
  },

  // Get detailed analysis by submission ID
  async getDetailedAnalysisBySubmissionId(submissionId: string) {
    const { data, error } = await supabase
      .from('detailed_institution_analysis')
      .select('*')
      .eq('submission_id', submissionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as DetailedInstitutionAnalysis | null;
  },

  // Get analysis by institution name
  async getAnalysisByInstitutionName(institutionName: string) {
    const { data, error } = await supabase
      .from('institution_analysis')
      .select('*')
      .ilike('institution_name', institutionName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as InstitutionAnalysis | null;
  },

  // Get detailed analysis by institution name
  async getDetailedAnalysisByInstitutionName(institutionName: string) {
    const { data, error } = await supabase
      .from('detailed_institution_analysis')
      .select('*')
      .ilike('institution_name', institutionName)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as DetailedInstitutionAnalysis | null;
  },

  // Get recent analyses
  async getRecentAnalyses(limit = 10) {
    const { data, error } = await supabase
      .from('institution_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as InstitutionAnalysis[];
  },

  // Get recent detailed analyses
  async getRecentDetailedAnalyses(limit = 10) {
    const { data, error } = await supabase
      .from('detailed_institution_analysis')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as DetailedInstitutionAnalysis[];
  }
};