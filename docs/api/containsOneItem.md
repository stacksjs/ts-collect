# ContainsOneItem Method

The `containsOneItem()` method determines if the collection contains exactly one element. This is useful for validations and checking unique conditions.

## Basic Syntax

```typescript
collect(items).containsOneItem()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const single = collect([1])
console.log(single.containsOneItem()) // true

const multiple = collect([1, 2, 3])
console.log(multiple.containsOneItem()) // false

const empty = collect([])
console.log(empty.containsOneItem()) // false
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
}

const singleUser = collect<User>([
  { id: 1, name: 'John' }
])
console.log(singleUser.containsOneItem()) // true

const multipleUsers = collect<User>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])
console.log(multipleUsers.containsOneItem()) // false
```

### Real-world Examples

#### Validation Checks

```typescript
interface ValidationResult {
  field: string
  errors: string[]
}

function hasOnlyOneError(result: ValidationResult): boolean {
  return collect(result.errors).containsOneItem()
}

// Example usage
const valid = { field: 'email', errors: ['Invalid format'] }
console.log(hasOnlyOneError(valid)) // true

const invalid = { field: 'password', errors: ['Too short', 'Needs number'] }
console.log(hasOnlyOneError(invalid)) // false
```

#### Active Session Check

```typescript
interface Session {
  id: string
  userId: number
  active: boolean
}

function hasUniquePlatformSession(sessions: Session[]): boolean {
  const activeSessions = collect(sessions)
    .filter(session => session.active)

  return activeSessions.containsOneItem()
}

// Example usage
const sessions = [
  { id: 'a1', userId: 1, active: true },
  { id: 'a2', userId: 1, active: false },
  { id: 'a3', userId: 1, active: false }
]

console.log(hasUniquePlatformSession(sessions)) // true
```

### Combining with Other Methods

```typescript
interface Task {
  id: number
  status: 'pending' | 'in-progress' | 'completed'
  priority: number
}

const tasks = collect<Task>([
  { id: 1, status: 'pending', priority: 1 },
  { id: 2, status: 'in-progress', priority: 2 },
  { id: 3, status: 'completed', priority: 3 }
])

// Check if there's exactly one task in progress
const hasOneInProgress = tasks
  .filter(task => task.status === 'in-progress')
  .containsOneItem()

console.log(hasOneInProgress) // true

// Check if there's exactly one high-priority task
const hasOneHighPriority = tasks
  .filter(task => task.priority > 2)
  .containsOneItem()

console.log(hasOneHighPriority) // true
```

### Business Logic Examples

```typescript
interface Product {
  id: number
  name: string
  featured: boolean
}

function hasValidFeaturedProduct(products: Product[]): boolean {
  return collect(products)
    .filter(product => product.featured)
    .containsOneItem()
}

// Example usage
const products = [
  { id: 1, name: 'Product A', featured: true },
  { id: 2, name: 'Product B', featured: false },
  { id: 3, name: 'Product C', featured: false }
]

console.log(hasValidFeaturedProduct(products)) // true
```

### Error Handling

```typescript
interface ApiResponse<T> {
  data: T | null
  errors: string[]
}

function hasOnlySingleError<T>(response: ApiResponse<T>): boolean {
  return collect(response.errors).containsOneItem()
}

// Example usage
const response1: ApiResponse<string> = {
  data: null,
  errors: ['Invalid token']
}
console.log(hasOnlySingleError(response1)) // true

const response2: ApiResponse<string> = {
  data: null,
  errors: ['Invalid token', 'Server error']
}
console.log(hasOnlySingleError(response2)) // false
```

## Type Safety

```typescript
// The method works with any type
const numbers = collect([1])
const strings = collect(['hello'])
const objects = collect([{ key: 'value' }])

console.log(numbers.containsOneItem()) // true
console.log(strings.containsOneItem()) // true
console.log(objects.containsOneItem()) // true
```

## Return Value

Returns a boolean value:

- `true` if the collection contains exactly one element
- `false` if the collection is empty or contains more than one element
