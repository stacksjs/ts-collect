# Get Method

The `get()` method retrieves an item from the collection by its key. You can also provide a default value if the key doesn't exist.

## Basic Syntax

```typescript
// Basic usage
collect(items).get(key: keyof T)

// With default value
collect(items).get(key: keyof T, defaultValue?: any)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple object
const data = collect({
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

console.log(data.get('name')) // 'John'
console.log(data.get('age')) // 30
console.log(data.get('phone', 'Not provided')) // 'Not provided'
```

### Working with Arrays

```typescript
const array = collect(['a', 'b', 'c'])

console.log(array.get(0)) // 'a'
console.log(array.get(1)) // 'b'
console.log(array.get(3, 'default')) // 'default'
```

### Real-world Examples

#### Configuration Manager

```typescript
interface Config {
  database: {
    host: string
    port: number
    credentials?: {
      username: string
      password: string
    }
  }
  cache: {
    enabled: boolean
    ttl: number
  }
}

const config = collect<Config>({
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret'
    }
  },
  cache: {
    enabled: true,
    ttl: 3600
  }
})

// Get database host
console.log(config.get('database').host) // 'localhost'

// Get cache settings with default
const cacheSettings = config.get('cache', { enabled: false, ttl: 1800 })
```

#### User Preferences

```typescript
interface UserPreferences {
  theme: string
  notifications: {
    email: boolean
    push: boolean
    frequency: string
  }
  language: string
}

const preferences = collect<UserPreferences>({
  theme: 'dark',
  notifications: {
    email: true,
    push: false,
    frequency: 'daily'
  },
  language: 'en'
})

// Get notification settings
const notificationSettings = preferences.get('notifications')
console.log(notificationSettings.email) // true

// Get language with default
const language = preferences.get('language', 'en-US')
```

### Working with Complex Objects

```typescript
interface DeepObject {
  level1: {
    level2: {
      level3: {
        value: string
      }
    }
  }
}

const deepObject = collect<DeepObject>({
  level1: {
    level2: {
      level3: {
        value: 'deep value'
      }
    }
  }
})

// Access nested values
const level1 = deepObject.get('level1')
console.log(level1.level2.level3.value) // 'deep value'
```

### Error Handling

```typescript
interface SafeData {
  required: string
  optional?: string
}

const safeData = collect<SafeData>({
  required: 'value'
})

// Safe access with default values
const requiredValue = safeData.get('required', 'default required')
const optionalValue = safeData.get('optional', 'default optional')

console.log(requiredValue) // 'value'
console.log(optionalValue) // 'default optional'
```

### Application State Management

```typescript
interface AppState {
  user: {
    id: number
    name: string
    settings: {
      [key: string]: any
    }
  } | null
  isAuthenticated: boolean
  lastActivity: string
}

class StateManager {
  private state = collect<AppState>({
    user: null,
    isAuthenticated: false,
    lastActivity: new Date().toISOString()
  })

  getUserSetting(key: string, defaultValue: any = null) {
    const user = this.state.get('user')
    if (!user)
      return defaultValue

    return user.settings[key] ?? defaultValue
  }

  getAuthStatus() {
    return this.state.get('isAuthenticated', false)
  }
}
```

### Type Safety

```typescript
interface TypedData {
  id: number
  details: {
    name: string
    age?: number
  }
}

const typedObject = collect<TypedData>({
  id: 1,
  details: {
    name: 'John'
  }
})

// TypeScript ensures type safety
const id = typedObject.get('id') // type: number
const details = typedObject.get('details') // type: { name: string, age?: number }
const age = typedObject.get('details').age // type: number | undefined
```

## Return Value

- Returns the value at the specified key if it exists
- Returns the default value if the key doesn't exist and a default value is provided
- Returns undefined if the key doesn't exist and no default value is provided
- For nested objects, returns the entire nested structure at that key
