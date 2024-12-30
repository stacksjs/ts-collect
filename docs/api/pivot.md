# Pivot Method

The `pivot()` method transforms a collection into a Map using the specified key field as the map key and the value field as the map value. This is particularly useful for creating lookup tables or transforming data into key-value pairs.

## Basic Syntax

```typescript
pivot<K extends keyof T, V extends keyof T>(
  keyField: K,
  valueField: V
): Map<T[K], T[V]>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', role: 'admin' },
  { id: 2, name: 'Avery', role: 'user' },
  { id: 3, name: 'Buddy', role: 'admin' }
])

const userNames = users.pivot('id', 'name')
console.log([...userNames.entries()])
// [
//   [1, 'Chris'],
//   [2, 'Avery'],
//   [3, 'Buddy']
// ]
```

### Working with Complex Objects

```typescript
interface Product {
  sku: string
  name: string
  price: number
  category: string
}

const products = collect<Product>([
  { sku: 'LAPTOP1', name: 'Pro Laptop', price: 999, category: 'Electronics' },
  { sku: 'PHONE1', name: 'Smart Phone', price: 699, category: 'Electronics' }
])

const productPrices = products.pivot('sku', 'price')
console.log(productPrices.get('LAPTOP1')) // 999
```

### Real-world Example: E-commerce Price Lookup

```typescript
interface ProductData {
  id: string
  sku: string
  name: string
  price: number
  discountPrice: number
  inventory: number
  status: 'active' | 'discontinued'
}

class PricingManager {
  private products: Collection<ProductData>
  private priceMap: Map<string, number>
  private discountMap: Map<string, number>

  constructor(products: ProductData[]) {
    this.products = collect(products)
    this.priceMap = this.products.pivot('sku', 'price')
    this.discountMap = this.products.pivot('sku', 'discountPrice')
  }

  getPrice(sku: string): number | undefined {
    return this.priceMap.get(sku)
  }

  getDiscount(sku: string): number | undefined {
    return this.discountMap.get(sku)
  }

  getSavings(sku: string): number {
    const regular = this.getPrice(sku) ?? 0
    const discount = this.getDiscount(sku) ?? regular
    return regular - discount
  }

  updatePrices(priceUpdates: Array<{ sku: string, price: number }>) {
    priceUpdates.forEach(update => {
      this.priceMap.set(update.sku, update.price)
    })
  }
}

// Usage
const manager = new PricingManager([
  {
    id: '1',
    sku: 'LAPTOP1',
    name: 'Pro Laptop',
    price: 999,
    discountPrice: 899,
    inventory: 10,
    status: 'active'
  }
])

console.log(manager.getSavings('LAPTOP1')) // 100
```

## Type Safety

```typescript
interface MetricData {
  key: string
  value: number
  timestamp: Date
}

const metrics = collect<MetricData>([
  { key: 'cpu', value: 85, timestamp: new Date() },
  { key: 'memory', value: 60, timestamp: new Date() }
])

// Type-safe pivoting
const values: Map<string, number> = metrics.pivot('key', 'value')
const timestamps: Map<string, Date> = metrics.pivot('key', 'timestamp')

// TypeScript enforces correct field types
// metrics.pivot('key', 'nonexistent')  // ✗ TypeScript error
// metrics.pivot('timestamp', 'value')  // ✗ Type error if timestamp can't be used as key
```

## Return Value

- Returns a Map where:
  - Keys are of type T[K]
  - Values are of type T[V]
- Each key is unique (last value wins for duplicates)
- Maintains type safety through generics
- Handles null and undefined gracefully
- Keys must be valid Map keys (string, number, symbol)
- Values can be of any type

## Common Use Cases

### 1. Lookup Tables

- SKU to price mapping
- ID to name mapping
- Code to value mapping
- Key-value stores
- Reference data

### 2. Data Transformation

- Configuration mapping
- Settings management
- Feature flags
- State management
- Cache structures

### 3. Price Management

- Product pricing
- Discount mapping
- Tax rates
- Currency conversion
- Price history

### 4. User Management

- User roles
- Permissions
- Preferences
- Settings
- Features

### 5. Inventory Control

- Stock levels
- Location mapping
- Status tracking
- Availability
- Reservations
