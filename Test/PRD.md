# Product Requirements Document (PRD)
## ICHRA Plan Recommendation Web Application

**Version:** 1.0  
**Date:** October 9, 2025  
**Status:** Draft  

---

## Executive Summary

This document outlines the requirements for an ICHRA (Individual Coverage Health Reimbursement Arrangement) Plan Recommendation Web Application designed for benefits administrators and ICHRA consultants. The application enables administrators to input employee information during consultation sessions and receive 1-2 personalized health insurance plan recommendations with detailed reasoning.

### Problem Statement

ICHRA administrators face challenges in quickly identifying the most suitable health insurance plans for employees from a vast marketplace of options. The process is time-consuming, requires deep expertise, and often lacks transparency in explaining why certain plans are recommended. Employees need clear, personalized guidance to make informed decisions about their health coverage within their ICHRA allowance.

### Solution

A web-based tool that streamlines the plan recommendation process by:
- Capturing comprehensive employee profiles during consultation sessions
- Applying intelligent recommendation algorithms based on industry best practices (Venteur/Thatch methodologies)
- Generating 1-2 top plan recommendations with transparent, detailed reasoning
- Ensuring compliance with ICHRA regulations and ACA standards

---

## Target Users

### Primary User: ICHRA Administrator / Benefits Consultant
**Profile:**
- Works for an employer offering ICHRA benefits or a third-party benefits administration firm
- Conducts one-on-one or group consultation sessions with employees
- Needs to quickly assess employee needs and provide expert plan recommendations
- Responsible for ensuring compliance with ICHRA rules and regulations

**Goals:**
- Efficiently gather employee information
- Provide personalized, defensible plan recommendations
- Explain recommendations clearly to employees
- Maintain compliance and documentation
- Improve employee satisfaction with benefits selection

**Pain Points:**
- Time-consuming manual research across multiple insurance marketplaces
- Difficulty explaining complex trade-offs between plans
- Keeping up with changing plan offerings and regulations
- Ensuring recommendations are compliant and appropriate

### Secondary User: Employee (Indirect)
**Profile:**
- Receives ICHRA allowance from employer
- May have varying levels of health insurance literacy
- Has unique health needs, budget constraints, and preferences

**Goals:**
- Understand available plan options
- Select a plan that meets their health needs within budget
- Feel confident in their decision

---

## Core Features

### 1. Employee Profile Input Form

**Description:** Comprehensive form for administrators to input employee information during consultation sessions.

**Required Fields:**
- **Demographics**
  - Age
  - ZIP code / Location
  - State
  
- **Family Composition**
  - Coverage type: Individual, Individual + Spouse, Individual + Children, Family
  - Number of dependents
  - Ages of dependents

- **Financial Information**
  - ICHRA monthly allowance
  - Budget flexibility (willing to pay out-of-pocket beyond allowance)
  - Income level (for subsidy eligibility consideration)

- **Health Profile**
  - Current health status (Excellent, Good, Fair, Poor)
  - Anticipated medical needs (Routine only, Moderate, Frequent)
  - Chronic conditions requiring ongoing care
  - Prescription medications (number and cost tier)
  - Preferred doctors/specialists
  - Preferred hospitals/medical facilities

- **Preferences**
  - Plan type preference (HMO, PPO, EPO, HDHP/HSA)
  - Risk tolerance (prefer low premiums with high deductibles vs. comprehensive coverage)
  - Priority ranking: Cost, Coverage breadth, Network size, Out-of-pocket protection

**Validation:**
- All required fields must be completed
- ZIP code validation for plan availability
- Age validation (reasonable ranges)
- ICHRA allowance must be positive number

### 2. Plan Recommendation Engine

**Description:** Intelligent algorithm that analyzes employee profile and generates 1-2 optimal plan recommendations.

**Methodology:** Based on Venteur and Thatch best practices:

**Venteur Approach:**
- AI-powered matching based on employee priorities
- Cost optimization within ICHRA allowance
- Network adequacy scoring
- Coverage comprehensiveness analysis

**Thatch Approach:**
- Flexible benefit matching
- Employee class considerations
- Compliance-first recommendations
- Simplified decision-making framework

**Recommendation Criteria:**
1. **Affordability Score (30%)**
   - Premium vs. ICHRA allowance
   - Out-of-pocket exposure relative to budget
   - Total cost of ownership (premium + expected OOP costs)

