# optimize Method

The `optimize()` method enhances collection performance by automatically applying optimization strategies such as caching and indexing based on collection size and access patterns. It's particularly useful for large datasets or frequently accessed collections.

## Basic Syntax

```typescript
optimize(): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris' },
  { id: 2, name: 'Avery' }
])

// Automatically optimize the collection
const optimized = users.optimize()
```

### Performance Enhancement

```typescript
interface DatabaseRecord {
  id: number
  data: string
  timestamp: number
}

const records = collect<DatabaseRecord>([
  { id: 1, data: 'Large payload...', timestamp: Date.now() },
  { id: 2, data: 'Another large payload...', timestamp: Date.now() }
])

// Optimize before performing expensive operations
const result = records
  .optimize()
  .filter(record => record.timestamp > Date.now() - 3600000)
  .map(record => record.data)
```

### Real-world Example: E-commerce Catalog Optimization

```typescript
interface Product {
  id: string
  name: string
  category: string
  price: number
  attributes: Record<string, any>
  inventory: number
}

class CatalogManager {
  private products: CollectionOperations<Product>

  constructor(products: Product[]) {
    // Optimize the catalog on initialization
    this.products = collect(products).optimize()
  }

  getProductsByCategory(category: string) {
    return this.products
      .where('category', category)
      .filter(product => product.inventory > 0)
  }

  searchProducts(query: string) {
    return this.products
      .filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.attributes.keywords?.includes(query)
      )
  }

  getPriceRange(category: string) {
    return this.products
      .where('category', category)
      .filter(product => product.inventory > 0)
      .pipe(products => ({
        min: products.min('price')?.price || 0,
        max: products.max('price')?.price || 0
      }))
  }
}

// Usage example
const manager = new CatalogManager([
  {
    id: 'LAPTOP1',
    name: 'Pro Laptop',
    category: 'Electronics',
    price: 999,
    attributes: { keywords: ['computer', 'laptop'] },
    inventory: 50
  },
  {
    id: 'MOUSE1',
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 49,
    attributes: { keywords: ['mouse', 'wireless'] },
    inventory: 100
  }
])
```

## Return Value

- Returns an optimized version of the collection
- Automatically applies caching for collections > 1000 items
- Creates indexes for frequently accessed fields
- Maintains original collection type safety
- Preserves collection methods and functionality
- Enables efficient data access patterns

## Common Use Cases

1. Large Dataset Management
   - Catalog optimization
   - Search result caching
   - Query performance
   - Bulk operations

2. Frequent Access Patterns
   - Product listings
   - User directories
   - Category filtering
   - Search functionality

3. Performance Critical Operations
   - Real-time filtering
   - Complex calculations
   - Repeated queries
   - Data aggregation

4. Resource Management
   - Memory optimization
   - Query efficiency
   - Cache utilization
   - Index management

5. Application Scaling
   - High-traffic handling
   - Response time optimization
   - Resource utilization
   - Performance scaling
