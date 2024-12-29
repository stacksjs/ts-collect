# isNotEmpty Method

The `isNotEmpty()` method checks whether the collection contains any elements. It returns `true` if the collection has at least one element and `false` if it's empty.

## Basic Syntax

```typescript
collect(items).isNotEmpty(): boolean
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const nonEmptyArray = collect([1, 2, 3])
console.log(nonEmptyArray.isNotEmpty())  // true

const emptyArray = collect([])
console.log(emptyArray.isNotEmpty())  // false

// After filtering
const availableItems = collect([1, 2, 3])
  .filter(num => num > 2)
if (availableItems.isNotEmpty()) {
  console.log('Items available:', availableItems.all())
}
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  inStock: boolean
  price: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget', inStock: true, price: 100 },
  { id: 2, name: 'Gadget', inStock: false, price: 200 }
])

// Check available products
const availableProducts = products.where('inStock', true)
if (availableProducts.isNotEmpty()) {
  console.log(`${availableProducts.count()} products available`)
}

// Check sale items
const saleProducts = products.filter(product => product.price < 150)
if (saleProducts.isNotEmpty()) {
  console.log('Sale items found!')
}
```

### Real-world Examples

#### Product Search System

```typescript
interface SearchResult {
  productId: string
  name: string
  relevance: number
  category: string
  inStock: boolean
}

class ProductSearcher {
  private results: Collection<SearchResult>

  constructor(searchResults: SearchResult[]) {
    this.results = collect(searchResults)
  }

  hasResults(): boolean {
    return this.results.isNotEmpty()
  }

  hasInStockResults(): boolean {
    return this.results
      .where('inStock', true)
      .isNotEmpty()
  }

  hasCategoryResults(category: string): boolean {
    return this.results
      .where('category', category)
      .isNotEmpty()
  }

  hasRelevantResults(minRelevance: number): boolean {
    return this.results
      .filter(result => result.relevance >= minRelevance)
      .isNotEmpty()
  }
}
```

#### Order Queue Manager

```typescript
interface Order {
  id: string
  priority: boolean
  status: 'pending' | 'processing' | 'completed'
  items: number
  value: number
}

class OrderQueueManager {
  constructor(private queue: Collection<Order>) {}

  hasOrdersToProcess(): boolean {
    return this.queue
      .where('status', 'pending')
      .isNotEmpty()
  }

  hasPriorityOrders(): boolean {
    return this.queue
      .where('status', 'pending')
      .where('priority', true)
      .isNotEmpty()
  }

  hasHighValueOrders(threshold: number): boolean {
    return this.queue
      .where('status', 'pending')
      .filter(order => order.value > threshold)
      .isNotEmpty()
  }

  processNextBatch(): void {
    if (this.queue.where('status', 'pending').isNotEmpty()) {
      // Process priority orders first
      if (this.hasPriorityOrders()) {
        this.processPriorityOrders()
      } else {
        this.processRegularOrders()
      }
    }
  }
}
```

### Advanced Usage

#### Inventory Alert System

```typescript
interface InventoryItem {
  sku: string
  quantity: number
  reorderPoint: number
  lastReorderDate: Date
  supplierLeadTime: number
}

class InventoryAlertSystem {
  constructor(private inventory: Collection<InventoryItem>) {}

  hasLowStockItems(): boolean {
    return this.inventory
      .filter(item => item.quantity <= item.reorderPoint)
      .isNotEmpty()
  }

  hasUrgentReorders(): boolean {
    const today = new Date()
    return this.inventory
      .filter(item => {
        const daysSinceReorder = Math.floor(
          (today.getTime() - new Date(item.lastReorderDate).getTime()) /
          (1000 * 60 * 60 * 24)
        )
        return item.quantity <= item.reorderPoint &&
          daysSinceReorder >= item.supplierLeadTime
      })
      .isNotEmpty()
  }

  checkAndAlert(): void {
    if (this.hasUrgentReorders()) {
      this.sendUrgentAlert()
    } else if (this.hasLowStockItems()) {
      this.sendLowStockAlert()
    }
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
  { id: 1, name: 'A', stock: 100 }
])

// Type-safe checks
const hasProducts: boolean = products.isNotEmpty()
const hasLowStock = products
  .filter(p => p.stock < 10)
  .isNotEmpty()
```

## Return Value

- Returns `true` if the collection has at least one element
- Returns `false` if the collection is empty
- Always returns a boolean
- Can be used in conditional statements
- Works with any collection type
- Useful for process control flow

## Common Use Cases

### 1. Search Operations

- Verify search results
- Check filter matches
- Validate query results
- Confirm suggestions
- Check availability

### 2. Order Processing

- Check pending orders
- Verify queue status
- Validate batch size
- Check high priority
- Confirm availability

### 3. Inventory Management

- Check stock levels
- Verify availability
- Confirm reorder needs
- Check locations
- Validate supplies

### 4. Product Filtering

- Validate results
- Check availability
- Verify categories
- Confirm matches
- Check conditions

### 5. Cart Operations

- Verify contents
- Check availability
- Validate items
- Confirm eligibility
- Check restrictions

### 6. User Data

- Check preferences
- Verify history
- Validate selections
- Check permissions
- Confirm settings

### 7. Notifications

- Check triggers
- Verify conditions
- Validate alerts
- Confirm events
- Check thresholds

### 8. Report Generation

- Verify data
- Check content
- Validate sections
- Confirm metrics
- Check results

### 9. Validation Logic

- Check conditions
- Verify requirements
- Validate inputs
- Confirm eligibility
- Check constraints

### 10. Process Control

- Check prerequisites
- Verify conditions
- Validate state
- Confirm readiness
- Check dependencies
