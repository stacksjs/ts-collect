# SkipUntil Method

The `skipUntil()` method skips items in the collection until the given callback returns true, and then returns the remaining items. It can also accept a value to compare against.

## Basic Syntax

```typescript
// With callback
collect(items).skipUntil((item: T) => boolean)

// With value
collect(items).skipUntil(value: any)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Using a callback
const numbers = collect([1, 2, 3, 4, 5, 6])
console.log(numbers.skipUntil(num => num > 3).all())
// [4, 5, 6]

// Using a value
const letters = collect(['a', 'b', 'c', 'd', 'e'])
console.log(letters.skipUntil('c').all())
// ['c', 'd', 'e']
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
  { id: 4, status: 'pending', priority: 4 }
])

// Skip until we find an incomplete task
const incompleteTasks = tasks.skipUntil(
  task => task.status !== 'completed'
)
console.log(incompleteTasks.all())
// [
//   { id: 2, status: 'pending', priority: 2 },
//   { id: 3, status: 'in_progress', priority: 3 },
//   { id: 4, status: 'pending', priority: 4 }
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

  getLogsFromFirstError(): LogEntry[] {
    return this.logs
      .skipUntil(log => log.level === 'error')
      .all()
  }

  getLogsFromDate(date: Date): LogEntry[] {
    return this.logs
      .skipUntil(log => log.timestamp >= date)
      .all()
  }
}

// Usage
const analyzer = new LogAnalyzer([
  {
    timestamp: new Date('2024-01-01'),
    level: 'info',
    message: 'System start'
  },
  {
    timestamp: new Date('2024-01-02'),
    level: 'error',
    message: 'System crash'
  },
  {
    timestamp: new Date('2024-01-03'),
    level: 'info',
    message: 'System recovery'
  }
])
```

#### Transaction Processing

```typescript
interface Transaction {
  id: string
  date: Date
  amount: number
  status: 'pending' | 'processed' | 'failed'
  verification?: boolean
}

class TransactionProcessor {
  private transactions: Collection<Transaction>

  constructor(transactions: Transaction[]) {
    this.transactions = collect(transactions)
  }

  processFromFirstVerified() {
    return this.transactions
      .skipUntil(tx => tx.verification === true)
      .map(tx => this.processTransaction(tx))
      .all()
  }

  processFromDate(startDate: Date) {
    return this.transactions
      .skipUntil(tx => tx.date >= startDate)
      .map(tx => this.processTransaction(tx))
      .all()
  }

  private processTransaction(tx: Transaction): Transaction {
    // Processing logic...
    return {
      ...tx,
      status: 'processed'
    }
  }
}
```

### Advanced Usage

#### Event Stream Processing

```typescript
interface Event {
  id: string
  type: string
  timestamp: Date
  priority: number
  data: any
}

class EventStreamProcessor {
  private events: Collection<Event>
  private processingStartTime: Date

  constructor(events: Event[]) {
    this.events = collect(events)
    this.processingStartTime = new Date()
  }

  processFromPriority(minPriority: number) {
    return this.events
      .skipUntil(event => event.priority >= minPriority)
      .map(this.processEvent)
      .all()
  }

  processFromTimestamp(timestamp: Date) {
    return this.events
      .skipUntil(event => event.timestamp >= timestamp)
      .map(this.processEvent)
      .all()
  }

  private processEvent(event: Event) {
    // Event processing logic...
    return {
      ...event,
      processed: true,
      processedAt: new Date()
    }
  }
}
```

#### Data Stream Parser

```typescript
interface DataPacket {
  sequence: number
  type: string
  content: string
  valid: boolean
}

class DataStreamParser {
  private packets: Collection<DataPacket>
  private readonly startSequence: number

  constructor(packets: DataPacket[], startSequence: number = 0) {
    this.packets = collect(packets)
    this.startSequence = startSequence
  }

  parseFromSequence() {
    return this.packets
      .skipUntil(packet => packet.sequence >= this.startSequence)
      .filter(packet => packet.valid)
      .map(this.parsePacket)
      .all()
  }

  parseFromValidPacket() {
    return this.packets
      .skipUntil(packet => packet.valid)
      .map(this.parsePacket)
      .all()
  }

  private parsePacket(packet: DataPacket) {
    // Parsing logic...
    return {
      ...packet,
      parsed: true,
      content: packet.content.toUpperCase()
    }
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
  { id: 1, value: 'one', status: 'inactive' },
  { id: 2, value: 'two', status: 'active' },
  { id: 3, value: 'three', status: 'active' }
])

// Type-safe callback
const activeItems = items.skipUntil((item: TypedItem) => {
  return item.status === 'active' // TypeScript validates status values
})

// Using with value
const fromTwo = items.skipUntil({ id: 2, value: 'two', status: 'active' })
```

## Return Value

- Returns a new Collection instance containing items from the first match onwards
- Returns empty collection if no items match the condition
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
