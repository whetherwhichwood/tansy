import { api } from './api'
import { 
  EmployeeProfile, 
  GenerateRecommendationsRequest, 
  GenerateRecommendationsResponse,
  CreateProfileRequest,
  CreateProfileResponse
} from '../types'

export const recommendationService = {
  async createProfile(profileData: CreateProfileRequest): Promise<{ data: CreateProfileResponse }> {
    const response = await api.post('/profiles', profileData)
    return response.data
  },

  async generateRecommendations(profile: EmployeeProfile): Promise<{ data: GenerateRecommendationsResponse }> {
    const response = await api.post('/recommendations', { profile })
    return response.data
  },

  async getRecommendations(sessionId: string): Promise<{ data: GenerateRecommendationsResponse }> {
    const response = await api.get(`/recommendations/${sessionId}`)
    return response.data
  },

  async exportRecommendations(sessionId: string): Promise<Blob> {
    const response = await api.get(`/recommendations/${sessionId}/export`, {
      responseType: 'blob'
    })
    return response.data
  }
}







