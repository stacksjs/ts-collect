# cursor Method

The `cursor()` method returns an AsyncGenerator that yields chunks of the collection of the specified size. This is particularly useful for processing large collections in manageable batches.

## Basic Syntax

```typescript
collect(items).cursor(size: number): AsyncGenerator<Collection<T>, void, unknown>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Process numbers in batches
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
for await (const batch of numbers.cursor(3)) {
  console.log(batch.all())
}
// [1, 2, 3]
// [4, 5, 6]
// [7, 8, 9]
// [10]

// Process with batch handling
const items = collect(['a', 'b', 'c', 'd', 'e'])
for await (const chunk of items.cursor(2)) {
  await processChunk(chunk)
}
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  price: number
}

const products = collect<Product>([
  { id: '1', name: 'Widget A', price: 100 },
  { id: '2', name: 'Widget B', price: 200 },
  { id: '3', name: 'Widget C', price: 300 },
  { id: '4', name: 'Widget D', price: 400 }
])

// Process products in batches
async function updateProducts() {
  for await (const batch of products.cursor(2)) {
    await Promise.all(
      batch.map(product =>
        fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          body: JSON.stringify(product)
        })
      )
    )
  }
}
```

### Real-world Examples

#### Batch Order Processor

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'completed'
  items: Array<{
    productId: string
    quantity: number
  }>
}

class BatchOrderProcessor {
  constructor(
    private orders: Collection<Order>,
    private batchSize: number = 50
  ) {}

  async processAllOrders(): Promise<{
    processed: number
    failed: string[]
  }> {
    let processed = 0
    const failed: string[] = []

    for await (const batch of this.orders.cursor(this.batchSize)) {
      try {
        await this.processBatch(batch)
        processed += batch.count()
      } catch (error) {
        failed.push(...batch.pluck('id').toArray())
        console.error('Batch processing failed:', error)
      }
    }

    return { processed, failed }
  }

  private async processBatch(batch: Collection<Order>): Promise<void> {
    await Promise.all(
      batch.map(async order => {
        try {
          await this.processOrder(order)
        } catch (error) {
          console.error(`Failed to process order ${order.id}:`, error)
          throw error
        }
      })
    )
  }

  private async processOrder(order: Order): Promise<void> {
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 100))
    // Process order logic here...
  }
}
```

#### Inventory Update System

```typescript
interface StockItem {
  sku: string
  quantity: number
  lastUpdated: Date
}

class StockUpdateManager {
  constructor(
    private inventory: Collection<StockItem>,
    private maxConcurrent: number = 5
  ) {}

  async synchronizeStock(): Promise<{
    updated: number
    errors: Array<{ sku: string; error: string }>
  }> {
    let updated = 0
    const errors: Array<{ sku: string; error: string }> = []
    const semaphore = new Array(this.maxConcurrent).fill(Promise.resolve())
    let currentSemaphoreIndex = 0

    for await (const batch of this.inventory.cursor(10)) {
      // Wait for current semaphore slot
      await semaphore[currentSemaphoreIndex]

      // Create new promise for this slot
      const batchPromise = (async () => {
        try {
          const results = await Promise.all(
            batch.map(item => this.updateStockLevel(item))
          )

          updated += results.filter(r => r.success).length
          errors.push(...results
            .filter(r => !r.success)
            .map(r => ({
              sku: r.sku,
              error: r.error || 'Unknown error'
            })))
        } catch (error) {
          console.error('Batch update failed:', error)
        }
      })()

      // Update semaphore slot
      semaphore[currentSemaphoreIndex] = batchPromise
      currentSemaphoreIndex = (currentSemaphoreIndex + 1) % this.maxConcurrent
    }

    // Wait for all remaining updates
    await Promise.all(semaphore)

    return { updated, errors }
  }

  private async updateStockLevel(item: StockItem): Promise<{
    sku: string
    success: boolean
    error?: string
  }> {
    try {
      // Simulate external API call
      await new Promise(resolve => setTimeout(resolve, 100))
      return { sku: item.sku, success: true }
    } catch (error) {
      return {
        sku: item.sku,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  name: string
  status: 'active' | 'inactive'
}

const items = collect<TypedItem>([
  { id: 1, name: 'A', status: 'active' },
  { id: 2, name: 'B', status: 'inactive' }
])

// Type-safe cursor iteration
async function processItems() {
  for await (const batch of items.cursor(1)) {
    const item: TypedItem = batch.first()!
    // TypeScript knows item structure
  }
}
```

## Return Value

- Returns an AsyncGenerator of Collection chunks
- Each chunk is a new Collection
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Chunks are yield in sequence
- Last chunk may be smaller than size

## Common Use Cases

### 1. Batch Processing

- Order processing
- Inventory updates
- Price updates
- Customer updates
- Product synchronization

### 2. Data Migration

- Content transfer
- Database updates
- System migration
- Data synchronization
- Record conversion

### 3. API Integration

- Batch uploads
- Data synchronization
- External updates
- System integration
- Data export

### 4. Inventory Management

- Stock updates
- Price updates
- Category updates
- Supplier updates
- Location updates

### 5. Order Processing

- Bulk fulfillment
- Status updates
- Shipment processing
- Invoice generation
- Notification sending

### 6. Customer Operations

- Profile updates
- Notification sending
- Reward processing
- Status updates
- Communication sending

### 7. Content Management

- Bulk publishing
- Media processing
- Content updates
- Asset processing
- Cache updates

### 8. Report Generation

- Data aggregation
- Statistics calculation
- Performance analysis
- Usage tracking
- Audit logging

### 9. System Maintenance

- Data cleanup
- Cache updates
- Log processing
- Index updates
- Optimization tasks

### 10. Data Export

- File generation
- Report creation
- Data extraction
- Backup creation
- Archive generation
