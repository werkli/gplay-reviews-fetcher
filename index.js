#!/usr/bin/env node
/**
 * Google Play Reviews Fetcher
 * Fetches reviews from multiple languages and merges them
 * 
 * Usage: node index.js [appId] [outputFile]
 * Default appId: com.thomaspeissl.quick_dungeon_crawler_od.twa
 */

const gplay = require('google-play-scraper').default;
const fs = require('fs');
const path = require('path');

// Supported languages
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
];

// Reviews per language
const REVIEWS_PER_LANG = 20;

async function fetchReviewsForLang(appId, lang, country = 'us') {
  try {
    const reviews = await gplay.reviews({
      appId,
      lang,
      country,
      numRows: REVIEWS_PER_LANG
    });
    
    return reviews.data.map(r => ({
      id: r.id,
      userName: r.userName,
      date: r.date,
      score: r.score,
      title: r.title,
      text: r.text,
      replyText: r.replyText,
      replyDate: r.replyDate,
      version: r.version,
      thumbsUp: r.thumbsUp || 0,
      lang,
      url: r.url
    }));
  } catch (error) {
    console.error(`  ❌ Error fetching ${lang}: ${error.message}`);
    return [];
  }
}

async function deduplicateReviews(allReviews) {
  const seen = new Set();
  return allReviews.filter(review => {
    const key = `${review.userName}-${review.date}-${review.text?.slice(0, 50)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const appId = process.argv[2] || 'com.thomaspeissl.quick_dungeon_crawler_od.twa';
  const outputFile = process.argv[3] || 'reviews.json';
  
  console.log(`\n📱 Google Play Reviews Fetcher`);
  console.log(`   App: ${appId}`);
  console.log(`   Languages: ${LANGUAGES.length}`);
  console.log(`   Reviews per lang: ${REVIEWS_PER_LANG}\n`);
  
  const allReviews = [];
  
  for (const { code, name } of LANGUAGES) {
    process.stdout.write(`🌍 ${name} (${code})...`);
    const reviews = await fetchReviewsForLang(appId, code);
    console.log(` ✅ ${reviews.length} reviews`);
    allReviews.push(...reviews);
    await new Promise(r => setTimeout(r, 500)); // Rate limit delay
  }
  
  // Deduplicate
  const uniqueReviews = await deduplicateReviews(allReviews);
  
  // Sort by date (newest first)
  uniqueReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Stats
  const stats = {
    total: uniqueReviews.length,
    byLanguage: {},
    byScore: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    byMonth: {}
  };
  
  for (const review of uniqueReviews) {
    stats.byLanguage[review.lang] = (stats.byLanguage[review.lang] || 0) + 1;
    stats.byScore[review.score] = (stats.byScore[review.score] || 0) + 1;
    
    const month = review.date?.slice(0, 7);
    if (month) stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
  }
  
  const output = {
    appId,
    fetchedAt: new Date().toISOString(),
    stats,
    reviews: uniqueReviews
  };
  
  // Write output
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved ${uniqueReviews.length} reviews to ${outputFile}`);
  console.log(`\n📊 Stats:`);
  console.log(`   Total: ${stats.total}`);
  console.log(`   5⭐: ${stats.byScore[5]} | 4⭐: ${stats.byScore[4]} | 3⭐: ${stats.byScore[3]} | 2⭐: ${stats.byScore[2]} | 1⭐: ${stats.byScore[1]}`);
  
  return output;
}

main().catch(console.error);