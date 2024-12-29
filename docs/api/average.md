# Average Method

The `average()` method returns the average value of a given key in the collection. If no key is provided, it calculates the average of all elements (assuming they are numbers).

## Basic Syntax

```typescript
// For arrays of numbers
collect(numbers).average()

// For arrays of objects
collect(items).average(key)
```

## Examples

### Basic Usage with Numbers

```typescript
import { collect } from 'ts-collect'

const collection = collect([1, 2, 3, 4, 5])
console.log(collection.average()) // 3

// With decimals
const decimals = collect([1.5, 2.5, 3.5])
console.log(decimals.average()) // 2.5
```

### With Objects and Key

```typescript
const products = collect([
  { name: 'Phone', price: 599 },
  { name: 'Tablet', price: 799 },
  { name: 'Laptop', price: 1499 }
])

console.log(products.average('price')) // 965.67
```

### Handling Empty Collections

```typescript
const empty = collect([])
console.log(empty.average()) // 0

const emptyObjects = collect([])
console.log(emptyObjects.average('price')) // 0
```

### Complex Objects

```typescript
interface Student {
  name: string
  grades: {
    math: number
    science: number
    history: number
  }
}

const students = collect<Student>([
  {
    name: 'John',
    grades: {
      math: 85,
      science: 92,
      history: 78
    }
  },
  {
    name: 'Jane',
    grades: {
      math: 95,
      science: 88,
      history: 90
    }
  }
])

// Calculate average math grade
const avgMath = students
  .map(student => student.grades.math)
  .average()

console.log(avgMath) // 90
```

### With Nested Properties

```typescript
const orders = collect([
  {
    id: 1,
    details: {
      product: {
        price: 100
      }
    }
  },
  {
    id: 2,
    details: {
      product: {
        price: 200
      }
    }
  }
])

// Using dot notation for nested properties
console.log(orders.average('details.product.price')) // 150
```

### With Type Validation

```typescript
interface Product {
  name: string
  price: number
  inStock: boolean
}

const products = collect<Product>([
  { name: 'Phone', price: 599, inStock: true },
  { name: 'Tablet', price: 799, inStock: true },
  { name: 'Laptop', price: 1499, inStock: false }
])

// TypeScript will ensure you only use valid keys
const avgPrice = products.average('price')
console.log(avgPrice) // 965.67

// This would cause a TypeScript error
// products.average('invalid_key')
```

### Combining with Other Methods

```typescript
const products = collect([
  { name: 'Phone', price: 599, inStock: true },
  { name: 'Tablet', price: 799, inStock: false },
  { name: 'Laptop', price: 1499, inStock: true }
])

// Average price of in-stock items
const avgInStockPrice = products
  .filter(product => product.inStock)
  .average('price')

console.log(avgInStockPrice) // 1049
```

### Working with Currency Values

```typescript
const transactions = collect([
  { id: 1, amount: 10.99 },
  { id: 2, amount: 20.50 },
  { id: 3, amount: 15.75 }
])

const avgAmount = transactions.average('amount')
// For display purposes, you might want to round or format
console.log(avgAmount.toFixed(2)) // "15.75"
```

## Type Safety

The average method maintains type safety and will only accept valid keys from your object type:

```typescript
interface Item {
  quantity: number
  price: number
}

const items = collect<Item>([
  { quantity: 2, price: 10 },
  { quantity: 3, price: 20 }
])

// These are valid
items.average('quantity') // 2.5
items.average('price') // 15

// This would cause a TypeScript error
// items.average('invalid')
```

## Common Use Cases

### 1. Statistical Analysis

- Computing averages
- Calculating means
- Processing measurements
- Analyzing datasets

### 2. Performance Metrics

- Average response times
- Mean performance scores
- Metric calculations
- KPI analysis

### 3. Financial Calculations

- Average transaction value
- Mean account balance
- Spending patterns
- Cost analysis

### 4. Quality Control

- Average measurements
- Mean deviations
- Quality metrics
- Process control

### 5. Sensor Data

- Average readings
- Mean values
- Sensor metrics
- Data aggregation

### 6. Academic Scoring

- Grade averaging
- Score calculations
- Performance metrics
- Assessment analysis

### 7. Load Balancing

- Average load
- Mean utilization
- Resource usage
- Capacity planning

### 8. Time Analysis

- Average duration
- Mean processing time
- Time metrics
- Period analysis

### 9. Usage Statistics

- Average consumption
- Mean usage
- Utilization metrics
- Resource analysis

### 10. Market Analysis

- Average prices
- Mean values
- Market metrics
- Trend analysis

## Return Value

Returns a number representing the average value. If the collection is empty or if the specified key doesn't exist, returns 0.
