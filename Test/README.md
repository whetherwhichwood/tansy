# ICHRA Plan Recommendation Web Application

A web application for ICHRA administrators to input employee information and receive personalized health insurance plan recommendations with detailed reasoning.

## Overview

This application helps ICHRA administrators and benefits consultants efficiently recommend health insurance plans to employees during consultation sessions. It uses intelligent algorithms based on Venteur and Thatch methodologies to match employees with optimal plans.

## Features

- **Employee Profile Input**: Comprehensive form for capturing employee demographics, health needs, and preferences
- **Intelligent Recommendations**: AI-powered algorithm that scores and ranks plans based on multiple factors
- **Detailed Reasoning**: Clear explanations for why each plan is recommended
- **Plan Comparison**: Side-by-side comparison of recommended plans
- **Compliance Verification**: Ensures all recommendations meet ICHRA and ACA standards

## Technology Stack

- **Frontend**: React 18 with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with refresh tokens
- **Deployment**: Docker containerization

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ichra-recommendation-app
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp server/.env.example server/.env
# Edit server/.env with your database credentials
```

4. Set up the database:
```bash
cd server
npx prisma migrate dev
npx prisma db seed
```

5. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
ichra-recommendation-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Database schema and migrations
│   └── package.json
├── docs/                  # Documentation
│   ├── PRD.md            # Product Requirements Document
│   └── DESIGN.md         # Technical Design Document
└── sample-data/          # Sample data for testing
```

## API Documentation

The API follows RESTful conventions. Key endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/sessions` - Create new consultation session
- `POST /api/profiles` - Create employee profile
- `POST /api/recommendations` - Generate plan recommendations
- `GET /api/plans` - List available plans

## Development

### Running Tests

```bash
npm test
```

### Database Management

```bash
# Create migration
cd server
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Code Quality

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Jest for testing

## Deployment

### Docker

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d
```

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ichra_db

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=15m

# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please contact the development team or create an issue in the repository.