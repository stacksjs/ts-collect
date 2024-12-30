# fromStream Method

The `fromStream()` method creates a collection from a ReadableStream. This method is useful for converting streaming data into a collection that can be manipulated using collection operations.

## Basic Syntax

```typescript
collect(items).fromStream<U>(stream: ReadableStream<U>): Promise<Collection<U>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Create collection from number stream
const numberStream = new ReadableStream({
  start(controller) {
    [1, 2, 3, 4, 5].forEach(n => controller.enqueue(n))
    controller.close()
  }
})

const numbers = await collect([]).fromStream(numberStream)
console.log(numbers.all())  // [1, 2, 3, 4, 5]

// Create from string stream
const textStream = new ReadableStream({
  start(controller) {
    ['hello', 'world'].forEach(s => controller.enqueue(s))
    controller.close()
  }
})

const words = await collect([]).fromStream(textStream)
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  price: number
}

// Create product stream
const productStream = new ReadableStream<Product>({
  start(controller) {
    const products = [
      { id: '1', name: 'Widget', price: 100 },
      { id: '2', name: 'Gadget', price: 200 }
    ]
    products.forEach(p => controller.enqueue(p))
    controller.close()
  }
})

// Convert to collection
const products = await collect<Product>([]).fromStream(productStream)
```

### Real-world Examples

#### Data Import System

```typescript
interface ImportRecord {
  line: number
  data: Record<string, unknown>
  errors: string[]
}

class DataImporter {
  async importFromStream(
    dataStream: ReadableStream<ImportRecord>
  ): Promise<{
    imported: Collection<ImportRecord>
    success: number
    failed: number
    errors: Map<number, string[]>
  }> {
    const records = await collect<ImportRecord>([])
      .fromStream(dataStream)

    const validRecords = records.filter(record => record.errors.length === 0)
    const invalidRecords = records.filter(record => record.errors.length > 0)

    const errors = new Map<number, string[]>()
    invalidRecords.each(record => {
      errors.set(record.line, record.errors)
    })

    return {
      imported: validRecords,
      success: validRecords.count(),
      failed: invalidRecords.count(),
      errors
    }
  }

  async processImport(
    dataStream: ReadableStream<ImportRecord>
  ): Promise<void> {
    const { imported, failed, errors } = await this.importFromStream(dataStream)

    if (failed > 0) {
      console.error(`Failed to import ${failed} records:`)
      errors.forEach((errs, line) => {
        console.error(`Line ${line}:`, errs)
      })
    }

    await this.saveImportedRecords(imported)
  }

  private async saveImportedRecords(
    records: Collection<ImportRecord>
  ): Promise<void> {
    // Save records logic
  }
}
```

#### File Upload Processor

```typescript
interface FileChunk {
  index: number
  data: Uint8Array
  filename: string
}

class FileProcessor {
  async processUploadStream(
    chunkStream: ReadableStream<FileChunk>
  ): Promise<{
    processedFiles: string[]
    totalSize: number
    errors: Array<{ file: string; error: string }>
  }> {
    const chunks = await collect<FileChunk>([])
      .fromStream(chunkStream)

    const fileGroups = chunks
      .sortBy('index')
      .groupBy('filename')

    const processedFiles: string[] = []
    const errors: Array<{ file: string; error: string }> = []
    let totalSize = 0

    for (const [filename, fileChunks] of fileGroups.entries()) {
      try {
        const combinedData = this.combineChunks(fileChunks)
        await this.processFile(filename, combinedData)
        processedFiles.push(filename)
        totalSize += combinedData.length
      } catch (error) {
        errors.push({
          file: filename,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return {
      processedFiles,
      totalSize,
      errors
    }
  }

  private combineChunks(chunks: Collection<FileChunk>): Uint8Array {
    const totalSize = chunks.sum(chunk => chunk.data.length)
    const result = new Uint8Array(totalSize)
    let offset = 0

    chunks.each(chunk => {
      result.set(chunk.data, offset)
      offset += chunk.data.length
    })

    return result
  }

  private async processFile(
    filename: string,
    data: Uint8Array
  ): Promise<void> {
    // File processing logic
  }
}
```

### Advanced Usage

#### Real-time Data Processor

```typescript
interface DataPoint {
  timestamp: Date
  value: number
  source: string
}

class RealTimeProcessor {
  async processDataStream(
    dataStream: ReadableStream<DataPoint>,
    windowSize: number = 100
  ): Promise<{
    summary: Map<string, {
      average: number
      max: number
      min: number
    }>
    alerts: Array<{
      source: string
      timestamp: Date
      reason: string
    }>
  }> {
    const dataPoints = await collect<DataPoint>([])
      .fromStream(dataStream)

    const bySource = dataPoints.groupBy('source')
    const summary = new Map()
    const alerts: Array<{
      source: string
      timestamp: Date
      reason: string
    }> = []

    bySource.forEach((points, source) => {
      const values = points.pluck('value')
      const average = values.avg()
      const max = values.max() ?? 0
      const min = values.min() ?? 0

      summary.set(source, { average, max, min })

      // Check for anomalies
      points.each(point => {
        if (point.value > average * 2) {
          alerts.push({
            source,
            timestamp: point.timestamp,
            reason: 'Value exceeds 2x average'
          })
        }
      })
    })

    return { summary, alerts }
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

// Create typed stream
const stream = new ReadableStream<TypedItem>({
  start(controller) {
    controller.enqueue({ id: 1, value: 'A' })
    controller.enqueue({ id: 2, value: 'B' })
    controller.close()
  }
})

// Type-safe collection creation
const items = await collect<TypedItem>([])
  .fromStream(stream)

// TypeScript knows the type
const firstValue: string = items.first()?.value
```

## Return Value

- Returns a Promise that resolves to a Collection
- Collection contains all stream items
- Maintains item order from stream
- Preserves item types
- Supports all collection methods
- Memory efficient processing

## Common Use Cases

### 1. Data Import

- File uploads
- Bulk imports
- Data migration
- Content transfer
- System integration

### 2. Real-time Processing

- Event streams
- Sensor data
- Log processing
- Metrics collection
- System monitoring

### 3. File Processing

- Upload handling
- Chunk processing
- Document parsing
- Media processing
- Content streaming

### 4. Data Transformation

- Format conversion
- Data cleaning
- Content processing
- Structure mapping
- Type conversion

### 5. Batch Operations

- Record processing
- Bulk updates
- Data validation
- Content moderation
- System updates

### 6. Integration

- API consumption
- Service integration
- Data synchronization
- Platform connection
- System bridging

### 7. Analytics

- Data collection
- Metric processing
- Log analysis
- Event tracking
- Performance monitoring

### 8. Content Management

- Content imports
- Media processing
- Document handling
- Asset management
- Resource processing

### 9. System Migration

- Data transfer
- Content migration
- System updates
- Platform moves
- Service transitions

### 10. Performance Optimization

- Memory efficiency
- Resource management
- Load handling
- Process scaling
- Stream processing