2. **Coverage Adequacy Score (25%)**
   - Essential health benefits coverage
   - Prescription drug coverage
   - Specialist access
   - Preventive care coverage

3. **Network Compatibility Score (20%)**
   - Preferred providers in-network
   - Hospital access
   - Geographic coverage
   - Specialist availability

4. **Plan Type Match Score (15%)**
   - Alignment with stated preferences (HMO, PPO, etc.)
   - Risk tolerance compatibility
   - HSA eligibility (if desired)

5. **Out-of-Pocket Protection Score (10%)**
   - Deductible amount
   - Out-of-pocket maximum
   - Copay/coinsurance structure
   - Financial risk mitigation

**Output:**
- Top 1-2 recommended plans (ranked by total weighted score)
- Plans must score above 70% threshold to be recommended
- If no plans meet threshold, provide "best available" with caveats

### 3. Recommendation Reasoning & Explanation

**Description:** Detailed, transparent explanation of why each plan was recommended.

**Components:**

**Summary Statement:**
- One-sentence overview: "This plan is recommended because..."

**Key Benefits:**
- Top 3-5 reasons this plan fits the employee's needs
- Specific features that align with stated priorities
- Cost breakdown (premium, estimated annual costs)

**Budget Analysis:**
- Monthly premium vs. ICHRA allowance
- Employee out-of-pocket contribution (if any)
- Estimated annual healthcare costs based on anticipated usage
- Comparison to other plan types

**Coverage Highlights:**
- Relevant coverage features for stated health needs
- Prescription drug coverage details
- Preventive care benefits
- Specialist access

**Network Information:**
- Preferred providers in-network status
- Hospital access
- Network size and breadth

**Trade-offs & Considerations:**
- What the employee gains with this plan
- What they might sacrifice compared to alternatives
- Risk factors to consider

**Compliance Verification:**
- Confirms plan meets ICHRA eligibility requirements
- ACA minimum essential coverage confirmation
- Affordability standard met (if applicable)

**Alternative Considered:**
- Brief mention of next-best option and why it ranked lower

### 4. Plan Comparison View

**Description:** Side-by-side comparison of recommended plans.

**Comparison Elements:**
- Monthly premium
- Annual deductible
- Out-of-pocket maximum
- Copays (PCP, Specialist, ER, Urgent Care)
- Prescription drug coverage
- Network type and size
- HSA eligibility
- Overall score breakdown

### 5. Session Management

**Description:** Basic session tracking for consultation workflow.

**Features:**
- Save employee profile for session
- Print/export recommendations
- Clear session to start new consultation
- Session timestamp and administrator ID

---

## User Workflows

### Primary Workflow: Plan Recommendation Session

1. **Administrator logs into application**
   - Secure authentication
   - Dashboard view

2. **Start new consultation session**
   - Click "New Recommendation"
   - Begin employee profile form

3. **Input employee information**
   - Complete all required fields
   - Review and validate entries
   - Submit profile

4. **System generates recommendations**
   - Processing indicator (3-5 seconds)
   - Recommendation results display

5. **Review recommendations with employee**
   - Read summary and key benefits
   - Discuss trade-offs
   - Compare plans side-by-side
   - Answer employee questions

6. **Export or print recommendations**
   - Generate PDF report
   - Email to employee (optional future feature)
   - Save to employee record (optional future feature)

7. **Complete session**
   - Clear session data
   - Return to dashboard for next consultation

### Secondary Workflow: Plan Database Management (Future)

1. Administrator updates plan database
2. Import new plans from quoting sources
3. Validate plan data
4. Activate plans for recommendations

---

## Success Metrics & KPIs

### User Adoption
- Number of active administrators using the tool
- Number of consultations completed per week/month
- User retention rate

### Efficiency Gains
- Average time per consultation (target: < 10 minutes)
- Reduction in follow-up questions from employees
- Administrator satisfaction score

### Recommendation Quality
- Employee satisfaction with recommendations
- Plan selection rate (% of employees who select a recommended plan)
- Plan retention rate (employees staying with recommended plan)

### Compliance
- 100% of recommendations meet ICHRA eligibility requirements
- Zero compliance violations or errors
- Audit trail completeness

---

## Compliance Considerations

### ICHRA Regulations

