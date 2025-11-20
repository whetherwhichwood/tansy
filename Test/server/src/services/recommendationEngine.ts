import { PrismaClient } from '@prisma/client'
import { EmployeeProfile, Plan, Recommendation } from '../../client/src/types'

const prisma = new PrismaClient()

const SCORING_WEIGHTS = {
  affordability: 0.30,
  coverage: 0.25,
  network: 0.20,
  planType: 0.15,
  oopProtection: 0.10
}

export async function generateRecommendations(profile: EmployeeProfile): Promise<Recommendation[]> {
  // Get eligible plans based on location
  const eligiblePlans = await prisma.plan.findMany({
    where: {
      state: profile.state,
      zip_codes: {
        has: profile.zip_code
      },
      is_active: true
    }
  })

  if (eligiblePlans.length === 0) {
    throw new Error('No eligible plans found for this location')
  }

  // Score each plan
  const scoredPlans = eligiblePlans.map(plan => {
    const affordabilityScore = calculateAffordabilityScore(plan, profile)
    const coverageScore = calculateCoverageScore(plan, profile)
    const networkScore = calculateNetworkScore(plan, profile)
    const planTypeScore = calculatePlanTypeScore(plan, profile)
    const oopProtectionScore = calculateOOPProtectionScore(plan, profile)

    const totalScore = 
      (affordabilityScore * SCORING_WEIGHTS.affordability) +
      (coverageScore * SCORING_WEIGHTS.coverage) +
      (networkScore * SCORING_WEIGHTS.network) +
      (planTypeScore * SCORING_WEIGHTS.planType) +
      (oopProtectionScore * SCORING_WEIGHTS.oopProtection)

    return {
      plan,
      scores: {
        affordability: affordabilityScore,
        coverage: coverageScore,
        network: networkScore,
        planType: planTypeScore,
        oopProtection: oopProtectionScore
      },
      totalScore
    }
  })

  // Sort by total score
  scoredPlans.sort((a, b) => b.totalScore - a.totalScore)

  // Filter plans that meet minimum threshold (70%)
  const qualifiedPlans = scoredPlans.filter(sp => sp.totalScore >= 70)

  // Select top 1-2 recommendations
  const topPlans = qualifiedPlans.slice(0, 2)

  // Generate recommendations with reasoning
  const recommendations: Recommendation[] = topPlans.map((scoredPlan, index) => ({
    plan_id: scoredPlan.plan.id,
    plan: scoredPlan.plan,
    rank: index + 1,
    total_score: scoredPlan.totalScore,
    scores: scoredPlan.scores,
    reasoning: generateReasoning(scoredPlan, profile),
    key_benefits: generateKeyBenefits(scoredPlan, profile),
    trade_offs: generateTradeOffs(scoredPlan, scoredPlans[index + 1], profile),
    budget_analysis: generateBudgetAnalysis(scoredPlan, profile)
  }))

  return recommendations
}

function calculateAffordabilityScore(plan: Plan, profile: EmployeeProfile): number {
  const monthlyPremium = Number(plan.monthly_premium)
  const ichraAllowance = Number(profile.ichra_allowance)
  const budgetFlexibility = Number(profile.budget_flexibility) || 0
  const maxBudget = ichraAllowance + budgetFlexibility

  // Premium affordability (50% of affordability score)
  let premiumScore = 0
  if (monthlyPremium <= ichraAllowance) {
    premiumScore = 100 // Fully covered by ICHRA
  } else if (monthlyPremium <= maxBudget) {
    // Proportional score if within budget flexibility
    const overage = monthlyPremium - ichraAllowance
    premiumScore = 100 - ((overage / budgetFlexibility) * 50)
  } else {
    // Exceeds budget - low score
    premiumScore = Math.max(0, 50 - ((monthlyPremium - maxBudget) / maxBudget * 100))
  }

  // Estimate annual out-of-pocket costs (50% of affordability score)
  const estimatedAnnualUsage = estimateAnnualCosts(plan, profile)
  const totalAnnualCost = (monthlyPremium * 12) + estimatedAnnualUsage
  const affordableAnnualCost = (ichraAllowance * 12) + (budgetFlexibility * 12) + 3000

  let annualCostScore = 0
  if (totalAnnualCost <= affordableAnnualCost) {
    annualCostScore = 100
  } else {
    const costRatio = totalAnnualCost / affordableAnnualCost
    annualCostScore = Math.max(0, 100 - ((costRatio - 1) * 100))
  }

  return (premiumScore * 0.5) + (annualCostScore * 0.5)
}

