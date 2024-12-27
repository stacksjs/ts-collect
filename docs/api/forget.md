# Forget Method

The `forget()` method removes an item from the collection by its key. This method is particularly useful when working with objects or when you need to remove specific indices from arrays.

## Basic Syntax

```typescript
const key: string | number
collect(items).forget(key)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Object example
const data = collect({
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

data.forget('age')
console.log(data.all())
// {
//   name: 'John',
//   email: 'john@example.com'
// }

// Array example
const numbers = collect([1, 2, 3, 4, 5])
numbers.forget(2) // Remove index 2
console.log(numbers.all())
// [1, 2, 4, 5]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
  apiKey: string
}

const user = collect<User>({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashed_password',
  apiKey: 'secret_key'
})

// Remove sensitive information
user.forget('password')
user.forget('apiKey')

console.log(user.all())
// {
//   id: 1,
//   name: 'John Doe',
//   email: 'john@example.com'
// }
```

### Real-world Examples

#### Form Data Cleaning

```typescript
interface FormData {
  username: string
  password: string
  confirmPassword: string
  temporaryToken: string
  [key: string]: string
}

function cleanFormData(data: FormData) {
  const formData = collect(data)

  // Remove confirmation fields and temporary data
  formData.forget('confirmPassword')
  formData.forget('temporaryToken')

  return formData.all()
}

const rawFormData = {
  username: 'johndoe',
  password: 'secret123',
  confirmPassword: 'secret123',
  temporaryToken: 'abc123'
}

console.log(cleanFormData(rawFormData))
// {
//   username: 'johndoe',
//   password: 'secret123'
// }
```

#### Cache Management

```typescript
interface CacheItem {
  key: string
  value: any
  expiry: number
}

class CacheManager {
  private cache = collect<{ [key: string]: CacheItem }>({})

  public set(key: string, value: any, expiryMinutes: number) {
    this.cache.put(key, {
      key,
      value,
      expiry: Date.now() + (expiryMinutes * 60 * 1000)
    })
  }

  public cleanup() {
    const now = Date.now()
    this.cache.each((item, key) => {
      if (item.expiry < now) {
        this.cache.forget(key)
      }
    })
  }
}

// Usage
const cache = new CacheManager()
cache.set('user:1', { name: 'John' }, 5)
// ... later
cache.cleanup()
```

### Advanced Usage

#### State Management

```typescript
interface AppState {
  user: object | null
  settings: object
  tempData: object
  errors: string[]
}

class StateManager {
  private state = collect<AppState>({
    user: null,
    settings: {},
    tempData: {},
    errors: []
  })

  public clearUserData() {
    this.state.forget('user')
    this.state.forget('tempData')
  }

  public clearErrors() {
    this.state.forget('errors')
  }

  public getState() {
    return this.state.all()
  }
}
```

#### Request Data Processing

```typescript
interface RequestData {
  body: object
  headers: object
  meta: object
  internal: object
}

function sanitizeRequest(request: RequestData) {
  const data = collect(request)

  // Remove internal processing data
  data.forget('internal')

  // Remove specific headers
  const headers = collect(data.get('headers'))
  headers.forget('authorization')
  headers.forget('cookie')

  return data.all()
}
```

### Type Safety

```typescript
interface TypedObject {
  required: string
  optional?: string
  sensitive: string
}

const typed = collect<TypedObject>({
  required: 'value',
  optional: 'value',
  sensitive: 'secret'
})

// TypeScript ensures type safety
typed.forget('sensitive') // ✓ Valid
typed.forget('optional') // ✓ Valid
// typed.forget('nonexistent') // ✗ TypeScript error
```

### Working with Arrays

```typescript
const array = collect(['a', 'b', 'c', 'd', 'e'])

// Remove by index
array.forget(2)
console.log(array.all()) // ['a', 'b', 'd', 'e']

// Remove multiple indices
array.forget(0)
array.forget(2)
console.log(array.all()) // ['b', 'd']
```

## Return Value

- Returns the collection instance (this allows for method chaining)
- Modifies the collection in place by removing the specified key/index
- If the key doesn't exist, the collection remains unchanged
