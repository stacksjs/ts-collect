# Aggregation

Perform powerful aggregations and calculations on collections.

## Overview

ts-collect provides comprehensive aggregation methods for calculating sums, averages, statistics, and grouping data.

## Basic Aggregations

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

numbers.sum()     // 15
numbers.avg()     // 3
numbers.min()     // 1
numbers.max()     // 5
numbers.count()   // 5
numbers.median()  // 3
```

## Aggregating Object Properties

```typescript
const products = collect([
  { name: 'A', price: 100, quantity: 2 },
  { name: 'B', price: 200, quantity: 3 },
  { name: 'C', price: 150, quantity: 1 },
])

products.sum('price')      // 450
products.avg('price')      // 150
products.min('price')      // 100
products.max('price')      // 200

// Sum with calculation
products.sum((p) => p.price * p.quantity) // 950
```

## groupBy

Group items by a key:

```typescript
const users = collect([
  { name: 'John', department: 'Sales' },
  { name: 'Jane', department: 'Engineering' },
  { name: 'Bob', department: 'Sales' },
  { name: 'Alice', department: 'Engineering' },
])

const byDepartment = users.groupBy('department')
// {
//   Sales: Collection([John, Bob]),
//   Engineering: Collection([Jane, Alice])
// }

// Group by computed key
const byFirstLetter = users.groupBy((u) => u.name[0])
// { J: [...], B: [...], A: [...] }
```

## countBy

Count occurrences:

```typescript
const votes = collect(['yes', 'no', 'yes', 'yes', 'no'])

const counts = votes.countBy()
// { yes: 3, no: 2 }

// Count by property
const users = collect([
  { name: 'John', status: 'active' },
  { name: 'Jane', status: 'inactive' },
  { name: 'Bob', status: 'active' },
])

const byStatus = users.countBy('status')
// { active: 2, inactive: 1 }
```

## reduce

Custom aggregation with reduce:

```typescript
const orders = collect([
  { product: 'A', quantity: 2, price: 10 },
  { product: 'B', quantity: 1, price: 20 },
  { product: 'A', quantity: 3, price: 10 },
])

// Calculate total revenue
const total = orders.reduce(
  (sum, order) => sum + order.quantity * order.price,
  0
) // 70

// Build an object
const summary = orders.reduce((acc, order) => {
  acc[order.product] = (acc[order.product] || 0) + order.quantity
  return acc
}, {} as Record<string, number>)
// { A: 5, B: 1 }
```

## pipe

Chain custom aggregations:

```typescript
const result = collect([1, 2, 3, 4, 5])
  .pipe((collection) => ({
    sum: collection.sum(),
    avg: collection.avg(),
    count: collection.count(),
  }))
// { sum: 15, avg: 3, count: 5 }
```

## Statistics

```typescript
const data = collect([2, 4, 4, 4, 5, 5, 7, 9])

data.sum()      // 40
data.avg()      // 5
data.median()   // 4.5
data.mode()     // 4

// With custom stats implementation
const stats = {
  variance: data.reduce((sum, x, _, arr) => {
    const mean = arr.avg()
    return sum + Math.pow(x - mean, 2)
  }, 0) / data.count(),
}
```

## Pivot Tables

Create pivot-style aggregations:

```typescript
const sales = collect([
  { region: 'North', product: 'A', amount: 100 },
  { region: 'South', product: 'A', amount: 150 },
  { region: 'North', product: 'B', amount: 200 },
  { region: 'South', product: 'B', amount: 250 },
])

const pivot = sales
  .groupBy('region')
  .map((regionSales) => ({
    total: regionSales.sum('amount'),
    byProduct: regionSales.groupBy('product').map((p) => p.sum('amount')),
  }))
```
