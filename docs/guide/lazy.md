# Lazy Collections

Lazy collections provide memory-efficient processing for large datasets by deferring computation until results are actually needed. Instead of creating intermediate arrays for each operation, lazy collections build up a chain of operations that are executed only when you request the final result.

## Why Use Lazy Collections?

### Memory Efficiency

With eager evaluation (normal collections), each operation creates a new array:

```typescript
// Eager evaluation - creates 3 intermediate arrays
const result = collect(millionItems)
  .filter(x => x > 100)    // Array 1
  .map(x => x * 2)         // Array 2
  .take(10)                // Array 3
  .toArray()
```

With lazy evaluation, no intermediate arrays are created:

```typescript
// Lazy evaluation - no intermediate arrays
const result = await collect(millionItems)
  .lazy()
  .filter(x => x > 100)    // Just records the operation
  .map(x => x * 2)         // Just records the operation
  .take(10)                // Just records the operation
  .toArray()               // Now executes everything
```

### Short-Circuit Evaluation

Lazy collections stop processing as soon as the result is known:

```typescript
// Processes only 10 items, not millions
const firstTen = await collect(millionItems)
  .lazy()
  .filter(x => x.isValid)
  .take(10)
  .toArray()
```

## Creating Lazy Collections

Convert any collection to lazy mode using the `lazy()` method:

```typescript
import { collect } from 'ts-collect'

const lazy = collect([1, 2, 3, 4, 5]).lazy()
```

## Core Operations

### map()

Transforms each item lazily.

```typescript
const lazy = collect([1, 2, 3, 4, 5])
  .lazy()
  .map(n => n * 2)
  .map(n => n + 1)

// Nothing computed yet
const result = await lazy.toArray() // [3, 5, 7, 9, 11]
```

### filter()

Filters items lazily.

```typescript
const lazy = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .lazy()
  .filter(n => n % 2 === 0)
  .filter(n => n > 4)

const result = await lazy.toArray() // [6, 8, 10]
```

### flatMap()

Maps and flattens lazily.

```typescript
const lazy = collect([1, 2, 3])
  .lazy()
  .flatMap(n => [n, n * 2])

const result = await lazy.toArray() // [1, 2, 2, 4, 3, 6]
```

### take()

Takes only the first n items.

```typescript
const lazy = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .lazy()
  .take(3)

const result = await lazy.toArray() // [1, 2, 3]
```

This is especially powerful with `filter`:

```typescript
// Find first 5 valid items (stops as soon as 5 are found)
const lazy = collect(largeDataset)
  .lazy()
  .filter(item => item.isValid)
  .take(5)

const result = await lazy.toArray()
```

### skip()

Skips the first n items.

```typescript
const lazy = collect([1, 2, 3, 4, 5])
  .lazy()
  .skip(2)

const result = await lazy.toArray() // [3, 4, 5]
```

### chunk()

Groups items into chunks lazily.

```typescript
const lazy = collect([1, 2, 3, 4, 5, 6, 7])
  .lazy()
  .chunk(3)

const result = await lazy.toArray() // [[1, 2, 3], [4, 5, 6], [7]]
```

## Terminal Operations

Terminal operations trigger the execution of the lazy chain and return a result.

### toArray()

Executes the chain and returns an array.

```typescript
const result = await collect([1, 2, 3])
  .lazy()
  .map(n => n * 2)
  .toArray() // [2, 4, 6]
```

### toCollection()

Converts back to a regular collection.

```typescript
const collection = await collect([1, 2, 3])
  .lazy()
  .map(n => n * 2)
  .toCollection()

collection.sum() // 12
```

### forEach()

Iterates over results.

```typescript
await collect([1, 2, 3])
  .lazy()
  .map(n => n * 2)
  .forEach(n => console.log(n))
// Logs: 2, 4, 6
```

### reduce()

Reduces to a single value.

```typescript
const sum = await collect([1, 2, 3, 4, 5])
  .lazy()
  .filter(n => n % 2 === 0)
  .reduce((acc, n) => acc + n, 0) // 6
```

### count()

Counts matching items.

```typescript
const count = await collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .lazy()
  .filter(n => n > 5)
  .count() // 5
```

### first()

Gets the first item.

```typescript
const first = await collect([1, 2, 3, 4, 5])
  .lazy()
  .filter(n => n > 2)
  .first() // 3
```

### last()

Gets the last item.

```typescript
const last = await collect([1, 2, 3, 4, 5])
  .lazy()
  .filter(n => n < 4)
  .last() // 3
```

### nth()

Gets the item at index n.

```typescript
const third = await collect([1, 2, 3, 4, 5])
  .lazy()
  .map(n => n * 10)
  .nth(2) // 30
```

