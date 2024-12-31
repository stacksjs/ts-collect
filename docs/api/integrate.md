# Integrate Method

The `integrate()` method performs numerical integration by calculating the cumulative sum of values in the collection. It starts with 0 and adds each successive value to compute running totals.

## Basic Syntax

```typescript
integrate(): CollectionOperations<number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const values = collect([1, 2, 3, 4])
const integral = values.integrate()

console.log(integral.all())
// [0, 1, 3, 6, 10]
// Each value represents cumulative sum up to that point
```

### Working with Rate Data

```typescript
// Revenue growth rates
const growthRates = collect([0.05, 0.03, 0.04, 0.06])
const cumulativeGrowth = growthRates.integrate()

console.log(cumulativeGrowth.all())
// [0, 0.05, 0.08, 0.12, 0.18]
// Shows total accumulated growth
```

### Real-world Example: E-commerce Revenue Analysis

```typescript
interface RevenueData {
  date: Date
  dailyRevenue: number
}

class RevenueAnalyzer {
  private revenues: Collection<number>

  constructor(data: RevenueData[]) {
    this.revenues = collect(data.map(d => d.dailyRevenue))
  }

  analyzeCumulativeRevenue() {
    const cumulative = this.revenues.integrate()

    return {
      daily: this.revenues.all(),
      cumulative: cumulative.all(),
      metrics: this.calculateMetrics(cumulative)
    }
  }

  findBreakEvenPoint(initialCost: number) {
    const cumulative = this.revenues.integrate()

    const breakEvenDay = cumulative.findIndex(total => total >= initialCost)

    return {
      day: breakEvenDay >= 0 ? breakEvenDay : null,
      projectedDays: this.projectBreakEven(cumulative, initialCost),
      revenueRequired: initialCost - (cumulative.last() || 0)
    }
  }

  analyzeGrowthRate() {
    const cumulative = this.revenues.integrate()

    return cumulative
      .map((total, index, arr) => ({
        day: index,
        total,
        growthRate: index > 0 ? (total - arr[index - 1]) / arr[index - 1] : 0
      }))
      .filter(day => day.day > 0)  // Remove first day
  }

  private calculateMetrics(cumulative: Collection<number>) {
    return {
      totalRevenue: cumulative.last() || 0,
      averageDaily: this.revenues.avg(),
      projectedMonthly: (cumulative.last() || 0) * (30 / this.revenues.count()),
      growthRate: (
        (cumulative.last() || 0) / (cumulative.first() || 1) - 1
      ) * 100
    }
  }

  private projectBreakEven(
    cumulative: Collection<number>,
    target: number
  ): number | null {
    const currentTotal = cumulative.last() || 0
    if (currentTotal === 0) return null

    const dailyAverage = currentTotal / cumulative.count()
    const remaining = target - currentTotal

    return Math.ceil(remaining / dailyAverage)
  }
}

// Usage
const analyzer = new RevenueAnalyzer([
  { date: new Date('2024-01-01'), dailyRevenue: 1000 },
  { date: new Date('2024-01-02'), dailyRevenue: 1500 },
  { date: new Date('2024-01-03'), dailyRevenue: 1200 }
])

const analysis = analyzer.analyzeCumulativeRevenue()
const breakEven = analyzer.findBreakEvenPoint(5000)
const growthRates = analyzer.analyzeGrowthRate()
```

## Type Safety

```typescript
// Only works with number collections
const numbers = collect([1, 2, 3])
const result = numbers.integrate() // ✓ Valid

// Won't work with non-number collections
const strings = collect(['a', 'b'])
// strings.integrate() // ✗ TypeScript error

// Type-safe return value
const integrated: CollectionOperations<number> = numbers.integrate()
```

## Return Value

- Returns Collection of cumulative sums
- First value is always 0
- Length is input length + 1
- Each value is sum of previous values
- Maintains numeric precision
- Empty input returns [0]

## Common Use Cases

### 1. Financial Analysis

- Cumulative revenue
- Total earnings
- Running balances
- Growth tracking
- Budget analysis

### 2. Performance Metrics

- Cumulative growth
- Total performance
- Running totals
- Progress tracking
- Goal achievement

### 3. Sales Analysis

- Total sales
- Revenue growth
- Sales accumulation
- Target tracking
- Performance totals

### 4. Resource Tracking

- Resource usage
- Consumption totals
- Capacity planning
- Usage patterns
- Allocation tracking

### 5. Time Series

- Cumulative changes
- Total growth
- Running sums
- Trend analysis
- Pattern recognition
