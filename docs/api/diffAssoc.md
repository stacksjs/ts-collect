# DiffAssoc Method

The `diffAssoc()` method compares the collection against another array or collection based on both its keys and values. This method returns the items in the original collection that are not present in the given collection.

## Basic Syntax

```typescript
collect(items).diffAssoc(array)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const collection = collect({
  color: 'blue',
  size: 'medium',
  price: 100
})

const comparison = {
  color: 'blue',
  size: 'large',
  discount: 10
}

const diff = collection.diffAssoc(comparison)
console.log(diff.all())
// {
//   size: 'medium',
//   price: 100
// }
```

### Working with Arrays

```typescript
const original = collect({
  a: 1,
  b: 2,
  c: 3
})

const compare = {
  a: 1,
  b: 4,
  d: 5
}

const diff = original.diffAssoc(compare)
console.log(diff.all())
// {
//   b: 2,
//   c: 3
// }
```

### Real-world Examples

#### Configuration Comparison

```typescript
interface Config {
  [key: string]: string | number | boolean
}

const defaultConfig: Config = {
  debug: true,
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  caching: true
}

const userConfig: Config = {
  debug: false,
  apiUrl: 'https://api.example.com',
  timeout: 3000,
  caching: true
}

const configDiff = collect(defaultConfig).diffAssoc(userConfig)
console.log(configDiff.all())
// {
//   debug: true,
//   timeout: 5000,
//   retries: 3
// }
```

#### Form Change Detection

```typescript
interface FormData {
  [key: string]: string | number | boolean
}

const originalForm: FormData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  newsletter: true
}

const updatedForm: FormData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 31,
  newsletter: true
}

const changes = collect(updatedForm).diffAssoc(originalForm)
console.log(changes.all())
// {
//   email: 'john.doe@example.com',
//   age: 31
// }
```

### Advanced Usage

#### User Settings Comparison

```typescript
interface UserSettings {
  theme: string
  notifications: boolean
  language: string
  fontSize: number
  [key: string]: any
}

const oldSettings: UserSettings = {
  theme: 'dark',
  notifications: true,
  language: 'en',
  fontSize: 14,
  sidebar: 'left'
}

const newSettings: UserSettings = {
  theme: 'light',
  notifications: true,
  language: 'en',
  fontSize: 16,
  autoSave: true
}

const settingsDiff = collect(newSettings).diffAssoc(oldSettings)
console.log(settingsDiff.all())
// {
//   theme: 'light',
//   fontSize: 16,
//   autoSave: true
// }
```

#### API Response Comparison

```typescript
interface ApiResponse {
  status: string
  code: number
  data: {
    [key: string]: any
  }
}

const previousResponse: ApiResponse = {
  status: 'success',
  code: 200,
  data: {
    userId: 123,
    lastLogin: '2024-01-01',
    permissions: ['read', 'write']
  }
}

const currentResponse: ApiResponse = {
  status: 'success',
  code: 200,
  data: {
    userId: 123,
    lastLogin: '2024-01-02',
    permissions: ['read']
  }
}

const responseDiff = collect(currentResponse.data)
  .diffAssoc(previousResponse.data)

console.log(responseDiff.all())
// {
//   lastLogin: '2024-01-02',
//   permissions: ['read']
// }
```

### Working with Nested Objects

```typescript
interface NestedConfig {
  [key: string]: any
}

const originalConfig: NestedConfig = {
  database: {
    host: 'localhost',
    port: 3306,
    credentials: {
      user: 'admin',
      password: 'secret'
    }
  },
  cache: {
    enabled: true,
    ttl: 3600
  }
}

const newConfig: NestedConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      user: 'admin',
      password: 'newSecret'
    }
  },
  cache: {
    enabled: true,
    ttl: 7200
  }
}

// Compare top-level differences
const configDiff = collect(newConfig).diffAssoc(originalConfig)

// Compare specific nested objects
const dbDiff = collect(newConfig.database).diffAssoc(originalConfig.database)
const cacheDiff = collect(newConfig.cache).diffAssoc(originalConfig.cache)

console.log('Database differences:', dbDiff.all())
// {
//   port: 5432,
//   credentials: {
//     password: 'newSecret'
//   }
// }
```

## Type Safety

```typescript
interface TypedObject {
  id: number
  name: string
  value: any
}

const obj1: TypedObject = {
  id: 1,
  name: 'First',
  value: 'test'
}

const obj2: TypedObject = {
  id: 1,
  name: 'Second',
  value: 'test'
}

// TypeScript ensures type safety
const typedDiff = collect(obj1).diffAssoc(obj2)
```

## Return Value

Returns a new Collection instance containing the key/value pairs that exist in the original collection but not in the given comparison array/collection.
