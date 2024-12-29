# First Method

The `first()` method retrieves the first element from the collection. When provided with a key, it returns the value of that key from the first element.

## Basic Syntax

```typescript
// Get first element
collect(items).first(): T | undefined

// Get first element's property
collect(items).first<K extends keyof T>(key: K): T[K] | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array
const numbers = collect([1, 2, 3])
console.log(numbers.first()) // 1

// Empty collection
const empty = collect([])
console.log(empty.first()) // undefined
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  email: string
}

const users = collect<User>([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
])

// Get first user
console.log(users.first())
// { id: 1, name: 'John', email: 'john@example.com' }

// Get first user's name
console.log(users.first('name')) // 'John'

// Get first user's email
console.log(users.first('email')) // 'john@example.com'
```

### Real-world Examples

#### Queue Processor

```typescript
interface QueueItem {
  id: string
  priority: number
  payload: any
  status: 'pending' | 'processing'
}

class QueueProcessor {
  private queue: Collection<QueueItem>

  constructor(items: QueueItem[]) {
    this.queue = collect(items)
  }

  getNextItem(): QueueItem | undefined {
    return this.queue
      .filter(item => item.status === 'pending')
      .sortByDesc('priority')
      .first()
  }

  getNextItemId(): string | undefined {
    return this.queue
      .filter(item => item.status === 'pending')
      .sortByDesc('priority')
      .first('id')
  }
}
```

#### Cache Manager

```typescript
interface CacheEntry {
  key: string
  value: any
  expiry: Date
}

class CacheManager {
  private cache: Collection<CacheEntry>

  constructor() {
    this.cache = collect<CacheEntry>([])
  }

  getFirstExpired(): CacheEntry | undefined {
    const now = new Date()
    return this.cache
      .filter(entry => entry.expiry < now)
      .first()
  }

  getOldestEntryKey(): string | undefined {
    return this.cache
      .sortBy(entry => entry.expiry.getTime())
      .first('key')
  }
}
```

### Advanced Usage

#### Configuration Reader

```typescript
interface ConfigEntry {
  namespace: string
  key: string
  value: any
  metadata?: {
    environment: string
    version: number
  }
}

class ConfigReader {
  private configs: Collection<ConfigEntry>

  constructor(configs: ConfigEntry[]) {
    this.configs = collect(configs)
  }

  getNamespaceConfig(namespace: string): ConfigEntry | undefined {
    return this.configs
      .filter(config => config.namespace === namespace)
      .sortByDesc(config => config.metadata?.version ?? 0)
      .first()
  }

  getNamespaceValue(namespace: string): any | undefined {
    return this.configs
      .filter(config => config.namespace === namespace)
      .sortByDesc(config => config.metadata?.version ?? 0)
      .first('value')
  }
}
```

#### Event Stream Processor

```typescript
interface Event {
  id: string
  type: string
  timestamp: Date
  data: any
  processed: boolean
}

class EventProcessor {
  private events: Collection<Event>

  constructor(events: Event[]) {
    this.events = collect(events)
  }

  getOldestUnprocessed(): Event | undefined {
    return this.events
      .filter(event => !event.processed)
      .sortBy('timestamp')
      .first()
  }

  getOldestEventType(): string | undefined {
    return this.events
      .sortBy('timestamp')
      .first('type')
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
  { id: 1, value: 'first', metadata: { important: true } },
  { id: 2, value: 'second' }
])

// Type-safe property access
const id: number | undefined = items.first('id')
const value: string | undefined = items.first('value')
const metadata: Record<string, any> | undefined = items.first('metadata')

// TypeScript enforces valid property names
// items.first('nonexistent') // ✗ TypeScript error
```

## Return Value

- When called without arguments:
  - Returns the first element in the collection
  - Returns undefined if collection is empty
- When called with a key:
  - Returns the value of that key from the first element
  - Returns undefined if collection is empty or key doesn't exist
- Original collection remains unchanged
- Maintains type safety with TypeScript

## Common Use Cases

### 1. Queue Processing

- Getting next item to process
- Retrieving oldest entry
- Finding first pending task
- Accessing priority items

### 2. Data Access

- Retrieving initial record
- Getting first matching item
- Accessing newest entry
- Finding earliest occurrence

### 3. Configuration Management

- Reading primary config
- Getting default values
- Accessing base settings
- Finding active configuration

### 4. Cache Operations

- Retrieving cached value
- Finding expired entries
- Accessing recent items
- Getting priority cache

### 5. Event Processing

- Finding first event
- Getting oldest message
- Retrieving unprocessed items
- Accessing event streams

### 6. Validation

- Checking first error
- Finding initial failure
- Getting primary validation
- Accessing validation results

### 7. User Interface

- Getting selected item
- Finding active element
- Retrieving focused component
- Accessing primary option

### 8. Data Analysis

- Finding initial data point
- Getting starting value
- Accessing base measurement
- Retrieving first sample

### 9. State Management

- Getting initial state
- Finding first change
- Accessing base condition
- Retrieving state entry

### 10. Query Results

- Retrieving first match
- Getting top result
- Accessing primary record
- Finding best match
