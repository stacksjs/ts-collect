# Custom Macros

Macros allow you to extend collections with your own custom methods. This is useful for adding domain-specific functionality that you use frequently throughout your application.

## Defining Macros

Use the `macro()` method to add custom methods to a collection instance:

```typescript
import { collect } from 'ts-collect'

const collection = collect([1, 2, 3, 4, 5])

// Define a custom method
collection.macro('double', function() {
  return this.map(n => n * 2)
})

// Use the custom method
const doubled = (collection as any).double()
doubled.all() // [2, 4, 6, 8, 10]
```

## Practical Examples

### Domain-Specific Methods

```typescript
const orders = collect([
  { id: 1, total: 100, status: 'completed' },
  { id: 2, total: 50, status: 'pending' },
  { id: 3, total: 200, status: 'completed' },
])

// Add a method to get completed orders
orders.macro('completed', function() {
  return this.where('status', 'completed')
})

// Add a method to calculate revenue
orders.macro('revenue', function() {
  return this.where('status', 'completed').sum('total')
})

const completedOrders = (orders as any).completed()
const totalRevenue = (orders as any).revenue() // 300
```

### Statistical Extensions

```typescript
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Add geometric mean
numbers.macro('geometricMean', function() {
  const product = this.reduce((acc, n) => acc * n, 1)
  return Math.pow(product, 1 / this.count())
})

// Add harmonic mean
numbers.macro('harmonicMean', function() {
  const reciprocalSum = this.reduce((acc, n) => acc + 1/n, 0)
  return this.count() / reciprocalSum
})

const gMean = (numbers as any).geometricMean()
const hMean = (numbers as any).harmonicMean()
```

### Text Processing Extensions

```typescript
const texts = collect(['Hello World', 'Foo Bar', 'Test String'])

// Add title case transformation
texts.macro('titleCase', function() {
  return this.map(text =>
    text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  )
})

// Add word count
texts.macro('totalWords', function() {
  return this.reduce((acc, text) => acc + text.split(' ').length, 0)
})

const titled = (texts as any).titleCase()
const wordCount = (texts as any).totalWords() // 6
```

### User Management Extensions

```typescript
interface User {
  id: number
  name: string
  role: 'admin' | 'user' | 'guest'
  lastActive: Date
  email: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin', lastActive: new Date('2024-01-15'), email: 'john@example.com' },
  { id: 2, name: 'Jane', role: 'user', lastActive: new Date('2024-01-10'), email: 'jane@example.com' },
  { id: 3, name: 'Bob', role: 'guest', lastActive: new Date('2024-01-01'), email: 'bob@example.com' },
])

// Add admin filter
users.macro('admins', function() {
  return this.where('role', 'admin')
})

// Add active users (active in last 7 days)
users.macro('active', function() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return this.filter(user => user.lastActive > sevenDaysAgo)
})

// Add email list extraction
users.macro('emailList', function() {
  return this.pluck('email').join(', ')
})

const adminUsers = (users as any).admins()
const activeUsers = (users as any).active()
const emails = (users as any).emailList()
```

### E-commerce Extensions

```typescript
interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
  rating: number
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 999, category: 'Electronics', inStock: true, rating: 4.5 },
  { id: 2, name: 'Chair', price: 299, category: 'Furniture', inStock: false, rating: 4.0 },
  { id: 3, name: 'Phone', price: 699, category: 'Electronics', inStock: true, rating: 4.8 },
])

// Add in-stock filter
products.macro('available', function() {
  return this.filter(p => p.inStock)
})

// Add price range filter
products.macro('priceRange', function(min: number, max: number) {
  return this.whereBetween('price', min, max)
})

// Add top rated
products.macro('topRated', function(minRating = 4.0) {
  return this.filter(p => p.rating >= minRating).sortByDesc('rating')
})

// Add discount application
products.macro('applyDiscount', function(percent: number) {
  return this.map(p => ({
    ...p,
    price: p.price * (1 - percent / 100),
    originalPrice: p.price
  }))
})

const available = (products as any).available()
const affordable = (products as any).priceRange(200, 800)
const topProducts = (products as any).topRated(4.0)
const discounted = (products as any).applyDiscount(20)
```

### Financial Calculations

```typescript
interface Transaction {
  id: number
  amount: number
  type: 'credit' | 'debit'
  date: Date
  category: string
}

const transactions = collect<Transaction>([
  { id: 1, amount: 1000, type: 'credit', date: new Date('2024-01-01'), category: 'salary' },
  { id: 2, amount: 50, type: 'debit', date: new Date('2024-01-02'), category: 'food' },
  { id: 3, amount: 200, type: 'debit', date: new Date('2024-01-03'), category: 'utilities' },
])

// Add balance calculation
transactions.macro('balance', function() {
  return this.reduce((acc, t) =>
    t.type === 'credit' ? acc + t.amount : acc - t.amount, 0
  )
})

// Add category totals
transactions.macro('byCategory', function() {
  return this.groupBy('category').map(group => ({
    category: group.first().category,
    total: group.sum('amount')
  }))
})

// Add monthly summary
transactions.macro('monthly', function() {
  return this.groupBy(t => {
    const d = t.date
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })
})

const balance = (transactions as any).balance() // 750
const categoryTotals = (transactions as any).byCategory()
const monthlySummary = (transactions as any).monthly()
```

