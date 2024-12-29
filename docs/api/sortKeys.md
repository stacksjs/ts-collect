# SortKeys Method

The `sortKeys()` method sorts the collection by the keys of the object. For arrays with objects, it sorts the keys within each object.

## Basic Syntax

```typescript
collect(items).sortKeys()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple object sorting
const data = collect({
  zebra: 1,
  alpha: 2,
  beta: 3
})

console.log(data.sortKeys().all())
// {
//   alpha: 2,
//   beta: 3,
//   zebra: 1
// }
```

### Working with Nested Objects

```typescript
interface Config {
  [key: string]: any
}

const config = collect<Config>({
  zebra: {
    value: 1
  },
  alpha: {
    value: 2
  },
  beta: {
    value: 3
  }
})

const sorted = config.sortKeys()
console.log(sorted.all())
// {
//   alpha: { value: 2 },
//   beta: { value: 3 },
//   zebra: { value: 1 }
// }
```

### Real-world Examples

#### Configuration Manager

```typescript
interface SystemConfig {
  [key: string]: {
    enabled: boolean
    value: any
    priority: number
  }
}

class ConfigManager {
  private config: Collection<SystemConfig>

  constructor(initialConfig: SystemConfig) {
    this.config = collect(initialConfig)
  }

  getOrderedConfig() {
    return this.config.sortKeys().all()
  }

  printConfig() {
    const ordered = this.getOrderedConfig()
    Object.entries(ordered).forEach(([key, settings]) => {
      console.log(`${key}:`)
      console.log(`  enabled: ${settings.enabled}`)
      console.log(`  value: ${settings.value}`)
      console.log(`  priority: ${settings.priority}`)
    })
  }
}

// Usage
const manager = new ConfigManager({
  database: { enabled: true, value: 'mysql', priority: 1 },
  api: { enabled: true, value: 'rest', priority: 2 },
  cache: { enabled: false, value: 'redis', priority: 3 }
})
```

#### Headers Normalizer

```typescript
interface Headers {
  [key: string]: string | string[]
}

class HeadersNormalizer {
  private headers: Collection<Headers>

  constructor(headers: Headers) {
    this.headers = collect(headers)
  }

  normalize(): Headers {
    return this.headers
      .map(value => Array.isArray(value) ? value.join(', ') : value)
      .sortKeys()
      .all()
  }
}

// Usage
const normalizer = new HeadersNormalizer({
  'x-powered-by': 'Express',
  'accept': ['application/json', 'text/plain'],
  'content-type': 'application/json'
})
```

### Advanced Usage

#### Metadata Processor

```typescript
interface MetadataItem {
  value: any
  timestamp: Date
  tags: string[]
}

interface Metadata {
  [key: string]: MetadataItem
}

class MetadataProcessor {
  private metadata: Collection<Metadata>

  constructor(metadata: Metadata) {
    this.metadata = collect(metadata)
  }

  getOrderedMetadata() {
    return this.metadata
      .map(item => ({
        ...item,
        tags: item.tags.sort()
      }))
      .sortKeys()
      .all()
  }

  findByTag(tag: string): Metadata {
    return this.metadata
      .filter(item => item.tags.includes(tag))
      .sortKeys()
      .all()
  }
}

// Usage
const processor = new MetadataProcessor({
  'user.settings': {
    value: { theme: 'dark' },
    timestamp: new Date(),
    tags: ['user', 'preferences']
  },
  'app.config': {
    value: { debug: true },
    timestamp: new Date(),
    tags: ['system', 'config']
  }
})
```

#### Form Data Organizer

```typescript
interface FormField {
  value: any
  validation: string[]
  errors: string[]
}

interface FormData {
  [key: string]: FormField
}

class FormOrganizer {
  private formData: Collection<FormData>

  constructor(data: FormData) {
    this.formData = collect(data)
  }

  getOrganizedData() {
    return this.formData
      .map(field => ({
        ...field,
        validation: field.validation.sort(),
        errors: field.errors.sort()
      }))
      .sortKeys()
      .all()
  }

  getFieldsWithErrors(): FormData {
    return this.formData
      .filter(field => field.errors.length > 0)
      .sortKeys()
      .all()
  }
}
```

## Type Safety

```typescript
interface TypedData {
  [key: string]: {
    id: number
    value: string
    optional?: boolean
  }
}

const data = collect<TypedData>({
  zebra: { id: 1, value: 'z' },
  alpha: { id: 2, value: 'a' },
  beta: { id: 3, value: 'b', optional: true }
})

// Type-safe sorting
const sorted = data.sortKeys()

// TypeScript maintains type information
type ResultType = typeof sorted.all() // TypedData
```

## Return Value

- Returns a new Collection instance with keys sorted alphabetically
- Original collection remains unchanged
- For objects:
  - Sorts top-level keys alphabetically
  - Does not sort nested object keys
- Maintains type safety with TypeScript
- Can be chained with other collection methods
