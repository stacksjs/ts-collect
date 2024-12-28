# SortKeysDesc Method

The `sortKeysDesc()` method sorts the collection by the keys of the object in descending order. For arrays with objects, it sorts the keys within each object in reverse alphabetical order.

## Basic Syntax

```typescript
collect(items).sortKeysDesc()
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple object sorting
const data = collect({
  alpha: 1,
  charlie: 2,
  beta: 3
})

console.log(data.sortKeysDesc().all())
// {
//   charlie: 2,
//   beta: 3,
//   alpha: 1
// }
```

### Working with Nested Objects

```typescript
interface Config {
  [key: string]: any
}

const settings = collect<Config>({
  app: {
    value: 'app setting'
  },
  zebra: {
    value: 'zebra setting'
  },
  system: {
    value: 'system setting'
  }
})

console.log(settings.sortKeysDesc().all())
// {
//   zebra: { value: 'zebra setting' },
//   system: { value: 'system setting' },
//   app: { value: 'app setting' }
// }
```

### Real-world Examples

#### Configuration Priority Manager

```typescript
interface PriorityConfig {
  [key: string]: {
    priority: number
    enabled: boolean
    options: Record<string, any>
  }
}

class PriorityManager {
  private config: Collection<PriorityConfig>

  constructor(config: PriorityConfig) {
    this.config = collect(config)
  }

  getOrderedConfig() {
    return this.config.sortKeysDesc().all()
  }

  printPriorityOrder() {
    const ordered = this.getOrderedConfig()
    Object.entries(ordered).forEach(([key, config]) => {
      console.log(`${key}: Priority ${config.priority}`)
    })
  }
}

// Usage
const manager = new PriorityManager({
  low: { priority: 1, enabled: true, options: {} },
  high: { priority: 3, enabled: true, options: {} },
  medium: { priority: 2, enabled: true, options: {} }
})
```

#### Route Registry

```typescript
interface RouteConfig {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  middleware: string[]
}

interface RouteRegistry {
  [path: string]: RouteConfig
}

class RouterManager {
  private routes: Collection<RouteRegistry>

  constructor(routes: RouteRegistry) {
    this.routes = collect(routes)
  }

  getOrderedRoutes() {
    return this.routes
      .map(route => ({
        ...route,
        middleware: route.middleware.sort().reverse()
      }))
      .sortKeysDesc()
      .all()
  }

  printRouteMap() {
    const ordered = this.getOrderedRoutes()
    Object.entries(ordered).forEach(([path, config]) => {
      console.log(`${config.method} ${path}`)
      console.log(`Middleware: ${config.middleware.join(', ')}`)
    })
  }
}
```

### Advanced Usage

#### Environment Variables Manager

```typescript
interface EnvVar {
  value: string
  isSecret: boolean
  source: string
}

interface EnvVarRegistry {
  [key: string]: EnvVar
}

class EnvManager {
  private variables: Collection<EnvVarRegistry>

  constructor(vars: EnvVarRegistry) {
    this.variables = collect(vars)
  }

  getOrderedVars() {
    return this.variables.sortKeysDesc().all()
  }

  getPublicVars() {
    return this.variables
      .filter(v => !v.isSecret)
      .sortKeysDesc()
      .all()
  }

  printSecureLog() {
    const ordered = this.getOrderedVars()
    Object.entries(ordered).forEach(([key, config]) => {
      const value = config.isSecret ? '*****' : config.value
      console.log(`${key}=${value} (from ${config.source})`)
    })
  }
}
```

#### Header Normalizer

```typescript
interface NormalizedHeaders {
  [key: string]: string[]
}

class HeaderNormalizer {
  private headers: Collection<NormalizedHeaders>

  constructor(headers: Record<string, string | string[]>) {
    const normalized = Object.entries(headers).reduce((acc, [key, value]) => {
      acc[key.toLowerCase()] = Array.isArray(value) ? value : [value]
      return acc
    }, {} as NormalizedHeaders)

    this.headers = collect(normalized)
  }

  getNormalizedHeaders() {
    return this.headers
      .map(values => values.sort().reverse())
      .sortKeysDesc()
      .all()
  }

  toString(): string {
    const headers = this.getNormalizedHeaders()
    return Object.entries(headers)
      .map(([key, values]) => `${key}: ${values.join(', ')}`)
      .join('\n')
  }
}
```

## Type Safety

```typescript
interface TypedObject {
  [key: string]: {
    id: number
    value: string
    metadata?: Record<string, any>
  }
}

const data = collect<TypedObject>({
  first: { id: 1, value: 'one' },
  third: { id: 3, value: 'three' },
  second: { id: 2, value: 'two', metadata: { extra: 'info' } }
})

// Type-safe sorting
const sorted = data.sortKeysDesc()

// TypeScript maintains type information
type ResultType = typeof sorted.all() // TypedObject

// Access properties safely
Object.entries(sorted.all()).forEach(([key, item]) => {
  console.log(item.id)       // ✓ Valid
  console.log(item.value)    // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a new Collection instance with keys sorted in descending order
- Original collection remains unchanged
- For objects:
  - Sorts top-level keys in reverse alphabetical order
  - Does not sort nested object keys
- Maintains type safety with TypeScript
- Can be chained with other collection methods
