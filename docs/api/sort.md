# sort Method

The `sort()` method sorts the items in the collection. When used without arguments, it performs default sorting. When provided with a compare function, it uses that function to determine the sort order.

## Basic Syntax

```typescript
collect(items).sort(compareFunction?: (a: T, b: T) => number): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array sorting
const numbers = collect([3, 1, 4, 1, 5, 9, 2, 6])
const sorted = numbers.sort()
console.log(sorted.all())
// [1, 1, 2, 3, 4, 5, 6, 9]

// Custom comparison function
const reverseSort = numbers.sort((a, b) => b - a)
console.log(reverseSort.all())
// [9, 6, 5, 4, 3, 2, 1, 1]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget', price: 49.99, stock: 100 },
  { id: 2, name: 'Gadget', price: 99.99, stock: 50 },
  { id: 3, name: 'Tool', price: 29.99, stock: 75 }
])

// Sort by price
const sortedByPrice = products.sort((a, b) => a.price - b.price)

// Sort by name
const sortedByName = products.sort((a, b) => a.name.localeCompare(b.name))
```

### Real-world Examples

#### Product Catalog Manager

```typescript
interface CatalogItem {
  id: string
  name: string
  price: number
  rating: number
  salesCount: number
  lastRestocked: Date
}

class CatalogManager {
  private items: Collection<CatalogItem>

  constructor(items: CatalogItem[]) {
    this.items = collect(items)
  }

  getBestSellers(): Collection<CatalogItem> {
    return this.items.sort((a, b) => b.salesCount - a.salesCount)
  }

  getTopRated(): Collection<CatalogItem> {
    return this.items.sort((a, b) => b.rating - a.rating)
  }

  getRecentlyRestocked(): Collection<CatalogItem> {
    return this.items.sort((a, b) =>
      new Date(b.lastRestocked).getTime() - new Date(a.lastRestocked).getTime()
    )
  }

  getPriceSorted(ascending: boolean = true): Collection<CatalogItem> {
    return this.items.sort((a, b) =>
      ascending ? a.price - b.price : b.price - a.price
    )
  }
}
```

#### Order Management System

```typescript
interface Order {
  id: string
  total: number
  items: number
  priority: number
  createdAt: Date
  estimatedDelivery: Date
}

class OrderManager {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  sortByPriorityAndTotal(): Collection<Order> {
    return this.orders.sort((a, b) => {
      // First sort by priority
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      // Then by total
      return b.total - a.total
    })
  }

  sortByDeliveryDate(): Collection<Order> {
    return this.orders.sort((a, b) =>
      new Date(a.estimatedDelivery).getTime() - new Date(b.estimatedDelivery).getTime()
    )
  }

  sortByProcessingOrder(): Collection<Order> {
    return this.orders.sort((a, b) => {
      // Priority orders first
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      // Then by creation date
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  }
}
```

### Advanced Usage

#### Inventory Sorting System

```typescript
interface InventoryItem {
  id: string
  name: string
  stock: number
  reorderPoint: number
  lastSold: Date
  category: string
  stockValue: number
}

class InventoryManager {
  private inventory: Collection<InventoryItem>

  constructor(items: InventoryItem[]) {
    this.inventory = collect(items)
  }

  sortByRestockPriority(): Collection<InventoryItem> {
    return this.inventory.sort((a, b) => {
      // Calculate stock ratio (current stock / reorder point)
      const aRatio = a.stock / a.reorderPoint
      const bRatio = b.stock / b.reorderPoint

      if (aRatio !== bRatio) {
        // Lower ratio means higher restock priority
        return aRatio - bRatio
      }

      // If ratios are equal, sort by last sold date
      return new Date(b.lastSold).getTime() - new Date(a.lastSold).getTime()
    })
  }

  sortByValueAndCategory(): Collection<InventoryItem> {
    return this.inventory.sort((a, b) => {
      // First sort by category
      const categoryCompare = a.category.localeCompare(b.category)
      if (categoryCompare !== 0) {
        return categoryCompare
      }

      // Then by stock value
      return b.stockValue - a.stockValue
    })
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
  weight: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100, weight: 1.5 },
  { id: 2, name: 'B', price: 200, weight: 0.5 }
])

// Type-safe sorting
const sortedByPrice = products.sort((a, b) => a.price - b.price)
const sortedByName = products.sort((a, b) => a.name.localeCompare(b.name))

// TypeScript enforces parameter types
// products.sort((a: string, b: string) => 0)  // ✗ TypeScript error
```

## Return Value

- Returns a new sorted Collection
- Original collection remains unchanged
- Default sort handles basic types appropriately (numbers, strings)
- Custom compare function must return:
  - Negative number if a < b
  - Zero if a === b
  - Positive number if a > b
- Maintains type safety with TypeScript
- Can be chained with other collection methods

## Common Use Cases

### 1. Product Management

- Price-based sorting
- Name/alphabetical sorting
- Rating-based sorting
- Stock level sorting
- Category-based sorting

### 2. Order Processing

- Priority-based sorting
- Date-based sorting
- Total value sorting
- Status-based sorting
- Customer priority sorting

### 3. Inventory Management

- Stock level sorting
- Reorder priority sorting
- Value-based sorting
- Category grouping
- Last sold sorting

### 4. Customer Management

- Loyalty tier sorting
- Purchase value sorting
- Registration date sorting
- Activity level sorting
- Support priority sorting

### 5. Review Management

- Rating-based sorting
- Date-based sorting
- Helpfulness sorting
- Response priority sorting
- Featured review sorting

### 6. Shipping Management

- Priority-based sorting
- Distance-based sorting
- Weight-based sorting
- Delivery date sorting
- Cost-based sorting

### 7. Discount Management

- Value-based sorting
- Expiration date sorting
- Usage count sorting
- Priority-based sorting
- Category-based sorting

### 8. Category Management

- Hierarchical sorting
- Product count sorting
- Value-based sorting
- Alphabetical sorting
- Priority-based sorting

### 9. Pricing Management

- Value-based sorting
- Margin-based sorting
- Discount level sorting
- Category-based sorting
- Date-based sorting

### 10. Search Results

- Relevance-based sorting
- Popularity sorting
- Price-based sorting
- Rating-based sorting
- Availability sorting
