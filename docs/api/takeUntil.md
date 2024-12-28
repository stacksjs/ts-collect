# TakeUntil Method

The `takeUntil()` method returns items in the collection until the given callback returns true, or until it finds the given value. This method can be useful for getting a portion of an array until a specific condition is met.

## Basic Syntax

```typescript
// With callback function
collect(items).takeUntil((item: T) => boolean)

// With value
collect(items).takeUntil(value: T)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Using a callback
const numbers = collect([1, 2, 3, 4, 5, 2, 1])
console.log(numbers.takeUntil(num => num > 3).all())
// [1, 2, 3]

// Using a value
const words = collect(['apple', 'banana', 'cherry', 'date'])
console.log(words.takeUntil('cherry').all())
// ['apple', 'banana']
```

### Working with Objects

```typescript
interface Task {
  id: number
  status: 'pending' | 'in_progress' | 'completed'
  priority: number
}

const tasks = collect<Task>([
  { id: 1, status: 'completed', priority: 1 },
  { id: 2, status: 'pending', priority: 2 },
  { id: 3, status: 'in_progress', priority: 3 },
  { id: 4, status: 'completed', priority: 4 }
])

// Take until we find a pending task
const completedTasks = tasks.takeUntil(task => task.status === 'pending')
console.log(completedTasks.all())
// [
//   { id: 1, status: 'completed', priority: 1 }
// ]
```

### Real-world Examples

#### Log Analysis

```typescript
interface LogEntry {
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  message: string
  metadata?: Record<string, any>
}

class LogAnalyzer {
  private logs: Collection<LogEntry>

  constructor(logs: LogEntry[]) {
    this.logs = collect(logs)
  }

  getLogsUntilError(): LogEntry[] {
    return this.logs
      .takeUntil(log => log.level === 'error')
      .all()
  }

  getLogsUntilDate(date: Date): LogEntry[] {
    return this.logs
      .takeUntil(log => log.timestamp >= date)
      .all()
  }
}

// Usage
const analyzer = new LogAnalyzer([
  { timestamp: new Date('2024-01-01'), level: 'info', message: 'Started' },
  { timestamp: new Date('2024-01-02'), level: 'warning', message: 'Warning' },
  { timestamp: new Date('2024-01-03'), level: 'error', message: 'Error found' },
  { timestamp: new Date('2024-01-04'), level: 'info', message: 'Recovered' }
])
```

#### Transaction Processing

```typescript
interface Transaction {
  id: string
  amount: number
  status: 'pending' | 'processed' | 'failed'
  date: Date
}

class TransactionProcessor {
  private transactions: Collection<Transaction>

  constructor(transactions: Transaction[]) {
    this.transactions = collect(transactions)
      .sortBy('date')
  }

  getValidTransactionsUntilFailure(): Transaction[] {
    return this.transactions
      .takeUntil(tx => tx.status === 'failed')
      .all()
  }

  getTransactionsUntilAmount(threshold: number): Transaction[] {
    let total = 0
    return this.transactions
      .takeUntil((tx) => {
        total += tx.amount
        return total > threshold
      })
      .all()
  }
}
```

### Advanced Usage

#### Data Stream Processing

```typescript
interface DataPoint {
  timestamp: Date
  value: number
  quality: number
}

class DataStreamProcessor {
  private dataPoints: Collection<DataPoint>
  private qualityThreshold: number

  constructor(data: DataPoint[], threshold: number = 0.8) {
    this.dataPoints = collect(data)
    this.qualityThreshold = threshold
  }

  getValidDataPoints(): DataPoint[] {
    return this.dataPoints
      .takeUntil(point => point.quality < this.qualityThreshold)
      .all()
  }

  getDataUntilAnomaly(tolerance: number): DataPoint[] {
    let previousValue: number | null = null
    return this.dataPoints
      .takeUntil((point) => {
        if (previousValue === null) {
          previousValue = point.value
          return false
        }
        const change = Math.abs(point.value - previousValue)
        previousValue = point.value
        return change > tolerance
      })
      .all()
  }
}
```

#### Document Parser

```typescript
interface DocumentSection {
  id: string
  type: 'header' | 'content' | 'footer'
  text: string
}

class DocumentParser {
  private sections: Collection<DocumentSection>

  constructor(sections: DocumentSection[]) {
    this.sections = collect(sections)
  }

  getContentUntilFooter(): DocumentSection[] {
    return this.sections
      .takeUntil(section => section.type === 'footer')
      .all()
  }

  takeUntilEmptySection(): DocumentSection[] {
    return this.sections
      .takeUntil(section => section.text.trim() === '')
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
  { id: 2, value: 'two', status: 'inactive' },
  { id: 3, value: 'three', status: 'active' }
])

// Type-safe callback
const activeItems = items.takeUntil((item: TypedItem) => {
  return item.status === 'inactive' // TypeScript validates status values
})

// Type-safe value match
const untilTwo = items.takeUntil({
  id: 2,
  value: 'two',
  status: 'inactive'
})
```

## Return Value

- Returns a new Collection containing items until the condition is met
- Original collection remains unchanged
- When using a callback:
  - Takes items until callback returns true
  - Excludes the item that matched the condition
- When using a value:
  - Takes items until finding the matching value
  - Excludes the matching value
- Maintains type safety with TypeScript
