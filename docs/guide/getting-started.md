# Getting Started

This guide will help you get started with ts-collect, a powerful collections library for TypeScript.

## Installation

Install ts-collect using your preferred package manager:

```bash
# Using bun
bun add ts-collect

# Using npm
npm install ts-collect

# Using yarn
yarn add ts-collect

# Using pnpm
pnpm add ts-collect
```

## Basic Usage

### Creating Collections

Import the `collect` function and create a collection from any array:

```typescript
import { collect } from 'ts-collect'

// From an array of numbers
const numbers = collect([1, 2, 3, 4, 5])

// From an array of objects
const users = collect([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' },
])
```

### Chaining Operations

All collection methods return a new collection, enabling fluent method chaining:

```typescript
const result = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(n => n % 2 === 0)    // [2, 4, 6, 8, 10]
  .map(n => n * 10)            // [20, 40, 60, 80, 100]
  .take(3)                      // [20, 40, 60]
  .toArray()

console.log(result) // [20, 40, 60]
```

### Type Safety

ts-collect is fully typed, providing excellent IDE support and type checking:

```typescript
interface Product {
  id: number
  name: string
  price: number
  category: string
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
  { id: 2, name: 'Chair', price: 299, category: 'Furniture' },
  { id: 3, name: 'Headphones', price: 199, category: 'Electronics' },
])

// Type-safe operations
const electronics = products.where('category', 'Electronics')
const names = products.pluck('name') // TypeScript knows this is CollectionOperations<string>
const total = products.sum('price')  // TypeScript knows this returns number
```

## Common Operations

### Transforming Data

```typescript
const users = collect([
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' },
])

// Map to new structure
const fullNames = users
  .map(user => `${user.firstName} ${user.lastName}`)
  .toArray() // ['John Doe', 'Jane Smith']
```

### Filtering Data

```typescript
const products = collect([
  { name: 'Laptop', price: 999, inStock: true },
  { name: 'Phone', price: 699, inStock: false },
  { name: 'Tablet', price: 499, inStock: true },
])

// Filter with predicate
const available = products.filter(p => p.inStock && p.price < 800)

// Filter with where clause
const affordable = products.where('price', 499)
const inStock = products.whereNotNull('inStock')
```

### Aggregating Data

```typescript
const orders = collect([
  { product: 'Widget', amount: 100 },
  { product: 'Gadget', amount: 250 },
  { product: 'Widget', amount: 150 },
])

// Sum values
const total = orders.sum('amount') // 500

// Group and aggregate
const byProduct = orders.groupBy('product')
// Map { 'Widget' => [...], 'Gadget' => [...] }

// Count occurrences
const counts = orders.countBy('product')
// Map { 'Widget' => 2, 'Gadget' => 1 }
```

### Accessing Elements

```typescript
const items = collect(['a', 'b', 'c', 'd', 'e'])

items.first()      // 'a'
items.last()       // 'e'
items.nth(2)       // 'c'
items.take(3)      // Collection(['a', 'b', 'c'])
items.skip(2)      // Collection(['c', 'd', 'e'])
items.random()     // Random item
```

## Working with Objects

### Grouping

```typescript
const employees = collect([
  { name: 'John', department: 'Engineering', salary: 80000 },
  { name: 'Jane', department: 'Engineering', salary: 90000 },
  { name: 'Bob', department: 'Sales', salary: 70000 },
  { name: 'Alice', department: 'Sales', salary: 75000 },
])

// Group by department
const byDept = employees.groupBy('department')
// Map {
//   'Engineering' => [{ name: 'John', ... }, { name: 'Jane', ... }],
//   'Sales' => [{ name: 'Bob', ... }, { name: 'Alice', ... }]
// }

// Group by multiple keys
const byDeptAndSalaryBracket = employees.groupByMultiple('department', 'salary')
```

### Extracting Values

```typescript
const users = collect([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
])

// Extract single key
const names = users.pluck('name')
// Collection(['John', 'Jane'])

// Get subset of keys
const nameAndEmail = users.only('name', 'email')
const noEmail = users.except('email')
```

### Keying Collections

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])

// Key by field
const byId = users.keyBy('id')
// Map { 1 => { id: 1, name: 'John' }, 2 => { id: 2, name: 'Jane' } }

// Convert to Map
const userMap = users.toMap('id')
// Map { 1 => { id: 1, name: 'John' }, 2 => { id: 2, name: 'Jane' } }
```

## Sorting

```typescript
const items = collect([
  { name: 'Banana', price: 1.50 },
  { name: 'Apple', price: 2.00 },
  { name: 'Orange', price: 1.75 },
])

// Sort by key ascending
const byPrice = items.sortBy('price')

// Sort by key descending
const byPriceDesc = items.sortByDesc('price')

// Custom sort
const sorted = items.sort((a, b) => a.name.localeCompare(b.name))
```

## Pagination

```typescript
const items = collect(Array.from({ length: 100 }, (_, i) => ({ id: i + 1 })))

// Paginate results
const page = items.paginate(10, 1)
// {
//   data: Collection([...10 items...]),
//   total: 100,
//   perPage: 10,
//   currentPage: 1,
//   lastPage: 10,
//   hasMorePages: true
// }

// Get specific page
const pageThree = items.forPage(3, 10)
```

## Conditional Operations

```typescript
const collection = collect([1, 2, 3, 4, 5])

// Execute based on condition
const result = collection
  .when(true, col => col.map(n => n * 2))
  .unless(false, col => col.filter(n => n > 5))
  .toArray()

// Check emptiness
const processed = collection
  .whenNotEmpty(col => col.map(n => n * 10))
  .whenEmpty(col => col.push(0))
```

## Debugging

```typescript
const collection = collect([1, 2, 3])

// Log collection state without breaking chain
collection
  .map(n => n * 2)
  .tap(col => console.log('After map:', col.toArray()))
  .filter(n => n > 4)
  .tap(col => console.log('After filter:', col.toArray()))
  .toArray()

// Dump to console
collection.dump() // Logs items to console

// Dump and die (throws after logging)
collection.dd() // Logs and throws
```

## Next Steps

- [Collection Methods](/guide/methods) - Complete reference of 100+ methods
- [Lazy Collections](/guide/lazy) - Memory-efficient processing for large datasets
- [Custom Macros](/guide/macros) - Extend collections with your own methods
