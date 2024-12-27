# MergeRecursive Method

The `mergeRecursive()` method deeply merges the given array or collection with the original collection. Unlike the regular merge method, it recursively merges nested arrays and objects.

## Basic Syntax

```typescript
collect(items).mergeRecursive(items: array | Collection | object)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple nested objects
const original = collect({
  settings: {
    theme: 'light',
    notifications: {
      email: true,
      push: false
    }
  }
})

const update = {
  settings: {
    notifications: {
      push: true
    }
  }
}

const result = original.mergeRecursive(update)
console.log(result.all())
// {
//   settings: {
//     theme: 'light',
//     notifications: {
//       email: true,
//       push: true
//     }
//   }
// }
```

### Complex Object Merging

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
    pool: {
      min: number
      max: number
    }
  }
  cache: {
    driver: string
    options: Record<string, any>
  }
}

const defaultConfig = collect<DeepConfig>({
  database: {
    connection: {
      host: 'localhost',
      port: 5432,
      credentials: {
        username: 'default',
        password: 'secret'
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  cache: {
    driver: 'redis',
    options: {
      host: 'localhost',
      port: 6379
    }
  }
})

const customConfig = {
  database: {
    connection: {
      host: 'production.db',
      credentials: {
        username: 'prod_user'
      }
    },
    pool: {
      max: 20
    }
  }
}

const finalConfig = defaultConfig.mergeRecursive(customConfig)
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
            frequency: string
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
                push: true,
                frequency: 'daily'
              }
            }
          }
        },
        settings: {}
      }
    })
  }

  updateState(newState: Partial<AppState>) {
    this.state = this.state.mergeRecursive(newState)
    return this.state
  }
}

// Usage
const manager = new StateManager()
manager.updateState({
  user: {
    profile: {
      personal: {
        name: 'John Doe',
        preferences: {
          notifications: {
            push: false
          }
        }
      }
    }
  }
})
```

#### Deep Configuration Override

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

const baseConfig = collect<ServiceConfig>({
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

const environmentConfig = {
  api: {
    endpoints: {
      users: {
        url: 'https://prod.api/users',
        timeout: 10000
      }
    },
    defaults: {
      retries: {
        count: 5
      }
    }
  }
}

const finalConfig = baseConfig.mergeRecursive(environmentConfig)
```

### Working with Arrays

```typescript
interface Department {
  name: string
  teams: {
    name: string
    members: string[]
  }[]
}

const original = collect<Department>({
  name: 'Engineering',
  teams: [
    {
      name: 'Frontend',
      members: ['Alice', 'Bob']
    },
    {
      name: 'Backend',
      members: ['Charlie']
    }
  ]
})

const update = {
  teams: [
    {
      name: 'Frontend',
      members: ['David']
    }
  ]
}

const merged = original.mergeRecursive(update)
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

const base = collect<TypedNested>({
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

// Type-safe recursive merging
const merged = base.mergeRecursive({
  level1: {
    level2: {
      array: [3],
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

- Returns a new Collection instance containing the recursively merged items
- Maintains the complete nested structure
- Arrays are concatenated
- Objects are deeply merged
- Original collection remains unchanged
