# Neighborly - HOA Micro-Errand Network

A private micro-errand and favor-exchange network designed specifically for HOAs and residential communities. Skip the Facebook chaos, connect with verified neighbors for quick help, tool borrowing, and small exchanges.

## Features

- **Private HOA Circles**: Access limited to verified HOA residents
- **Micro-Errand Board**: Post and claim small help requests
- **In-App Chat**: Coordinate with neighbors privately
- **Reputation System**: Emoji-based feedback and trust scoring
- **Community Board**: HOA announcements and updates
- **Mobile-First Design**: Responsive PWA for all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Cookie-based session management
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neighborly
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/neighborly"
NEXT_PUBLIC_APP_URL="http://localhost:3002"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3002`.

### Demo Access

Use the following credentials to test the app:
- **Invite Code**: `DEMO2025`
- **HOA**: Sunset Ridge HOA
- **Sample Residents**: 5 pre-seeded residents with various reputation scores

## Project Structure

```
neighborly/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Demo data seeding
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── api/             # API routes
│   │   ├── feed/            # Errand board pages
│   │   ├── my-posts/        # User posts dashboard
│   │   ├── messages/        # Chat interface
│   │   ├── community/       # HOA announcements
│   │   └── profile/         # User profiles
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── feed/           # Errand board components
│   │   ├── posts/          # Post management
│   │   ├── chat/           # Messaging interface
│   │   ├── feedback/       # Reputation system
│   │   ├── profile/        # User profiles
│   │   ├── community/      # Announcements
│   │   └── layout/         # Navigation and layout
│   └── lib/                # Utilities and helpers
│       ├── prisma.ts       # Database client
│       ├── auth.ts         # Authentication helpers
│       └── types.ts        # TypeScript types
├── vercel.json             # Vercel deployment config
└── next.config.js          # Next.js configuration
```

## Database Schema

### Core Models

- **HOA**: Community information and invite codes
- **Resident**: User profiles with reputation scoring
- **Post**: Errand requests with categories and status
- **Message**: In-app chat messages
- **Feedback**: Reputation system with emoji badges
- **Announcement**: HOA admin posts

### Key Relationships

- Residents belong to HOAs
- Posts are created by residents and can be claimed by others
- Messages are linked to posts and senders
- Feedback links residents bidirectionally for reputation

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new resident account

### Posts
- `GET /api/posts` - List posts with filtering
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get post details
- `PATCH /api/posts/[id]` - Update post status
- `POST /api/posts/[id]/claim` - Claim a post
- `GET /api/posts/my-posts` - User's posts dashboard

### Messaging
- `GET /api/posts/[id]/messages` - Get post messages
- `POST /api/posts/[id]/messages` - Send message
- `GET /api/messages` - List active conversations

### Community
- `GET /api/announcements` - HOA announcements
- `GET /api/residents/[id]` - Resident profile

### Feedback
- `POST /api/feedback` - Submit reputation feedback

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
3. Deploy automatically on push to main branch

### Subdomain Setup

1. Add domain `neighborly.griffinbaker.com` to Vercel project
2. Configure DNS CNAME record pointing to Vercel
3. Update `NEXT_PUBLIC_APP_URL` environment variable

### Database Setup

For production, use a managed PostgreSQL service:
- Vercel Postgres
- Supabase
- PlanetScale
- Railway

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub.