# Except Method

The `except()` method returns all items in the collection except for those with the specified keys. When working with arrays of objects, it removes the specified keys from each object.

## Basic Syntax

```typescript
const keys: string[]
collect(items).except(keys)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect({
  id: 1,
  name: 'John',
  email: 'john@example.com',
  password: 'secret123'
})

const publicData = data.except(['password'])
console.log(publicData.all())
// {
//   id: 1,
//   name: 'John',
//   email: 'john@example.com'
// }
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
  apiKey: string
  preferences: object
}

const user = collect<User>({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
  apiKey: 'secret_key',
  preferences: { theme: 'dark' }
})

// Remove sensitive information
const safeUser = user.except(['password', 'apiKey'])
console.log(safeUser.all())
// {
//   id: 1,
//   name: 'John Doe',
//   email: 'john@example.com',
//   preferences: { theme: 'dark' }
// }
```

### Real-world Examples

#### API Response Formatting

```typescript
interface ApiResponse {
  data: object
  internalId: string
  metadata: object
  serverInfo: object
  debug: object
}

const response = collect<ApiResponse>({
  data: { userId: 1, content: 'Hello' },
  internalId: 'abc123',
  metadata: { timestamp: '2024-01-01' },
  serverInfo: { version: '1.0.0' },
  debug: { logs: [] }
})

// Remove internal fields before sending to client
const clientResponse = response.except(['internalId', 'serverInfo', 'debug'])
console.log(clientResponse.all())
// {
//   data: { userId: 1, content: 'Hello' },
//   metadata: { timestamp: '2024-01-01' }
// }
```

#### Database Record Processing

```typescript
interface DatabaseRecord {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  data: object
  _meta: object
  _sync: object
}

const record = collect<DatabaseRecord>({
  id: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-02',
  deletedAt: null,
  data: { title: 'Example' },
  _meta: { version: 2 },
  _sync: { lastSync: '2024-01-02' }
})

// Remove internal tracking fields
const cleanRecord = record.except(['_meta', '_sync', 'deletedAt'])
console.log(cleanRecord.all())
// {
//   id: 1,
//   createdAt: '2024-01-01',
//   updatedAt: '2024-01-02',
//   data: { title: 'Example' }
// }
```

### Working with Multiple Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  cost: number
  supplier: object
  internal: object
}

const products = collect<Product[]>([
  {
    id: 1,
    name: 'Laptop',
    price: 999,
    cost: 700,
    supplier: { id: 's1', name: 'Tech Corp' },
    internal: { margin: 0.3, sku: 'LAP001' }
  },
  {
    id: 2,
    name: 'Mouse',
    price: 29.99,
    cost: 15,
    supplier: { id: 's2', name: 'Accessories Inc' },
    internal: { margin: 0.5, sku: 'MOU001' }
  }
])

// Remove internal and cost information
const publicProducts = products.map((product) => {
  return collect(product).except(['cost', 'internal']).all()
})

console.log(publicProducts)
// [
//   {
//     id: 1,
//     name: 'Laptop',
//     price: 999,
//     supplier: { id: 's1', name: 'Tech Corp' }
//   },
//   {
//     id: 2,
//     name: 'Mouse',
//     price: 29.99,
//     supplier: { id: 's2', name: 'Accessories Inc' }
//   }
// ]
```

### Security Examples

```typescript
interface UserProfile {
  id: number
  username: string
  email: string
  passwordHash: string
  twoFactorSecret: string
  recoveryKeys: string[]
  publicData: object
}

const profile = collect<UserProfile>({
  id: 1,
  username: 'johndoe',
  email: 'john@example.com',
  passwordHash: 'hashed_value',
  twoFactorSecret: '2fa_secret',
  recoveryKeys: ['key1', 'key2'],
  publicData: { bio: 'Hello!' }
})

// Remove all sensitive information
const sensitiveFields = [
  'passwordHash',
  'twoFactorSecret',
  'recoveryKeys'
]

const publicProfile = profile.except(sensitiveFields)
```

## Type Safety

```typescript
interface TypedData {
  id: number
  required: string
  optional?: string
  sensitive: string
}

const data = collect<TypedData>({
  id: 1,
  required: 'value',
  optional: 'value',
  sensitive: 'secret'
})

// TypeScript ensures we only exclude existing keys
const safe = data.except(['sensitive']) // ✓ Valid
// const invalid = data.except(['nonexistent'])  // ✗ TypeScript error
```

## Return Value

Returns a new Collection instance with the specified keys removed from the object(s). The original collection remains unchanged.
