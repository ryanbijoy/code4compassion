import React from 'react';
import { FileText, Heart, Leaf, Award, Clock } from 'lucide-react';
import { InstitutionAnalysis } from '../lib/supabase';

interface AnalysisDisplayProps {
  analysis: InstitutionAnalysis;
  institutionName: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, institutionName }) => {
  const formatAnalysisContent = (content: string) => {
    // Split content into sections and format
    const sections = content.split(/\*\*(.*?)\*\*/g);
    const formattedSections = [];
    
    for (let i = 0; i < sections.length; i += 2) {
      const text = sections[i];
      const heading = sections[i + 1];
      
      if (text && text.trim()) {
        formattedSections.push({
          type: 'text',
          content: text.trim()
        });
      }
      
      if (heading && heading.trim()) {
        formattedSections.push({
          type: 'heading',
          content: heading.trim()
        });
      }
    }
    
    return formattedSections;
  };

  const formatBulletPoints = (text: string) => {
    // Convert markdown-style bullet points to HTML
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        if (line.startsWith('*   ') || line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 mb-2">
              {line.substring(4)}
            </li>
          );
        }
        return (
          <p key={index} className="mb-3 leading-relaxed">
            {line}
          </p>
        );
      });
  };

  const getSectionIcon = (heading: string) => {
    if (heading.toLowerCase().includes('animal')) return Heart;
    if (heading.toLowerCase().includes('environment')) return Leaf;
    if (heading.toLowerCase().includes('assessment')) return Award;
    return FileText;
  };

  const getSectionColor = (heading: string) => {
    if (heading.toLowerCase().includes('animal')) return 'text-red-600 bg-red-50';
    if (heading.toLowerCase().includes('environment')) return 'text-green-600 bg-green-50';
    if (heading.toLowerCase().includes('assessment')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const sections = formatAnalysisContent(analysis.analysis_content);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            AI Analysis Results
          </h2>
          <p className="text-gray-600">
            Comprehensive evaluation of {institutionName}
          </p>
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Clock className="w-4 h-4 mr-2" />
        <span>
          Analysis completed on {new Date(analysis.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => {
          if (section.type === 'heading') {
            const Icon = getSectionIcon(section.content);
            const colorClass = getSectionColor(section.content);
            
            return (
              <div key={index} className="border-l-4 border-blue-500 pl-6">
                <div className={`inline-flex items-center px-3 py-2 rounded-lg ${colorClass} mb-4`}>
                  <Icon className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-semibold">
                    {section.content}
                  </h3>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed">
                  {formatBulletPoints(section.content)}
                </div>
              </div>
            );
          }
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This analysis is based on publicly available information and AI processing. 
          For the most accurate and up-to-date information, please refer to the institution's official 
          policies and reports.
        </p>
      </div>
    </div>
  );
};

export default AnalysisDisplay;