# Postman Collection Setup Guide - GitHub Codespaces

## What's Included

✅ **Short-Video-Maker.postman_collection.json** - Complete API collection with 13 endpoints
✅ **Short-Video-Maker-Env.postman_environment.json** - Environment variables for easy switching

## Quick Setup (3 Steps)

### Step 1: Download Postman
- Go to [postman.com](https://www.postman.com/downloads)
- Or use **Web Version**: [web.postman.co](https://web.postman.co) (no download needed!)

### Step 2: Import Collection
1. **Open Postman**
2. Click **Import** (top-left corner)
3. Select **File** tab
4. Choose `Short-Video-Maker.postman_collection.json`
5. Click **Import**

### Step 3: Import Environment
1. Click **Environments** (left sidebar)
2. Click **Import**
3. Choose `Short-Video-Maker-Env.postman_environment.json`
4. Select the environment in top-right dropdown

---

## Using with GitHub Codespaces

### Option A: Local Port Forwarding (Easier)

If your Docker container is running on `localhost:3123`, Postman works **directly**:

```
Base URL: http://localhost:3123
```

✅ This works automatically in Postman desktop or web version on the same machine.

### Option B: Remote Codespaces Port Forwarding (For External Access)

If accessing from **outside Codespaces**:

1. **Get the Codespaces forward URL:**
   - In VS Code Terminal: `hostname -I` or check the Ports tab
   - GitHub Codespaces shows: `https://[username]-short-video-maker-[random].github.dev:3123`

2. **Update Postman Environment:**
   - Click environment dropdown
   - Edit the `base_url` variable
   - Change to: `https://[username]-short-video-maker-[random].github.dev:3123`

3. Or use this command to get the URL:
   ```bash
   # In Codespaces terminal
   echo "https://$(echo $CODESPACE_NAME | sed 's/-//g').github.dev:3123"
   ```

---

## API Endpoints Overview

### 🏥 Health Check
```
GET /health
```
Verify server is running

### 🎬 Video Creation
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/short-video` | Create custom video |
| GET | `/api/short-video/:videoId/status` | Check video status |
| GET | `/api/short-video/:videoId` | Download video |
| GET | `/api/short-videos` | List all videos |
| DELETE | `/api/short-video/:videoId` | Delete video |

### ⚙️ Configuration
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/voices` | Get available voices |
| GET | `/api/music-tags` | Get available music moods |

### 🚀 Bulk Generation
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/trending-topics` | Get trending topics |
| POST | `/api/bulk-generate` | Auto-generate video from topic |

---

## Common Workflows

### Workflow 1: Create a Single Video

1. **Click** "Create Single Video" in collection
2. **Edit the body** with your content (or use default)
3. **Send** the request
4. **Copy the `videoId`** from response
5. **Paste into** `videoId` variable in environment
6. **Use** the "Get Video Status" request to poll

### Workflow 2: Check Video Status

1. **Make sure `videoId` variable is set**
2. **Click** "Get Video Status"
3. **Send** request
4. **Wait for status**: `ready` / `processing` / `failed`
5. **When ready**, download via "Download Video"

### Workflow 3: Bulk Generate Videos

1. **Click** "Get Trending Topics"
2. **Send** request to see available topics
3. **Click** "Generate Video from Topic (Bulk)"
4. **Change topic** in request body as needed
5. **Send** request
6. **Poll status** like Workflow 2

### Workflow 4: Get All Configuration Options

1. **Click** "Get Available Voices"
2. **Send** - see all voice options
3. **Click** "Get Music Tags/Moods"
4. **Send** - see all music moods
5. **Use in your requests** (copy values)

---

## Variables Reference

| Variable | Usage | Example |
|----------|-------|---------|
| `base_url` | API base URL | `http://localhost:3123` |
| `videoId` | Video ID from create response | `cm9ekme790000hysi5h4odlt1` |
| `topic` | Topic for bulk generation | `Time Management` |
| `voice` | Voice for narration | `af_nova` |
| `music` | Music mood | `hopeful` |
| `style` | Content style | `Problem-Solution` |

**To use variables in requests:**
```
{{variable_name}}
```

Example:
```
GET {{base_url}}/api/short-video/{{videoId}}/status
```

---

## Example Requests

### Create a Problem-Solution Video
```json
{
  "scenes": [
    {
      "text": "Most people waste 2 hours daily. Here's how to save it.",
      "searchTerms": ["productivity", "time", "clock"]
    },
    {
      "text": "Use the Pomodoro method: 25 min work, 5 min break.",
      "searchTerms": ["timer", "focus", "productivity"]
    },
    {
      "text": "Try it this week and comment your results!",
      "searchTerms": ["success", "achievement", "progress"]
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
}
```

### Bulk Generate from Topic
```json
{
  "topic": "Habit Building",
  "style": "Tutorial",
  "voice": "af_nova",
  "music": "hopeful",
  "minDuration": 30000
}
```

---

## Troubleshooting

### Connection Refused
**Problem:** `Failed to connect to localhost:3123`

**Solution:**
1. Make sure Docker container is running: `docker ps`
2. Verify port forwarding is active
3. Check `base_url` variable is correct
4. Try hitting Health Check endpoint first

### 404 Not Found
**Problem:** `404 - Endpoint not found`

**Solution:**
1. Check endpoint URL spelling
2. Make sure `videoId` variable is set (if using it)
3. Verify API version matches collection

### Timeout Errors
**Problem:** Request times out after 60 seconds

**Solution:**
1. Video processing takes 30-60 seconds
2. Use polling pattern: Create → Wait → Check Status → Download
3. Increase Postman timeout: Settings → Request → Timeout

### CORS Errors (Web Version)
**Problem:** `Access-Control-Allow-Origin` errors in web version

**Solution:**
1. Use Postman Desktop app instead
2. Or configure backend CORS headers
3. Add CORS middleware to Express server

### Environment Variables Not Working
**Problem:** `{{variable}}` not replaced in request

**Solution:**
1. Make sure environment is **selected** (top-right dropdown)
2. Check variable name is **exact match**
3. Verify variable is marked as **enabled**
4. Try using: `Pre-request Script` tab to debug

---

## Advanced: Pre-request Scripts

### Auto-save VideoId (Optional)

In "Create Single Video" request, go to **Pre-request Script** tab:

```javascript
// Auto-saves videoId from response
pm.sendRequest(pm.request, (err, res) => {
  if (!err) {
    const videoId = res.json().videoId;
    pm.environment.set("videoId", videoId);
    console.log("Video ID saved:", videoId);
  }
});
```

### Auto-poll Until Ready

In "Get Video Status" request, go to **Tests** tab:

```javascript
// Auto-retry if still processing
const status = pm.response.json().status;

if (status === "processing") {
  console.log("Still processing... retrying in 5 seconds");
  setTimeout(() => {
    pm.sendRequest(pm.request, (err, res) => {
      // Handle retry
    });
  }, 5000);
}
```

---

## Tips & Best Practices

1. **Test Health First** - Always verify server is running
2. **Use Collections** - Organize requests in folders
3. **Set Variables** - Avoid hardcoding values
4. **Copy VideoIds** - Save them for later status checks
5. **Monitor Logs** - Check Docker logs if requests fail
6. **Rate Limit** - Wait between bulk generate requests (2-5 sec)
7. **Save Responses** - Use "Save Response as Example" for docs
8. **Test Chains** - Set up collections to run in sequence

---

## Postman Features to Explore

- 📊 **Visualize** - View videos in response
- 📝 **Tests** - Validate responses automatically
- 🔄 **Runner** - Execute collections in sequence
- 📤 **Share** - Collaborate with team members
- 📚 **Documentation** - Auto-generate API docs
- ⏱️ **Monitor** - Track endpoint health over time

---

## Getting Help

1. **Check Logs**: `docker logs short-video-maker`
2. **API Docs**: See [README.md](./README.md) REST API section
3. **Status Codes**:
   - `201` Created - Success
   - `400` Bad Request - Invalid input
   - `404` Not Found - Resource doesn't exist
   - `500` Server Error - Contact support

---

## Next Steps

1. ✅ Import both JSON files into Postman
2. ✅ Select environment from dropdown
3. ✅ Test "Health Check" endpoint
4. ✅ Try "Create Single Video"
5. ✅ Poll with "Get Video Status"
6. ✅ Download completed video

**Happy API Testing!** 🚀
