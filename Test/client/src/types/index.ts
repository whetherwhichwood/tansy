// User types
export interface User {
  id: number
  email: string
  name: string
  role: 'administrator' | 'super_admin'
  created_at: string
  updated_at: string
}

// Session types
export interface Session {
  id: string
  user_id: number
  profile_data?: EmployeeProfile
  recommendations?: Recommendation[]
  created_at: string
  expires_at: string
}

// Employee Profile types
export interface EmployeeProfile {
  id?: number
  session_id?: string
  age: number
  zip_code: string
  state: string
  coverage_type: 'individual' | 'individual_spouse' | 'individual_children' | 'family'
  num_dependents: number
  dependent_ages?: number[]
  ichra_allowance: number
  budget_flexibility?: number
  income_level?: number
  health_status: 'excellent' | 'good' | 'fair' | 'poor'
  medical_needs: 'routine' | 'moderate' | 'frequent'
  chronic_conditions?: string[]
  prescription_count: number
  preferred_providers?: string[]
  plan_type_preference?: 'HMO' | 'PPO' | 'EPO' | 'HDHP' | 'POS'
  risk_tolerance: 'low' | 'moderate' | 'high'
  priorities: {
    cost: number
    coverage: number
    network: number
    flexibility: number
  }
  created_at?: string
}

// Plan types
export interface Plan {
  id: number
  carrier_name: string
  plan_name: string
  plan_type: 'HMO' | 'PPO' | 'EPO' | 'HDHP' | 'POS'
  metal_tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Catastrophic'
  state: string
  zip_codes: string[]
  monthly_premium: number
  annual_deductible: number
  oop_maximum: number
  pcp_copay?: number
  specialist_copay?: number
  er_copay?: number
  urgent_care_copay?: number
  generic_rx_copay?: number
  network_type: 'HMO' | 'PPO' | 'EPO' | 'POS'
  network_size: 'Small' | 'Medium' | 'Large'
  hsa_eligible: boolean
  provider_list?: string[]
  formulary?: Record<string, any>
  benefits_summary?: Record<string, any>
  is_active: boolean
  effective_date?: string
  termination_date?: string
  created_at?: string
  updated_at?: string
}

// Recommendation types
export interface Recommendation {
  id?: number
  session_id?: string
  plan_id?: number
  plan?: Plan
  rank: number
  total_score: number
  scores: {
    affordability: number
    coverage: number
    network: number
    planType: number
    oopProtection: number
  }
  reasoning: string
  key_benefits: KeyBenefit[]
  trade_offs?: TradeOff[]
  budget_analysis: BudgetAnalysis
  created_at?: string
}

export interface KeyBenefit {
  category: string
  description: string
  highlight: boolean
}

export interface TradeOff {
  gain: string
  sacrifice: string
}

export interface BudgetAnalysis {
  monthly_premium: number
  ichra_allowance: number
  employee_monthly_contribution: number
  estimated_annual_oop: number
  total_annual_cost: number
  employee_annual_cost: number
  percent_covered_by_ichra: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
  refresh_token: string
}

export interface CreateProfileRequest {
  profile: Omit<EmployeeProfile, 'id' | 'session_id' | 'created_at'>
}

export interface CreateProfileResponse {
  profile: EmployeeProfile
  session_id: string
}

export interface GenerateRecommendationsRequest {
  profile: EmployeeProfile
}

export interface GenerateRecommendationsResponse {
  session_id: string
  recommendations: Recommendation[]
  created_at: string
}

// Form types
export interface ProfileFormData {
  age: number
  zip_code: string
  state: string
  coverage_type: string
  num_dependents: number
  dependent_ages: number[]
  ichra_allowance: number
  budget_flexibility: number
  income_level: number
  health_status: string
  medical_needs: string
  chronic_conditions: string[]
  prescription_count: number
  preferred_providers: string[]
  plan_type_preference: string
  risk_tolerance: string
  priorities: {
    cost: number
    coverage: number
    network: number
    flexibility: number
  }
}







