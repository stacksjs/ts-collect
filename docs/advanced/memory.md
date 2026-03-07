# Memory Management

Manage memory effectively when working with large collections.

## Overview

Understanding memory patterns helps you avoid out-of-memory errors and build efficient applications.

## Streaming Large Data

Process data without loading everything into memory:

```typescript
import { lazy } from 'ts-collect'

// Stream from file
async function* readLines(file: string) {
  const reader = Bun.file(file).stream().getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      yield line
    }
  }
}

// Process without loading entire file
const result = await lazy(readLines('large-file.csv'))
  .map(parseLine)
  .filter((row) => row.value > 100)
  .take(1000)
  .toArray()
```

## Chunked Processing

Process large collections in manageable chunks:

```typescript
const CHUNK_SIZE = 10000

async function processLargeDataset(data: any[]) {
  const collection = collect(data)
  const chunks = collection.chunk(CHUNK_SIZE)
  const results = []

  for (const chunk of chunks) {
    const processed = await processChunk(chunk.toArray())
    results.push(...processed)

    // Optional: Allow GC between chunks
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  return results
}
```

## Avoiding Memory Leaks

```typescript
// Memory leak - closure holds reference
const collection = collect(largeArray)
const processor = () => collection.sum()
// collection cannot be garbage collected

// Better - extract needed data
const sum = collect(largeArray).sum()
const processor = () => sum
// largeArray can be garbage collected
```

## Copy vs Reference

Understand when collections copy data:

```typescript
const original = [1, 2, 3, 4, 5]
const collection = collect(original)

// Most methods create new arrays
const doubled = collection.map((x) => x * 2)
original[0] = 100 // Doesn't affect doubled

// Some methods reference original
const first = collection.first()
```

## Memory-Efficient Patterns

```typescript
// Instead of storing all results
const allResults = collect(data)
  .map(expensiveOperation)
  .toArray()

// Stream and aggregate
const aggregate = collect(data)
  .reduce((acc, item) => {
    const result = expensiveOperation(item)
    return updateAggregate(acc, result)
  }, initialAggregate)
```

## Monitoring Memory

```typescript
function logMemory(label: string) {
  if (typeof process !== 'undefined') {
    const used = process.memoryUsage()
    console.log(`${label}: ${Math.round(used.heapUsed / 1024 / 1024)} MB`)
  }
}

logMemory('Before')
const collection = collect(largeData)
logMemory('After collect')
const result = collection.map(transform).filter(predicate)
logMemory('After transform')
```
