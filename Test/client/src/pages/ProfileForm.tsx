import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { recommendationService } from '../services/recommendationService'
import { ProfileFormData } from '../types'

const profileSchema = z.object({
  age: z.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  state: z.string().min(2, 'State is required'),
  coverage_type: z.string().min(1, 'Coverage type is required'),
  num_dependents: z.number().min(0, 'Number of dependents cannot be negative'),
  dependent_ages: z.array(z.number()).optional(),
  ichra_allowance: z.number().min(0, 'ICHRA allowance must be positive'),
  budget_flexibility: z.number().min(0, 'Budget flexibility must be positive').optional(),
  income_level: z.number().min(0, 'Income level must be positive').optional(),
  health_status: z.string().min(1, 'Health status is required'),
  medical_needs: z.string().min(1, 'Medical needs is required'),
  chronic_conditions: z.array(z.string()).optional(),
  prescription_count: z.number().min(0, 'Prescription count cannot be negative'),
  preferred_providers: z.array(z.string()).optional(),
  plan_type_preference: z.string().optional(),
  risk_tolerance: z.string().min(1, 'Risk tolerance is required'),
  priorities: z.object({
    cost: z.number().min(1).max(5),
    coverage: z.number().min(1).max(5),
    network: z.number().min(1).max(5),
    flexibility: z.number().min(1).max(5),
  }),
})

