# 🎬 Instagram Reels Generator - Quick Start Guide

## What You Now Have

1. **[EDUCATIONAL_REELS_TEMPLATE.md](./EDUCATIONAL_REELS_TEMPLATE.md)** - Proven script templates for educational content
2. **[N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md)** - Complete n8n automation guide
3. **[n8n-workflow-export.json](./n8n-workflow-export.json)** - Ready-to-import n8n workflow
4. **[scripts/generateScript.js](./scripts/generateScript.js)** - CLI tool to generate scripts

---

## Option 1: Generate Videos Manually (No Setup)

### Step 1: Start the Short Video Maker server
```bash
docker run -it --rm --name short-video-maker -p 3123:3123 \
  -e PEXELS_API_KEY=your_key_here \
  gyoridavid/short-video-maker:latest-tiny
```

### Step 2: Use curl to create a video

Copy-paste this command with your content:

```bash
curl -X POST http://localhost:3123/api/short-video \
  -H "Content-Type: application/json" \
  -d '{
    "scenes": [
      {
        "text": "Most people waste 2 hours daily on this. Here is the solution.",
        "searchTerms": ["productivity", "time management", "clock"]
      },
      {
        "text": "Use the Pomodoro Technique: 25 min work, 5 min break.",
        "searchTerms": ["timer", "focus", "productivity"]
      },
      {
        "text": "Try it this week. Comment if it works for you!",
        "searchTerms": ["success", "achievement", "victory"]
      }
    ],
    "config": {
      "orientation": "portrait",
      "music": "hopeful",
      "musicVolume": "high",
      "captionPosition": "bottom",
      "voice": "af_nova",
      "paddingBack": 2000
    }
  }'
```

### Step 3: Download your video
Replace `VIDEO_ID` from the response above:

```bash
curl http://localhost:3123/api/short-video/VIDEO_ID -o video.mp4
```

---

## Option 2: Generate Using the CLI Script

### Step 1: Install dependencies
```bash
npm install
# or if using pnpm
pnpm install
```

### Step 2: Generate a script
```bash
# Basic usage
node scripts/generateScript.js --topic "Time Management"

# With custom options
node scripts/generateScript.js \
  --topic "Spaced Repetition" \
  --style "Tutorial" \
  --personality "warm" \
  --output my-script.json
```

### Available styles:
- `Problem-Solution` (Best for hacks/tips)
- `Myth-Truth` (Busting misconceptions)
- `Tutorial` (Step-by-step guides)
- `Motivation` (Inspiring stories)

### Available personalities:
- `professional` (af_nova) - Best for tutorials
- `warm` (af_sarah) - Friendly and approachable
- `authoritative` (am_michael) - Strong presence
- `friendly` (af_heart) - Conversational

### Step 3: Create video from generated script
```bash
# Generate script to JSON file
node scripts/generateScript.js --topic "Habit Stacking" > script.json

# Send to Short Video Maker API
curl -X POST http://localhost:3123/api/short-video \
  -H "Content-Type: application/json" \
  -d @script.json -o response.json

# Extract video ID
cat response.json | jq '.videoId'

# Download when ready (wait ~30-45 seconds)
sleep 45
curl http://localhost:3123/api/short-video/$(cat response.json | jq -r '.videoId') -o video.mp4
```

---

## Option 3: Automated with n8n (Recommended)

### Prerequisites:
- Docker installed
- Port 3000 available

### Step 1: Start n8n
```bash
docker run -it --rm --name n8n -p 3000:3123 \
  -e DB_TYPE=sqlite \
  n8nio/n8n
```

Open http://localhost:3000 in your browser

### Step 2: Import the workflow
1. Go to **Workflows** → **New**
2. Click **Import** (top right)
3. Upload [n8n-workflow-export.json](./n8n-workflow-export.json)
4. Click **Import**

### Step 3: Configure nodes
1. **Generate Script with LLM** node:
   - Add your OpenAI API key
   - Or use Claude API key (change model)

2. **Call Short Video Maker API** node:
   - Set URL to: `http://localhost:3123/api/short-video` (adjust if on different machine)

3. **Send Success Message** node (optional):
   - Add your Slack webhook URL for notifications

### Step 4: Create your first video
1. Click **Execute Workflow**
2. Input:
   ```json
   {
     "topic": "Deep Work",
     "style": "Problem-Solution",
     "voice": "af_nova",
     "music": "hopeful"
   }
   ```
