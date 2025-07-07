import React, { useState } from 'react';
import { Search, Filter, Award, TrendingUp, TrendingDown, CaseSensitive as University, Building, Landmark } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('score');

  const institutions = [
    {
      id: 1,
      name: 'Indian Institute of Technology Delhi',
      type: 'University',
      score: 'A+',
      numericScore: 92,
      change: '+5',
      animalWelfare: 90,
      environmental: 94,
      location: 'Delhi, India',
      students: 8000,
    },
    {
      id: 2,
      name: 'Tata Consultancy Services',
      type: 'Corporation',
      score: 'A',
      numericScore: 87,
      change: '+2',
      animalWelfare: 85,
      environmental: 89,
      location: 'Mumbai, India',
      employees: 500000,
    },
    {
      id: 3,
      name: 'Ministry of Environment & Climate Change',
      type: 'Government',
      score: 'B+',
      numericScore: 78,
      change: '-1',
      animalWelfare: 75,
      environmental: 81,
      location: 'New Delhi, India',
      employees: 2500,
    },
    {
      id: 4,
      name: 'University of Mumbai',
      type: 'University',
      score: 'B',
      numericScore: 73,
      change: '+8',
      animalWelfare: 70,
      environmental: 76,
      location: 'Mumbai, India',
      students: 45000,
    },
    {
      id: 5,
      name: 'Infosys Limited',
      type: 'Corporation',
      score: 'A-',
      numericScore: 84,
      change: '+3',
      animalWelfare: 82,
      environmental: 86,
      location: 'Bengaluru, India',
      employees: 250000,
    },
    {
      id: 6,
      name: 'Indian Institute of Science',
      type: 'University',
      score: 'A+',
      numericScore: 95,
      change: '+1',
      animalWelfare: 96,
      environmental: 94,
      location: 'Bengaluru, India',
      students: 3500,
    },
  ];

  const getScoreColor = (score: string) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'University': return <University className="w-5 h-5" />;
      case 'Corporation': return <Building className="w-5 h-5" />;
      case 'Government': return <Landmark className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  const filteredInstitutions = institutions
    .filter(institution => 
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === 'all' || institution.type === selectedType)
    )
    .sort((a, b) => {
      if (sortBy === 'score') return b.numericScore - a.numericScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'change') return parseInt(b.change) - parseInt(a.change);
      return 0;
    });

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
              <option value="change">Sort by Change</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInstitutions.map((institution) => (
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
                      <span>•</span>
                      <span>{institution.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(institution.score)}`}>
                    {institution.score}
                  </div>
                  <div className="flex items-center mt-1">
                    {parseInt(institution.change) > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${parseInt(institution.change) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {institution.change}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Animal Welfare</div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${institution.animalWelfare}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{institution.animalWelfare}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Environmental</div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${institution.environmental}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{institution.environmental}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  {institution.type === 'University' ? 
                    `${institution.students?.toLocaleString()} students` : 
                    `${institution.employees?.toLocaleString()} employees`
                  }
                </span>
                <span>Overall: {institution.numericScore}/100</span>
              </div>
            </div>
          ))}
        </div>

        {filteredInstitutions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No institutions found matching your criteria.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;