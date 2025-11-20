import express from 'express'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'
import { generateRecommendations } from '../services/recommendationEngine'

const router = express.Router()
const prisma = new PrismaClient()

// POST /api/recommendations
router.post('/', async (req, res, next) => {
  try {
    const { profile } = req.body

    if (!profile) {
      throw new AppError('Profile data is required', 400)
    }

    // Generate recommendations using the recommendation engine
    const recommendations = await generateRecommendations(profile)

    // Create session if not provided
    let sessionId = profile.session_id
    if (!sessionId) {
      const session = await prisma.session.create({
        data: {
          user_id: req.user!.id,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })
      sessionId = session.id
    }

    // Save recommendations to database
    const savedRecommendations = []
    for (const rec of recommendations) {
      const saved = await prisma.recommendation.create({
        data: {
          session_id: sessionId,
          plan_id: rec.plan_id,
          rank: rec.rank,
          total_score: rec.total_score,
          affordability_score: rec.scores.affordability,
          coverage_score: rec.scores.coverage,
          network_score: rec.scores.network,
          plan_type_score: rec.scores.planType,
          oop_protection_score: rec.scores.oopProtection,
          reasoning: rec.reasoning,
          key_benefits: rec.key_benefits,
          trade_offs: rec.trade_offs,
          budget_analysis: rec.budget_analysis
        }
      })
      savedRecommendations.push(saved)
    }

    res.json({
      success: true,
      data: {
        session_id: sessionId,
        recommendations: savedRecommendations,
        created_at: new Date().toISOString()
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/recommendations/:sessionId
router.get('/:sessionId', async (req, res, next) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        session_id: req.params.sessionId,
        session: {
          user_id: req.user!.id
        }
      },
      include: {
        plan: true
      },
      orderBy: { rank: 'asc' }
    })

    if (recommendations.length === 0) {
      throw new AppError('No recommendations found for this session', 404)
    }

    res.json({
      success: true,
      data: {
        session_id: req.params.sessionId,
        recommendations: recommendations.map(rec => ({
          id: rec.id,
          plan: rec.plan,
          rank: rec.rank,
          total_score: rec.total_score,
          scores: {
            affordability: rec.affordability_score,
            coverage: rec.coverage_score,
            network: rec.network_score,
            planType: rec.plan_type_score,
            oopProtection: rec.oop_protection_score
          },
          reasoning: rec.reasoning,
          key_benefits: rec.key_benefits,
          trade_offs: rec.trade_offs,
          budget_analysis: rec.budget_analysis,
          created_at: rec.created_at
        }))
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/recommendations/:sessionId/export
router.get('/:sessionId/export', async (req, res, next) => {
  try {
    // For now, return a simple text response
    // In a real implementation, this would generate a PDF
    const recommendations = await prisma.recommendation.findMany({
      where: {
        session_id: req.params.sessionId,
        session: {
          user_id: req.user!.id
        }
      },
      include: {
        plan: true
      },
      orderBy: { rank: 'asc' }
    })

    if (recommendations.length === 0) {
      throw new AppError('No recommendations found for this session', 404)
    }

    // Simple text export for now
    let exportText = 'ICHRA Plan Recommendations\n'
    exportText += '========================\n\n'
    
    recommendations.forEach((rec, index) => {
      exportText += `${index + 1}. ${rec.plan.carrier_name} ${rec.plan.plan_name}\n`
      exportText += `   Score: ${rec.total_score}/100\n`
      exportText += `   Premium: $${rec.plan.monthly_premium}/month\n`
      exportText += `   Deductible: $${rec.plan.annual_deductible}\n`
      exportText += `   Reasoning: ${rec.reasoning}\n\n`
    })

    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Content-Disposition', 'attachment; filename="recommendations.txt"')
    res.send(exportText)
  } catch (error) {
    next(error)
  }
})

export default router







