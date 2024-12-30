# Skewness Method

The `skewness()` method calculates the skewness of numeric values in the collection. Skewness measures the asymmetry of the probability distribution of values around their mean. A normal distribution has a skewness of 0.

## Basic Syntax

```typescript
skewness<K extends keyof T>(key?: K): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 2, 3, 3, 3, 4, 8])
const skew = numbers.skewness()

console.log(skew)
// Positive value indicates right-skewed distribution
```

### Working with Object Properties

```typescript
interface OrderData {
  date: string
  amount: number
}

const orders = collect<OrderData>([
  { date: '2024-01-01', amount: 100 },
  { date: '2024-01-02', amount: 120 },
  { date: '2024-01-03', amount: 110 },
  { date: '2024-01-04', amount: 500 } // large order
])

const amountSkewness = orders.skewness('amount')
// Positive value indicates right skew due to large order
```

### Real-world Example: E-commerce Price Analysis

```typescript
interface ProductMetrics {
  sku: string
  price: number
  orderSize: number
  profit: number
}

class PriceDistributionAnalyzer {
  private metrics: Collection<ProductMetrics>

  constructor(metrics: ProductMetrics[]) {
    this.metrics = collect(metrics)
  }

  analyzePriceDistribution() {
    return {
      price: {
        skewness: this.metrics.skewness('price'),
        interpretation: this.interpretSkewness('price')
      },
      orderSize: {
        skewness: this.metrics.skewness('orderSize'),
        interpretation: this.interpretSkewness('orderSize')
      },
      profit: {
        skewness: this.metrics.skewness('profit'),
        interpretation: this.interpretSkewness('profit')
      }
    }
  }

  interpretSkewness(metric: keyof ProductMetrics): string {
    const skew = this.metrics.skewness(metric)

    if (Math.abs(skew) < 0.5) {
      return `${metric} distribution is approximately symmetric`
    }

    if (skew > 0) {
      return `${metric} is right-skewed (${skew.toFixed(2)}).
              Most values are below mean with some high outliers.`
    }

    return `${metric} is left-skewed (${skew.toFixed(2)}).
            Most values are above mean with some low outliers.`
  }

  getPricingRecommendations(): string[] {
    const recommendations: string[] = []
    const priceSkew = this.metrics.skewness('price')
    const profitSkew = this.metrics.skewness('profit')

    if (priceSkew > 1) {
      recommendations.push(
        'Consider introducing mid-range price points to balance distribution'
      )
    }

    if (profitSkew < -1) {
      recommendations.push(
        'Review pricing strategy: profit distribution shows many low-margin items'
      )
    }

    return recommendations
  }
}

// Usage
const analyzer = new PriceDistributionAnalyzer([
  {
    sku: 'LAPTOP1',
    price: 999,
    orderSize: 1,
    profit: 200
  },
  {
    sku: 'MOUSE1',
    price: 29.99,
    orderSize: 3,
    profit: 15
  }
])

const analysis = analyzer.analyzePriceDistribution()
```

## Type Safety

```typescript
interface MetricData {
  value: number
  label: string
}

const data = collect<MetricData>([
  { value: 100, label: 'A' },
  { value: 200, label: 'B' }
])

// Type-safe skewness calculation
const valueSkewness: number = data.skewness('value')

// TypeScript enforces numeric fields
// data.skewness('label') // ✗ TypeScript error
```

## Return Value

- Returns a number representing skewness where:
  - = 0: Symmetric distribution
  - > 0: Right-skewed (positive skew)
  - < 0: Left-skewed (negative skew)
- Returns NaN for insufficient data
- Handles undefined values
- Requires numeric values
- Maintains type safety
- Uses standardized third moment

## Common Use Cases

### 1. Price Analysis

- Product pricing distribution
- Discount patterns
- Profit margins
- Cost analysis
- Revenue distribution

### 2. Order Analysis

- Order size distribution
- Cart value patterns
- Purchase frequency
- Customer spending
- Quantity patterns

### 3. Customer Behavior

- Session duration
- Engagement metrics
- Purchase intervals
- Activity patterns
- Response times

### 4. Performance Analysis

- Load distribution
- Response times
- Resource usage
- Error patterns
- Service metrics

### 5. Market Analysis

- Market concentration
- Competition analysis
- Market share
- Growth patterns
- Trend analysis
