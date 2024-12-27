# FirstWhere Method

The `firstWhere()` method returns the first element in the collection with a matching key-value pair. This method is particularly useful for finding records that match specific criteria.

## Basic Syntax

```typescript
// Simple usage
const key: keyof T
const value: any
collect(items).firstWhere(key, value)

// With operator
const operation: string
collect(items).firstWhere(key, operator, value)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

interface User {
  id: number
  name: string
  age: number
}

const users = collect<User>([
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
])

// Find first user with name 'Jane'
const jane = users.firstWhere('name', 'Jane')
console.log(jane) // { id: 2, name: 'Jane', age: 30 }
```

### Using with Operators

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 1200, stock: 5 },
  { id: 2, name: 'Mouse', price: 50, stock: 10 },
  { id: 3, name: 'Keyboard', price: 100, stock: 15 }
])

// Find first product with price greater than 500
const expensive = products.firstWhere('price', '>', 500)
console.log(expensive) // { id: 1, name: 'Laptop', price: 1200, stock: 5 }

// Find first product with stock less than or equal to 10
const lowStock = products.firstWhere('stock', '<=', 10)
console.log(lowStock) // { id: 1, name: 'Laptop', price: 1200, stock: 5 }
```

### Real-world Examples

#### Order Processing

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  total: number
  customerName: string
  priority: number
}

const orders = collect<Order>([
  {
    id: 'ORD001',
    status: 'pending',
    total: 100,
    customerName: 'John Doe',
    priority: 1
  },
  {
    id: 'ORD002',
    status: 'processing',
    total: 200,
    customerName: 'Jane Smith',
    priority: 2
  },
  {
    id: 'ORD003',
    status: 'pending',
    total: 300,
    customerName: 'Bob Johnson',
    priority: 3
  }
])

// Find first high-priority pending order
const highPriorityOrder = orders
  .where('status', 'pending')
  .firstWhere('priority', '>', 2)

console.log(highPriorityOrder)
// {
//   id: 'ORD003',
//   status: 'pending',
//   total: 300,
//   customerName: 'Bob Johnson',
//   priority: 3
// }
```

#### User Authentication

```typescript
interface Session {
  id: string
  userId: number
  token: string
  lastActive: string
  isValid: boolean
}

const sessions = collect<Session>([
  {
    id: 'sess_1',
    userId: 1,
    token: 'token1',
    lastActive: '2024-01-01',
    isValid: false
  },
  {
    id: 'sess_2',
    userId: 1,
    token: 'token2',
    lastActive: '2024-01-02',
    isValid: true
  },
  {
    id: 'sess_3',
    userId: 2,
    token: 'token3',
    lastActive: '2024-01-03',
    isValid: true
  }
])

function findValidUserSession(userId: number) {
  return sessions
    .where('isValid', true)
    .firstWhere('userId', userId)
}

const userSession = findValidUserSession(1)
console.log(userSession)
// {
//   id: 'sess_2',
//   userId: 1,
//   token: 'token2',
//   lastActive: '2024-01-02',
//   isValid: true
// }
```

### Working with Complex Data

```typescript
interface Employee {
  id: number
  name: string
  department: string
  performance: {
    rating: number
    lastReview: string
  }
  salary: number
}

const employees = collect<Employee>([
  {
    id: 1,
    name: 'John',
    department: 'IT',
    performance: { rating: 4.5, lastReview: '2024-01-01' },
    salary: 70000
  },
  {
    id: 2,
    name: 'Jane',
    department: 'HR',
    performance: { rating: 4.8, lastReview: '2024-01-02' },
    salary: 65000
  },
  {
    id: 3,
    name: 'Bob',
    department: 'IT',
    performance: { rating: 4.2, lastReview: '2024-01-03' },
    salary: 72000
  }
])

// Find first IT employee with salary above 71000
const highPaidIT = employees
  .where('department', 'IT')
  .firstWhere('salary', '>', 71000)

console.log(highPaidIT)
// {
//   id: 3,
//   name: 'Bob',
//   department: 'IT',
//   performance: { rating: 4.2, lastReview: '2024-01-03' },
//   salary: 72000
// }
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  required: string
  optional?: number
  status: 'active' | 'inactive'
}

const items = collect<TypedItem>([
  { id: 1, required: 'foo', status: 'active' },
  { id: 2, required: 'bar', optional: 42, status: 'inactive' }
])

// TypeScript ensures type safety for keys and values
const item1 = items.firstWhere('status', 'active') // ✓ Valid
const item2 = items.firstWhere('optional', '>', 40) // ✓ Valid
// items.firstWhere('nonexistent', 'value')                  // ✗ TypeScript error
// items.firstWhere('status', 'invalid')                     // ✗ TypeScript error
```

## Return Value

- Returns the first element that matches the given key-value pair
- Returns `undefined` if no matching element is found
- When using operators, returns the first element that satisfies the comparison
