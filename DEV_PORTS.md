# Development Port Configuration

This document outlines the port assignments for all development projects and their future subdomain mappings.

## Port Assignments

| Project | Port | URL | Status |
|---------|------|-----|--------|
| Portfolio Website | 3000 | http://localhost:3000 | ✅ Configured |
| Productivity Bingo | 3001 | http://localhost:3001 | ✅ Configured |
| Body Double App | 3002 | http://localhost:3002 | ✅ Configured |
| Baby Tracker | 3003 | http://localhost:3003 | ✅ Configured |
| Neighborhood Micro-Favor App | 3004 | http://localhost:3004 | ✅ Configured |
| Maintenance & Warranty Tracker | 3005 | http://localhost:3005 | ✅ Configured |

## Socket Server Ports

| Service | Port | Description |
|---------|------|-------------|
| Body Double Socket Server | 4002 | WebSocket server for real-time features |

## Starting Development Servers

### Individual Projects

```bash
# Portfolio Website (Next.js)
cd website
npm run dev

# Productivity Bingo (Next.js)
cd bingo
npm run dev

# Body Double App (Next.js + Socket Server)
cd projects/body-double-app/body-double-app/app
npm run dev:all

# Baby Tracker (Static with http-server)
cd baby
npm run dev

# Neighborhood Micro-Favor App (Next.js)
cd neighborhood-app
npm run dev

# Maintenance & Warranty Tracker (Next.js)
cd maintenance-tracker
npm run dev
```

### Running All Projects Simultaneously

You can run multiple projects in separate terminal windows/tabs, or use a process manager like `concurrently`:

```bash
# Install concurrently globally
npm install -g concurrently

# Run all projects (from dev root)
concurrently \
  "cd website && npm run dev" \
  "cd bingo && npm run dev" \
  "cd projects/body-double-app/body-double-app/app && npm run dev:all" \
  "cd baby && npm run dev" \
  "cd neighborhood-app && npm run dev" \
  "cd maintenance-tracker && npm run dev"
```

## Future Subdomain Mapping

When deploying to production, projects will be accessible via:

| Subdomain | Project | Local Development |
|-----------|---------|-------------------|
| griffinbaker.dev | Portfolio Website | localhost:3000 |
| bingo.griffinbaker.dev | Productivity Bingo | localhost:3001 |
| bodydouble.griffinbaker.dev | Body Double App | localhost:3002 |
| baby.griffinbaker.dev | Baby Tracker | localhost:3003 |
| neighborhood.griffinbaker.dev | Neighborhood Micro-Favor App | localhost:3004 |
| maintenance.griffinbaker.dev | Maintenance & Warranty Tracker | localhost:3005 |

## Project Dependencies

### Portfolio Website
- **Framework**: Next.js 15.5.4
- **Styling**: Tailwind CSS
- **TypeScript**: Yes
- **Dependencies**: Framer Motion, Lucide React, Gray Matter

### Productivity Bingo
- **Framework**: Next.js 14.0.4
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **TypeScript**: Yes

### Body Double App
- **Framework**: Next.js 15.5.4
- **Real-time**: Socket.IO
- **State Management**: Zustand
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **TypeScript**: Yes

### Baby Tracker
- **Type**: Static PWA
- **Server**: http-server
- **Features**: Service Worker, Manifest, Multi-language

### Neighborhood Micro-Favor App
- **Framework**: Next.js 15.5.6
- **Styling**: Tailwind CSS
- **TypeScript**: Yes
- **Status**: New project (placeholder)

### Maintenance & Warranty Tracker
- **Framework**: Next.js 15.5.6
- **Styling**: Tailwind CSS
- **TypeScript**: Yes
- **Status**: New project (placeholder)

## Development Notes

1. **Port Conflicts**: If any port is already in use, you can change it by modifying the respective `package.json` dev script.

2. **Socket Server**: The Body Double App requires both the Next.js dev server (port 3002) and the Socket.IO server (port 4002) to be running.

3. **Database**: The Productivity Bingo app uses Prisma with SQLite. Run `npm run db:push` to set up the database.

4. **PWA**: The Baby Tracker is a Progressive Web App with offline capabilities.

5. **Hot Reload**: All Next.js projects support hot reloading during development.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Socket Connection Issues
- Ensure the Socket.IO server (port 4002) is running for Body Double App
- Check CORS settings in `server.js` if connecting from different origins

### Database Issues (Productivity Bingo)
```bash
cd bingo
npm run db:generate
npm run db:push
npm run db:seed
```








