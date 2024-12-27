# Each Method

The `each()` method iterates over the items in the collection and passes each item to a callback function. This method can be used to iterate through and perform actions on each element in the collection.

## Basic Syntax

```typescript
const callback: (item: T, index?: number) => void
collect(items).each(callback)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

numbers.each((number, index) => {
  console.log(`Number at position ${index}: ${number}`)
})

// Output:
// Number at position 0: 1
// Number at position 1: 2
// Number at position 2: 3
// Number at position 3: 4
// Number at position 4: 5
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
  { id: 3, name: 'Bob', email: 'bob@example.com' }
])

users.each((user, index) => {
  console.log(`User ${index + 1}: ${user.name} (${user.email})`)
})

// Output:
// User 1: John (john@example.com)
// User 2: Jane (jane@example.com)
// User 3: Bob (bob@example.com)
```

### Modifying Items

```typescript
interface Product {
  id: number
  name: string
  price: number
  discounted?: boolean
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Mouse', price: 50 },
  { id: 3, name: 'Keyboard', price: 100 }
])

// Apply discount to expensive items
products.each((product) => {
  if (product.price > 500) {
    product.price *= 0.9 // 10% discount
    product.discounted = true
  }
})

console.log(products.all())
// [
//   { id: 1, name: 'Laptop', price: 900, discounted: true },
//   { id: 2, name: 'Mouse', price: 50 },
//   { id: 3, name: 'Keyboard', price: 100 }
// ]
```

### Real-world Examples

#### Form Validation

```typescript
interface FormField {
  name: string
  value: string
  valid: boolean
  errors: string[]
}

const formFields = collect<FormField>([
  { name: 'email', value: 'test@', valid: true, errors: [] },
  { name: 'password', value: '123', valid: true, errors: [] },
  { name: 'name', value: '', valid: true, errors: [] }
])

formFields.each((field) => {
  field.errors = []
  field.valid = true

  switch (field.name) {
    case 'email':
      if (!field.value.includes('@') || !field.value.includes('.')) {
        field.errors.push('Invalid email format')
        field.valid = false
      }
      break
    case 'password':
      if (field.value.length < 6) {
        field.errors.push('Password too short')
        field.valid = false
      }
      break
    case 'name':
      if (field.value.length === 0) {
        field.errors.push('Name is required')
        field.valid = false
      }
      break
  }
})
```

#### Data Processing Pipeline

```typescript
interface DataPoint {
  timestamp: string
  value: number
  processed: boolean
  normalized?: number
}

const dataset = collect<DataPoint>([
  { timestamp: '2024-01-01', value: 100, processed: false },
  { timestamp: '2024-01-02', value: 150, processed: false },
  { timestamp: '2024-01-03', value: 200, processed: false }
])

// Process each data point
const maxValue = Math.max(...dataset.pluck('value'))

dataset.each((point) => {
  // Normalize values
  point.normalized = point.value / maxValue
  point.processed = true
})
```

### Chaining with Other Methods

```typescript
interface Task {
  id: number
  title: string
  completed: boolean
  priority: number
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', completed: false, priority: 1 },
  { id: 2, title: 'Task 2', completed: false, priority: 2 },
  { id: 3, title: 'Task 3', completed: true, priority: 3 }
])

// Process only incomplete high-priority tasks
tasks
  .filter(task => !task.completed && task.priority > 1)
  .each((task) => {
    console.log(`Processing high priority task: ${task.title}`)
  })
```

### Break Early Pattern

```typescript
interface LogEntry {
  id: number
  level: 'info' | 'warning' | 'error'
  message: string
}

const logs = collect<LogEntry>([
  { id: 1, level: 'info', message: 'Application started' },
  { id: 2, level: 'warning', message: 'High memory usage' },
  { id: 3, level: 'error', message: 'Connection failed' },
  { id: 4, level: 'info', message: 'Process completed' }
])

let foundError = false

logs.each((log) => {
  if (log.level === 'error') {
    console.log('Error found:', log.message)
    foundError = true
    return false // Stop iteration
  }
})
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  optional?: number
}

const items = collect<TypedItem>([
  { id: 1, value: 'one' },
  { id: 2, value: 'two', optional: 42 }
])

// TypeScript ensures type safety in the callback
items.each((item: TypedItem, index: number) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.optional) // ✓ Valid (possibly undefined)
  // console.log(item.invalid) // ✗ TypeScript error
})
```

## Return Value

- Returns the collection instance for method chaining
- If the callback returns `false`, the iteration will be stopped early
