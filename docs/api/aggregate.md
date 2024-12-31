# Aggregate Method

The `aggregate()` method groups data by a specified key and performs multiple statistical operations on each group. It returns a Map where each key contains a record of the calculated statistics.

## Basic Syntax

```typescript
aggregate<K extends keyof T>(
  key: K,
  operations: Array<'sum' | 'avg' | 'min' | 'max' | 'count'>
): Map<T[K], Record<string, number>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const orders = collect([
  { category: 'Electronics', amount: 1000 },
  { category: 'Electronics', amount: 2000 },
  { category: 'Books', amount: 50 }
])

const stats = orders.aggregate('category', ['sum', 'avg', 'count'])
console.log([...stats.entries()])
// [
//   ['Electronics', { sum: 3000, avg: 1500, count: 2 }],
//   ['Books', { sum: 50, avg: 50, count: 1 }]
// ]
```

### Working with Multiple Metrics

```typescript
interface SalesData {
  region: string
  revenue: number
  units: number
  returns: number
}

const sales = collect<SalesData>([
  { region: 'North', revenue: 10000, units: 100, returns: 5 },
  { region: 'North', revenue: 15000, units: 150, returns: 8 },
  { region: 'South', revenue: 12000, units: 120, returns: 3 }
])

const regionalStats = sales.aggregate('region',
  ['sum', 'avg', 'min', 'max', 'count']
)

// Access stats for North region
const northStats = regionalStats.get('North')
// {
//   sum: 25000,    // Total revenue
//   avg: 12500,    // Average revenue
//   min: 10000,    // Minimum revenue
//   max: 15000,    // Maximum revenue
//   count: 2       // Number of orders
// }
```

### Real-world Example: E-commerce Analytics

```typescript
interface OrderMetrics {
  storeId: string
  revenue: number
  orderCount: number
  itemCount: number
  shippingCost: number
  returnRate: number
}

class StoreAnalytics {
  private metrics: Collection<OrderMetrics>

  constructor(metrics: OrderMetrics[]) {
    this.metrics = collect(metrics)
  }

  generateStoreReport() {
    const storeStats = this.metrics.aggregate('storeId', [
      'sum',     // Total values
      'avg',     // Averages
      'min',     // Minimum values
      'max',     // Maximum values
      'count'    // Number of records
    ])

    return Array.from(storeStats.entries()).map(([storeId, stats]) => ({
      storeId,
      totalRevenue: stats.sum,
      averageOrderValue: stats.avg,
      lowestRevenue: stats.min,
      highestRevenue: stats.max,
      totalOrders: stats.count,
      performance: this.calculatePerformanceGrade(stats)
    }))
  }

  getTopPerformers() {
    const stats = this.metrics.aggregate('storeId', ['sum', 'avg'])

    return Array.from(stats.entries())
      .map(([storeId, metrics]) => ({
        storeId,
        totalRevenue: metrics.sum,
        averageOrder: metrics.avg
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
  }

  private calculatePerformanceGrade(stats: Record<string, number>): string {
    const avgRevenue = stats.avg
    if (avgRevenue > 10000) return 'A'
    if (avgRevenue > 5000) return 'B'
    if (avgRevenue > 1000) return 'C'
    return 'D'
  }
}

// Usage
const analytics = new StoreAnalytics([
  {
    storeId: 'STORE1',
    revenue: 15000,
    orderCount: 150,
    itemCount: 300,
    shippingCost: 750,
    returnRate: 0.02
  },
  {
    storeId: 'STORE1',
    revenue: 12000,
    orderCount: 120,
    itemCount: 240,
    shippingCost: 600,
    returnRate: 0.03
  }
])

const report = analytics.generateStoreReport()
```

## Type Safety

```typescript
interface Metrics {
  category: string
  value: number
  priority: string  // non-numeric field
}

const data = collect<Metrics>([
  { category: 'A', value: 100, priority: 'high' },
  { category: 'A', value: 200, priority: 'low' }
])

// Type-safe aggregation
const results = data.aggregate('category', ['sum', 'avg'])

// TypeScript ensures numeric operations
// data.aggregate('priority', ['sum']) // ✗ TypeScript error - can't sum strings
```

## Return Value

- Returns a Map where:
  - Keys are group values
  - Values are records of operation results
- Each operation produces a number
- Results are keyed by operation name
- Missing values handled gracefully
- Maintains type safety
- Non-numeric fields trigger errors

## Common Use Cases

### 1. Sales Analysis

- Revenue metrics
- Order statistics
- Product performance
- Store comparisons
- Time-based metrics

### 2. Inventory Management

- Stock levels
- Movement analysis
- Location metrics
- Category statistics
- Reorder analysis

### 3. Customer Metrics

- Purchase behavior
- Value analysis
- Segment metrics
- Retention stats
- Activity measures

### 4. Performance Analysis

- Store performance
- Employee metrics
- Department stats
- Goal tracking
- Efficiency measures

### 5. Financial Reporting

- Revenue reports
- Cost analysis
- Profit metrics
- Budget tracking
- Expense summaries
