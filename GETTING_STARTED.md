# 📚 Complete Setup Guide Index

Choose your preferred way to run the Short Video Maker based on your scenario.

---

## 🎯 Quick Decision Tree

### **"I'm in GitHub Codespaces and want to use my mobile device"**
↓
**👉 Read: [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md)**

Then run:
```bash
./start.sh
```

---

### **"I want the fastest setup possible"**
↓
**Option 1:** Copy-paste this one-liner:
```bash
docker stop short-video-maker 2>/dev/null; docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet && docker run -it --rm --name short-video-maker -p 3123:3123 -e PEXELS_API_KEY="${PEXELS_API_KEY:-$(grep PEXELS_API_KEY .env 2>/dev/null || echo '')}" short-video-maker:latest
```

**Option 2:** Run:
```bash
./start.sh  # First time
./quick-start.sh  # After
```

---

### **"I want to understand all startup options"**
↓
**👉 Read: [QUICK_START_README.md](QUICK_START_README.md)**

| Script | When to Use | Time |
|--------|-----------|------|
| `./start.sh` | First setup | 3-5m |
| `./quick-start.sh` | Restart after | 30s |
| One-liner | Quick mobile setup | 30s |

---

### **"I want permanent aliases in Codespaces"**
↓
**👉 Read: [CODESPACES_SETUP.md](CODESPACES_SETUP.md)**

Then run once:
```bash
echo 'alias svm-start="cd /workspaces/short-video-maker && ./start.sh"' >> ~/.bashrc
source ~/.bashrc
```

Then use forever:
```bash
svm-start  # Full setup
svm-run    # Quick run
```

---

## 📖 Detailed Guides

### Core Documentation
- **[README.md](README.md)** - Main project documentation
- **[QUICK_START_README.md](QUICK_START_README.md)** - All startup methods and options

### Mobile & Codespaces
- **[MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md)** - Step-by-step mobile Codespaces access
- **[CODESPACES_SETUP.md](CODESPACES_SETUP.md)** - Permanent shell setup

### Getting Started
- **[BULK_GENERATION_GUIDE.md](BULK_GENERATION_GUIDE.md)** - Bulk video generation UI feature
- **[INSTAGRAM_REELS_QUICKSTART.md](INSTAGRAM_REELS_QUICKSTART.md)** - Content creation overview

### Content & Automation
- **[EDUCATIONAL_REELS_TEMPLATE.md](EDUCATIONAL_REELS_TEMPLATE.md)** - Script templates and examples
- **[N8N_WORKFLOW_SETUP.md](N8N_WORKFLOW_SETUP.md)** - Automated workflow setup

### API Testing
- **[POSTMAN_SETUP_GUIDE.md](POSTMAN_SETUP_GUIDE.md)** - Postman collection + Codespaces testing

---

## 🚀 Start Here

### **First Time Ever**

```bash
# Step 1: Get API key from https://www.pexels.com/api

# Step 2: Run full setup
./start.sh
# → Follow the prompts
# → Wait 3-5 minutes
# → App will start automatically

# Step 3: Make port public in VS Code
# In Ports tab → right-click 3123 → "Make Public"

# Step 4: Open mobile browser
# Copy the forwarded URL and paste into mobile device browser
```

### **Next Times**

```bash
# Quick restart
./quick-start.sh

# Or if you modified code:
./start.sh  # Full rebuild
```

---

## 🔧 Common Commands

| Goal | Command |
|------|---------|
| Full setup | `./start.sh` |
| Quick restart | `./quick-start.sh` |
| Build only | `pnpm install && pnpm build` |
| Docker build only | `docker build -f main-tiny.Dockerfile -t short-video-maker:latest .` |
| Stop running container | `docker stop short-video-maker` |
| View logs | Docker logs in terminal |

---

## 📱 Mobile Workflow

1. **Start in Codespaces:**
   ```bash
   ./start.sh
   ```

2. **Make Port Public (VS Code Ports tab)**

3. **Open on Mobile Phone:**
   - Copy forwarded URL
   - Paste in mobile browser
   - Path: `https://[url]/bulk` for bulk generation

4. **Generate Videos from Mobile UI**
   - Select trending topic
   - Choose voice, style, music mood
   - Click generate
   - Watch progress in real-time
   - Download when complete

---

## 🐳 Docker Images

Three image types available via different Dockerfiles:

| Image | File | Size | Use Case |
|-------|------|------|----------|
| **Tiny (Recommended)** | `main-tiny.Dockerfile` | 1.2GB | Default, fast, sufficient |
| **Standard** | `main.Dockerfile` | 1.8GB | All tools included |
| **GPU (CUDA)** | `main-cuda.Dockerfile` | 2.5GB | GPU acceleration needed |

---

## 🆘 Troubleshooting

### **Script won't run**
```bash
chmod +x start.sh quick-start.sh
```

### **API key not found**
```bash
# Save to .env
echo "PEXELS_API_KEY=your-key" > .env

# Or export for this session
export PEXELS_API_KEY="your-key"
```

### **Port already in use**
```bash
docker stop short-video-maker
./quick-start.sh
```

### **Docker image missing**
```bash
./start.sh  # Rebuilds everything
```

### **Can't connect from mobile**
- Verify port 3123 is **Public** not **Private**
- Use HTTPS version of forwarded URL
- Check Codespaces firewall

For more help, see [MOBILE_ACCESS_GUIDE.md](MOBILE_ACCESS_GUIDE.md#troubleshooting) or [QUICK_START_README.md](QUICK_START_README.md#troubleshooting)

---

## 🎓 Learning Path

**Beginner:** Follow mobile workflow ↑
**Intermediate:** Read [BULK_GENERATION_GUIDE.md](BULK_GENERATION_GUIDE.md)
**Advanced:** Setup n8n workflows [N8N_WORKFLOW_SETUP.md](N8N_WORKFLOW_SETUP.md)
**Expert:** Contribute - see [CONTRIBUTING.md](CONTRIBUTING.md)

---

## ✅ Verification Checklist

After starting app, verify:

- [ ] App running on localhost:3123
- [ ] `/api/voices` returns JSON
- [ ] `/api/trending-topics` returns JSON
- [ ] Port 3123 public in VS Code
- [ ] Mobile browser can access URL
- [ ] `/bulk` page loads on mobile
- [ ] Can select topics and generate videos

---

## 💡 Pro Tips

- **Fast restart:** Use `./quick-start.sh` between code changes
- **Full rebuild:** Use `./start.sh` after pulling new code
- **Alias setup:** Run CODESPACES_SETUP.md for `svm-start` alias
- **Share access:** Make port public and send URL to collaborators
- **Debug mode:** Check Docker logs in terminal for detailed output

---

## 🔗 Quick Links

- **Pexels API Key:** https://www.pexels.com/api
- **GitHub Codespaces:** https://github.com/codespaces
- **Short Video Maker Repo:** Check your current repo
- **Issues/Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Ready to start?** → Run `./start.sh` now!
