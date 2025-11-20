import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address')
export const nameSchema = z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters')
export const addressSchema = z.string().min(1, 'Address is required').max(200, 'Address must be less than 200 characters')
export const inviteCodeSchema = z.string().min(1, 'Invite code is required').max(20, 'Invite code must be less than 20 characters')

// Signup validation
export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,
  inviteCode: inviteCodeSchema,
})

// Post validation
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(['HELP_NEEDED', 'BORROW_LEND', 'GROUP_BUY', 'LOCAL_TIP'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
})

// Message validation
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(500, 'Message must be less than 500 characters'),
})

// Feedback validation
export const feedbackSchema = z.object({
  badges: z.array(z.string()).min(1, 'Please select at least one badge'),
  comment: z.string().max(200, 'Comment must be less than 200 characters').optional(),
})

// Announcement validation
export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content must be less than 2000 characters'),
  isPinned: z.boolean().optional(),
})

// Utility functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      }
    }
    return {
      success: false,
      errors: ['Validation failed']
    }
  }
}

export const getFieldError = (errors: z.ZodError, fieldName: string): string | undefined => {
  const fieldError = errors.errors.find(err => err.path.includes(fieldName))
  return fieldError?.message
}








