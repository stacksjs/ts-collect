# WhenNotEmpty Method

The `whenNotEmpty()` method executes the given callback only when the collection has one or more items. This is useful for performing operations on collections that are guaranteed to have data.

## Basic Syntax

```typescript
collect(items).whenNotEmpty(callback: (collection: Collection<T>) => Collection<U>)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Non-empty collection
const numbers = collect([1, 2, 3])
numbers.whenNotEmpty(collection =>
  collection.map(n => n * 2)
)
console.log(numbers.all()) // [2, 4, 6]

// Empty collection (callback not executed)
const empty = collect([])
empty.whenNotEmpty(collection =>
  collection.map(n => n * 2)
)
console.log(empty.all()) // []
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  active: boolean
}

const users = collect<User>([
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false }
])

users.whenNotEmpty(collection =>
  collection.map(user => ({
    ...user,
    active: true
  }))
)
```

### Real-world Examples

#### Data Processor

```typescript
interface ProcessedData<T> {
  data: T
  processedAt: Date
  status: 'processed' | 'skipped'
}

class DataProcessor<T> {
  private items: Collection<T>

  constructor(items: T[]) {
    this.items = collect(items)
  }

  process(): ProcessedData<T>[] {
    return this.items
      .whenNotEmpty(collection =>
        collection.map(item => ({
          data: item,
          processedAt: new Date(),
          status: 'processed'
        }))
      )
      .all()
  }
}

// Usage
const processor = new DataProcessor([1, 2, 3])
const results = processor.process()
```

#### Analytics Aggregator

```typescript
interface MetricData {
  timestamp: Date
  value: number
  category: string
}

class MetricsAggregator {
  private metrics: Collection<MetricData>

  constructor(metrics: MetricData[]) {
    this.metrics = collect(metrics)
  }

  calculateAverages() {
    return this.metrics.whenNotEmpty((collection) => {
      const categories = collection.pluck('category').unique()

      return categories.map(category => ({
        category,
        average: collection
          .filter(m => m.category === category)
          .average('value')
      }))
    })
  }
}
```

### Advanced Usage

#### Report Generator

```typescript
interface ReportData {
  id: string
  data: any
  timestamp: Date
}

interface Report {
  id: string
  summary: string
  details: any[]
  generatedAt: Date
}

class ReportGenerator {
  private data: Collection<ReportData>

  constructor(data: ReportData[]) {
    this.data = collect(data)
  }

  generateReport(): Report | null {
    return this.data
      .whenNotEmpty((collection) => {
        const processed = collection
          .sortBy('timestamp')
          .map(item => this.processItem(item))

        return collect([{
          id: `report-${Date.now()}`,
          summary: this.generateSummary(processed),
          details: processed.all(),
          generatedAt: new Date()
        }])
      })
      .first() || null
  }

  private processItem(item: ReportData) {
    // Processing logic
    return item
  }

  private generateSummary(data: Collection<ReportData>) {
    // Summary generation logic
    return `Report with ${data.count()} items`
  }
}
```

#### Batch Operation Handler

```typescript
interface BatchOperation<T> {
  items: Collection<T>
  execute: () => Promise<T[]>
}

class BatchProcessor<T> implements BatchOperation<T> {
  items: Collection<T>

  constructor(items: T[]) {
    this.items = collect(items)
  }

  async execute(): Promise<T[]> {
    return this.items
      .whenNotEmpty(async (collection) => {
        console.log(`Processing ${collection.count()} items`)

        const processed = await Promise.all(
          collection.map(this.processItem)
        )

        return collect(processed)
      })
      .all()
  }

  private async processItem(item: T): Promise<T> {
    // Async processing logic
    return item
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, value: 'one' },
  { id: 2, value: 'two' }
])

// Type-safe transformation
items.whenNotEmpty(collection =>
  collection.map(item => ({
    ...item,
    metadata: { processed: true }
  }))
)

// Type conversion
interface TransformedItem {
  originalId: number
  transformedValue: string
}

const transformed = items.whenNotEmpty(collection =>
  collection.map((item): TransformedItem => ({
    originalId: item.id,
    transformedValue: item.value.toUpperCase()
  }))
)
```

## Return Value

- Returns the result of the callback if the collection is not empty
- Returns the original collection if empty
- Maintains type safety with TypeScript through generics
- Can change the type of the collection through the callback
- Can be chained with other collection methods

## Common Use Cases

- Data transformation
- Aggregation operations
- Report generation
- Batch processing
- Conditional operations on non-empty collections