function calculateCoverageScore(plan: Plan, profile: EmployeeProfile): number {
  let score = 0

  // Metal tier scoring (40% of coverage score)
  const metalTierScores = {
    'Platinum': 100,
    'Gold': 85,
    'Silver': 70,
    'Bronze': 55,
    'Catastrophic': 40
  }
  const metalScore = metalTierScores[plan.metal_tier as keyof typeof metalTierScores] || 50

  // Adjust based on medical needs
  let needsAdjustment = 1.0
  if (profile.medical_needs === 'frequent' && ['Bronze', 'Catastrophic'].includes(plan.metal_tier || '')) {
    needsAdjustment = 0.7 // Penalize low coverage for high needs
  } else if (profile.medical_needs === 'routine' && ['Platinum', 'Gold'].includes(plan.metal_tier || '')) {
    needsAdjustment = 0.9 // Slight penalty for over-coverage
  }

  score += (metalScore * needsAdjustment * 0.4)

  // Prescription coverage (30% of coverage score)
  let rxScore = 50 // Base score
  if (profile.prescription_count > 0) {
    const genericCopay = Number(plan.generic_rx_copay) || 0
    if (genericCopay <= 10) rxScore = 100
    else if (genericCopay <= 20) rxScore = 80
    else if (genericCopay <= 35) rxScore = 60
    else rxScore = 40
  } else {
    rxScore = 100 // Not a factor if no prescriptions
  }
  score += (rxScore * 0.3)

  // Specialist access (30% of coverage score)
  let specialistScore = 50
  if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
    // Need good specialist access
    const specialistCopay = Number(plan.specialist_copay) || 0
    if (specialistCopay <= 40) specialistScore = 100
    else if (specialistCopay <= 60) specialistScore = 75
    else if (specialistCopay <= 80) specialistScore = 50
    else specialistScore = 25
  } else {
    specialistScore = 100 // Not a critical factor
  }
  score += (specialistScore * 0.3)

  return score
}

function calculateNetworkScore(plan: Plan, profile: EmployeeProfile): number {
  let score = 0

  // Preferred providers in network (60% of network score)
  let providerScore = 50 // Default if no preferences
  if (profile.preferred_providers && profile.preferred_providers.length > 0) {
    const inNetworkCount = profile.preferred_providers.filter(provider => 
      plan.provider_list?.includes(provider)
    ).length
    const providerMatchRate = inNetworkCount / profile.preferred_providers.length
    providerScore = providerMatchRate * 100
  } else {
    providerScore = 100 // No preferences, so not a factor
  }
  score += (providerScore * 0.6)

  // Network size and type (40% of network score)
  const networkTypeScores = {
    'PPO': 100,      // Most flexible
    'EPO': 80,       // Moderate flexibility
    'HMO': 60,       // Less flexible
    'POS': 70        // Point of Service
  }
  const networkTypeScore = networkTypeScores[plan.network_type as keyof typeof networkTypeScores] || 50

  const networkSizeScores = {
    'Large': 100,
    'Medium': 80,
    'Small': 60
  }
  const networkSizeScore = networkSizeScores[plan.network_size as keyof typeof networkSizeScores] || 70

  score += ((networkTypeScore * 0.5 + networkSizeScore * 0.5) * 0.4)

  return score
}

