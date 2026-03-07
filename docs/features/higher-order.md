# Higher-Order Methods

Leverage higher-order methods for advanced collection manipulation.

## Overview

Higher-order methods accept functions as arguments, enabling powerful and flexible collection transformations.

## tap

Perform side effects without breaking the chain:

```typescript
import { collect } from 'ts-collect'

const result = collect([1, 2, 3, 4, 5])
  .filter((n) => n > 2)
  .tap((collection) => {
    console.log('After filter:', collection.toArray())
  })
  .map((n) => n * 2)
  .tap((collection) => {
    console.log('After map:', collection.toArray())
  })
  .sum()
```

## pipe

Transform the entire collection:

```typescript
const users = collect([
  { name: 'John', score: 85 },
  { name: 'Jane', score: 92 },
  { name: 'Bob', score: 78 },
])

const topPerformers = users.pipe((collection) =>
  collection
    .filter((u) => u.score >= 80)
    .sortByDesc('score')
    .pluck('name')
)
// Collection(['Jane', 'John'])
```

## when

Conditional transformation:

```typescript
const includeInactive = true

const users = collect(allUsers)
  .when(includeInactive, (collection) =>
    collection // Include all
  )
  .when(!includeInactive, (collection) =>
    collection.where('active', true)
  )
```

## unless

Inverse of when:

```typescript
const isAdmin = false

const data = collect(items)
  .unless(isAdmin, (collection) =>
    collection.where('public', true)
  )
```

## each

Iterate with side effects:

```typescript
collect([1, 2, 3, 4, 5])
  .each((item, index) => {
    console.log(`Item ${index}: ${item}`)
  })

// Can return false to break early
collect([1, 2, 3, 4, 5])
  .each((item) => {
    console.log(item)
    if (item === 3) return false // Stop iteration
  })
```

## eachSpread

Spread array items as arguments:

```typescript
const pairs = collect([
  ['John', 30],
  ['Jane', 25],
  ['Bob', 35],
])

pairs.eachSpread((name, age) => {
  console.log(`${name} is ${age} years old`)
})
```

## times

Create collection by repeating a callback:

```typescript
const fiveRandoms = collect().times(5, (index) =>
  Math.random()
)
// Collection([0.123, 0.456, 0.789, 0.012, 0.345])

const users = collect().times(3, (i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
}))
```

## macro

Define custom methods:

```typescript
import { Collection } from 'ts-collect'

// Add custom method
Collection.macro('toUpperCase', function (this: Collection<string>) {
  return this.map((s) => s.toUpperCase())
})

// Use it
const names = collect(['john', 'jane', 'bob'])
  .toUpperCase()
// Collection(['JOHN', 'JANE', 'BOB'])
```

## Composition Patterns

Compose complex operations:

```typescript
// Define reusable transformations
const withPagination = (page: number, perPage: number) =>
  <T>(collection: Collection<T>) =>
    collection.forPage(page, perPage)

const withSorting = (key: string, direction: 'asc' | 'desc') =>
  <T>(collection: Collection<T>) =>
    direction === 'asc'
      ? collection.sortBy(key)
      : collection.sortByDesc(key)

// Compose them
const users = collect(allUsers)
  .pipe(withSorting('name', 'asc'))
  .pipe(withPagination(1, 10))
```
