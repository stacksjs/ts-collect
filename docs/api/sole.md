# Sole Method

The `sole()` method returns the first element in the collection that matches the given condition, but only if exactly one element matches. If no elements match or more than one element matches, it returns undefined.

## Basic Syntax

```typescript
// Get the sole item matching a callback
collect(items).sole((item: T) => boolean)

// Get the sole item matching a key-value pair
collect(items).sole(key: string, value: any)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// With callback
const numbers = collect([1, 2, 3, 4])
console.log(numbers.sole(n => n > 3)) // 4

// Multiple matches returns undefined
console.log(numbers.sole(n => n > 2)) // undefined

// No matches returns undefined
console.log(numbers.sole(n => n > 10)) // undefined

// With key-value pair
const items = collect([
  { id: 1, type: 'A' },
  { id: 2, type: 'B' },
  { id: 3, type: 'A' }
])

console.log(items.sole('type', 'B')) // { id: 2, type: 'B' }
console.log(items.sole('type', 'A')) // undefined (multiple matches)
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
  active: boolean
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin', active: true },
  { id: 2, name: 'Jane', role: 'user', active: true },
  { id: 3, name: 'Bob', role: 'moderator', active: true }
])

// Find sole admin
const admin = users.sole(user => user.role === 'admin')
console.log(admin) // { id: 1, name: 'John', role: 'admin', active: true }

// Find sole moderator
const moderator = users.sole('role', 'moderator')
console.log(moderator) // { id: 3, name: 'Bob', role: 'moderator', active: true }
```

### Real-world Examples

#### Configuration Validator

```typescript
interface ConfigEntry {
  key: string
  value: string
  environment: string
  isDefault: boolean
}

class ConfigValidator {
  private configs: Collection<ConfigEntry>

  constructor(configs: ConfigEntry[]) {
    this.configs = collect(configs)
  }

  getDefaultConfig(key: string): ConfigEntry | undefined {
    return this.configs.sole(config =>
      config.key === key && config.isDefault
    )
  }

  validateUniqueDefaults(): boolean {
    for (const key of new Set(this.configs.pluck('key'))) {
      const defaultConfig = this.getDefaultConfig(key)
      if (!defaultConfig) {
        return false
      }
    }
    return true
  }
}
```

#### License Manager

```typescript
interface License {
  id: string
  type: string
  status: 'active' | 'expired' | 'revoked'
  userId: string
  features: string[]
}

class LicenseManager {
  private licenses: Collection<License>

  constructor(licenses: License[]) {
    this.licenses = collect(licenses)
  }

  getActiveLicense(userId: string): License | undefined {
    return this.licenses.sole(license =>
      license.userId === userId
      && license.status === 'active'
    )
  }

  validateSingleActiveLicense(userId: string): boolean {
    return this.getActiveLicense(userId) !== undefined
  }
}
```

### Advanced Usage

#### System Health Monitor

```typescript
interface SystemStatus {
  componentId: string
  status: 'healthy' | 'degraded' | 'failed'
  lastCheck: Date
  metrics: {
    cpu: number
    memory: number
    disk: number
  }
}

class SystemMonitor {
  private statuses: Collection<SystemStatus>

  constructor(statuses: SystemStatus[]) {
    this.statuses = collect(statuses)
  }

  findFailedComponent(): SystemStatus | undefined {
    return this.statuses.sole(status => status.status === 'failed')
  }

  hasUniqueDegradation(): boolean {
    return this.statuses.sole(
      status => status.status === 'degraded'
    ) !== undefined
  }

  findHighCpuComponent(): SystemStatus | undefined {
    return this.statuses.sole(
      status => status.metrics.cpu > 90
    )
  }
}
```

#### Database Connection Manager

```typescript
interface DatabaseConnection {
  id: string
  type: 'primary' | 'replica' | 'backup'
  status: 'connected' | 'disconnected'
  priority: number
}

class ConnectionManager {
  private connections: Collection<DatabaseConnection>

  constructor(connections: DatabaseConnection[]) {
    this.connections = collect(connections)
  }

  getPrimaryConnection(): DatabaseConnection | undefined {
    return this.connections.sole(conn =>
      conn.type === 'primary'
      && conn.status === 'connected'
    )
  }

  validateSinglePrimary(): boolean {
    return this.connections.sole('type', 'primary') !== undefined
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  status: 'active' | 'inactive'
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, value: 'one', status: 'active' },
  { id: 2, value: 'two', status: 'inactive' },
  { id: 3, value: 'three', status: 'active' }
])

// Type-safe callback
const item = items.sole((item: TypedItem) => {
  return item.status === 'inactive' // TypeScript validates status values
})

// Type-safe key-value matching
const result = items.sole('status', 'inactive')
```

## Return Value

- Returns the single matching element if exactly one element matches
- Returns undefined if:
  - No elements match the condition
  - Multiple elements match the condition
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be used with both callback functions and key-value pairs
