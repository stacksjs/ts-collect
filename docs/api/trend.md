# Trend Method

Calculates linear trend components for time series data, providing slope and intercept values to understand directional movement.

## Basic Syntax

```typescript
trend(options: TimeSeriesOptions): { slope: number, intercept: number }
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 120 },
  { date: '2024-01-03', value: 115 }
])

const trend = data.trend({
  dateField: 'date',
  valueField: 'value'
})

console.log(trend)
// { slope: 7.5, intercept: 101.67 }
```

### Real-world Example: Sales Analysis

```typescript
interface SalesData {
  date: string
  revenue: number
  units: number
}

class TrendAnalyzer {
  private sales: Collection<SalesData>

  constructor(sales: SalesData[]) {
    this.sales = collect(sales)
  }

  analyzeTrends() {
    const revenueTrend = this.sales.trend({
      dateField: 'date',
      valueField: 'revenue',
      interval: 'day'
    })

    const unitsTrend = this.sales.trend({
      dateField: 'date',
      valueField: 'units',
      interval: 'day'
    })

    return {
      revenue: {
        trend: revenueTrend.slope > 0 ? 'increasing' : 'decreasing',
        dailyChange: revenueTrend.slope,
        baseline: revenueTrend.intercept
      },
      units: {
        trend: unitsTrend.slope > 0 ? 'increasing' : 'decreasing',
        dailyChange: unitsTrend.slope,
        baseline: unitsTrend.intercept
      },
      correlation: this.calculateTrendCorrelation(revenueTrend, unitsTrend)
    }
  }

  projectRevenue(daysAhead: number) {
    const { slope, intercept } = this.sales.trend({
      dateField: 'date',
      valueField: 'revenue'
    })

    const currentDays = this.sales.count()
    return Array.from({ length: daysAhead }, (_, i) => ({
      day: currentDays + i + 1,
      projectedRevenue: slope * (currentDays + i) + intercept
    }))
  }

  private calculateTrendCorrelation(
    trend1: { slope: number },
    trend2: { slope: number }
  ): string {
    if (Math.sign(trend1.slope) === Math.sign(trend2.slope)) {
      return 'aligned'
    }
    return 'divergent'
  }
}

// Usage
const analyzer = new TrendAnalyzer([
  { date: '2024-01-01', revenue: 1000, units: 100 },
  { date: '2024-01-02', revenue: 1200, units: 110 },
  { date: '2024-01-03', revenue: 1100, units: 105 }
])

const trends = analyzer.analyzeTrends()
const projection = analyzer.projectRevenue(7) // Next week projection
```

## Type Safety

```typescript
interface TimeSeriesData {
  timestamp: string
  value: number
}

const data = collect<TimeSeriesData>([
  { timestamp: '2024-01-01', value: 100 },
  { timestamp: '2024-01-02', value: 110 }
])

// Type-safe trend analysis
const trend = data.trend({
  dateField: 'timestamp',
  valueField: 'value'
})

// TypeScript enforces correct field names
// data.trend({
//   dateField: 'invalid',  // ✗ TypeScript error
//   valueField: 'value'
// })
```

## Return Value

- Returns object with:
  - `slope`: Rate of change per unit time
  - `intercept`: Baseline value (y-intercept)
- Units match input data
- Handles irregular intervals
- Accounts for missing data
- Time-aware calculations

## Common Use Cases

### 1. Financial Analysis

- Revenue trends
- Growth rates
- Cost analysis
- Budget projections
- Performance tracking

### 2. Sales Forecasting

- Future projections
- Seasonal adjustments
- Growth analysis
- Market trends
- Demand forecasting

### 3. Performance Metrics

- KPI trends
- Efficiency analysis
- Resource utilization
- Capacity planning
- Optimization tracking

### 4. Market Analysis

- Price trends
- Volume analysis
- Market direction
- Competition tracking
- Share analysis

### 5. Inventory Management

- Stock trends
- Demand patterns
- Reorder timing
- Usage rates
- Level optimization
