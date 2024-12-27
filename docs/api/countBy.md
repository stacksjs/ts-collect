# CountBy Method

The `countBy()` method counts the occurrences of values in the collection based on a key or callback function. It returns a Map with the counted values and their frequencies.

## Basic Syntax

```typescript
const key: keyof T = ''

// Count by key
collect(items).countBy(key)

// Count by callback
collect(items).countBy((item: T) => string | number)
```

## Examples

### Basic Usage - Counting by Key

```typescript
import { collect } from 'ts-collect'

interface User {
  id: number
  role: string
  status: 'active' | 'inactive'
}

const users = collect<User>([
  { id: 1, role: 'admin', status: 'active' },
  { id: 2, role: 'user', status: 'active' },
  { id: 3, role: 'user', status: 'inactive' },
  { id: 4, role: 'admin', status: 'active' }
])

// Count by role
const roleCount = users.countBy('role')
console.log(Object.fromEntries(roleCount))
// {
//   admin: 2,
//   user: 2
// }

// Count by status
const statusCount = users.countBy('status')
console.log(Object.fromEntries(statusCount))
// {
//   active: 3,
//   inactive: 1
// }
```

### Counting by Callback Function

```typescript
interface Product {
  id: number
  name: string
  price: number
  category: string
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 1200, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 50, category: 'Electronics' },
  { id: 3, name: 'Desk', price: 300, category: 'Furniture' },
  { id: 4, name: 'Chair', price: 150, category: 'Furniture' }
])

// Count by price range
const priceRanges = products.countBy((product) => {
  if (product.price < 100)
    return 'budget'
  if (product.price < 500)
    return 'medium'
  return 'premium'
})

console.log(Object.fromEntries(priceRanges))
// {
//   budget: 1,
//   medium: 2,
//   premium: 1
// }
```

### Real-world Examples

#### Order Analytics

```typescript
interface Order {
  id: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  total: number
  customerType: 'regular' | 'vip'
}

const orders = collect<Order>([
  { id: 1, status: 'delivered', total: 100, customerType: 'regular' },
  { id: 2, status: 'pending', total: 200, customerType: 'vip' },
  { id: 3, status: 'shipped', total: 150, customerType: 'regular' },
  { id: 4, status: 'delivered', total: 300, customerType: 'vip' }
])

// Count by status
const orderStatus = orders.countBy('status')
console.log(Object.fromEntries(orderStatus))
// {
//   delivered: 2,
//   pending: 1,
//   shipped: 1
// }

// Count by order value category
const orderValues = orders.countBy((order) => {
  if (order.total < 150)
    return 'small'
  if (order.total < 250)
    return 'medium'
  return 'large'
})

console.log(Object.fromEntries(orderValues))
// {
//   small: 1,
//   medium: 1,
//   large: 2
// }
```

#### Student Grades

```typescript
interface Student {
  id: number
  name: string
  grade: number
  course: string
}

const students = collect<Student>([
  { id: 1, name: 'John', grade: 85, course: 'Math' },
  { id: 2, name: 'Jane', grade: 92, course: 'Math' },
  { id: 3, name: 'Bob', grade: 78, course: 'Science' },
  { id: 4, name: 'Alice', grade: 95, course: 'Science' }
])

// Count by grade letter
const gradeCounts = students.countBy((student) => {
  if (student.grade >= 90)
    return 'A'
  if (student.grade >= 80)
    return 'B'
  if (student.grade >= 70)
    return 'C'
  return 'F'
})

console.log(Object.fromEntries(gradeCounts))
// {
//   A: 2,
//   B: 1,
//   C: 1
// }

// Count by course
const courseCounts = students.countBy('course')
console.log(Object.fromEntries(courseCounts))
// {
//   Math: 2,
//   Science: 2
// }
```

### Advanced Usage

#### Custom Data Analysis

```typescript
interface Transaction {
  id: number
  amount: number
  type: 'credit' | 'debit'
  category: string
  date: string
}

const transactions = collect<Transaction>([
  { id: 1, amount: 100, type: 'credit', category: 'salary', date: '2024-01-01' },
  { id: 2, amount: 50, type: 'debit', category: 'food', date: '2024-01-02' },
  { id: 3, amount: 200, type: 'credit', category: 'bonus', date: '2024-01-02' },
  { id: 4, amount: 75, type: 'debit', category: 'utilities', date: '2024-01-03' }
])

// Count by month
const monthlyCount = transactions.countBy(transaction =>
  transaction.date.substring(0, 7)
)

// Count by transaction size
const sizeCount = transactions.countBy((transaction) => {
  if (transaction.amount < 50)
    return 'small'
  if (transaction.amount < 100)
    return 'medium'
  return 'large'
})

console.log(Object.fromEntries(monthlyCount))
// {
//   "2024-01": 4
// }

console.log(Object.fromEntries(sizeCount))
// {
//   medium: 2,
//   large: 2
// }
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  status: 'active' | 'inactive'
  category: string
}

const items = collect<TypedItem>([
  { id: 1, status: 'active', category: 'A' },
  { id: 2, status: 'inactive', category: 'B' }
])

// TypeScript ensures type safety for keys
const byStatus = items.countBy('status') // ✓ Valid
const byCategory = items.countBy('category') // ✓ Valid
// items.countBy('invalid')                 // ✗ TypeScript error

// Type safety with callbacks
const typeChecked = items.countBy((item: TypedItem) => {
  return item.status // TypeScript ensures return type
})
```

## Return Value

Returns a Map object where:

- Keys are the distinct values found by the key or callback function
- Values are the number of occurrences of each key
