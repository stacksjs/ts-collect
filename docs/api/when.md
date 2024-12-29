# when Method

The `when()` method executes the given callback when the specified condition is true. It provides a fluent way to add conditional logic to collection operations.

## Basic Syntax

```typescript
collect(items).when(
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
const result = numbers.when(true, collection => collection.filter(n => n > 3))
console.log(result.all())
// [4, 5]

// Using callback condition
const hasHighNumbers = numbers.when(
  collection => collection.max() > 4,
  collection => collection.map(n => n * 2)
)
```

### Working with Objects

```typescript
interface Product {
  id: number
  price: number
  inStock: boolean
  isDiscounted: boolean
}

const products = collect<Product>([
  { id: 1, price: 100, inStock: true, isDiscounted: false },
  { id: 2, price: 200, inStock: false, isDiscounted: true },
  { id: 3, price: 300, inStock: true, isDiscounted: true }
])

// Apply discount when products are in stock
const processedProducts = products.when(
  product => product.where('inStock', true).isNotEmpty(),
  product => product.map(item => ({
    ...item,
    price: item.isDiscounted ? item.price * 0.9 : item.price
  }))
)
```

### Real-world Examples

#### E-commerce Price Calculator

```typescript
interface CartItem {
  id: string
  price: number
  quantity: number
  isEligibleForDiscount: boolean
}

class PriceCalculator {
  private items: Collection<CartItem>

  constructor(items: CartItem[]) {
    this.items = collect(items)
  }

  calculateTotal(hasPromoCode: boolean): Collection<CartItem> {
    return this.items
      .when(hasPromoCode, items =>
        items.map(item => ({
          ...item,
          price: item.isEligibleForDiscount ? item.price * 0.85 : item.price
        }))
      )
      .when(
        items => items.sum('price') > 1000,
        items => items.map(item => ({
          ...item,
          price: item.price * 0.95 // Bulk discount
        }))
      )
  }
}
```

#### Order Processor

```typescript
interface Order {
  id: string
  total: number
  items: number
  isPriority: boolean
  needsReview: boolean
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  processOrders(isBusinessHours: boolean): Collection<Order> {
    return this.orders
      .when(isBusinessHours, orders =>
        // Process all orders during business hours
        orders.map(order => ({ ...order, needsReview: false }))
      )
      .when(
        orders => orders.where('isPriority', true).isNotEmpty(),
        orders => orders.sortBy('total', 'desc')
      )
  }
}
```

### Advanced Usage

#### Dynamic Inventory Management

```typescript
interface InventoryItem {
  id: string
  stock: number
  reorderPoint: number
  lastOrdered: Date
  isSeasonalItem: boolean
}

class InventoryManager {
  private inventory: Collection<InventoryItem>

  constructor(items: InventoryItem[]) {
    this.inventory = collect(items)
  }

  processReorders(isHighSeason: boolean): Collection<InventoryItem> {
    const today = new Date()

    return this.inventory
      .when(isHighSeason, items =>
        // Increase reorder points during high season
        items.map(item => ({
          ...item,
          reorderPoint: item.isSeasonalItem ? item.reorderPoint * 1.5 : item.reorderPoint
        }))
      )
      .when(
        items => items.some(item => item.stock < item.reorderPoint),
        items => items.map(item => ({
          ...item,
          lastOrdered: item.stock < item.reorderPoint ? today : item.lastOrdered
        }))
      )
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  price: number
  stock: number
  category: string
}

const products = collect<TypedProduct>([
  { id: 1, price: 100, stock: 5, category: 'A' },
  { id: 2, price: 200, stock: 0, category: 'B' }
])

// Type-safe conditions and transformations
const result = products
  .when(
    collection => collection.sum('stock') > 0,
    collection => collection.filter(item => item.stock > 0)
  )
  .when(true, collection =>
    collection.map(item => ({
      ...item,
      price: item.price * 1.1
    }))
  )

// TypeScript ensures type safety
// products.when(true, items => items.invalid())  // ✗ TypeScript error
```

## Return Value

- Returns result of callback when condition is true
- Returns original collection when condition is false
- Maintains type safety with TypeScript
- Supports type transformation through callback
- Can be chained with other collection methods
- Original collection remains unchanged unless explicitly modified in callback

## Common Use Cases

### 1. E-commerce Pricing

- Conditional discounts application
- Bulk pricing rules
- Seasonal price adjustments
- Member pricing implementation
- Dynamic pricing strategies

### 2. Order Processing

- Conditional order workflows
- Priority order handling
- Business hours processing
- Order validation rules
- Special handling conditions

### 3. Inventory Management

- Conditional restock triggers
- Seasonal stock adjustments
- Low stock alerts
- Warehouse-specific rules
- Dynamic stock thresholds

### 4. User Management

- Role-based operations
- Conditional permissions
- Account status updates
- Access level modifications
- Profile validations

### 5. Cart Management

- Conditional shipping rules
- Discount eligibility checks
- Cart validation rules
- Quantity limit enforcement
- Bundle processing

### 6. Product Catalog

- Conditional visibility rules
- Category-based operations
- Seasonal product updates
- Stock-based modifications
- Price tier adjustments

### 7. Promotional Systems

- Campaign activation rules
- Conditional offers
- Time-based promotions
- Threshold-based rewards
- Member benefits

### 8. Shipping Management

- Conditional shipping rates
- Region-based rules
- Weight-based calculations
- Service level selection
- Special handling rules

### 9. Tax Calculations

- Regional tax rules
- Product category taxes
- Tax exemption handling
- Special tax rates
- Tax threshold rules

### 10. Customer Service

- Priority support rules
- SLA conditional logic
- Response time rules
- Escalation conditions
- Service level adjustments
