# ngrams Method

The `ngrams()` method generates sequences of `n` consecutive words from text strings in the collection. This method is useful for analyzing text patterns, phrase frequencies, and language processing tasks.

## Basic Syntax

```typescript
ngrams(this: CollectionOperations<string>, n: number): CollectionOperations<string>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const text = collect([
  "The quick brown fox jumps"
])

const bigrams = text.ngrams(2)
console.log(bigrams.all())
// [
//   "The quick",
//   "quick brown",
//   "brown fox",
//   "fox jumps"
// ]

const trigrams = text.ngrams(3)
console.log(trigrams.all())
// [
//   "The quick brown",
//   "quick brown fox",
//   "brown fox jumps"
// ]
```

### Pattern Analysis

```typescript
interface PhraseFrequency {
  phrase: string
  count: number
}

const reviews = collect([
  "very good product quality",
  "good product durability",
  "product quality excellent"
])

const commonPhrases = reviews
  .ngrams(2)
  .frequency()
  .entries()
  .map(([phrase, count]) => ({ phrase, count }))
  .sortByDesc('count')
```

### Real-world Example: E-commerce Review Analysis

```typescript
class ProductReviewAnalyzer {
  private reviews: CollectionOperations<string>

  constructor(reviews: string[]) {
    this.reviews = collect(reviews)
  }

  findCommonPhrases() {
    return this.reviews
      .ngrams(2)
      .frequency()
      .entries()
      .filter(([_, count]) => count > 1)
      .map(([phrase, count]) => ({
        phrase,
        count,
        percentage: (count / this.reviews.count()) * 100
      }))
  }

  getKeyPhrases(minOccurrences: number = 2) {
    const bigramFrequency = this.reviews.ngrams(2).frequency()
    const trigramFrequency = this.reviews.ngrams(3).frequency()

    return {
      topBigrams: Array.from(bigramFrequency.entries())
        .filter(([_, count]) => count >= minOccurrences)
        .sort(([, a], [, b]) => b - a),
      topTrigrams: Array.from(trigramFrequency.entries())
        .filter(([_, count]) => count >= minOccurrences)
        .sort(([, a], [, b]) => b - a)
    }
  }
}

// Usage example
const analyzer = new ProductReviewAnalyzer([
  "Great product quality and durability",
  "Product quality is excellent",
  "Excellent customer service response",
  "Quick service response time"
])

console.log(analyzer.getKeyPhrases())
```

## Return Value

- Returns a new collection containing n-gram strings
- Maintains original word order
- Preserves case of original text
- Empty input returns empty collection
- Handles multiple input strings
- Returns shorter n-grams for inputs smaller than n

## Common Use Cases

1. Text Analysis
   - Finding common phrases
   - Analyzing writing patterns
   - Identifying repeated content
   - Language pattern detection

2. Content Optimization
   - SEO keyword analysis
   - Content uniqueness checking
   - Plagiarism detection
   - Phrase extraction

3. Customer Feedback Analysis
   - Review pattern analysis
   - Common complaint detection
   - Feature request identification
   - Sentiment pattern analysis

4. Quality Monitoring
   - Support response analysis
   - Documentation consistency
   - Content standardization
   - Pattern recognition

5. Search Enhancement
   - Query suggestion generation
   - Search term analysis
   - Autocomplete improvements
   - Related phrase detection