## Macros with Parameters

Macros can accept parameters for more flexible functionality:

```typescript
const collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Macro with parameters
collection.macro('inRange', function(min: number, max: number) {
  return this.filter(n => n >= min && n <= max)
})

collection.macro('multiplyBy', function(factor: number) {
  return this.map(n => n * factor)
})

const range = (collection as any).inRange(3, 7) // [3, 4, 5, 6, 7]
const tripled = (collection as any).multiplyBy(3) // [3, 6, 9, ...]
```

## Chainable Macros

Macros that return collections can be chained:

```typescript
const products = collect([
  { name: 'A', price: 10, stock: 5 },
  { name: 'B', price: 20, stock: 0 },
  { name: 'C', price: 15, stock: 10 },
])

products.macro('inStock', function() {
  return this.filter(p => p.stock > 0)
})

products.macro('cheap', function(maxPrice: number) {
  return this.filter(p => p.price <= maxPrice)
})

// Chain macros
const result = (products as any)
  .inStock()
  .cheap(15)
  .all()
// [{ name: 'A', price: 10, stock: 5 }]
```

## Type-Safe Macros

For better TypeScript support, you can create a wrapper function:

```typescript
import { collect, CollectionOperations } from 'ts-collect'

// Define extension interface
interface ExtendedCollection<T> extends CollectionOperations<T> {
  double(): CollectionOperations<T>
  sumBy(key: keyof T): number
}

// Factory function with type safety
function createExtendedCollection<T>(items: T[]): ExtendedCollection<T> {
  const collection = collect(items)

  collection.macro('double', function() {
    return this.map(n => (n as number) * 2)
  })

  collection.macro('sumBy', function(key: keyof T) {
    return this.sum(key as any)
  })

  return collection as unknown as ExtendedCollection<T>
}

// Usage with full type safety
const numbers = createExtendedCollection([1, 2, 3, 4, 5])
const doubled = numbers.double() // TypeScript knows the return type
```

## Best Practices

### 1. Keep Macros Focused

Each macro should do one thing well:

```typescript
// Good - focused macros
collection.macro('active', function() {
  return this.where('status', 'active')
})

collection.macro('recent', function(days: number) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return this.filter(item => item.date > cutoff)
})

// Use by chaining
const result = (collection as any).active().recent(7)
```

### 2. Document Your Macros

```typescript
/**

 * Filters users who have logged in within the last N days
 * @param days - Number of days to consider as "recent"
 * @returns Collection of recently active users

 */
users.macro('recentlyActive', function(days: number) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return this.filter(user => user.lastLogin > cutoff)
})
```

### 3. Handle Edge Cases

```typescript
collection.macro('safeAverage', function(key?: string) {
  if (this.isEmpty()) return 0

  if (key) {
    return this.avg(key)
  }

  return this.avg()
})
```

### 4. Consider Performance

```typescript
// Cache expensive calculations
collection.macro('expensiveCalculation', function() {
  // Use cache for repeated calls
  return this.cache().map(item => heavyComputation(item))
})
```

### 5. Use Meaningful Names

```typescript
// Good names that describe what the macro does
collection.macro('activeSubscribers', ...)
collection.macro('expiringSoon', ...)
collection.macro('highValue', ...)

// Avoid generic names
collection.macro('filter1', ...) // Bad
collection.macro('getData', ...) // Bad
```

## Macro Registry Pattern

For application-wide macros, create a registry:

```typescript
// macros/index.ts
import { CollectionOperations } from 'ts-collect'

export const macros = {
  // User macros
  admins: function<T>(this: CollectionOperations<T>) {
    return this.where('role' as any, 'admin')
  },

  active: function<T>(this: CollectionOperations<T>) {
    return this.where('status' as any, 'active')
  },

  // Order macros
  completed: function<T>(this: CollectionOperations<T>) {
    return this.where('status' as any, 'completed')
  },

  revenue: function<T>(this: CollectionOperations<T>) {
    return this.where('status' as any, 'completed').sum('total' as any)
  }
}

// Helper to apply all macros
export function applyMacros<T>(collection: CollectionOperations<T>) {
  for (const [name, fn] of Object.entries(macros)) {
    collection.macro(name, fn)
  }
  return collection
}

// Usage
import { collect } from 'ts-collect'
import { applyMacros } from './macros'

const users = applyMacros(collect(userData))
const admins = (users as any).admins()
```

This pattern keeps your macros organized and reusable across your application.
