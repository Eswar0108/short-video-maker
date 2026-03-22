#!/bin/bash

# Short Video Maker - One-Command Startup for Codespaces
# Usage: ./start.sh
# Does everything: install → build → docker build → docker run

set -e

echo "🚀 Short Video Maker - Starting..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get API key from .env, environment, or prompt
PEXELS_API_KEY="${PEXELS_API_KEY:-}"

if [ -z "$PEXELS_API_KEY" ] && [ -f .env ]; then
    export $(cat .env | grep PEXELS_API_KEY | xargs 2>/dev/null || true)
    PEXELS_API_KEY="${PEXELS_API_KEY:-}"
fi

if [ -z "$PEXELS_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  PEXELS_API_KEY not found!${NC}"
    echo "Get a free API key: https://www.pexels.com/api"
    echo ""
    read -p "Enter your Pexels API key: " PEXELS_API_KEY
    
    if [ -z "$PEXELS_API_KEY" ]; then
        echo -e "${RED}❌ API key required to continue${NC}"
        exit 1
    fi
    
    # Save to .env for next time
    echo "PEXELS_API_KEY=$PEXELS_API_KEY" > .env
    echo -e "${GREEN}✅ Saved to .env${NC}"
    echo ""
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found! Install Docker to continue.${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${BLUE}[1/4] Installing dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install --silent 2>/dev/null || {
        echo -e "${YELLOW}    pnpm install fallback to npm${NC}"
        npm install --silent 2>/dev/null
    }
else
    npm install --silent 2>/dev/null
fi
echo -e "${GREEN}     ✓ Dependencies installed${NC}"
echo ""

# Step 2: Build TypeScript & React
echo -e "${BLUE}[2/4] Building TypeScript & React...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm run build 2>&1 | tail -3
else
    npm run build 2>&1 | tail -3
fi
echo -e "${GREEN}     ✓ Build complete${NC}"
echo ""

# Step 3: Build Docker image
echo -e "${BLUE}[3/4] Building Docker image (tiny)...${NC}"
docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet 2>&1
echo -e "${GREEN}     ✓ Docker image built${NC}"
echo ""

# Step 4: Run container
echo -e "${BLUE}[4/4] Starting Docker container...${NC}"
echo -e "${GREEN}✓ Ready to use!${NC}"
echo ""
echo "📱 Mobile Access:"
echo "   1. In VS Code, click 'Ports' tab (bottom panel)"
echo "   2. Right-click port 3123 → 'Make Public'"
echo "   3. Copy the forwarded URL"
echo "   4. Open on mobile device"
echo ""
echo "🌐 Web Access:"
echo "   http://localhost:3123"
echo ""

docker run -it --rm --name short-video-maker \
  -p 3123:3123 \
  -e PEXELS_API_KEY="$PEXELS_API_KEY" \
  -e LOG_LEVEL=info \
  short-video-maker:latest

