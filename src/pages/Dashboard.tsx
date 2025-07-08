import React, { useState, useEffect } from 'react';
import { Search, Filter, Award, TrendingUp, TrendingDown, CaseSensitive as University, Building, Landmark, Loader, Eye, Clock, Star } from 'lucide-react';
import { institutionService, Institution, DetailedInstitutionAnalysis } from '../lib/supabase';
import DetailedAnalysisDisplay from '../components/DetailedAnalysisDisplay';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [recentAnalyses, setRecentAnalyses] = useState<DetailedInstitutionAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<DetailedInstitutionAnalysis | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchTerm, selectedType, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load institutions
      const institutionsData = await institutionService.getInstitutions({
        type: selectedType,
        search: searchTerm,
        sortBy: sortBy as 'score' | 'name' | 'created_at'
      });
      setInstitutions(institutionsData);

      // Load recent detailed analyses
      const recentAnalysesData = await institutionService.getRecentDetailedAnalyses(6);
      setRecentAnalyses(recentAnalysesData);
      
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAnalysis = async (institutionName: string) => {
    try {
      const analysis = await institutionService.getDetailedAnalysisByInstitutionName(institutionName);
      if (analysis) {
        setSelectedAnalysis(analysis);
        setShowAnalysisModal(true);
      }
    } catch (err) {
      console.error('Error loading analysis:', err);
    }
  };

  const getScoreColor = (score?: string) => {
    if (!score) return 'text-gray-600 bg-gray-50';
    switch (score) {
      case 'A+': return 'text-green-700 bg-green-100';
      case 'A': return 'text-green-600 bg-green-50';
      case 'A-': return 'text-lime-600 bg-lime-50';
      case 'B+': return 'text-yellow-600 bg-yellow-50';
      case 'B': return 'text-orange-600 bg-orange-50';
      case 'B-': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'text-green-700 bg-green-100 border-green-200';
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'A-': return 'text-lime-600 bg-lime-50 border-lime-200';
      case 'B+': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'B': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'B-': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'University':
      case 'university': 
        return <University className="w-5 h-5" />;
      case 'Corporation':
      case 'corporation': 
        return <Building className="w-5 h-5" />;
      case 'Government':
      case 'government': 
        return <Landmark className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const getChangeIndicator = (score?: number) => {
    if (!score) return null;
    // Simulate change for demo purposes
    const change = Math.floor(Math.random() * 10) - 5;
    return change > 0 ? (
      <div className="flex items-center text-green-600">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span className="text-sm">+{change}</span>
      </div>
    ) : change < 0 ? (
      <div className="flex items-center text-red-600">
        <TrendingDown className="w-4 h-4 mr-1" />
        <span className="text-sm">{change}</span>
      </div>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Institution Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive scoring of institutions based on animal welfare and environmental impact policies
          </p>
        </div>

        {/* Recent Analyses Section */}
        {recentAnalyses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent AI Analyses</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-4 h-4 mr-1" />
                <span>Latest comprehensive evaluations</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                        {getTypeIcon(analysis.institution_type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {analysis.institution_name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                          <span className="capitalize">{analysis.institution_type}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border ${getGradeColor(analysis.overall_grade)}`}>
                      <div className="text-lg font-bold">{analysis.overall_grade}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-green-600 font-medium mb-1">Environmental</div>
                      <div className="text-lg font-bold text-green-700">
                        {analysis.scores?.environmental_impact?.percentage || 0}%
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-xs text-red-600 font-medium mb-1">Animal Welfare</div>
                      <div className="text-lg font-bold text-red-700">
                        {analysis.scores?.animal_welfare?.percentage || 0}%
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedAnalysis(analysis);
                      setShowAnalysisModal(true);
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Analysis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search institutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="University">Universities</option>
              <option value="Corporation">Corporations</option>
              <option value="Government">Government</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
              <option value="created_at">Sort by Date Added</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading institutions...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Institution Results */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Institutions</h2>
              <span className="text-sm text-gray-500">
                {institutions.length} institution{institutions.length !== 1 ? 's' : ''} found
              </span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {institutions.map((institution) => (
                <div key={institution.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                        {getTypeIcon(institution.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{institution.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{institution.type}</span>
                          {institution.location && (
                            <>
                              <span>•</span>
                              <span>{institution.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end space-y-2">
                      {institution.score && (
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(institution.score)}`}>
                          {institution.score}
                        </div>
                      )}
                      {getChangeIndicator(institution.numeric_score)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Animal Welfare</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${institution.animal_welfare_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{institution.animal_welfare_score || 90}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Environmental</div>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${institution.environmental_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{institution.environmental_score || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {institution.type === 'University' ? 
                        `${institution.students?.toLocaleString() || 'N/A'} students` : 
                        `${institution.employees?.toLocaleString() || 'N/A'} employees`
                      }
                    </span>
                    <div className="flex items-center space-x-3">
                      <span>Overall: {institution.numeric_score || 0}/100</span>
                      <button
                        onClick={() => handleViewAnalysis(institution.name)}
                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Analysis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !error && institutions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No institutions found matching your criteria.</div>
          </div>
        )}
      </div>

      {/* Analysis Modal */}
      {showAnalysisModal && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Detailed Analysis</h2>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <DetailedAnalysisDisplay analysis={selectedAnalysis} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;