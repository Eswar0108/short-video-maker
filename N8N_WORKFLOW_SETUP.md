# Automated Instagram Reels Generation with n8n

## Quick Start

### Prerequisites
- n8n instance running (locally, Docker, or cloud)
- Short Video Maker server running on port 3123
- Your content ideas stored in a Google Sheet or JSON file

---

## Architecture Overview

```
Content Ideas (Google Sheets/CSV)
        ↓
n8n Workflow Triggers
        ↓
Generate Script with Claude/OpenAI
        ↓
Call Short Video Maker API
        ↓
Wait for Processing
        ↓
Download & Upload to S3/Cloud Storage
```

---

## Workflow 1: Manual Trigger (Simplest)

### Setup Steps:

1. **Create Manual Trigger Node**
   - Input fields:
     - `topic` (text)
     - `style` (dropdown: "Problem-Solution", "Myth-Truth", "Tutorial")

2. **Add LLM Node (Claude/OpenAI)**
   - Prompt:
     ```
     Create an Instagram Reel script about: {{$node["Manual Trigger"].json.topic}}
     Style: {{$node["Manual Trigger"].json.style}}
     
     Educational niche. Generate a 3-scene video script for Short Video Maker API.
     
     Return JSON:
     {
       "scenes": [
         {"text": "...", "searchTerms": ["...", "...", "..."]},
         {"text": "...", "searchTerms": ["...", "...", "..."]},
         {"text": "...", "searchTerms": ["...", "...", "..."]}
       ]
     }
     ```

3. **Add HTTP Request Node**
   - Method: POST
   - URL: `http://localhost:3123/api/short-video`
   - Headers: `Content-Type: application/json`
   - Body:
     ```json
     {
       "scenes": {{$node["LLM"].json.scenes}},
       "config": {
         "orientation": "portrait",
         "music": "hopeful",
         "musicVolume": "high",
         "captionPosition": "bottom",
         "voice": "af_nova",
         "paddingBack": 2000
       }
     }
     ```

4. **Add Wait Node**
   - Wait 30 seconds (or poll status endpoint)

5. **Add Download Node**
   - URL: `http://localhost:3123/api/short-video/{{$node["HTTP Request"].json.videoId}}`
   - Save to local folder or S3

---

## Workflow 2: Google Sheets Batch (Recommended)

### Content Sheet Format

| Topic | Style | Mood | Voice | Status |
|-------|-------|------|-------|--------|
| Time Blocking | Problem-Solution | hopeful | af_nova | pending |
| Spaced Repetition | Myth-Truth | hopeful | af_sarah | pending |

### Workflow Steps:

1. **Google Sheets Trigger**
   - Watch for new/updated rows
   - Only process where Status = "pending"

2. **LLM Node** (same as above, use sheet columns)

3. **Short Video Maker HTTP Node**

4. **Update Google Sheets**
   ```json
   {
     "row": {{$node["Google Sheets"].json.rowNumber}},
     "Status": "processing",
     "VideoID": "{{$node["HTTP"].json.videoId}}"
   }
   ```

