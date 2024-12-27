# Only Method

The `only()` method returns a new collection with only the specified keys. This is particularly useful when you need to extract specific properties from objects or limit the data being exposed.

## Basic Syntax

```typescript
// Single key
collect(items).only(key: string)

// Multiple keys
collect(items).only(keys: string[])
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const user = collect({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret'
})

// Get specific fields
const publicData = user.only(['id', 'name'])
console.log(publicData.all())
// {
//   id: 1,
//   name: 'John Doe'
// }
```

### Working with Arrays of Objects

```typescript
interface User {
  id: number
  name: string
  email: string
  role: string
  password: string
}

const users = collect<User>([
  { id: 1, name: 'John', email: 'john@example.com', role: 'admin', password: 'hash1' },
  { id: 2, name: 'Jane', email: 'jane@example.com', role: 'user', password: 'hash2' }
])

const safeUsers = users.map(user => collect(user).only(['id', 'name', 'role']))
console.log(safeUsers.all())
// [
//   { id: 1, name: 'John', role: 'admin' },
//   { id: 2, name: 'Jane', role: 'user' }
// ]
```

### Real-world Examples

#### API Response Filtering

```typescript
interface APIUser {
  id: number
  username: string
  email: string
  password: string
  apiKey: string
  lastLogin: Date
  settings: Record<string, any>
}

class UserController {
  private getUserData(user: APIUser): Collection<Partial<APIUser>> {
    return collect(user).only([
      'id',
      'username',
      'email',
      'lastLogin',
      'settings'
    ])
  }

  getPublicProfile(user: APIUser): Collection<Partial<APIUser>> {
    return collect(user).only(['id', 'username'])
  }
}

const user: APIUser = {
  id: 1,
  username: 'johndoe',
  email: 'john@example.com',
  password: 'hashed_password',
  apiKey: 'secret_key',
  lastLogin: new Date(),
  settings: { theme: 'dark' }
}

const controller = new UserController()
console.log(controller.getPublicProfile(user).all())
// {
//   id: 1,
//   username: 'johndoe'
// }
```

#### Form Data Processing

```typescript
interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  _token: string
  _timestamp: number
}

class FormProcessor {
  processRegistration(formData: FormData) {
    // Only process relevant fields
    const processableData = collect(formData).only([
      'name',
      'email',
      'password'
    ])

    return processableData.all()
  }
}

const rawFormData: FormData = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
  _token: 'csrf_token',
  _timestamp: Date.now()
}

const processor = new FormProcessor()
console.log(processor.processRegistration(rawFormData))
// {
//   name: 'John Doe',
//   email: 'john@example.com',
//   password: 'secret123'
// }
```

### Advanced Usage

#### Nested Object Handling

```typescript
interface ComplexObject {
  id: number
  metadata: {
    created: Date
    updated: Date
    version: number
  }
  data: {
    title: string
    content: string
    draft: boolean
  }
  security: {
    permissions: string[]
    encrypted: boolean
  }
}

const document = collect<ComplexObject>({
  id: 1,
  metadata: {
    created: new Date(),
    updated: new Date(),
    version: 2
  },
  data: {
    title: 'Document Title',
    content: 'Secret content',
    draft: true
  },
  security: {
    permissions: ['admin', 'editor'],
    encrypted: true
  }
})

const publicView = document.only(['id', 'metadata', 'data'])
```

#### Dynamic Field Selection

```typescript
interface Product {
  id: number
  name: string
  price: number
  cost: number
  supplier: string
  inStock: boolean
  metadata: Record<string, any>
}

class ProductService {
  private product: Collection<Product>

  constructor(product: Product) {
    this.product = collect(product)
  }

  getFields(role: 'admin' | 'manager' | 'customer') {
    const fieldMap = {
      admin: ['id', 'name', 'price', 'cost', 'supplier', 'inStock', 'metadata'],
      manager: ['id', 'name', 'price', 'inStock', 'supplier'],
      customer: ['id', 'name', 'price', 'inStock']
    }

    return this.product.only(fieldMap[role])
  }
}
```

## Type Safety

```typescript
interface TypedObject {
  required: string
  optional?: number
  sensitive: string
  metadata: {
    timestamp: Date
    version: number
  }
}

const data = collect<TypedObject>({
  required: 'value',
  optional: 42,
  sensitive: 'secret',
  metadata: {
    timestamp: new Date(),
    version: 1
  }
})

// Type-safe field selection
const filtered = data.only(['required', 'metadata'])
// TypeScript ensures only valid keys are used
```

## Return Value

- Returns a new Collection instance containing only the specified keys
- If a key doesn't exist in the original collection, it's ignored
- Maintains the original structure for selected keys
- Original collection remains unchanged
