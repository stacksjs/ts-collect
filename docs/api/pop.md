# Pop Method

The `pop()` method removes and returns the last item from the collection. The original collection is modified in the process.

## Basic Syntax

```typescript
collect(items).pop()
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple array
const numbers = collect([1, 2, 3, 4, 5])
const lastNumber = numbers.pop()

console.log(lastNumber) // 5
console.log(numbers.all()) // [1, 2, 3, 4]
```

### Working with Objects

```typescript
interface Task {
  id: number
  name: string
  priority: number
}

const tasks = collect<Task>([
  { id: 1, name: 'Task 1', priority: 1 },
  { id: 2, name: 'Task 2', priority: 2 },
  { id: 3, name: 'Task 3', priority: 3 }
])

const lastTask = tasks.pop()
console.log(lastTask) // { id: 3, name: 'Task 3', priority: 3 }
console.log(tasks.all()) // [{ id: 1, ... }, { id: 2, ... }]
```

### Real-world Examples

#### Stack Implementation

```typescript
class Stack<T> {
  private items: Collection<T>

  constructor(initialItems: T[] = []) {
    this.items = collect<T>(initialItems)
  }

  push(item: T): void {
    this.items.push(item)
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

  size(): number {
    return this.items.count()
  }
}

// Usage
const stack = new Stack<number>([1, 2, 3])
console.log(stack.pop()) // 3
console.log(stack.peek()) // 2
console.log(stack.size()) // 2
```

#### Task Queue

```typescript
interface QueueTask {
  id: string
  type: string
  data: any
  priority: number
}

class TaskQueue {
  private tasks: Collection<QueueTask>

  constructor() {
    this.tasks = collect<QueueTask>([])
  }

  addTask(task: QueueTask): void {
    this.tasks.push(task)
  }

  processNextTask(): QueueTask | undefined {
    // Sort by priority before processing
    this.tasks = this.tasks.sortByDesc('priority')
    return this.tasks.pop()
  }

  hasTasks(): boolean {
    return !this.tasks.isEmpty()
  }
}

// Usage
const queue = new TaskQueue()
queue.addTask({
  id: '1',
  type: 'email',
  data: { to: 'user@example.com' },
  priority: 2
})
queue.addTask({
  id: '2',
  type: 'notification',
  data: { message: 'Alert' },
  priority: 1
})

const nextTask = queue.processNextTask()
```

### Advanced Usage

#### Undo History

```typescript
interface HistoryState {
  timestamp: number
  action: string
  data: any
}

class UndoManager {
  private history: Collection<HistoryState>
  private maxHistory: number

  constructor(maxHistory: number = 10) {
    this.history = collect<HistoryState>([])
    this.maxHistory = maxHistory
  }

  addState(action: string, data: any): void {
    this.history.push({
      timestamp: Date.now(),
      action,
      data
    })

    // Maintain history limit
    while (this.history.count() > this.maxHistory) {
      this.history.shift()
    }
  }

  undo(): HistoryState | undefined {
    return this.history.pop()
  }

  getHistory(): HistoryState[] {
    return this.history.all()
  }
}
```

#### Document Processing

```typescript
interface DocumentSection {
  title: string
  content: string[]
}

class DocumentProcessor {
  private sections: Collection<DocumentSection>

  constructor(sections: DocumentSection[]) {
    this.sections = collect(sections)
  }

  processLastSection(): DocumentSection | undefined {
    const section = this.sections.pop()
    if (section) {
      // Process the section
      section.content = section.content.map(line => line.trim())
      return section
    }
    return undefined
  }

  remainingSections(): number {
    return this.sections.count()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

const items = collect<TypedItem>([
  { id: 1, value: 'first' },
  { id: 2, value: 'second' }
])

// Type-safe pop operation
const item: TypedItem | undefined = items.pop()
if (item) {
  console.log(item.id) // TypeScript knows this is safe
  console.log(item.value) // TypeScript knows this is safe
}
```

## Return Value

- Returns the last element from the collection and removes it
- Returns `undefined` if the collection is empty
- Modifies the original collection by removing the last element
- Maintains type safety with TypeScript
