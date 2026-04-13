# Google Play Reviews Fetcher

Fetch reviews from Google Play in multiple languages and deduplicate them.

## Setup

```bash
npm install
```

## Usage

```bash
# Fetch reviews for default app
node index.js

# Fetch reviews for specific app
node index.js com.thomaspeissl.quick_dungeon_crawler_od.twa

# Specify output file
node index.js com.yourapp.id output.json
```

## Output

Generates `reviews.json` with:
- `stats` - total reviews, breakdown by score, language, month
- `reviews` - array of all unique reviews with metadata

## Languages

Fetches from: English, Deutsch, Français, Español, Italiano, 日本語, 한국어, 中文, Português, Русский

## Note

Uses the unofficial `google-play-scraper` package. May break if Google changes their API.