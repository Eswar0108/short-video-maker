#!/bin/bash

# Ultimate One-Liner for Mobile Access
# Copy-paste this entire command into your Codespaces terminal:

# SHORT VERSION (Fastest):
docker stop short-video-maker 2>/dev/null; docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet && docker run -it --rm --name short-video-maker -p 3123:3123 -e PEXELS_API_KEY="${PEXELS_API_KEY:-$(grep PEXELS_API_KEY .env 2>/dev/null || echo '')}" short-video-maker:latest

# OR use the scripts:
# ./start.sh              # Full setup (1st time)
# ./quick-start.sh        # Just run (after)

# Then in VS Code:
# 1. Click Ports tab
# 2. Right-click port 3123
# 3. Select "Make Public"
# 4. Copy the URL
# 5. Open on mobile device!
