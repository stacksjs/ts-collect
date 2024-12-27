# DoesntContain Method

The `doesntContain()` method determines if a given item or value is not contained within the collection. This method is essentially the inverse of `contains()`.

## Basic Syntax

```typescript
// Check value
collect(items).doesntContain(value)

// Check using callback
collect(items).doesntContain(item => boolean)

// Check key/value pair
collect(items).doesntContain(key, value)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

console.log(numbers.doesntContain(6)) // true
console.log(numbers.doesntContain(3)) // false
console.log(numbers.doesntContain(value => value > 10)) // true
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'editor' }
])

// Check using callback
console.log(users.doesntContain(user => user.role === 'viewer')) // true
console.log(users.doesntContain(user => user.role === 'admin')) // false

// Check by property value
console.log(users.doesntContain('role', 'viewer')) // true
```

### Real-world Examples

#### Permission Checking

```typescript
interface Role {
  name: string
  permissions: string[]
}

const userRole = collect<Role>({
  name: 'editor',
  permissions: ['read', 'write', 'publish']
})

function lackPermission(permission: string): boolean {
  return collect(userRole.get('permissions'))
    .doesntContain(permission)
}

console.log(lackPermission('delete')) // true
console.log(lackPermission('read')) // false
```

#### Feature Validation

```typescript
interface Feature {
  name: string
  status: 'enabled' | 'disabled'
  version: string
}

const features = collect<Feature>([
  { name: 'search', status: 'enabled', version: '1.0.0' },
  { name: 'chat', status: 'disabled', version: '2.0.0' }
])

function isFeatureMissing(featureName: string): boolean {
  return features.doesntContain('name', featureName)
}

function lacksEnabledFeature(featureName: string): boolean {
  return features.doesntContain(feature =>
    feature.name === featureName && feature.status === 'enabled'
  )
}

console.log(isFeatureMissing('notifications')) // true
console.log(lacksEnabledFeature('chat')) // true
console.log(lacksEnabledFeature('search')) // false
```

### Validation Examples

```typescript
interface FormField {
  name: string
  type: string
  required: boolean
}

const formFields = collect<FormField>([
  { name: 'email', type: 'email', required: true },
  { name: 'name', type: 'text', required: true },
  { name: 'phone', type: 'tel', required: false }
])

function isFieldMissing(fieldName: string): boolean {
  return formFields.doesntContain('name', fieldName)
}

function missingRequiredField(fieldName: string): boolean {
  return formFields.doesntContain(field =>
    field.name === fieldName && field.required
  )
}

console.log(isFieldMissing('address')) // true
console.log(missingRequiredField('phone')) // true
console.log(missingRequiredField('email')) // false
```

### Inventory Management

```typescript
interface Product {
  id: string
  name: string
  category: string
  inStock: boolean
}

const inventory = collect<Product>([
  { id: 'A1', name: 'Laptop', category: 'Electronics', inStock: true },
  { id: 'B1', name: 'Desk', category: 'Furniture', inStock: false }
])

function isOutOfStock(productId: string): boolean {
  return inventory.doesntContain(product =>
    product.id === productId && product.inStock
  )
}

function isCategoryMissing(category: string): boolean {
  return inventory.doesntContain('category', category)
}

console.log(isOutOfStock('B1')) // true
console.log(isOutOfStock('A1')) // false
console.log(isCategoryMissing('Clothing')) // true
```

### Error Handling

```typescript
interface ErrorLog {
  code: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
}

const errorLogs = collect<ErrorLog>([
  { code: 'E001', severity: 'high', resolved: false },
  { code: 'E002', severity: 'low', resolved: true }
])

function hasNoError(errorCode: string): boolean {
  return errorLogs.doesntContain('code', errorCode)
}

function hasNoUnresolvedHighSeverity(): boolean {
  return errorLogs.doesntContain(log =>
    log.severity === 'high' && !log.resolved
  )
}

console.log(hasNoError('E003')) // true
console.log(hasNoUnresolvedHighSeverity()) // false
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  active: boolean
}

const items = collect<TypedItem>([
  { id: 1, value: 'one', active: true },
  { id: 2, value: 'two', active: false }
])

// Type-safe property checks
items.doesntContain('value', 'three') // ✓ Valid
// items.doesntContain('invalid', 'value') // ✗ TypeScript error

// Type-safe callbacks
items.doesntContain((item: TypedItem) => {
  return item.active
  // TypeScript ensures type safety in the callback
})
```

## Return Value

Returns a boolean:

- `true` if the item is not found in the collection
- `true` if no items match the callback condition
- `false` if the item is found or the callback condition is met
- When checking key/value pairs, returns `true` if no matching key-value combination is found
