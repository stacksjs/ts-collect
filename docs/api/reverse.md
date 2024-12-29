# Reverse Method

The `reverse()` method reverses the order of items in the collection. It works with both arrays and objects.

## Basic Syntax

```typescript
collect(items).reverse()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array reverse
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.reverse().all())
// [5, 4, 3, 2, 1]

// String array reverse
const words = collect(['first', 'second', 'third'])
console.log(words.reverse().all())
// ['third', 'second', 'first']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' }
])

console.log(users.reverse().all())
// [
//   { id: 3, name: 'Bob', role: 'user' },
//   { id: 2, name: 'Jane', role: 'user' },
//   { id: 1, name: 'John', role: 'admin' }
// ]
```

### Real-world Examples

#### Timeline Display

```typescript
interface TimelineEvent {
  id: number
  timestamp: Date
  title: string
  description: string
}

class Timeline {
  private events: Collection<TimelineEvent>

  constructor(events: TimelineEvent[]) {
    this.events = collect(events)
  }

  getChronological() {
    return this.events
      .sortBy('timestamp')
      .all()
  }

  getReverseChronological() {
    return this.events
      .sortBy('timestamp')
      .reverse()
      .all()
  }
}

// Usage
const timeline = new Timeline([
  {
    id: 1,
    timestamp: new Date('2024-01-01'),
    title: 'Event 1',
    description: 'First event'
  },
  {
    id: 2,
    timestamp: new Date('2024-01-02'),
    title: 'Event 2',
    description: 'Second event'
  }
])

console.log(timeline.getReverseChronological())
```

#### Stack Implementation

```typescript
class Stack<T> {
  private items: Collection<T>

  constructor() {
    this.items = collect<T>([])
  }

  push(item: T) {
    this.items.push(item)
    return this
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items.last()
  }

  isEmpty(): boolean {
    return this.items.isEmpty()
  }

  reverse(): Stack<T> {
    this.items = this.items.reverse()
    return this
  }
}

// Usage
const stack = new Stack<number>()
stack.push(1).push(2).push(3)
stack.reverse() // Now 3 will be popped first
```

### Advanced Usage

#### Message Log Reader

```typescript
interface LogMessage {
  id: string
  level: 'info' | 'warning' | 'error'
  message: string
  timestamp: Date
  metadata?: Record<string, any>
}

class LogReader {
  private logs: Collection<LogMessage>

  constructor(logs: LogMessage[]) {
    this.logs = collect(logs)
  }

  getLatestFirst(count?: number) {
    const sorted = this.logs
      .sortBy('timestamp')
      .reverse()

    return count ? sorted.take(count).all() : sorted.all()
  }

  getErrorsLatestFirst() {
    return this.logs
      .filter(log => log.level === 'error')
      .sortBy('timestamp')
      .reverse()
      .all()
  }
}
```

#### Navigation History

```typescript
interface NavigationEntry {
  path: string
  title: string
  timestamp: Date
  params?: Record<string, string>
}

class NavigationHistory {
  private history: Collection<NavigationEntry>
  private readonly maxSize: number

  constructor(maxSize: number = 50) {
    this.history = collect<NavigationEntry>([])
    this.maxSize = maxSize
  }

  addEntry(entry: NavigationEntry) {
    this.history.push(entry)
    if (this.history.count() > this.maxSize) {
      this.history.shift()
    }
  }

  getBackwardHistory() {
    return this.history.reverse().all()
  }

  getForwardHistory() {
    return this.history.all()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  metadata?: {
    createdAt: Date
    updatedAt: Date
  }
}

const items = collect<TypedItem>([
  {
    id: 1,
    value: 'first',
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  {
    id: 2,
    value: 'second'
  }
])

// Type-safe reverse operation
const reversed = items.reverse()

// TypeScript maintains type information
reversed.each((item: TypedItem) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a new Collection instance with items in reverse order
- Original collection remains unchanged
- Preserves the type information of the original collection
- For arrays: reverses the order of elements
- For objects: reverses the order of key-value pairs
