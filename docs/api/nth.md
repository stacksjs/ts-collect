# Nth Method

The `nth()` method retrieves the element at the specified index from the collection. Negative indices can be used to count from the end of the collection.

## Basic Syntax

```typescript
collect(items).nth(index: number): T | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Positive index
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.nth(2)) // 3

// Negative index (counts from end)
console.log(numbers.nth(-2)) // 4

// Out of bounds
console.log(numbers.nth(10)) // undefined
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

// Get second user
console.log(users.nth(1))
// { id: 2, name: 'Jane', role: 'user' }

// Get second-to-last user
console.log(users.nth(-2))
// { id: 2, name: 'Jane', role: 'user' }
```

### Real-world Examples

#### Pagination Handler

```typescript
interface PageItem {
  id: number
  content: string
  position: number
}

class PaginationHandler {
  private items: Collection<PageItem>
  private readonly itemsPerPage: number

  constructor(items: PageItem[], itemsPerPage: number = 10) {
    this.items = collect(items)
    this.itemsPerPage = itemsPerPage
  }

  getItemAtPosition(page: number, position: number): PageItem | undefined {
    const index = (page - 1) * this.itemsPerPage + position
    return this.items.nth(index)
  }

  getLastItemOnPage(page: number): PageItem | undefined {
    const index = (page * this.itemsPerPage) - 1
    return this.items.nth(index)
  }
}
```

#### Tournament Bracket

```typescript
interface Player {
  id: string
  name: string
  rank: number
  score: number
}

class TournamentBracket {
  private players: Collection<Player>

  constructor(players: Player[]) {
    this.players = collect(players).sortByDesc('rank')
  }

  getMatchup(position: number): [Player | undefined, Player | undefined] {
    return [
      this.players.nth(position * 2),
      this.players.nth(position * 2 + 1)
    ]
  }

  getSeedPosition(seed: number): Player | undefined {
    return this.players.nth(seed - 1)
  }
}
```

### Advanced Usage

#### Queue System

```typescript
interface QueueTask {
  id: string
  priority: number
  status: 'pending' | 'processing' | 'completed'
  retryCount: number
}

class QueueManager {
  private tasks: Collection<QueueTask>
  private batchSize: number

  constructor(tasks: QueueTask[], batchSize: number = 5) {
    this.tasks = collect(tasks).sortByDesc('priority')
    this.batchSize = batchSize
  }

  getBatchItem(batchNumber: number, position: number): QueueTask | undefined {
    const index = (batchNumber * this.batchSize) + position
    return this.tasks.nth(index)
  }

  getRetryCandidate(attempt: number): QueueTask | undefined {
    return this.tasks
      .filter(task => task.status === 'pending')
      .nth(attempt)
  }
}
```

#### Circular Buffer

```typescript
class CircularBuffer<T> {
  private buffer: Collection<T>
  private readonly capacity: number
  private position: number = 0

  constructor(capacity: number) {
    this.buffer = collect<T>([])
    this.capacity = capacity
  }

  write(item: T): void {
    if (this.buffer.count() < this.capacity) {
      this.buffer.push(item)
    }
    else {
      const items = this.buffer.all()
      items[this.position] = item
      this.buffer = collect(items)
    }
    this.position = (this.position + 1) % this.capacity
  }

  read(offset: number): T | undefined {
    return this.buffer.nth(
      (this.position - offset + this.capacity) % this.capacity
    )
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
  { id: 1, value: 'first' },
  { id: 2, value: 'second', metadata: { important: true } },
  { id: 3, value: 'third' }
])

// Type-safe access
const item: TypedItem | undefined = items.nth(1)

// Type checking on returned item
if (item) {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
}
```

## Return Value

- Returns the element at the specified index
- Returns undefined if index is out of bounds
- Supports negative indices (counts from end of collection)
- Original collection remains unchanged
- Maintains type safety with TypeScript

## Common Use Cases

### 1. Pagination

- Accessing specific page items
- Getting items at position
- Finding page boundaries
- Retrieving offsets

### 2. Tournament Systems

- Managing brackets
- Handling matchups
- Processing seedings
- Organizing rounds

### 3. Queue Management

- Processing batch items
- Handling task orders
- Managing priorities
- Controlling sequences

### 4. Buffer Management

- Implementing circular buffers
- Managing fixed-size collections
- Handling stream data
- Processing windows

### 5. Position-based Access

- Finding specific elements
- Accessing ordered items
- Retrieving rankings
- Managing sequences

### 6. Data Sampling

- Taking regular samples
- Processing intervals
- Handling distributions
- Managing selections

### 7. List Navigation

- Implementing cursors
- Managing positions
- Handling navigation
- Processing offsets

### 8. Game Systems

- Managing turns
- Handling player order
- Processing moves
- Organizing rounds

### 9. Time Series

- Processing intervals
- Handling periods
- Managing timestamps
- Accessing snapshots

### 10. Resource Management

- Allocating resources
- Managing slots
- Handling assignments
- Processing schedules
