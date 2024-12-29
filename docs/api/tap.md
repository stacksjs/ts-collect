# tap Method

The `tap()` method allows you to perform operations on a collection at a specific point in a chain without affecting the collection itself. This is particularly useful for debugging, logging, or performing side effects during collection processing.

## Basic Syntax

```typescript
collect(items).tap(callback: (collection: Collection<T>) => void): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4])
  .tap(collection => console.log('Initial values:', collection.all()))
  .map(n => n * 2)
  .tap(collection => console.log('After multiplication:', collection.all()))
  .filter(n => n > 4)
  .tap(collection => console.log('Final values:', collection.all()))

// Console output:
// Initial values: [1, 2, 3, 4]
// After multiplication: [2, 4, 6, 8]
// Final values: [6, 8]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

const products = collect<Product>([
  { id: 1, name: 'Widget', price: 100, inStock: true },
  { id: 2, name: 'Gadget', price: 200, inStock: false }
])
  .tap(items => console.log('Processing items:', items.count()))
  .where('inStock', true)
  .tap(items => console.log('In stock items:', items.count()))
```

### Real-world Examples

#### Order Processing Pipeline

```typescript
interface Order {
  id: string
  total: number
  status: 'pending' | 'processing' | 'completed'
  items: number
  priority: boolean
}

class OrderProcessor {
  processOrders(orders: Collection<Order>): Collection<Order> {
    return orders
      .tap(orders => this.logOrderCount('Initial orders', orders))
      .filter(order => order.status === 'pending')
      .tap(orders => this.logOrderCount('Pending orders', orders))
      .sortBy('total', 'desc')
      .tap(orders => this.logHighValueOrders(orders))
      .tap(orders => this.notifyProcessingStart(orders))

  }

  private logOrderCount(stage: string, orders: Collection<Order>): void {
    console.log(`${stage}: Processing ${orders.count()} orders`)
  }

  private logHighValueOrders(orders: Collection<Order>): void {
    const highValue = orders.filter(order => order.total > 1000)
    console.log(`Found ${highValue.count()} high-value orders`)
  }

  private notifyProcessingStart(orders: Collection<Order>): void {
    if (orders.where('priority', true).isNotEmpty()) {
      console.log('Priority orders detected - expediting processing')
    }
  }
}
```

#### Inventory Update Monitor

```typescript
interface InventoryItem {
  sku: string
  quantity: number
  lastUpdated: Date
  reorderPoint: number
}

class InventoryMonitor {
  updateInventory(items: Collection<InventoryItem>): Collection<InventoryItem> {
    return items
      .tap(items => this.logUpdateStart(items))
      .filter(item => item.quantity > 0)
      .tap(items => this.checkStockLevels(items))
      .map(item => ({
        ...item,
        lastUpdated: new Date()
      }))
      .tap(items => this.checkReorderPoints(items))
      .tap(items => this.logUpdateComplete(items))
  }

  private logUpdateStart(items: Collection<InventoryItem>): void {
    console.log(`Starting inventory update for ${items.count()} items`)
    console.log('Current timestamp:', new Date().toISOString())
  }

  private checkStockLevels(items: Collection<InventoryItem>): void {
    const lowStock = items.filter(item => item.quantity < item.reorderPoint)
    if (lowStock.isNotEmpty()) {
      console.warn(`Warning: ${lowStock.count()} items below reorder point`)
      lowStock.each(item =>
        console.warn(`Low stock alert: ${item.sku}, Quantity: ${item.quantity}`)
      )
    }
  }

  private checkReorderPoints(items: Collection<InventoryItem>): void {
    items.forEach(item => {
      if (item.quantity <= item.reorderPoint) {
        console.log(`Reorder point reached for SKU: ${item.sku}`)
      }
    })
  }

  private logUpdateComplete(items: Collection<InventoryItem>): void {
    console.log(`Inventory update completed. ${items.count()} items processed`)
  }
}
```

### Advanced Usage

#### Price Update Monitor

```typescript
interface PriceUpdate {
  productId: string
  oldPrice: number
  newPrice: number
  category: string
  timestamp: Date
}

class PriceUpdateMonitor {
  trackPriceChanges(updates: Collection<PriceUpdate>): Collection<PriceUpdate> {
    let significantChanges = 0

    return updates
      .tap(updates => this.logUpdateStart(updates))
      .tap(updates => {
        const avgChange = updates
          .map(u => ((u.newPrice - u.oldPrice) / u.oldPrice) * 100)
          .avg()
        console.log(`Average price change: ${avgChange.toFixed(2)}%`)
      })
      .tap(updates => {
        // Track significant price changes (>20%)
        updates.each(update => {
          const changePercent = ((update.newPrice - update.oldPrice) / update.oldPrice) * 100
          if (Math.abs(changePercent) > 20) {
            significantChanges++
            console.warn(`Significant price change detected for product ${update.productId}:`,
              `${changePercent.toFixed(2)}%`)
          }
        })
      })
      .tap(() => {
        if (significantChanges > 0) {
          console.warn(`Total significant price changes: ${significantChanges}`)
        }
      })
  }

  private logUpdateStart(updates: Collection<PriceUpdate>): void {
    console.log(`Processing ${updates.count()} price updates`)
    console.log('Update timestamp:', new Date().toISOString())
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100 },
  { id: 2, name: 'B', price: 200 }
])

// Type-safe tap operations
products
  .tap(items => {
    // TypeScript knows the type of 'items'
    const total = items.sum('price')
    console.log(`Total value: ${total}`)
  })
  .tap(items => {
    // Accessing non-existent property would cause error
    // console.log(items.first()?.invalid)  // ✗ TypeScript error
  })
```

## Return Value

- Returns the original collection unchanged
- Maintains the collection chain
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Callback function receives the collection as argument
- Callback return value is ignored

## Common Use Cases

### 1. Debugging

- Logging collection state
- Inspecting transformations
- Verifying filters
- Checking counts
- Validating operations

### 2. Monitoring

- Tracking process steps
- Measuring performance
- Checking thresholds
- Validating results
- Observing changes

### 3. Process Validation

- Verifying business rules
- Checking constraints
- Validating conditions
- Ensuring integrity
- Testing assumptions

### 4. Logging

- Recording operations
- Tracking changes
- Monitoring progress
- Recording timestamps
- Capturing metrics

### 5. Performance Analysis

- Measuring operation time
- Counting iterations
- Tracking memory usage
- Monitoring throughput
- Analyzing bottlenecks

### 6. Error Detection

- Validating data
- Checking constraints
- Monitoring thresholds
- Detecting anomalies
- Verifying integrity

### 7. Auditing

- Tracking changes
- Recording operations
- Logging modifications
- Monitoring access
- Validating updates

### 8. Progress Tracking

- Monitoring steps
- Tracking completion
- Recording milestones
- Measuring progress
- Observing status

### 9. Analytics

- Gathering metrics
- Collecting statistics
- Measuring performance
- Tracking patterns
- Analyzing trends

### 10. Notification

- Triggering alerts
- Sending notifications
- Broadcasting events
- Signaling changes
- Reporting status
