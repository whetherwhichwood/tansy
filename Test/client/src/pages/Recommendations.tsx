import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Recommendation } from '../types'
import { recommendationService } from '../services/recommendationService'
import { Star, CheckCircle, AlertCircle, Download, ArrowLeft } from 'lucide-react'

export const Recommendations: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get recommendations from location state or fetch from API
    if (location.state?.recommendations) {
      setRecommendations(location.state.recommendations)
    } else if (location.state?.sessionId) {
      fetchRecommendations(location.state.sessionId)
    }
  }, [location.state])

  const fetchRecommendations = async (sessionId: string) => {
    setIsLoading(true)
    try {
      const response = await recommendationService.getRecommendations(sessionId)
      setRecommendations(response.data.recommendations)
    } catch (err) {
      setError('Failed to load recommendations')
      console.error('Error fetching recommendations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    if (!location.state?.sessionId) return
    
    try {
      const blob = await recommendationService.exportRecommendations(location.state.sessionId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ichra-recommendations-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting PDF:', err)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    return 'Fair'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Recommendations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Found</h2>
          <p className="text-gray-600 mb-4">Unable to generate recommendations for this profile.</p>
          <button
            onClick={() => navigate('/profile')}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Plan Recommendations
                </h1>
                <p className="text-gray-600">Personalized health insurance plan recommendations</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleExportPDF}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="btn btn-primary"
              >
                New Consultation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {recommendations.map((rec, index) => (
            <div key={rec.id || index} className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {index === 0 ? (
                      <div className="flex items-center">
                        <Star className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-lg font-semibold text-gray-900">
                          TOP RECOMMENDATION
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          ALTERNATIVE OPTION
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(rec.total_score)}`}>
                        {rec.total_score.toFixed(1)}/100
                      </div>
                      <div className="text-sm text-gray-500">
                        {getScoreLabel(rec.total_score)} Match
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {rec.plan?.carrier_name} {rec.plan?.plan_name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      ${rec.plan?.monthly_premium}/month
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {rec.plan?.metal_tier}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {rec.plan?.plan_type}
                    </span>
                    {rec.plan?.hsa_eligible && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                        HSA Eligible
                      </span>
                    )}
                  </div>
                </div>

                {/* Reasoning */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Why This Plan?</h4>
                  <p className="text-gray-700 leading-relaxed">{rec.reasoning}</p>
                </div>

                {/* Key Benefits */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rec.key_benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-3">
                        <CheckCircle className={`h-5 w-5 mt-0.5 ${benefit.highlight ? 'text-green-500' : 'text-gray-400'}`} />
                        <div>
                          <div className="font-medium text-gray-900">{benefit.category}</div>
                          <div className="text-gray-600">{benefit.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Analysis */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Budget Breakdown</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Monthly Premium</div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${rec.budget_analysis.monthly_premium.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">ICHRA Allowance</div>
                        <div className="text-lg font-semibold text-gray-900">
                          ${rec.budget_analysis.ichra_allowance.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Your Monthly Cost</div>
                        <div className={`text-lg font-semibold ${rec.budget_analysis.employee_monthly_contribution === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          ${rec.budget_analysis.employee_monthly_contribution.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Covered by ICHRA</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {rec.budget_analysis.percent_covered_by_ichra}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Estimated Annual Cost</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${rec.budget_analysis.total_annual_cost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Score Breakdown</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Affordability</div>
                      <div className={`text-lg font-semibold ${getScoreColor(rec.scores.affordability)}`}>
                        {rec.scores.affordability.toFixed(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Coverage</div>
                      <div className={`text-lg font-semibold ${getScoreColor(rec.scores.coverage)}`}>
                        {rec.scores.coverage.toFixed(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Network</div>
                      <div className={`text-lg font-semibold ${getScoreColor(rec.scores.network)}`}>
                        {rec.scores.network.toFixed(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Plan Type</div>
                      <div className={`text-lg font-semibold ${getScoreColor(rec.scores.planType)}`}>
                        {rec.scores.planType.toFixed(0)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">OOP Protection</div>
                      <div className={`text-lg font-semibold ${getScoreColor(rec.scores.oopProtection)}`}>
                        {rec.scores.oopProtection.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Plan Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Annual Deductible</div>
                      <div className="font-semibold text-gray-900">
                        ${rec.plan?.annual_deductible.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Out-of-Pocket Max</div>
                      <div className="font-semibold text-gray-900">
                        ${rec.plan?.oop_maximum.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">PCP Copay</div>
                      <div className="font-semibold text-gray-900">
                        ${rec.plan?.pcp_copay || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Specialist Copay</div>
                      <div className="font-semibold text-gray-900">
                        ${rec.plan?.specialist_copay || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-primary"
            >
              Start New Consultation
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}