3. Wait 60 seconds for processing
4. Video ready! ✅

---

## Option 4: Batch Generation (Advanced)

### Create a CSV file: `content_ideas.csv`
```csv
topic,style,personality,music
Time Blocking,Problem-Solution,professional,hopeful
Procrastination Myths,Myth-Truth,warm,hopeful
Deep Work Techniques,Tutorial,authoritative,chill
Habit Stacking,Tutorial,friendly,hopeful
```

### Process batch:
```bash
# Generate all scripts
for row in $(tail -n +2 content_ideas.csv); do
  IFS=',' read -r topic style personality music <<< "$row"
  node scripts/generateScript.js \
    --topic "$topic" \
    --style "$style" \
    --personality "$personality" \
    --output "scripts/$topic.json"
done

# Send all to API (with rate limiting)
for script in scripts/*.json; do
  curl -X POST http://localhost:3123/api/short-video \
    -H "Content-Type: application/json" \
    -d @$script
  sleep 5  # Rate limit: 5 seconds between requests
done
```

---

## Best Practices

### Content Planning
- **Day 1**: Generate 3-5 scripts
- **Day 2**: Review and tweak as needed
- **Day 3-4**: Batch render all videos
- **Day 5**: Schedule posting (use Buffer/Meta Business Suite)

### Quality Tips
1. **Review search terms** - They should match the topic not just be generic
2. **Test voices** - Try 2-3 different voices for each topic
3. **Mix up moods** - Don't use same music for all videos
4. **Vary lengths** - Mix 30s, 45s, and 60s videos

### Performance Optimization
```bash
# If getting OOM errors, use the tiny image:
docker run -it --rm --name short-video-maker -p 3123:3123 \
  -e PEXELS_API_KEY=your_key \
  -e CONCURRENCY=1 \
  gyoridavid/short-video-maker:latest-tiny

# And add delays between requests:
sleep 30  # Wait 30 seconds between video generation requests
```

---

## Troubleshooting

### "Video processing failed"
- Check if PEXELS_API_KEY is set correctly
- Verify search terms are relevant
- Try with different search terms

### "OOM errors" (Out of Memory)
- Use `latest-tiny` Docker image
- Reduce CONCURRENCY to 1
- Wait longer between requests (30+ seconds)

### "API connection refused"
- Ensure Short Video Maker is running on port 3123
- Check Docker network settings if using Docker Compose

### "LLM API errors" (in n8n)
- Verify OpenAI/Claude API key in n8n credentials
- Check API rate limits
- Ensure API key has sufficient credits

---

## Next Steps

1. **Test with 1 video** - Make sure everything works
2. **Create 5 videos** - Build your first batch
3. **Set up n8n** - Automate the process
4. **Schedule daily generation** - 5-10 videos per week
5. **Integrate with posting tools** - Auto-upload to Instagram

---

## Resources

- **Short Video Maker API Docs**: [REST API section in README](./README.md#rest-api)
- **Educational Templates**: [EDUCATIONAL_REELS_TEMPLATE.md](./EDUCATIONAL_REELS_TEMPLATE.md)
- **n8n Setup Guide**: [N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md)
- **n8n Documentation**: https://docs.n8n.io/
- **OpenAI API**: https://platform.openai.com/docs

---

## Example Commands Quick Reference

```bash
# Generate a script
node scripts/generateScript.js --topic "My Topic" --output script.json

# Start Short Video Maker
docker-compose up short-video-maker

# Create a video
curl -X POST http://localhost:3123/api/short-video \
  -H "Content-Type: application/json" \
  -d @script.json

# Check video status
curl http://localhost:3123/api/short-video/{videoId}/status

# Download video
curl http://localhost:3123/api/short-video/{videoId} -o output.mp4

# List all videos
curl http://localhost:3123/api/short-videos

# Delete a video
curl -X DELETE http://localhost:3123/api/short-video/{videoId}
```

---

## Questions?

Check the detailed guides:
- 📖 [EDUCATIONAL_REELS_TEMPLATE.md](./EDUCATIONAL_REELS_TEMPLATE.md)
- 🔧 [N8N_WORKFLOW_SETUP.md](./N8N_WORKFLOW_SETUP.md)
- 📋 [README.md - REST API section](./README.md#rest-api)

Good luck! 🚀
