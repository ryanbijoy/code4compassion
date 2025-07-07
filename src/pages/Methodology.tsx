import React from 'react';
import { Brain, Database, Award, CheckCircle, AlertCircle, Target } from 'lucide-react';

const Methodology: React.FC = () => {
  const steps = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'We gather publicly available information from institutional websites, reports, and policy documents.',
      details: [
        'Annual sustainability reports',
        'Animal welfare policies',
        'Environmental impact statements',
        'Campus sustainability initiatives',
        'Research ethics guidelines',
      ],
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our Large Language Model (LLM) processes and analyzes the collected data using advanced natural language processing.',
      details: [
        'Policy interpretation and scoring',
        'Consistency analysis across documents',
        'Trend identification over time',
        'Comparative analysis with industry standards',
        'Sentiment analysis of commitment statements',
      ],
    },
    {
      icon: Target,
      title: 'Scoring Framework',
      description: 'Institutions are evaluated across multiple dimensions with weighted scoring based on impact and implementation.',
      details: [
        'Animal welfare practices (40%)',
        'Environmental sustainability (40%)',
        'Transparency and reporting (10%)',
        'Community engagement (10%)',
        'Continuous improvement initiatives',
      ],
    },
    {
      icon: CheckCircle,
      title: 'Verification',
      description: 'Each score undergoes human review and verification to ensure accuracy and fairness.',
      details: [
        'Expert review by domain specialists',
        'Cross-referencing with third-party data',
        'Institution feedback incorporation',
        'Regular score updates and revisions',
        'Appeal process for disputed scores',
      ],
    },
  ];

  const criteria = [
    {
      category: 'Animal Welfare',
      weight: '40%',
      factors: [
        'Research animal care standards',
        'Food service animal welfare policies',
        'Campus animal protection measures',
        'Ethical review processes',
        'Alternative testing methods adoption',
      ],
    },
    {
      category: 'Environmental Impact',
      weight: '40%',
      factors: [
        'Carbon footprint reduction',
        'Renewable energy usage',
        'Waste management programs',
        'Water conservation initiatives',
        'Biodiversity protection efforts',
      ],
    },
    {
      category: 'Transparency',
      weight: '10%',
      factors: [
        'Public reporting frequency',
        'Data accessibility',
        'Goal setting and tracking',
        'Stakeholder engagement',
        'Third-party certifications',
      ],
    },
    {
      category: 'Community Engagement',
      weight: '10%',
      factors: [
        'Local community involvement',
        'Student/employee engagement',
        'Awareness campaigns',
        'Volunteer programs',
        'Educational initiatives',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Methodology
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how we use artificial intelligence and rigorous analysis to evaluate institutions on their animal welfare and environmental impact policies.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our 4-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <step.icon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-3 flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Technology */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-16 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-blue-200" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-lg text-blue-100 mb-6">
              Our Large Language Model (LLM) is specifically trained to understand and evaluate sustainability and animal welfare policies, ensuring consistent and objective scoring across all institutions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">Natural Language Processing</h3>
                <p className="text-sm text-blue-100">
                  Advanced text analysis to understand policy intent and implementation
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">Pattern Recognition</h3>
                <p className="text-sm text-blue-100">
                  Identifies best practices and areas for improvement across institutions
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-semibold mb-2">Continuous Learning</h3>
                <p className="text-sm text-blue-100">
                  Model improves over time with new data and expert feedback
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Criteria */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Scoring Criteria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {criteria.map((criterion, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{criterion.category}</h3>
                  <span className="text-lg font-bold text-green-600">{criterion.weight}</span>
                </div>
                <ul className="space-y-2">
                  {criterion.factors.map((factor, factorIndex) => (
                    <li key={factorIndex} className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Grading Scale */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Grading Scale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">A+</div>
              <div className="text-sm text-gray-600 mb-4">90-100 points</div>
              <p className="text-gray-700">Exceptional commitment to animal welfare and environmental sustainability with innovative practices and transparent reporting.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">B+</div>
              <div className="text-sm text-gray-600 mb-4">70-89 points</div>
              <p className="text-gray-700">Good practices in place with room for improvement. Shows commitment but may lack comprehensive implementation.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">C+</div>
              <div className="text-sm text-gray-600 mb-4">Below 70 points</div>
              <p className="text-gray-700">Limited evidence of commitment to animal welfare and environmental practices. Significant improvements needed.</p>
            </div>
          </div>
        </div>

        {/* Quality Assurance */}
        <div className="bg-gray-100 rounded-lg p-8">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quality Assurance & Transparency
            </h2>
            <p className="text-gray-600 mb-6">
              We are committed to maintaining the highest standards of accuracy and fairness in our scoring process. All institutions have the opportunity to provide feedback and request reviews of their scores.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
                <p className="text-sm text-gray-600">
                  Scores are updated quarterly to reflect new policies and initiatives
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Open Dialogue</h3>
                <p className="text-sm text-gray-600">
                  Institutions can engage with us to discuss their scores and provide additional context
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;