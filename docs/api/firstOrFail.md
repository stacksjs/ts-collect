# FirstOrFail Method

The `firstOrFail()` method returns the first element in the collection that passes a given truth test. If no element is found, it throws a CollectionException. This is particularly useful when you expect an element to exist and want to handle its absence as an error condition.

## Basic Syntax

```typescript
// Simple usage
collect(items).firstOrFail()

// With callback
const callback: (item: T) => boolean // optional
collect(items).firstOrFail(callback)

// With default value
const defaultValue: any // optional
collect(items).firstOrFail(defaultValue)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// With data present
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.firstOrFail()) // 1

// With empty collection
try {
  const empty = collect([])
  empty.firstOrFail()
}
catch (error) {
  console.error('Error:', error.message) // "Item not found."
}
```

### Using with Callback

```typescript
interface User {
  id: number
  name: string
  active: boolean
}

const users = collect<User>([
  { id: 1, name: 'John', active: false },
  { id: 2, name: 'Jane', active: true },
  { id: 3, name: 'Bob', active: true }
])

try {
  const activeUser = users.firstOrFail(user => user.active)
  console.log(activeUser) // { id: 2, name: 'Jane', active: true }
}
catch (error) {
  console.error('No active user found')
}
```

### Real-world Examples

#### Database Record Retrieval

```typescript
interface DatabaseRecord {
  id: number
  status: 'active' | 'archived' | 'deleted'
  data: object
}

function findActiveRecord(records: DatabaseRecord[]) {
  try {
    return collect(records).firstOrFail(record => record.status === 'active')
  }
  catch (error) {
    throw new Error('No active record found in the database')
  }
}

// Usage
const records: DatabaseRecord[] = [
  { id: 1, status: 'deleted', data: {} },
  { id: 2, status: 'active', data: { foo: 'bar' } },
  { id: 3, status: 'archived', data: {} }
]

const activeRecord = findActiveRecord(records)
console.log(activeRecord) // { id: 2, status: 'active', data: { foo: 'bar' } }
```

#### User Authentication

```typescript
interface UserSession {
  id: string
  userId: number
  token: string
  expiresAt: Date
  active: boolean
}

function getValidSession(sessions: UserSession[]) {
  const now = new Date()

  try {
    return collect(sessions).firstOrFail(session =>
      session.active && new Date(session.expiresAt) > now
    )
  }
  catch (error) {
    throw new Error('No valid session found')
  }
}

// Usage
const sessions: UserSession[] = [
  {
    id: 's1',
    userId: 1,
    token: 'token1',
    expiresAt: new Date('2024-12-31'),
    active: true
  },
  {
    id: 's2',
    userId: 1,
    token: 'token2',
    expiresAt: new Date('2023-12-31'),
    active: false
  }
]

try {
  const validSession = getValidSession(sessions)
  console.log('Valid session found:', validSession)
}
catch (error) {
  console.error('Session validation failed:', error.message)
}
```

### Error Handling Examples

#### Custom Error Messages

```typescript
interface Product {
  id: number
  name: string
  stock: number
  price: number
}

function findAvailableProduct(products: Product[], minStock: number = 1) {
  try {
    return collect(products).firstOrFail(product => product.stock >= minStock)
  }
  catch (error) {
    throw new Error(`No product found with minimum stock of ${minStock}`)
  }
}

// Usage
const products: Product[] = [
  { id: 1, name: 'Laptop', stock: 0, price: 999 },
  { id: 2, name: 'Mouse', stock: 5, price: 29.99 }
]

try {
  const product = findAvailableProduct(products, 10)
}
catch (error) {
  console.error(error.message) // "No product found with minimum stock of 10"
}
```

### Advanced Usage

#### Chaining with Other Methods

```typescript
interface Task {
  id: number
  priority: number
  status: 'pending' | 'in_progress' | 'completed'
  assignee?: string
}

const tasks = collect<Task>([
  { id: 1, priority: 1, status: 'completed' },
  { id: 2, priority: 2, status: 'pending' },
  { id: 3, priority: 3, status: 'in_progress' }
])

try {
  const highPriorityPending = tasks
    .filter(task => task.status === 'pending')
    .sortByDesc('priority')
    .firstOrFail()

  console.log(highPriorityPending)
  // { id: 2, priority: 2, status: 'pending' }
}
catch (error) {
  console.error('No pending tasks found')
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  optional?: number
}

const items = collect<TypedItem>([
  { id: 1, value: 'first' },
  { id: 2, value: 'second', optional: 42 }
])

// Type-safe callback usage
try {
  const item = items.firstOrFail((item: TypedItem) => {
    return item.optional !== undefined // TypeScript knows about optional
  })
  console.log(item.optional) // TypeScript knows this is safe
}
catch (error) {
  console.error('No item with optional value found')
}
```

## Return Value

- Returns the first element that passes the truth test
- Throws a CollectionException if no element is found
- If a default value is provided and no element is found, returns the default value instead of throwing
