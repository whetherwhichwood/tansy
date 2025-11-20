import express from 'express'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// GET /api/plans
router.get('/', async (req, res, next) => {
  try {
    const { state, zip_code, plan_type, metal_tier, limit = '50' } = req.query

    const where: any = {
      is_active: true
    }

    if (state) {
      where.state = state
    }

    if (zip_code) {
      where.zip_codes = {
        has: zip_code
      }
    }

    if (plan_type) {
      where.plan_type = plan_type
    }

    if (metal_tier) {
      where.metal_tier = metal_tier
    }

    const plans = await prisma.plan.findMany({
      where,
      take: parseInt(limit as string),
      orderBy: { monthly_premium: 'asc' }
    })

    res.json({
      success: true,
      data: plans
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/plans/:id
router.get('/:id', async (req, res, next) => {
  try {
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!plan) {
      throw new AppError('Plan not found', 404)
    }

    res.json({
      success: true,
      data: plan
    })
  } catch (error) {
    next(error)
  }
})

export default router







