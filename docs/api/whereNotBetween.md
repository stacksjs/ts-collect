# whereNotBetween Method

The `whereNotBetween()` method filters the collection, returning a new collection with all items where the given key's value falls outside the specified minimum and maximum range (exclusive).

## Basic Syntax

```typescript
collect(items).whereNotBetween(key: keyof T, min: T[K], max: T[K]): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([
  { id: 1, value: 10 },
  { id: 2, value: 20 },
  { id: 3, value: 30 },
  { id: 4, value: 40 },
  { id: 5, value: 50 }
])

const outsideRange = numbers.whereNotBetween('value', 20, 40)
console.log(outsideRange.all())
// [
//   { id: 1, value: 10 },
//   { id: 5, value: 50 }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  weight: number
}

const products = collect<Product>([
  { id: 1, name: 'Light Item', price: 25, weight: 0.5 },
  { id: 2, name: 'Medium Item', price: 50, weight: 2.0 },
  { id: 3, name: 'Heavy Item', price: 75, weight: 5.0 }
])

// Get products outside standard shipping weight range
const specialShipping = products.whereNotBetween('weight', 1.0, 3.0)
```

### Real-world Examples

#### E-commerce Price Filter

```typescript
interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
}

class ProductFilter {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  getPremiumAndBudgetProducts(midRangeMin: number, midRangeMax: number): Collection<Product> {
    return this.products
      .whereNotBetween('price', midRangeMin, midRangeMax)
      .filter(product => product.inStock)
  }

  getSpecialPricingProducts(): Collection<Product> {
    // Get products outside normal pricing range for special marketing
    return this.products.whereNotBetween('price', 10, 100)
  }
}
```

#### Inventory Management

```typescript
interface InventoryItem {
  id: string
  quantity: number
  reorderPoint: number
  maxStock: number
}

class InventoryManager {
  private inventory: Collection<InventoryItem>

  constructor(items: InventoryItem[]) {
    this.inventory = collect(items)
  }

  getStockAlerts(): Collection<InventoryItem> {
    // Get items with irregular stock levels (too low or too high)
    return this.inventory.whereNotBetween('quantity', 10, 100)
  }

  getIrregularReorderPoints(): Collection<InventoryItem> {
    // Find items with unusual reorder points
    return this.inventory.whereNotBetween('reorderPoint', 5, 50)
  }
}
```

### Advanced Usage

#### Order Management System

```typescript
interface Order {
  id: string
  total: number
  items: number
  processingTime: number
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getUnusualOrders(): Collection<Order> {
    // Find orders outside normal processing time
    return this.orders.whereNotBetween('processingTime', 1, 48)
  }

  getSpecialHandlingOrders(): Collection<Order> {
    // Orders requiring special handling due to size
    return this.orders.whereNotBetween('items', 1, 10)
  }

  getCustomPricingOrders(): Collection<Order> {
    // Orders outside standard pricing range
    return this.orders.whereNotBetween('total', 100, 1000)
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  price: number
  weight: number
  stock: number
}

const products = collect<TypedProduct>([
  { id: 1, price: 50, weight: 1.5, stock: 100 },
  { id: 2, price: 150, weight: 2.5, stock: 200 },
  { id: 3, price: 250, weight: 3.5, stock: 300 }
])

// Type-safe range filtering
const premiumProducts = products.whereNotBetween('price', 75, 200)
const specialShipping = products.whereNotBetween('weight', 2.0, 3.0)

// TypeScript enforces valid keys and comparable values
// products.whereNotBetween('invalid', 0, 100)    // ✗ TypeScript error
// products.whereNotBetween('id', 'a', 'z')       // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing items where the value is outside the specified range
- Returns empty collection if no matches found
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Range comparison uses less than or equal to (<=) and greater than or equal to (>=)

## Common Use Cases

### 1. E-commerce

- Filtering premium or budget products
- Identifying items requiring special shipping
- Finding products with unusual stock levels
- Detecting irregular pricing patterns

### 2. Inventory Management

- Identifying irregular stock levels
- Finding items with unusual reorder points
- Detecting storage anomalies
- Managing special storage requirements

### 3. Order Processing

- Finding orders requiring special handling
- Identifying unusual processing times
- Detecting irregular order sizes
- Managing custom pricing requirements

### 4. Financial Operations

- Identifying unusual transactions
- Finding irregular account balances
- Detecting anomalous payment amounts
- Managing special pricing cases

### 5. Performance Monitoring

- Finding outlier response times
- Identifying unusual resource usage
- Detecting irregular traffic patterns
- Managing threshold violations

### 6. Quality Control

- Identifying out-of-spec measurements
- Finding unusual test results
- Detecting irregular production metrics
- Managing special tolerance cases

### 7. Time Management

- Finding irregular processing durations
- Identifying unusual schedule gaps
- Detecting anomalous completion times
- Managing special time allocations

### 8. Resource Allocation

- Identifying unusual resource requirements
- Finding irregular usage patterns
- Detecting special allocation needs
- Managing resource exceptions

### 9. Customer Service

- Finding unusual response times
- Identifying irregular case durations
- Detecting special handling requirements
- Managing priority exceptions

### 10. Analytics

- Identifying statistical outliers
- Finding unusual patterns
- Detecting anomalous metrics
- Managing special analytical cases
