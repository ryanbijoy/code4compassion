import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, TrendingUp, Users, Leaf, Heart, Globe, Building, Mail, CheckCircle, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import { institutionService } from '../lib/supabase';
import AnalysisDisplay from '../components/AnalysisDisplay';
import DetailedAnalysisDisplay from '../components/DetailedAnalysisDisplay';

const Home: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const stats = [
    { label: 'Institutions Scored', value: '1,247', icon: Award },
    { label: 'Improvement Rate', value: '34%', icon: TrendingUp },
    { label: 'Active Contributors', value: '892', icon: Users },
    { label: 'Animals Impacted', value: '2.3M+', icon: Heart },
  ];

  const featuredInstitution = {
    name: 'Indian Institute of Technology Delhi',
    score: 'A+',
    category: 'University',
    improvements: ['Sustainable campus initiatives', 'Animal welfare policies', 'Green energy adoption'],
  };

  // Check for analysis results periodically after submission
  useEffect(() => {
    if (submissionId && isSubmitted && !isDuplicate) {
      const checkForAnalysis = async () => {
        try {
          setIsLoadingAnalysis(true);
          
          // Check for detailed analysis first (priority)
          const detailedAnalysisResult = await institutionService.getDetailedAnalysisBySubmissionId(submissionId);
          if (detailedAnalysisResult) {
            setDetailedAnalysis(detailedAnalysisResult);
            setIsLoadingAnalysis(false);
            return;
          }

          // Fallback to basic analysis
          const analysisResult = await institutionService.getAnalysisBySubmissionId(submissionId);
          if (analysisResult) {
            setAnalysis(analysisResult);
            setIsLoadingAnalysis(false);
          }
        } catch (err) {
          console.error('Error checking for analysis:', err);
        }
      };

      // Check immediately
      checkForAnalysis();

      // Then check every 5 seconds for up to 10 minutes
      const interval = setInterval(checkForAnalysis, 5000);
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setIsLoadingAnalysis(false);
        if (!analysis && !detailedAnalysis) {
          setAnalysisError('Analysis is taking longer than expected. Please check back later or refresh the page.');
        }
      }, 600000); // 10 minutes

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [submissionId, isSubmitted, isDuplicate, analysis, detailedAnalysis]);

  // Check for existing analysis if duplicate
  useEffect(() => {
    if (isDuplicate && companyName) {
      const checkExistingAnalysis = async () => {
        try {
          // Check for detailed analysis first
          const existingDetailedAnalysis = await institutionService.getDetailedAnalysisByInstitutionName(companyName);
          if (existingDetailedAnalysis) {
            setDetailedAnalysis(existingDetailedAnalysis);
            return;
          }

          // Fallback to basic analysis
          const existingAnalysis = await institutionService.getAnalysisByInstitutionName(companyName);
          if (existingAnalysis) {
            setAnalysis(existingAnalysis);
          }
        } catch (err) {
          console.error('Error checking existing analysis:', err);
        }
      };
      checkExistingAnalysis();
    }
  }, [isDuplicate, companyName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setIsSubmitting(true);
    setError('');
    setIsDuplicate(false);
    setAnalysis(null);
    setDetailedAnalysis(null);
    setAnalysisError('');

    try {
      // Submit to database
      const submission = await institutionService.submitInstitution(
        companyName.trim(),
        email.trim() || undefined
      );

      setSubmissionId(submission.id);

      // Also send to n8n webhook for processing
      try {
        await fetch('https://code4compassionmumbai.app.n8n.cloud/webhook-test/form-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            institutionName: companyName.trim(),
            email: email.trim() || null,
            submissionId: submission.id,
            submittedAt: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.warn('Webhook failed, but database submission succeeded:', webhookError);
      }

      setIsSubmitted(true);
      setIsDuplicate(submission.status === 'duplicate');

    } catch (err: any) {
      setError(err.message || 'Failed to submit institution. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSubmission = () => {
    setIsSubmitted(false);
    setCompanyName('');
    setEmail('');
    setIsDuplicate(false);
    setSubmissionId(null);
    setAnalysis(null);
    setDetailedAnalysis(null);
    setAnalysisError('');
    setIsLoadingAnalysis(false);
  };

  const handleRefreshAnalysis = async () => {
    if (submissionId) {
      try {
        setIsLoadingAnalysis(true);
        setAnalysisError('');
        
        // Check for detailed analysis first
        const detailedAnalysisResult = await institutionService.getDetailedAnalysisBySubmissionId(submissionId);
        if (detailedAnalysisResult) {
          setDetailedAnalysis(detailedAnalysisResult);
          return;
        }

        // Fallback to basic analysis
        const analysisResult = await institutionService.getAnalysisBySubmissionId(submissionId);
        if (analysisResult) {
          setAnalysis(analysisResult);
        } else {
          setAnalysisError('Analysis not ready yet. Please try again in a few moments.');
        }
      } catch (err) {
        setAnalysisError('Failed to load analysis. Please try again.');
      } finally {
        setIsLoadingAnalysis(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <Leaf className="w-8 h-8 text-green-600" />
                <Heart className="w-8 h-8 text-red-500" />
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforming Institutions Through
              <span className="text-green-600"> Transparency</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We score universities, corporations, and government bodies on their animal welfare and environmental impact policies, driving positive change through accountability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg"
              >
                View Scores
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </Link>
              <a
                href="#submit-company"
                className="inline-flex items-center px-8 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors shadow-lg"
              >
                Submit Institution
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Company Section */}
      <section id="submit-company" className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Building className="w-16 h-16 mx-auto mb-4 text-white" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Submit an Institution for Scoring
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Know an institution that should be evaluated? Help us expand our database and drive transparency across more organizations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter university, corporation, or government body name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Get AI-summarized updates about this institution"
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send you AI-generated summaries when this institution is scored or updated
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !companyName.trim()}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Institution'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isDuplicate ? 'Institution Already Exists!' : 'Submission Received!'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isDuplicate ? (
                    <>
                      <strong>{companyName}</strong> is already in our database. You can view its current score in the dashboard.
                    </>
                  ) : (
                    <>
                      Thank you for submitting <strong>{companyName}</strong>. We'll review and score this institution soon.
                    </>
                  )}
                </p>
                {email && (
                  <p className="text-sm text-gray-500 mb-4">
                    We'll send AI-summarized updates to <strong>{email}</strong> when available.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {isDuplicate && (
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View in Dashboard
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={handleNewSubmission}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Submit Another Institution
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Analysis Results Section */}
      {isSubmitted && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoadingAnalysis && !analysis && !detailedAnalysis && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI Analysis in Progress
                </h3>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Our advanced AI system is analyzing <strong>{companyName}</strong>'s policies, sustainability reports, and public information. A detailed Summary has been sent to the provided Email.
                  For detailed analysis and visual representation please wait 2-3 minutes.
                </p>
                
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-sm">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gathering data sources...</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Processing environmental policies...</span>
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Analyzing animal welfare practices...</span>
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Generating comprehensive report...</span>
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-6">
                  Please keep this page open. Results will appear automatically when ready.
                </p>
              </div>
            )}

            {/* Error State */}
            {analysisError && !analysis && !detailedAnalysis && (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Status Update</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{analysisError}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRefreshAnalysis}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Check for Results
                  </button>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Browse Other Institutions
                  </Link>
                </div>
              </div>
            )}

            {/* Detailed Analysis Results */}
            {detailedAnalysis && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-800 font-semibold">Analysis Complete</span>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Comprehensive Analysis Results
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Here's our detailed AI-powered evaluation of <strong>{companyName}</strong>'s environmental impact and animal welfare practices.
                  </p>
                </div>
                <DetailedAnalysisDisplay analysis={detailedAnalysis} />
                
                {/* Action Buttons */}
                <div className="text-center pt-8">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleNewSubmission}
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Submit Another Institution
                    </button>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View All Institutions
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Analysis Results (Fallback) */}
            {analysis && !detailedAnalysis && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                      <span className="text-blue-800 font-semibold">Analysis Complete</span>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Analysis Results
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Here's what our AI analysis found about <strong>{companyName}</strong>'s policies and practices.
                  </p>
                </div>
                <AnalysisDisplay analysis={analysis} institutionName={companyName} />
                
                {/* Action Buttons */}
                <div className="text-center pt-8">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleNewSubmission}
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Submit Another Institution
                    </button>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View All Institutions
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why It Matters Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Animal Welfare and Sustainability Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Institutions have immense power to shape our world. By measuring and publicizing their commitment to animal welfare and environmental sustainability, we create accountability that drives real change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Animal Welfare</h3>
              <p className="text-gray-600">
                Ensuring ethical treatment of animals in research, food services, and campus policies.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Globe className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Environmental Impact</h3>
              <p className="text-gray-600">
                Measuring carbon footprint, sustainable practices, and green initiatives.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Driving Change</h3>
              <p className="text-gray-600">
                Transparency creates pressure for improvement and rewards leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Institution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Institution
            </h2>
            <p className="text-xl text-gray-600">
              Highlighting institutions that are leading the way in sustainability and animal welfare
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {featuredInstitution.name}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {featuredInstitution.category}
                </span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600 mb-1">
                  {featuredInstitution.score}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Improvements</h4>
              <ul className="space-y-2">
                {featuredInstitution.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our mission to create transparency and drive positive change in animal welfare and environmental practices across institutions worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#submit-company"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors"
            >
              Submit Institution
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
            </a>
            <Link
              to="/methodology"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-gray-900 transition-colors"
            >
              Learn Our Process
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;