# Batch Method

The `batch()` method creates an async generator that yields collection chunks of specified size for processing large datasets efficiently.

## Basic Syntax

```typescript
batch(size: number): AsyncGenerator<CollectionOperations<T>, void, unknown>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect([1, 2, 3, 4, 5])

// Process in batches of 2
for await (const batch of items.batch(2)) {
  console.log(batch.all())
}
// [1, 2]
// [3, 4]
// [5]
```

### Real-world Example: E-commerce Bulk Processing

```typescript
interface Order {
  id: string
  status: string
  items: OrderItem[]
}

class BulkOrderProcessor {
  private orders: Collection<Order>
  private batchSize: number

  constructor(orders: Order[], batchSize = 100) {
    this.orders = collect(orders)
    this.batchSize = batchSize
  }

  async processOrders() {
    const results = {
      processed: 0,
      failed: 0,
      errors: [] as string[]
    }

    for await (const batch of this.orders.batch(this.batchSize)) {
      try {
        await this.processBatch(batch)
        results.processed += batch.count()
      } catch (error) {
        results.failed += batch.count()
        results.errors.push(error instanceof Error ? error.message : 'Unknown error')
      }

      // Report progress
      this.reportProgress(results)
    }

    return results
  }

  async processBatchWithRetry(maxRetries = 3) {
    for await (const batch of this.orders.batch(this.batchSize)) {
      let attempts = 0
      while (attempts < maxRetries) {
        try {
          await this.processBatch(batch)
          break
        } catch (error) {
          attempts++
          if (attempts === maxRetries) {
            throw error
          }
          await this.delay(1000 * attempts) // Exponential backoff
        }
      }
    }
  }

  private async processBatch(batch: CollectionOperations<Order>) {
    return Promise.all(
      batch.map(order => this.processOrder(order)).all()
    )
  }

  private async processOrder(order: Order): Promise<void> {
    // Order processing logic
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private reportProgress(results: { processed: number, failed: number }) {
    const total = this.orders.count()
    const progress = ((results.processed + results.failed) / total) * 100
    console.log(`Progress: ${progress.toFixed(2)}%`)
  }
}

// Usage
const processor = new BulkOrderProcessor([
  {
    id: 'O1',
    status: 'pending',
    items: []
  }
], 50)

await processor.processOrders()
```

## Type Safety

```typescript
interface DataRecord {
  id: number
  value: string
}

const data = collect<DataRecord>([
  { id: 1, value: 'test' }
])

// Type-safe batch processing
for await (const batch of data.batch(100)) {
  const records: DataRecord[] = batch.all()
  // Process records...
}
```

## Return Value

- Returns AsyncGenerator of Collections
- Each yielded batch is a Collection
- Last batch may be smaller
- Maintains original types
- Memory efficient
- Supports async iteration

## Common Use Cases

### 1. Bulk Processing

- Data import
- Export operations
- Mass updates
- Batch operations
- Data migration

### 2. API Integration

- Rate limiting
- Bulk uploads
- Data synchronization
- Mass operations
- Service integration

### 3. Performance Optimization

- Memory management
- Load distribution
- Resource control
- Processing limits
- Queue management

### 4. Data Pipeline

- ETL operations
- Data transformation
- Stream processing
- Data flow control
- Staged processing

### 5. Error Handling

- Retry logic
- Failure isolation
- Progress tracking
- Error recovery
- Batch validation
