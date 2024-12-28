# SkipWhile Method

The `skipWhile()` method skips items in the collection while the given callback returns true and returns the remaining items. Unlike `skipUntil()`, it stops skipping when the condition becomes false.

## Basic Syntax

```typescript
collect(items).skipWhile((item: T) => boolean)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Skip while numbers are less than 3
const numbers = collect([1, 2, 3, 4, 2, 1])
console.log(numbers.skipWhile(num => num < 3).all())
// [3, 4, 2, 1]

// Skip while strings start with 'a'
const words = collect(['apple', 'apricot', 'banana', 'apple', 'cherry'])
console.log(words.skipWhile(word => word.startsWith('a')).all())
// ['banana', 'apple', 'cherry']
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

// Skip while tasks are completed
const incompleteTasks = tasks.skipWhile(task => task.status === 'completed')
console.log(incompleteTasks.all())
// [
//   { id: 3, status: 'pending', priority: 3 },
//   { id: 4, status: 'completed', priority: 4 }
// ]
```

### Real-world Examples

#### Log Analysis

```typescript
interface LogEntry {
  timestamp: Date
  level: 'debug' | 'info' | 'warning' | 'error'
  message: string
  metadata?: Record<string, any>
}

class LogAnalyzer {
  private logs: Collection<LogEntry>

  constructor(logs: LogEntry[]) {
    this.logs = collect(logs)
  }

  getLogsAfterDebug(): LogEntry[] {
    // Skip while logs are debug level
    return this.logs
      .skipWhile(log => log.level === 'debug')
      .all()
  }

  getLogsAfterQuietPeriod(threshold: number): LogEntry[] {
    let lastTimestamp: Date | null = null

    return this.logs
      .skipWhile((log) => {
        if (!lastTimestamp) {
          lastTimestamp = log.timestamp
          return true
        }

        const timeDiff = log.timestamp.getTime() - lastTimestamp.getTime()
        lastTimestamp = log.timestamp
        return timeDiff < threshold
      })
      .all()
  }
}
```

#### Transaction Processing

```typescript
interface Transaction {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  timestamp: Date
  retryCount: number
}

class TransactionProcessor {
  private transactions: Collection<Transaction>

  constructor(transactions: Transaction[]) {
    this.transactions = collect(transactions)
  }

  getTransactionsAfterFailures() {
    return this.transactions
      .skipWhile(tx => tx.status === 'failed')
      .map(tx => this.processTransaction(tx))
      .all()
  }

  getTransactionsAfterRetries() {
    return this.transactions
      .skipWhile(tx => tx.retryCount > 0)
      .all()
  }

  private processTransaction(tx: Transaction): Transaction {
    // Processing logic...
    return {
      ...tx,
      status: 'processing'
    }
  }
}
```

### Advanced Usage

#### Data Stream Processing

```typescript
interface DataPacket {
  sequence: number
  payload: string
  corrupted: boolean
  metadata: {
    timestamp: Date
    source: string
  }
}

class StreamProcessor {
  private packets: Collection<DataPacket>

  constructor(packets: DataPacket[]) {
    this.packets = collect(packets)
  }

  processAfterCorruption() {
    return this.packets
      .skipWhile(packet => packet.corrupted)
      .map(this.processPacket)
      .all()
  }

  processAfterSource(source: string) {
    return this.packets
      .skipWhile(packet => packet.metadata.source === source)
      .map(this.processPacket)
      .all()
  }

  private processPacket(packet: DataPacket) {
    return {
      ...packet,
      processed: true,
      payload: packet.payload.toUpperCase()
    }
  }
}
```

#### Time Series Analysis

```typescript
interface TimeSeriesData {
  timestamp: Date
  value: number
  confidence: number
}

class TimeSeriesAnalyzer {
  private data: Collection<TimeSeriesData>

  constructor(data: TimeSeriesData[]) {
    this.data = collect(data)
  }

  getDataAfterStability(confidenceThreshold: number) {
    return this.data
      .skipWhile(point => point.confidence < confidenceThreshold)
      .all()
  }

  getDataAfterThreshold(valueThreshold: number) {
    let consecutive = 0
    const requiredCount = 3

    return this.data
      .skipWhile((point) => {
        if (point.value > valueThreshold) {
          consecutive++
        }
        else {
          consecutive = 0
        }
        return consecutive < requiredCount
      })
      .all()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: number
  status: 'active' | 'inactive'
  metadata?: {
    tags: string[]
    priority: number
  }
}

const items = collect<TypedItem>([
  { id: 1, value: 10, status: 'inactive' },
  { id: 2, value: 20, status: 'inactive' },
  { id: 3, value: 30, status: 'active' },
  { id: 4, value: 40, status: 'active' }
])

// Type-safe callback
const activeItems = items.skipWhile((item: TypedItem) => {
  return item.status === 'inactive' // TypeScript validates status values
})

// Complex type-safe conditions
const highPriorityItems = items.skipWhile((item) => {
  return !item.metadata || item.metadata.priority < 5
})
```

## Return Value

- Returns a new Collection instance containing items after the condition becomes false
- Returns empty collection if condition never becomes false
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
