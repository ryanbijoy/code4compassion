import React from 'react';
import { 
  FileText, 
  Heart, 
  Leaf, 
  Award, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  Star,
  TrendingUp,
  Shield,
  Users,
  Globe,
  Building
} from 'lucide-react';
import { DetailedInstitutionAnalysis } from '../lib/supabase';

interface DetailedAnalysisDisplayProps {
  analysis: DetailedInstitutionAnalysis;
}

const DetailedAnalysisDisplay: React.FC<DetailedAnalysisDisplayProps> = ({ analysis }) => {
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
      case 'university': return <Users className="w-5 h-5" />;
      case 'corporation': return <Building className="w-5 h-5" />;
      case 'government': return <Shield className="w-5 h-5" />;
      case 'NGO': return <Heart className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  // Parse scores from the data structure
  const environmentalScore = analysis.scores?.environmental_impact?.percentage || 0;
  const animalWelfareScore = analysis.scores?.animal_welfare?.percentage || 0;
  const veganScore = analysis.scores?.vegan_accommodation?.percentage;

  // Parse certifications - handle both string and array formats
  const certifications = Array.isArray(analysis.certifications) 
    ? analysis.certifications 
    : (typeof analysis.certifications === 'string' 
        ? [analysis.certifications] 
        : []);

  // Parse sources
  const sources = Array.isArray(analysis.sources) ? analysis.sources : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            {getTypeIcon(analysis.institution_type)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {analysis.institution_name}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-600 capitalize">{analysis.institution_type}</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  Analyzed on {new Date(analysis.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg border-2 ${getGradeColor(analysis.overall_grade)}`}>
          <div className="text-2xl font-bold">{analysis.overall_grade}</div>
          <div className="text-sm">Overall Grade</div>
          <div className="text-xs text-gray-600 mt-1">{analysis.overall_percentile_score}/100</div>
        </div>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Environmental Impact</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-700 mb-2">
            70%
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${environmentalScore}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-800">Animal Welfare</h3>
            </div>
          </div>
          <div className="text-3xl font-bold text-red-700 mb-2">
            {animalWelfareScore}%
          </div>
          <div className="w-full bg-red-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${animalWelfareScore}%` }}
            ></div>
          </div>
        </div>

        {veganScore && veganScore !== 'NA' && (
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-800">Vegan Accommodation</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {veganScore}%
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${veganScore}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Policies Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Environmental Policy */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Environmental Policy</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {analysis.environmental_policy || 'No environmental policy information available.'}
          </p>
          {analysis.carbon_emissions_details && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Carbon Emissions</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysis.carbon_emissions_details}
              </p>
              {analysis.carbon_emissions_report_link && (
                <a 
                  href={analysis.carbon_emissions_report_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Report
                </a>
              )}
            </div>
          )}
        </div>

        {/* Animal Welfare Policy */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Animal Welfare Policy</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            {analysis.animal_welfare_policy || 'No animal welfare policy information available.'}
          </p>
          {analysis.vegan_options && analysis.vegan_options !== 'NA' && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Vegan Options</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysis.vegan_options}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Certifications and Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-800">Certifications</h3>
            </div>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ratings */}
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-semibold text-yellow-800">External Reviews</h3>
          </div>
          <div className="bg-white rounded-lg p-3 border border-yellow-200">
            <p className="text-yellow-700 text-sm leading-relaxed">
              {analysis.ratings_reviews || 'No external ratings or reviews available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Overall Assessment */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-6 h-6 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Overall Assessment</h3>
        </div>
        
        {analysis.overall_assessment && typeof analysis.overall_assessment === 'object' && (
          <div className="space-y-6">
            {analysis.overall_assessment.summary && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
                <p className="text-gray-700 leading-relaxed">
                  {analysis.overall_assessment.summary}
                </p>
              </div>
            )}
            
            {analysis.overall_assessment.recommendations && Array.isArray(analysis.overall_assessment.recommendations) && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {analysis.overall_assessment.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ExternalLink className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Sources</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {sources.map((source, index) => (
              <a
                key={index}
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm p-2 rounded hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{source}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This analysis is based on publicly available information and AI processing. 
          Scores are calculated using our proprietary methodology that evaluates environmental impact, 
          animal welfare policies, and transparency measures. For the most accurate and up-to-date information, 
          please refer to the institution's official policies and reports.
        </p>
      </div>
    </div>
  );
};

export default DetailedAnalysisDisplay;