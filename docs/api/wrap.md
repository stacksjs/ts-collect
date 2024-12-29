# Wrap Method

The `wrap()` method creates a new collection instance from a value or array. It's particularly useful for ensuring that you're working with a collection, regardless of whether your input is a single value or an array.

## Basic Syntax

```typescript
// Wrap a single value
Collection.wrap(value: U)

// Wrap an array
Collection.wrap(array: U[])
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Wrap a single value
const single = Collection.wrap(1)
console.log(single.all()) // [1]

// Wrap an array
const multiple = Collection.wrap([1, 2, 3])
console.log(multiple.all()) // [1, 2, 3]

// Wrap a string
const string = Collection.wrap('hello')
console.log(string.all()) // ['hello']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
}

// Wrap a single object
const user = Collection.wrap<User>({
  id: 1,
  name: 'John'
})

// Wrap an array of objects
const users = Collection.wrap<User>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])
```

### Real-world Examples

#### Data Transformer

```typescript
interface DataTransformer<T, U> {
  transform: (input: T | T[]) => Collection<U>
}

class UserDataTransformer implements DataTransformer<User, any> {
  transform(input: User | User[]): Collection<any> {
    return Collection.wrap(input).map(user => ({
      fullName: user.name,
      userId: `USER_${user.id}`,
      createdAt: new Date()
    }))
  }
}

// Usage
const transformer = new UserDataTransformer()

// Transform single user
const singleResult = transformer.transform({
  id: 1,
  name: 'John'
})

// Transform multiple users
const multipleResults = transformer.transform([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])
```

#### Request Handler

```typescript
interface ApiRequest {
  endpoint: string
  method: 'GET' | 'POST'
  data?: any
}

class RequestProcessor {
  processRequest(request: ApiRequest | ApiRequest[]): Collection<ApiRequest> {
    return Collection.wrap(request)
      .map(req => ({
        ...req,
        timestamp: Date.now(),
        processed: true
      }))
  }

  async executeRequests(requests: ApiRequest | ApiRequest[]): Promise<any[]> {
    const processedRequests = this.processRequest(requests)

    return Promise.all(
      processedRequests.map(async (request) => {
        // API call simulation
        return { status: 'success', data: request }
      })
    )
  }
}
```

### Advanced Usage

#### Flexible Parameter Handler

```typescript
type Parameter = string | number | boolean
interface ParameterHandler<T extends Parameter> {
  process: (input: T | T[]) => Collection<string>
}

class QueryParameterHandler implements ParameterHandler<Parameter> {
  process(input: Parameter | Parameter[]): Collection<string> {
    return Collection.wrap(input)
      .map((value) => {
        if (typeof value === 'boolean') {
          return value ? '1' : '0'
        }
        return String(value)
      })
  }
}

// Usage
const handler = new QueryParameterHandler()
console.log(handler.process('test').all()) // ['test']
console.log(handler.process([1, true, 'abc']).all()) // ['1', '1', 'abc']
```

#### Configuration Merger

```typescript
interface ConfigItem {
  key: string
  value: any
  priority: number
}

class ConfigurationMerger {
  merge(baseConfig: ConfigItem | ConfigItem[], override: ConfigItem | ConfigItem[]): Collection<ConfigItem> {
    const base = Collection.wrap(baseConfig)
    const overrides = Collection.wrap(override)

    return base.map((item) => {
      const override = overrides.firstWhere('key', item.key)
      return override || item
    })
  }
}

// Usage
const merger = new ConfigurationMerger()
const result = merger.merge(
  { key: 'theme', value: 'light', priority: 1 },
  { key: 'theme', value: 'dark', priority: 2 }
)
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  metadata?: Record<string, any>
}

// Type-safe wrapping
const single = Collection.wrap<TypedItem>({
  id: 1,
  value: 'one'
})

const multiple = Collection.wrap<TypedItem>([
  { id: 1, value: 'one' },
  { id: 2, value: 'two' }
])

// TypeScript enforces types
single.each((item) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a new Collection instance containing:
  - Array with single item if given a non-array value
  - Array with all items if given an array
- Maintains type safety with TypeScript through generics
- Can be chained with other collection methods
- Original value/array remains unchanged

## Common Use Cases

- Normalizing input parameters
- Handling single or multiple items uniformly
- Data transformation pipelines
- API request processing
- Configuration management
