# movingAverage Method

The `movingAverage()` method calculates a moving average over a specified window of values. It can be centered or trailing, making it useful for trend analysis and smoothing time series data.

## Basic Syntax

```typescript
collect(items).movingAverage({
  window: number,           // Size of the moving window
  centered?: boolean = false  // Whether to center the window
}): Collection<number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple trailing moving average
const values = collect([1, 2, 3, 4, 5, 6])
const movingAvg = values.movingAverage({ window: 3 })
console.log(movingAvg.all())  // [2, 3, 4, 5]

// Centered moving average
const centeredAvg = values.movingAverage({
  window: 3,
  centered: true
})
console.log(centeredAvg.all())  // [2, 3, 4, 5]
```

### Working with Objects

```typescript
interface DailySales {
  date: string
  revenue: number
  orders: number
}

const sales = collect<DailySales>([
  { date: '2024-01-01', revenue: 1000, orders: 10 },
  { date: '2024-01-02', revenue: 1200, orders: 12 },
  { date: '2024-01-03', revenue: 800, orders: 8 },
  { date: '2024-01-04', revenue: 1500, orders: 15 },
  { date: '2024-01-05', revenue: 1300, orders: 13 }
])

// Calculate 3-day moving average of revenue
const revenueMA = sales
  .pluck('revenue')
  .movingAverage({ window: 3 })
```

### Real-world Examples

#### Sales Trend Analyzer

```typescript
interface SalesMetric {
  date: Date
  revenue: number
  units: number
  avgOrderValue: number
}

class SalesTrendAnalyzer {
  constructor(private sales: Collection<SalesMetric>) {}

  analyzeTrends(window: number = 7): {
    revenue: Collection<number>
    units: Collection<number>
    orderValue: Collection<number>
  } {
    return {
      revenue: this.calculateSmoothedTrend('revenue', window),
      units: this.calculateSmoothedTrend('units', window),
      orderValue: this.calculateSmoothedTrend('avgOrderValue', window)
    }
  }

  private calculateSmoothedTrend(
    metric: keyof SalesMetric,
    window: number
  ): Collection<number> {
    return this.sales
      .pluck(metric)
      .movingAverage({
        window,
        centered: true
      })
  }

  detectAnomalies(threshold: number = 2): {
    dates: Date[]
    metrics: Array<keyof SalesMetric>
  } {
    const anomalies = new Map<Date, Set<keyof SalesMetric>>()

    // Check each metric for anomalies
    const metrics: Array<keyof SalesMetric> = ['revenue', 'units', 'avgOrderValue']
    metrics.forEach(metric => {
      const values = this.sales.pluck(metric)
      const ma = values.movingAverage({ window: 7 })
      const stdDev = values.standardDeviation()

      values.each((value, index) => {
        const deviation = Math.abs(value - (ma.nth(index) || 0))
        if (deviation > threshold * stdDev.population) {
          const date = this.sales.nth(index)?.date
          if (date) {
            if (!anomalies.has(date)) {
              anomalies.set(date, new Set())
            }
            anomalies.get(date)?.add(metric)
          }
        }
      })
    })

    return {
      dates: Array.from(anomalies.keys()),
      metrics: Array.from(
        new Set(
          Array.from(anomalies.values())
            .flatMap(set => Array.from(set))
        )
      )
    }
  }
}
```

#### Demand Forecaster

```typescript
interface DemandData {
  product: string
  date: Date
  demand: number
  price: number
}

class DemandForecaster {
  constructor(private data: Collection<DemandData>) {}

  generateForecast(
    options: {
      window: number
      productId: string
      smoothingFactor?: number
    }
  ): {
    trend: Collection<number>
    forecast: Collection<number>
    confidence: number
  } {
    const productDemand = this.data
      .where('product', options.productId)
      .pluck('demand')

    // Calculate smoothed trend
    const trend = productDemand.movingAverage({
      window: options.window,
      centered: false
    })

    // Calculate forecast using exponential smoothing
    const alpha = options.smoothingFactor || 0.2
    const forecast = this.exponentialSmoothing(trend, alpha)

    // Calculate forecast confidence based on error variance
    const confidence = this.calculateConfidence(trend, forecast)

    return { trend, forecast, confidence }
  }

  private exponentialSmoothing(
    values: Collection<number>,
    alpha: number
  ): Collection<number> {
    const result: number[] = []
    let lastForecast = values.first() || 0

    values.each(value => {
      lastForecast = alpha * value + (1 - alpha) * lastForecast
      result.push(lastForecast)
    })

    return collect(result)
  }

  private calculateConfidence(
    actual: Collection<number>,
    forecast: Collection<number>
  ): number {
    const errors = actual.map((value, index) =>
      Math.abs(value - (forecast.nth(index) || 0))
    )

    const mape = errors.avg() / actual.avg() * 100
    return Math.max(0, 100 - mape)
  }
}
```

## Type Safety

```typescript
interface TypedMetric {
  id: number
  value: number
}

const metrics = collect<TypedMetric>([
  { id: 1, value: 100 },
  { id: 2, value: 200 },
  { id: 3, value: 150 }
])

// Type-safe moving average calculation
const values = metrics.pluck('value')
const ma: Collection<number> = values.movingAverage({ window: 2 })

// TypeScript enforces correct options
// metrics.movingAverage({
//   window: 'invalid'  // ✗ TypeScript error
// })
```

## Return Value

- Returns a new Collection of moving averages
- Length is smaller than original collection
- Only contains numeric values
- Handles edge cases appropriately
- Maintains chronological order
- Can be chained with other methods

## Common Use Cases

### 1. Sales Analysis

- Daily revenue trends
- Order volume patterns
- Seasonal adjustments
- Growth analysis
- Performance smoothing

### 2. Price Analysis

- Price trend smoothing
- Volatility analysis
- Cost averaging
- Market trends
- Competition tracking

### 3. Demand Forecasting

- Trend analysis
- Seasonal patterns
- Growth prediction
- Inventory planning
- Capacity planning

### 4. Performance Metrics

- Response time trends
- Error rate patterns
- Load averaging
- Usage patterns
- Efficiency trends

### 5. Inventory Management

- Stock level trends
- Usage patterns
- Reorder timing
- Demand smoothing
- Supply planning

### 6. Customer Analytics

- Behavior patterns
- Engagement trends
- Value averaging
- Activity smoothing
- Retention analysis

### 7. Marketing Analysis

- Campaign performance
- Conversion trends
- ROI patterns
- Engagement smoothing
- Response analysis

### 8. Financial Analysis

- Cost trends
- Revenue patterns
- Profit smoothing
- Growth analysis
- Budget tracking

### 9. Operational Metrics

- Processing trends
- Efficiency patterns
- Utilization smoothing
- Resource usage
- Capacity analysis

### 10. Quality Control

- Error trends
- Defect patterns
- Performance smoothing
- Process control
- Variation analysis
