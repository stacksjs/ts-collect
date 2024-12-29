# Skip Method

The `skip()` method returns a new collection with the specified number of items skipped from the beginning of the sequence. When used with a negative number, it skips items from the end.

## Basic Syntax

```typescript
collect(items).skip(count: number): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Skip from beginning
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.skip(2).all()) // [3, 4, 5]

// Skip from end
console.log(numbers.skip(-2).all()) // [1, 2, 3]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  joinDate: Date
}

const users = collect<User>([
  { id: 1, name: 'John', joinDate: new Date('2024-01-01') },
  { id: 2, name: 'Jane', joinDate: new Date('2024-01-02') },
  { id: 3, name: 'Bob', joinDate: new Date('2024-01-03') },
  { id: 4, name: 'Alice', joinDate: new Date('2024-01-04') }
])

// Skip first 2 users
const newerUsers = users
  .sortBy('joinDate')
  .skip(2)

console.log(newerUsers.all())
// [
//   { id: 3, name: 'Bob', joinDate: '2024-01-03' },
//   { id: 4, name: 'Alice', joinDate: '2024-01-04' }
// ]
```

### Real-world Examples

#### Pagination Implementation

```typescript
interface PaginationResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

class Paginator<T> {
  private items: Collection<T>
  private readonly perPage: number

  constructor(items: T[], perPage: number = 10) {
    this.items = collect(items)
    this.perPage = perPage
  }

  getPage(page: number): PaginationResult<T> {
    const total = this.items.count()
    const totalPages = Math.ceil(total / this.perPage)
    const skip = (page - 1) * this.perPage

    return {
      items: this.items
        .skip(skip)
        .take(this.perPage)
        .all(),
      total,
      page,
      totalPages
    }
  }
}
```

#### Log Analysis

```typescript
interface LogEntry {
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  message: string
}

class LogAnalyzer {
  private logs: Collection<LogEntry>

  constructor(logs: LogEntry[]) {
    this.logs = collect(logs).sortBy('timestamp')
  }

  getLogsAfterDate(date: Date): Collection<LogEntry> {
    const index = this.logs.findIndex(log =>
      log.timestamp >= date
    )
    return this.logs.skip(index)
  }

  getRecentErrors(skipCount: number = 0): Collection<LogEntry> {
    return this.logs
      .filter(log => log.level === 'error')
      .skip(skipCount)
  }
}
```

### Advanced Usage

#### Data Streaming

```typescript
interface DataChunk {
  id: string
  sequence: number
  data: any[]
  processed: boolean
}

class StreamProcessor {
  private chunks: Collection<DataChunk>
  private batchSize: number

  constructor(chunks: DataChunk[], batchSize: number = 100) {
    this.chunks = collect(chunks)
      .sortBy('sequence')
    this.batchSize = batchSize
  }

  processBatch(batchNumber: number): DataChunk[] {
    return this.chunks
      .skip(batchNumber * this.batchSize)
      .take(this.batchSize)
      .all()
  }

  getUnprocessedChunks(offset: number = 0): Collection<DataChunk> {
    return this.chunks
      .filter(chunk => !chunk.processed)
      .skip(offset)
  }
}
```

#### Tournament Rounds

```typescript
interface Match {
  id: string
  round: number
  player1: string
  player2: string
  winner?: string
}

class TournamentManager {
  private matches: Collection<Match>

  constructor(matches: Match[]) {
    this.matches = collect(matches)
      .sortBy('round')
  }

  getUpcomingMatches(skipCompleted: boolean = true): Collection<Match> {
    if (!skipCompleted)
      return this.matches

    const completedCount = this.matches
      .filter(match => match.winner)
      .count()

    return this.matches.skip(completedCount)
  }

  getRoundMatches(round: number, skipByes: boolean = false): Collection<Match> {
    const roundMatches = this.matches
      .filter(match => match.round === round)

    if (!skipByes)
      return roundMatches

    return roundMatches.skip(
      roundMatches.filter(match =>
        match.player1 === 'BYE' || match.player2 === 'BYE'
      ).count()
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
  { id: 2, value: 'second' },
  { id: 3, value: 'third', metadata: { important: true } }
])

// Type-safe operations
const skipped: Collection<TypedItem> = items.skip(1)

// Type checking preserved in chaining
const processed = items
  .skip(1)
  .filter(item => item.id > 1)
  .map(item => item.value)
```

## Return Value

- Returns a new Collection with items after the specified skip count
- For positive count: skips items from the beginning
- For negative count: skips items from the end
- If count exceeds collection size, returns empty collection
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods

## Common Use Cases

### 1. Pagination

- Implementing offset pagination
- Handling page skips
- Managing result sets
- Processing batches

### 2. Data Processing

- Batch processing
- Stream handling
- Chunk management
- Sequential processing

### 3. Log Analysis

- Skipping old entries
- Processing recent logs
- Handling offsets
- Managing history

### 4. Query Results

- Implementing offsets
- Managing result sets
- Handling large datasets
- Processing queries

### 5. Tournament Systems

- Managing rounds
- Handling matches
- Processing brackets
- Skipping byes

### 6. Time Series Data

- Skipping historical data
- Processing recent entries
- Managing timelines
- Handling sequences

### 7. Performance Optimization

- Implementing lazy loading
- Managing memory usage
- Optimizing queries
- Handling large sets

### 8. UI Components

- Implementing infinite scroll
- Managing lists
- Handling virtual scrolling
- Processing views

### 9. Data Migration

- Processing in batches
- Managing transfers
- Handling checkpoints
- Processing records

### 10. Resource Management

- Managing quotas
- Handling allocations
- Processing assignments
- Managing distribution
