# Duplicates Method

The `duplicates()` method retrieves all duplicate elements from the collection. For arrays with objects, you can specify a key to check for duplicates based on that property.

## Basic Syntax

```typescript
// For simple arrays
collect(items).duplicates()

// For arrays of objects with a key
collect(items).duplicates(key)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array duplicates
const numbers = collect([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])
console.log(numbers.duplicates().all())
// [2, 2, 3, 3, 3, 4, 4, 4, 4]

// String array duplicates
const words = collect(['apple', 'banana', 'apple', 'cherry', 'banana'])
console.log(words.duplicates().all())
// ['apple', 'banana']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'John', role: 'user' },
  { id: 4, name: 'Bob', role: 'user' }
])

// Find duplicates by name
console.log(users.duplicates('name').all())
// [
//   { id: 3, name: 'John', role: 'user' }
// ]

// Find duplicates by role
console.log(users.duplicates('role').all())
// [
//   { id: 2, name: 'Jane', role: 'user' },
//   { id: 3, name: 'John', role: 'user' },
//   { id: 4, name: 'Bob', role: 'user' }
// ]
```

### Real-world Examples

#### Email Validation

```typescript
interface EmailSubscriber {
  id: number
  email: string
  subscriptionDate: string
}

const subscribers = collect<EmailSubscriber>([
  { id: 1, email: 'john@example.com', subscriptionDate: '2024-01-01' },
  { id: 2, email: 'jane@example.com', subscriptionDate: '2024-01-02' },
  { id: 3, email: 'john@example.com', subscriptionDate: '2024-01-03' },
  { id: 4, email: 'bob@example.com', subscriptionDate: '2024-01-04' }
])

// Find duplicate email subscriptions
const duplicateEmails = subscribers.duplicates('email')
console.log(duplicateEmails.all())
// [
//   { id: 3, email: 'john@example.com', subscriptionDate: '2024-01-03' }
// ]
```

#### Product Inventory

```typescript
interface Product {
  sku: string
  name: string
  category: string
  location: string
}

const inventory = collect<Product>([
  { sku: 'A001', name: 'Laptop', category: 'Electronics', location: 'Warehouse A' },
  { sku: 'A002', name: 'Phone', category: 'Electronics', location: 'Warehouse B' },
  { sku: 'A001', name: 'Laptop', category: 'Electronics', location: 'Warehouse C' },
  { sku: 'B001', name: 'Desk', category: 'Furniture', location: 'Warehouse A' }
])

// Find duplicate SKUs
const duplicateSkus = inventory.duplicates('sku')
console.log(duplicateSkus.all())
// [
//   { sku: 'A001', name: 'Laptop', category: 'Electronics', location: 'Warehouse C' }
// ]

// Find items with duplicate locations
const duplicateLocations = inventory.duplicates('location')
console.log(duplicateLocations.all())
// [
//   { sku: 'B001', name: 'Desk', category: 'Furniture', location: 'Warehouse A' }
// ]
```

### Complex Examples

#### Transaction Analysis

```typescript
interface Transaction {
  id: string
  accountId: string
  amount: number
  type: 'credit' | 'debit'
  timestamp: string
}

const transactions = collect<Transaction>([
  { id: 't1', accountId: 'acc1', amount: 100, type: 'credit', timestamp: '2024-01-01T10:00:00' },
  { id: 't2', accountId: 'acc1', amount: 100, type: 'credit', timestamp: '2024-01-01T10:00:01' },
  { id: 't3', accountId: 'acc2', amount: 200, type: 'debit', timestamp: '2024-01-01T10:00:02' },
  { id: 't4', accountId: 'acc1', amount: 100, type: 'credit', timestamp: '2024-01-01T10:00:03' }
])

// Find duplicate transactions (same account, amount, and type)
interface TransactionKey {
  accountId: string
  amount: number
  type: string
}

const duplicateTransactions = transactions.duplicates((transaction): string => {
  return `${transaction.accountId}-${transaction.amount}-${transaction.type}`
})

console.log(duplicateTransactions.all())
// [
//   { id: 't2', accountId: 'acc1', amount: 100, type: 'credit', timestamp: '2024-01-01T10:00:01' },
//   { id: 't4', accountId: 'acc1', amount: 100, type: 'credit', timestamp: '2024-01-01T10:00:03' }
// ]
```

#### Course Enrollment

```typescript
interface Enrollment {
  studentId: number
  courseId: string
  semester: string
  status: 'active' | 'completed' | 'dropped'
}

const enrollments = collect<Enrollment>([
  { studentId: 1, courseId: 'CS101', semester: 'Fall 2024', status: 'active' },
  { studentId: 2, courseId: 'CS101', semester: 'Fall 2024', status: 'active' },
  { studentId: 1, courseId: 'CS101', semester: 'Spring 2024', status: 'completed' },
  { studentId: 1, courseId: 'CS102', semester: 'Fall 2024', status: 'active' }
])

// Find students enrolled in the same course multiple times
const duplicateEnrollments = enrollments.duplicates(enrollment =>
  `${enrollment.studentId}-${enrollment.courseId}`
)

console.log(duplicateEnrollments.all())
// [
//   { studentId: 1, courseId: 'CS101', semester: 'Spring 2024', status: 'completed' }
// ]
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
  { id: 2, code: 'A', value: 200 },
  { id: 3, code: 'B', value: 300 }
])

// Type-safe key usage
const duplicateCodes = items.duplicates('code') // ✓ Valid
// const invalid = items.duplicates('invalid')       // ✗ TypeScript error

// Type-safe callback
const duplicateValues = items.duplicates((item: TypedItem) => item.value.toString())
```

## Return Value

Returns a new Collection containing:

- For simple arrays: all elements that appear more than once
- For object arrays with a key: all objects where the specified key's value appears more than once
- For callback functions: all elements where the callback's return value appears more than once
