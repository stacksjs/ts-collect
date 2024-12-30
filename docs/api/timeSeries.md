# timeSeries Method

The `timeSeries()` method transforms a collection into a series of time-based data points, optionally filling gaps in the timeline. This is particularly useful for analyzing trends, patterns, and changes over time.

## Basic Syntax

```typescript
collect(items).timeSeries({
  dateField: keyof T,       // Field containing dates
  valueField: keyof T,      // Field containing values
  interval?: 'day' | 'week' | 'month' = 'day',  // Time interval
  fillGaps?: boolean = true  // Whether to fill missing intervals
}): Collection<TimeSeriesPoint>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple daily sales data
const sales = collect([
  { date: '2024-01-01', amount: 100 },
  { date: '2024-01-03', amount: 300 },
  { date: '2024-01-05', amount: 200 }
])

// Convert to time series with gap filling
const dailySales = sales.timeSeries({
  dateField: 'date',
  valueField: 'amount'
})
// Results in:
// [
//   { date: '2024-01-01', value: 100 },
//   { date: '2024-01-02', value: 0 },
//   { date: '2024-01-03', value: 300 },
//   { date: '2024-01-04', value: 0 },
//   { date: '2024-01-05', value: 200 }
// ]
```

### Working with Objects

```typescript
interface SalesData {
  transactionDate: Date
  revenue: number
  orders: number
}

const salesData = collect<SalesData>([
  { transactionDate: new Date('2024-01-01'), revenue: 1000, orders: 10 },
  { transactionDate: new Date('2024-01-03'), revenue: 1500, orders: 15 },
  { transactionDate: new Date('2024-01-05'), revenue: 2000, orders: 20 }
])

// Analyze daily revenue
const revenueTimeSeries = salesData.timeSeries({
  dateField: 'transactionDate',
  valueField: 'revenue'
})

// Analyze daily orders
const orderTimeSeries = salesData.timeSeries({
  dateField: 'transactionDate',
  valueField: 'orders'
})
```

### Real-world Examples

#### Sales Trend Analyzer

```typescript
interface SaleRecord {
  saleDate: Date
  amount: number
  channel: string
  productCategory: string
}

class SalesTrendAnalyzer {
  constructor(private sales: Collection<SaleRecord>) {}

  analyzeTrends(options: {
    startDate: Date
    endDate: Date
    interval: 'day' | 'week' | 'month'
  }): {
    overall: Collection<TimeSeriesPoint>
    byChannel: Map<string, Collection<TimeSeriesPoint>>
    byCategory: Map<string, Collection<TimeSeriesPoint>>
  } {
    const filteredSales = this.sales.filter(sale =>
      sale.saleDate >= options.startDate &&
      sale.saleDate <= options.endDate
    )

    // Overall trend
    const overallTrend = filteredSales.timeSeries({
      dateField: 'saleDate',
      valueField: 'amount',
      interval: options.interval
    })

    // Trends by channel
    const byChannel = new Map()
    for (const channel of new Set(filteredSales.pluck('channel'))) {
      byChannel.set(
        channel,
        filteredSales
          .where('channel', channel)
          .timeSeries({
            dateField: 'saleDate',
            valueField: 'amount',
            interval: options.interval
          })
      )
    }

    // Trends by category
    const byCategory = new Map()
    for (const category of new Set(filteredSales.pluck('productCategory'))) {
      byCategory.set(
        category,
        filteredSales
          .where('productCategory', category)
          .timeSeries({
            dateField: 'saleDate',
            valueField: 'amount',
            interval: options.interval
          })
      )
    }

    return { overall: overallTrend, byChannel, byCategory }
  }

  calculateGrowthRate(timePoints: Collection<TimeSeriesPoint>): {
    overall: number,
    periodic: Collection<{ date: Date, growth: number }>
  } {
    const values = timePoints.pluck('value')
    const firstValue = values.first() || 0
    const lastValue = values.last() || 0
    const overallGrowth = ((lastValue - firstValue) / firstValue) * 100

    const periodicGrowth = timePoints
      .map((point, index, array) => {
        if (index === 0) return { date: point.date, growth: 0 }
        const previousValue = array[index - 1].value
        const growth = previousValue === 0 ? 0 :
          ((point.value - previousValue) / previousValue) * 100
        return { date: point.date, growth }
      })
      .filter((_, index) => index > 0)

    return {
      overall: overallGrowth,
      periodic: collect(periodicGrowth)
    }
  }
}
```

