# Collapse Method

The `collapse()` method collapses a collection of arrays into a single, flat collection. This is particularly useful when working with nested arrays or when you need to flatten multi-dimensional array structures.

## Basic Syntax

```typescript
collect(arrays).collapse()
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const collection = collect([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
const collapsed = collection.collapse()

console.log(collapsed.all()) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Working with Objects

```typescript
const users = collect([
  [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ],
  [
    { id: 3, name: 'Bob' },
    { id: 4, name: 'Alice' }
  ]
])

const allUsers = users.collapse()
console.log(allUsers.all())
// [
//   { id: 1, name: 'John' },
//   { id: 2, name: 'Jane' },
//   { id: 3, name: 'Bob' },
//   { id: 4, name: 'Alice' }
// ]
```

### Handling Empty Arrays

```typescript
const mixed = collect([
  [1, 2, 3],
  [],
  [4, 5],
  [],
  [6]
])

const result = mixed.collapse()
console.log(result.all()) // [1, 2, 3, 4, 5, 6]
```

### Real-world Examples

#### Processing Form Data

```typescript
interface FormField {
  name: string
  value: string
}

const formSections = collect([
  // Personal Information Section
  [
    { name: 'firstName', value: 'John' },
    { name: 'lastName', value: 'Doe' }
  ],
  // Contact Information Section
  [
    { name: 'email', value: 'john@example.com' },
    { name: 'phone', value: '555-0123' }
  ],
  // Address Section
  [
    { name: 'street', value: '123 Main St' },
    { name: 'city', value: 'Springfield' }
  ]
])

const allFields = formSections.collapse()
console.log(allFields.all())
// [
//   { name: 'firstName', value: 'John' },
//   { name: 'lastName', value: 'Doe' },
//   { name: 'email', value: 'john@example.com' },
//   { name: 'phone', value: '555-0123' },
//   { name: 'street', value: '123 Main St' },
//   { name: 'city', value: 'Springfield' }
// ]
```

#### Handling API Responses

```typescript
interface Task {
  id: number
  title: string
  completed: boolean
}

// Simulating paginated API responses
const pageResponses = collect([
  // Page 1
  [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ],
  // Page 2
  [
    { id: 3, title: 'Task 3', completed: false },
    { id: 4, title: 'Task 4', completed: true }
  ]
])

const allTasks = pageResponses.collapse()
console.log(allTasks.all())
// [
//   { id: 1, title: 'Task 1', completed: false },
//   { id: 2, title: 'Task 2', completed: true },
//   { id: 3, title: 'Task 3', completed: false },
//   { id: 4, title: 'Task 4', completed: true }
// ]
```

### Combining with Other Methods

```typescript
const data = collect([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
])

// Collapse and then filter even numbers
const evenNumbers = data
  .collapse()
  .filter(num => num % 2 === 0)

console.log(evenNumbers.all()) // [2, 4, 6, 8]

// Collapse and then perform calculations
const sum = data
  .collapse()
  .sum()

console.log(sum) // 45
```

### Type Safety

```typescript
// Type-safe collapse with interfaces
interface TodoItem {
  id: number
  task: string
}

const typedArrays = collect<TodoItem[]>([
  [
    { id: 1, task: 'Buy groceries' },
    { id: 2, task: 'Clean house' }
  ],
  [
    { id: 3, task: 'Do laundry' },
    { id: 4, task: 'Walk dog' }
  ]
])

// Collapsed collection maintains type safety
const typedResult = typedArrays.collapse()
// Type is Collection<TodoItem>

// TypeScript knows about the types
typedResult.each((item) => {
  console.log(item.task) // TypeScript knows 'task' exists
})
```

### Nested Arrays with Mixed Types

```typescript
const mixed = collect([
  [1, 'a', true],
  [2, 'b', false],
  [3, 'c', true]
])

const collapsed = mixed.collapse()
console.log(collapsed.all()) // [1, 'a', true, 2, 'b', false, 3, 'c', true]
```

## Return Value

Returns a new Collection instance with all nested arrays collapsed into a single-level array.

## Note

The `collapse()` method only flattens one level deep. If you need to flatten deeply nested arrays, you might need to call `collapse()` multiple times or use a different approach.
