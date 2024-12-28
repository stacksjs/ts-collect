# UnlessEmpty Method

The `unlessEmpty()` method executes the given callback unless the collection is empty. It's useful for performing operations conditionally based on whether the collection has items.

## Basic Syntax

```typescript
collect(items).unlessEmpty(callback: (collection: Collection<T>) => Collection<U>)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// With non-empty collection
const numbers = collect([1, 2, 3])
numbers.unlessEmpty(collection =>
  collection.map(n => n * 2)
)
console.log(numbers.all()) // [2, 4, 6]

// With empty collection
const empty = collect([])
empty.unlessEmpty(collection =>
  collection.map(n => n * 2)
) // No operation performed
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

users.unlessEmpty(collection =>
  collection.map(user => ({
    ...user,
    active: true
  }))
)
```

### Real-world Examples

#### Data Processor

```typescript
interface DataRecord {
  id: string
  value: number
  processed: boolean
}

class DataProcessor {
  private data: Collection<DataRecord>

  constructor(data: DataRecord[]) {
    this.data = collect(data)
  }

  processIfAvailable() {
    return this.data.unlessEmpty(collection =>
      collection.map(record => ({
        ...record,
        value: record.value * 2,
        processed: true
      }))
    )
  }

  getProcessedData(): DataRecord[] {
    return this.data.all()
  }
}

// Usage
const processor = new DataProcessor([
  { id: '1', value: 10, processed: false },
  { id: '2', value: 20, processed: false }
])

processor.processIfAvailable()
```

#### Queue Manager

```typescript
interface QueueItem {
  id: string
  priority: number
  payload: any
}

class QueueManager {
  private queue: Collection<QueueItem>

  constructor() {
    this.queue = collect<QueueItem>([])
  }

  addItem(item: QueueItem) {
    this.queue.push(item)
  }

  processQueue() {
    return this.queue.unlessEmpty(collection =>
      collection
        .sortBy('priority')
        .map(item => this.processItem(item))
    )
  }

  private processItem(item: QueueItem): QueueItem {
    return {
      ...item,
      processed: true,
      processedAt: new Date()
    }
  }
}
```

### Advanced Usage

#### Conditional Data Transformation

```typescript
interface DataTransformer<T, U> {
  data: Collection<T>
  transform(callback: (item: T) => U): Collection<U>
}

class ConditionalTransformer<T, U> implements DataTransformer<T, U> {
  data: Collection<T>

  constructor(items: T[]) {
    this.data = collect(items)
  }

  transform(callback: (item: T) => U): Collection<U> {
    return this.data.unlessEmpty(collection =>
      collection.map(callback)
    ) as Collection<U>
  }
}

// Usage
const transformer = new ConditionalTransformer([1, 2, 3])
const result = transformer.transform(n => n.toString())
```

#### Batch Operation Handler

```typescript
interface BatchOperation<T> {
  items: Collection<T>
  process(): void
  validate(): boolean
}

class BatchProcessor<T> implements BatchOperation<T> {
  items: Collection<T>

  constructor(items: T[]) {
    this.items = collect(items)
  }

  process(): void {
    this.items.unlessEmpty(collection => {
      console.log('Processing batch...')
      return collection.map(this.processItem)
    })
  }

  validate(): boolean {
    return this.items.unlessEmpty(collection =>
      collection.every(this.validateItem)
    )
  }

  private processItem(item: T): T {
    // Processing logic
    return item
  }

  private validateItem(item: T): boolean {
    // Validation logic
    return true
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
items.unlessEmpty(collection =>
  collection.map((item): TypedItem => ({
    ...item,
    metadata: { processed: true }
  }))
)

// Type conversion
interface TransformedItem {
  original: TypedItem
  transformed: boolean
}

const transformed = items.unlessEmpty(collection =>
  collection.map((item): TransformedItem => ({
    original: item,
    transformed: true
  }))
)
```

## Return Value

- Returns the result of the callback if the collection is not empty
- Returns the original collection if empty
- Maintains type safety with TypeScript through generics
- Can change the type of the collection through the callback
- Can be chained with other collection methods