#### Customer Activity Monitor

```typescript
interface UserActivity {
  userId: string
  activityDate: Date
  action: string
  value: number
}

class ActivityAnalyzer {
  constructor(private activities: Collection<UserActivity>) {}

  analyzeEngagement(
    interval: 'day' | 'week' | 'month' = 'day'
  ): {
    activityTrend: Collection<TimeSeriesPoint>
    valueGenerated: Collection<TimeSeriesPoint>
    peakTimes: Date[]
  } {
    // Activity frequency trend
    const activityTrend = this.activities
      .groupBy('activityDate')
      .map(group => ({
        date: group.first()?.activityDate,
        count: group.count()
      }))
      .timeSeries({
        dateField: 'date',
        valueField: 'count',
        interval: interval,
        fillGaps: true
      })

    // Value generation trend
    const valueTrend = this.activities.timeSeries({
      dateField: 'activityDate',
      valueField: 'value',
      interval: interval,
      fillGaps: true
    })

    // Identify peak activity times
    const averageValue = activityTrend.avg('value')
    const peakTimes = activityTrend
      .filter(point => point.value > averageValue * 1.5)
      .pluck('date')
      .toArray()

    return {
      activityTrend,
      valueGenerated: valueTrend,
      peakTimes
    }
  }
}
```

## Type Safety

```typescript
interface TypedActivity {
  timestamp: Date
  metric: number
}

const activities = collect<TypedActivity>([
  { timestamp: new Date('2024-01-01'), metric: 100 },
  { timestamp: new Date('2024-01-02'), metric: 200 }
])

// Type-safe time series creation
const timeSeries = activities.timeSeries({
  dateField: 'timestamp',
  valueField: 'metric'
})

// TypeScript enforces correct field names
// activities.timeSeries({
//   dateField: 'invalid',  // ✗ TypeScript error
//   valueField: 'metric'
// })
```

## Return Value

Returns a Collection of TimeSeriesPoint objects:

```typescript
interface TimeSeriesPoint {
  date: Date    // Point in time
  value: number // Value at that time
}
```

## Common Use Cases

### 1. Sales Analysis

- Daily revenue trends
- Order volume patterns
- Seasonal variations
- Growth analysis
- Performance tracking

### 2. User Engagement

- Activity patterns
- Usage trends
- Session analysis
- Feature adoption
- Retention tracking

### 3. Inventory Management

- Stock level trends
- Usage patterns
- Reorder timing
- Seasonal demand
- Supply chain analysis

### 4. Performance Metrics

- Response times
- Error rates
- Load patterns
- Resource usage
- System health

### 5. Financial Analysis

- Revenue trends
- Cost patterns
- Profit analysis
- Budget tracking
- Expense monitoring

### 6. Marketing Analytics

- Campaign performance
- Conversion trends
- Engagement patterns
- ROI analysis
- Channel effectiveness

### 7. Customer Behavior

- Purchase patterns
- Visit frequency
- Interaction trends
- Feature usage
- Satisfaction trends

### 8. Operational Metrics

- Processing times
- Queue lengths
- Efficiency trends
- Resource utilization
- Service levels

### 9. Growth Analysis

- User growth
- Revenue growth
- Adoption rates
- Churn patterns
- Expansion metrics

### 10. Content Performance

- View patterns
- Engagement trends
- Rating analysis
- Comment activity
- Share frequency
