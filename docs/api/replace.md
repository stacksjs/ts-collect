# Replace Method

The `replace()` method replaces the items in the collection with the given items. It allows you to completely swap out the collection's contents while maintaining the collection instance.

## Basic Syntax

```typescript
collect(items).replace(items: T[])
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple replacement
const numbers = collect([1, 2, 3])
numbers.replace([4, 5, 6])
console.log(numbers.all()) // [4, 5, 6]

// Replace with different size array
const words = collect(['hello', 'world'])
words.replace(['hi'])
console.log(words.all()) // ['hi']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' }
])

// Replace with new user list
users.replace([
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' }
])

console.log(users.all())
// [
//   { id: 2, name: 'Jane', role: 'user' },
//   { id: 3, name: 'Bob', role: 'user' }
// ]
```

### Real-world Examples

#### State Management

```typescript
interface AppState {
  user: {
    id: number | null
    name: string | null
    preferences: Record<string, any>
  }
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

class StateManager {
  private state: Collection<AppState>

  constructor() {
    this.state = collect<AppState>([{
      user: {
        id: null,
        name: null,
        preferences: {}
      },
      settings: {
        theme: 'light',
        notifications: true
      }
    }])
  }

  resetState() {
    this.state.replace([{
      user: {
        id: null,
        name: null,
        preferences: {}
      },
      settings: {
        theme: 'light',
        notifications: true
      }
    }])
  }

  updateState(newState: AppState) {
    this.state.replace([newState])
  }

  getState(): AppState {
    return this.state.first()
  }
}
```

#### Cache Management

```typescript
interface CacheEntry {
  key: string
  value: any
  expiry: number
}

class CacheManager {
  private cache: Collection<CacheEntry>

  constructor() {
    this.cache = collect<CacheEntry>([])
  }

  refresh(newEntries: CacheEntry[]) {
    // Replace entire cache with new entries
    this.cache.replace(newEntries)
  }

  cleanup() {
    const now = Date.now()
    const validEntries = this.cache
      .filter(entry => entry.expiry > now)
      .all()

    this.cache.replace(validEntries)
  }
}
```

### Advanced Usage

#### Data Migration

```typescript
interface DataVersion1 {
  id: number
  name: string
  data: string
}

interface DataVersion2 {
  uuid: string
  displayName: string
  payload: {
    content: string
    timestamp: number
  }
}

class DataMigrator {
  private data: Collection<DataVersion1 | DataVersion2>

  constructor(oldData: DataVersion1[]) {
    this.data = collect(oldData)
  }

  migrateToV2() {
    const migratedData: DataVersion2[] = this.data.map(item => ({
      uuid: `v2-${item.id}`,
      displayName: item.name,
      payload: {
        content: item.data,
        timestamp: Date.now()
      }
    })).all()

    this.data.replace(migratedData)
    return this.data
  }
}
```

#### Configuration Management

```typescript
interface ConfigEntry {
  key: string
  value: any
  metadata: {
    updatedAt: number
    source: string
  }
}

class ConfigurationManager {
  private config: Collection<ConfigEntry>
  private readonly persistenceKey = 'app_config'

  constructor() {
    this.config = collect<ConfigEntry>([])
    this.load()
  }

  private load() {
    const stored = localStorage.getItem(this.persistenceKey)
    if (stored) {
      const config = JSON.parse(stored)
      this.config.replace(config)
    }
  }

  updateConfig(newConfig: ConfigEntry[]) {
    this.config.replace(newConfig)
    localStorage.setItem(this.persistenceKey, JSON.stringify(this.config.all()))
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  optional?: boolean
}

const items = collect<TypedItem>([
  { id: 1, value: 'one' }
])

// Type-safe replacements
items.replace([
  { id: 2, value: 'two' },
  { id: 3, value: 'three', optional: true }
])

// TypeScript will catch type errors
// items.replace([{ id: 4 }]) // ✗ Error: missing 'value' property
```

## Return Value

- Returns the collection instance for method chaining
- Completely replaces the contents of the collection
- The original collection is modified
- All previous items are removed and replaced with new items
- Maintains type safety with TypeScript
