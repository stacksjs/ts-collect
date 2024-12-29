# Prepend Method

The `prepend()` method adds an item to the beginning of the collection. For objects, it will add a key/value pair to the start of the collection.

## Basic Syntax

```typescript
// For arrays
collect(items).prepend(value: T)

// For objects
collect(items).prepend(value: T, key: string)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// With arrays
const numbers = collect([2, 3, 4])
numbers.prepend(1)
console.log(numbers.all()) // [1, 2, 3, 4]

// With objects
const data = collect({ second: 2, third: 3 })
data.prepend(1, 'first')
console.log(data.all()) // { first: 1, second: 2, third: 3 }
```

### Working with Complex Types

```typescript
interface Task {
  id: number
  title: string
  priority: number
}

const tasks = collect<Task>([
  { id: 2, title: 'Second task', priority: 2 },
  { id: 3, title: 'Third task', priority: 3 }
])

tasks.prepend({ id: 1, title: 'First task', priority: 1 })
console.log(tasks.all())
// [
//   { id: 1, title: 'First task', priority: 1 },
//   { id: 2, title: 'Second task', priority: 2 },
//   { id: 3, title: 'Third task', priority: 3 }
// ]
```

### Real-world Examples

#### Queue Management

```typescript
interface QueueItem {
  id: string
  priority: 'high' | 'normal' | 'low'
  payload: any
}

class PriorityQueue {
  private queue: Collection<QueueItem>

  constructor() {
    this.queue = collect<QueueItem>([])
  }

  addItem(item: QueueItem) {
    if (item.priority === 'high') {
      this.queue.prepend(item)
    }
    else {
      this.queue.push(item)
    }
  }

  getQueue(): QueueItem[] {
    return this.queue.all()
  }
}

// Usage
const queue = new PriorityQueue()
queue.addItem({
  id: '1',
  priority: 'normal',
  payload: { type: 'email', to: 'user@example.com' }
})
queue.addItem({
  id: '2',
  priority: 'high',
  payload: { type: 'notification', message: 'Urgent!' }
})
```

#### Log Management

```typescript
interface LogEntry {
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  message: string
}

class Logger {
  private logs: Collection<LogEntry>
  private maxLogs: number

  constructor(maxLogs: number = 1000) {
    this.logs = collect<LogEntry>([])
    this.maxLogs = maxLogs
  }

  log(level: LogEntry['level'], message: string) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message
    }

    this.logs.prepend(entry)

    // Maintain max logs limit
    if (this.logs.count() > this.maxLogs) {
      this.logs.pop()
    }
  }

  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.take(count).all()
  }
}
```

### Navigation History

```typescript
interface NavigationState {
  path: string
  params: Record<string, string>
  timestamp: number
}

class NavigationHistory {
  private history: Collection<NavigationState>

  constructor() {
    this.history = collect<NavigationState>([])
  }

  navigate(path: string, params: Record<string, string> = {}) {
    const state: NavigationState = {
      path,
      params,
      timestamp: Date.now()
    }

    this.history.prepend(state)
  }

  getLastPath(): string | null {
    const lastState = this.history.first()
    return lastState ? lastState.path : null
  }

  getPreviousStates(count: number = 5): NavigationState[] {
    return this.history.take(count).all()
  }
}
```

### Advanced Usage

#### Linked List Implementation

```typescript
interface ListNode<T> {
  value: T
  next?: ListNode<T>
}

class LinkedList<T> {
  private nodes: Collection<ListNode<T>>

  constructor() {
    this.nodes = collect<ListNode<T>>([])
  }

  addFirst(value: T) {
    const node: ListNode<T> = { value }
    this.nodes.prepend(node)

    // Update next pointers
    if (this.nodes.count() > 1) {
      node.next = this.nodes.get(1)
    }
  }

  getValues(): T[] {
    return this.nodes.pluck('value').all()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 2, value: 'second' }
])

// Type-safe prepend
items.prepend({ id: 1, value: 'first' }) // ✓ Valid
// items.prepend({ id: 0 }) // ✗ TypeScript error: missing 'value' property
```

## Return Value

- Returns the collection instance (this) for method chaining
- Modifies the original collection by adding the item at the beginning
- For objects, adds the key/value pair at the start of the object
- Maintains type safety with TypeScript
