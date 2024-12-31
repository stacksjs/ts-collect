# sentiment Method

The `sentiment()` method performs sentiment analysis on a collection of text strings, returning a collection of sentiment scores. It evaluates the emotional tone of text using a basic lexicon-based approach, providing both absolute and comparative (normalized) sentiment scores.

## Basic Syntax

```typescript
sentiment(this: CollectionOperations<string>): CollectionOperations<{
  score: number,         // Absolute sentiment score
  comparative: number    // Score normalized by text length
}>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const reviews = collect([
  "This product is great and awesome!",
  "I'm not happy with the quality",
  "The service was excellent but delivery was slow"
])

const analyzed = reviews.sentiment()
console.log(analyzed.all())
// [
//   { score: 2, comparative: 0.4 },   // Positive
//   { score: -1, comparative: -0.2 }, // Negative
//   { score: 0, comparative: 0 }      // Neutral
// ]
```

### Working with Product Reviews

```typescript
interface ReviewAnalysis {
  text: string
  sentiment: {
    score: number
    comparative: number
  }
}

const productReviews = collect([
  "Love this laptop, great performance and awesome battery life",
  "Terrible customer support, horrible experience",
  "Good product but could be better"
]).map(text => ({
  text,
  sentiment: collect([text]).sentiment().first()!
}))
```

### Real-world Example: E-commerce Review Analysis

```typescript
class CustomerFeedbackAnalyzer {
  private reviews: CollectionOperations<string>

  constructor(reviews: string[]) {
    this.reviews = collect(reviews)
  }

  analyzeFeedback() {
    const sentiments = this.reviews.sentiment()

    const averageScore = sentiments.avg('score')
    const positiveReviews = sentiments.filter(s => s.score > 0)
    const negativeReviews = sentiments.filter(s => s.score < 0)

    return {
      averageScore,
      positiveCount: positiveReviews.count(),
      negativeCount: negativeReviews.count(),
      totalReviews: sentiments.count()
    }
  }

  getTopPositiveReviews() {
    return this.reviews
      .map(text => ({
        text,
        sentiment: collect([text]).sentiment().first()!
      }))
      .sortByDesc('sentiment.score')
      .take(5)
  }
}

// Usage example
const analyzer = new CustomerFeedbackAnalyzer([
  "This product exceeded my expectations! Great value for money",
  "Not worth the price, very disappointed",
  "The quality is good but shipping was slow",
  "Absolutely love it! Best purchase ever!"
])

console.log(analyzer.analyzeFeedback())
```

## Return Value

- Returns a new collection containing sentiment analysis results
- Each result includes both absolute and comparative scores
- Absolute score represents total sentiment value
- Comparative score normalizes sentiment by text length
- Preserves order of original collection
- Type-safe sentiment analysis results

## Common Use Cases

1. Customer Feedback Analysis
   - Processing product reviews
   - Analyzing support tickets
   - Evaluating customer comments
   - Monitoring social media mentions

2. Market Research
   - Analyzing competitor reviews
   - Processing survey responses
   - Evaluating market feedback
   - Tracking brand sentiment

3. Content Moderation
   - Filtering user comments
   - Prioritizing support tickets
   - Identifying negative feedback
   - Monitoring community posts

4. Performance Monitoring
   - Tracking customer satisfaction
   - Analyzing support quality
   - Evaluating product reception
   - Monitoring service feedback

5. Trend Analysis
   - Identifying sentiment patterns
   - Tracking sentiment changes
   - Analyzing feedback trends
   - Monitoring brand perception
