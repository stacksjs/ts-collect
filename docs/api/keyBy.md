# KeyBy Method

The `keyBy()` method keys the collection by the given key. If multiple items have the same key, later values will overwrite previous ones.

## Basic Syntax

```typescript
// Key by property
collect(items).keyBy(key: keyof T)

// Key by callback
collect(items).keyBy(callback: (item: T) => string | number)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

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

// Key by id
const usersById = users.keyBy('id')
console.log(usersById.all())
// {
//   '1': { id: 1, name: 'John', email: 'john@example.com' },
//   '2': { id: 2, name: 'Jane', email: 'jane@example.com' },
//   '3': { id: 3, name: 'Bob', email: 'bob@example.com' }
// }
```

### Using Callback Function

```typescript
interface Product {
  id: number
  name: string
  category: string
  sku: string
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', category: 'Electronics', sku: 'LAP001' },
  { id: 2, name: 'Mouse', category: 'Electronics', sku: 'MOU001' },
  { id: 3, name: 'Desk', category: 'Furniture', sku: 'DSK001' }
])

// Key by custom SKU format
const productsBySku = products.keyBy(product => `SKU-${product.sku}`)
console.log(productsBySku.all())
// {
//   'SKU-LAP001': { id: 1, name: 'Laptop', category: 'Electronics', sku: 'LAP001' },
//   'SKU-MOU001': { id: 2, name: 'Mouse', category: 'Electronics', sku: 'MOU001' },
//   'SKU-DSK001': { id: 3, name: 'Desk', category: 'Furniture', sku: 'DSK001' }
// }
```

### Real-world Examples

#### User Session Management

```typescript
interface Session {
  sessionId: string
  userId: number
  lastActivity: Date
  device: string
}

const sessions = collect<Session>([
  { sessionId: 'a1', userId: 1, lastActivity: new Date(), device: 'desktop' },
  { sessionId: 'b2', userId: 2, lastActivity: new Date(), device: 'mobile' },
  { sessionId: 'c3', userId: 1, lastActivity: new Date(), device: 'tablet' }
])

// Key sessions by user ID for quick lookup
const sessionsByUser = sessions.keyBy('userId')
console.log(sessionsByUser.all())
// {
//   '1': { sessionId: 'c3', userId: 1, lastActivity: Date, device: 'tablet' },
//   '2': { sessionId: 'b2', userId: 2, lastActivity: Date, device: 'mobile' }
// }
```

#### Cache Management

```typescript
interface CacheItem {
  key: string
  value: any
  expiry: Date
  tags: string[]
}

class CacheManager {
  private cache: Collection<{ [key: string]: CacheItem }>

  constructor(items: CacheItem[]) {
    this.cache = collect(items).keyBy('key')
  }

  get(key: string): any {
    const item = this.cache.get(key)
    if (!item || item.expiry < new Date()) {
      return null
    }
    return item.value
  }

  getByTag(tag: string): CacheItem[] {
    return this.cache
      .filter(item => item.tags.includes(tag))
      .all()
  }
}

// Usage
const cacheItems: CacheItem[] = [
  { key: 'user:1', value: { name: 'John' }, expiry: new Date(), tags: ['user'] },
  { key: 'settings:1', value: { theme: 'dark' }, expiry: new Date(), tags: ['settings'] }
]

const cache = new CacheManager(cacheItems)
```

### Advanced Usage

#### Multi-level Grouping

```typescript
interface Order {
  id: number
  customerId: number
  status: string
  date: string
  total: number
}

const orders = collect<Order>([
  { id: 1, customerId: 1, status: 'pending', date: '2024-01-01', total: 100 },
  { id: 2, customerId: 2, status: 'completed', date: '2024-01-01', total: 200 },
  { id: 3, customerId: 1, status: 'completed', date: '2024-01-02', total: 300 }
])

// Key by composite key using callback
const ordersByCustomerAndDate = orders.keyBy(order =>
  `${order.customerId}-${order.date}`
)

console.log(ordersByCustomerAndDate.all())
// {
//   '1-2024-01-01': { id: 1, customerId: 1, status: 'pending', date: '2024-01-01', total: 100 },
//   '2-2024-01-01': { id: 2, customerId: 2, status: 'completed', date: '2024-01-01', total: 200 },
//   '1-2024-01-02': { id: 3, customerId: 1, status: 'completed', date: '2024-01-02', total: 300 }
// }
```

#### Dynamic Key Generation

```typescript
interface Student {
  id: number
  firstName: string
  lastName: string
  grade: number
}

const students = collect<Student>([
  { id: 1, firstName: 'John', lastName: 'Doe', grade: 85 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', grade: 92 },
  { id: 3, firstName: 'Bob', lastName: 'Johnson', grade: 78 }
])

// Key by full name
const studentsByName = students.keyBy(student =>
  `${student.lastName}, ${student.firstName}`
)

// Key by grade range
const studentsByGrade = students.keyBy((student) => {
  if (student.grade >= 90)
    return 'A'
  if (student.grade >= 80)
    return 'B'
  return 'C'
})
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  code: string
  value: number
}

const items = collect<TypedItem>([
  { id: 1, code: 'A', value: 100 },
  { id: 2, code: 'B', value: 200 }
])

// TypeScript ensures type safety
const byId = items.keyBy('id') // ✓ Valid
const byCode = items.keyBy('code') // ✓ Valid
// items.keyBy('nonexistent')          // ✗ TypeScript error

// Type-safe callback
const byCustomKey = items.keyBy((item: TypedItem) => {
  return `${item.code}-${item.id}`
})
```

## Return Value

Returns a new Collection instance with:

- Keys based on the specified property or callback result
- Values as the original items
- Later items overwrite earlier items with the same key
