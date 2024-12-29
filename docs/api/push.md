# Push Method

The `push()` method appends an item to the end of the collection. The method modifies the original collection and returns the collection instance for chaining.

## Basic Syntax

```typescript
collect(items).push(...items: T[])
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array
const numbers = collect([1, 2, 3])
numbers.push(4)
console.log(numbers.all()) // [1, 2, 3, 4]

// Push multiple items
numbers.push(5, 6, 7)
console.log(numbers.all()) // [1, 2, 3, 4, 5, 6, 7]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' }
])

users.push(
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' }
)

console.log(users.all())
// [
//   { id: 1, name: 'John', role: 'admin' },
//   { id: 2, name: 'Jane', role: 'user' },
//   { id: 3, name: 'Bob', role: 'user' }
// ]
```

### Real-world Examples

#### Task Queue

```typescript
interface Task {
  id: string
  type: 'email' | 'notification' | 'process'
  priority: number
  data: any
  createdAt: Date
}

class TaskQueue {
  private tasks: Collection<Task>
  private maxSize: number

  constructor(maxSize: number = 100) {
    this.tasks = collect<Task>([])
    this.maxSize = maxSize
  }

  addTask(...newTasks: Task[]) {
    if (this.tasks.count() + newTasks.length <= this.maxSize) {
      this.tasks.push(...newTasks)
      return true
    }
    return false
  }

  getNextTask(): Task | undefined {
    return this.tasks
      .sortBy('priority')
      .first()
  }

  getTasks(): Task[] {
    return this.tasks.all()
  }
}

// Usage
const queue = new TaskQueue()
queue.addTask(
  {
    id: '1',
    type: 'email',
    priority: 1,
    data: { to: 'user@example.com' },
    createdAt: new Date()
  },
  {
    id: '2',
    type: 'notification',
    priority: 2,
    data: { message: 'Alert!' },
    createdAt: new Date()
  }
)
```

#### Event Logger

```typescript
interface LogEvent {
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  message: string
  metadata?: Record<string, any>
}

class EventLogger {
  private logs: Collection<LogEvent>
  private readonly maxLogs: number

  constructor(maxLogs: number = 1000) {
    this.logs = collect<LogEvent>([])
    this.maxLogs = maxLogs
  }

  log(level: LogEvent['level'], message: string, metadata?: Record<string, any>) {
    const event: LogEvent = {
      timestamp: new Date(),
      level,
      message,
      metadata
    }

    if (this.logs.count() >= this.maxLogs) {
      this.logs.shift() // Remove oldest log
    }

    this.logs.push(event)
    return this
  }

  getRecentLogs(count: number = 10): LogEvent[] {
    return this.logs
      .sortByDesc(log => log.timestamp)
      .take(count)
      .all()
  }
}
```

### Advanced Usage

#### Streaming Data Buffer

```typescript
interface DataChunk {
  id: string
  data: Uint8Array
  timestamp: number
}

class DataBuffer {
  private buffer: Collection<DataChunk>
  private maxSize: number
  private currentSize: number

  constructor(maxSize: number = 1024 * 1024) { // 1MB default
    this.buffer = collect<DataChunk>([])
    this.maxSize = maxSize
    this.currentSize = 0
  }

  push(...chunks: DataChunk[]): boolean {
    const newSize = chunks.reduce(
      (size, chunk) => size + chunk.data.length,
      this.currentSize
    )

    if (newSize <= this.maxSize) {
      this.buffer.push(...chunks)
      this.currentSize = newSize
      return true
    }

    return false
  }

  flush(): DataChunk[] {
    const data = this.buffer.all()
    this.buffer = collect([])
    this.currentSize = 0
    return data
  }
}
```

#### State History

```typescript
interface StateSnapshot {
  id: string
  state: any
  timestamp: number
  metadata: {
    user?: string
    action?: string
  }
}

class StateHistory {
  private history: Collection<StateSnapshot>
  private maxStates: number

  constructor(maxStates: number = 50) {
    this.history = collect<StateSnapshot>([])
    this.maxStates = maxStates
  }

  pushState(...states: StateSnapshot[]) {
    // Remove oldest states if exceeding max
    while (this.history.count() + states.length > this.maxStates) {
      this.history.shift()
    }

    this.history.push(...states)
    return this.history.count()
  }

  getHistory(): StateSnapshot[] {
    return this.history.all()
  }

  findState(id: string): StateSnapshot | undefined {
    return this.history.firstWhere('id', id)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  optional?: boolean
}

const items = collect<TypedItem>([
  { id: 1, value: 'first' }
])

// Type-safe push operations
items.push(
  { id: 2, value: 'second' }, // ✓ Valid
  { id: 3, value: 'third', optional: true } // ✓ Valid
)

// TypeScript will catch type errors
// items.push({ id: 4 })                     // ✗ Error: missing 'value' property
```

## Return Value

- Returns the collection instance for method chaining
- Modifies the original collection by adding items to the end
- Maintains type safety with TypeScript