**Eligibility Requirements:**
- Employees must be offered ICHRA and have individual health insurance
- Plans must be ACA-compliant individual market plans
- ICHRA must be affordable based on IRS standards

**Employee Classes:**
- System should support different ICHRA allowances by employee class
- Consistent application within each class

**Documentation:**
- Maintain records of recommendations
- Audit trail for compliance verification

### ACA Standards

**Minimum Essential Coverage:**
- All recommended plans must provide MEC
- Essential health benefits coverage
- No annual or lifetime limits on essential benefits

**Affordability:**
- Premium (after ICHRA allowance) must meet affordability threshold
- Consider household income for subsidy eligibility

### Data Privacy & Security

**HIPAA Compliance:**
- Protected Health Information (PHI) handling
- Secure data storage and transmission
- Access controls and authentication
- Audit logging

**Data Retention:**
- Define retention policies for employee profiles
- Secure deletion procedures
- Compliance with state privacy laws

---

## Technical Requirements

### Performance
- Page load time < 2 seconds
- Recommendation generation < 5 seconds
- Support 50+ concurrent users

### Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatibility

### Security
- HTTPS encryption
- Secure authentication (OAuth 2.0 or similar)
- Role-based access control
- Session timeout (15 minutes idle)
- Data encryption at rest

---

## Future Enhancements

### Phase 2 Features
- **Employee Self-Service Portal:** Allow employees to input their own information and view recommendations
- **API Integration with Quoting Tools:** Real-time plan data from Healthcare.gov, private exchanges
- **Venteur/Thatch API Integration:** Direct integration with partner platforms
- **Email Recommendations:** Send recommendations directly to employee email
- **Multi-language Support:** Spanish and other languages

### Phase 3 Features
- **Enrollment Integration:** Direct enrollment through the platform
- **Plan Performance Tracking:** Track which recommendations lead to satisfied employees
- **Machine Learning Optimization:** Improve recommendation algorithm based on outcomes
- **Mobile Application:** Native iOS/Android apps for administrators
- **Advanced Analytics Dashboard:** Insights on recommendation patterns, employee preferences

---

## Out of Scope (Version 1.0)

- Direct employee access (employee-facing portal)
- Real-time API integration with insurance carriers
- Enrollment processing
- Payment processing
- Claims tracking
- Provider directory search
- Telemedicine integration
- Wellness program integration

---

## Assumptions & Dependencies

### Assumptions
- Administrators have basic health insurance knowledge
- Employee information is provided accurately during consultation
- Plan database is manually maintained initially
- Consultations occur in real-time (not asynchronous)

### Dependencies
- Access to plan data (manual entry or data files)
- Hosting infrastructure (cloud provider)
- SSL certificate for HTTPS
- Authentication service

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Inaccurate recommendations | High | Medium | Thorough testing, validation rules, expert review |
| Compliance violations | High | Low | Legal review, compliance checklist, audit trail |
| Data breach | High | Low | Security best practices, encryption, penetration testing |
| Poor user adoption | Medium | Medium | User testing, training materials, intuitive UI |
| Plan data becomes outdated | Medium | High | Clear update schedule, data validation, version control |

---

## Approval & Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| Compliance Officer | | | |
| Legal Review | | | |

---

## Appendix

### Glossary

- **ICHRA:** Individual Coverage Health Reimbursement Arrangement - an employer-funded benefit that reimburses employees for individual health insurance premiums
- **ACA:** Affordable Care Act - federal healthcare law establishing coverage standards
- **MEC:** Minimum Essential Coverage - baseline level of health insurance coverage
- **HMO:** Health Maintenance Organization - plan type with network restrictions
- **PPO:** Preferred Provider Organization - plan type with flexible network
- **EPO:** Exclusive Provider Organization - plan type with exclusive network
- **HDHP:** High Deductible Health Plan - plan with lower premiums and higher deductibles
- **HSA:** Health Savings Account - tax-advantaged account paired with HDHP
- **OOP:** Out-of-Pocket - costs paid by the insured beyond premiums

### References

- Venteur ICHRA Resources: https://www.venteur.com
- Thatch ICHRA Platform: https://thatch.com
- IRS ICHRA Guidelines: https://www.irs.gov
- Healthcare.gov Marketplace: https://www.healthcare.gov
- ICHRA Rules & Regulations: https://ichra.com/ichra-rules








