#!/bin/bash

# Quick Start - Minimal version (just runs, no build)
# Usage: ./quick-start.sh [PEXELS_API_KEY]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get API key from argument, environment, or .env
PEXELS_API_KEY="${1:-${PEXELS_API_KEY:-}}"

if [ -z "$PEXELS_API_KEY" ] && [ -f .env ]; then
    export $(cat .env | grep PEXELS_API_KEY | xargs 2>/dev/null || true)
    PEXELS_API_KEY="${PEXELS_API_KEY:-}"
fi

if [ -z "$PEXELS_API_KEY" ]; then
    echo -e "${RED}❌ Error: PEXELS_API_KEY not found!${NC}"
    echo ""
    echo "Provide it in one of these ways:"
    echo "  1. Pass as argument:  ./quick-start.sh your-api-key"
    echo "  2. Set env var:       export PEXELS_API_KEY=your-api-key && ./quick-start.sh"
    echo "  3. Add to .env file:  echo 'PEXELS_API_KEY=your-key' > .env"
    echo ""
    echo "Get a free API key: https://www.pexels.com/api"
    exit 1
fi

echo -e "${GREEN}🚀 Starting Short Video Maker...${NC}"
echo "   API Key: ${PEXELS_API_KEY:0:10}..."
echo ""

# Check if Docker image exists
if ! docker image inspect short-video-maker:latest &>/dev/null; then
    echo -e "${YELLOW}⚠️  Docker image not found!${NC}"
    echo "   Run './start.sh' first to build the image"
    exit 1
fi

docker run -it --rm --name short-video-maker \
  -p 3123:3123 \
  -e PEXELS_API_KEY="$PEXELS_API_KEY" \
  -e LOG_LEVEL=info \
  short-video-maker:latest
