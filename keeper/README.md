# Keeper - Home & Life Upkeep Tracker

Never forget what needs fixing, renewing, or replacing again. Track warranties, maintenance tasks, and document renewals in one place.

## Features

- **Item Tracking**: Track products with warranty information
- **Maintenance Scheduler**: Recurring maintenance tasks with templates
- **Document Renewals**: Track ID renewals, insurance, subscriptions
- **Unified Dashboard**: See everything due soon in one place
- **Smart Reminders**: Color-coded urgency indicators
- **Mobile-First**: Responsive design with PWA support

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (subdomain: keeper.griffinbaker.com)

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd keeper
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your database URL:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/keeper"
   NEXT_PUBLIC_APP_URL="http://localhost:3003"
   ```

3. **Set up the database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3003](http://localhost:3003)

## Database Setup

### Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `keeper`
3. Update your `.env.local` with the connection string

### Vercel Postgres (Recommended for Production)

1. Create a Vercel Postgres database
2. Copy the connection string to your environment variables
3. Deploy to Vercel

## Available Scripts

- `npm run dev` - Start development server on port 3003
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data

## Project Structure

```
keeper/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts            # Demo data seeding
├── src/
│   ├── app/               # Next.js app router
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard pages
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   └── layout/        # Layout components
│   └── lib/               # Utilities and helpers
│       ├── prisma.ts      # Prisma client
│       ├── auth.ts        # Auth helpers
│       └── date-utils.ts  # Date calculations
├── public/uploads/        # File uploads (dev only)
└── vercel.json           # Vercel deployment config
```

## Demo Data

The seed script creates a demo user with sample data:
- **Email**: demo@keeper.app
- **Items**: Samsung Refrigerator, MacBook Pro, Dyson Vacuum, DeWalt Drill
- **Tasks**: HVAC Filter, Smoke Detector, Water Heater, Gutter Cleaning
- **Documents**: Driver's License, Passport, Car Registration, Insurance

## Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL`: https://keeper.griffinbaker.com

3. **Configure subdomain**:
   - Add `keeper.griffinbaker.com` as a custom domain
   - Update DNS with CNAME record pointing to Vercel

4. **Deploy**: Vercel will automatically deploy on git push

### Manual Deployment

```bash
npm run build
npm run start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create user account

### Items
- `GET /api/items` - List all items
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get item details
- `PATCH /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Maintenance Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get task details
- `PATCH /api/tasks/[id]` - Update task
- `POST /api/tasks/[id]/complete` - Mark task complete
- `DELETE /api/tasks/[id]` - Delete task

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Create new document
- `GET /api/documents/[id]` - Get document details
- `PATCH /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

## Development Notes

- **Authentication**: Demo-only email-based auth (no passwords)
- **File Uploads**: Local storage in development, cloud storage in production
- **Status Calculation**: Real-time calculation based on expiration dates
- **Mobile-First**: Responsive design with bottom navigation on mobile
- **Color Coding**: Red (urgent), Yellow (expiring soon), Green (active)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details