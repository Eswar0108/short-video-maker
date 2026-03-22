# Bulk Video Generation Feature Guide

## Overview

The Bulk Video Generation feature allows users to generate multiple Instagram Reels videos automatically from trending topics with a single click. Each video is generated with professional narration, captions, and background video/music.

## Features

✅ **One-Click Generation** - Generate 5-20 videos with a single button click
✅ **Trending Topics** - Automatically fetches 10+ trending educational topics
✅ **Customization** - Choose voice, music mood, and content style
✅ **Progress Tracking** - Real-time progress tracking for each video
✅ **Individual Download** - Download videos one by one as they complete
✅ **Minimum Duration** - All videos are generated at 30+ seconds by default

## How to Use

### Step 1: Navigate to Bulk Generation
1. Click **"Bulk Generate"** button in the top navigation bar
2. Or go directly to: `http://localhost:3123/bulk`

### Step 2: Start Generation
1. Click **"Generate Videos from Trending Topics"** button
2. A settings dialog will appear

### Step 3: Configure Settings
Choose your preferences:

| Setting | Options | Default |
|---------|---------|---------|
| **Number of Videos** | 1-20 | 5 |
| **Voice** | af_nova, af_sarah, am_michael, af_heart | af_nova |
| **Music Mood** | hopeful, chill, excited, contemplative | hopeful |
| **Content Style** | Problem-Solution, Myth-Truth, Tutorial, Motivation | Problem-Solution |

### Step 4: Monitor Progress
Each video card shows:
- Topic name
- Status badge (Pending, Processing, Ready, Failed)
- Progress bar (0-100%)
- Overall progress in the summary panel

### Step 5: Download Videos
Once a video is **Ready**: 
1. Click **"Download Video"** button on the video card
2. Video downloads as `Topic_Name.mp4`

## API Endpoints

### GET `/api/trending-topics`
Fetch trending topics for bulk generation

**Query Parameters:**
- `count` (optional): Number of topics to return (default: 10)

**Example:**
```bash
curl http://localhost:3123/api/trending-topics?count=15
```

**Response:**
```json
[
  "Time Management",
  "Productivity Hacks",
  "Habit Building",
  ...
]
```

### POST `/api/bulk-generate`
Generate a single video from a topic

**Request Body:**
```json
{
  "topic": "Time Management",
  "style": "Problem-Solution",
  "voice": "af_nova",
  "music": "hopeful",
  "minDuration": 30000
}
```

**Parameters:**
- `topic` (required): Topic for video generation
- `style` (optional): Content style (default: "Problem-Solution")
- `voice` (optional): Voice for narration (default: "af_nova")
- `music` (optional): Music mood (default: "hopeful")
- `minDuration` (optional): Minimum duration in ms (default: 30000)

**Response:**
```json
{
  "id": "bulk-cl2k3j4l",
  "videoId": "cl2k3j4l",
  "topic": "Time Management",
  "style": "Problem-Solution"
}
```

## Trending Topics Available

1. Time Management
2. Productivity Hacks
3. Habit Building
4. Learning Techniques
5. Deep Work Methods
6. Focus Improvement
7. Procrastination Solutions
8. Goal Setting
9. Morning Routines
10. Study Techniques
11. Memory Improvement
12. Speed Learning
13. Motivation Strategies
14. Discipline Building
15. Decision Making

## Generated Script Structure

Each video automatically has 3 scenes:

### Example: "Time Management" Topic
**Scene 1 (Hook - 3-5 sec):**
```
"Most people waste 2 hours a day on this. Here's how to save it."
Search: ["productivity", "clock", "scheduling"]
```

**Scene 2 (Main - 15-25 sec):**
```
"The solution is time blocking. Step 1: divide your day into 90-minute blocks, Step 2: work hard, Step 3: rest harder."
Search: ["productivity", "clock", "scheduling"]
```

**Scene 3 (CTA - 5-10 sec):**
```
"Try this for a week. Drop a comment if it worked for you!"
Search: ["success", "achievement", "victory"]
```

## Voice Options for Bulk Generation

| Voice | Gender | Personality | Best For |
|-------|--------|-------------|----------|
| af_nova | Female | Professional, engaging | Tutorials, educational |
| af_sarah | Female | Warm, approachable | Motivational, friendly |
| am_michael | Male | Strong, authoritative | Serious topics, facts |
| af_heart | Female | Friendly, conversational | Casual, relatable |

## Music Moods for Different Content

| Mood | Use Case | Feeling |
|------|----------|---------|
| hopeful | Learning, growth | Inspiring, positive |
| chill | Casual tutorials | Relaxed, easy-going |
| excited | Tips, hacks | Energetic, engaging |
| contemplative | In-depth explanations | Thoughtful, serious |

## Content Styles Explained

