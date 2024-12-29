# unless Method

The `unless()` method executes the given callback when the specified condition is false. It provides a fluent way to add inverse conditional logic to collection operations, functioning as the opposite of the `when()` method.

## Basic Syntax

```typescript
collect(items).unless(
  condition: boolean | ((collection: Collection<T>) => boolean),
  callback: (collection: Collection<T>) => Collection<U>
): Collection<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

// Using boolean condition
const result = numbers.unless(false, collection => collection.filter(n => n > 3))
console.log(result.all())
// [4, 5]

// Using callback condition
const processedNumbers = numbers.unless(
  collection => collection.sum() < 10,
  collection => collection.map(n => n * 2)
)
```

### Working with Objects

```typescript
interface Product {
  id: number
  price: number
  inStock: boolean
  isOnSale: boolean
}

const products = collect<Product>([
  { id: 1, price: 100, inStock: true, isOnSale: false },
  { id: 2, price: 200, inStock: false, isOnSale: true },
  { id: 3, price: 300, inStock: true, isOnSale: false }
])

// Apply regular pricing unless product is on sale
const processedProducts = products.unless(
  product => product.where('isOnSale', true).isNotEmpty(),
  product => product.map(item => ({
    ...item,
    price: item.price * 1.1 // Regular price increase
  }))
)
```

### Real-world Examples

#### E-commerce Price Manager

```typescript
interface PriceableItem {
  id: string
  price: number
  isDiscounted: boolean
  membershipTier: 'basic' | 'premium' | 'vip'
}

class PriceManager {
  private items: Collection<PriceableItem>

  constructor(items: PriceableItem[]) {
    this.items = collect(items)
  }

  applyPricing(isSaleEvent: boolean): Collection<PriceableItem> {
    return this.items
      .unless(isSaleEvent, items =>
        // Apply regular pricing unless it's a sale event
        items.map(item => ({
          ...item,
          price: this.calculateRegularPrice(item)
        }))
      )
      .unless(
        items => items.where('membershipTier', 'vip').isNotEmpty(),
        items => items.map(item => ({
          ...item,
          price: item.price * 1.1 // Higher price for non-VIP items
        }))
      )
  }

  private calculateRegularPrice(item: PriceableItem): number {
    return item.isDiscounted ? item.price : item.price * 1.2
  }
}
```

#### Inventory Controller

```typescript
interface StockItem {
  id: string
  quantity: number
  isPreorder: boolean
  lastRestocked: Date
}

class InventoryController {
  private inventory: Collection<StockItem>

  constructor(items: StockItem[]) {
    this.inventory = collect(items)
  }

  processInventory(isHolidaySeason: boolean): Collection<StockItem> {
    const today = new Date()

    return this.inventory
      .unless(isHolidaySeason, items =>
        // Maintain regular stock levels unless it's holiday season
        items.map(item => ({
          ...item,
          quantity: this.calculateRegularStock(item)
        }))
      )
      .unless(
        items => items.where('isPreorder', true).isNotEmpty(),
        items => items.map(item => ({
          ...item,
          lastRestocked: today
        }))
      )
  }

  private calculateRegularStock(item: StockItem): number {
    return item.isPreorder ? 0 : Math.max(item.quantity, 10)
  }
}
```

### Advanced Usage

#### Order Processor

```typescript
interface Order {
  id: string
  total: number
  isRush: boolean
  processingStatus: 'pending' | 'processing' | 'completed'
  lastUpdated: Date
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  processOrders(isSystemMaintenance: boolean): Collection<Order> {
    const now = new Date()

    return this.orders
      .unless(isSystemMaintenance, orders =>
        // Process orders unless system is under maintenance
        orders.map(order => ({
          ...order,
          processingStatus: this.getNextStatus(order),
          lastUpdated: now
        }))
      )
      .unless(
        orders => orders.where('isRush', true).isEmpty(),
        orders => orders.sortBy('total', 'desc')
      )
  }

  private getNextStatus(order: Order): 'pending' | 'processing' | 'completed' {
    switch (order.processingStatus) {
      case 'pending': return 'processing'
      case 'processing': return 'completed'
      default: return order.processingStatus
    }
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  price: number
  stock: number
  isLocked: boolean
}

const products = collect<TypedProduct>([
  { id: 1, price: 100, stock: 5, isLocked: false },
  { id: 2, price: 200, stock: 0, isLocked: true }
])

// Type-safe conditions and transformations
const result = products
  .unless(
    collection => collection.where('isLocked', true).isNotEmpty(),
    collection => collection.map(item => ({
      ...item,
      price: item.price * 1.1
    }))
  )

// TypeScript ensures type safety
// products.unless(true, items => items.invalid())  // ✗ TypeScript error
```

## Return Value

- Returns result of callback when condition is false
- Returns original collection when condition is true
- Maintains type safety with TypeScript
- Supports type transformation through callback
- Can be chained with other collection methods
- Original collection remains unchanged unless explicitly modified in callback

## Common Use Cases

### 1. E-commerce Pricing

- Regular pricing application
- Non-sale item processing
- Standard rate calculations
- Non-member pricing
- Default price adjustments

### 2. Inventory Control

- Standard stock management
- Regular reorder processing
- Default inventory levels
- Non-seasonal adjustments
- Standard stock thresholds

### 3. Order Management

- Standard processing flows
- Non-priority handling
- Regular shipping rules
- Default order routing
- Standard fulfillment

### 4. Customer Service

- Standard support routing
- Regular response handling
- Default ticket processing
- Non-VIP service levels
- Standard case management

### 5. Product Management

- Regular catalog updates
- Standard visibility rules
- Default category handling
- Non-featured item processing
- Regular product updates

### 6. Shipping Rules

- Standard shipping rates
- Regular delivery options
- Default carrier selection
- Non-express handling
- Standard packaging rules

### 7. Discount Application

- Regular pricing rules
- Non-promotional pricing
- Standard discount levels
- Default price calculations
- Regular member rates

### 8. Stock Management

- Regular restock rules
- Standard inventory checks
- Default stock levels
- Non-seasonal planning
- Regular stock alerts

### 9. User Management

- Standard access rules
- Regular account processing
- Default permission sets
- Non-premium features
- Standard user handling

### 10. Payment Processing

- Standard payment routes
- Regular transaction fees
- Default payment methods
- Non-priority processing
- Standard verification rules
