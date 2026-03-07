# Performance Optimization

Optimize collection operations for large datasets and performance-critical applications.

## Overview

While ts-collect is designed for developer ergonomics, understanding performance characteristics helps you write efficient code.

## Lazy Collections

Use lazy collections for large datasets:

```typescript
import { collect, lazy } from 'ts-collect'

// Eager - processes all items immediately
const eager = collect(largeArray)
  .map((x) => x * 2)
  .filter((x) => x > 100)
  .take(10)

// Lazy - only processes items as needed
const lazyResult = lazy(largeArray)
  .map((x) => x * 2)
  .filter((x) => x > 100)
  .take(10)
  .collect()
```

## Chain Optimization

Minimize intermediate collections:

```typescript
// Creates multiple intermediate collections
const result1 = collect(data)
  .map((x) => x.value)
  .map((x) => x * 2)
  .filter((x) => x > 10)
  .map((x) => x.toString())

// Single pass - more efficient
const result2 = collect(data)
  .map((x) => {
    const doubled = x.value * 2
    return doubled > 10 ? doubled.toString() : null
  })
  .filter((x) => x !== null)
```

## Batch Processing

Process large datasets in batches:

```typescript
const largeDataset = collect(millionRecords)

// Process in chunks to avoid memory spikes
largeDataset
  .chunk(1000)
  .each((batch) => {
    processBatch(batch.toArray())
  })
```

## Index-Based Access

Use indices for frequent lookups:

```typescript
// Slow - searches each time
users.first((u) => u.id === targetId)

// Fast - build index once
const userIndex = users.keyBy('id')
const user = userIndex.get(targetId)
```

## Memory Management

Release large collections when done:

```typescript
let collection = collect(veryLargeArray)

// Process data
const result = collection.reduce(/* ... */)

// Allow garbage collection
collection = null
```

## Benchmarks

```typescript
// Compare approaches
const data = Array.from({ length: 100000 }, (_, i) => i)

console.time('Native')
data.map((x) => x * 2).filter((x) => x > 1000).slice(0, 100)
console.timeEnd('Native')

console.time('Collection')
collect(data).map((x) => x * 2).filter((x) => x > 1000).take(100).toArray()
console.timeEnd('Collection')

console.time('Lazy')
lazy(data).map((x) => x * 2).filter((x) => x > 1000).take(100).toArray()
console.timeEnd('Lazy')
```

## Best Practices

1. Use lazy collections for large datasets
2. Minimize chain length when possible
3. Build indices for frequent lookups
4. Process in batches for memory-intensive operations
5. Profile before optimizing
