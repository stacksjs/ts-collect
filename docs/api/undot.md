# Undot Method

The `undot()` method expands a dot-notated array or object into a full multi-dimensional array or object. This is particularly useful when working with flattened configurations or form data.

## Basic Syntax

```typescript
collect(items).undot()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple object with dot notation
const data = collect({
  'user.name': 'John',
  'user.email': 'john@example.com',
  'settings.theme': 'dark'
})

console.log(data.undot().all())
// {
//   user: {
//     name: 'John',
//     email: 'john@example.com'
//   },
//   settings: {
//     theme: 'dark'
//   }
// }
```

### Working with Complex Objects

```typescript
interface Config {
  [key: string]: any
}

const config = collect<Config>({
  'database.host': 'localhost',
  'database.port': 5432,
  'database.credentials.username': 'admin',
  'database.credentials.password': 'secret',
  'cache.enabled': true,
  'cache.duration': 3600
})

console.log(config.undot().all())
// {
//   database: {
//     host: 'localhost',
//     port: 5432,
//     credentials: {
//       username: 'admin',
//       password: 'secret'
//     }
//   },
//   cache: {
//     enabled: true,
//     duration: 3600
//   }
// }
```

### Real-world Examples

#### Form Data Processor

```typescript
interface FormData {
  [key: string]: any
}

class FormProcessor {
  static expandFormData(flatData: FormData) {
    const data = collect(flatData)
    return data.undot().all()
  }
}

// Usage
const formData = {
  'user.personal.firstName': 'John',
  'user.personal.lastName': 'Doe',
  'user.contact.email': 'john@example.com',
  'user.contact.phone': '123-456-7890',
  'user.preferences.notifications.email': true,
  'user.preferences.notifications.sms': false
}

const expanded = FormProcessor.expandFormData(formData)
// {
//   user: {
//     personal: {
//       firstName: 'John',
//       lastName: 'Doe'
//     },
//     contact: {
//       email: 'john@example.com',
//       phone: '123-456-7890'
//     },
//     preferences: {
//       notifications: {
//         email: true,
//         sms: false
//       }
//     }
//   }
// }
```

#### Configuration Manager

```typescript
interface DatabaseConfig {
  host: string
  port: number
  credentials: {
    username: string
    password: string
  }
  pool: {
    min: number
    max: number
  }
}

class ConfigurationManager {
  private flatConfig: Record<string, any>

  constructor(flatConfig: Record<string, any>) {
    this.flatConfig = flatConfig
  }

  getExpandedConfig(): DatabaseConfig {
    return collect(this.flatConfig)
      .undot()
      .all()
  }
}

// Usage
const flatDbConfig = {
  'database.host': 'localhost',
  'database.port': 5432,
  'database.credentials.username': 'admin',
  'database.credentials.password': 'secret',
  'database.pool.min': 5,
  'database.pool.max': 20
}

const configManager = new ConfigurationManager(flatDbConfig)
const config = configManager.getExpandedConfig()
```

### Advanced Usage

#### Nested Settings Manager

```typescript
interface Settings {
  [key: string]: any
}

class SettingsManager {
  private settings: Collection<Settings>

  constructor(flatSettings: Record<string, any>) {
    this.settings = collect(flatSettings)
  }

  expand(): Settings {
    return this.settings.undot().all()
  }

  getValue(path: string): any {
    const expanded = this.expand()
    return path.split('.').reduce((obj, key) =>
      obj && obj[key], expanded)
  }

  static flatten(settings: Settings): Record<string, any> {
    const collect = require('ts-collect')
    return collect(settings).dot().all()
  }
}

// Usage
const flatSettings = {
  'theme.colors.primary': '#007bff',
  'theme.colors.secondary': '#6c757d',
  'theme.typography.fontSize': '16px',
  'theme.typography.fontFamily': 'Arial'
}

const manager = new SettingsManager(flatSettings)
const expanded = manager.expand()
```

#### API Response Transformer

```typescript
interface ApiResponse {
  [key: string]: any
}

class ResponseTransformer {
  static expandResponse(flatResponse: Record<string, any>): ApiResponse {
    return collect(flatResponse)
      .undot()
      .all()
  }
}

// Usage
const flatResponse = {
  'data.user.id': 1,
  'data.user.name': 'John Doe',
  'data.user.profile.avatar': 'url/to/avatar',
  'meta.timestamp': '2024-01-01T00:00:00Z',
  'meta.status': 'success'
}

const expanded = ResponseTransformer.expandResponse(flatResponse)
// {
//   data: {
//     user: {
//       id: 1,
//       name: 'John Doe',
//       profile: {
//         avatar: 'url/to/avatar'
//       }
//     }
//   },
//   meta: {
//     timestamp: '2024-01-01T00:00:00Z',
//     status: 'success'
//   }
// }
```

## Type Safety

```typescript
interface TypedConfig {
  database: {
    host: string
    port: number
    credentials: {
      username: string
      password: string
    }
  }
  cache: {
    enabled: boolean
    ttl: number
  }
}

const flatConfig = {
  'database.host': 'localhost',
  'database.port': 5432,
  'database.credentials.username': 'admin',
  'database.credentials.password': 'secret',
  'cache.enabled': true,
  'cache.ttl': 3600
}

// Type-safe expansion
const config = collect(flatConfig).undot().all() as TypedConfig

// TypeScript knows about the types
console.log(config.database.host) // ✓ Valid
console.log(config.cache.enabled) // ✓ Valid
// console.log(config.invalid.property)  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing the expanded structure
- Original collection remains unchanged
- Converts dot notation into nested objects
- Maintains array indices when present in dot notation
- Preserves types of values
- Can be chained with other collection methods
