# Has Method

The `has()` method determines if one or more keys exists in the collection. It returns true if all specified keys exist in the collection.

## Basic Syntax

```typescript
// Check single key
collect(items).has(key: keyof T)

// Check multiple keys
collect(items).has(keys: (keyof T)[])
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect({
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

console.log(data.has('name')) // true
console.log(data.has(['name', 'age'])) // true
console.log(data.has(['name', 'phone'])) // false
```

### Working with Arrays

```typescript
const array = collect(['a', 'b', 'c'])

console.log(array.has(0)) // true
console.log(array.has([0, 1])) // true
console.log(array.has(5)) // false
```

### Real-world Examples

#### Form Validation

```typescript
interface FormData {
  username: string
  email: string
  password?: string
  confirmPassword?: string
}

function validateRegistrationForm(data: FormData) {
  const form = collect(data)

  // Check required fields
  const hasRequired = form.has([
    'username',
    'email',
    'password',
    'confirmPassword'
  ])

  if (!hasRequired) {
    throw new Error('Missing required fields')
  }

  return true
}

// Usage
const validForm = {
  username: 'john_doe',
  email: 'john@example.com',
  password: 'secret',
  confirmPassword: 'secret'
}

const invalidForm = {
  username: 'john_doe',
  email: 'john@example.com'
}

console.log(validateRegistrationForm(validForm)) // true
// validateRegistrationForm(invalidForm)            // throws Error
```

#### Configuration Validation

```typescript
interface DatabaseConfig {
  host: string
  port: number
  username?: string
  password?: string
  options?: object
}

function validateDatabaseConfig(config: DatabaseConfig) {
  const conf = collect(config)

  // Check required configuration
  const hasRequiredConfig = conf.has(['host', 'port'])

  // Check authentication config
  const hasAuthConfig = !conf.has('username') || conf.has(['username', 'password'])

  return hasRequiredConfig && hasAuthConfig
}

// Usage
const validConfig = {
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'secret'
}

const invalidConfig = {
  host: 'localhost',
  username: 'admin' // Missing port and password
}

console.log(validateDatabaseConfig(validConfig)) // true
console.log(validateDatabaseConfig(invalidConfig)) // false
```

### Advanced Usage

#### API Request Validation

```typescript
interface ApiRequest {
  method: string
  headers: {
    'authorization'?: string
    'content-type'?: string
    'accept'?: string
  }
  body?: object
}

class RequestValidator {
  private requiredHeaders: string[] = ['authorization', 'content-type']

  validateRequest(request: ApiRequest) {
    const headers = collect(request.headers)

    // Check if all required headers are present
    if (!headers.has(this.requiredHeaders)) {
      throw new Error('Missing required headers')
    }

    // Additional validation for POST requests
    if (request.method === 'POST') {
      if (!collect(request).has('body')) {
        throw new Error('POST requests must include a body')
      }
    }

    return true
  }
}
```

#### Feature Flags

```typescript
interface FeatureFlags {
  darkMode?: boolean
  betaFeatures?: boolean
  notifications?: {
    email?: boolean
    push?: boolean
  }
}

class FeatureManager {
  private features: Collection<FeatureFlags>

  constructor(features: FeatureFlags) {
    this.features = collect(features)
  }

  hasFeature(feature: string): boolean {
    return this.features.has(feature)
  }

  hasAllFeatures(features: string[]): boolean {
    return this.features.has(features)
  }

  canEnableNotifications(): boolean {
    return this.features.has(['notifications'])
      && collect(this.features.get('notifications')).has(['email', 'push'])
  }
}
```

### Type Safety

```typescript
interface TypedObject {
  required: string
  optional?: string
  nested?: {
    value: number
  }
}

const typed = collect<TypedObject>({
  required: 'value',
  nested: {
    value: 42
  }
})

// TypeScript ensures type safety
console.log(typed.has('required')) // ✓ Valid
console.log(typed.has(['required', 'nested'])) // ✓ Valid
// typed.has('nonexistent')                 // ✗ TypeScript error
```

## Return Value

- Returns `true` if:
  - Single key exists in the collection
  - All specified keys exist in the collection (when checking multiple keys)
- Returns `false` if:
  - Single key doesn't exist in the collection
  - Any of the specified keys don't exist (when checking multiple keys)
