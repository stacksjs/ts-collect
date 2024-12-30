# stream Method

The `stream()` method converts the collection into a ReadableStream, allowing for efficient processing of large datasets one item at a time. This is particularly useful when dealing with large amounts of data that shouldn't be processed all at once.

## Basic Syntax

```typescript
collect(items).stream(): ReadableStream<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple streaming
const numbers = collect([1, 2, 3, 4, 5])
const stream = numbers.stream()

// Process stream
const reader = stream.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(value)  // Logs each number
}

// Stream with processing
const products = collect([
  { id: 1, name: 'Widget A' },
  { id: 2, name: 'Widget B' }
])

for await (const chunk of products.stream()) {
  await processProduct(chunk)
}
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  price: number
  description: string
}

const products = collect<Product>([
  {
    id: '1',
    name: 'Widget',
    price: 100,
    description: 'A fantastic widget'
  },
  // ... many more products
])

// Process products streaming
const stream = products.stream()
const reader = stream.getReader()

try {
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    await updateProduct(value)
  }
} finally {
  reader.releaseLock()
}
```

### Real-world Examples

#### Large Catalog Processor

```typescript
interface CatalogItem {
  sku: string
  name: string
  description: string
  price: number
  images: string[]
  metadata: Record<string, unknown>
}

class CatalogProcessor {
  async processCatalog(
    catalog: Collection<CatalogItem>,
    batchSize: number = 100
  ): Promise<{
    processed: number
    failed: string[]
  }> {
    const stream = catalog.stream()
    const reader = stream.getReader()

    let processed = 0
    const failed: string[] = []
    let batch: CatalogItem[] = []

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          if (batch.length > 0) {
            await this.processBatch(batch, failed)
            processed += batch.length
          }
          break
        }

        batch.push(value)
        if (batch.length >= batchSize) {
          await this.processBatch(batch, failed)
          processed += batch.length
          batch = []
        }
      }
    } finally {
      reader.releaseLock()
    }

    return { processed, failed }
  }

  private async processBatch(
    items: CatalogItem[],
    failed: string[]
  ): Promise<void> {
    await Promise.all(
      items.map(async item => {
        try {
          await this.processItem(item)
        } catch (error) {
          failed.push(item.sku)
          console.error(`Failed to process ${item.sku}:`, error)
        }
      })
    )
  }

  private async processItem(item: CatalogItem): Promise<void> {
    // Process individual catalog item
    await this.validateData(item)
    await this.enrichMetadata(item)
    await this.updateSearchIndex(item)
  }

  private async validateData(item: CatalogItem): Promise<void> {
    // Validation logic
  }

  private async enrichMetadata(item: CatalogItem): Promise<void> {
    // Metadata enrichment
  }

  private async updateSearchIndex(item: CatalogItem): Promise<void> {
    // Search index update
  }
}
```

#### Order History Exporter

```typescript
interface Order {
  id: string
  date: Date
  customer: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
}

class OrderExporter {
  async exportOrders(
    orders: Collection<Order>,
    outputStream: WritableStream<string>
  ): Promise<{
    exported: number
    errors: Array<{ id: string; error: string }>
  }> {
    const writer = outputStream.getWriter()
    const stream = orders.stream()
    const reader = stream.getReader()

    let exported = 0
    const errors: Array<{ id: string; error: string }> = []

    // Write CSV header
    await writer.write(this.getHeaderRow())

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        try {
          await writer.write(this.formatOrder(value))
          exported++
        } catch (error) {
          errors.push({
            id: value.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
    } finally {
      reader.releaseLock()
      await writer.close()
    }

    return { exported, errors }
  }

  private getHeaderRow(): string {
    return 'Order ID,Date,Customer,Items,Total\n'
  }

  private formatOrder(order: Order): string {
    return `${order.id},${order.date.toISOString()},${order.customer},` +
           `${this.formatItems(order.items)},${order.total}\n`
  }

  private formatItems(items: Order['items']): string {
    return items
      .map(item => `${item.productId}(${item.quantity})`)
      .join(';')
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

const items = collect<TypedItem>([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' }
])

// Type-safe streaming
const stream: ReadableStream<TypedItem> = items.stream()

// Process with type safety
const reader = stream.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break

  // TypeScript knows value type
  const id: number = value.id
  const val: string = value.value
}
```

## Return Value

- Returns a ReadableStream of collection items
- Stream yields one item at a time
- Maintains original item types
- Supports async iteration
- Preserves item order
- Memory efficient for large datasets

## Common Use Cases

### 1. Large Data Processing

- Catalog updates
- Order processing
- Log analysis
- Data migration
- Batch operations

### 2. Data Export

- CSV generation
- Report creation
- Data dumps
- Backup creation
- Archive generation

### 3. Import Operations

- Data import
- Catalog updates
- Price updates
- Inventory sync
- Product updates

### 4. Content Processing

- Image processing
- Content updates
- Media handling
- Document processing
- File operations

### 5. Batch Operations

- Order processing
- Invoice generation
- Email sending
- Report creation
- Data updates

### 6. Data Migration

- System updates
- Platform migration
- Data transfer
- Content moving
- Archive creation

### 7. Resource Management

- Memory optimization
- Processing control
- Resource utilization
- Load management
- Performance tuning

### 8. Reporting

- Large reports
- Data analysis
- Statistics generation
- Performance metrics
- Usage tracking

### 9. Integration

- API integration
- System sync
- Data exchange
- Service integration
- Platform connection

### 10. Performance Optimization

- Memory usage
- Processing speed
- Resource efficiency
- Load handling
- Scalability
