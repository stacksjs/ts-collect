# ZScore Method

The `zscore()` method calculates the standardized z-scores for numeric values in the collection, measuring how many standard deviations each value is from the mean. This is particularly useful for data normalization and outlier detection.

## Basic Syntax

```typescript
zscore<K extends keyof T>(key?: K): CollectionOperations<number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([2, 4, 6, 8, 10])
const scores = numbers.zscore()

console.log(scores.all())
// [-1.26, -0.63, 0, 0.63, 1.26]
```

### Working with Object Properties

```typescript
interface Score {
  student: string
  score: number
}

const scores = collect<Score>([
  { student: 'Chris', score: 85 },
  { student: 'Avery', score: 90 },
  { student: 'Buddy', score: 95 }
])

const standardizedScores = scores.zscore('score')
console.log(standardizedScores.all())
// [-1, 0, 1]  // Approximate values
```

### Real-world Example: E-commerce Performance Analysis

```typescript
interface ProductMetrics {
  sku: string
  views: number
  sales: number
  conversionRate: number
}

class ProductAnalyzer {
  private products: Collection<ProductMetrics>

  constructor(products: ProductMetrics[]) {
    this.products = collect(products)
  }

  analyzePerformance() {
    return this.products.map(product => ({
      sku: product.sku,
      metrics: {
        viewsZScore: this.products.zscore('views').first(),
        salesZScore: this.products.zscore('sales').first(),
        conversionZScore: this.products.zscore('conversionRate').first()
      },
      performance: this.calculatePerformanceScore(product)
    }))
  }

  findOutperformers(): Collection<ProductMetrics> {
    // Find products that are more than 1 standard deviation above mean in all metrics
    return this.products.filter(product => {
      const viewScore = this.products.zscore('views').first() || 0
      const salesScore = this.products.zscore('sales').first() || 0
      const conversionScore = this.products.zscore('conversionRate').first() || 0

      return viewScore > 1 && salesScore > 1 && conversionScore > 1
    })
  }

  private calculatePerformanceScore(product: ProductMetrics): string {
    const zScores = [
      this.products.zscore('views').first() || 0,
      this.products.zscore('sales').first() || 0,
      this.products.zscore('conversionRate').first() || 0
    ]

    const avgZScore = zScores.reduce((a, b) => a + b, 0) / 3

    if (avgZScore > 1) return 'Excellent'
    if (avgZScore > 0) return 'Good'
    if (avgZScore > -1) return 'Average'
    return 'Needs Improvement'
  }
}

// Usage
const analyzer = new ProductAnalyzer([
  {
    sku: 'LAPTOP1',
    views: 1000,
    sales: 50,
    conversionRate: 0.05
  },
  {
    sku: 'PHONE1',
    views: 2000,
    sales: 150,
    conversionRate: 0.075
  }
])

const analysis = analyzer.analyzePerformance()
```

## Type Safety

```typescript
interface Metrics {
  value: number
  category: string
}

const data = collect<Metrics>([
  { value: 100, category: 'A' },
  { value: 200, category: 'B' }
])

// Type-safe z-score calculation
const zScores: CollectionOperations<number> = data.zscore('value')

// TypeScript enforces numeric fields
// data.zscore('category') // ✗ TypeScript error
```

## Return Value

- Returns a Collection of z-scores (standardized values)
- Each value represents standard deviations from mean
- Mean of z-scores is always 0
- Standard deviation of z-scores is always 1
- Maintains collection chain methods
- Handles undefined values gracefully

## Common Use Cases

### 1. Performance Analysis

- Product performance
- Sales metrics
- Conversion rates
- Traffic analysis
- Revenue benchmarking

### 2. Data Normalization

- Score standardization
- Metric comparison
- Performance ranking
- Data scaling
- Feature normalization

### 3. Outlier Detection

- Anomaly detection
- Quality control
- Fraud detection
- Error identification
- Pattern recognition

### 4. Comparative Analysis

- Competitor analysis
- Market benchmarking
- Performance evaluation
- Trend analysis
- Resource optimization

### 5. Statistical Analysis

- Distribution analysis
- Probability calculation
- Risk assessment
- Quality scoring
- Percentile ranking
