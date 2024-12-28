# Times Method

The `times()` method creates a new collection by invoking the callback a given number of times. It's useful for generating sequences or performing an action a specific number of times.

## Basic Syntax

```typescript
collect().times<U>(count: number, callback: (index: number) => U)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Generate sequence of numbers
const numbers = collect().times(5, n => n + 1)
console.log(numbers.all()) // [1, 2, 3, 4, 5]

// Generate sequence of objects
const items = collect().times(3, i => ({
  id: i,
  name: `Item ${i}`
}))
console.log(items.all())
// [
//   { id: 0, name: 'Item 0' },
//   { id: 1, name: 'Item 1' },
//   { id: 2, name: 'Item 2' }
// ]
```

### Working with Complex Types

```typescript
interface User {
  id: number
  username: string
  email: string
}

// Generate test users
const users = collect().times<User>(3, i => ({
  id: i + 1,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`
}))

console.log(users.all())
// [
//   { id: 1, username: 'user1', email: 'user1@example.com' },
//   { id: 2, username: 'user2', email: 'user2@example.com' },
//   { id: 3, username: 'user3', email: 'user3@example.com' }
// ]
```

### Real-world Examples

#### Test Data Generator

```typescript
interface TestRecord {
  id: string
  timestamp: Date
  value: number
  metadata: Record<string, any>
}

class TestDataGenerator {
  generateTimeSeriesData(count: number): Collection<TestRecord> {
    const baseTime = new Date()

    return collect().times<TestRecord>(count, i => ({
      id: `record-${i}`,
      timestamp: new Date(baseTime.getTime() + i * 3600000), // Hour intervals
      value: Math.round(Math.random() * 100),
      metadata: {
        sequence: i,
        type: i % 2 === 0 ? 'even' : 'odd'
      }
    }))
  }

  generateLoadTestData(count: number): Collection<TestRecord> {
    return collect().times<TestRecord>(count, i => ({
      id: `load-${i}`,
      timestamp: new Date(),
      value: Math.floor(Math.random() * 1000),
      metadata: {
        cpu: Math.random() * 100,
        memory: Math.random() * 100
      }
    }))
  }
}
```

#### Pagination Generator

```typescript
interface PageInfo {
  pageNumber: number
  offset: number
  limit: number
  isActive: boolean
}

class PaginationBuilder {
  constructor(private totalItems: number, private itemsPerPage: number) {}

  generatePages(): Collection<PageInfo> {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    const currentPage = 1

    return collect().times<PageInfo>(totalPages, i => ({
      pageNumber: i + 1,
      offset: i * this.itemsPerPage,
      limit: this.itemsPerPage,
      isActive: i + 1 === currentPage
    }))
  }
}

// Usage
const pagination = new PaginationBuilder(100, 10)
const pages = pagination.generatePages()
```

### Advanced Usage

#### Mock API Response Generator

```typescript
interface ApiResponse<T> {
  id: string
  timestamp: Date
  data: T
  status: 'success' | 'error'
  metadata: {
    requestId: string
    processingTime: number
  }
}

class MockApiGenerator {
  generateResponses<T>(
    count: number,
    dataGenerator: (index: number) => T
  ): Collection<ApiResponse<T>> {
    return collect().times<ApiResponse<T>>(count, i => ({
      id: `response-${i}`,
      timestamp: new Date(),
      data: dataGenerator(i),
      status: Math.random() > 0.1 ? 'success' : 'error',
      metadata: {
        requestId: `req-${Date.now()}-${i}`,
        processingTime: Math.random() * 1000
      }
    }))
  }
}

// Usage
const generator = new MockApiGenerator()
const responses = generator.generateResponses(5, i => ({
  userId: i,
  action: 'login'
}))
```

#### Matrix Generator

```typescript
type Matrix = number[][]

class MatrixGenerator {
  generateMatrix(size: number): Collection<number[]> {
    return collect().times<number[]>(size, i =>
      collect().times<number>(size, j =>
        i * size + j).all())
  }

  generateIdentityMatrix(size: number): Collection<number[]> {
    return collect().times<number[]>(size, i =>
      collect().times<number>(size, j =>
        i === j ? 1 : 0).all())
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

// Type-safe generation
const items = collect().times<TypedItem>(3, i => ({
  id: i,
  value: `value-${i}`,
  metadata: { index: i }
}))

// TypeScript ensures correct types
items.each((item) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})

// Compile-time type checking
const numbers = collect().times<number>(5, i => i * 2)
const strings = collect().times<string>(3, i => `item-${i}`)
```

## Return Value

- Returns a new Collection containing the generated items
- Number of items matches the specified count
- Each item is generated using the callback function
- Callback receives current index (0-based)
- Maintains type safety with TypeScript through generics
- Can be chained with other collection methods
