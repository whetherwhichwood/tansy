export interface User {
  id: string
  name: string
  avatar: string
  dateOfBirth: string
  sexAtBirth: string
}

export interface Insurance {
  type: string
  policyHolderName: string
  coverageStartDate: string
  memberId: string
  provider: string
  planType: string
  groupNumber: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'tansy' | 'hugo'
  content: string
  timestamp: string
  read?: boolean
}

export interface Task {
  id: string
  title: string
  status: 'in-progress' | 'completed' | 'pending'
}

export interface Update {
  id: string
  message: string
  timestamp: string
}

export const mockUser: User = {
  id: '1',
  name: 'Griffin Baker',
  avatar: 'G',
  dateOfBirth: '1998-02-10',
  sexAtBirth: 'Male',
}

export const mockInsurance: Insurance = {
  type: 'Medical',
  policyHolderName: 'Griffin Baker',
  coverageStartDate: '01/01/2025',
  memberId: '........37',
  provider: 'SelectHealth',
  planType: 'HMO/Individual and Family',
  groupNumber: '.........k)',
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'user',
    content: 'Can you help me get set up on with my annual appointment ASAP?',
    timestamp: 'Oct 26, 11:44 PM',
  },
  {
    id: '2',
    sender: 'tansy',
    content:
      "I'm on it—I tried to set up a care-team task to coordinate your annual physical, but there was a system error. If you share 1-2 quick details to speed things up: 1) do you have a preferred PCP or clinic? 2) rough timing window (this week, next week, ASAP). I'll retry the task right away and keep you posted here once the team starts on it. Quick note from your profile: insurance SelectHealth, member_id 802896737; PCP isn't on file yet.",
    timestamp: 'Oct 26, 11:46 PM',
  },
  {
    id: '3',
    sender: 'user',
    content: '1. No. 2. ASAP',
    timestamp: 'Oct 27, 9:19 AM',
    read: true,
  },
  {
    id: '4',
    sender: 'hugo',
    content:
      'I found a few primary care locations that are in-network with UnitedHealthcare and have multiple providers available for annual exams. Here are some options for you to choose. How can I help?',
    timestamp: 'Oct 27, 9:20 AM',
  },
  {
    id: '5',
    sender: 'user',
    content: 'That sounds great! Can you tell me more about the Tropicana Healthcare Center?',
    timestamp: 'Oct 27, 9:22 AM',
    read: false,
  },
]

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Schedule annual appointment',
    status: 'in-progress',
  },
]

export const mockUpdates: Update[] = [
  {
    id: "1",
    message: "Searching for providers that match the user's insurance and location",
    timestamp: 'Oct 27, 9:19 AM',
  },
]

export const mockProviders = [
  {
    id: '1',
    name: 'Tropicana Healthcare Center',
  },
]

export interface OnboardingItem {
  id: string
  label: string
  completed: boolean
}

export const mockOnboardingItems: OnboardingItem[] = [
  {
    id: 'tutorial',
    label: 'Tutorial',
    completed: false,
  },
  {
    id: 'consent',
    label: 'Consent Agreement',
    completed: false,
  },
  {
    id: 'basic-info',
    label: 'Basic Information',
    completed: false,
  },
  {
    id: 'contact',
    label: 'Contact Information',
    completed: false,
  },
  {
    id: 'coverage',
    label: 'Add Coverage',
    completed: false,
  },
  {
    id: 'chat',
    label: 'Start a conversation with Tansy',
    completed: false,
  },
]

// Before version - only 5 items (no chat step)
export const mockOnboardingItemsBefore: OnboardingItem[] = [
  {
    id: 'tutorial',
    label: 'Tutorial',
    completed: false,
  },
  {
    id: 'consent',
    label: 'Consent Agreement',
    completed: false,
  },
  {
    id: 'basic-info',
    label: 'Basic Information',
    completed: false,
  },
  {
    id: 'contact',
    label: 'Contact Information',
    completed: false,
  },
  {
    id: 'coverage',
    label: 'Add Coverage',
    completed: false,
  },
]

export interface ActiveAction {
  id: string
  title: string
  description: string
  type: 'chat' | 'task' | 'appointment'
  priority: 'high' | 'medium' | 'low'
  estimatedTime?: number
}

export const mockActiveActions: ActiveAction[] = [
  {
    id: '1',
    title: 'Schedule annual appointment',
    description: 'Your annual physical is due',
    type: 'appointment',
    priority: 'high',
    estimatedTime: 15,
  },
  {
    id: '2',
    title: 'Update insurance information',
    description: 'Verify your coverage details',
    type: 'task',
    priority: 'medium',
    estimatedTime: 5,
  },
]

export interface ChatSummary {
  topic: string
  lastMessageTime: string
  lastMessagePreview: string
}

export const mockChatSummary: ChatSummary = {
  topic: 'Scheduling annual appointment',
  lastMessageTime: 'Oct 27, 9:20 AM',
  lastMessagePreview: 'I found a few primary care locations that are in-network...',
}

