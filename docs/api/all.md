# All Method

The `all()` method returns all items in the collection as a plain array. This is particularly useful when you need to get the underlying array after performing collection operations.

## Basic Syntax

```typescript
collect(items).all()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const collection = collect([1, 2, 3, 4, 5])
console.log(collection.all()) // [1, 2, 3, 4, 5]
```

### With Objects

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])

console.log(users.all())
// [
//   { id: 1, name: 'John' },
//   { id: 2, name: 'Jane' }
// ]
```

### After Transformations

```typescript
const result = collect([1, 2, 3, 4])
  .map(number => number * 2)
  .all()

console.log(result) // [2, 4, 6, 8]
```

### With Mixed Types

```typescript
const mixed = collect(['string', 1, { key: 'value' }, true])
console.log(mixed.all()) // ['string', 1, { key: 'value' }, true]
```

### After Filtering

```typescript
const filtered = collect([1, 2, 3, 4, 5])
  .filter(number => number > 3)
  .all()

console.log(filtered) // [4, 5]
```

### With Complex Objects

```typescript
interface User {
  id: number
  name: string
  settings: {
    theme: string
    notifications: boolean
  }
}

const users = collect<User>([
  {
    id: 1,
    name: 'John',
    settings: {
      theme: 'dark',
      notifications: true,
    },
  },
  {
    id: 2,
    name: 'Jane',
    settings: {
      theme: 'light',
      notifications: false,
    },
  },
])

console.log(users.all())
// [
//   {
//     id: 1,
//     name: 'John',
//     settings: {
//       theme: 'dark',
//       notifications: true,
//     },
//   },
//   {
//     id: 2,
//     name: 'Jane',
//     settings: {
//       theme: 'light',
//       notifications: false,
//     },
//   },
// ]
```

### In Combination with Other Methods

```typescript
const result = collect([1, 2, 3, 4, 5])
  .map(n => n * 2) // Multiply each number by 2
  .filter(n => n > 5) // Keep numbers greater than 5
  .sort((a, b) => b - a) // Sort in descending order
  .all()

console.log(result) // [10, 8, 6]
```

### Empty Collections

```typescript
const empty = collect([])
console.log(empty.all()) // []
```

## Type Safety

The `all()` method preserves the type of the collection items:

```typescript
const numbers: number[] = collect([1, 2, 3]).all() // Type: number[]
const strings: string[] = collect(['a', 'b', 'c']).all() // Type: string[]
```

## Return Value

Returns a plain array containing all the items in the collection. The returned array is a new instance, so modifications to it won't affect the original collection.
