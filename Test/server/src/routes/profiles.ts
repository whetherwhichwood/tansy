import express from 'express'
import Joi from 'joi'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

const profileSchema = Joi.object({
  age: Joi.number().integer().min(18).max(100).required(),
  zip_code: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required(),
  state: Joi.string().length(2).required(),
  coverage_type: Joi.string().valid('individual', 'individual_spouse', 'individual_children', 'family').required(),
  num_dependents: Joi.number().integer().min(0).default(0),
  dependent_ages: Joi.array().items(Joi.number().integer().min(0).max(26)).default([]),
  ichra_allowance: Joi.number().positive().required(),
  budget_flexibility: Joi.number().min(0).default(0),
  income_level: Joi.number().min(0).optional(),
  health_status: Joi.string().valid('excellent', 'good', 'fair', 'poor').required(),
  medical_needs: Joi.string().valid('routine', 'moderate', 'frequent').required(),
  chronic_conditions: Joi.array().items(Joi.string()).default([]),
  prescription_count: Joi.number().integer().min(0).default(0),
  preferred_providers: Joi.array().items(Joi.string()).default([]),
  plan_type_preference: Joi.string().valid('HMO', 'PPO', 'EPO', 'HDHP', 'POS').optional(),
  risk_tolerance: Joi.string().valid('low', 'moderate', 'high').required(),
  priorities: Joi.object({
    cost: Joi.number().integer().min(1).max(5).required(),
    coverage: Joi.number().integer().min(1).max(5).required(),
    network: Joi.number().integer().min(1).max(5).required(),
    flexibility: Joi.number().integer().min(1).max(5).required()
  }).required()
})

// POST /api/profiles
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = profileSchema.validate(req.body)
    if (error) {
      throw new AppError(error.details[0].message, 400)
    }

    // Create session first
    const session = await prisma.session.create({
      data: {
        user_id: req.user!.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })

    // Create profile
    const profile = await prisma.employeeProfile.create({
      data: {
        ...value,
        session_id: session.id
      }
    })

    res.json({
      success: true,
      data: {
        profile,
        session_id: session.id
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/profiles/:id
router.get('/:id', async (req, res, next) => {
  try {
    const profile = await prisma.employeeProfile.findFirst({
      where: {
        id: parseInt(req.params.id),
        session: {
          user_id: req.user!.id
        }
      }
    })

    if (!profile) {
      throw new AppError('Profile not found', 404)
    }

    res.json({
      success: true,
      data: profile
    })
  } catch (error) {
    next(error)
  }
})

export default router







