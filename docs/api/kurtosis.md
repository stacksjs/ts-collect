# Kurtosis Method

The `kurtosis()` method calculates the kurtosis (tailedness) of numeric values in the collection. Kurtosis measures whether the data are heavy-tailed or light-tailed compared to a normal distribution. A normal distribution has a kurtosis of 0 (excess kurtosis).

## Basic Syntax

```typescript
kurtosis<K extends keyof T>(key?: K): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 2, 3, 3, 3, 4, 4, 5])
const kurt = numbers.kurtosis()

console.log(kurt)
// Negative value indicates lighter tails than normal distribution
```

### Working with Object Properties

```typescript
interface DailyMetric {
  date: string
  value: number
}

const metrics = collect<DailyMetric>([
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 105 },
  { date: '2024-01-03', value: 103 },
  { date: '2024-01-04', value: 200 } // outlier
])

const distributionShape = metrics.kurtosis('value')
// Positive value indicates heavier tails due to outlier
```

### Real-world Example: E-commerce Order Analysis

```typescript
interface OrderMetrics {
  date: string
  orderCount: number
  averageValue: number
  returnRate: number
}

class OrderDistributionAnalyzer {
  private metrics: Collection<OrderMetrics>

  constructor(metrics: OrderMetrics[]) {
    this.metrics = collect(metrics)
  }

  analyzeSalesDistribution() {
    return {
      orderCountShape: {
        kurtosis: this.metrics.kurtosis('orderCount'),
        interpretation: this.interpretKurtosis(
          this.metrics.kurtosis('orderCount')
        )
      },
      orderValueShape: {
        kurtosis: this.metrics.kurtosis('averageValue'),
        interpretation: this.interpretKurtosis(
          this.metrics.kurtosis('averageValue')
        )
      },
      returnRateShape: {
        kurtosis: this.metrics.kurtosis('returnRate'),
        interpretation: this.interpretKurtosis(
          this.metrics.kurtosis('returnRate')
        )
      }
    }
  }

  private interpretKurtosis(kurtosis: number): string {
    if (Math.abs(kurtosis) < 0.5) {
      return 'Near normal distribution'
    }
    if (kurtosis > 0) {
      return `Heavy-tailed distribution (${kurtosis.toFixed(2)}).
              Suggests frequent extreme values.`
    }
    return `Light-tailed distribution (${kurtosis.toFixed(2)}).
            Suggests consistent values with few extremes.`
  }

  getDistributionAlert(): string | null {
    const orderKurtosis = this.metrics.kurtosis('orderCount')
    const valueKurtosis = this.metrics.kurtosis('averageValue')

    if (orderKurtosis > 2 || valueKurtosis > 2) {
      return 'High number of unusual order patterns detected. Review needed.'
    }
    return null
  }
}

// Usage
const analyzer = new OrderDistributionAnalyzer([
  {
    date: '2024-01-01',
    orderCount: 100,
    averageValue: 50,
    returnRate: 0.05
  },
  {
    date: '2024-01-02',
    orderCount: 500, // unusual spike
    averageValue: 45,
    returnRate: 0.04
  }
])

const analysis = analyzer.analyzeSalesDistribution()
```

## Type Safety

```typescript
interface SalesData {
  revenue: number
  category: string
}

const sales = collect<SalesData>([
  { revenue: 1000, category: 'A' },
  { revenue: 1500, category: 'B' }
])

// Type-safe kurtosis calculation
const revenueKurtosis: number = sales.kurtosis('revenue')

// TypeScript enforces numeric fields
// sales.kurtosis('category') // ✗ TypeScript error
```

## Return Value

- Returns a number representing kurtosis where:
  - = 0: Normal distribution
  - > 0: Heavy-tailed (more outliers)
  - < 0: Light-tailed (fewer outliers)
- Returns NaN for insufficient data
- Handles undefined values
- Requires numeric values
- Maintains type safety
- Uses excess kurtosis formula (normal = 0)

## Common Use Cases

### 1. Sales Analysis

- Order value distribution
- Sales pattern analysis
- Revenue consistency
- Seasonal variations
- Customer behavior

### 2. Risk Assessment

- Price volatility
- Return rate patterns
- Inventory fluctuations
- Demand variability
- Cost distribution

### 3. Performance Monitoring

- Response time patterns
- Load distribution
- Error rate analysis
- Resource usage
- Traffic patterns

### 4. Quality Control

- Process variation
- Product consistency
- Service level patterns
- Defect distribution
- Performance metrics

### 5. Customer Behavior

- Purchase frequency
- Order size patterns
- Session duration
- Engagement metrics
- Activity distribution
