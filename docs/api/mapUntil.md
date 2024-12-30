# MapUntil Method

The `mapUntil()` method maps elements in the collection until a specified condition is met. The mapping stops when the predicate returns true for any mapped item. This is particularly useful for transforming data with early termination conditions.

## Basic Syntax

```typescript
mapUntil<U>(
  callback: (item: T, index: number) => U,
  predicate: (item: U) => boolean
): CollectionOperations<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

const doubled = numbers.mapUntil(
  n => n * 2,
  result => result > 6
)

console.log(doubled.all())
// [2, 4, 6]  // Stops when result exceeds 6
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  score: number
}

const users = collect<User>([
  { id: 1, name: 'Chris', score: 85 },
  { id: 2, name: 'Avery', score: 95 },
  { id: 3, name: 'Buddy', score: 75 }
])

const processedScores = users.mapUntil(
  user => ({
    name: user.name,
    grade: user.score >= 90 ? 'A' : 'B'
  }),
  result => result.grade === 'A'
)
```

### Real-world Example: E-commerce Inventory Processing

```typescript
interface Product {
  id: string
  name: string
  stock: number
  reorderPoint: number
}

class InventoryProcessor {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  processLowStockItems() {
    return this.products
      .sortBy('stock')
      .mapUntil(
        product => ({
          id: product.id,
          name: product.name,
          stockStatus: this.calculateStockStatus(product),
          reorderQuantity: this.calculateReorderQuantity(product)
        }),
        result => result.stockStatus === 'adequate'
      )
  }

  findFirstAvailableItems(quantity: number) {
    let totalFound = 0

    return this.products
      .sortBy('stock', 'desc')
      .mapUntil(
        product => ({
          id: product.id,
          name: product.name,
          availableQuantity: product.stock,
          allocatedQuantity: Math.min(
            product.stock,
            quantity - totalFound
          )
        }),
        result => {
          totalFound += result.allocatedQuantity
          return totalFound >= quantity
        }
      )
  }

  private calculateStockStatus(product: Product): 'critical' | 'low' | 'adequate' {
    if (product.stock === 0) return 'critical'
    if (product.stock < product.reorderPoint) return 'low'
    return 'adequate'
  }

  private calculateReorderQuantity(product: Product): number {
    return Math.max(0, product.reorderPoint - product.stock)
  }
}
```

## Type Safety

```typescript
interface DataPoint {
  value: number
  timestamp: Date
}

const data = collect<DataPoint>([
  { value: 10, timestamp: new Date() },
  { value: 20, timestamp: new Date() },
  { value: 30, timestamp: new Date() }
])

// Type-safe mapping with early termination
interface ProcessedPoint {
  originalValue: number
  normalized: number
  status: 'valid' | 'overflow'
}

const processed = data.mapUntil(
  (point): ProcessedPoint => ({
    originalValue: point.value,
    normalized: point.value / 100,
    status: point.value > 25 ? 'overflow' : 'valid'
  }),
  result => result.status === 'overflow'
)
```

## Return Value

- Returns a new Collection containing mapped items up to termination condition
- Stops processing when predicate returns true
- Maintains type safety through generics
- Includes index in mapping callback
- Preserves collection chain methods
- Handles empty collections gracefully

## Common Use Cases

### 1. Inventory Management

- Processing until stock threshold
- Finding available items
- Checking reorder points
- Processing backorders
- Stock allocation

### 2. Data Validation

- Processing until error found
- Validating sequences
- Checking constraints
- Finding first invalid item
- Quality control checks

### 3. Order Processing

- Processing until limit reached
- Allocating inventory
- Processing payments
- Finding fulfillment options
- Queue processing

### 4. Performance Optimization

- Early termination on conditions
- Processing with limits
- Resource allocation
- Batch processing
- Stream processing

### 5. Search Operations

- Finding first match
- Processing until threshold
- Validation sequences
- Conditional searches
- Priority processing
