# Runescape Bot - Isolated Development Environment

This is your isolated development environment for the Runescape bot project. It's designed to work independently without interfering with the main project.

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Copy environment file
cp env.example .env

# Edit configuration (optional)
notepad .env
```

### 2. Start the Environment
```bash
# Build and start all services
docker compose up --build

# Or run in background
docker compose up -d --build
```

### 3. Check Status
```bash
# View running containers
docker compose ps

# Check logs
docker compose logs runescape-bot

# Check bot health
curl http://localhost:8080/health
```

## 🛠️ Services

| Service | Port | Description |
|---------|------|-------------|
| **runescape-bot** | 8080 | Main bot application |
| **bot-web** | 3000 | Web interface (optional) |
| **postgres** | 5433 | Database (isolated port) |
| **redis** | 6380 | Cache/sessions (isolated port) |

## 📁 Project Structure

```
Runescape/
├── docker-compose.yml      # Main orchestration
├── Dockerfile             # Bot container
├── requirements.txt       # Python dependencies
├── main.py               # Bot application
├── env.example           # Environment template
├── bot-config/           # Bot configuration files
├── logs/                 # Application logs
├── screenshots/          # Bot screenshots
├── scripts/              # Utility scripts
└── init-scripts/         # Database initialization
```

## 🔧 Development Commands

### Container Management
```bash
# Start services
docker compose up

# Stop services
docker compose down

# Rebuild and start
docker compose up --build

# View logs
docker compose logs -f runescape-bot
```

### Database Operations
```bash
# Connect to database
docker compose exec postgres psql -U runescape_user -d runescape_bot

# Backup database
docker compose exec postgres pg_dump -U runescape_user runescape_bot > backup.sql

# Restore database
docker compose exec -T postgres psql -U runescape_user -d runescape_bot < backup.sql
```

### Bot Operations
```bash
# Start bot
curl -X POST http://localhost:8080/start

# Stop bot
curl -X POST http://localhost:8080/stop

# Check status
curl http://localhost:8080/status
```

## 🔒 Isolation Features

- **Separate Ports**: Uses different ports (5433, 6380) to avoid conflicts
- **Isolated Network**: Custom Docker network for this project only
- **Independent Volumes**: Separate data storage
- **Environment Isolation**: Own configuration and secrets

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   netstat -an | findstr :8080
   netstat -an | findstr :5433
   ```

2. **Container Won't Start**
   ```bash
   # Check logs
   docker compose logs runescape-bot
   
   # Rebuild from scratch
   docker compose down -v
   docker compose up --build
   ```

3. **Database Connection Issues**
   ```bash
   # Check database status
   docker compose exec postgres pg_isready -U runescape_user
   ```

### Reset Everything
```bash
# Stop and remove everything
docker compose down -v --remove-orphans

# Remove all images
docker compose down --rmi all

# Start fresh
docker compose up --build
```

## 📝 Configuration

Edit `.env` file to customize:
- Database credentials
- Bot settings
- API ports
- Logging levels
- External service integrations

## 🤝 Collaboration

This environment is designed to work alongside the main project:
- Uses different container names
- Different ports
- Separate data volumes
- Independent configuration

You can develop and test without affecting the main project!

## 📞 Support

If you need help:
1. Check the logs: `docker compose logs`
2. Verify configuration: `docker compose config`
3. Test connectivity: `curl http://localhost:8080/health`
