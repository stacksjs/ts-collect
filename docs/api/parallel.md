# Parallel Method

The `parallel()` method processes collection items in parallel chunks, allowing for concurrent execution of asynchronous operations while controlling the level of concurrency. This is particularly useful for handling large datasets that require async processing.

## Basic Syntax

```typescript
async parallel<U>(
  callback: (chunk: CollectionOperations<T>) => Promise<U>,
  options?: {
    chunks?: number,           // Number of chunks to split the data into
    maxConcurrency?: number    // Maximum number of concurrent operations
  }
): Promise<CollectionOperations<U>>
```

## Parameters

- `callback`: Async function to process each chunk
- `options.chunks`: Number of chunks (defaults to CPU core count)
- `options.maxConcurrency`: Maximum concurrent operations (defaults to chunks)

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect(['a', 'b', 'c', 'd', 'e', 'f'])

const results = await items.parallel(async chunk => {
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 100))
  return chunk.map(item => item.toUpperCase())
})

console.log(results.all())
// ['A', 'B', 'C', 'D', 'E', 'F']
```

### Working with Controlled Concurrency

```typescript
interface DataItem {
  id: number
  url: string
}

const items = collect<DataItem>([
  { id: 1, url: 'https://api.example.com/1' },
  { id: 2, url: 'https://api.example.com/2' },
  // ... more items
])

const processed = await items.parallel(
  async chunk => {
    return await Promise.all(
      chunk.map(async item => {
        const response = await fetch(item.url)
        return { ...item, data: await response.json() }
      })
    )
  },
  { chunks: 4, maxConcurrency: 2 }
)
```

### Real-world Example: E-commerce Bulk Product Update

```typescript
interface Product {
  id: string
  sku: string
  price: number
  inventory: number
}

class BulkProductUpdater {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  async updatePricesAndInventory(): Promise<Array<{
    id: string,
    success: boolean,
    error?: string
  }>> {
    return await this.products
      .parallel(async chunk => {
        // Process each chunk of products
        return await Promise.all(
          chunk.map(async product => {
            try {
              // Simulate API call to update product
              await this.updateProductAPI(product)
              return {
                id: product.id,
                success: true
              }
            }
            catch (error) {
              return {
                id: product.id,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            }
          })
        )
      }, {
        chunks: 5,          // Split into 5 chunks
        maxConcurrency: 2   // Only 2 chunks processing at once
      })
      .flatten()
      .all()
  }

  private async updateProductAPI(product: Product): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
    // API implementation
  }
}
```

## Type Safety

```typescript
interface AsyncJob {
  id: string
  payload: object
}

interface JobResult {
  jobId: string
  status: 'completed' | 'failed'
  result?: any
}

const jobs = collect<AsyncJob>([
  { id: 'job1', payload: { task: 'process' } },
  { id: 'job2', payload: { task: 'analyze' } }
])

// Type-safe parallel processing
const results = await jobs.parallel<JobResult>(
  async chunk => {
    return await Promise.all(
      chunk.map(async job => ({
        jobId: job.id,
        status: 'completed',
        result: await processJob(job)
      }))
    )
  }
)

// TypeScript enforces return type
const typedResults: Collection<JobResult> = results
```

## Return Value

- Returns a Promise resolving to a new Collection containing processed results
- Maintains order of original items in the final result
- Automatically flattens array results from chunks
- Handles errors within chunks independently
- Respects maxConcurrency limit across all chunks
- Preserves type safety through generics

## Common Use Cases

### 1. Batch Processing

- Processing large datasets
- Handling bulk updates
- Running batch jobs
- Processing queued tasks

### 2. API Integration

- Making concurrent API calls
- Syncing external systems
- Updating remote resources
- Fetching bulk data

### 3. Image Processing

- Processing multiple images
- Generating thumbnails
- Converting file formats
- Uploading media files

### 4. Data Import/Export

- Processing CSV files
- Importing product data
- Exporting order reports
- Syncing inventory data

### 5. Background Tasks

- Processing email queues
- Updating search indices
- Generating reports
- Running data migrations
