# Quick Start Scripts Guide

This project includes multiple ways to start the application, optimized for different scenarios.

## 📱 Quickest Mobile Setup (Recommended)

For **GitHub Codespaces + Mobile Access**, copy this entire command:

```bash
docker stop short-video-maker 2>/dev/null; docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet && docker run -it --rm --name short-video-maker -p 3123:3123 -e PEXELS_API_KEY="${PEXELS_API_KEY:-$(grep PEXELS_API_KEY .env 2>/dev/null || echo '')}" short-video-maker:latest
```

Then in VS Code, make port 3123 public and open on your mobile device.

## 🚀 Script Options

### Option 1: Full Setup (First Time)

```bash
./start.sh
```

**What it does:**
1. ✅ Checks for `PEXELS_API_KEY` (interactive prompt if missing)
2. ✅ Installs dependencies (`pnpm install`)
3. ✅ Builds TypeScript & React (`pnpm build`)
4. ✅ Builds Docker image
5. ✅ Runs container on port 3123

**Time:** 3-5 minutes first time
**Best for:** First-time setup in Codespaces

### Option 2: Quick Run (After First Setup)

```bash
./quick-start.sh
```

Or with explicit API key:

```bash
./quick-start.sh your-pexels-api-key
```

**What it does:**
1. ✅ Runs pre-built Docker image
2. ✅ No dependencies, no build
3. ⚡ Fast startup

**Time:** 10-30 seconds
**Best for:** Restarting app during development

### Option 3: Manual Docker Run

```bash
# Build
docker build -f main-tiny.Dockerfile -t short-video-maker:latest .

# Run
docker run -it --rm -p 3123:3123 -e PEXELS_API_KEY="your-key" short-video-maker:latest
```

**Time:** Depends on Docker cache
**Best for:** Custom configurations

### Option 4: CUDA Version (If GPU Available)

```bash
docker build -f main-cuda.Dockerfile -t short-video-maker:cuda .
docker run -it --rm --gpus all -p 3123:3123 -e PEXELS_API_KEY="your-key" short-video-maker:cuda
```

## 🔑 API Key Setup

### Automatically (Scripts Handle This)

Scripts automatically check these locations in order:
1. Environment variable: `PEXELS_API_KEY`
2. `.env` file in project root: `PEXELS_API_KEY=xxx`
3. Interactive prompt (if not found)

### Get Your API Key

1. Go to [pexels.com/api](https://www.pexels.com/api/)
2. Create account or login
3. Generate API key
4. Add to `.env` file:
   ```
   PEXELS_API_KEY=your-key-here
   ```

## 📱 Mobile Access Steps

After starting with any option:

### In VS Code (Codespaces)

1. Click **Ports** tab at bottom
2. Find **port 3123**
3. Right-click → **Make Public**
4. Copy the forwarded URL

### On Mobile Device

1. Open the forwarded URL on mobile browser
2. Navigate to `/bulk` for bulk generation
3. Or `/` for main video creator

## 🎯 Recommended Workflow

### First Time
```bash
./start.sh
# Wait for "Short Video Maker is running!" message
```

### Subsequent Times
```bash
./quick-start.sh
# App starts in ~15 seconds
```

### If You Modified Code
```bash
./start.sh
# Rebuilds everything
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
docker stop short-video-maker
./quick-start.sh
```

### API Key Not Found
```bash
export PEXELS_API_KEY="your-key-here"
./quick-start.sh
```

### Docker Build Fails
```bash
# Clean rebuild
docker image rm short-video-maker:latest 2>/dev/null
./start.sh
```

### "Cannot connect from mobile"
1. Ensure port 3123 is **Public** (not Private)
2. Use HTTPS variant of forwarded URL
3. Check firewall settings

## 📊 Performance Recommendations

| Scenario | Script | Image Size | Speed |
|----------|--------|-----------|-------|
| First setup | `./start.sh` | 1.2GB | 3-5m |
| Quick restart | `./quick-start.sh` | - | 15-30s |
| Mobile only | One-liner | 1.2GB | 30s |
| GPU available | CUDA Docker | 2.5GB | 30s |

## 🐳 Docker Image Options

The project includes 3 Docker variants:

1. **main-tiny.Dockerfile** (Recommended)
   - Smallest size (~1.2GB)
   - Fast build
   - Sufficient for most use cases
   - ✅ Used by default scripts

2. **main.Dockerfile**
   - Standard setup
   - Includes all tools
   - ~1.8GB
   - Use if tiny has issues

3. **main-cuda.Dockerfile**
   - GPU acceleration
   - Whisper speech-to-text faster
   - ~2.5GB
   - Requires `--gpus all` flag

## 📝 Sample .env File

```bash
# Required
PEXELS_API_KEY=563492ad6f91700001000001c0b1e5d6f...

# Optional (auto-generated if not set)
MCP_ENABLED=true
OPENAI_API_KEY=sk-...
```

## 🔍 Verify It's Working

After startup, check these endpoints:

```bash
# Via curl or Postman
curl http://localhost:3123/api/voices
curl http://localhost:3123/api/music-tags
curl http://localhost:3123/api/trending-topics
```

Should return JSON responses.

## 💡 Pro Tips

- **Dev Loop:** Use `quick-start.sh` for rapid restarts
- **Mobile Testing:** Test UI on actual phone for responsive issues
- **Progress Tracking:** Watch Docker logs for build/run progress
- **Network Issues:** If port forwarding fails, try:
  - Click refresh in Ports tab
  - Wait 5 seconds
  - Try again

## 🚨 Common Errors

### `docker: permission denied`
Run with `sudo` or configure Docker daemon access.

### `PEXELS_API_KEY not set`
Add to `.env` or export before running:
```bash
export PEXELS_API_KEY="your-key"
./quick-start.sh
```

### Port binding fails
Another process using port 3123:
```bash
lsof -i :3123  # Find process
kill -9 <PID>   # Kill it
./quick-start.sh
```

---

**Questions?** Check the main README (4.2 Quick Start section) or MOBILE_ACCESS_GUIDE.md for detailed troubleshooting.
