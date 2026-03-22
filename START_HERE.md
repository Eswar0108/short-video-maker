# 🚀 Super Quick Start

**TL;DR** - Run this in your terminal:

```bash
./setup-wizard.sh
```

Or if you know what you're doing:

```bash
./start.sh              # First time (full setup)
./quick-start.sh        # Subsequent times (just run)
```

---

# One-Liner (Copy-Paste)

```bash
docker stop short-video-maker 2>/dev/null; docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet && docker run -it --rm --name short-video-maker -p 3123:3123 -e PEXELS_API_KEY="${PEXELS_API_KEY:-$(grep PEXELS_API_KEY .env 2>/dev/null || echo '')}" short-video-maker:latest
```

---

# 📱 Mobile Access (Codespaces)

1. **Get API Key** (free): https://www.pexels.com/api
2. **Add to .env**:
   ```bash
   echo "PEXELS_API_KEY=your-key-here" > .env
   ```
3. **Run setup**:
   ```bash
   ./start.sh
   ```
4. **In VS Code - Make Port Public**:
   - Click **Ports** tab (bottom)
   - Right-click **3123**
   - Select **Make Public**
5. **Copy & Open on Mobile**:
   - Copy the forwarded URL
   - Paste in mobile browser
   - Navigate to `/bulk` for bulk generation

---

# 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | **Start here! Complete navigation guide** |
| [QUICK_START_README.md](QUICK_START_README.md) | All startup methods and options |
| [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md) | Step-by-step mobile Codespaces access |
| [CODESPACES_SETUP.md](CODESPACES_SETUP.md) | Permanent shell aliases |
| [BULK_GENERATION_GUIDE.md](BULK_GENERATION_GUIDE.md) | Bulk video generation feature |

---

# 🎯 Choose Your Path

### **I want the wizard to guide me**
```bash
./setup-wizard.sh
```

### **I'm a developer and want full control**
```bash
./start.sh   # Install deps + build + Docker run
./quick-start.sh  # Quick restart
```

### **I want just the Docker command**
```bash
# Edit .env with your API key first
export PEXELS_API_KEY=$(grep PEXELS_API_KEY .env | cut -d= -f2)
docker build -f main-tiny.Dockerfile -t short-video-maker:latest .
docker run -it --rm -p 3123:3123 -e PEXELS_API_KEY="$PEXELS_API_KEY" short-video-maker:latest
```

### **I want a one-liner**
See "One-Liner (Copy-Paste)" at top ↑

---

# 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Script won't run** | `chmod +x start.sh quick-start.sh` |
| **API key missing** | `echo "PEXELS_API_KEY=key" > .env` |
| **Docker not found** | Install Docker: https://docker.com |
| **Port already in use** | `docker stop short-video-maker && ./quick-start.sh` |
| **Can't see /bulk on mobile** | Verify port 3123 is **Public** not Private |

For more help → [GETTING_STARTED.md](GETTING_STARTED.md#-troubleshooting)

---

# ✨ What You Get

After running setup:

- ✅ Video creator UI at `/`
- ✅ Bulk generation UI at `/bulk` (trending topics auto-generate videos)
- ✅ REST API at `/api/*`
- ✅ Real-time progress tracking
- ✅ Mobile-friendly responsive design
- ✅ Download generated videos

---

# 🌐 Web & Mobile Access

Once running:

- **Web** (Codespaces): `localhost:3123`
- **Mobile** (Codespaces): Forwarded URL from Ports tab
- **Public sharing**: Anyone with forwarded URL can use

---

# 🐳 Docker Images

| Variant | File | Size | When to Use |
|---------|------|------|-----------|
| **Tiny** ← **Recommended** | `main-tiny.Dockerfile` | 1.2GB | Default choice |
| Standard | `main.Dockerfile` | 1.8GB | If tiny has issues |
| GPU/CUDA | `main-cuda.Dockerfile` | 2.5GB | GPU acceleration |

---

# 📖 Next Steps

1. **Run setup**: `./start.sh`
2. **Make port public** in VS Code Ports tab
3. **Open on mobile** device
4. **Generate videos** from `/bulk` UI
5. **Read [GETTING_STARTED.md](GETTING_STARTED.md)** for full feature docs

---

# 🎓 Want More?

- **Content Strategy**: See [INSTAGRAM_REELS_QUICKSTART.md](INSTAGRAM_REELS_QUICKSTART.md)
- **Script Templates**: See [EDUCATIONAL_REELS_TEMPLATE.md](EDUCATIONAL_REELS_TEMPLATE.md)
- **Automation**: See [N8N_WORKFLOW_SETUP.md](N8N_WORKFLOW_SETUP.md)
- **API Testing**: See [POSTMAN_SETUP_GUIDE.md](POSTMAN_SETUP_GUIDE.md)

---

**Ready?** Run `./start.sh` Now! 🚀
