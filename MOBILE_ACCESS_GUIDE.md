# Mobile Access Guide - Run on Codespaces

## 🚀 Quick Start (One Command)

### Option 1: Full Setup (Build + Run)
```bash
./start.sh
```

This will:
1. ✅ Install dependencies (pnpm)
2. ✅ Build the project (TypeScript + React)
3. ✅ Build Docker image
4. ✅ Start the container
5. ✅ Make it accessible from mobile

**Takes ~3-5 minutes first time**

---

### Option 2: Quick Run (Already Built)
```bash
./quick-start.sh
```

This will just start the container (much faster).

**Requires**: Docker image already built

---

## 📱 Access from Mobile in Codespaces

### Step 1: Start the Application
```bash
./start.sh
```

Wait for the message:
```
🚀 Short Video Maker is running!
```

### Step 2: Get the Mobile URL

The container will run on `localhost:3123`. In Codespaces, you need to **port forward** it.

#### Method A: Automatic Port Forwarding (Easiest)

VS Code will automatically detect the port. Look for the **Ports** tab:

1. Click **Ports** tab (usually next to Terminal)
2. Right-click the `3123` port
3. Select **Make Public**
4. Click the link/globe icon
5. **Copy the forwarded URL**

URL format: `https://[username]-short-video-maker-[random].github.dev`

#### Method B: Manual Port Forwarding

In terminal:
```bash
# Get the Codespaces URL
echo "https://$(echo $CODESPACE_NAME).github.dev:3123"
```

Copy this URL to your phone's browser.

---

## 🔗 Access from Mobile Devices

### On Your Phone/Tablet:

1. **Get the URL from VS Code** (see Step 2 above)
2. **Open browser on mobile device**
3. **Paste the URL**
4. **Access the UI:**
   - Home: https://[url]/
   - Create Video: https://[url]/create
   - Bulk Generate: https://[url]/bulk
   - Video List: https://[url]/

### Example URLs:
```
https://john-short-video-maker-abc123.github.dev/bulk
https://john-short-video-maker-abc123.github.dev/create
```

---

## 🛑 Stop the Application

### In Terminal:
```bash
Ctrl + C
```

Or in another terminal:
```bash
docker stop short-video-maker
```

---

## 🔧 Troubleshooting

### "Cannot connect to Docker daemon"
```bash
# Start Docker first
sudo dockerd &
# Then run
./start.sh
```

### "Port 3123 already in use"
```bash
# Kill the existing container
docker kill short-video-maker
# Then try again
./start.sh
```

### "API not responding from mobile"
1. Check port is marked as **Public** in VS Code Ports tab
2. Refresh the browser
3. Check Docker logs: `docker logs short-video-maker`

### "Different device can't access"
In Codespaces:
1. Ports tab → Right-click 3123 → **Make Public** ✅
2. VS Code Settings → `Remote: Forwarded Port Sharing Level` → Change to **Public**

---

## 📲 Mobile Workflow Example

```
1. Open terminal in VS Code
2. Run: ./start.sh
3. Wait for startup message
4. Go to VS Code Ports tab
5. Make port 3123 Public
6. Copy the forwarded URL
7. Open on mobile browser
8. Start generating videos!
```

---

## 💡 Pro Tips

### Tip 1: Keep Terminal Running
Leave the terminal with `./start.sh` running. Don't close it.

### Tip 2: Use Multiple Terminals
- Terminal 1: `./start.sh` (keep running)
- Terminal 2: Use for other commands
- Terminal 3: Tail Docker logs: `docker logs -f short-video-maker`

### Tip 3: Save API Key
Create `.env` file:
```env
PEXELS_API_KEY=your_key_here
LOG_LEVEL=info
```

Then just run: `./start.sh`

It will auto-load your key!

### Tip 4: Try Using Postman
Use the Postman collection from mobile browser:
```
https://[url]/api/voices
https://[url]/api/music-tags
https://[url]/api/trending-topics
```

---

## 🎯 Common Tasks

### Generate Video from Mobile
1. Navigate to: `https://[url]/create`
2. Fill in scenes and config
3. Click "Create Video"
4. Wait ~60 seconds
5. Download or view in Video List

### Bulk Generate from Mobile
1. Navigate to: `https://[url]/bulk`
2. Click "Generate Videos from Trending Topics"
3. Select settings
4. Wait for videos to process
5. Download as they complete

### Check Video Status
Via API:
```
https://[url]/api/short-videos
```

---

## 📊 Performance Tips for Mobile

### Slower Connection?
1. Use "Bulk Generate" instead of creating manually
2. Use the WebUI (less bandwidth than API)
3. Check video status less frequently
4. Download videos one at a time

### Limited Data?
```bash
# Use lightweight image (smaller processing)
docker run -it --rm --name short-video-maker \
  -p 3123:3123 \
  -e PEXELS_API_KEY=your_key \
  short-video-maker:latest-tiny
```

---

## 🔒 Security Notes

### Important: Public Access
When you make the port **Public** in Codespaces:
- ✅ You can access from mobile
- ⚠️ Anyone with the URL can also access it
- ✅ It auto-expires when Codespace closes

### Best Practice:
1. Only make public when needed
2. Delete `.env` file with API key before sharing
3. Use `Ctrl + C` to stop when done

---

## 🚀 Next Time (Super Fast)

After first setup:

```bash
# If Docker image already built, just run:
./quick-start.sh

# Opens immediately on mobile!
```

---

## Complete Command Reference

| Task | Command |
|------|---------|
| Full Setup | `./start.sh` |
| Just Run | `./quick-start.sh` |
| Check Status | `docker ps` |
| View Logs | `docker logs -f short-video-maker` |
| Stop | `docker stop short-video-maker` |
| Rebuild Image | `docker build -f main-tiny.Dockerfile -t short-video-maker:latest .` |
| Using Postman | Import collection + use `https://[url]` |

---

## Need Help?

1. Check Docker logs: `docker logs short-video-maker`
2. Test health endpoint: `curl https://[url]/health`
3. View environment: `echo $CODESPACE_NAME`
4. Check ports: `docker ps`

**You're all set! Start `./start.sh` and enjoy! 🎬**
