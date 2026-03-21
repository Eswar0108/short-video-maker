#!/bin/bash

# Quick Start - Minimal version (just runs, no build)
# Usage: ./quick-start.sh <PEXELS_API_KEY>

PEXELS_API_KEY="${1:-oU8k2kwdtLrSQZsBSK8x6zTeJveefC9OzMt54s5MsKjLNvniBskYKTRC}"

echo "🚀 Starting Short Video Maker..."

docker run -it --rm --name short-video-maker \
  -p 3123:3123 \
  -e PEXELS_API_KEY="$PEXELS_API_KEY" \
  -e LOG_LEVEL=info \
  short-video-maker:latest
