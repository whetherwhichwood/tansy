# Tansy App Wireframe Clone

A high-fidelity interactive prototype of the Tansy healthcare app, featuring three main screens: Dashboard, Chat/AI interface, and Profile page.

## Features

- **Dashboard**: Main landing page with search bar, user circles, and appointment tabs
- **Chat Interface**: AI-powered chat interface with task cards, update cards, and provider recommendations
- **Profile Page**: User profile with insurance information, details, and tabbed navigation

## Technology Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (Icons)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /dashboard - Main dashboard screen
  /chat - Chat/AI interface
  /profile - Profile page
/components
  /ui - Reusable UI components
  /layout - Header, navigation components
/lib - Utilities and mock data
```

## Screens

### Dashboard (`/dashboard`)
- Search bar with "How can I help you today?" placeholder
- User/circle selection card
- Tab navigation (Feed/Appointments)
- Sub-tabs for appointments (Upcoming/Past/Canceled)
- Empty state display

### Chat (`/chat`)
- Conversational interface with Tansy AI
- Task cards with status indicators
- Update cards showing progress
- Provider recommendations
- Message input area

### Profile (`/profile`)
- Profile card with avatar
- User details (Date of Birth, Sex at Birth)
- Tabbed navigation (Insurance/Files/Reports/Tasks)
- Insurance information card

## Design System

The app uses a custom color scheme:
- **Teal**: Primary accent color (`#4FD1C7`)
- **Pink**: Secondary accent color (`#F687B3`)
- **Gray**: Neutral colors for text and backgrounds

## Development

This is a wireframe/prototype for UI demonstration purposes. All data is mocked and interactions are simulated.