function calculatePlanTypeScore(plan: Plan, profile: EmployeeProfile): number {
  let score = 50 // Base score

  // Direct preference match (60% of plan type score)
  if (profile.plan_type_preference) {
    if (plan.plan_type === profile.plan_type_preference) {
      score = 100
    } else {
      // Partial match based on similarity
      const similarityMap: Record<string, Record<string, number>> = {
        'PPO': { 'EPO': 70, 'POS': 75, 'HMO': 50, 'HDHP': 60 },
        'HMO': { 'EPO': 60, 'POS': 65, 'PPO': 50, 'HDHP': 40 },
        'HDHP': { 'PPO': 60, 'EPO': 55, 'HMO': 40, 'POS': 50 },
        'EPO': { 'PPO': 70, 'HMO': 60, 'HDHP': 55, 'POS': 65 }
      }
      score = similarityMap[profile.plan_type_preference]?.[plan.plan_type] || 50
    }
  }

  // Risk tolerance alignment (40% of plan type score)
  let riskScore = 50
  if (profile.risk_tolerance === 'low') {
    // Prefer comprehensive coverage (low deductible)
    const deductible = Number(plan.annual_deductible)
    if (deductible < 1500) riskScore = 100
    else if (deductible < 3000) riskScore = 70
    else riskScore = 40
  } else if (profile.risk_tolerance === 'high') {
    // Comfortable with HDHP
    if (plan.hsa_eligible && Number(plan.annual_deductible) >= 1500) riskScore = 100
    else if (Number(plan.annual_deductible) >= 1500) riskScore = 80
    else riskScore = 60
  } else {
    // Moderate risk tolerance
    const deductible = Number(plan.annual_deductible)
    if (deductible >= 1000 && deductible <= 3000) riskScore = 100
    else riskScore = 70
  }

  return (score * 0.6) + (riskScore * 0.4)
}

function calculateOOPProtectionScore(plan: Plan, profile: EmployeeProfile): number {
  let score = 0

  // Out-of-pocket maximum (50% of OOP score)
  let oopMaxScore = 0
  const oopMax = Number(plan.oop_maximum)
  if (oopMax <= 5000) oopMaxScore = 100
  else if (oopMax <= 7000) oopMaxScore = 80
  else if (oopMax <= 9000) oopMaxScore = 60
  else oopMaxScore = 40

  // Adjust for family coverage
  if (profile.coverage_type !== 'individual') {
    // Family OOP max is typically 2x individual
    oopMaxScore *= 0.9 // Slight adjustment
  }

  score += (oopMaxScore * 0.5)

  // Deductible reasonableness (30% of OOP score)
  let deductibleScore = 0
  const deductible = Number(plan.annual_deductible)
  if (deductible <= 1000) deductibleScore = 100
  else if (deductible <= 2500) deductibleScore = 80
  else if (deductible <= 5000) deductibleScore = 60
  else if (deductible <= 7000) deductibleScore = 40
  else deductibleScore = 20

  score += (deductibleScore * 0.3)

  // Copay structure (20% of OOP score)
  let copayScore = 0
  const avgCopay = (Number(plan.pcp_copay) + Number(plan.specialist_copay) + Number(plan.urgent_care_copay)) / 3
  if (avgCopay <= 30) copayScore = 100
  else if (avgCopay <= 50) copayScore = 80
  else if (avgCopay <= 70) copayScore = 60
  else copayScore = 40

  score += (copayScore * 0.2)

  return score
}

function estimateAnnualCosts(plan: Plan, profile: EmployeeProfile): number {
  let estimatedCosts = 0

  // Base on medical needs
  switch(profile.medical_needs) {
    case 'routine':
      // 2-3 PCP visits, preventive care
      estimatedCosts = (Number(plan.pcp_copay) * 3) + (Number(plan.generic_rx_copay) * profile.prescription_count * 12)
      break
    case 'moderate':
      // 4-6 PCP visits, 2 specialist visits, some tests
      estimatedCosts = (Number(plan.pcp_copay) * 5) + (Number(plan.specialist_copay) * 2) + 
                       (Number(plan.generic_rx_copay) * profile.prescription_count * 12) + 1500
      break
    case 'frequent':
      // Likely to hit deductible
      estimatedCosts = Math.min(Number(plan.annual_deductible) + 2000, Number(plan.oop_maximum))
      break
  }

  // Add chronic condition factor
  if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
    estimatedCosts += profile.chronic_conditions.length * 1000
  }

  return Math.min(estimatedCosts, Number(plan.oop_maximum))
}

