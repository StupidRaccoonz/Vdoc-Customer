export function calculateReadingTime(text) {
  const wordsPerMinute = 200; // Adjust this value if needed
  const wordCount = text.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return readingTimeMinutes;
}
