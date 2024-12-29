# count Method

The `count()` method returns the total number of items in the collection. Among other things, this is useful for inventory counting, cart totals, and general collection size checks.

## Basic Syntax

```typescript
collect(items).count(): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.count())  // 5

// After filtering
const evenNumbers = collect([1, 2, 3, 4, 5])
  .filter(n => n % 2 === 0)
console.log(evenNumbers.count())  // 2

// Empty collection
const empty = collect([])
console.log(empty.count())  // 0
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  inStock: boolean
  category: string
}

const products = collect<Product>([
  { id: 1, name: 'Widget', inStock: true, category: 'tools' },
  { id: 2, name: 'Gadget', inStock: false, category: 'electronics' },
  { id: 3, name: 'Gizmo', inStock: true, category: 'electronics' }
])

// Count all products
console.log(products.count())  // 3

// Count in-stock products
console.log(products.where('inStock', true).count())  // 2

// Count by category
console.log(products.where('category', 'electronics').count())  // 2
```

### Real-world Examples

#### Shopping Cart Manager

```typescript
interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  isDigital: boolean
}

class CartManager {
  constructor(private items: Collection<CartItem>) {}

  getTotalItems(): number {
    return this.items.count()
  }

  getTotalQuantity(): number {
    return this.items.sum('quantity')
  }

  getPhysicalItemCount(): number {
    return this.items
      .filter(item => !item.isDigital)
      .count()
  }

  getShippingBoxesNeeded(): number {
    const physicalItems = this.getPhysicalItemCount()
    return physicalItems === 0 ? 0 : Math.ceil(physicalItems / 5)
  }

  requiresShipping(): boolean {
    return this.getPhysicalItemCount() > 0
  }
}
```

#### Inventory Counter

```typescript
interface StockItem {
  sku: string
  quantity: number
  reorderPoint: number
  location: string
}

class InventoryCounter {
  constructor(private inventory: Collection<StockItem>) {}

  getTotalProducts(): number {
    return this.inventory.count()
  }

  getLowStockCount(): number {
    return this.inventory
      .filter(item => item.quantity <= item.reorderPoint)
      .count()
  }

  getOutOfStockCount(): number {
    return this.inventory
      .filter(item => item.quantity === 0)
      .count()
  }

  getLocationCounts(): Record<string, number> {
    return this.inventory
      .groupBy('location')
      .map(items => items.count())
      .all()
  }

  generateStockReport(): {
    total: number
    lowStock: number
    outOfStock: number
    locations: Record<string, number>
  } {
    return {
      total: this.getTotalProducts(),
      lowStock: this.getLowStockCount(),
      outOfStock: this.getOutOfStockCount(),
      locations: this.getLocationCounts()
    }
  }
}
```

### Advanced Usage

#### Order Analytics System

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  items: number
  total: number
  customerId: string
}

class OrderAnalytics {
  constructor(private orders: Collection<Order>) {}

  getOrderMetrics(): {
    total: number
    pending: number
    processing: number
    completed: number
    cancelled: number
    averageItems: number
  } {
    return {
      total: this.orders.count(),
      pending: this.orders.where('status', 'pending').count(),
      processing: this.orders.where('status', 'processing').count(),
      completed: this.orders.where('status', 'completed').count(),
      cancelled: this.orders.where('status', 'cancelled').count(),
      averageItems: this.orders.avg('items')
    }
  }

  getCustomerOrderCounts(): Map<string, number> {
    return new Map(
      Array.from(
        this.orders
          .groupBy('customerId')
          .map(orders => orders.count())
          .entries()
      )
    )
  }

  getHighVolumeCustomers(threshold: number): string[] {
    return Array.from(this.getCustomerOrderCounts().entries())
      .filter(([_, count]) => count >= threshold)
      .map(([customerId]) => customerId)
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  stock: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', stock: 100 },
  { id: 2, name: 'B', stock: 0 }
])

// Type-safe counting
const totalProducts: number = products.count()
const inStock: number = products
  .filter(p => p.stock > 0)
  .count()
```

## Return Value

- Returns a number representing the total items in the collection
- Always returns a non-negative integer
- Returns 0 for empty collections
- Can be used in calculations
- Represents the current size of the collection
- Counts after any filters or transformations

## Common Use Cases

### 1. Cart Operations

- Item counting
- Quantity totals
- Shipping calculations
- Package estimation
- Item type counting

### 2. Inventory Management

- Stock counting
- Location totals
- Category quantities
- Reorder monitoring
- Availability tracking

### 3. Order Processing

- Order counting
- Status tracking
- Batch sizing
- Queue monitoring
- Fulfillment tracking

### 4. Product Management

- Category totals
- Variant counting
- Collection sizes
- Feature counting
- Attribute totals

### 5. Customer Analytics

- Order counting
- Interaction totals
- Review counting
- Rating tallies
- Preference counting

### 6. Reporting

- Total calculations
- Status summaries
- Category breakdowns
- Performance metrics
- Activity tracking

### 7. Stock Control

- Inventory levels
- Location counts
- Reorder tracking
- Availability stats
- Movement tracking

### 8. User Management

- Account totals
- Role counting
- Permission tracking
- Session counting
- Activity metrics

### 9. Search Operations

- Result counting
- Match totals
- Filter results
- Category matches
- Relevance metrics

### 10. Validation

- Minimum quantities
- Maximum limits
- Threshold checking
- Capacity monitoring
- Quota tracking
