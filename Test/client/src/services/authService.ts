import { api } from './api'
import { LoginRequest, LoginResponse, User } from '../types'

export const authService = {
  async login(credentials: LoginRequest): Promise<{ data: LoginResponse }> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getCurrentUser(): Promise<{ data: User }> {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refreshToken(): Promise<{ data: { token: string } }> {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}







