# Covariance Method

The `covariance()` method calculates the covariance between two numeric fields in the collection. Covariance measures how two variables change together, indicating the direction of their linear relationship.

## Basic Syntax

```typescript
covariance<K extends keyof T>(key1: K, key2: K): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 6 }
])

const cov = data.covariance('x', 'y')
console.log(cov)
// Positive value indicates positive relationship
```

### Working with Multiple Variables

```typescript
interface MarketData {
  date: string
  price: number
  volume: number
  volatility: number
}

const market = collect<MarketData>([
  { date: '2024-01-01', price: 100, volume: 1000, volatility: 0.1 },
  { date: '2024-01-02', price: 102, volume: 1200, volatility: 0.15 },
  { date: '2024-01-03', price: 98, volume: 1500, volatility: 0.2 }
])

const priceVolumeCovar = market.covariance('price', 'volume')
const priceVolatilityCovar = market.covariance('price', 'volatility')
```

### Real-world Example: E-commerce Metrics Analysis

```typescript
interface SalesMetrics {
  date: string
  adSpend: number
  visitors: number
  revenue: number
  conversionRate: number
}

class MarketingAnalyzer {
  private metrics: Collection<SalesMetrics>

  constructor(metrics: SalesMetrics[]) {
    this.metrics = collect(metrics)
  }

  analyzeMetricRelationships() {
    return {
      adSpendToRevenue: {
        covariance: this.metrics.covariance('adSpend', 'revenue'),
        interpretation: this.interpretCovariance('adSpend', 'revenue')
      },
      visitorsToRevenue: {
        covariance: this.metrics.covariance('visitors', 'revenue'),
        interpretation: this.interpretCovariance('visitors', 'revenue')
      },
      visitorToConversion: {
        covariance: this.metrics.covariance('visitors', 'conversionRate'),
        interpretation: this.interpretCovariance('visitors', 'conversionRate')
      }
    }
  }

  interpretCovariance(metric1: keyof SalesMetrics, metric2: keyof SalesMetrics): string {
    const covar = this.metrics.covariance(metric1, metric2)

    if (Math.abs(covar) < 0.1) {
      return `${metric1} and ${metric2} show very weak relationship`
    }

    if (covar > 0) {
      return `${metric1} and ${metric2} tend to increase together`
    }

    return `${metric1} tends to decrease when ${metric2} increases`
  }

  getMarketingInsights(): string[] {
    const insights: string[] = []
    const adSpendRevenueCovar = this.metrics.covariance('adSpend', 'revenue')
    const visitorConversionCovar = this.metrics.covariance('visitors', 'conversionRate')

    if (adSpendRevenueCovar <= 0) {
      insights.push('Ad spend might not be efficiently driving revenue')
    }

    if (visitorConversionCovar < 0) {
      insights.push('High traffic might be impacting conversion quality')
    }

    return insights
  }
}

// Usage
const analyzer = new MarketingAnalyzer([
  {
    date: '2024-01-01',
    adSpend: 1000,
    visitors: 5000,
    revenue: 10000,
    conversionRate: 0.02
  },
  {
    date: '2024-01-02',
    adSpend: 1500,
    visitors: 7500,
    revenue: 15000,
    conversionRate: 0.018
  }
])

const analysis = analyzer.analyzeMetricRelationships()
```

## Type Safety

```typescript
interface DataPoint {
  x: number
  y: number
  label: string
}

const points = collect<DataPoint>([
  { x: 1, y: 2, label: 'A' },
  { x: 2, y: 4, label: 'B' }
])

// Type-safe covariance calculation
const covar: number = points.covariance('x', 'y')

// TypeScript enforces numeric fields
// points.covariance('x', 'label') // ✗ TypeScript error
// points.covariance('label', 'y') // ✗ TypeScript error
```

## Return Value

- Returns a number representing covariance where:
  - > 0: Positive relationship
  - < 0: Negative relationship
  - ≈ 0: No linear relationship
- Returns NaN for insufficient data
- Handles undefined values
- Requires numeric values
- Maintains type safety
- Unit depends on input units

## Common Use Cases

### 1. Marketing Analysis

- Ad spend effectiveness
- Traffic to conversion
- Campaign performance
- Channel relationships
- ROI analysis

### 2. Price Analysis

- Price-demand relationship
- Volume-price impact
- Discount effectiveness
- Margin analysis
- Cost relationships

### 3. Performance Metrics

- Resource utilization
- Load relationships
- Response patterns
- System metrics
- Capacity planning

### 4. Customer Behavior

- Purchase patterns
- Engagement metrics
- Session analysis
- Activity correlation
- Usage relationships

### 5. Market Analysis

- Market indicators
- Trend relationships
- Competition impact
- Growth patterns
- Risk assessment
