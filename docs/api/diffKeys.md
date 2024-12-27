# DiffKeys Method

The `diffKeys()` method compares the collection against another array or collection based on its keys. This method returns the key/value pairs from the original collection that are not present in the given collection's keys, regardless of the values.

## Basic Syntax

```typescript
collect(items).diffKeys(array)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const collection = collect({
  one: 10,
  two: 20,
  three: 30
})

const comparison = {
  two: 40,
  four: 60
}

const diff = collection.diffKeys(comparison)
console.log(diff.all())
// {
//   one: 10,
//   three: 30
// }
```

### Working with Objects

```typescript
interface Config {
  [key: string]: any
}

const defaultConfig: Config = {
  host: 'localhost',
  port: 3000,
  debug: true
}

const userConfig: Config = {
  port: 8080,
  timeout: 5000
}

const missingConfig = collect(defaultConfig).diffKeys(userConfig)
console.log(missingConfig.all())
// {
//   host: 'localhost',
//   debug: true
// }
```

### Real-world Examples

#### Form Field Comparison

```typescript
interface FormFields {
  [key: string]: string | number | boolean
}

const requiredFields: FormFields = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
}

const submittedFields: FormFields = {
  username: 'john_doe',
  email: 'john@example.com',
  password: '123456'
}

const missingFields = collect(requiredFields).diffKeys(submittedFields)
console.log(missingFields.all())
// {
//   confirmPassword: ''
// }
```

#### API Response Validation

```typescript
interface ApiResponse {
  [key: string]: any
}

const expectedResponse: ApiResponse = {
  id: null,
  title: null,
  content: null,
  author: null,
  createdAt: null
}

const actualResponse: ApiResponse = {
  id: 1,
  title: 'Hello',
  content: 'World',
  tags: ['news']
}

const missingFields = collect(expectedResponse).diffKeys(actualResponse)
console.log(missingFields.all())
// {
//   author: null,
//   createdAt: null
// }
```

### Advanced Usage

#### Database Schema Comparison

```typescript
interface TableSchema {
  [column: string]: {
    type: string
    nullable?: boolean
    default?: any
  }
}

const oldSchema: TableSchema = {
  id: { type: 'integer' },
  name: { type: 'string' },
  email: { type: 'string' },
  created_at: { type: 'timestamp' }
}

const newSchema: TableSchema = {
  id: { type: 'integer' },
  name: { type: 'string' },
  email: { type: 'string' },
  phone: { type: 'string' }
}

const removedColumns = collect(oldSchema).diffKeys(newSchema)
console.log(removedColumns.all())
// {
//   created_at: { type: 'timestamp' }
// }
```

#### Configuration Migration

```typescript
interface AppConfig {
  [key: string]: any
}

const v1Config: AppConfig = {
  apiKey: 'old-key',
  endpoint: 'http://api.example.com',
  timeout: 5000,
  retryCount: 3
}

const v2Config: AppConfig = {
  apiKey: 'new-key',
  endpoint: 'http://api.example.com/v2',
  timeout: 3000,
  rateLimiting: true
}

const removedSettings = collect(v1Config).diffKeys(v2Config)
console.log(removedSettings.all())
// {
//   retryCount: 3
// }
```

### Working with Nested Structures

```typescript
interface NestedConfig {
  [key: string]: {
    [key: string]: any
  }
}

const oldFeatures: NestedConfig = {
  auth: {
    enabled: true,
    provider: 'local'
  },
  cache: {
    enabled: true,
    driver: 'redis'
  },
  logging: {
    level: 'info',
    file: 'app.log'
  }
}

const newFeatures: NestedConfig = {
  auth: {
    enabled: true,
    provider: 'oauth'
  },
  cache: {
    enabled: true,
    driver: 'memory'
  }
}

const removedFeatures = collect(oldFeatures).diffKeys(newFeatures)
console.log(removedFeatures.all())
// {
//   logging: {
//     level: 'info',
//     file: 'app.log'
//   }
// }
```

## Type Safety

```typescript
interface TypedObject {
  [key: string]: string | number
}

const original: TypedObject = {
  name: 'Product',
  price: 100,
  sku: 'ABC123'
}

const comparison: TypedObject = {
  name: 'Updated Product',
  category: 'Electronics'
}

// TypeScript ensures type safety
const diff = collect(original).diffKeys(comparison)
console.log(diff.all())
// {
//   price: 100,
//   sku: 'ABC123'
// }
```

## Return Value

Returns a new Collection instance containing the key/value pairs from the original collection whose keys are not present in the given comparison array/collection. The values of matching keys are not considered in the comparison.
