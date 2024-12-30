# Correlate Method

The `correlate()` method calculates the Pearson correlation coefficient between two numeric fields in the collection. This method helps identify linear relationships between variables, returning a value between -1 and 1.

## Basic Syntax

```typescript
correlate<K extends keyof T>(key1: K, key2: K): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 6 },
  { x: 4, y: 8 }
])

const correlation = data.correlate('x', 'y')
console.log(correlation) // 1.0 (perfect positive correlation)
```

### Working with Real Data

```typescript
interface MarketData {
  date: string
  price: number
  volume: number
  volatility: number
}

const marketData = collect<MarketData>([
  { date: '2024-01-01', price: 100, volume: 1000, volatility: 0.15 },
  { date: '2024-01-02', price: 102, volume: 1200, volatility: 0.18 },
  { date: '2024-01-03', price: 98, volume: 1500, volatility: 0.22 }
])

// Check correlation between volume and volatility
const volCorrelation = marketData.correlate('volume', 'volatility')
```

### Real-world Example: E-commerce Analytics

```typescript
interface SalesMetrics {
  date: string
  advertising: number
  visitors: number
  sales: number
  averageOrderValue: number
  conversionRate: number
}

class SalesAnalyzer {
  private metrics: Collection<SalesMetrics>

  constructor(metrics: SalesMetrics[]) {
    this.metrics = collect(metrics)
  }

  analyzeMetricCorrelations() {
    return {
      advertisingToSales: this.metrics.correlate('advertising', 'sales'),
      visitorsToSales: this.metrics.correlate('visitors', 'sales'),
      visitorToConversion: this.metrics.correlate('visitors', 'conversionRate'),
      salesToOrderValue: this.metrics.correlate('sales', 'averageOrderValue')
    }
  }

  findStrongestSalesDriver(): string {
    const correlations = [
      { metric: 'Advertising', value: this.metrics.correlate('advertising', 'sales') },
      { metric: 'Visitors', value: this.metrics.correlate('visitors', 'sales') },
      { metric: 'Conversion Rate', value: this.metrics.correlate('conversionRate', 'sales') }
    ]

    return collect(correlations)
      .sortBy('value', 'desc')
      .first()
      ?.metric || 'No significant driver found'
  }

  getCorrelationStrength(key1: keyof SalesMetrics, key2: keyof SalesMetrics): string {
    const correlation = Math.abs(this.metrics.correlate(key1, key2))

    if (correlation >= 0.7) return 'Strong'
    if (correlation >= 0.3) return 'Moderate'
    return 'Weak'
  }
}

// Usage
const analyzer = new SalesAnalyzer([
  {
    date: '2024-01-01',
    advertising: 1000,
    visitors: 5000,
    sales: 15000,
    averageOrderValue: 75,
    conversionRate: 0.02
  },
  // ... more data
])

const analysis = analyzer.analyzeMetricCorrelations()
```

## Type Safety

```typescript
interface DataPoint {
  id: number
  x: number
  y: number
  label: string
}

const points = collect<DataPoint>([
  { id: 1, x: 10, y: 20, label: 'A' },
  { id: 2, x: 15, y: 25, label: 'B' }
])

// Type-safe correlation
const correlation: number = points.correlate('x', 'y') // ✓ Valid

// TypeScript enforces numeric fields
// points.correlate('x', 'label') // ✗ TypeScript error
// points.correlate('label', 'y') // ✗ TypeScript error
```

## Return Value

- Returns a number between -1 and 1 where:
  - 1: Perfect positive correlation
  - -1: Perfect negative correlation
  - 0: No correlation
- NaN if data is insufficient or invalid
- Undefined values are skipped
- Non-numeric values cause TypeError
- Requires at least 2 points
- Same field correlation returns 1

## Common Use Cases

### 1. Sales Analysis

- Marketing impact analysis
- Conversion optimization
- Price sensitivity studies
- Performance metrics
- Customer behavior analysis

### 2. Performance Metrics

- Resource utilization
- System metrics correlation
- Performance indicators
- Load analysis
- Capacity planning

### 3. Marketing Analysis

- Campaign effectiveness
- Channel performance
- Budget optimization
- ROI analysis
- Attribution modeling

### 4. Customer Insights

- Behavior patterns
- Purchase correlations
- Engagement metrics
- Retention analysis
- Value drivers

### 5. Risk Analysis

- Market indicators
- Risk factors
- Pattern detection
- Trend analysis
- Predictive metrics
