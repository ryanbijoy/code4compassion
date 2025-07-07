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
  }
};