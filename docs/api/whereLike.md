# whereLike Method

The `whereLike()` method filters the collection to include items where the specified key's value matches a given pattern. The pattern uses SQL-like wildcards (%) for matching. This is particularly useful for search functionality and pattern-based filtering.

## Basic Syntax

```typescript
collect(items).whereLike(key: keyof T, pattern: string): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple pattern matching
const items = collect([
  { name: 'Basic Widget' },
  { name: 'Premium Widget' },
  { name: 'Super Gadget' }
])

// Find all widgets
const widgets = items.whereLike('name', '%Widget%')
console.log(widgets.all())
// [
//   { name: 'Basic Widget' },
//   { name: 'Premium Widget' }
// ]

// Find items starting with 'Super'
const superItems = items.whereLike('name', 'Super%')
```

### Working with Objects

```typescript
interface Product {
  sku: string
  name: string
  description: string
  category: string
}

const products = collect<Product>([
  {
    sku: 'WID-001',
    name: 'Basic Widget',
    description: 'A simple widget for basic tasks',
    category: 'widgets'
  },
  {
    sku: 'GAD-001',
    name: 'Super Gadget',
    description: 'Advanced gadget with premium features',
    category: 'gadgets'
  },
  {
    sku: 'WID-002',
    name: 'Premium Widget',
    description: 'Premium widget for advanced users',
    category: 'widgets'
  }
])

// Find products with 'premium' in description
const premiumProducts = products.whereLike('description', '%premium%')

// Find products by SKU pattern
const widgetSkus = products.whereLike('sku', 'WID-%')
```

### Real-world Examples

#### Product Search System

```typescript
interface SearchableProduct {
  id: string
  name: string
  description: string
  tags: string
  brand: string
  category: string
}

class ProductSearcher {
  constructor(private products: Collection<SearchableProduct>) {}

  searchByName(query: string): Collection<SearchableProduct> {
    return this.products.whereLike('name', `%${query}%`)
  }

  searchByDescription(query: string): Collection<SearchableProduct> {
    return this.products.whereLike('description', `%${query}%`)
  }

  searchByCategory(categoryPrefix: string): Collection<SearchableProduct> {
    return this.products.whereLike('category', `${categoryPrefix}%`)
  }

  findSimilarProducts(product: SearchableProduct): Collection<SearchableProduct> {
    // Find products with similar names or in same category
    return this.products
      .filter(p => p.id !== product.id)
      .filter(p =>
        this.calculateSimilarity(p.name, product.name) ||
        this.calculateSimilarity(p.category, product.category)
      )
  }

  private calculateSimilarity(a: string, b: string): boolean {
    // Simple implementation - could be more sophisticated
    return a.toLowerCase().includes(b.toLowerCase()) ||
           b.toLowerCase().includes(a.toLowerCase())
  }
}
```

#### Order Tracking System

```typescript
interface OrderRecord {
  orderId: string
  customerName: string
  status: string
  notes: string
  trackingNumber: string
}

class OrderFinder {
  constructor(private orders: Collection<OrderRecord>) {}

  findByCustomerName(namePattern: string): Collection<OrderRecord> {
    return this.orders.whereLike('customerName', `%${namePattern}%`)
  }

  findByTrackingNumber(prefix: string): Collection<OrderRecord> {
    return this.orders.whereLike('trackingNumber', `${prefix}%`)
  }

  findByNotes(keyword: string): Collection<OrderRecord> {
    return this.orders.whereLike('notes', `%${keyword}%`)
  }

  findByStatus(statusPattern: string): Collection<OrderRecord> {
    return this.orders.whereLike('status', `%${statusPattern}%`)
  }
}
```

### Advanced Usage

#### Inventory Search System

```typescript
interface InventoryItem {
  sku: string
  location: string
  batchNumber: string
  supplierCode: string
  notes: string
}

class InventorySearcher {
  constructor(private inventory: Collection<InventoryItem>) {}

  findBySKUPattern(pattern: string): Collection<InventoryItem> {
    return this.inventory.whereLike('sku', pattern)
  }

  findByLocation(locationPattern: string): Collection<InventoryItem> {
    return this.inventory.whereLike('location', `%${locationPattern}%`)
  }

  findByBatchPrefix(prefix: string): Collection<InventoryItem> {
    return this.inventory.whereLike('batchNumber', `${prefix}%`)
  }

  findBySupplierCode(pattern: string): Collection<InventoryItem> {
    return this.inventory.whereLike('supplierCode', pattern)
  }

  searchNotes(keyword: string): Collection<InventoryItem> {
    return this.inventory.whereLike('notes', `%${keyword}%`)
  }

  findByMultiplePatterns(patterns: Partial<Record<keyof InventoryItem, string>>): Collection<InventoryItem> {
    let results = this.inventory

    Object.entries(patterns).forEach(([key, pattern]) => {
      results = results.whereLike(key as keyof InventoryItem, pattern)
    })

    return results
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  description: string
  category: string
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A Widget', description: 'Test', category: 'widgets' },
  { id: 2, name: 'B Gadget', description: 'Demo', category: 'gadgets' }
])

// Type-safe pattern matching
const widgets = products.whereLike('name', '%Widget%')
const categoryMatch = products.whereLike('category', 'wid%')

// TypeScript enforces valid keys
// products.whereLike('invalid', '%test%')  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection with matching items
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Matching is case-insensitive
- Empty collection if no matches found

## Common Use Cases

### 1. Product Search

- Name matching
- Description search
- Category filtering
- SKU patterns
- Tag matching

### 2. Customer Search

- Name lookups
- Email patterns
- Address search
- Reference numbers
- Note searching

### 3. Order Management

- Order number patterns
- Status matching
- Reference searching
- Tracking numbers
- Note filtering

### 4. Inventory Control

- SKU patterns
- Location search
- Batch numbers
- Supplier codes
- Stock patterns

### 5. Content Management

- Title search
- Description matching
- Category patterns
- Tag filtering
- Reference lookup

### 6. User Management

- Username patterns
- Role matching
- Permission search
- Group filtering
- Status patterns

### 7. Log Analysis

- Message patterns
- Error types
- Status codes
- Source matching
- Time patterns

### 8. Category Management

- Path patterns
- Name matching
- Code searching
- Type filtering
- Group patterns

### 9. Reference Data

- Code patterns
- Name matching
- Type searching
- Category filtering
- Status patterns

### 10. Document Management

- Title search
- Content matching
- Reference patterns
- Type filtering
- Tag matching
