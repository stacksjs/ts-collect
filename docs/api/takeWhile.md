# TakeWhile Method

The `takeWhile()` method returns items in the collection as long as the given callback returns true, or until it finds a value that doesn't match the given value. Unlike `takeUntil()`, it continues taking items while the condition remains true.

## Basic Syntax

```typescript
// With callback function
collect(items).takeWhile((item: T) => boolean)

// With value
collect(items).takeWhile(value: T)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Using a callback
const numbers = collect([1, 2, 3, 4, 1, 2, 3])
console.log(numbers.takeWhile(num => num < 4).all())
// [1, 2, 3]

// Using a value comparison
const letters = collect(['a', 'a', 'a', 'b', 'a'])
console.log(letters.takeWhile('a').all())
// ['a', 'a', 'a']
```

### Working with Objects

```typescript
interface Task {
  id: number
  status: 'completed' | 'pending' | 'failed'
  priority: number
}

const tasks = collect<Task>([
  { id: 1, status: 'completed', priority: 1 },
  { id: 2, status: 'completed', priority: 2 },
  { id: 3, status: 'pending', priority: 3 },
  { id: 4, status: 'completed', priority: 4 }
])

// Take while tasks are completed
const completedTasks = tasks.takeWhile(task => task.status === 'completed')
console.log(completedTasks.all())
// [
//   { id: 1, status: 'completed', priority: 1 },
//   { id: 2, status: 'completed', priority: 2 }
// ]
```

### Real-world Examples

#### Time Series Analysis

```typescript
interface DataPoint {
  timestamp: Date
  value: number
  isValid: boolean
}

class TimeSeriesAnalyzer {
  private data: Collection<DataPoint>

  constructor(data: DataPoint[]) {
    this.data = collect(data)
  }

  getValidSequence(): DataPoint[] {
    return this.data
      .takeWhile(point => point.isValid)
      .all()
  }

  getTrendingUp(): DataPoint[] {
    let previousValue = -Infinity
    return this.data
      .takeWhile((point) => {
        const isIncreasing = point.value > previousValue
        previousValue = point.value
        return isIncreasing
      })
      .all()
  }
}
```

#### Quality Control

```typescript
interface ProductBatch {
  id: string
  qualityScore: number
  timestamp: Date
  metadata: Record<string, any>
}

class QualityController {
  private batches: Collection<ProductBatch>
  private threshold: number

  constructor(batches: ProductBatch[], threshold: number = 0.9) {
    this.batches = collect(batches)
    this.threshold = threshold
  }

  getConsistentBatches(): ProductBatch[] {
    return this.batches
      .takeWhile(batch => batch.qualityScore >= this.threshold)
      .all()
  }

  getStablePeriod(): ProductBatch[] {
    let previousScore = null
    const maxVariance = 0.1

    return this.batches
      .takeWhile((batch) => {
        if (previousScore === null) {
          previousScore = batch.qualityScore
          return true
        }
        const variance = Math.abs(batch.qualityScore - previousScore)
        previousScore = batch.qualityScore
        return variance <= maxVariance
      })
      .all()
  }
}
```

### Advanced Usage

#### Financial Data Analysis

```typescript
interface Transaction {
  id: string
  amount: number
  profitLoss: number
  timestamp: Date
}

class ProfitAnalyzer {
  private transactions: Collection<Transaction>

  constructor(transactions: Transaction[]) {
    this.transactions = collect(transactions)
      .sortBy('timestamp')
  }

  getProfitableStreak(): Transaction[] {
    return this.transactions
      .takeWhile(tx => tx.profitLoss > 0)
      .all()
  }

  getGrowingTransactions(): Transaction[] {
    let previousAmount = 0
    return this.transactions
      .takeWhile((tx) => {
        const isGrowing = tx.amount > previousAmount
        previousAmount = tx.amount
        return isGrowing
      })
      .all()
  }
}
```

#### Log Analyzer

```typescript
interface LogEntry {
  level: 'debug' | 'info' | 'warning' | 'error'
  message: string
  timestamp: Date
  context?: Record<string, any>
}

class LogAnalyzer {
  private logs: Collection<LogEntry>

  constructor(logs: LogEntry[]) {
    this.logs = collect(logs)
  }

  getNormalOperations(): LogEntry[] {
    return this.logs
      .takeWhile(log => log.level !== 'error')
      .all()
  }

  getQuietPeriod(maxLevel: 'debug' | 'info' = 'info'): LogEntry[] {
    const levels = {
      debug: 0,
      info: 1,
      warning: 2,
      error: 3
    }

    return this.logs
      .takeWhile(log => levels[log.level] <= levels[maxLevel])
      .all()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  status: 'active' | 'inactive'
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, value: 'one', status: 'active' },
  { id: 2, value: 'two', status: 'active' },
  { id: 3, value: 'three', status: 'inactive' },
  { id: 4, value: 'four', status: 'active' }
])

// Type-safe callback
const activeItems = items.takeWhile((item: TypedItem) => {
  return item.status === 'active' // TypeScript validates status values
})

// Using with comparison value
const matchingItems = items.takeWhile({
  id: 1,
  value: 'one',
  status: 'active'
})
```

## Return Value

- Returns a new Collection containing items while the condition is true
- Original collection remains unchanged
- When using a callback:
  - Takes items while callback returns true
  - Stops at the first false return
- When using a value:
  - Takes items while they match the value
  - Stops at the first non-matching item
- Maintains type safety with TypeScript
