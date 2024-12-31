# Seasonality Method

The `seasonality()` method analyzes periodic patterns in time series data, grouping and averaging values by time period to identify recurring patterns.

## Basic Syntax

```typescript
seasonality(options: TimeSeriesOptions): Map<string, number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const sales = collect([
  { date: '2024-01-01', sales: 100 },
  { date: '2024-02-01', sales: 120 },
  { date: '2024-03-01', sales: 150 }
])

const pattern = sales.seasonality({
  dateField: 'date',
  valueField: 'sales',
  interval: 'month'
})

// Returns Map with average values per month
// Map(3) {
//   '0' => 100,  // January
//   '1' => 120,  // February
//   '2' => 150   // March
// }
```

### Real-world Example: E-commerce Pattern Analysis

```typescript
interface SaleData {
  date: string
  revenue: number
  orders: number
}

class SeasonalityAnalyzer {
  private data: Collection<SaleData>

  constructor(data: SaleData[]) {
    this.data = collect(data)
  }

  analyzePatterns() {
    const revenuePattern = this.data.seasonality({
      dateField: 'date',
      valueField: 'revenue',
      interval: 'month'
    })

    const orderPattern = this.data.seasonality({
      dateField: 'date',
      valueField: 'orders',
      interval: 'month'
    })

    return {
      revenue: this.interpretPattern(revenuePattern),
      orders: this.interpretPattern(orderPattern),
      peakMonths: this.findPeakPeriods(revenuePattern)
    }
  }

  analyzeWeeklyPatterns() {
    return this.data.seasonality({
      dateField: 'date',
      valueField: 'revenue',
      interval: 'week'
    })
  }

  private interpretPattern(pattern: Map<string, number>) {
    const values = Array.from(pattern.values())
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = Math.sqrt(
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    )

    return {
      mean,
      variance,
      seasonalityStrength: variance / mean,
      pattern: Array.from(pattern.entries())
        .map(([period, value]) => ({
          period,
          value,
          deviation: (value - mean) / mean
        }))
    }
  }

  private findPeakPeriods(pattern: Map<string, number>) {
    const threshold = Array.from(pattern.values())
      .reduce((a, b) => a + b, 0) / pattern.size * 1.2

    return Array.from(pattern.entries())
      .filter(([_, value]) => value > threshold)
      .map(([period]) => period)
  }
}

// Usage
const analyzer = new SeasonalityAnalyzer([
  { date: '2024-01-01', revenue: 1000, orders: 100 },
  { date: '2024-02-01', revenue: 1200, orders: 120 },
  { date: '2024-03-01', revenue: 900, orders: 90 }
])

const patterns = analyzer.analyzePatterns()
const weeklyPattern = analyzer.analyzeWeeklyPatterns()
```

## Parameters (TimeSeriesOptions)

```typescript
interface TimeSeriesOptions {
  dateField: string    // Field containing date values
  valueField: string   // Field containing numeric values
  interval: 'day' | 'week' | 'month' | 'year'  // Grouping interval
}
```

## Return Value

- Returns Map where:
  - Keys: Time period identifiers (0-6 for days, 0-11 for months)
  - Values: Average values for each period
- Handles missing periods
- Groups by specified interval
- Normalizes time periods
- Maintains numeric precision

## Common Use Cases

### 1. Sales Analysis

- Monthly patterns
- Weekly cycles
- Yearly trends
- Peak periods
- Low seasons

### 2. Resource Planning

- Capacity planning
- Staff scheduling
- Inventory management
- Budget allocation
- Maintenance timing

### 3. Marketing Optimization

- Campaign timing
- Ad scheduling
- Content planning
- Email timing
- Promotion periods

### 4. Operations Management

- Workload distribution
- Resource allocation
- Service scheduling
- Supply planning
- Maintenance windows

### 5. Demand Forecasting

- Seasonal demand
- Usage patterns
- Order cycles
- Traffic patterns
- Activity peaks
