# WhenEmpty Method

The `whenEmpty()` method executes the given callback when the collection is empty. This is particularly useful for providing default values or performing specific actions when no items are present.

## Basic Syntax

```typescript
collect(items).whenEmpty(callback: (collection: Collection<T>) => Collection<U>)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Empty collection with default values
const empty = collect([])
empty.whenEmpty(collection =>
  collection.push(1, 2, 3)
)
console.log(empty.all()) // [1, 2, 3]

// Non-empty collection (callback not executed)
const numbers = collect([1, 2])
numbers.whenEmpty(collection =>
  collection.push(3, 4)
)
console.log(numbers.all()) // [1, 2]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([])

users.whenEmpty(collection =>
  collection.push(
    { id: 1, name: 'Admin', role: 'admin' },
    { id: 2, name: 'Guest', role: 'guest' }
  )
)
```

### Real-world Examples

#### Default Configuration Provider

```typescript
interface Config {
  theme: string
  language: string
  notifications: boolean
  features: string[]
}

class ConfigurationManager {
  private config: Collection<Config>

  constructor(initialConfig?: Config[]) {
    this.config = collect<Config>(initialConfig || [])
    this.initializeDefaults()
  }

  private initializeDefaults() {
    this.config.whenEmpty(collection =>
      collection.push({
        theme: 'light',
        language: 'en',
        notifications: true,
        features: ['basic']
      })
    )
  }

  getConfig(): Config[] {
    return this.config.all()
  }
}
```

#### Cache Handler

```typescript
interface CacheEntry<T> {
  key: string
  value: T
  expiry: Date
}

class CacheManager<T> {
  private cache: Collection<CacheEntry<T>>
  private generator: () => CacheEntry<T>[]

  constructor(generator: () => CacheEntry<T>[]) {
    this.cache = collect<CacheEntry<T>>([])
    this.generator = generator
  }

  ensureCache(): void {
    this.cache.whenEmpty((collection) => {
      const entries = this.generator()
      return collection.push(...entries)
    })
  }

  getCacheEntries(): CacheEntry<T>[] {
    return this.cache.all()
  }
}
```

### Advanced Usage

#### Resource Pool

```typescript
interface Resource {
  id: string
  type: 'cpu' | 'memory' | 'storage'
  capacity: number
  available: boolean
}

class ResourcePool {
  private resources: Collection<Resource>

  constructor() {
    this.resources = collect<Resource>([])
    this.initializePool()
  }

  private initializePool() {
    this.resources.whenEmpty((collection) => {
      const defaultResources: Resource[] = [
        { id: 'cpu-1', type: 'cpu', capacity: 100, available: true },
        { id: 'mem-1', type: 'memory', capacity: 1024, available: true },
        { id: 'store-1', type: 'storage', capacity: 10000, available: true }
      ]
      return collection.push(...defaultResources)
    })
  }

  getAvailableResources(): Resource[] {
    return this.resources
      .filter(resource => resource.available)
      .all()
  }
}
```

#### Data Queue Manager

```typescript
interface QueueItem<T> {
  id: string
  data: T
  priority: number
  timestamp: Date
}

class QueueManager<T> {
  private queue: Collection<QueueItem<T>>
  private defaultItems: () => QueueItem<T>[]

  constructor(defaultItemsGenerator: () => QueueItem<T>[]) {
    this.queue = collect<QueueItem<T>>([])
    this.defaultItems = defaultItemsGenerator
  }

  initialize() {
    this.queue.whenEmpty((collection) => {
      const items = this.defaultItems()
      return collection.push(...items)
    })
  }

  getNextItem(): QueueItem<T> | undefined {
    return this.queue
      .sortBy('priority')
      .first()
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

const items = collect<TypedItem>([])

// Type-safe default values
items.whenEmpty((collection) => {
  const defaults: TypedItem[] = [
    { id: 1, value: 'default' }
  ]
  return collection.push(...defaults)
})

// Type conversion
interface TransformedItem {
  originalId: number
  transformedValue: string
}

const transformed = items.whenEmpty(collection =>
  collection.map((item): TransformedItem => ({
    originalId: item.id,
    transformedValue: item.value.toUpperCase()
  }))
)
```

## Return Value

- Returns the result of the callback if the collection is empty
- Returns the original collection if not empty
- Maintains type safety with TypeScript through generics
- Can change the type of the collection through the callback
- Can be chained with other collection methods

## Common Use Cases

- Providing default values
- Initializing configurations
- Setting up fallback data
- Loading initial states
- Handling empty data sets
