# Avg Method

The `avg()` method is an alias of `average()`. It returns the average value of a given key in the collection. If no key is provided, it calculates the average of all elements (assuming they are numbers).

## Basic Syntax

```typescript
// For arrays of numbers
collect(numbers).avg()

// For arrays of objects
collect(items).avg(key)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.avg()) // 3
```

### With Object Arrays

```typescript
const products = collect([
  { name: 'Keyboard', price: 99 },
  { name: 'Mouse', price: 59 },
  { name: 'Monitor', price: 299 }
])

console.log(products.avg('price')) // 152.33
```

### Working with Scores

```typescript
interface Score {
  subject: string
  value: number
  weight: number
}

const scores = collect<Score>([
  { subject: 'Math', value: 95, weight: 2 },
  { subject: 'Science', value: 88, weight: 1.5 },
  { subject: 'English', value: 92, weight: 1 }
])

const avgScore = scores.avg('value')
console.log(avgScore) // 91.67
```

### Real-world Example: E-commerce

```typescript
interface OrderItem {
  productId: number
  quantity: number
  unitPrice: number
  discount: number
}

const orderItems = collect<OrderItem>([
  { productId: 1, quantity: 2, unitPrice: 29.99, discount: 0 },
  { productId: 2, quantity: 1, unitPrice: 49.99, discount: 5 },
  { productId: 3, quantity: 3, unitPrice: 19.99, discount: 2 }
])

// Average unit price
const avgPrice = orderItems.avg('unitPrice')
console.log(avgPrice) // 33.32

// Average quantity per item
const avgQuantity = orderItems.avg('quantity')
console.log(avgQuantity) // 2

// Average discount
const avgDiscount = orderItems.avg('discount')
console.log(avgDiscount) // 2.33
```

### Working with Performance Metrics

```typescript
interface Performance {
  day: string
  metrics: {
    responseTime: number
    errorRate: number
    userSatisfaction: number
  }
}

const performanceData = collect<Performance>([
  {
    day: 'Monday',
    metrics: {
      responseTime: 150,
      errorRate: 0.5,
      userSatisfaction: 4.2
    }
  },
  {
    day: 'Tuesday',
    metrics: {
      responseTime: 145,
      errorRate: 0.3,
      userSatisfaction: 4.5
    }
  },
  {
    day: 'Wednesday',
    metrics: {
      responseTime: 160,
      errorRate: 0.4,
      userSatisfaction: 4.3
    }
  }
])

// Using map and avg together
const avgResponseTime = performanceData
  .map(data => data.metrics.responseTime)
  .avg()

console.log(avgResponseTime) // 151.67
```

### Empty Collections

```typescript
const empty = collect([])
console.log(empty.avg()) // 0

const emptyObjects = collect<{ value: number }>([])
console.log(emptyObjects.avg('value')) // 0
```

### Chaining with Other Methods

```typescript
const data = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Average of even numbers
const avgEven = data
  .filter(n => n % 2 === 0)
  .avg()

console.log(avgEven) // 6

// Average of numbers greater than 5
const avgGreaterThanFive = data
  .filter(n => n > 5)
  .avg()

console.log(avgGreaterThanFive) // 7.5
```

## Type Safety

The `avg()` method maintains type safety and will only accept valid keys from your object type:

```typescript
interface MetricData {
  value: number
  importance: number
}

const metrics = collect<MetricData>([
  { value: 100, importance: 3 },
  { value: 200, importance: 2 },
  { value: 300, importance: 1 }
])

// These are valid
const avgValue = metrics.avg('value') // 200
const avgImportance = metrics.avg('importance') // 2

// This would cause a TypeScript error
// metrics.avg('invalidKey')
```

## Return Value

Returns a number representing the average value. If the collection is empty or if the specified key doesn't exist, returns 0.

## Note

Remember that `avg()` is simply an alias for `average()`, so you can use either method interchangeably based on your preference:

```typescript
const numbers = collect([1, 2, 3, 4, 5])

// These are equivalent
numbers.avg() // 3
numbers.average() // 3
```
