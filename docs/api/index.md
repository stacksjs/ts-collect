# Index Method

The `index()` method creates internal indexes on specified keys to optimize subsequent lookup operations on the collection. This is particularly useful for large datasets where you frequently query or filter by certain fields.

## Basic Syntax

```typescript
index<K extends keyof T>(keys: K[]): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, email: 'chris@example.com', role: 'admin' },
  { id: 2, email: 'avery@example.com', role: 'user' },
  { id: 3, email: 'buddy@example.com', role: 'admin' }
])

// Create indexes on id and role fields
users.index(['id', 'role'])

// Subsequent operations on these fields will be optimized
const adminUsers = users.where('role', 'admin')
const userById = users.where('id', 1)
```

### Working with Complex Objects

```typescript
interface Product {
  sku: string
  category: string
  brand: string
  price: number
  inStock: boolean
}

const products = collect<Product>([
  {
    sku: 'LAPTOP-1',
    category: 'electronics',
    brand: 'TechBrand',
    price: 999.99,
    inStock: true
  },
  // ... more products
])

// Create indexes for frequently queried fields
products.index(['sku', 'category', 'brand'])

// These operations will now be faster
const techProducts = products.where('brand', 'TechBrand')
const electronicsProducts = products.where('category', 'electronics')
```

### Real-world Example: E-commerce Catalog Management

```typescript
interface CatalogItem {
  id: string
  sku: string
  category: string
  subcategory: string
  vendor: string
  price: number
  stockLevel: number
}

class CatalogManager {
  private catalog: Collection<CatalogItem>

  constructor(items: CatalogItem[]) {
    this.catalog = collect(items)
      .index(['sku', 'category', 'vendor']) // Index frequently accessed fields
  }

  findBySKU(sku: string): CatalogItem | undefined {
    return this.catalog.where('sku', sku).first()
  }

  getVendorProducts(vendor: string): Collection<CatalogItem> {
    return this.catalog.where('vendor', vendor)
  }

  getCategoryProducts(category: string): Collection<CatalogItem> {
    return this.catalog.where('category', category)
  }

  updateStock(sku: string, newStockLevel: number): void {
    const item = this.findBySKU(sku)
    if (item) {
      item.stockLevel = newStockLevel
    }
  }
}
```

## Type Safety

```typescript
interface IndexedItem {
  id: number
  code: string
  status: 'active' | 'inactive'
}

const items = collect<IndexedItem>([
  { id: 1, code: 'A1', status: 'active' },
  { id: 2, code: 'B1', status: 'inactive' }
])

// Type-safe indexing
items.index(['id', 'status'])

// TypeScript will catch invalid key names
// items.index(['invalid'])  // ✗ TypeScript error
// items.index(['id', 'nonexistent'])  // ✗ TypeScript error
```

## Return Value

- Returns the same collection instance for method chaining
- Creates internal index structures for specified keys
- Does not modify the collection items
- Maintains type safety with TypeScript
- Optimizes subsequent operations on indexed fields
- Index structures are maintained automatically as collection changes

## Common Use Cases

### 1. Product Catalogs

- Fast SKU lookups
- Category filtering
- Brand searches
- Price range queries
- Stock level checks

### 2. User Management

- User ID lookups
- Role-based filtering
- Email searches
- Status queries
- Permission checks

### 3. Order Processing

- Order number lookups
- Status filtering
- Customer order history
- Fulfillment tracking
- Payment status queries

### 4. Inventory Management

- Stock level checks
- Location tracking
- Category filtering
- Supplier grouping
- Reorder point monitoring

### 5. Analytics Performance

- High-frequency data access
- Real-time reporting
- Customer segmentation
- Performance metrics
- Transaction analysis
