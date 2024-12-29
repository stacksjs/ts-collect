# Shift Method

The `shift()` method removes and returns the first item from the collection. The collection is modified in the process.

## Basic Syntax

```typescript
collect(items).shift()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Array example
const numbers = collect([1, 2, 3, 4, 5])
const first = numbers.shift()

console.log(first) // 1
console.log(numbers.all()) // [2, 3, 4, 5]

// String array
const words = collect(['first', 'second', 'third'])
const firstWord = words.shift()

console.log(firstWord) // 'first'
console.log(words.all()) // ['second', 'third']
```

### Working with Objects

```typescript
interface Task {
  id: number
  title: string
  priority: number
}

const tasks = collect<Task>([
  { id: 1, title: 'First Task', priority: 1 },
  { id: 2, title: 'Second Task', priority: 2 },
  { id: 3, title: 'Third Task', priority: 3 }
])

const firstTask = tasks.shift()
console.log(firstTask) // { id: 1, title: 'First Task', priority: 1 }
console.log(tasks.all()) // [{ id: 2, ... }, { id: 3, ... }]
```

### Real-world Examples

#### Queue Implementation

```typescript
interface QueueItem {
  id: string
  type: string
  data: any
  createdAt: Date
}

class Queue {
  private items: Collection<QueueItem>

  constructor() {
    this.items = collect<QueueItem>([])
  }

  enqueue(item: Omit<QueueItem, 'createdAt'>) {
    this.items.push({
      ...item,
      createdAt: new Date()
    })
    return this
  }

  dequeue(): QueueItem | undefined {
    return this.items.shift()
  }

  peek(): QueueItem | undefined {
    return this.items.first()
  }

  isEmpty(): boolean {
    return this.items.isEmpty()
  }

  size(): number {
    return this.items.count()
  }
}

// Usage
const queue = new Queue()
queue.enqueue({
  id: '1',
  type: 'email',
  data: { to: 'user@example.com' }
})
```

#### Task Processor

```typescript
interface ProcessingTask {
  id: string
  status: 'pending' | 'processing' | 'completed'
  payload: any
  attempts: number
  maxAttempts: number
}

class TaskProcessor {
  private tasks: Collection<ProcessingTask>

  constructor() {
    this.tasks = collect<ProcessingTask>([])
  }

  addTask(payload: any) {
    this.tasks.push({
      id: Date.now().toString(),
      status: 'pending',
      payload,
      attempts: 0,
      maxAttempts: 3
    })
  }

  async processNextTask() {
    const task = this.tasks.shift()
    if (!task)
      return null

    try {
      task.status = 'processing'
      task.attempts++

      // Process task...
      await this.processTask(task)

      task.status = 'completed'
      return task
    }
    catch (error) {
      if (task.attempts < task.maxAttempts) {
        // Re-add to queue for retry
        this.tasks.push(task)
      }
      throw error
    }
  }

  private async processTask(task: ProcessingTask) {
    // Implementation details...
  }
}
```

### Advanced Usage

#### Buffer Management

```typescript
interface DataBuffer<T> {
  data: T
  timestamp: number
  size: number
}

class CircularBuffer<T> {
  private buffer: Collection<DataBuffer<T>>
  private maxSize: number
  private currentSize: number

  constructor(maxSize: number) {
    this.buffer = collect<DataBuffer<T>>([])
    this.maxSize = maxSize
    this.currentSize = 0
  }

  write(data: T, size: number): boolean {
    while (this.currentSize + size > this.maxSize && !this.buffer.isEmpty()) {
      const removed = this.buffer.shift()
      if (removed) {
        this.currentSize -= removed.size
      }
    }

    if (size <= this.maxSize) {
      this.buffer.push({
        data,
        timestamp: Date.now(),
        size
      })
      this.currentSize += size
      return true
    }

    return false
  }

  read(): T | undefined {
    const item = this.buffer.shift()
    if (item) {
      this.currentSize -= item.size
      return item.data
    }
    return undefined
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
  { id: 1, value: 'first' },
  { id: 2, value: 'second', optional: true }
])

// Type-safe shift operation
const item: TypedItem | undefined = items.shift()

// TypeScript knows about the types
if (item) {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.optional) // ✓ Valid (optional)
}
```

## Return Value

- Returns the first element from the collection and removes it
- Returns `undefined` if the collection is empty
- Modifies the original collection by removing the first element
- Maintains type safety with TypeScript
- Collection size is reduced by 1
