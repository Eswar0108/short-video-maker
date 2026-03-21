#!/bin/bash

# Short Video Maker - One-Command Startup for Codespaces
# Usage: ./start.sh
# Or copy-paste the command shown at the end

set -e

echo "🚀 Short Video Maker - Starting..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get API key from .env or prompt user
if [ -f .env ]; then
    export $(cat .env | grep PEXELS_API_KEY | xargs)
fi

if [ -z "$PEXELS_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  PEXELS_API_KEY not found!${NC}"
    echo "Please enter your Pexels API key (get one free from https://www.pexels.com/api):"
    read -p "API Key: " PEXELS_API_KEY
    
    # Save to .env for next time
    echo "PEXELS_API_KEY=$PEXELS_API_KEY" > .env
    echo -e "${GREEN}✅ Saved to .env${NC}"
fi

echo ""
echo -e "${BLUE}1️⃣  Building the project...${NC}"
pnpm install --silent 2>/dev/null || npm install --silent 2>/dev/null
pnpm run build 2>&1 | grep -v "^$" | tail -5

echo ""
echo -e "${BLUE}2️⃣  Building Docker image...${NC}"
docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet

echo ""
echo -e "${BLUE}3️⃣  Starting Docker container...${NC}"
docker run -it --rm --name short-video-maker \
  -p 3123:3123 \
  -e PEXELS_API_KEY="$PEXELS_API_KEY" \
  -e LOG_LEVEL=info \
  short-video-maker:latest

