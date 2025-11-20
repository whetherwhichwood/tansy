export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Item {
  id: string
  userId: string
  name: string
  category: string
  purchaseDate: Date
  warrantyEndDate?: Date
  purchasePrice?: number
  vendor?: string
  notes?: string
  receiptUrl?: string
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceTask {
  id: string
  userId: string
  name: string
  description?: string
  category: string
  frequency: string
  customInterval?: number
  nextDueDate: Date
  lastCompletedAt?: Date
  isActive: boolean
  reminderDays: number
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  userId: string
  name: string
  type: string
  issuer?: string
  documentNumber?: string
  issueDate?: Date
  expirationDate: Date
  fileUrl?: string
  notes?: string
  reminderDays: number
  createdAt: Date
  updatedAt: Date
}

export interface DashboardItem {
  id: string
  type: 'item' | 'task' | 'document'
  name: string
  category: string
  dueDate: Date
  status: string
  urgency: 'red' | 'yellow' | 'green'
  daysUntilDue: number
  data: Item | MaintenanceTask | Document
}

export interface CreateItemData {
  name: string
  category: string
  purchaseDate: Date
  warrantyEndDate?: Date
  purchasePrice?: number
  vendor?: string
  notes?: string
  receiptUrl?: string
}

export interface CreateTaskData {
  name: string
  description?: string
  category: string
  frequency: string
  customInterval?: number
  nextDueDate: Date
  reminderDays?: number
}

export interface CreateDocumentData {
  name: string
  type: string
  issuer?: string
  documentNumber?: string
  issueDate?: Date
  expirationDate: Date
  fileUrl?: string
  notes?: string
  reminderDays?: number
}


