# Forecast Method

The `forecast()` method projects future values based on historical patterns in the collection using trend analysis.

## Basic Syntax

```typescript
forecast(periods: number): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const sales = collect([
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 110 },
  { month: 'Mar', value: 120 }
])

const nextMonths = sales.forecast(2)
console.log(nextMonths.all())
// [
//   { month: 'Apr', value: 130 },
//   { month: 'May', value: 140 }
// ]
```

### Real-world Example: E-commerce Forecasting

```typescript
interface SalesData {
  date: Date
  revenue: number
  orders: number
}

class SalesForecast {
  private data: Collection<SalesData>

  constructor(data: SalesData[]) {
    this.data = collect(data)
  }

  generateForecast(months: number) {
    const forecast = this.data.forecast(months)

    return {
      projections: forecast.all(),
      confidence: this.calculateConfidence(forecast),
      summary: this.summarizeForecast(forecast)
    }
  }

  private calculateConfidence(forecast: CollectionOperations<SalesData>): number {
    const historicalVariance = this.data
      .map((record, i, arr) =>
        i > 0 ? Math.abs(record.revenue - arr[i-1].revenue) : 0
      )
      .avg()

    const forecastVariance = forecast
      .map((record, i, arr) =>
        i > 0 ? Math.abs(record.revenue - arr[i-1].revenue) : 0
      )
      .avg()

    return Math.max(0, 1 - (forecastVariance / historicalVariance))
  }

  private summarizeForecast(forecast: CollectionOperations<SalesData>) {
    const totalRevenue = forecast.sum('revenue')
    const totalOrders = forecast.sum('orders')

    return {
      projectedRevenue: totalRevenue,
      projectedOrders: totalOrders,
      averageOrderValue: totalRevenue / totalOrders,
      growthRate: this.calculateGrowthRate(forecast)
    }
  }

  private calculateGrowthRate(forecast: CollectionOperations<SalesData>): number {
    const first = forecast.first()?.revenue || 0
    const last = forecast.last()?.revenue || 0
    return (last - first) / first
  }
}

// Usage
const forecaster = new SalesForecast([
  {
    date: new Date('2024-01-01'),
    revenue: 10000,
    orders: 100
  },
  {
    date: new Date('2024-02-01'),
    revenue: 12000,
    orders: 120
  }
])

const nextQuarter = forecaster.generateForecast(3)
```

## Type Safety

```typescript
interface TimeSeriesData {
  period: string
  value: number
}

const data = collect<TimeSeriesData>([
  { period: '2024-01', value: 100 }
])

// Type-safe forecasting
const forecast: CollectionOperations<TimeSeriesData> = data.forecast(3)

// Type checking ensures consistent data structure
type ForecastItem = typeof forecast.first()
// TimeSeriesData
```

## Return Value

- Returns Collection of projected values
- Maintains original data structure
- Projects specified number of periods
- Uses trend-based forecasting
- Preserves field relationships
- Type-safe projections

## Common Use Cases

### 1. Sales Forecasting

- Revenue projections
- Order predictions
- Growth planning
- Budget forecasting
- Target setting

### 2. Inventory Planning

- Stock predictions
- Reorder planning
- Demand forecasting
- Supply optimization
- Capacity planning

### 3. Business Planning

- Growth projections
- Resource planning
- Budget allocation
- Strategy planning
- Goal setting

### 4. Performance Forecasting

- KPI projections
- Target planning
- Capacity forecasting
- Resource allocation
- Growth modeling

### 5. Market Analysis

- Trend projections
- Market forecasting
- Competition analysis
- Share predictions
- Growth modeling
