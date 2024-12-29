# unique Method

The `unique()` method returns a new collection containing only unique items from the original collection. When a key is provided, the method will return items with unique values for that specific key.

## Basic Syntax

```typescript
collect(items).unique(key?: keyof T): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array with duplicates
const numbers = collect([1, 1, 2, 2, 3, 4, 4, 5])
const unique = numbers.unique()
console.log(unique.all())
// [1, 2, 3, 4, 5]

// Object array with key-based uniqueness
const users = collect([
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'admin' },
  { id: 4, role: 'user' }
])

const uniqueRoles = users.unique('role')
console.log(uniqueRoles.all())
// [
//   { id: 1, role: 'admin' },
//   { id: 2, role: 'user' }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  sku: string
  category: string
  manufacturer: string
}

const products = collect<Product>([
  { id: 1, sku: 'A001', category: 'electronics', manufacturer: 'Sony' },
  { id: 2, sku: 'B002', category: 'electronics', manufacturer: 'Samsung' },
  { id: 3, sku: 'C003', category: 'electronics', manufacturer: 'Sony' }
])

// Get products with unique manufacturers
const uniqueManufacturers = products.unique('manufacturer')
```

### Real-world Examples

#### E-commerce Product Catalog

```typescript
interface CatalogItem {
  id: string
  productName: string
  brand: string
  category: string
  variant: string
}

class CatalogManager {
  private items: Collection<CatalogItem>

  constructor(items: CatalogItem[]) {
    this.items = collect(items)
  }

  getUniqueBrands(): Collection<CatalogItem> {
    return this.items.unique('brand')
  }

  getUniqueCategories(): Collection<CatalogItem> {
    return this.items.unique('category')
  }

  getUniqueProducts(): Collection<CatalogItem> {
    // Get unique products ignoring variants
    return this.items.unique('productName')
  }
}
```

#### Shopping Cart Deduplication

```typescript
interface CartItem {
  id: string
  productId: string
  variantId: string
  quantity: number
}

class ShoppingCart {
  private items: Collection<CartItem>

  constructor(items: CartItem[]) {
    this.items = collect(items)
  }

  consolidateDuplicates(): Collection<CartItem> {
    // Remove duplicate entries of the same product variant
    return this.items.unique('variantId')
  }

  getUniqueProducts(): Collection<CartItem> {
    // Get unique products regardless of variants
    return this.items.unique('productId')
  }
}
```

### Advanced Usage

#### Order Processing System

```typescript
interface Order {
  id: string
  customerId: string
  shippingAddress: string
  status: 'pending' | 'processed' | 'shipped'
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getUniqueCustomers(): Collection<Order> {
    // Get orders from unique customers
    return this.orders.unique('customerId')
  }

  getUniqueShippingAddresses(): Collection<Order> {
    // Get orders with unique shipping addresses
    return this.orders.unique('shippingAddress')
  }

  getUniqueOrderStatuses(): Collection<Order> {
    // Get orders with different statuses
    return this.orders.unique('status')
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  category: string
  tag: string
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, category: 'A', tag: 'new' },
  { id: 2, category: 'A', tag: 'featured' },
  { id: 3, category: 'B', tag: 'new' }
])

// Type-safe unique filtering
const uniqueCategories = items.unique('category')
const uniqueTags = items.unique('tag')

// TypeScript enforces valid keys
// items.unique('invalid')         // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing only unique items
- When a key is provided, returns first occurrence of items with unique values for that key
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses strict equality (===) for comparison

## Common Use Cases

### 1. E-commerce Applications

- Filtering unique product categories
- Consolidating shopping cart items
- Listing unique brands or manufacturers
- Displaying unique product variants

### 2. Customer Management

- Identifying unique customer segments
- Filtering unique shipping addresses
- Listing unique payment methods
- Managing unique account types

### 3. Order Processing

- Processing unique order statuses
- Managing unique shipping destinations
- Tracking unique payment methods
- Handling unique order types

### 4. Product Catalog

- Managing unique product categories
- Filtering unique brands
- Listing unique product types
- Handling unique specifications

### 5. Inventory Management

- Tracking unique SKUs
- Managing unique storage locations
- Listing unique suppliers
- Handling unique product conditions

### 6. User Management

- Filtering unique user roles
- Managing unique permissions
- Listing unique user statuses
- Handling unique user preferences

### 7. Marketing Campaigns

- Identifying unique customer segments
- Managing unique promotion codes
- Tracking unique campaign sources
- Handling unique marketing channels

### 8. Analytics

- Calculating unique visitor counts
- Tracking unique page views
- Analyzing unique transaction patterns
- Measuring unique user interactions

### 9. Configuration Management

- Managing unique settings
- Tracking unique environment variables
- Listing unique feature flags
- Handling unique system states

### 10. Event Processing

- Tracking unique event types
- Managing unique event sources
- Listing unique event handlers
- Handling unique event priorities
