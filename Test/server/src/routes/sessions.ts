import express from 'express'
import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler'

const router = express.Router()
const prisma = new PrismaClient()

// POST /api/sessions
router.post('/', async (req, res, next) => {
  try {
    const session = await prisma.session.create({
      data: {
        user_id: req.user!.id,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    })

    res.json({
      success: true,
      data: session
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/sessions
router.get('/', async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { user_id: req.user!.id },
      orderBy: { created_at: 'desc' },
      take: 10
    })

    res.json({
      success: true,
      data: sessions
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/sessions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const session = await prisma.session.findFirst({
      where: {
        id: req.params.id,
        user_id: req.user!.id
      }
    })

    if (!session) {
      throw new AppError('Session not found', 404)
    }

    res.json({
      success: true,
      data: session
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.session.deleteMany({
      where: {
        id: req.params.id,
        user_id: req.user!.id
      }
    })

    res.json({
      success: true,
      message: 'Session deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router