5. **Wait & Poll Node** (waits for video to be ready)
   ```javascript
   // Custom code node
   const maxWait = 300; // 5 minutes
   const startTime = Date.now();
   let status = "processing";

   while (status === "processing" && Date.now() - startTime < maxWait * 1000) {
     const response = await fetch(
       `http://localhost:3123/api/short-video/${videoId}/status`
     );
     status = (await response.json()).status;
     if (status === "ready") break;
     await new Promise(r => setTimeout(r, 5000)); // Wait 5 seconds
   }
   return { status, videoId };
   ```

6. **Update to "ready"**

---

## Workflow 3: Daily Auto-Generate (Advanced)

### Cron Schedule
- Runs every day at 9:00 AM
- Generates 5 videos automatically

### Steps:

1. **Cron Trigger**
   - Frequency: Daily at 09:00

2. **Parameter Node**
   ```json
   {
     "daily_topics": [
       {"topic": "Pomodoro Technique", "style": "Tutorial"},
       {"topic": "Active Recall", "style": "Problem-Solution"},
       {"topic": "Feynman Method", "style": "Tutorial"},
       {"topic": "Procrastination", "style": "Myth-Truth"},
       {"topic": "Deep Work", "style": "Problem-Solution"}
     ]
   }
   ```

3. **Loop Over Topics** (Loop node)

4. **Generate Script** (LLM)

5. **Create Video** (HTTP Request)

6. **Log to Spreadsheet** (for tracking)

7. **Send Slack Notification**
   ```
   ✅ Generated 5 videos today
   - {{topics}} completed
   - Total processing time: {{$node["time"].json.duration}}
   ```

---

## Workflow 4: Batch from CSV

### Import CSV File

```csv
topic,style,music,voice
Time Management,Problem-Solution,hopeful,af_nova
Habit Building,Tutorial,chill,af_sarah
Memory Techniques,Myth-Truth,hopeful,am_michael
```

### n8n Steps:

1. **File Trigger** or Manual CSV upload
2. **Split CSV into rows**
3. **Loop through each row**
4. **Call LLM to enhance script**
5. **Create video via HTTP**
6. **Download and organize by folder**

---

## API Endpoints Used

```
POST /api/short-video                    → Create video
GET  /api/short-video/{id}/status        → Check status
GET  /api/short-video/{id}               → Download video
GET  /api/short-videos                   → List all videos
DELETE /api/short-video/{id}             → Delete video
GET  /api/voices                         → Available voices
GET  /api/music-tags                     → Available moods
```

---

## Storage Options

### Option 1: Local Folder
```bash
/videos/instagram/[topic]/[date]-[videoId].mp4
```

### Option 2: AWS S3
```
n8n AWS S3 Node:
- Bucket: `my-instagram-reels`
- Key: `educational/{{$node["date"].json.date}}/{{$node["HTTP"].json.videoId}}.mp4`
```

### Option 3: Google Drive
```
Folder structure:
Google Drive/Instagram Reels/[Month]/[Day]/video.mp4
```

---

## Monitoring & Alerts

### Failed Videos Email
```
If status = "failed":
- Send email with topic
- Log error details
- Retry after 30 minutes
```

### Slack Updates
```
New video ready! 🎬
Topic: {{topic}}
Music: {{music}}
Download: [link]
Status: Ready to upload
```

---

## n8n Node Configuration Summary

| Node | Config |
|------|--------|
| Trigger | Cron/Manual/Webhook |
| LLM | Claude/OpenAI (set temp=0.7) |
| HTTP | POST to localhost:3123/api/short-video |
| Wait | 30-60 seconds or poll loop |
| Download | GET video by ID |
| Storage | S3/Drive/Local folder |
| Notify | Slack/Email/n8n internal |

---

## Testing

1. **Create 1 test video manually**
   - Verify it works end-to-end
   - Check output quality

2. **Create 3-5 videos via n8n**
   - Test workflow automation
   - Monitor processing times

3. **Scale to daily generation**
   - 5-10 videos per day
   - Adjust concurrency in Short Video Maker if needed

---

## Performance Tips

1. **Set CONCURRENCY=2** in Short Video Maker
   - Allows 2 parallel renders
   - Prevents OOM issues

2. **Add delays between requests**
   - 5-10 seconds between video submissions
   - Prevents queue overload

3. **Monitor resource usage**
   - Video processing uses 2-4GB RAM each
   - CPU usage spikes during rendering

---

## Next Steps

1. Install n8n (Docker or Cloud)
2. Create first simple workflow (Manual Trigger)
3. Test with 3 topics
4. Upgrade to Google Sheets automation
5. Schedule daily batch generation
6. Integrate with social posting tools (Buffer/Meta Business Suite)