### Problem-Solution (Default)
**Best for:** Hacks, tips, life improvements
**Structure:** Problem → Solution → Call-to-Action

**Example:** "Most people waste time. Here's how to be productive..."

### Myth-Truth
**Best for:** Busting misconceptions, educational
**Structure:** Common Belief → The Truth → Evidence

**Example:** "Everyone thinks successful people work 12 hours. The truth is..."

### Tutorial
**Best for:** Step-by-step guides, how-tos
**Structure:** Hook → Steps → Challenge

**Example:** "Learn deep work in 5 minutes. Follow these 3 steps..."

### Motivation
**Best for:** Inspirational, success stories
**Structure:** Statement → Personal Example → Call-to-Action

**Example:** "Success is just 1% inspiration. Here's my story..."

## Performance & Settings

### Video Processing
- Each video takes 30-60 seconds to process
- System blocks videos until the previous one completes
- Monitor progress in real-time

### Resource Requirements
- **Minimum RAM:** 2GB per concurrent video
- **CPU:** 2+ cores recommended
- **Disk:** ~200MB per video

### Rate Limiting
- Automatic 2-second delay between API requests
- Prevents system overload
- Ensures smooth processing

## Troubleshooting

### Video Generation Fails
**Issue:** "Failed to start generation"

**Solutions:**
1. Check if Short Video Maker server is running
2. Verify PEXELS_API_KEY is set
3. Check available disk space (needs ~5GB)
4. Try with fewer concurrent videos

### No Progress After 60 Seconds
**Issue:** Video stuck on "Processing"

**Solutions:**
1. Check server logs for errors
2. Increase resource allocation
3. Reduce number of concurrent videos
4. Delete and retry

### Downloaded Videos Won't Play
**Issue:** Video file is corrupted or blank

**Solutions:**
1. Wait longer before downloading (minimum 60 seconds)
2. Check video status is "Ready" (green checkmark)
3. Try downloading again
4. Check disk space

### Memory Errors
**Issue:** "Out of Memory" during generation

**Solutions:**
1. Reduce number of videos (try 1-3 instead of 20)
2. Use the "tiny" Docker image
3. Increase system RAM/swap
4. Generate videos sequentially instead

## Advanced Usage

### Command Line Generation
```bash
# Generate single bulk video from CLI
curl -X POST http://localhost:3123/api/bulk-generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Time Management",
    "style": "Problem-Solution",
    "voice": "af_nova",
    "music": "hopeful"
  }'
```

### Batch Generation Script
```bash
#!/bin/bash
# Generate 10 videos automatically

topics=("Time Management" "Habit Building" "Productivity" \
        "Focus" "Memory" "Learning" "Motivation" "Goal Setting" \
        "Discipline" "Decision Making")

for topic in "${topics[@]}"; do
  curl -X POST http://localhost:3123/api/bulk-generate \
    -H "Content-Type: application/json" \
    -d "{\"topic\": \"$topic\", \"style\": \"Problem-Solution\"}"
  
  sleep 5  # Wait between requests
done
```

### Monitoring with jq
```bash
# Check all video statuses in JSON format
curl http://localhost:3123/api/short-videos | jq '.videos[] | {id, status}'
```

## Best Practices

1. **Start Small:** Generate 3-5 videos first to test
2. **Monitor Resources:** Watch RAM usage during generation
3. **Quality Check:** Review first generated video before bulk generating
4. **Schedule:** Generate during off-peak hours if on shared resources
5. **Backup:** Keep original generated videos before editing
6. **Test Different Voices:** Use different voices for variety
7. **Vary Content:** Mix different styles and topics
8. **Check Search Terms:** Ensure search terms are relevant

## FAQ

**Q: How long does it take to generate 10 videos?**
A: Approximately 5-10 minutes depending on system resources and video duration target.

**Q: Can I cancel bulk generation?**
A: Refresh the page to reset. Already started videos will continue processing.

**Q: What's the maximum number of videos I can generate at once?**
A: Recommended maximum is 20. Beyond that may cause memory issues.

**Q: Are the videos ready to upload to Instagram?**
A: Yes! Videos are optimized for Instagram Reels (portrait, 9:16 aspect ratio).

**Q: Can I use my own topics instead of trending ones?**
A: Currently, bulk generation uses trending topics. Use "Create Video" for custom topics.

**Q: How do I update trending topics?**
A: Click "Refresh Topics" button to fetch the latest or wait for automatic refresh.

## Future Enhancements

Planned features:
- [ ] Custom topic input for bulk generation
- [ ] Scheduling: Generate videos at specific times
- [ ] Auto-upload to Instagram
- [ ] Video editing: Trim, combine, add watermarks
- [ ] Analytics: Track video performance
- [ ] Templates: Save and reuse configurations
- [ ] Batch import from CSV/Google Sheets

