# Educational Instagram Reels Template

## Best Configuration for Educational Content

```json
{
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

### Alternative Voice Options (by personality)
- **af_nova** - Clear, professional, engaging (best for tutorials)
- **af_sarah** - Warm, approachable, trusted
- **am_michael** - Strong, authoritative
- **af_heart** - Friendly, conversational

### Alternative Music Moods
- **hopeful** - Default for learning/growth content
- **chill** - For casual tutorials
- **contemplative** - For in-depth explanations
- **excited** - For quick tips and hacks

---

## Proven Structure for Educational Reels

### Pattern 1: Problem → Solution → Call-to-Action (30-45 seconds)

```json
{
  "scenes": [
    {
      "text": "Most people waste 2 hours a day on this. Here's how to save it.",
      "searchTerms": ["time management", "productivity", "clock"]
    },
    {
      "text": "Use [method name]: Step 1 - [action], Step 2 - [action], Step 3 - [action].",
      "searchTerms": ["learning", "tutorial", "step-by-step"]
    },
    {
      "text": "Try this for a week. Drop a comment if it worked for you!",
      "searchTerms": ["success", "achievement", "progress"]
    }
  ]
}
```

### Pattern 2: Hook → Explainer → Deep Dive (45-60 seconds)

```json
{
  "scenes": [
    {
      "text": "The [science/method] behind [concept] is wild.",
      "searchTerms": ["science", "concept visualization", "education"]
    },
    {
      "text": "It works because [reason]. That's why [consequence].",
      "searchTerms": ["learning", "explanation", "insight"]
    },
    {
      "text": "Knowing this changed everything for me. What's your experience?",
      "searchTerms": ["realization", "breakthrough", "forward"]
    }
  ]
}
```

### Pattern 3: Common Misconception → Truth → Proof (35-50 seconds)

```json
{
  "scenes": [
    {
      "text": "Everyone believes [myth]. But the truth is [fact].",
      "searchTerms": ["myth", "truth", "revelation"]
    },
    {
      "text": "Here's the evidence: [proof/example]. It's scientifically proven.",
      "searchTerms": ["science", "evidence", "proof"]
    },
    {
      "text": "Stop believing the lie. The truth is way better.",
      "searchTerms": ["awareness", "lightbulb", "understanding"]
    }
  ]
}
```

---

## Real Examples for Different Topics

### Topic: Time Management
```json
{
  "scenes": [
    {
      "text": "You're not lazy. You just don't understand time blocking.",
      "searchTerms": ["productivity", "time management", "organization"]
    },
    {
      "text": "Divide your day into 90-minute focused blocks. Work hard, rest harder.",
      "searchTerms": ["calendar", "scheduling", "planning"]
    },
    {
      "text": "I went from 4 to 8 productive hours daily. You can too.",
      "searchTerms": ["success", "achievement", "victory"]
    }
  ]
}
```

### Topic: Learning Technique
```json
{
  "scenes": [
    {
      "text": "The method that helped me learn 3x faster than traditional studying",
      "searchTerms": ["learning", "memory", "brain"]
    },
    {
      "text": "It's called spaced repetition. Review after 1 day, 3 days, 1 week, 1 month.",
      "searchTerms": ["study", "notes", "learning system"]
    },
    {
      "text": "Your grades will thank you. Try it this semester.",
      "searchTerms": ["success", "education", "academic"]
    }
  ]
}
```

### Topic: Habit Formation
```json
{
  "scenes": [
    {
      "text": "Why you fail at building habits: You're ignoring the cue.",
      "searchTerms": ["habit", "motivation", "willpower"]
    },
    {
      "text": "Formula: Obvious trigger → Easy action → Immediate reward. Repeat daily.",
      "searchTerms": ["routine", "system", "formula"]
    },
    {
      "text": "This 21-day challenge changed my life. Will you join?",
      "searchTerms": ["challenge", "motivation", "transformation"]
    }
  ]
}
```

---

## Tips for Best Results

1. **Hook**: First 2-3 seconds must be compelling
   - Use phrases like "What if...", "You're probably...", "The truth is..."
   - Numbers work: "3x faster", "90% of people", "5-second method"

2. **Search Terms**: Be SPECIFIC
   - ❌ "nature", "background", "general"
   - ✅ "productivity clock", "learning desk", "study notes"

3. **Length**: Keep it tight
   - Ideal: 25-45 seconds
   - Maximum: 60 seconds
   - Minimum: 15 seconds (too fast)

4. **Pacing**: Mix scene lengths
   - Hook: 3-5 seconds
   - Main content: 15-25 seconds
   - CTA: 5-10 seconds

5. **Voice Selection**: Rotate for variety
   - Alternate between af_* (female) and am_* (male)
   - Keep consistency within a series

---

## Weekly Content Ideas

- **Monday**: Method/System (Problem-Solution)
- **Tuesday**: Misconception Buster (Myth-Truth)
- **Wednesday**: Scientific/Research-backed tip
- **Thursday**: Step-by-step tutorial
- **Friday**: Success story / transformation
- **Saturday**: Quick hack / productivity tip
- **Sunday**: Weekly recap / trend

---

## Batch Creation Template (for API calls)

Use this JSON template to create 5 videos at once:

```json
{
  "videos": [
    {
      "scenes": [
        {"text": "...", "searchTerms": ["...", "...", "..."]},
        {"text": "...", "searchTerms": ["...", "...", "..."]},
        {"text": "...", "searchTerms": ["...", "...", "..."]}
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
  ]
}
```
