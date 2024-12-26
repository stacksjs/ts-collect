# Chunk Method

The `chunk()` method breaks the collection into smaller arrays of a specified size. This is particularly useful for batch processing, pagination, or creating grid layouts.

## Basic Syntax

```typescript
const size = 5
collect(items).chunk(size)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8])
const chunks = numbers.chunk(3)

console.log(chunks.all())
// [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8]
// ]
```

### With Objects

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
  { id: 4, name: 'Alice' }
])

const chunkedUsers = users.chunk(2)
console.log(chunkedUsers.all())
// [
//   [
//     { id: 1, name: 'John' },
//     { id: 2, name: 'Jane' }
//   ],
//   [
//     { id: 3, name: 'Bob' },
//     { id: 4, name: 'Alice' }
//   ]
// ]
```

### Grid Layout Example

```typescript
interface GridItem {
  id: number
  content: string
}

const gridItems = collect<GridItem>([
  { id: 1, content: 'Item 1' },
  { id: 2, content: 'Item 2' },
  { id: 3, content: 'Item 3' },
  { id: 4, content: 'Item 4' },
  { id: 5, content: 'Item 5' },
  { id: 6, content: 'Item 6' }
])

// Create rows of 3 items each
const grid = gridItems.chunk(3)
console.log(grid.all())
// [
//   [
//     { id: 1, content: 'Item 1' },
//     { id: 2, content: 'Item 2' },
//     { id: 3, content: 'Item 3' }
//   ],
//   [
//     { id: 4, content: 'Item 4' },
//     { id: 5, content: 'Item 5' },
//     { id: 6, content: 'Item 6' }
//   ]
// ]
```

### Batch Processing Example

```typescript
interface Task {
  id: number
  status: 'pending' | 'completed'
  priority: number
}

const tasks = collect<Task>([
  { id: 1, status: 'pending', priority: 1 },
  { id: 2, status: 'pending', priority: 2 },
  { id: 3, status: 'pending', priority: 1 },
  { id: 4, status: 'pending', priority: 3 },
  { id: 5, status: 'pending', priority: 2 }
])

// Process tasks in batches of 2
const batches = tasks.chunk(2)

// Simulate batch processing
batches.each((batch) => {
  console.log('Processing batch:', batch)
  // Process each batch here
})
```

### Pagination Example

```typescript
interface Post {
  id: number
  title: string
  content: string
}

const posts = collect<Post>([
  { id: 1, title: 'Post 1', content: 'Content 1' },
  { id: 2, title: 'Post 2', content: 'Content 2' },
  { id: 3, title: 'Post 3', content: 'Content 3' },
  { id: 4, title: 'Post 4', content: 'Content 4' },
  { id: 5, title: 'Post 5', content: 'Content 5' }
])

const itemsPerPage = 2
const pages = posts.chunk(itemsPerPage)

// Get specific page
const pageNumber = 1 // (0-based index)
const currentPage = pages.get(pageNumber)
console.log('Current page:', currentPage)
// [
//   { id: 3, title: 'Post 3', content: 'Content 3' },
//   { id: 4, title: 'Post 4', content: 'Content 4' }
// ]
```

### Working with Uneven Chunks

```typescript
const numbers = collect([1, 2, 3, 4, 5])
const chunks = numbers.chunk(2)

console.log(chunks.all())
// [
//   [1, 2],
//   [3, 4],
//   [5]    // Last chunk may be smaller
// ]
```

### Combining with Other Methods

```typescript
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

const evenChunks = numbers
  .filter(n => n % 2 === 0) // Get even numbers
  .chunk(2) // Group in pairs

console.log(evenChunks.all())
// [
//   [2, 4],
//   [6, 8],
//   [10]
// ]
```

## Type Safety

The chunk method maintains type safety throughout the operation:

```typescript
interface User {
  id: number
  name: string
}

const users = collect<User>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

// Type is Collection<User[]>
const chunkedUsers = users.chunk(1)

// TypeScript will ensure type safety when working with chunks
chunkedUsers.each((chunk) => {
  chunk.forEach((user) => {
    console.log(user.name) // TypeScript knows 'name' exists
  })
})
```

## Return Value

Returns a new Collection instance containing arrays of the specified chunk size. The last chunk may contain fewer items if the collection cannot be divided evenly.
