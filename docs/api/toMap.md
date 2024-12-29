# toMap Method

The `toMap()` method converts a collection into a Map object, using the specified key as the Map's keys. This is particularly useful for creating lookup tables and indexing data for quick access.

## Basic Syntax

```typescript
collect(items).toMap<K extends keyof T>(key: K): Map<T[K], T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect([
  { id: 1, name: 'Widget' },
  { id: 2, name: 'Gadget' }
])

const itemMap = items.toMap('id')
console.log(itemMap.get(1))  // { id: 1, name: 'Widget' }
console.log(itemMap.has(2))  // true

// Quick lookups
const item = itemMap.get(1)
console.log(item?.name)  // 'Widget'
```

### Working with Objects

```typescript
interface Product {
  sku: string
  name: string
  price: number
  inStock: boolean
}

const products = collect<Product>([
  { sku: 'WID-001', name: 'Widget', price: 100, inStock: true },
  { sku: 'GAD-001', name: 'Gadget', price: 200, inStock: false }
])

// Create SKU lookup map
const productsBySku = products.toMap('sku')

// Quick product lookup
const product = productsBySku.get('WID-001')
console.log(product?.price)  // 100
```

### Real-world Examples

#### Product Inventory System

```typescript
interface InventoryItem {
  sku: string
  quantity: number
  location: string
  reorderPoint: number
}

class InventoryManager {
  private inventory: Map<string, InventoryItem>

  constructor(items: Collection<InventoryItem>) {
    this.inventory = items.toMap('sku')
  }

  getStockLevel(sku: string): number {
    return this.inventory.get(sku)?.quantity ?? 0
  }

  needsReorder(sku: string): boolean {
    const item = this.inventory.get(sku)
    if (!item) return false
    return item.quantity <= item.reorderPoint
  }

  getLocationItems(location: string): InventoryItem[] {
    return Array.from(this.inventory.values())
      .filter(item => item.location === location)
  }

  updateStock(sku: string, quantity: number): void {
    const item = this.inventory.get(sku)
    if (item) {
      item.quantity = quantity
    }
  }
}
```

#### Order Processing System

```typescript
interface Order {
  orderId: string
  customer: string
  items: string[]
  status: 'pending' | 'processing' | 'completed'
}

class OrderProcessor {
  private orderMap: Map<string, Order>

  constructor(orders: Collection<Order>) {
    this.orderMap = orders.toMap('orderId')
  }

  getOrderStatus(orderId: string): string {
    return this.orderMap.get(orderId)?.status ?? 'not found'
  }

  updateStatus(orderId: string, status: 'pending' | 'processing' | 'completed'): void {
    const order = this.orderMap.get(orderId)
    if (order) {
      order.status = status
    }
  }

  getCustomerOrders(customer: string): Order[] {
    return Array.from(this.orderMap.values())
      .filter(order => order.customer === customer)
  }

  hasOrder(orderId: string): boolean {
    return this.orderMap.has(orderId)
  }
}
```

### Advanced Usage

#### Price Cache System

```typescript
interface PriceData {
  productId: string
  basePrice: number
  discountPrice: number | null
  lastUpdated: Date
  currency: string
}

class PriceCacheManager {
  private priceCache: Map<string, PriceData>

  constructor(prices: Collection<PriceData>) {
    this.priceCache = prices.toMap('productId')
  }

  getCurrentPrice(productId: string): number {
    const priceData = this.priceCache.get(productId)
    if (!priceData) return 0
    return priceData.discountPrice ?? priceData.basePrice
  }

  updatePrices(updates: PriceData[]): void {
    updates.forEach(update => {
      this.priceCache.set(update.productId, {
        ...update,
        lastUpdated: new Date()
      })
    })
  }

  getStaleEntries(maxAge: number): string[] {
    const cutoff = new Date(Date.now() - maxAge)
    return Array.from(this.priceCache.entries())
      .filter(([_, data]) => data.lastUpdated < cutoff)
      .map(([id]) => id)
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  sku: string
  name: string
}

const products = collect<TypedProduct>([
  { id: 1, sku: 'A', name: 'Widget' },
  { id: 2, sku: 'B', name: 'Gadget' }
])

// Type-safe map creation
const byId: Map<number, TypedProduct> = products.toMap('id')
const bySku: Map<string, TypedProduct> = products.toMap('sku')

// TypeScript enforces key types
// products.toMap('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a new Map object
- Keys are the values from the specified property
- Values are the complete original objects
- Maintains type safety
- Later keys override earlier ones
- Map provides O(1) lookup performance

## Common Use Cases

### 1. Product Management

- SKU lookups
- Product ID indexing
- Category mapping
- Price caching
- Stock tracking

### 2. Order Processing

- Order ID lookups
- Status tracking
- Customer mapping
- Reference tracking
- Batch processing

### 3. Inventory Control

- Stock lookups
- Location mapping
- Supplier tracking
- Asset management
- Resource allocation

### 4. Customer Management

- Customer ID lookups
- Account mapping
- Session tracking
- Preference caching
- Profile indexing

### 5. Price Management

- Price lookups
- Discount mapping
- Rate caching
- Currency conversion
- Tier management

### 6. Cache Implementation

- Data caching
- Quick lookups
- Reference storage
- State management
- Resource pooling

### 7. Session Management

- User sessions
- Token mapping
- State tracking
- Authentication
- Access control

### 8. Configuration

- Setting lookups
- Feature flags
- Preference mapping
- Option tracking
- Parameter storage

### 9. Reference Data

- Code lookups
- Category mapping
- Relationship tracking
- Metadata storage
- Attribute indexing

### 10. Performance Optimization

- Quick access
- Cached lookups
- Indexed searches
- Reference tracking
- State management
