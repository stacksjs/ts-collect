# Scan Method

The `scan()` method performs a running accumulation over the collection, returning a new collection containing all intermediate results. Similar to `reduce`, but preserves all steps of the accumulation process.

## Basic Syntax

```typescript
scan<U>(callback: (acc: U, item: T) => U, initial: U): CollectionOperations<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4])
const runningSum = numbers.scan((acc, num) => acc + num, 0)

console.log(runningSum.all())
// [1, 3, 6, 10]
// Shows cumulative sum at each step
```

### Working with Complex Values

```typescript
interface Transaction {
  amount: number
  type: 'credit' | 'debit'
}

const transactions = collect<Transaction>([
  { amount: 100, type: 'credit' },
  { amount: 50, type: 'debit' },
  { amount: 75, type: 'credit' }
])

const balanceHistory = transactions.scan((balance, tx) => {
  return tx.type === 'credit'
    ? balance + tx.amount
    : balance - tx.amount
}, 0)

console.log(balanceHistory.all())
// [100, 50, 125]
```

### Real-world Example: E-commerce Order Processing

```typescript
interface Order {
  orderId: string
  amount: number
  items: number
  timestamp: Date
}

class OrderAnalyzer {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getRunningMetrics() {
    return this.orders
      .sortBy('timestamp')
      .scan((metrics, order) => ({
        totalOrders: metrics.totalOrders + 1,
        totalRevenue: metrics.totalRevenue + order.amount,
        totalItems: metrics.totalItems + order.items,
        averageOrderValue: (metrics.totalRevenue + order.amount) / (metrics.totalOrders + 1),
        averageItemsPerOrder: (metrics.totalItems + order.items) / (metrics.totalOrders + 1)
      }), {
        totalOrders: 0,
        totalRevenue: 0,
        totalItems: 0,
        averageOrderValue: 0,
        averageItemsPerOrder: 0
      })
  }

  getRevenueCheckpoints(): Collection<{
    checkpoint: number
    ordersNeeded: number
    timestamp: Date
  }> {
    const target = 10000 // $10,000 checkpoints

    return this.orders
      .sortBy('timestamp')
      .scan((acc, order) => ({
        total: acc.total + order.amount,
        ordersProcessed: acc.ordersProcessed + 1,
        latestTimestamp: order.timestamp
      }), {
        total: 0,
        ordersProcessed: 0,
        latestTimestamp: new Date()
      })
      .map(state => ({
        checkpoint: Math.floor(state.total / target) * target,
        ordersNeeded: state.ordersProcessed,
        timestamp: state.latestTimestamp
      }))
  }
}

// Usage
const analyzer = new OrderAnalyzer([
  {
    orderId: 'ORD1',
    amount: 100,
    items: 2,
    timestamp: new Date('2024-01-01')
  },
  {
    orderId: 'ORD2',
    amount: 200,
    items: 3,
    timestamp: new Date('2024-01-02')
  }
])

const metrics = analyzer.getRunningMetrics()
```

## Type Safety

```typescript
interface Metrics {
  count: number
  total: number
}

const data = collect([10, 20, 30])

// Type-safe accumulation
const runningMetrics: CollectionOperations<Metrics> = data.scan(
  (acc, value) => ({
    count: acc.count + 1,
    total: acc.total + value
  }),
  { count: 0, total: 0 }
)

// TypeScript enforces accumulator type
const result: Metrics = runningMetrics.last()!
```

## Return Value

- Returns a Collection of all intermediate accumulation results
- Each item represents state after processing an element
- Collection length equals input length
- Maintains type safety through generics
- Preserves collection chain methods
- First result includes initial value

## Common Use Cases

### 1. Financial Analysis

- Running balances
- Cumulative totals
- Transaction history
- Revenue tracking
- Budget monitoring

### 2. Progress Tracking

- Completion percentages
- Milestone tracking
- Task progress
- Goal achievement
- Step-by-step status

### 3. Performance Metrics

- Running averages
- Cumulative stats
- Performance history
- Resource usage
- Load tracking

### 4. Time Series

- Running calculations
- Trend analysis
- Sequential processing
- Historical states
- Data accumulation

### 5. Inventory Management

- Stock levels
- Order fulfillment
- Supply tracking
- Usage patterns
- Reorder points
