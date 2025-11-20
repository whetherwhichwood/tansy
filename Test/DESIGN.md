# Technical Design Document
## ICHRA Plan Recommendation Web Application

**Version:** 1.0  
**Date:** October 9, 2025  
**Status:** Draft  

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Database Design](#database-design)
4. [Recommendation Algorithm](#recommendation-algorithm)
5. [API Design](#api-design)
6. [Security & Privacy](#security--privacy)
7. [UI/UX Design](#uiux-design)
8. [Integration Architecture](#integration-architecture)
9. [Deployment & Infrastructure](#deployment--infrastructure)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   React Frontend (TypeScript + Tailwind CSS)        │   │
│  │   - Employee Profile Form                            │   │
│  │   - Recommendation Display                           │   │
│  │   - Plan Comparison View                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                         HTTPS
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │   Backend API (Node.js/Express or Python/Flask)     │   │
│  │   - Authentication & Authorization                   │   │
│  │   - Profile Management Service                       │   │
│  │   - Recommendation Engine Service                    │   │
│  │   - Plan Data Service                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
│  ┌──────────────────┐      ┌──────────────────────────┐    │
│  │   PostgreSQL     │      │   Future Integration     │    │
│  │   Database       │      │   Layer (Quoting APIs)   │    │
│  │   - Users        │      │   - Healthcare.gov       │    │
│  │   - Sessions     │      │   - Private Exchanges    │    │
│  │   - Plans        │      │   - Venteur/Thatch       │    │
│  │   - Profiles     │      └──────────────────────────┘    │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

**Frontend Components:**
- `App.tsx` - Main application container
- `Dashboard.tsx` - Administrator dashboard
- `ProfileForm.tsx` - Employee profile input form
- `RecommendationResults.tsx` - Display recommendations
- `PlanComparison.tsx` - Side-by-side plan comparison
- `ReasoningExplanation.tsx` - Detailed reasoning display
- `SessionManager.tsx` - Session state management

**Backend Services:**
- `AuthService` - User authentication and authorization
- `ProfileService` - Employee profile CRUD operations
- `RecommendationEngine` - Core recommendation algorithm
- `PlanService` - Plan data management
- `ScoringService` - Plan scoring calculations
- `ComplianceService` - ICHRA/ACA compliance validation

---

## Technology Stack

### Recommended Stack: React + Node.js

**Rationale:**
- **Unified Language:** JavaScript/TypeScript across frontend and backend
- **Performance:** Node.js excellent for I/O operations and API services
- **Ecosystem:** Rich npm ecosystem for rapid development
- **Developer Experience:** Hot reload, modern tooling, large community
- **Scalability:** Easy to scale horizontally with containerization

### Frontend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI framework | 18.x |
| TypeScript | Type safety | 5.x |
| Vite | Build tool & dev server | 5.x |
| Tailwind CSS | Styling framework | 3.x |
| React Hook Form | Form management | 7.x |
| Zod | Schema validation | 3.x |
| React Router | Client-side routing | 6.x |
| Axios | HTTP client | 1.x |
| Recharts | Data visualization | 2.x |

### Backend Stack (Option 1: Node.js)

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | Runtime environment | 20.x LTS |
| Express | Web framework | 4.x |
| TypeScript | Type safety | 5.x |
| PostgreSQL | Database | 16.x |
| Prisma | ORM | 5.x |
| Passport.js | Authentication | 0.7.x |
| Joi | Validation | 17.x |
| Winston | Logging | 3.x |
| Jest | Testing | 29.x |

### Backend Stack (Option 2: Python - Alternative)

| Technology | Purpose | Version |
|------------|---------|---------|
| Python | Runtime | 3.11+ |
| Flask | Web framework | 3.x |
| SQLAlchemy | ORM | 2.x |
| PostgreSQL | Database | 16.x |
| Flask-JWT-Extended | Authentication | 4.x |
| Marshmallow | Validation | 3.x |
| Pytest | Testing | 7.x |

**Recommendation:** Node.js for consistency and faster development cycle.

### Database

**PostgreSQL 16.x**
- Robust relational database
- JSONB support for flexible data
- Strong ACID compliance
- Excellent performance
- Wide hosting support

### DevOps & Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local development |
| GitHub Actions | CI/CD |
| Nginx | Reverse proxy |
| Let's Encrypt | SSL certificates |

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ name            │
│ role            │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        │
┌─────────────────┐
│   Sessions      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ profile_data    │◄───────┐
│ recommendations │        │
│ created_at      │        │
│ expires_at      │        │
└─────────────────┘        │
                           │
                           │
┌─────────────────────────┐│
│   EmployeeProfiles      ││
├─────────────────────────┤│
│ id (PK)                 ││
│ session_id (FK)         │┘
│ age                     │
│ zip_code                │
│ state                   │
│ coverage_type           │
│ num_dependents          │
│ dependent_ages          │
│ ichra_allowance         │
│ budget_flexibility      │
│ income_level            │
│ health_status           │
│ medical_needs           │
│ chronic_conditions      │
│ prescription_count      │
│ preferred_providers     │
│ plan_type_preference    │
│ risk_tolerance          │
│ priorities              │
│ created_at              │
└─────────────────────────┘
        │
        │ N:M
        │
┌─────────────────────────┐
│   Plans                 │
├─────────────────────────┤
│ id (PK)                 │
│ carrier_name            │
│ plan_name               │
│ plan_type               │
│ metal_tier              │
│ state                   │
│ zip_codes               │
│ monthly_premium         │
│ annual_deductible       │
│ oop_maximum             │
│ pcp_copay               │
│ specialist_copay        │
│ er_copay                │
│ urgent_care_copay       │
│ generic_rx_copay        │
│ network_type            │
│ network_size            │
│ hsa_eligible            │
│ provider_list           │
│ formulary               │
│ benefits_summary        │
│ is_active               │
│ effective_date          │
│ termination_date        │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
        │
        │ 1:N
        │
┌─────────────────────────┐
│   Recommendations       │
├─────────────────────────┤
│ id (PK)                 │
│ session_id (FK)         │
│ plan_id (FK)            │
│ rank                    │
│ total_score             │
│ affordability_score     │
│ coverage_score          │
│ network_score           │
│ plan_type_score         │
│ oop_protection_score    │
│ reasoning               │
│ key_benefits            │
│ trade_offs              │
│ budget_analysis         │
│ created_at              │
└─────────────────────────┘
```

### Schema Definitions

#### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'administrator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Sessions Table

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id),
    profile_data JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '24 hours'
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

#### Employee Profiles Table

```sql
CREATE TABLE employee_profiles (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    age INTEGER NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    state VARCHAR(2) NOT NULL,
    coverage_type VARCHAR(50) NOT NULL,
    num_dependents INTEGER DEFAULT 0,
    dependent_ages INTEGER[],
    ichra_allowance DECIMAL(10,2) NOT NULL,
    budget_flexibility DECIMAL(10,2),
    income_level DECIMAL(10,2),
    health_status VARCHAR(50),
    medical_needs VARCHAR(50),
    chronic_conditions TEXT[],
    prescription_count INTEGER DEFAULT 0,
    preferred_providers TEXT[],
    plan_type_preference VARCHAR(50),
    risk_tolerance VARCHAR(50),
    priorities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_session_id ON employee_profiles(session_id);
CREATE INDEX idx_profiles_zip_code ON employee_profiles(zip_code);
```

#### Plans Table

```sql
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    carrier_name VARCHAR(255) NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    metal_tier VARCHAR(50),
    state VARCHAR(2) NOT NULL,
    zip_codes TEXT[],
    monthly_premium DECIMAL(10,2) NOT NULL,
    annual_deductible DECIMAL(10,2) NOT NULL,
    oop_maximum DECIMAL(10,2) NOT NULL,
    pcp_copay DECIMAL(10,2),
    specialist_copay DECIMAL(10,2),
    er_copay DECIMAL(10,2),
    urgent_care_copay DECIMAL(10,2),
    generic_rx_copay DECIMAL(10,2),
    network_type VARCHAR(50),
    network_size VARCHAR(50),
    hsa_eligible BOOLEAN DEFAULT false,
    provider_list TEXT[],
    formulary JSONB,
    benefits_summary JSONB,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,
    termination_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_state ON plans(state);
CREATE INDEX idx_plans_zip_codes ON plans USING GIN(zip_codes);
CREATE INDEX idx_plans_is_active ON plans(is_active);
CREATE INDEX idx_plans_metal_tier ON plans(metal_tier);
```

#### Recommendations Table

```sql
CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES sessions(id),
    plan_id INTEGER REFERENCES plans(id),
    rank INTEGER NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    affordability_score DECIMAL(5,2),
    coverage_score DECIMAL(5,2),
    network_score DECIMAL(5,2),
    plan_type_score DECIMAL(5,2),
    oop_protection_score DECIMAL(5,2),
    reasoning TEXT,
    key_benefits JSONB,
    trade_offs JSONB,
    budget_analysis JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommendations_session_id ON recommendations(session_id);
CREATE INDEX idx_recommendations_plan_id ON recommendations(plan_id);
```

---

## Recommendation Algorithm

### Algorithm Overview

The recommendation engine uses a weighted scoring system based on Venteur and Thatch methodologies to match employees with optimal health insurance plans.

### Scoring Weights

```javascript
const SCORING_WEIGHTS = {
  affordability: 0.30,      // 30%
  coverage: 0.25,           // 25%
  network: 0.20,            // 20%
  planType: 0.15,           // 15%
  oopProtection: 0.10       // 10%
};
```

### Detailed Scoring Logic

#### 1. Affordability Score (30%)

**Purpose:** Evaluate if the plan fits within the employee's budget.

**Calculation:**

```javascript
function calculateAffordabilityScore(plan, profile) {
  const monthlyPremium = plan.monthly_premium;
  const ichraAllowance = profile.ichra_allowance;
  const budgetFlexibility = profile.budget_flexibility || 0;
  const maxBudget = ichraAllowance + budgetFlexibility;
  
  // Premium affordability (50% of affordability score)
  let premiumScore = 0;
  if (monthlyPremium <= ichraAllowance) {
    premiumScore = 100; // Fully covered by ICHRA
  } else if (monthlyPremium <= maxBudget) {
    // Proportional score if within budget flexibility
    const overage = monthlyPremium - ichraAllowance;
    premiumScore = 100 - ((overage / budgetFlexibility) * 50);
  } else {
    // Exceeds budget - low score
    premiumScore = Math.max(0, 50 - ((monthlyPremium - maxBudget) / maxBudget * 100));
  }
  
  // Estimate annual out-of-pocket costs based on medical needs (50% of affordability score)
  const estimatedAnnualUsage = estimateAnnualCosts(plan, profile);
  const totalAnnualCost = (monthlyPremium * 12) + estimatedAnnualUsage;
  const affordableAnnualCost = (ichraAllowance * 12) + (budgetFlexibility * 12) + 3000;
  
  let annualCostScore = 0;
  if (totalAnnualCost <= affordableAnnualCost) {
    annualCostScore = 100;
  } else {
    const costRatio = totalAnnualCost / affordableAnnualCost;
    annualCostScore = Math.max(0, 100 - ((costRatio - 1) * 100));
  }
  
  // Weighted average
  return (premiumScore * 0.5) + (annualCostScore * 0.5);
}

function estimateAnnualCosts(plan, profile) {
  let estimatedCosts = 0;
  
  // Base on medical needs
  switch(profile.medical_needs) {
    case 'routine':
      // 2-3 PCP visits, preventive care
      estimatedCosts = (plan.pcp_copay * 3) + (plan.generic_rx_copay * profile.prescription_count * 12);
      break;
    case 'moderate':
      // 4-6 PCP visits, 2 specialist visits, some tests
      estimatedCosts = (plan.pcp_copay * 5) + (plan.specialist_copay * 2) + 
                       (plan.generic_rx_copay * profile.prescription_count * 12) + 1500;
      break;
    case 'frequent':
      // Likely to hit deductible
      estimatedCosts = Math.min(plan.annual_deductible + 2000, plan.oop_maximum);
      break;
  }
  
  // Add chronic condition factor
  if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
    estimatedCosts += profile.chronic_conditions.length * 1000;
  }
  
  return Math.min(estimatedCosts, plan.oop_maximum);
}
```

#### 2. Coverage Adequacy Score (25%)

**Purpose:** Ensure the plan provides appropriate coverage for the employee's health needs.

**Calculation:**

```javascript
function calculateCoverageScore(plan, profile) {
  let score = 0;
  
  // Metal tier scoring (40% of coverage score)
  const metalTierScores = {
    'Platinum': 100,
    'Gold': 85,
    'Silver': 70,
    'Bronze': 55,
    'Catastrophic': 40
  };
  const metalScore = metalTierScores[plan.metal_tier] || 50;
  
  // Adjust based on medical needs
  let needsAdjustment = 1.0;
  if (profile.medical_needs === 'frequent' && ['Bronze', 'Catastrophic'].includes(plan.metal_tier)) {
    needsAdjustment = 0.7; // Penalize low coverage for high needs
  } else if (profile.medical_needs === 'routine' && ['Platinum', 'Gold'].includes(plan.metal_tier)) {
    needsAdjustment = 0.9; // Slight penalty for over-coverage
  }
  
  score += (metalScore * needsAdjustment * 0.4);
  
  // Prescription coverage (30% of coverage score)
  let rxScore = 50; // Base score
  if (profile.prescription_count > 0) {
    if (plan.generic_rx_copay <= 10) rxScore = 100;
    else if (plan.generic_rx_copay <= 20) rxScore = 80;
    else if (plan.generic_rx_copay <= 35) rxScore = 60;
    else rxScore = 40;
  } else {
    rxScore = 100; // Not a factor if no prescriptions
  }
  score += (rxScore * 0.3);
  
  // Specialist access (30% of coverage score)
  let specialistScore = 50;
  if (profile.chronic_conditions && profile.chronic_conditions.length > 0) {
    // Need good specialist access
    if (plan.specialist_copay <= 40) specialistScore = 100;
    else if (plan.specialist_copay <= 60) specialistScore = 75;
    else if (plan.specialist_copay <= 80) specialistScore = 50;
    else specialistScore = 25;
  } else {
    specialistScore = 100; // Not a critical factor
  }
  score += (specialistScore * 0.3);
  
  return score;
}
```

#### 3. Network Compatibility Score (20%)

**Purpose:** Ensure preferred providers are in-network.

**Calculation:**

```javascript
function calculateNetworkScore(plan, profile) {
  let score = 0;
  
  // Preferred providers in network (60% of network score)
  let providerScore = 50; // Default if no preferences
  if (profile.preferred_providers && profile.preferred_providers.length > 0) {
    const inNetworkCount = profile.preferred_providers.filter(provider => 
      plan.provider_list.includes(provider)
    ).length;
    const providerMatchRate = inNetworkCount / profile.preferred_providers.length;
    providerScore = providerMatchRate * 100;
  } else {
    providerScore = 100; // No preferences, so not a factor
  }
  score += (providerScore * 0.6);
  
  // Network size and type (40% of network score)
  const networkTypeScores = {
    'PPO': 100,      // Most flexible
    'EPO': 80,       // Moderate flexibility
    'HMO': 60,       // Less flexible
    'POS': 70        // Point of Service
  };
  const networkTypeScore = networkTypeScores[plan.network_type] || 50;
  
  const networkSizeScores = {
    'Large': 100,
    'Medium': 80,
    'Small': 60
  };
  const networkSizeScore = networkSizeScores[plan.network_size] || 70;
  
  score += ((networkTypeScore * 0.5 + networkSizeScore * 0.5) * 0.4);
  
  return score;
}
```

#### 4. Plan Type Match Score (15%)

**Purpose:** Match plan type to employee preferences and risk tolerance.

**Calculation:**

```javascript
function calculatePlanTypeScore(plan, profile) {
  let score = 50; // Base score
  
  // Direct preference match (60% of plan type score)
  if (profile.plan_type_preference) {
    if (plan.plan_type === profile.plan_type_preference) {
      score = 100;
    } else {
      // Partial match based on similarity
      const similarityMap = {
        'PPO': { 'EPO': 70, 'POS': 75, 'HMO': 50, 'HDHP': 60 },
        'HMO': { 'EPO': 60, 'POS': 65, 'PPO': 50, 'HDHP': 40 },
        'HDHP': { 'PPO': 60, 'EPO': 55, 'HMO': 40, 'POS': 50 },
        'EPO': { 'PPO': 70, 'HMO': 60, 'HDHP': 55, 'POS': 65 }
      };
      score = similarityMap[profile.plan_type_preference]?.[plan.plan_type] || 50;
    }
  }
  
  // Risk tolerance alignment (40% of plan type score)
  let riskScore = 50;
  if (profile.risk_tolerance === 'low') {
    // Prefer comprehensive coverage (low deductible)
    if (plan.annual_deductible < 1500) riskScore = 100;
    else if (plan.annual_deductible < 3000) riskScore = 70;
    else riskScore = 40;
  } else if (profile.risk_tolerance === 'high') {
    // Comfortable with HDHP
    if (plan.hsa_eligible && plan.annual_deductible >= 1500) riskScore = 100;
    else if (plan.annual_deductible >= 1500) riskScore = 80;
    else riskScore = 60;
  } else {
    // Moderate risk tolerance
    if (plan.annual_deductible >= 1000 && plan.annual_deductible <= 3000) riskScore = 100;
    else riskScore = 70;
  }
  
  return (score * 0.6) + (riskScore * 0.4);
}
```

#### 5. Out-of-Pocket Protection Score (10%)

**Purpose:** Evaluate financial protection against catastrophic costs.

**Calculation:**

```javascript
function calculateOOPProtectionScore(plan, profile) {
  let score = 0;
  
  // Out-of-pocket maximum (50% of OOP score)
  let oopMaxScore = 0;
  if (plan.oop_maximum <= 5000) oopMaxScore = 100;
  else if (plan.oop_maximum <= 7000) oopMaxScore = 80;
  else if (plan.oop_maximum <= 9000) oopMaxScore = 60;
  else oopMaxScore = 40;
  
  // Adjust for family coverage
  if (profile.coverage_type !== 'individual') {
    // Family OOP max is typically 2x individual
    oopMaxScore *= 0.9; // Slight adjustment
  }
  
  score += (oopMaxScore * 0.5);
  
  // Deductible reasonableness (30% of OOP score)
  let deductibleScore = 0;
  const deductible = plan.annual_deductible;
  if (deductible <= 1000) deductibleScore = 100;
  else if (deductible <= 2500) deductibleScore = 80;
  else if (deductible <= 5000) deductibleScore = 60;
  else if (deductible <= 7000) deductibleScore = 40;
  else deductibleScore = 20;
  
  score += (deductibleScore * 0.3);
  
  // Copay structure (20% of OOP score)
  let copayScore = 0;
  const avgCopay = (plan.pcp_copay + plan.specialist_copay + plan.urgent_care_copay) / 3;
  if (avgCopay <= 30) copayScore = 100;
  else if (avgCopay <= 50) copayScore = 80;
  else if (avgCopay <= 70) copayScore = 60;
  else copayScore = 40;
  
  score += (copayScore * 0.2);
  
  return score;
}
```

### Overall Recommendation Algorithm

```javascript
async function generateRecommendations(profile) {
  // 1. Fetch eligible plans based on location
  const eligiblePlans = await getEligiblePlans(profile.zip_code, profile.state);
  
  // 2. Score each plan
  const scoredPlans = eligiblePlans.map(plan => {
    const affordabilityScore = calculateAffordabilityScore(plan, profile);
    const coverageScore = calculateCoverageScore(plan, profile);
    const networkScore = calculateNetworkScore(plan, profile);
    const planTypeScore = calculatePlanTypeScore(plan, profile);
    const oopProtectionScore = calculateOOPProtectionScore(plan, profile);
    
    const totalScore = 
      (affordabilityScore * SCORING_WEIGHTS.affordability) +
      (coverageScore * SCORING_WEIGHTS.coverage) +
      (networkScore * SCORING_WEIGHTS.network) +
      (planTypeScore * SCORING_WEIGHTS.planType) +
      (oopProtectionScore * SCORING_WEIGHTS.oopProtection);
    
    return {
      plan,
      scores: {
        total: totalScore,
        affordability: affordabilityScore,
        coverage: coverageScore,
        network: networkScore,
        planType: planTypeScore,
        oopProtection: oopProtectionScore
      }
    };
  });
  
  // 3. Sort by total score
  scoredPlans.sort((a, b) => b.scores.total - a.scores.total);
  
  // 4. Filter plans that meet minimum threshold (70%)
  const qualifiedPlans = scoredPlans.filter(sp => sp.scores.total >= 70);
  
  // 5. Select top 1-2 recommendations
  const recommendations = qualifiedPlans.slice(0, 2);
  
  // 6. Generate reasoning for each recommendation
  const recommendationsWithReasoning = recommendations.map((rec, index) => ({
    ...rec,
    rank: index + 1,
    reasoning: generateReasoning(rec, profile),
    keyBenefits: generateKeyBenefits(rec, profile),
    tradeOffs: generateTradeOffs(rec, scoredPlans[index + 1], profile),
    budgetAnalysis: generateBudgetAnalysis(rec, profile)
  }));
  
  return recommendationsWithReasoning;
}
```

### Reasoning Generation

```javascript
function generateReasoning(recommendation, profile) {
  const { plan, scores } = recommendation;
  const reasons = [];
  
  // Identify top scoring factors
  const scoreEntries = Object.entries(scores)
    .filter(([key]) => key !== 'total')
    .sort(([,a], [,b]) => b - a);
  
  // Primary reason (highest score)
  const [topFactor, topScore] = scoreEntries[0];
  
  if (topFactor === 'affordability' && topScore >= 85) {
    const monthlyCost = plan.monthly_premium - profile.ichra_allowance;
    if (monthlyCost <= 0) {
      reasons.push(`This plan is fully covered by your ICHRA allowance of $${profile.ichra_allowance}/month.`);
    } else {
      reasons.push(`This plan fits well within your budget, requiring only $${monthlyCost.toFixed(2)}/month beyond your ICHRA allowance.`);
    }
  }
  
  if (topFactor === 'network' && topScore >= 85) {
    const matchedProviders = profile.preferred_providers?.filter(p => 
      plan.provider_list.includes(p)
    );
    if (matchedProviders && matchedProviders.length > 0) {
      reasons.push(`Your preferred providers (${matchedProviders.join(', ')}) are in-network.`);
    }
  }
  
  if (topFactor === 'coverage' && topScore >= 85) {
    reasons.push(`This ${plan.metal_tier} plan provides comprehensive coverage appropriate for your ${profile.medical_needs} medical needs.`);
  }
  
  // Add 2-3 more supporting reasons
  scoreEntries.slice(1, 4).forEach(([factor, score]) => {
    if (score >= 75) {
      if (factor === 'planType') {
        reasons.push(`The ${plan.plan_type} plan type aligns with your preference for ${profile.risk_tolerance} risk tolerance.`);
      } else if (factor === 'oopProtection') {
        reasons.push(`Strong financial protection with a $${plan.oop_maximum} out-of-pocket maximum.`);
      }
    }
  });
  
  return reasons.join(' ');
}

function generateKeyBenefits(recommendation, profile) {
  const { plan } = recommendation;
  const benefits = [];
  
  // Always include cost information
  benefits.push({
    category: 'Cost',
    description: `$${plan.monthly_premium}/month premium`,
    highlight: plan.monthly_premium <= profile.ichra_allowance
  });
  
  // Coverage highlights
  benefits.push({
    category: 'Coverage',
    description: `${plan.metal_tier} tier - ${plan.plan_type}`,
    highlight: ['Gold', 'Platinum'].includes(plan.metal_tier)
  });
  
  // Deductible
  benefits.push({
    category: 'Deductible',
    description: `$${plan.annual_deductible} annual deductible`,
    highlight: plan.annual_deductible <= 2000
  });
  
  // Network
  if (plan.network_size === 'Large') {
    benefits.push({
      category: 'Network',
      description: `Large ${plan.network_type} network`,
      highlight: true
    });
  }
  
  // HSA eligibility
  if (plan.hsa_eligible) {
    benefits.push({
      category: 'Tax Savings',
      description: 'HSA-eligible for tax-advantaged savings',
      highlight: profile.risk_tolerance === 'high'
    });
  }
  
  return benefits;
}

function generateBudgetAnalysis(recommendation, profile) {
  const { plan } = recommendation;
  const monthlyPremium = plan.monthly_premium;
  const ichraAllowance = profile.ichra_allowance;
  const employeeContribution = Math.max(0, monthlyPremium - ichraAllowance);
  
  const estimatedAnnualOOP = estimateAnnualCosts(plan, profile);
  const totalAnnualCost = (monthlyPremium * 12) + estimatedAnnualOOP;
  const ichraAnnualValue = ichraAllowance * 12;
  const employeeAnnualCost = totalAnnualCost - ichraAnnualValue;
  
  return {
    monthlyPremium,
    ichraAllowance,
    employeeMonthlyContribution: employeeContribution,
    estimatedAnnualOOP,
    totalAnnualCost,
    employeeAnnualCost,
    percentCoveredByICHRA: ((ichraAnnualValue / totalAnnualCost) * 100).toFixed(1)
  };
}
```

---

## API Design

### RESTful API Endpoints

#### Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

#### Sessions

```
POST   /api/sessions              Create new consultation session
GET    /api/sessions/:id          Get session details
DELETE /api/sessions/:id          Clear/delete session
GET    /api/sessions              List user's recent sessions
```

#### Profiles

```
POST   /api/profiles              Create employee profile
GET    /api/profiles/:id          Get profile details
PUT    /api/profiles/:id          Update profile
```

#### Recommendations

```
POST   /api/recommendations       Generate recommendations
GET    /api/recommendations/:sessionId  Get recommendations for session
GET    /api/recommendations/:id/export  Export recommendation as PDF
```

#### Plans (Admin)

```
GET    /api/plans                 List plans (with filters)
GET    /api/plans/:id             Get plan details
POST   /api/plans                 Create new plan
PUT    /api/plans/:id             Update plan
DELETE /api/plans/:id             Delete plan
POST   /api/plans/import          Bulk import plans
```

### API Request/Response Examples

#### POST /api/recommendations

**Request:**
```json
{
  "profile": {
    "age": 35,
    "zip_code": "10001",
    "state": "NY",
    "coverage_type": "individual",
    "num_dependents": 0,
    "ichra_allowance": 500,
    "budget_flexibility": 100,
    "health_status": "good",
    "medical_needs": "moderate",
    "chronic_conditions": [],
    "prescription_count": 2,
    "preferred_providers": ["Dr. Smith", "NYC General Hospital"],
    "plan_type_preference": "PPO",
    "risk_tolerance": "moderate",
    "priorities": {
      "cost": 5,
      "coverage": 4,
      "network": 5,
      "flexibility": 3
    }
  }
}
```

**Response:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "recommendations": [
    {
      "rank": 1,
      "plan": {
        "id": 1234,
        "carrier_name": "Blue Cross Blue Shield",
        "plan_name": "Silver PPO 2500",
        "plan_type": "PPO",
        "metal_tier": "Silver",
        "monthly_premium": 485.00,
        "annual_deductible": 2500,
        "oop_maximum": 7000,
        "pcp_copay": 25,
        "specialist_copay": 50,
        "network_type": "PPO",
        "network_size": "Large"
      },
      "scores": {
        "total": 87.5,
        "affordability": 92,
        "coverage": 85,
        "network": 90,
        "planType": 88,
        "oopProtection": 82
      },
      "reasoning": "This plan is fully covered by your ICHRA allowance of $500/month. Your preferred providers (Dr. Smith, NYC General Hospital) are in-network. This Silver plan provides comprehensive coverage appropriate for your moderate medical needs.",
      "key_benefits": [
        {
          "category": "Cost",
          "description": "$485/month premium",
          "highlight": true
        },
        {
          "category": "Coverage",
          "description": "Silver tier - PPO",
          "highlight": false
        },
        {
          "category": "Network",
          "description": "Large PPO network",
          "highlight": true
        }
      ],
      "budget_analysis": {
        "monthlyPremium": 485.00,
        "ichraAllowance": 500.00,
        "employeeMonthlyContribution": 0,
        "estimatedAnnualOOP": 1800,
        "totalAnnualCost": 7620,
        "employeeAnnualCost": 1620,
        "percentCoveredByICHRA": "78.7"
      }
    }
  ],
  "created_at": "2025-10-09T14:30:00Z"
}
```

---

## Security & Privacy

### Authentication & Authorization

- **JWT-based authentication** with refresh tokens
- **Role-based access control (RBAC):**
  - Administrator: Full access to create sessions, view recommendations
  - Super Admin: Plan management, user management
- **Session timeout:** 15 minutes of inactivity
- **Password requirements:** Minimum 12 characters, complexity rules
- **MFA support:** Optional two-factor authentication

### Data Protection

- **Encryption in transit:** TLS 1.3, HTTPS only
- **Encryption at rest:** Database encryption, encrypted backups
- **PII handling:** Minimal collection, pseudonymization where possible
- **Data retention:** Sessions expire after 24 hours, profiles deleted after 30 days
- **Audit logging:** All access to employee profiles logged

### HIPAA Compliance

- **Business Associate Agreement (BAA)** required for hosting
- **Access controls:** Role-based, least privilege principle
- **Audit trails:** Comprehensive logging of PHI access
- **Data breach procedures:** Incident response plan
- **Employee training:** HIPAA awareness for all users

### Security Best Practices

- **Input validation:** All user inputs validated and sanitized
- **SQL injection prevention:** Parameterized queries, ORM usage
- **XSS prevention:** Content Security Policy, output encoding
- **CSRF protection:** CSRF tokens for state-changing operations
- **Rate limiting:** API rate limits to prevent abuse
- **Dependency scanning:** Regular security updates

---

## UI/UX Design

### Design Principles

1. **Clarity:** Clear, jargon-free language
2. **Efficiency:** Minimize clicks and form fields
3. **Guidance:** Helpful tooltips and explanations
4. **Accessibility:** WCAG 2.1 AA compliant
5. **Responsiveness:** Works on desktop, tablet, mobile

### User Flow Diagram

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Dashboard     │
│  - New Session  │
│  - History      │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│  Profile Input Form │
│  - Demographics     │
│  - Financial        │
│  - Health Profile   │
│  - Preferences      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   Processing...     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Recommendations    │
│  - Plan 1 (Best)    │
│  - Plan 2 (Alt)     │
│  - Reasoning        │
│  - Comparison       │
└──────┬──────────────┘
       │
       ├──► Export PDF
       │
       └──► New Session
```

### Wireframes

#### Dashboard
```
┌────────────────────────────────────────────────┐
│  ICHRA Recommendation Tool        [User] [⚙️]  │
├────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │                                          │ │
│  │     Start New Consultation               │ │
│  │                                          │ │
│  │     [+ New Recommendation Session]       │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  Recent Sessions:                               │
│  ┌──────────────────────────────────────────┐ │
│  │ 10/09/2025 2:30 PM - Age 35, NY         │ │
│  │ Plans: BCBS Silver PPO, Aetna Gold HMO  │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │ 10/09/2025 11:15 AM - Age 42, CA        │ │
│  │ Plans: Kaiser Gold HMO, Anthem Silver    │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

#### Profile Input Form
```
┌────────────────────────────────────────────────┐
│  Employee Profile                    [Cancel]  │
├────────────────────────────────────────────────┤
│                                                 │
│  Demographics                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐│
│  │ Age: 35  │  │ ZIP:     │  │ State: [NY ▼]││
│  └──────────┘  └──────────┘  └──────────────┘│
│                                                 │
│  Family & Coverage                              │
│  ┌────────────────────────────────────────┐   │
│  │ Coverage Type: [Individual ▼]         │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  Financial Information                          │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │ ICHRA Allowance: │  │ Budget Flex:     │   │
│  │ $ 500/month      │  │ $ 100/month      │   │
│  └──────────────────┘  └──────────────────┘   │
│                                                 │
│  Health Profile                                 │
│  ┌────────────────────────────────────────┐   │
│  │ Health Status: [Good ▼]               │   │
│  │ Medical Needs: [Moderate ▼]           │   │
│  │ Prescriptions: [2]                     │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  Preferences                                    │
│  ┌────────────────────────────────────────┐   │
│  │ Plan Type: [PPO ▼]                     │   │
│  │ Risk Tolerance: [Moderate ▼]          │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│              [Generate Recommendations]         │
└────────────────────────────────────────────────┘
```

#### Recommendation Results
```
┌────────────────────────────────────────────────┐
│  Recommendations for Employee      [Export PDF]│
├────────────────────────────────────────────────┤
│                                                 │
│  🥇 TOP RECOMMENDATION                         │
│  ┌──────────────────────────────────────────┐ │
│  │ Blue Cross Blue Shield Silver PPO 2500   │ │
│  │                                          │ │
│  │ $485/month  |  Silver  |  PPO           │ │
│  │                                          │ │
│  │ ⭐ Overall Score: 87.5/100               │ │
│  │                                          │ │
│  │ Why This Plan?                           │ │
│  │ • Fully covered by your ICHRA allowance  │ │
│  │ • Your preferred providers are in-network│ │
│  │ • Comprehensive coverage for moderate    │ │
│  │   medical needs                          │ │
│  │                                          │ │
│  │ Budget Breakdown:                        │ │
│  │ Monthly Premium:     $485                │ │
│  │ ICHRA Allowance:    -$500                │ │
│  │ Your Cost:           $0/month            │ │
│  │                                          │ │
│  │ Estimated Annual Cost: $7,620            │ │
│  │ (78.7% covered by ICHRA)                 │ │
│  │                                          │ │
│  │ [View Full Details] [Compare Plans]     │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  🥈 ALTERNATIVE OPTION                         │
│  ┌──────────────────────────────────────────┐ │
│  │ Aetna Gold HMO 1500                      │ │
│  │ $520/month  |  Gold  |  HMO              │ │
│  │ ⭐ Overall Score: 82.3/100                │ │
│  │ [View Details]                           │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [Start New Consultation]                       │
└────────────────────────────────────────────────┘
```

---

## Integration Architecture

### Future Quoting Tool Integration

**Design Pattern:** Strategy Pattern with abstracted quoting service layer

```javascript
// Abstract interface
interface QuotingService {
  fetchPlans(criteria: PlanCriteria): Promise<Plan[]>;
  getPlanDetails(planId: string): Promise<PlanDetails>;
  validatePlan(planId: string): Promise<boolean>;
}

// Implementations
class HealthcareGovService implements QuotingService {
  // Healthcare.gov API implementation
}

class PrivateExchangeService implements QuotingService {
  // Private exchange API implementation
}

class VenteurService implements QuotingService {
  // Venteur API implementation
}

class ThatchService implements QuotingService {
  // Thatch API implementation
}

// Service factory
class QuotingServiceFactory {
  static getService(source: string): QuotingService {
    switch(source) {
      case 'healthcare.gov': return new HealthcareGovService();
      case 'venteur': return new VenteurService();
      case 'thatch': return new ThatchService();
      default: return new PrivateExchangeService();
    }
  }
}
```

### Configuration for Multiple Sources

```javascript
// config/quoting-sources.json
{
  "sources": [
    {
      "id": "healthcare-gov",
      "name": "Healthcare.gov",
      "enabled": false,
      "apiEndpoint": "https://api.healthcare.gov/v1",
      "apiKey": "${HEALTHCARE_GOV_API_KEY}",
      "priority": 1
    },
    {
      "id": "venteur",
      "name": "Venteur",
      "enabled": false,
      "apiEndpoint": "https://api.venteur.com/v1",
      "apiKey": "${VENTEUR_API_KEY}",
      "priority": 2
    },
    {
      "id": "thatch",
      "name": "Thatch",
      "enabled": false,
      "apiEndpoint": "https://api.thatch.com/v1",
      "apiKey": "${THATCH_API_KEY}",
      "priority": 3
    },
    {
      "id": "manual",
      "name": "Manual Entry",
      "enabled": true,
      "priority": 99
    }
  ]
}
```

---

## Deployment & Infrastructure

### Hosting Recommendations

**Option 1: AWS**
- **Compute:** EC2 or ECS (containerized)
- **Database:** RDS PostgreSQL
- **Storage:** S3 for exports/backups
- **CDN:** CloudFront
- **Monitoring:** CloudWatch

**Option 2: Heroku** (Simpler for MVP)
- **Compute:** Heroku Dynos
- **Database:** Heroku Postgres
- **Add-ons:** Papertrail (logging), Heroku Redis (caching)

**Option 3: DigitalOcean** (Cost-effective)
- **Compute:** App Platform or Droplets
- **Database:** Managed PostgreSQL
- **Spaces:** Object storage

### Docker Configuration

```dockerfile
# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables

```env
# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://ichra-app.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/ichra_db

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# Security
CORS_ORIGIN=https://ichra-app.com
SESSION_SECRET=your-session-secret

# Future API Keys
HEALTHCARE_GOV_API_KEY=
VENTEUR_API_KEY=
THATCH_API_KEY=
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Deploy commands here
```

---

## Appendix

### Technology Decision Matrix

| Criteria | Node.js + Express | Python + Flask | Weight | Node Score | Python Score |
|----------|-------------------|----------------|--------|------------|--------------|
| Development Speed | Fast | Moderate | 20% | 9 | 7 |
| Performance | Excellent | Good | 15% | 9 | 7 |
| Ecosystem | Rich | Rich | 15% | 9 | 9 |
| Learning Curve | Low | Low | 10% | 8 | 8 |
| Type Safety | TypeScript | Type Hints | 15% | 9 | 7 |
| Deployment | Easy | Easy | 10% | 8 | 8 |
| Community | Large | Large | 10% | 9 | 9 |
| Data Processing | Good | Excellent | 5% | 7 | 9 |
| **Total** | | | | **8.65** | **7.75** |

**Recommendation:** Node.js + Express with TypeScript

### Glossary

See PRD.md Appendix for complete glossary.

### References

- React Documentation: https://react.dev
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- OWASP Security Guidelines: https://owasp.org
- WCAG Accessibility Standards: https://www.w3.org/WAI/WCAG21/quickref/








