# Custom Iterators

Create custom iterators for specialized collection behavior.

## Overview

ts-collect supports custom iterators, enabling you to create specialized data sources and processing pipelines.

## Basic Custom Iterator

```typescript
import { collect } from 'ts-collect'

// Generator function as iterator
function* fibonacci(limit: number) {
  let [a, b] = [0, 1]
  while (a < limit) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

const fibs = collect(fibonacci(1000))
console.log(fibs.toArray())
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987]
```

## Infinite Iterators

Handle infinite sequences with lazy evaluation:

```typescript
import { lazy } from 'ts-collect'

// Infinite sequence
function* naturals() {
  let n = 0
  while (true) {
    yield n++
  }
}

// Take only what you need
const firstTen = lazy(naturals())
  .filter((n) => n % 2 === 0)
  .take(10)
  .toArray()
// [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

## Async Iterators

Process async data streams:

```typescript
async function* fetchPages(baseUrl: string) {
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(`${baseUrl}?page=${page}`)
    const data = await response.json()

    yield* data.items
    hasMore = data.hasMore
    page++
  }
}

// Process all pages
const allItems = await lazy(fetchPages('/api/items'))
  .filter((item) => item.active)
  .take(100)
  .toArray()
```

## Custom Iterable Class

```typescript
class Range implements Iterable<number> {
  constructor(
    private start: number,
    private end: number,
    private step: number = 1
  ) {}

  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i += this.step) {
      yield i
    }
  }
}

const range = new Range(0, 100, 5)
const evens = collect(range)
  .filter((n) => n % 2 === 0)
  .toArray()
// [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
```

## Combining Iterators

```typescript
function* interleave<T>(...iterators: Iterable<T>[]) {
  const iters = iterators.map((it) => it[Symbol.iterator]())

  while (true) {
    let allDone = true

    for (const iter of iters) {
      const { value, done } = iter.next()
      if (!done) {
        allDone = false
        yield value
      }
    }

    if (allDone) break
  }
}

const combined = collect(
  interleave([1, 2, 3], ['a', 'b', 'c'], [true, false])
)
// [1, 'a', true, 2, 'b', false, 3, 'c']
```

## Transform Iterators

Create reusable iterator transformers:

```typescript
function* batch<T>(source: Iterable<T>, size: number) {
  let batch: T[] = []

  for (const item of source) {
    batch.push(item)
    if (batch.length === size) {
      yield batch
      batch = []
    }
  }

  if (batch.length > 0) {
    yield batch
  }
}

const batches = collect(batch([1, 2, 3, 4, 5, 6, 7], 3))
// [[1, 2, 3], [4, 5, 6], [7]]
```