function generateReasoning(scoredPlan: any, profile: EmployeeProfile): string {
  const { plan, scores } = scoredPlan
  const reasons = []

  // Identify top scoring factors
  const scoreEntries = Object.entries(scores)
    .filter(([key]) => key !== 'total')
    .sort(([,a], [,b]) => b - a)

  // Primary reason (highest score)
  const [topFactor, topScore] = scoreEntries[0]

  if (topFactor === 'affordability' && topScore >= 85) {
    const monthlyCost = Number(plan.monthly_premium) - Number(profile.ichra_allowance)
    if (monthlyCost <= 0) {
      reasons.push(`This plan is fully covered by your ICHRA allowance of $${profile.ichra_allowance}/month.`)
    } else {
      reasons.push(`This plan fits well within your budget, requiring only $${monthlyCost.toFixed(2)}/month beyond your ICHRA allowance.`)
    }
  }

  if (topFactor === 'network' && topScore >= 85) {
    const matchedProviders = profile.preferred_providers?.filter(p => 
      plan.provider_list?.includes(p)
    )
    if (matchedProviders && matchedProviders.length > 0) {
      reasons.push(`Your preferred providers (${matchedProviders.join(', ')}) are in-network.`)
    }
  }

  if (topFactor === 'coverage' && topScore >= 85) {
    reasons.push(`This ${plan.metal_tier} plan provides comprehensive coverage appropriate for your ${profile.medical_needs} medical needs.`)
  }

  // Add 2-3 more supporting reasons
  scoreEntries.slice(1, 4).forEach(([factor, score]) => {
    if (score >= 75) {
      if (factor === 'planType') {
        reasons.push(`The ${plan.plan_type} plan type aligns with your preference for ${profile.risk_tolerance} risk tolerance.`)
      } else if (factor === 'oopProtection') {
        reasons.push(`Strong financial protection with a $${plan.oop_maximum} out-of-pocket maximum.`)
      }
    }
  })

  return reasons.join(' ')
}

function generateKeyBenefits(scoredPlan: any, profile: EmployeeProfile): any[] {
  const { plan } = scoredPlan
  const benefits = []

  // Always include cost information
  benefits.push({
    category: 'Cost',
    description: `$${plan.monthly_premium}/month premium`,
    highlight: Number(plan.monthly_premium) <= Number(profile.ichra_allowance)
  })

  // Coverage highlights
  benefits.push({
    category: 'Coverage',
    description: `${plan.metal_tier} tier - ${plan.plan_type}`,
    highlight: ['Gold', 'Platinum'].includes(plan.metal_tier || '')
  })

  // Deductible
  benefits.push({
    category: 'Deductible',
    description: `$${plan.annual_deductible} annual deductible`,
    highlight: Number(plan.annual_deductible) <= 2000
  })

  // Network
  if (plan.network_size === 'Large') {
    benefits.push({
      category: 'Network',
      description: `Large ${plan.network_type} network`,
      highlight: true
    })
  }

  // HSA eligibility
  if (plan.hsa_eligible) {
    benefits.push({
      category: 'Tax Savings',
      description: 'HSA-eligible for tax-advantaged savings',
      highlight: profile.risk_tolerance === 'high'
    })
  }

  return benefits
}

function generateTradeOffs(scoredPlan: any, nextPlan: any, profile: EmployeeProfile): any[] {
  // Simple trade-off generation
  return [
    {
      gain: `Lower monthly premium than alternative options`,
      sacrifice: `May have higher out-of-pocket costs for frequent care`
    }
  ]
}

function generateBudgetAnalysis(scoredPlan: any, profile: EmployeeProfile): any {
  const { plan } = scoredPlan
  const monthlyPremium = Number(plan.monthly_premium)
  const ichraAllowance = Number(profile.ichra_allowance)
  const employeeContribution = Math.max(0, monthlyPremium - ichraAllowance)

  const estimatedAnnualOOP = estimateAnnualCosts(plan, profile)
  const totalAnnualCost = (monthlyPremium * 12) + estimatedAnnualOOP
  const ichraAnnualValue = ichraAllowance * 12
  const employeeAnnualCost = totalAnnualCost - ichraAnnualValue

  return {
    monthly_premium: monthlyPremium,
    ichra_allowance: ichraAllowance,
    employee_monthly_contribution: employeeContribution,
    estimated_annual_oop: estimatedAnnualOOP,
    total_annual_cost: totalAnnualCost,
    employee_annual_cost: employeeAnnualCost,
    percent_covered_by_ichra: ((ichraAnnualValue / totalAnnualCost) * 100).toFixed(1)
  }
}







