# UnlessNotEmpty Method

The `unlessNotEmpty()` method executes the given callback only if the collection is empty. This is the inverse of `unlessEmpty()` and is useful for performing operations specifically when a collection has no items.

## Basic Syntax

```typescript
collect(items).unlessNotEmpty(callback: (collection: Collection<T>) => Collection<U>)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// With empty collection
const empty = collect([])
empty.unlessNotEmpty(collection =>
  collection.push(1, 2, 3)
)
console.log(empty.all()) // [1, 2, 3]

// With non-empty collection
const numbers = collect([1, 2, 3])
numbers.unlessNotEmpty(collection =>
  collection.push(4, 5, 6)
) // No operation performed
console.log(numbers.all()) // [1, 2, 3]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
}

const users = collect<User>([])

users.unlessNotEmpty(collection =>
  collection.push(
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  )
)
```

### Real-world Examples

#### Default Data Provider

```typescript
interface DataProvider<T> {
  data: Collection<T>
  loadDefaults: () => void
  getData: () => T[]
}

class ConfigProvider implements DataProvider<Record<string, any>> {
  data: Collection<Record<string, any>>

  constructor(initialData: Record<string, any>[] = []) {
    this.data = collect(initialData)
    this.loadDefaults()
  }

  loadDefaults(): void {
    this.data.unlessNotEmpty(collection =>
      collection.push({
        theme: 'light',
        language: 'en',
        notifications: true
      })
    )
  }

  getData(): Record<string, any>[] {
    return this.data.all()
  }
}

// Usage
const config = new ConfigProvider()
console.log(config.getData()) // Default config loaded
```

#### Fallback Handler

```typescript
interface CacheItem<T> {
  key: string
  value: T
  expiry: Date
}

class CacheManager<T> {
  private cache: Collection<CacheItem<T>>

  constructor() {
    this.cache = collect<CacheItem<T>>([])
  }

  loadFallbackData(fallbackData: CacheItem<T>[]) {
    this.cache.unlessNotEmpty(collection =>
      collection.push(...fallbackData)
    )
  }

  getCacheItems(): CacheItem<T>[] {
    return this.cache.all()
  }
}
```

### Advanced Usage

#### Resource Pool Manager

```typescript
interface Resource {
  id: string
  type: string
  available: boolean
}

class ResourcePool {
  private resources: Collection<Resource>

  constructor() {
    this.resources = collect<Resource>([])
  }

  initializePool() {
    this.resources.unlessNotEmpty((collection) => {
      const defaultResources: Resource[] = Array.from({ length: 5 }).fill(null).map((_, i) => ({
        id: `resource-${i}`,
        type: 'default',
        available: true
      }))
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

#### Default Settings Generator

```typescript
interface AppSettings {
  id: string
  setting: string
  value: any
}

class SettingsManager {
  private settings: Collection<AppSettings>

  constructor(settings: AppSettings[] = []) {
    this.settings = collect(settings)
    this.ensureDefaults()
  }

  private ensureDefaults() {
    this.settings.unlessNotEmpty((collection) => {
      const defaults: AppSettings[] = [
        { id: 'theme', setting: 'theme', value: 'light' },
        { id: 'lang', setting: 'language', value: 'en' },
        { id: 'notif', setting: 'notifications', value: true }
      ]
      return collection.push(...defaults)
    })
  }

  getSettings(): AppSettings[] {
    return this.settings.all()
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

// Type-safe operation
items.unlessNotEmpty((collection) => {
  const defaultItems: TypedItem[] = [
    { id: 1, value: 'default' }
  ]
  return collection.push(...defaultItems)
})

// Type conversion
interface TransformedItem {
  originalId: number
  transformedValue: string
}

const transformed = items.unlessNotEmpty(collection =>
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
- Useful for providing default values or initializing empty collections
