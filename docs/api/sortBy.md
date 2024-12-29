# sortBy Method

The `sortBy()` method sorts the collection by a given key. It provides a simpler alternative to `sort()` when you need to sort by a single property, with optional ascending or descending direction.

## Basic Syntax

```typescript
collect(items).sortBy(key: keyof T, direction: 'asc' | 'desc' = 'asc'): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect([
  { id: 3, name: 'Widget' },
  { id: 1, name: 'Gadget' },
  { id: 2, name: 'Tool' }
])

// Sort by id ascending (default)
const sortedById = items.sortBy('id')
console.log(sortedById.all())
// [
//   { id: 1, name: 'Gadget' },
//   { id: 2, name: 'Tool' },
//   { id: 3, name: 'Widget' }
// ]

// Sort by name descending
const sortedByName = items.sortBy('name', 'desc')
console.log(sortedByName.all())
// [
//   { id: 3, name: 'Widget' },
//   { id: 2, name: 'Tool' },
//   { id: 1, name: 'Gadget' }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
  rating: number
}

const products = collect<Product>([
  { id: 1, name: 'Basic Widget', price: 19.99, stock: 50, rating: 4.2 },
  { id: 2, name: 'Premium Widget', price: 49.99, stock: 25, rating: 4.8 },
  { id: 3, name: 'Budget Widget', price: 9.99, stock: 100, rating: 3.9 }
])

// Sort by price ascending
const byPrice = products.sortBy('price')

// Sort by rating descending
const byRating = products.sortBy('rating', 'desc')

// Sort by stock ascending
const byStock = products.sortBy('stock')
```

### Real-world Examples

#### Product Catalog Manager

```typescript
interface CatalogProduct {
  id: string
  name: string
  price: number
  salesRank: number
  dateAdded: string
  views: number
}

class CatalogManager {
  private products: Collection<CatalogProduct>

  constructor(products: CatalogProduct[]) {
    this.products = collect(products)
  }

  getPopularProducts(): Collection<CatalogProduct> {
    return this.products.sortBy('views', 'desc')
  }

  getBestSellers(): Collection<CatalogProduct> {
    return this.products.sortBy('salesRank')
  }

  getNewestProducts(): Collection<CatalogProduct> {
    return this.products.sortBy('dateAdded', 'desc')
  }

  getPriceRanged(ascending: boolean = true): Collection<CatalogProduct> {
    return this.products.sortBy('price', ascending ? 'asc' : 'desc')
  }
}
```

#### Order Processing System

```typescript
interface Order {
  id: string
  customerName: string
  total: number
  items: number
  orderDate: string
  priority: number
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getOrdersByValue(): Collection<Order> {
    return this.orders.sortBy('total', 'desc')
  }

  getOrdersByDate(): Collection<Order> {
    return this.orders.sortBy('orderDate')
  }

  getOrdersByPriority(): Collection<Order> {
    return this.orders.sortBy('priority', 'desc')
  }

  getOrdersByCustomer(): Collection<Order> {
    return this.orders.sortBy('customerName')
  }
}
```

### Advanced Usage

#### Inventory Management System

```typescript
interface InventoryItem {
  sku: string
  name: string
  quantityAvailable: number
  reorderPoint: number
  lastRestockDate: string
  turnoverRate: number
}

class InventoryManager {
  private inventory: Collection<InventoryItem>

  constructor(items: InventoryItem[]) {
    this.inventory = collect(items)
  }

  getLowStockItems(): Collection<InventoryItem> {
    return this.inventory
      .filter(item => item.quantityAvailable <= item.reorderPoint)
      .sortBy('quantityAvailable')
  }

  getHighTurnoverItems(): Collection<InventoryItem> {
    return this.inventory
      .sortBy('turnoverRate', 'desc')
      .take(10)
  }

  getRecentlyRestocked(): Collection<InventoryItem> {
    return this.inventory
      .sortBy('lastRestockDate', 'desc')
      .take(20)
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
  rating: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100, rating: 4.5 },
  { id: 2, name: 'B', price: 200, rating: 3.8 }
])

// Type-safe key selection
const byPrice = products.sortBy('price')
const byRating = products.sortBy('rating', 'desc')

// TypeScript enforces valid keys
// products.sortBy('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a new sorted Collection
- Original collection remains unchanged
- Handles null/undefined values appropriately
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Direction defaults to 'asc' if not specified

## Common Use Cases

### 1. Product Display

- Price ordering
- Rating-based sorting
- Name alphabetization
- Stock level ordering
- Date-added sorting

### 2. Order Management

- Order value sorting
- Date-based ordering
- Priority sorting
- Status progression
- Customer name ordering

### 3. Inventory Control

- Stock level sorting
- Reorder priority
- SKU organization
- Date-based sorting
- Turnover rate ordering

### 4. Customer Analytics

- Purchase value sorting
- Registration date ordering
- Activity level sorting
- Loyalty points ordering
- Engagement metrics

### 5. Review Management

- Rating-based sorting
- Date sorting
- Helpfulness ranking
- Response status
- Customer type ordering

### 6. Category Management

- Alphabetical sorting
- Product count ordering
- View count sorting
- Conversion rate ordering
- Priority level sorting

### 7. Price Management

- Value-based sorting
- Margin sorting
- Discount level ordering
- Price change tracking
- Comparison sorting

### 8. Warehouse Management

- Location sorting
- Quantity ordering
- Date received sorting
- Shipping priority
- Size-based ordering

### 9. Report Generation

- Sales volume sorting
- Date-based ordering
- Performance metrics
- Error rate sorting
- Success rate ordering

### 10. Search Results

- Relevance sorting
- Price ordering
- Rating-based sorting
- Availability ordering
- Distance-based sorting
