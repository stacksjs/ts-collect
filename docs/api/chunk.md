# Chunk Method

The `chunk()` method breaks the collection into multiple smaller collections of a given size. This is particularly useful for batch processing, pagination, and creating grid layouts.

## Basic Syntax

```typescript
collect(items).chunk(size: number): Collection<T[]>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array chunking
const numbers = collect([1, 2, 3, 4, 5, 6, 7])
console.log(numbers.chunk(3).all())
// [[1, 2, 3], [4, 5, 6], [7]]

// Chunking with even size
const items = collect(['a', 'b', 'c', 'd'])
console.log(items.chunk(2).all())
// [['a', 'b'], ['c', 'd']]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  email: string
}

const users = collect<User>([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' },
  { id: 4, name: 'Alice', email: 'alice@example.com' }
])

const userGroups = users.chunk(2)
console.log(userGroups.all())
// [
//   [
//     { id: 1, name: 'John', email: 'john@example.com' },
//     { id: 2, name: 'Jane', email: 'jane@example.com' }
//   ],
//   [
//     { id: 3, name: 'Bob', email: 'bob@example.com' },
//     { id: 4, name: 'Alice', email: 'alice@example.com' }
//   ]
// ]
```

### Real-world Examples

#### Batch Processing

```typescript
interface EmailTask {
  to: string
  subject: string
  body: string
  attachments?: string[]
}

class EmailBatchProcessor {
  private tasks: Collection<EmailTask>
  private readonly batchSize: number

  constructor(tasks: EmailTask[], batchSize: number = 50) {
    this.tasks = collect(tasks)
    this.batchSize = batchSize
  }

  async processBatches(): Promise<void> {
    const batches = this.tasks.chunk(this.batchSize)

    for (const batch of batches.all()) {
      await this.sendBatch(batch)
      await this.delay(1000) // Rate limiting
    }
  }

  private async sendBatch(batch: EmailTask[]): Promise<void> {
    // Send emails in batch
    for (const task of batch) {
      await this.sendEmail(task)
    }
  }

  private async sendEmail(task: EmailTask): Promise<void> {
    // Email sending logic
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
```

#### Grid Layout Generator

```typescript
interface GridItem {
  id: string
  content: string
  width: number
  height: number
}

class GridLayoutManager {
  private items: Collection<GridItem>
  private readonly columnsCount: number

  constructor(items: GridItem[], columns: number = 3) {
    this.items = collect(items)
    this.columnsCount = columns
  }

  generateRows(): GridItem[][] {
    return this.items.chunk(this.columnsCount).all()
  }

  getRowHeights(): number[] {
    return this.items
      .chunk(this.columnsCount)
      .map(row => Math.max(...row.map(item => item.height)))
      .all()
  }
}
```

### Advanced Usage

#### Data Partitioning

```typescript
interface DataPartition<T> {
  partitionId: string
  items: T[]
  totalSize: number
}

class DataPartitioner<T> {
  private data: Collection<T>
  private readonly partitionSize: number

  constructor(data: T[], partitionSize: number) {
    this.data = collect(data)
    this.partitionSize = partitionSize
  }

  createPartitions(): Collection<DataPartition<T>> {
    return this.data
      .chunk(this.partitionSize)
      .map((chunk, index) => ({
        partitionId: `partition-${index + 1}`,
        items: chunk,
        totalSize: chunk.length
      }))
  }
}
```

#### Test Case Runner

```typescript
interface TestCase {
  name: string
  setup: () => Promise<void>
  execute: () => Promise<void>
  teardown: () => Promise<void>
}

class ParallelTestRunner {
  private tests: Collection<TestCase>
  private readonly concurrency: number

  constructor(tests: TestCase[], concurrency: number = 4) {
    this.tests = collect(tests)
    this.concurrency = concurrency
  }

  async runTests(): Promise<void> {
    const batches = this.tests.chunk(this.concurrency)

    for (const batch of batches.all()) {
      await Promise.all(batch.map(test => this.runTest(test)))
    }
  }

  private async runTest(test: TestCase): Promise<void> {
    await test.setup()
    await test.execute()
    await test.teardown()
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
  { id: 2, value: 'two' },
  { id: 3, value: 'three' },
  { id: 4, value: 'four' }
])

// Type-safe chunking
const chunks: Collection<TypedItem[]> = items.chunk(2)

// TypeScript knows each chunk is an array of TypedItem
chunks.each((chunk) => {
  chunk.forEach((item) => {
    console.log(item.id) // ✓ Valid
    console.log(item.value) // ✓ Valid
    console.log(item.metadata) // ✓ Valid (optional)
  })
})
```

## Return Value

- Returns a new Collection of arrays
- Each inner array has the specified size (except possibly the last one)
- Last chunk may have fewer items if collection size isn't evenly divisible
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods

## Common Use Cases

### 1. Batch Processing

- Processing large datasets
- Rate limiting
- API requests
- Bulk operations

### 2. UI Components

- Grid layouts
- Pagination
- Gallery views
- Card layouts

### 3. Data Partitioning

- Parallel processing
- Data distribution
- Load balancing
- Sharding

### 4. Memory Management

- Processing large arrays
- Stream handling
- Resource optimization
- Memory efficiency

### 5. Task Distribution

- Worker allocation
- Job scheduling
- Workload distribution
- Queue management

### 6. Testing

- Parallel test execution
- Test grouping
- Resource allocation
- Load simulation

### 7. Data Export

- File splitting
- Bulk exports
- Report generation
- Data segmentation

### 8. Content Layout

- Content organization
- Page layouts
- Section division
- Display grouping

### 9. Resource Management

- Load balancing
- Resource allocation
- Capacity planning
- Usage optimization

### 10. Network Operations

- Request batching
- Traffic management
- Connection pooling
- Bandwidth optimization
