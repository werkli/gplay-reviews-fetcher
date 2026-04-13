# Google Play Reviews Fetcher + Dashboard

Fetch reviews from Google Play in multiple languages, deduplicate them, and view in a simple dashboard.

## Setup

```bash
npm install
```

## Fetch Reviews

```bash
# Fetch reviews for default app
node index.js

# Fetch reviews for specific app
node index.js com.thomaspeissl.quick_dungeon_crawler_od.twa

# Specify output file
node index.js com.yourapp.id reviews.json
```

This will:
1. Fetch reviews from 10 languages (en, de, fr, es, it, ja, ko, zh, pt, ru)
2. Deduplicate them
3. Save to `reviews.json`
4. Show summary stats in the terminal

## Dashboard

Open `dashboard.html` in your browser to view reviews visually.

Features:
- 📊 Stats overview (total, unanswered, negative, avg score)
- 🔍 Filter by: All, Unanswered, 1-2 Stars, 4-5 Stars, High Impact
- 👍 Thumbs up count (high impact indicator)
- 🌐 Language flags
- 🔗 Direct link to each review on Play Store

**Note:** The dashboard reads `reviews.json` - run `node index.js` first to fetch fresh data.

## GitHub Pages Hosting

Push to a GitHub repo and enable GitHub Pages to host the dashboard online:

```bash
git add .
git commit -m "Add dashboard"
git push
```

Then enable Pages in repo Settings → Pages → Source: master branch.

## Output Format

`reviews.json` contains:

```json
{
  "appId": "com.example.app",
  "fetchedAt": "2026-04-13T12:00:00.000Z",
  "stats": {
    "total": 150,
    "byLanguage": { "en": 50, "de": 20, ... },
    "byScore": { "1": 5, "2": 10, "3": 25, "4": 60, "5": 50 },
    "byMonth": { "2026-04": 12, "2026-03": 35, ... }
  },
  "reviews": [
    {
      "id": "abc123",
      "userName": "John D.",
      "date": "2026-04-10T12:00:00.000Z",
      "score": 4,
      "text": "Great app but needs...",
      "replyText": "Thanks for feedback!",
      "replyDate": "2026-04-11T...",
      "version": "3.8.2",
      "thumbsUp": 3,
      "lang": "en",
      "url": "https://play.google.com/..."
    }
  ]
}
```

## Note

Uses the unofficial `google-play-scraper` package. May break if Google changes their API.