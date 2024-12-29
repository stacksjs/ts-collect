# percentile Method

The `percentile()` method calculates the value at a specified percentile in the collection. When a key is provided, it calculates the percentile of values for that specific property.

## Basic Syntax

```typescript
collect(items).percentile(p: number, key?: keyof T): number | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple percentile calculation
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
console.log(numbers.percentile(50))  // 5 (median)
console.log(numbers.percentile(75))  // 7.5 (third quartile)
console.log(numbers.percentile(90))  // 9 (90th percentile)

// With objects
const items = collect([
  { value: 10 },
  { value: 20 },
  { value: 30 },
  { value: 40 }
])
console.log(items.percentile(75, 'value'))  // 35
```

### Working with Objects

```typescript
interface Product {
  id: number
  price: number
  salesRank: number
  views: number
}

const products = collect<Product>([
  { id: 1, price: 100, salesRank: 5, views: 1000 },
  { id: 2, price: 200, salesRank: 2, views: 2000 },
  { id: 3, price: 150, salesRank: 8, views: 1500 },
  { id: 4, price: 300, salesRank: 1, views: 3000 }
])

// Get premium price threshold (75th percentile)
const premiumThreshold = products.percentile(75, 'price')

// Get high performance threshold (90th percentile)
const topPerformerThreshold = products.percentile(90, 'views')
```

### Real-world Examples

#### Price Analysis System

```typescript
interface PriceData {
  productId: string
  price: number
  category: string
  margin: number
  marketShare: number
}

class PriceAnalyzer {
  constructor(private priceData: Collection<PriceData>) {}

  getPriceSegments(): {
    budget: number,
    standard: number,
    premium: number,
    luxury: number
  } {
    return {
      budget: this.priceData.percentile(25, 'price') ?? 0,
      standard: this.priceData.percentile(50, 'price') ?? 0,
      premium: this.priceData.percentile(75, 'price') ?? 0,
      luxury: this.priceData.percentile(90, 'price') ?? 0
    }
  }

  getMarginThresholds(): {
    low: number,
    medium: number,
    high: number
  } {
    return {
      low: this.priceData.percentile(33, 'margin') ?? 0,
      medium: this.priceData.percentile(66, 'margin') ?? 0,
      high: this.priceData.percentile(90, 'margin') ?? 0
    }
  }

  getMarketLeaders(): PriceData[] {
    const threshold = this.priceData.percentile(80, 'marketShare') ?? 0
    return this.priceData
      .filter(item => item.marketShare >= threshold)
      .toArray()
  }
}
```

#### Performance Metrics Analyzer

```typescript
interface PerformanceMetric {
  salesRepId: string
  revenue: number
  conversionRate: number
  customerSatisfaction: number
}

class PerformanceAnalyzer {
  constructor(private metrics: Collection<PerformanceMetric>) {}

  getPerformanceTiers(): {
    exceptional: number,
    excellent: number,
    standard: number,
    needsImprovement: number
  } {
    return {
      exceptional: this.metrics.percentile(95, 'revenue') ?? 0,
      excellent: this.metrics.percentile(75, 'revenue') ?? 0,
      standard: this.metrics.percentile(50, 'revenue') ?? 0,
      needsImprovement: this.metrics.percentile(25, 'revenue') ?? 0
    }
  }

  identifyTopPerformers(): string[] {
    const revenueThreshold = this.metrics.percentile(90, 'revenue') ?? 0
    const conversionThreshold = this.metrics.percentile(90, 'conversionRate') ?? 0

    return this.metrics
      .filter(rep =>
        rep.revenue >= revenueThreshold &&
        rep.conversionRate >= conversionThreshold
      )
      .pluck('salesRepId')
      .toArray()
  }

  getSatisfactionBenchmarks(): {
    excellent: number,
    satisfactory: number,
    concerning: number
  } {
    return {
      excellent: this.metrics.percentile(80, 'customerSatisfaction') ?? 0,
      satisfactory: this.metrics.percentile(50, 'customerSatisfaction') ?? 0,
      concerning: this.metrics.percentile(20, 'customerSatisfaction') ?? 0
    }
  }
}
```

