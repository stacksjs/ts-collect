# Merge Method

The `merge()` method merges the given array or collection with the original collection. For arrays, it appends the values. For objects, it combines properties, with later values overwriting existing ones.

## Basic Syntax

```typescript
// Merge with array
collect(items).merge(array: any[])

// Merge with another collection
collect(items).merge(collection: Collection<T>)

// Merge with object
collect(items).merge(object: Record<string, any>)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Merging arrays
const numbers = collect([1, 2, 3])
const merged = numbers.merge([4, 5, 6])
console.log(merged.all()) // [1, 2, 3, 4, 5, 6]

// Merging objects
const defaults = collect({ name: 'Default', type: 'user' })
const custom = { name: 'Custom', role: 'admin' }
console.log(defaults.merge(custom).all())
// { name: 'Custom', type: 'user', role: 'admin' }
```

### Working with Objects

```typescript
interface User {
  id?: number
  name?: string
  settings?: Record<string, any>
}

const baseUser: User = collect({
  name: 'John',
  settings: {
    theme: 'light',
    notifications: true
  }
})

const updates: User = {
  id: 1,
  settings: {
    theme: 'dark'
  }
}

const updatedUser = baseUser.merge(updates)
console.log(updatedUser.all())
// {
//   id: 1,
//   name: 'John',
//   settings: {
//     theme: 'dark',
//     notifications: true
//   }
// }
```

### Real-world Examples

#### Configuration Merging

```typescript
interface Config {
  database: {
    host?: string
    port?: number
    credentials?: {
      username?: string
      password?: string
    }
  }
  cache?: {
    enabled?: boolean
    ttl?: number
  }
}

const defaultConfig = collect<Config>({
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'default',
      password: 'default'
    }
  },
  cache: {
    enabled: false,
    ttl: 3600
  }
})

const environmentConfig: Partial<Config> = {
  database: {
    host: 'production.db',
    credentials: {
      username: 'prod_user'
    }
  }
}

const finalConfig = defaultConfig.merge(environmentConfig)
```

#### API Response Handling

```typescript
interface ApiResponse {
  data: any
  meta: {
    page?: number
    total?: number
    timestamp?: string
  }
}

class ApiHandler {
  private defaultResponse = collect<ApiResponse>({
    data: null,
    meta: {
      page: 1,
      total: 0,
      timestamp: new Date().toISOString()
    }
  })

  processResponse(response: Partial<ApiResponse>): ApiResponse {
    return this.defaultResponse.merge(response).all()
  }
}

// Usage
const handler = new ApiHandler()
const response = handler.processResponse({
  data: ['item1', 'item2'],
  meta: { total: 2 }
})
```

### Advanced Usage

#### Deep Merging State

```typescript
interface AppState {
  user: {
    profile?: {
      name?: string
      email?: string
      preferences?: {
        language?: string
        timezone?: string
      }
    }
    settings?: Record<string, any>
  }
}

class StateManager {
  private state = collect<AppState>({
    user: {
      profile: {
        preferences: {
          language: 'en',
          timezone: 'UTC'
        }
      },
      settings: {}
    }
  })

  updateState(newState: Partial<AppState>) {
    this.state = this.state.merge(newState)
    return this.state
  }
}

// Usage
const manager = new StateManager()
manager.updateState({
  user: {
    profile: {
      name: 'John',
      preferences: {
        language: 'es'
      }
    }
  }
})
```

### Working with Collections

```typescript
interface Task {
  id: number
  status: string
  priority: number
}

const initialTasks = collect<Task>([
  { id: 1, status: 'pending', priority: 1 },
  { id: 2, status: 'completed', priority: 2 }
])

const newTasks = collect<Task>([
  { id: 3, status: 'pending', priority: 3 }
])

const allTasks = initialTasks.merge(newTasks)
```

## Type Safety

```typescript
interface TypedObject {
  required: string
  optional?: number
  nested?: {
    value?: string
  }
}

const base = collect<TypedObject>({
  required: 'base',
  nested: {
    value: 'original'
  }
})

// Type-safe merging
const merged = base.merge({
  optional: 42,
  nested: {
    value: 'updated'
  }
})

// TypeScript ensures type safety
const result: TypedObject = merged.all()
```

## Return Value

- Returns a new Collection instance containing the merged items
- For arrays: concatenates the values
- For objects:
  - Combines properties from both objects
  - Later values overwrite earlier ones
  - Maintains nested structure
- Original collection remains unchanged
