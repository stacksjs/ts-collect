# Macro Method

The `macro()` method allows you to add custom methods to the Collection class. This is particularly useful when you need to extend the functionality of collections with your own reusable methods.

## Basic Syntax

```typescript
Collection.macro(name: string, fn: Function)
```

## Examples

### Basic Usage

```typescript
import { Collection } from '@stacksjs/ts-collect'

// Add a custom method to sum numbers and multiply by a factor
Collection.macro('sumAndMultiply', function (factor: number = 1) {
  return this.sum() * factor
})

// Use the custom method
const numbers = collect([1, 2, 3, 4])
console.log(numbers.sumAndMultiply(2)) // 20 (sum is 10, multiplied by 2)
```

### Adding Type-Safe Methods

```typescript
// Extend the Collection type
declare module '@stacksjs/ts-collect' {
  interface Collection<T> {
    uppercase(): Collection<string>
    titleCase(): Collection<string>
  }
}

// Add string transformation methods
Collection.macro('uppercase', function () {
  return this.map(item => String(item).toUpperCase())
})

Collection.macro('titleCase', function () {
  return this.map((item) => {
    return String(item)
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  })
})

// Usage
const strings = collect(['hello world', 'typescript rocks'])
console.log(strings.uppercase().all())
// ['HELLO WORLD', 'TYPESCRIPT ROCKS']

console.log(strings.titleCase().all())
// ['Hello World', 'Typescript Rocks']
```

### Real-world Examples

#### Custom Data Processing

```typescript
interface Product {
  name: string
  price: number
  quantity: number
}

// Extend Collection type
declare module '@stacksjs/ts-collect' {
  interface Collection<T> {
    totalValue(): number
    inStock(): Collection<T>
    applyDiscount(percentage: number): Collection<T>
  }
}

// Add custom methods for product operations
Collection.macro('totalValue', function (this: Collection<Product>) {
  return this.sum(item => item.price * item.quantity)
})

Collection.macro('inStock', function (this: Collection<Product>) {
  return this.filter(item => item.quantity > 0)
})

Collection.macro('applyDiscount', function (this: Collection<Product>, percentage: number) {
  return this.map(item => ({
    ...item,
    price: item.price * (1 - percentage / 100)
  }))
})

// Usage
const products = collect<Product>([
  { name: 'Laptop', price: 1000, quantity: 5 },
  { name: 'Mouse', price: 50, quantity: 0 },
  { name: 'Keyboard', price: 100, quantity: 10 }
])

console.log(products.totalValue()) // 2000
console.log(products.inStock().all())
console.log(products.applyDiscount(10).all())
```

#### Data Analysis

```typescript
interface DataPoint {
  value: number
  timestamp: string
}

// Extend Collection type
declare module '@stacksjs/ts-collect' {
  interface Collection<T> {
    average(): number
    standardDeviation(): number
    normalize(): Collection<T>
  }
}

// Add statistical methods
Collection.macro('average', function (this: Collection<DataPoint>) {
  return this.sum(item => item.value) / this.count()
})

Collection.macro('standardDeviation', function (this: Collection<DataPoint>) {
  const avg = this.average()
  const squareDiffs = this.map(item =>
    (item.value - avg) ** 2
  )
  return Math.sqrt(squareDiffs.sum() / this.count())
})

Collection.macro('normalize', function (this: Collection<DataPoint>) {
  const max = this.max(item => item.value)
  const min = this.min(item => item.value)

  return this.map(item => ({
    ...item,
    value: (item.value - min) / (max - min)
  }))
})

// Usage
const dataPoints = collect<DataPoint>([
  { value: 10, timestamp: '2024-01-01' },
  { value: 20, timestamp: '2024-01-02' },
  { value: 15, timestamp: '2024-01-03' }
])

console.log(dataPoints.average())
console.log(dataPoints.standardDeviation())
console.log(dataPoints.normalize().all())
```

### Advanced Usage

#### Chain-aware Macros

```typescript
declare module '@stacksjs/ts-collect' {
  interface Collection<T> {
    whenNotEmpty<R>(callback: (collection: Collection<T>) => R): R | Collection<T>
    transformIf(condition: boolean, callback: (item: T) => T): Collection<T>
  }
}

Collection.macro('whenNotEmpty', function (callback) {
  if (this.isNotEmpty()) {
    return callback(this)
  }
  return this
})

Collection.macro('transformIf', function (condition, callback) {
  return condition ? this.map(callback) : this
})

// Usage
const numbers = collect([1, 2, 3, 4, 5])

numbers
  .whenNotEmpty(collection => collection.filter(n => n > 2))
  .transformIf(true, n => n * 2)
  .all()
```

## Type Safety

```typescript
interface CustomItem {
  id: number
  value: string
}

// Extend Collection type with strictly typed methods
declare module '@stacksjs/ts-collect' {
  interface Collection<T> {
    customSort(key: keyof T): Collection<T>
    validateAll(predicate: (item: T) => boolean): boolean
  }
}

Collection.macro('customSort', function<T>(key: keyof T) {
  return this.sortBy(key)
})

Collection.macro('validateAll', function<T>(predicate: (item: T) => boolean) {
  return this.every(predicate)
})

// Usage with type safety
const items = collect<CustomItem>([
  { id: 2, value: 'b' },
  { id: 1, value: 'a' }
])

const sorted = items.customSort('id')
const valid = items.validateAll(item => item.id > 0)
```

## Return Value

- Each macro can return any value, but typically returns either:
  - The collection itself (for chainable methods)
  - A transformed collection
  - A computed value based on the collection's contents
