# wordFrequency Method

The `wordFrequency()` method analyzes a collection of strings and returns a Map containing each unique word and its frequency of occurrence. Words are automatically converted to lowercase for consistent counting.

## Basic Syntax

```typescript
wordFrequency(this: CollectionOperations<string>): Map<string, number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const texts = collect([
  "Hello world hello",
  "World of coding",
  "Hello again"
])

const frequencies = texts.wordFrequency()
console.log(Object.fromEntries(frequencies))
// {
//   "hello": 3,
//   "world": 2,
//   "of": 1,
//   "coding": 1,
//   "again": 1
// }
```

### Working with Text Analysis

```typescript
interface WordStats {
  word: string
  count: number
  percentage: number
}

const comments = collect([
  "Great product great service",
  "Product quality is good",
  "Great customer service"
])

const frequencies = comments.wordFrequency()
const totalWords = Array.from(frequencies.values())
  .reduce((sum, count) => sum + count, 0)

const stats: WordStats[] = Array.from(frequencies)
  .map(([word, count]) => ({
    word,
    count,
    percentage: (count / totalWords) * 100
  }))
```

### Real-world Example: E-commerce Review Analysis

```typescript
class ProductReviewAnalyzer {
  private reviews: CollectionOperations<string>

  constructor(reviews: string[]) {
    this.reviews = collect(reviews)
  }

  getCommonPhrases() {
    const frequencies = this.reviews.wordFrequency()
    return new Map(
      Array.from(frequencies.entries())
        .filter(([_, count]) => count > 1)
        .sort(([, a], [, b]) => b - a)
    )
  }

  getKeywordInsights() {
    const frequencies = this.reviews.wordFrequency()
    const keywords = ['quality', 'price', 'shipping', 'service']

    return keywords.map(keyword => ({
      keyword,
      mentions: frequencies.get(keyword) || 0
    }))
  }
}

// Usage example
const analyzer = new ProductReviewAnalyzer([
  "Excellent quality and fast shipping",
  "Good quality but high price",
  "Shipping was slow, good service",
  "Quality product, great service"
])

console.log(analyzer.getKeywordInsights())
console.log(analyzer.getCommonPhrases())
```

## Return Value

- Returns a Map with words as keys and frequencies as values
- Words are converted to lowercase for consistency
- Empty strings are filtered out
- Maintains word order based on first occurrence
- Efficient lookup performance using Map
- Case-insensitive word counting

## Common Use Cases

1. Content Analysis
   - Analyzing review content
   - Processing customer feedback
   - Identifying common themes
   - Tracking keyword usage

2. SEO Optimization
   - Analyzing keyword density
   - Content optimization
   - Keyword tracking
   - Meta tag analysis

3. User Feedback Processing
   - Identifying common issues
   - Analyzing feature requests
   - Processing support tickets
   - Review summarization

4. Product Research
   - Analyzing product descriptions
   - Processing competitor content
   - Market research analysis
   - Feature comparison

5. Quality Monitoring
   - Tracking issue mentions
   - Monitoring feedback trends
   - Analyzing support responses
   - Content moderation
