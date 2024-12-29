# values Method

The `values()` method returns a new collection containing all the values from the original collection. It's particularly useful when working with mapped data or when you need a fresh copy of the collection.

## Basic Syntax

```typescript
collect(items).values(): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect([1, 2, 3, 4, 5])
const values = items.values()
console.log(values.all())
// [1, 2, 3, 4, 5]

// Useful after transformations
const mapped = collect([1, 2, 3])
  .map(x => x * 2)
  .values()
console.log(mapped.all())
// [2, 4, 6]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget', price: 10.00 },
  { id: 2, name: 'Gadget', price: 20.00 }
])

// Get fresh collection after manipulations
const processed = products
  .map(product => ({ ...product, price: product.price * 1.1 }))
  .values()
```

### Real-world Examples

#### Product Catalog Manager

```typescript
interface CatalogItem {
  id: string
  name: string
  price: number
  inStock: boolean
  category: string
}

class CatalogManager {
  private items: Collection<CatalogItem>

  constructor(items: CatalogItem[]) {
    this.items = collect(items)
  }

  getAvailableProducts(): Collection<CatalogItem> {
    return this.items
      .filter(item => item.inStock)
      .values()
  }

  getCategoryProducts(category: string): Collection<CatalogItem> {
    return this.items
      .where('category', category)
      .values()
  }

  getPriceUpdatedProducts(increase: number): Collection<CatalogItem> {
    return this.items
      .map(item => ({
        ...item,
        price: item.price * (1 + increase)
      }))
      .values()
  }
}
```

#### Order Processing System

```typescript
interface Order {
  id: string
  items: Array<{ id: string; quantity: number }>
  status: 'pending' | 'processing' | 'shipped'
  total: number
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getPendingOrders(): Collection<Order> {
    return this.orders
      .where('status', 'pending')
      .values()
  }

  getProcessedOrders(): Collection<Order> {
    return this.orders
      .filter(order => ['processing', 'shipped'].includes(order.status))
      .values()
  }

  getHighValueOrders(threshold: number): Collection<Order> {
    return this.orders
      .filter(order => order.total > threshold)
      .values()
  }
}
```

### Advanced Usage

#### Inventory Management

```typescript
interface InventoryItem {
  sku: string
  quantity: number
  location: string
  lastUpdated: Date
}

class InventoryManager {
  private inventory: Collection<InventoryItem>

  constructor(items: InventoryItem[]) {
    this.inventory = collect(items)
  }

  getLocationInventory(location: string): Collection<InventoryItem> {
    return this.inventory
      .where('location', location)
      .map(item => ({
        ...item,
        lastUpdated: new Date()
      }))
      .values()
  }

  getLowStockItems(threshold: number): Collection<InventoryItem> {
    return this.inventory
      .filter(item => item.quantity < threshold)
      .sortBy('quantity')
      .values()
  }

  getUpdatedInventory(updates: Map<string, number>): Collection<InventoryItem> {
    return this.inventory
      .map(item => ({
        ...item,
        quantity: updates.get(item.sku) ?? item.quantity
      }))
      .values()
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

// Type-safe value extraction
const productValues: Collection<TypedProduct> = products.values()

// Maintains type safety through transformations
const updatedProducts = products
  .map(p => ({ ...p, price: p.price * 2 }))
  .values()
```

## Return Value

- Returns a new Collection containing all values
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Preserves the original order of items
- Maintains reference to original objects

## Common Use Cases

### 1. Product Management

- Fresh collection after updates
- Filtered product lists
- Price updated catalogs
- Category filtered items
- Stock level updates

### 2. Order Processing

- Status filtered orders
- Value filtered orders
- Date range selections
- Customer filtered orders
- Priority sorted lists

### 3. Inventory Control

- Stock level snapshots
- Location filtered items
- Updated quantity lists
- Reorder level checks
- Warehouse inventories

### 4. Customer Management

- Filtered customer lists
- Segment selections
- Status updates
- Priority customers
- Activity tracking

### 5. Price Management

- Updated price lists
- Discount applications
- Bulk price changes
- Special offer items
- Promotional pricing

### 6. Category Management

- Filtered categories
- Nested category lists
- Department selections
- Group assignments
- Classification updates

### 7. Stock Management

- Available items
- Low stock alerts
- Location transfers
- Quantity updates
- Restock lists

### 8. Report Generation

- Filtered data sets
- Period selections
- Status summaries
- Performance metrics
- Analysis results

### 9. Shipping Management

- Pending shipments
- Route assignments
- Delivery schedules
- Status tracking
- Location updates

### 10. Analytics Processing

- Filtered metrics
- Time period data
- Performance indicators
- Trend analysis
- Comparative data
