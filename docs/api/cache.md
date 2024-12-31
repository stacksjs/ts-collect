# cache Method

The `cache()` method stores the collection's results in memory for a specified time period, helping to optimize performance for expensive operations. It returns the same collection if the cache is still valid, or a new collection if the cache has expired.

## Basic Syntax

```typescript
cache(ttl: number = 60000): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', role: 'admin' },
  { name: 'Avery', role: 'user' }
])

// Cache results for 1 minute (60000ms)
const cached = users.cache()

// Cache results for 5 minutes
const longerCache = users.cache(300000)
```

### Working with Expensive Operations

```typescript
interface Product {
  id: number
  name: string
  price: number
  metadata: Record<string, any>
}

class ProductRepository {
  private products: CollectionOperations<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  getExpensiveCalculation() {
    return this.products
      .map(product => {
        // Simulate expensive calculation
        return { ...product, calculated: product.price * 1.2 }
      })
      .cache(300000) // Cache for 5 minutes
  }
}
```

### Real-world Example: E-commerce Caching Strategy

```typescript
interface CatalogItem {
  sku: string
  name: string
  price: number
  stock: number
  category: string
}

class CatalogManager {
  private catalog: CollectionOperations<CatalogItem>

  constructor(items: CatalogItem[]) {
    this.catalog = collect(items)
  }

  getPopularItems() {
    return this.catalog
      .sortBy('stock', 'desc')
      .take(10)
      .cache(300000) // Cache popular items for 5 minutes
  }

  getCategoryItems(category: string) {
    return this.catalog
      .where('category', category)
      .cache(600000) // Cache category results for 10 minutes
  }

  getItemDetails(sku: string) {
    return this.catalog
      .where('sku', sku)
      .first()
  }
}

const manager = new CatalogManager([
  { sku: 'LAP001', name: 'Laptop Pro', price: 999, stock: 50, category: 'Electronics' },
  { sku: 'MOU001', name: 'Wireless Mouse', price: 49, stock: 100, category: 'Electronics' }
])
```

## Return Value

- Returns the cached collection if within TTL (Time To Live)
- Returns a new collection if cache has expired
- Maintains collection type and methods
- Preserves original data structure
- Memory-efficient storage of results
- Thread-safe caching implementation

## Common Use Cases

1. Performance Optimization
   - Caching expensive calculations
   - Storing frequently accessed data
   - Reducing database queries
   - Optimizing API response times

2. Data Aggregation
   - Caching report results
   - Storing computed statistics
   - Maintaining aggregated totals
   - Preserving filtered datasets

3. Resource Management
   - Reducing CPU usage
   - Managing memory utilization
   - Optimizing network requests
   - Controlling database load

4. Real-time Applications
   - Caching live inventory data
   - Storing price calculations
   - Managing user session data
   - Maintaining state information

5. API Response Optimization
   - Caching external API responses
   - Storing transformed data
   - Managing rate limits
   - Reducing service calls
