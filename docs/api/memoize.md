# memoize Method

The `memoize()` method caches collection items based on a specified key, ensuring that items with the same key value return the same instance. This method is particularly useful for optimizing memory usage and performance when dealing with duplicate data.

## Basic Syntax

```typescript
memoize<K extends keyof T>(key: K): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', role: 'admin' },
  { id: 1, name: 'Chris', role: 'admin' }, // Duplicate entry
  { id: 2, name: 'Avery', role: 'user' }
])

// Memoize based on id
const memoized = users.memoize('id')
// Now both entries with id: 1 reference the same object
```

### Memory Optimization

```typescript
interface Product {
  productId: string
  name: string
  category: string
  description: string // Large text field
}

const products = collect<Product>([
  {
    productId: 'A1',
    name: 'Laptop',
    category: 'Electronics',
    description: 'High-performance laptop with...'
  },
  {
    productId: 'A1',
    name: 'Laptop',
    category: 'Electronics',
    description: 'High-performance laptop with...'
  }
])

// Optimize memory by memoizing based on productId
const optimized = products.memoize('productId')
```

### Real-world Example: E-commerce Order Processing

```typescript
interface OrderLine {
  orderId: string
  productId: string
  product: {
    name: string
    details: string
    specifications: Record<string, any>
  }
  quantity: number
}

class OrderProcessor {
  private orderLines: CollectionOperations<OrderLine>

  constructor(orders: OrderLine[]) {
    // Memoize product details to save memory
    this.orderLines = collect(orders).memoize('productId')
  }

  processOrders() {
    return this.orderLines
      .groupBy('orderId')
      .map(group => {
        // Process each order group
        // Product details are shared among identical products
        return group
      })
  }
}

const processor = new OrderProcessor([
  {
    orderId: 'ORD-001',
    productId: 'PROD-1',
    product: {
      name: 'Gaming Laptop',
      details: 'Very long product description...',
      specifications: { /* Large object */ }
    },
    quantity: 1
  },
  {
    orderId: 'ORD-002',
    productId: 'PROD-1', // Same product, will share the reference
    product: {
      name: 'Gaming Laptop',
      details: 'Very long product description...',
      specifications: { /* Large object */ }
    },
    quantity: 2
  }
])
```

## Return Value

- Returns a new collection with memoized items
- Maintains original collection structure
- Preserves item references for matching keys
- Type-safe implementation
- Memory-efficient storage of shared data
- Original collection remains unchanged

## Common Use Cases

1. Memory Optimization
   - Reducing duplicate data storage
   - Managing large datasets
   - Optimizing resource usage
   - Handling repeated references

2. Performance Enhancement
   - Improving lookup speeds
   - Reducing object instantiation
   - Optimizing memory allocation
   - Enhancing data processing

3. Data Consistency
   - Maintaining reference equality
   - Ensuring data synchronization
   - Managing shared state
   - Preventing data duplication

4. Complex Data Processing
   - Processing order data
   - Managing product catalogs
   - Handling user sessions
   - Processing related records

5. Cache Management
   - Optimizing repeated queries
   - Managing shared resources
   - Reducing memory footprint
   - Improving response times