type ProfileFormData = z.infer<typeof profileSchema>

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      num_dependents: 0,
      budget_flexibility: 0,
      prescription_count: 0,
      chronic_conditions: [],
      preferred_providers: [],
      dependent_ages: [],
      priorities: {
        cost: 3,
        coverage: 3,
        network: 3,
        flexibility: 3,
      },
    },
  })

  const coverageType = watch('coverage_type')
  const numDependents = watch('num_dependents')

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Create profile and generate recommendations
      const profileResponse = await recommendationService.createProfile({ profile: data })
      const { session_id } = profileResponse.data

      // Generate recommendations
      const recommendationsResponse = await recommendationService.generateRecommendations(data)
      
      // Navigate to recommendations page with session data
      navigate('/recommendations', { 
        state: { 
          sessionId: session_id,
          recommendations: recommendationsResponse.data.recommendations 
        }
      })
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.')
      console.error('Error generating recommendations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addDependentAge = () => {
    const currentAges = watch('dependent_ages') || []
    setValue('dependent_ages', [...currentAges, 0])
  }

  const removeDependentAge = (index: number) => {
    const currentAges = watch('dependent_ages') || []
    setValue('dependent_ages', currentAges.filter((_, i) => i !== index))
  }

  const addChronicCondition = () => {
    const currentConditions = watch('chronic_conditions') || []
    setValue('chronic_conditions', [...currentConditions, ''])
  }

  const removeChronicCondition = (index: number) => {
    const currentConditions = watch('chronic_conditions') || []
    setValue('chronic_conditions', currentConditions.filter((_, i) => i !== index))
  }

  const addPreferredProvider = () => {
    const currentProviders = watch('preferred_providers') || []
    setValue('preferred_providers', [...currentProviders, ''])
  }

  const removePreferredProvider = (index: number) => {
    const currentProviders = watch('preferred_providers') || []
    setValue('preferred_providers', currentProviders.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Employee Profile
              </h1>
              <p className="text-gray-600">Enter employee information for plan recommendations</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Demographics */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Demographics</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Age *</label>
                  <input
                    {...register('age', { valueAsNumber: true })}
                    type="number"
                    className="form-input"
                    placeholder="35"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
                </div>
                <div>
                  <label className="form-label">ZIP Code *</label>
                  <input
                    {...register('zip_code')}
                    type="text"
                    className="form-input"
                    placeholder="10001"
                  />
                  {errors.zip_code && <p className="mt-1 text-sm text-red-600">{errors.zip_code.message}</p>}
                </div>
                <div>
                  <label className="form-label">State *</label>
                  <select {...register('state')} className="form-select">
                    <option value="">Select State</option>
                    {US_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Family & Coverage */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Family & Coverage</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label">Coverage Type *</label>
                <select {...register('coverage_type')} className="form-select">
                  <option value="">Select Coverage Type</option>
                  <option value="individual">Individual</option>
                  <option value="individual_spouse">Individual + Spouse</option>
                  <option value="individual_children">Individual + Children</option>
                  <option value="family">Family</option>
                </select>
                {errors.coverage_type && <p className="mt-1 text-sm text-red-600">{errors.coverage_type.message}</p>}
              </div>

              <div>
                <label className="form-label">Number of Dependents</label>
                <input
                  {...register('num_dependents', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="form-input"
                />
                {errors.num_dependents && <p className="mt-1 text-sm text-red-600">{errors.num_dependents.message}</p>}
              </div>

              {numDependents > 0 && (
                <div>
                  <label className="form-label">Dependent Ages</label>
                  <div className="space-y-2">
                    {(watch('dependent_ages') || []).map((_, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          {...register(`dependent_ages.${index}`, { valueAsNumber: true })}
                          type="number"
                          min="0"
                          max="26"
                          className="form-input flex-1"
                          placeholder="Age"
                        />
                        <button
                          type="button"
                          onClick={() => removeDependentAge(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addDependentAge}
                      className="text-primary-600 hover:text-primary-800 text-sm"
                    >
                      + Add Dependent Age
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Financial Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">ICHRA Allowance ($/month) *</label>
                  <input
                    {...register('ichra_allowance', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="500.00"
                  />
                  {errors.ichra_allowance && <p className="mt-1 text-sm text-red-600">{errors.ichra_allowance.message}</p>}
                </div>
                <div>
                  <label className="form-label">Budget Flexibility ($/month)</label>
                  <input
                    {...register('budget_flexibility', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="100.00"
                  />
                  {errors.budget_flexibility && <p className="mt-1 text-sm text-red-600">{errors.budget_flexibility.message}</p>}
                </div>
                <div>
                  <label className="form-label">Income Level ($/year)</label>
                  <input
                    {...register('income_level', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="75000"
                  />
                  {errors.income_level && <p className="mt-1 text-sm text-red-600">{errors.income_level.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Health Profile */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Health Profile</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Health Status *</label>
                  <select {...register('health_status')} className="form-select">
                    <option value="">Select Health Status</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  {errors.health_status && <p className="mt-1 text-sm text-red-600">{errors.health_status.message}</p>}
                </div>
                <div>
                  <label className="form-label">Medical Needs *</label>
                  <select {...register('medical_needs')} className="form-select">
                    <option value="">Select Medical Needs</option>
                    <option value="routine">Routine (preventive care only)</option>
                    <option value="moderate">Moderate (some ongoing care)</option>
                    <option value="frequent">Frequent (regular medical care)</option>
                  </select>
                  {errors.medical_needs && <p className="mt-1 text-sm text-red-600">{errors.medical_needs.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Prescription Medications (count)</label>
                <input
                  {...register('prescription_count', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0"
                />
                {errors.prescription_count && <p className="mt-1 text-sm text-red-600">{errors.prescription_count.message}</p>}
              </div>

              <div>
                <label className="form-label">Chronic Conditions</label>
                <div className="space-y-2">
                  {(watch('chronic_conditions') || []).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        {...register(`chronic_conditions.${index}`)}
                        type="text"
                        className="form-input flex-1"
                        placeholder="e.g., Diabetes, Hypertension"
                      />
                      <button
                        type="button"
                        onClick={() => removeChronicCondition(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addChronicCondition}
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    + Add Chronic Condition
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Preferred Providers</label>
                <div className="space-y-2">
                  {(watch('preferred_providers') || []).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        {...register(`preferred_providers.${index}`)}
                        type="text"
                        className="form-input flex-1"
                        placeholder="e.g., Dr. Smith, NYC General Hospital"
                      />
                      <button
                        type="button"
                        onClick={() => removePreferredProvider(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPreferredProvider}
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    + Add Preferred Provider
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Plan Preferences</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Plan Type Preference</label>
                  <select {...register('plan_type_preference')} className="form-select">
                    <option value="">No Preference</option>
                    <option value="HMO">HMO</option>
                    <option value="PPO">PPO</option>
                    <option value="EPO">EPO</option>
                    <option value="HDHP">HDHP (High Deductible)</option>
                    <option value="POS">POS (Point of Service)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Risk Tolerance *</label>
                  <select {...register('risk_tolerance')} className="form-select">
                    <option value="">Select Risk Tolerance</option>
                    <option value="low">Low (prefer comprehensive coverage)</option>
                    <option value="moderate">Moderate (balanced approach)</option>
                    <option value="high">High (comfortable with high deductibles)</option>
                  </select>
                  {errors.risk_tolerance && <p className="mt-1 text-sm text-red-600">{errors.risk_tolerance.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Priority Rankings (1 = Low, 5 = High)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Cost</label>
                    <select {...register('priorities.cost', { valueAsNumber: true })} className="form-select">
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Coverage</label>
                    <select {...register('priorities.coverage', { valueAsNumber: true })} className="form-select">
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Network</label>
                    <select {...register('priorities.network', { valueAsNumber: true })} className="form-select">
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Flexibility</label>
                    <select {...register('priorities.flexibility', { valueAsNumber: true })} className="form-select">
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating Recommendations...' : 'Generate Recommendations'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}







