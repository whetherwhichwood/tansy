<!-- 3555d8f4-da28-49ce-bd9e-14b87169d2b6 e8e2588d-2476-49b8-aba2-a08c1714423c -->
# Complete dockerbot-dev VNC Setup Plan

## Important Context

**Original Design**: dockerbot-dev was designed for Linux environments

**Your Setup**: Running on Windows 10

**How It Works**: Docker runs a Linux container with VNC desktop environment

**The Issue**: Windows uses different line endings (CRLF `\r\n`) than Linux (LF `\n`), breaking shell scripts

**The Solution**: Fix line endings on Windows, build Linux Docker image, run Linux VNC inside container

## Current State

- **Running**: `dorowu/ubuntu-desktop-lxde-vnc` (basic VNC, missing tools)
- **Available**: Original `dockerbot-dev` Dockerfile with all install scripts in `original_failure/`
- **Problem**: Shell scripts have Windows line endings, causing `$'\r': command not found` errors
- **Goal**: Build working Linux VNC with `runelite` command available in terminal

---

## Step 1: Stop Current Container

**Status**: Stopping basic VNC container...

Stop the `runescape-desktop` container:

```bash
docker stop runescape-desktop
docker rm runescape-desktop
```

**Expected Output**: Container stopped and removed

---

## Step 2: Clean Up and Prepare dockerbot-dev Directory

**Status**: Preparing clean working directory...

Remove any existing `dockerbot-dev/` and create fresh structure:

```bash
Remove-Item -Path dockerbot-dev -Recurse -Force
Copy-Item -Path original_failure/dockerbot-dev -Destination dockerbot-dev -Recurse
```

**Expected Output**: Fresh `dockerbot-dev/` directory with all original files

---

## Step 3: Fix Line Endings (Windows → Linux)

**Status**: Converting shell scripts from Windows CRLF to Linux LF format...

This is the critical step. Convert ALL shell scripts:

### 3a. Fix src/common/install/ scripts (3 files)

