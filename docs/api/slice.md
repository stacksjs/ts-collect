# Slice Method

The `slice()` method returns a portion of the collection starting at the given index. You can also specify the length of the slice as a second parameter.

## Basic Syntax

```typescript
// Get items starting from index
collect(items).slice(start: number)

// Get specific number of items starting from index
collect(items).slice(start: number, length: number)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Basic slicing
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.slice(2).all()) // [3, 4, 5]
console.log(numbers.slice(1, 2).all()) // [2, 3]

// Negative indices
console.log(numbers.slice(-2).all()) // [4, 5]
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
  { id: 3, name: 'Bob', role: 'user' },
  { id: 4, name: 'Alice', role: 'manager' }
])

// Get users from index 1 with length 2
const middleUsers = users.slice(1, 2)
console.log(middleUsers.all())
// [
//   { id: 2, name: 'Jane', role: 'user' },
//   { id: 3, name: 'Bob', role: 'user' }
// ]
```

### Real-world Examples

#### Pagination Implementation

```typescript
interface Post {
  id: number
  title: string
  content: string
  author: string
}

class BlogPaginator {
  private posts: Collection<Post>
  private readonly perPage: number

  constructor(posts: Post[], perPage: number = 10) {
    this.posts = collect(posts)
    this.perPage = perPage
  }

  getPage(page: number): Post[] {
    const start = (page - 1) * this.perPage
    return this.posts.slice(start, this.perPage).all()
  }

  getTotalPages(): number {
    return Math.ceil(this.posts.count() / this.perPage)
  }
}

// Usage
const paginator = new BlogPaginator([
  { id: 1, title: 'First Post', content: 'Content 1', author: 'John' },
  { id: 2, title: 'Second Post', content: 'Content 2', author: 'Jane' },
  // ... more posts
], 2)
```

#### Log Window Analysis

```typescript
interface LogEntry {
  timestamp: Date
  level: string
  message: string
  metadata?: Record<string, any>
}

class LogAnalyzer {
  private logs: Collection<LogEntry>

  constructor(logs: LogEntry[]) {
    this.logs = collect(logs)
  }

  getRecentLogs(count: number): LogEntry[] {
    return this.logs.slice(-count).all()
  }

  getLogWindow(startIndex: number, size: number): LogEntry[] {
    return this.logs.slice(startIndex, size).all()
  }

  getTimeWindow(hours: number): LogEntry[] {
    const threshold = new Date()
    threshold.setHours(threshold.getHours() - hours)

    const startIndex = this.logs.findIndex(log =>
      log.timestamp >= threshold
    )

    return startIndex >= 0
      ? this.logs.slice(startIndex).all()
      : []
  }
}
```

### Advanced Usage

#### Sliding Window Analysis

```typescript
interface DataPoint {
  timestamp: Date
  value: number
  metadata: Record<string, any>
}

class TimeSeriesAnalyzer {
  private data: Collection<DataPoint>
  private windowSize: number

  constructor(data: DataPoint[], windowSize: number) {
    this.data = collect(data)
    this.windowSize = windowSize
  }

  analyzeSlidingWindows(stepSize: number = 1) {
    const results = []
    const totalPoints = this.data.count()

    for (let i = 0; i < totalPoints - this.windowSize; i += stepSize) {
      const window = this.data.slice(i, this.windowSize)
      results.push(this.analyzeWindow(window))
    }

    return results
  }

  private analyzeWindow(window: Collection<DataPoint>) {
    const values = window.pluck('value')
    return {
      start: window.first()?.timestamp,
      end: window.last()?.timestamp,
      average: values.average(),
      max: values.max(),
      min: values.min()
    }
  }
}
```

#### Data Chunking

```typescript
interface ChunkConfig {
  size: number
  overlap: number
}

class DataChunker<T> {
  private data: Collection<T>
  private config: ChunkConfig

  constructor(data: T[], config: ChunkConfig) {
    this.data = collect(data)
    this.config = config
  }

  getChunks(): T[][] {
    const chunks: T[][] = []
    const step = this.config.size - this.config.overlap

    for (let i = 0; i < this.data.count(); i += step) {
      chunks.push(
        this.data.slice(i, this.config.size).all()
      )
    }

    return chunks
  }

  getChunkWithContext(index: number, contextSize: number): T[] {
    const start = Math.max(0, index - contextSize)
    const length = contextSize * 2 + 1

    return this.data.slice(start, length).all()
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
  { id: 1, value: 'one' },
  { id: 2, value: 'two', metadata: { extra: 'info' } },
  { id: 3, value: 'three' }
])

// Type-safe slice operations
const sliced: Collection<TypedItem> = items.slice(1)
const window: Collection<TypedItem> = items.slice(0, 2)

// TypeScript maintains type information
sliced.each((item: TypedItem) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a new Collection instance containing the sliced items
- Original collection remains unchanged
- When only start index is provided:
  - Returns all items from start index to end if start is positive
  - Returns last n items if start is negative
- When both start and length are provided:
  - Returns specified number of items starting from start index
- Maintains type safety with TypeScript
