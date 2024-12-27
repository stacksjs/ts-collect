# ReplaceRecursive Method

The `replaceRecursive()` method recursively replaces the items in the collection with the given items, handling nested arrays and objects. Unlike the regular replace method, it maintains the structure and merges nested objects.

## Basic Syntax

```typescript
collect(items).replaceRecursive(items: any)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple nested object replacement
const original = collect({
  name: 'John',
  settings: {
    theme: 'light',
    notifications: true
  }
})

original.replaceRecursive({
  settings: {
    theme: 'dark'
  }
})

console.log(original.all())
// {
//   name: 'John',
//   settings: {
//     theme: 'dark',
//     notifications: true
//   }
// }
```

### Working with Complex Objects

```typescript
interface DeepConfig {
  database: {
    connection: {
      host: string
      port: number
      credentials?: {
        username: string
        password: string
      }
    }
    settings: {
      pool: {
        min: number
        max: number
      }
    }
  }
}

const config = collect<DeepConfig>({
  database: {
    connection: {
      host: 'localhost',
      port: 5432,
      credentials: {
        username: 'admin',
        password: 'secret'
      }
    },
    settings: {
      pool: {
        min: 5,
        max: 20
      }
    }
  }
})

// Partial recursive replacement
config.replaceRecursive({
  database: {
    connection: {
      host: 'production.db',
      credentials: {
        username: 'prod_user'
      }
    }
  }
})
```

### Real-world Examples

#### Application State Management

```typescript
interface AppState {
  user: {
    profile: {
      personal: {
        name: string
        email: string
        preferences: {
          theme: string
          language: string
          notifications: {
            email: boolean
            push: boolean
          }
        }
      }
      professional?: {
        title: string
        department: string
      }
    }
    settings: Record<string, any>
  }
}

class StateManager {
  private state: Collection<AppState>

  constructor() {
    this.state = collect<AppState>({
      user: {
        profile: {
          personal: {
            name: '',
            email: '',
            preferences: {
              theme: 'light',
              language: 'en',
              notifications: {
                email: true,
                push: true
              }
            }
          }
        },
        settings: {}
      }
    })
  }

  updateState(newState: Partial<AppState>) {
    this.state.replaceRecursive(newState)
  }

  getCurrentState(): AppState {
    return this.state.all()
  }
}

// Usage
const manager = new StateManager()
manager.updateState({
  user: {
    profile: {
      personal: {
        preferences: {
          theme: 'dark',
          notifications: {
            push: false
          }
        }
      }
    }
  }
})
```

#### Configuration System

```typescript
interface ServiceConfig {
  api: {
    endpoints: {
      [key: string]: {
        url: string
        method: string
        headers?: Record<string, string>
        timeout?: number
      }
    }
    defaults: {
      headers: Record<string, string>
      timeout: number
      retries: {
        count: number
        delay: number
      }
    }
  }
}

class ConfigManager {
  private config: Collection<ServiceConfig>

  constructor() {
    this.config = collect<ServiceConfig>({
      api: {
        endpoints: {
          users: {
            url: '/api/users',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        },
        defaults: {
          headers: {
            Accept: 'application/json'
          },
          timeout: 5000,
          retries: {
            count: 3,
            delay: 1000
          }
        }
      }
    })
  }

  updateConfig(newConfig: Partial<ServiceConfig>) {
    this.config.replaceRecursive(newConfig)
  }

  getConfig(): ServiceConfig {
    return this.config.all()
  }
}
```

### Advanced Usage

#### Deep Form State

```typescript
interface FormState {
  values: {
    [section: string]: {
      [field: string]: {
        value: any
        validation: {
          rules: string[]
          errors: string[]
        }
        metadata: {
          touched: boolean
          dirty: boolean
        }
      }
    }
  }
  metadata: {
    submitted: boolean
    lastUpdated: number
  }
}

class FormManager {
  private state: Collection<FormState>

  constructor() {
    this.state = collect<FormState>({
      values: {},
      metadata: {
        submitted: false,
        lastUpdated: Date.now()
      }
    })
  }

  updateFields(updates: Partial<FormState>) {
    this.state.replaceRecursive({
      ...updates,
      metadata: {
        lastUpdated: Date.now()
      }
    })
  }
}
```

## Type Safety

```typescript
interface TypedNested {
  level1: {
    level2: {
      value: string
      array: number[]
      options?: {
        enabled: boolean
        settings: Record<string, any>
      }
    }
  }
}

const data = collect<TypedNested>({
  level1: {
    level2: {
      value: 'original',
      array: [1, 2],
      options: {
        enabled: true,
        settings: {
          key1: 'value1'
        }
      }
    }
  }
})

// Type-safe recursive replacement
data.replaceRecursive({
  level1: {
    level2: {
      value: 'updated',
      options: {
        settings: {
          key2: 'value2'
        }
      }
    }
  }
})
```

## Return Value

- Returns the collection instance for method chaining
- Recursively replaces contents while preserving structure
- Maintains existing values for properties not specified in replacement
- Original collection is modified
- Maintains type safety with TypeScript
