#!/bin/bash

# Interactive guide for Short Video Maker setup
# Usage: ./setup-wizard.sh

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

# Banner
echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════╗"
echo "║    Short Video Maker - Setup Wizard 🚀       ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Welcome
echo -e "${BLUE}Welcome!${NC} This wizard will help you get started."
echo ""
read -p "Press Enter to continue..."
clear

# Step 1: Environment check
echo -e "${BLUE}[Step 1/5] Checking your environment...${NC}"
echo ""

CHECKS_PASSED=0
CHECKS_TOTAL=3

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker found: $(docker --version | cut -d' ' -f3)"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}✗${NC} Docker not found (install Docker to continue)"
fi

# Check Node/npm
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node found: $(node --version)"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}✗${NC} Node.js not found"
fi

# Check package manager
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓${NC} pnpm found: $(pnpm --version)"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
elif command -v npm &> /dev/null; then
    echo -e "${YELLOW}○${NC} pnpm not found, will use npm"
    CHECKS_PASSED=$((CHECKS_PASSED + 1))
else
    echo -e "${RED}✗${NC} No package manager found"
fi

echo ""
if [ $CHECKS_PASSED -lt 3 ]; then
    echo -e "${RED}⚠️  Some requirements missing. Cannot continue.${NC}"
    exit 1
fi

echo -e "${GREEN}All checks passed!${NC}"
read -p "Press Enter to continue..."
clear

# Step 2: API Key setup
echo -e "${BLUE}[Step 2/5] Setting up Pexels API Key${NC}"
echo ""

PEXELS_API_KEY="${PEXELS_API_KEY:-}"

if [ -f .env ]; then
    export $(cat .env | grep PEXELS_API_KEY | xargs 2>/dev/null || true)
    PEXELS_API_KEY="${PEXELS_API_KEY:-}"
fi

if [ -n "$PEXELS_API_KEY" ]; then
    echo -e "${GREEN}✓ API Key found in environment${NC}"
    echo "  Key: ${PEXELS_API_KEY:0:10}..."
    echo ""
    read -p "Use this key? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        PEXELS_API_KEY=""
    fi
fi

if [ -z "$PEXELS_API_KEY" ]; then
    echo -e "${YELLOW}Get a free API key from:${NC}"
    echo "  https://www.pexels.com/api"
    echo ""
    read -p "Enter your Pexels API Key: " PEXELS_API_KEY
    
    if [ -z "$PEXELS_API_KEY" ]; then
        echo -e "${RED}API key required${NC}"
        exit 1
    fi
    
    echo "PEXELS_API_KEY=$PEXELS_API_KEY" > .env
    echo -e "${GREEN}✓ Saved to .env${NC}"
fi

echo ""
read -p "Press Enter to continue..."
clear

# Step 3: Choose deployment method
echo -e "${BLUE}[Step 3/5] Choose your setup method${NC}"
echo ""
echo "1) ${GREEN}Full Setup${NC} (install + build + Docker) - 3-5 minutes"
echo "   Best for: First time setup"
echo ""
echo "2) ${GREEN}Quick Run${NC} (Docker only, no build) - 30 seconds"
echo "   Best for: Restarting after code changes"
echo ""
echo "3) ${CYAN}Manual Command${NC} (Show one-liner for copy-paste)"
echo "   Best for: Custom setup"
echo ""
read -p "Choose (1-3): " CHOICE

case $CHOICE in
    1)
        METHOD="full"
        ;;
    2)
        METHOD="quick"
        ;;
    3)
        METHOD="manual"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

clear

# Step 4: Confirm setup
echo -e "${BLUE}[Step 4/5] Review your setup${NC}"
echo ""

if [ "$METHOD" = "full" ]; then
    echo -e "${GREEN}Setup Method:${NC} Full Setup"
    echo "  1. Install dependencies"
    echo "  2. Build TypeScript & React"
    echo "  3. Build Docker image"
    echo "  4. Start Docker container"
    echo ""
    echo -e "${YELLOW}Time estimate:${NC} 3-5 minutes"
elif [ "$METHOD" = "quick" ]; then
    echo -e "${GREEN}Setup Method:${NC} Quick Run"
    echo "  1. Start Docker container (pre-built)"
    echo ""
    echo -e "${YELLOW}Time estimate:${NC} 30 seconds"
elif [ "$METHOD" = "manual" ]; then
    echo -e "${GREEN}Setup Method:${NC} Manual One-Liner"
    echo "  Copy and paste a command"
fi

echo ""
echo -e "${YELLOW}Using API Key:${NC} ${PEXELS_API_KEY:0:10}..."
echo ""
read -p "Proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

clear

# Step 5: Execute
echo -e "${BLUE}[Step 5/5] Starting setup...${NC}"
echo ""

if [ "$METHOD" = "full" ]; then
    export PEXELS_API_KEY="$PEXELS_API_KEY"
    ./start.sh
    
elif [ "$METHOD" = "quick" ]; then
    ./quick-start.sh "$PEXELS_API_KEY"
    
elif [ "$METHOD" = "manual" ]; then
    echo -e "${CYAN}Copy and paste this command:${NC}"
    echo ""
    echo "docker stop short-video-maker 2>/dev/null; docker build -f main-tiny.Dockerfile -t short-video-maker:latest . --quiet && docker run -it --rm --name short-video-maker -p 3123:3123 -e PEXELS_API_KEY=\"$PEXELS_API_KEY\" short-video-maker:latest"
    echo ""
fi