## Utility Operations

### cache()

Caches the results for subsequent iterations.

```typescript
const lazy = collect([1, 2, 3])
  .lazy()
  .map(n => {
    console.log('Processing:', n)
    return n * 2
  })
  .cache()

// First iteration - logs processing
const first = await lazy.toArray()

// Second iteration - uses cache, no logging
const second = await lazy.toArray()
```

### batch()

Processes items in batches.

```typescript
const lazy = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .lazy()
  .batch(3)

// Items are yielded in batches of 3
const result = await lazy.toArray()
```

### pipe()

Pipes through a transformation function.

```typescript
const result = await collect([1, 2, 3])
  .lazy()
  .pipe(lazy => lazy.map(n => n * 2))
  .pipe(lazy => lazy.filter(n => n > 2))
  .toArray() // [4, 6]
```

## Practical Examples

### Processing Large Files

```typescript
async function* readLines(file: string) {
  const reader = Bun.file(file).stream().getReader()
  // ... yield lines one at a time
}

const validLines = await collect(readLines('huge-file.csv'))
  .lazy()
  .skip(1) // Skip header
  .map(line => parseCsvLine(line))
  .filter(row => row.isValid)
  .take(1000) // Only need first 1000 valid rows
  .toArray()
```

### Infinite Sequences

```typescript
function* fibonacci() {
  let a = 0, b = 1
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

// Get first 20 Fibonacci numbers greater than 100
const result = await collect(fibonacci())
  .lazy()
  .filter(n => n > 100)
  .take(20)
  .toArray()
```

### Database Cursor Processing

```typescript
async function* fetchUsers() {
  let offset = 0
  const limit = 100

  while (true) {
    const users = await db.users.findMany({ skip: offset, take: limit })
    if (users.length === 0) break

    for (const user of users) {
      yield user
    }
    offset += limit
  }
}

// Process all users lazily
const activeUsers = await collect(fetchUsers())
  .lazy()
  .filter(user => user.isActive)
  .map(user => ({
    id: user.id,
    email: user.email
  }))
  .toArray()
```

### Chained API Requests

```typescript
async function* fetchAllPages(baseUrl: string) {
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}`)
    const data = await response.json()

    for (const item of data.items) {
      yield item
    }

    hasMore = data.hasNextPage
    page++
  }
}

// Process paginated API results lazily
const results = await collect(fetchAllPages('/api/products'))
  .lazy()
  .filter(product => product.inStock)
  .map(product => ({
    id: product.id,
    name: product.name,
    price: product.price
  }))
  .take(50)
  .toArray()
```

### Memory-Efficient Transformations

```typescript
// Instead of loading all data into memory
const processed = await collect(streamData())
  .lazy()
  .map(item => heavyTransformation(item))
  .filter(item => item.score > threshold)
  .chunk(100)
  .forEach(async chunk => {
    await saveToDatabase(chunk)
  })
```

## Performance Comparison

```typescript
const data = Array.from({ length: 1_000_000 }, (_, i) => i)

// Eager: Creates multiple large arrays
console.time('eager')
const eagerResult = collect(data)
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .take(10)
  .toArray()
console.timeEnd('eager') // ~500ms

// Lazy: Minimal memory, stops early
console.time('lazy')
const lazyResult = await collect(data)
  .lazy()
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .take(10)
  .toArray()
console.timeEnd('lazy') // ~1ms
```

## Best Practices

1. **Use lazy for large datasets**: If you're working with thousands of items or more, consider using lazy evaluation.

2. **Combine with take()**: The biggest performance gains come when you can stop early with `take()`.

3. **Use cache() wisely**: Only cache when you need to iterate multiple times over the same lazy chain.

4. **Convert to regular collection when needed**: Some operations require the full dataset. Use `toCollection()` when you need access to methods not available on lazy collections.

5. **Handle errors appropriately**: Lazy operations are async, so use try/catch or `.catch()` for error handling.

```typescript
try {
  const result = await collect(data)
    .lazy()
    .map(item => riskyOperation(item))
    .toArray()
} catch (error) {
  console.error('Processing failed:', error)
}
```

## Limitations

Lazy collections support a subset of collection operations:

- **Supported**: `map`, `filter`, `flatMap`, `take`, `skip`, `chunk`
- **Terminal**: `toArray`, `toCollection`, `forEach`, `reduce`, `count`, `first`, `last`, `nth`
- **Utility**: `cache`, `batch`, `pipe`

For operations not supported by lazy collections, convert to a regular collection first:

```typescript
const collection = await collect(data)
  .lazy()
  .filter(x => x.valid)
  .toCollection()

// Now use any collection method
const grouped = collection.groupBy('category')
```
