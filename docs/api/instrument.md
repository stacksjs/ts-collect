# instrument Method

The `instrument()` method provides real-time monitoring and performance statistics for collection operations. It wraps the collection in a proxy that tracks operation counts and timing, allowing for performance analysis and debugging.

## Basic Syntax

```typescript
instrument(callback: (stats: Map<string, number>) => void): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const collection = collect([1, 2, 3, 4, 5])
  .instrument(stats => {
    console.log('Collection stats:', Object.fromEntries(stats))
  })
  .filter(num => num > 2)
  .map(num => num * 2)

// Logs:
// Collection stats: {
//   count: 5,
//   operations: 2,
//   timeStart: 1703980800000
// }
```

### Performance Monitoring

```typescript
interface PerformanceMetrics {
  operationCount: number
  executionTime: number
  itemCount: number
}

function monitorPerformance<T>(collection: CollectionOperations<T>): PerformanceMetrics {
  let metrics: PerformanceMetrics = {
    operationCount: 0,
    executionTime: 0,
    itemCount: 0
  }

  collection.instrument(stats => {
    metrics = {
      operationCount: stats.get('operations') || 0,
      executionTime: Date.now() - (stats.get('timeStart') || 0),
      itemCount: stats.get('count') || 0
    }
  })

  return metrics
}
```

### Real-world Example: E-commerce Performance Monitoring

```typescript
interface Product {
  id: string
  name: string
  price: number
  category: string
}

class ProductCatalog {
  private products: CollectionOperations<Product>
  private performanceStats: Map<string, number>

  constructor(products: Product[]) {
    this.performanceStats = new Map()

    this.products = collect(products).instrument(stats => {
      this.performanceStats = stats
    })
  }

  getProductsByCategory(category: string) {
    const startTime = Date.now()

    const result = this.products
      .where('category', category)
      .sortBy('price')
      .map(product => ({
        ...product,
        price: product.price * 1.2 // Add markup
      }))

    this.logPerformance('categoryQuery', Date.now() - startTime)
    return result
  }

  private logPerformance(operation: string, duration: number) {
    console.log(`Performance Report for ${operation}:`)
    console.log(`- Total Operations: ${this.performanceStats.get('operations')}`)
    console.log(`- Items Processed: ${this.performanceStats.get('count')}`)
    console.log(`- Duration: ${duration}ms`)
  }
}

// Usage example
const catalog = new ProductCatalog([
  { id: '1', name: 'Laptop', price: 999, category: 'Electronics' },
  { id: '2', name: 'Mouse', price: 49, category: 'Electronics' },
  { id: '3', name: 'Desk', price: 199, category: 'Furniture' }
])

catalog.getProductsByCategory('Electronics')
```

## Return Value

- Returns the original collection wrapped in a monitoring proxy
- Maintains all collection methods and functionality
- Provides real-time performance statistics
- Preserves collection type safety
- Non-intrusive performance monitoring
- Chain-able with other collection methods

## Common Use Cases

1. Performance Monitoring
   - Query optimization
   - Operation profiling
   - Performance benchmarking
   - Resource usage tracking

2. Debugging
   - Operation counting
   - Execution timing
   - Method usage tracking
   - Performance bottleneck identification

3. System Analysis
   - Resource utilization monitoring
   - Operation profiling
   - Performance optimization
   - Usage pattern analysis

4. Development Tools
   - Performance testing
   - Debug logging
   - Operation auditing
   - Method usage analysis

5. Quality Assurance
   - Performance regression testing
   - Operation validation
   - Resource monitoring
   - Usage pattern verification