### Advanced Usage

#### Customer Analytics System

```typescript
interface CustomerMetric {
  customerId: string
  lifetimeValue: number
  orderFrequency: number
  averageOrderValue: number
  engagementScore: number
}

class CustomerAnalyzer {
  constructor(private customers: Collection<CustomerMetric>) {}

  getCustomerSegments(): {
    vip: CustomerMetric[],
    loyal: CustomerMetric[],
    regular: CustomerMetric[],
    occasional: CustomerMetric[]
  } {
    const vipThreshold = this.customers.percentile(90, 'lifetimeValue') ?? 0
    const loyalThreshold = this.customers.percentile(75, 'lifetimeValue') ?? 0
    const regularThreshold = this.customers.percentile(50, 'lifetimeValue') ?? 0

    return {
      vip: this.customers
        .filter(c => c.lifetimeValue >= vipThreshold)
        .toArray(),
      loyal: this.customers
        .filter(c => c.lifetimeValue >= loyalThreshold && c.lifetimeValue < vipThreshold)
        .toArray(),
      regular: this.customers
        .filter(c => c.lifetimeValue >= regularThreshold && c.lifetimeValue < loyalThreshold)
        .toArray(),
      occasional: this.customers
        .filter(c => c.lifetimeValue < regularThreshold)
        .toArray()
    }
  }

  getEngagementBenchmarks(): {
    highly: number,
    moderately: number,
    minimally: number
  } {
    return {
      highly: this.customers.percentile(75, 'engagementScore') ?? 0,
      moderately: this.customers.percentile(50, 'engagementScore') ?? 0,
      minimally: this.customers.percentile(25, 'engagementScore') ?? 0
    }
  }
}
```

## Type Safety

```typescript
interface TypedMetric {
  id: number
  value: number
  score: number
}

const metrics = collect<TypedMetric>([
  { id: 1, value: 100, score: 85 },
  { id: 2, value: 200, score: 92 }
])

// Type-safe percentile calculation
const valuePercentile: number | undefined = metrics.percentile(75, 'value')
const scorePercentile: number | undefined = metrics.percentile(90, 'score')

// TypeScript enforces valid keys
// metrics.percentile(75, 'invalid')  // ✗ TypeScript error
```

## Return Value

- Returns the value at the specified percentile
- Returns undefined for empty collections
- Returns undefined if percentile is invalid (< 0 or > 100)
- Handles decimal percentiles
- Maintains numeric precision
- Returns undefined for non-numeric values

## Common Use Cases

### 1. Price Analysis

- Price segmentation
- Premium thresholds
- Market positioning
- Competitive analysis
- Margin analysis

### 2. Performance Metrics

- Revenue benchmarks
- Productivity thresholds
- Quality standards
- Achievement levels
- Efficiency metrics

### 3. Customer Segmentation

- Value tiers
- Engagement levels
- Loyalty brackets
- Activity thresholds
- Spending patterns

### 4. Inventory Analysis

- Stock levels
- Turnover rates
- Reorder points
- Safety stocks
- Demand patterns

### 5. Sales Analytics

- Revenue targets
- Commission tiers
- Goal setting
- Performance review
- Territory analysis

### 6. Quality Control

- Acceptance levels
- Defect thresholds
- Performance standards
- Control limits
- Tolerance ranges

### 7. Response Times

- Service levels
- Performance targets
- SLA thresholds
- Processing times
- Wait times

### 8. Resource Utilization

- Capacity planning
- Usage thresholds
- Efficiency targets
- Load balancing
- Resource allocation

### 9. Risk Assessment

- Risk thresholds
- Exposure limits
- Safety margins
- Compliance levels
- Security benchmarks

### 10. Marketing Analysis

- Campaign performance
- Engagement rates
- Conversion thresholds
- ROI benchmarks
- Response rates
