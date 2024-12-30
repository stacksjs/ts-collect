# Lazy Method

The `lazy()` method converts a collection into a lazy collection that defers execution of operations until values are actually needed. This is particularly useful for large datasets where you want to optimize memory usage and processing time.

## Basic Syntax

```typescript
lazy(): LazyCollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

const result = await numbers
  .lazy()
  .map(n => n * 2)
  .filter(n => n > 5)
  .toArray()

// Operations are only executed when toArray() is called
console.log(result)
// [6, 8, 10]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  isActive: boolean
}

const users = collect<User>([
  { id: 1, name: 'Chris', isActive: true },
  { id: 2, name: 'Avery', isActive: false },
  { id: 3, name: 'Buddy', isActive: true }
])

const activeUserNames = await users
  .lazy()
  .filter(user => user.isActive)
  .map(user => user.name)
  .toArray()
```

### Real-world Example: E-commerce Product Processing

```typescript
interface Product {
  id: string
  name: string
  price: number
  description: string
  inventory: number
}

class ProductProcessor {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  async processLargeInventory() {
    const results = await this.products
      .lazy()
      // Heavy transformations are deferred
      .map(product => ({
        ...product,
        description: this.processDescription(product.description),
        priceWithTax: this.calculateTax(product.price)
      }))
      // Filtering happens before transformation due to lazy evaluation
      .filter(product => product.inventory > 0)
      // Chunk processing for memory efficiency
      .chunk(100)

    // Process chunks as they become available
    for await (const chunk of results) {
      await this.saveToDatabase(chunk)
    }
  }

  private processDescription(description: string): string {
    // Simulate heavy text processing
    return description.toUpperCase()
  }

  private calculateTax(price: number): number {
    return price * 1.2
  }

  private async saveToDatabase(chunk: Product[]): Promise<void> {
    // Database save implementation
  }
}
```

## Type Safety

```typescript
interface DataPoint {
  timestamp: Date
  value: number
}

const data = collect<DataPoint>([
  { timestamp: new Date(), value: 100 },
  { timestamp: new Date(), value: 200 }
])

// Type-safe lazy operations
const processedData = await data
  .lazy()
  .filter(point => point.value > 150)
  .map(point => ({
    time: point.timestamp.toISOString(),
    normalizedValue: point.value / 100
  }))
  .toArray()

// TypeScript ensures type safety through transformations
type ProcessedType = typeof processedData[0] // { time: string, normalizedValue: number }
```

## Return Value

- Returns a LazyCollectionOperations instance with deferred execution
- Operations are not performed until data is requested
- Supports method chaining
- Maintains type safety
- Memory efficient for large datasets
- Supports async iteration

## Common Use Cases

### 1. Large Dataset Processing

- Processing big data files
- Transforming large collections
- Memory-efficient operations
- Streaming data processing
- Batch processing

### 2. Database Operations

- Query result processing
- Record transformation
- Data migration
- Export operations
- Bulk updates

### 3. Performance Optimization

- Memory usage reduction
- Processing time optimization
- Resource management
- Efficient transformations
- Streaming operations

### 4. ETL Operations

- Data extraction
- Complex transformations
- Incremental processing
- Data loading
- Format conversion

### 5. Real-time Processing

- Stream processing
- Live data transformation
- Event processing
- Pipeline optimization
- Continuous operations