```powershell
Get-ChildItem dockerbot-dev/src/common/install/*.sh | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "`r`n","`n"
    [System.IO.File]::WriteAllText($_.FullName, $content)
    Write-Host "Fixed: $($_.Name)"
}
```

### 3b. Fix src/common/scripts/ (3 files including vnc_startup.sh)

```powershell
Get-ChildItem dockerbot-dev/src/common/scripts/* | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "`r`n","`n"
    [System.IO.File]::WriteAllText($_.FullName, $content)
    Write-Host "Fixed: $($_.Name)"
}
```

### 3c. Fix src/debian/install/ scripts (9 files)

```powershell
Get-ChildItem dockerbot-dev/src/debian/install/*.sh | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "`r`n","`n"
    [System.IO.File]::WriteAllText($_.FullName, $content)
    Write-Host "Fixed: $($_.Name)"
}
```

### 3d. Fix runelite command script

```powershell
$runelite = "dockerbot-dev/src/osrs/runelite"
$content = Get-Content $runelite -Raw
$content = $content -replace "`r`n","`n"
[System.IO.File]::WriteAllText($runelite, $content)
Write-Host "Fixed: runelite command script"
```

**Expected Output**: All scripts converted, "Fixed: [filename]" for each file

---

## Step 4: Build dockerbot-dev Docker Image

**Status**: Building Linux Docker image with all tools...

```bash
cd dockerbot-dev
docker build -t uniformdeviations145/dockerbot-dev .
```

**What This Installs** (inside Linux container):

- Base: Python 3 + OpenCV (Debian Linux)
- VNC: TigerVNC server + noVNC web client
- Desktop: XFCE4 desktop environment
- Browsers: Firefox + Chrome
- Development: VSCode
- OSRS: Runelite 2.7.5 (in `/headless/Runelite/`)
- Command: `runelite` script (in `/usr/local/bin/`)
- Tools: All fonts, libraries, dependencies

**Expected Output**:

- Build completes successfully
- No `$'\r': command not found` errors
- Image tagged as `uniformdeviations145/dockerbot-dev`

**Build Time**: ~10-15 minutes (downloads packages, installs tools)

---

## Step 5: Create Docker Compose Configuration

**Status**: Creating docker-compose file without VPN...

Create `dockerbot-dev/docker-compose.no-vpn.yaml`:

```yaml
version: '3.8'

services:
  dockerbot-test:
    image: uniformdeviations145/dockerbot-dev
    container_name: dockerbot-vnc
    shm_size: '512mb'
    user: '1000:27'
    ports:
      - "6901:6901"  # noVNC web interface
      - "5901:5901"  # VNC port
    volumes:
      - ./persistence:/headless/persistence
      - ./runelite:/headless/.runelite
    restart: unless-stopped
```

**Note**: VPN (gluetun) can be added later if needed

---

## Step 6: Start the Container

**Status**: Starting Linux VNC container...

```bash
docker compose -f docker-compose.no-vpn.yaml up -d
```

**Expected Output**:

- Container `dockerbot-vnc` created and started
- Status: Running

---

## Step 7: Verify Installation

**Status**: Testing VNC access and tools...

### 7a. Check Container Status

```bash
docker ps
```

**Expected**: Container `dockerbot-vnc` status = Up

### 7b. Check Container Logs

```bash
docker logs dockerbot-vnc
```

**Expected**: No `$'\r': command not found` errors

### 7c. Access VNC

Open browser: `http://localhost:6901/?password=vncpassword`

**Expected**: Linux XFCE desktop loads

### 7d. Test runelite Command

In VNC terminal:

```bash
runelite
```

**Expected**: Runelite launches

### 7e. Verify Bot Scripts

In VNC terminal:

```bash
ls /headless/persistence/osrs_bot/
```

**Expected**: All Python bot scripts visible

### 7f. Verify Credentials

```bash
cat /headless/.runelite/credentials.properties
```

**Expected**: Jagex credentials present

---

## Step 8: Save Working Image (Optional)

**Status**: Saving image for future use...

### Option A: Commit Container to Image

```bash
docker commit dockerbot-vnc uniformdeviations145/dockerbot-dev:working
```

### Option B: Export as TAR File

```bash
docker save uniformdeviations145/dockerbot-dev > dockerbot-dev-backup.tar
```

**To reload later**: `docker load < dockerbot-dev-backup.tar`

---

## Step 9: Final Cleanup (Execute After Verification)

**Status**: Cleaning up temporary files...

**⚠️ ONLY RUN THIS AFTER CONFIRMING EVERYTHING WORKS**

```powershell
# Remove original_failure archive
Remove-Item -Path original_failure -Recurse -Force

# Remove old docker-compose files
Remove-Item -Path docker-compose.working.yaml -Force

# Clean up Docker
docker system prune -f

# Optional: Remove unused images
docker image prune -a -f
```

**What Gets Removed**:

- `original_failure/` directory (entire archive)
- Old docker-compose files
- Stopped containers
- Unused images
- Build cache

**What Stays**:

- `dockerbot-dev/` (working setup)
- `persistence/` (bot scripts)
- `runelite/` (credentials)
- Running `dockerbot-vnc` container
- `uniformdeviations145/dockerbot-dev` image

---

## Final Result

### Access Information

- **VNC Web**: http://localhost:6901/?password=vncpassword
- **VNC Client**: localhost:5901 (password: vncpassword)
- **Environment**: Linux XFCE desktop in Docker container

### Available Commands (in VNC terminal)

- `runelite` - Launch Runelite
- `firefox` - Launch Firefox
- `chromium` - Launch Chrome
- `code` - Launch VSCode

### File Locations (inside container)

- Bot scripts: `/headless/persistence/osrs_bot/`
- Runelite: `/headless/Runelite/RuneLite.jar`
- Credentials: `/headless/.runelite/credentials.properties`

### On Windows Host

- Configuration: `C:\Users\griff\dev\Runescape\dockerbot-dev\`
- Bot scripts: `C:\Users\griff\dev\Runescape\persistence\osrs_bot\`
- Credentials: `C:\Users\griff\dev\Runescape\runelite\credentials.properties`

---

## Troubleshooting

### If build fails with line ending errors:

- Re-run Step 3 (line ending fixes)
- Verify no `\r` characters: `cat -A filename.sh` in container

### If container keeps restarting:

- Check logs: `docker logs dockerbot-vnc`
- Look for script errors

### If runelite command not found:

- Verify script installed: `docker exec dockerbot-vnc ls -la /usr/local/bin/runelite`
- Check permissions: Should be executable

### If VNC won't connect:

- Verify ports: `docker ps` should show 6901:6901 and 5901:5901
- Check firewall settings on Windows

### To-dos

- [ ] Fix line ending issues in dockerbot-dev shell scripts