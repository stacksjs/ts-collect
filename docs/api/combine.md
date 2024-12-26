# Combine Method

The `combine()` method combines the values of the collection with the given array of keys to create a new collection of key-value pairs. This is particularly useful when you have separate arrays for keys and values that you want to merge into an object.

## Basic Syntax

```typescript
collect(values).combine(keys)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const keys = ['name', 'age', 'city']
const values = ['John Doe', 25, 'New York']

const combined = collect(values).combine(keys)
console.log(combined.all())
// {
//   name: 'John Doe',
//   age: 25,
//   city: 'New York'
// }
```

### With Type Safety

```typescript
interface Person {
  name: string
  age: number
  email: string
}

const keys = ['name', 'age', 'email']
const values = ['Jane Smith', 30, 'jane@example.com']

const combined = collect<string | number>(values)
  .combine(keys) as Collection<Person>

console.log(combined.all())
// {
//   name: 'Jane Smith',
//   age: 30,
//   email: 'jane@example.com'
// }
```

### Real-world Examples

#### Form Data Processing

```typescript
const formFields = ['username', 'email', 'password']
const userInput = ['johndoe', 'john@example.com', 'secret123']

const formData = collect(userInput).combine(formFields)
console.log(formData.all())
// {
//   username: 'johndoe',
//   email: 'john@example.com',
//   password: 'secret123'
// }
```

#### API Response Transformation

```typescript
interface ApiUser {
  id: string
  displayName: string
  role: string
}

const fields = ['id', 'displayName', 'role']
const userData = ['12345', 'John Developer', 'admin']

const apiUser = collect(userData)
  .combine(fields) as Collection<ApiUser>

console.log(apiUser.all())
// {
//   id: '12345',
//   displayName: 'John Developer',
//   role: 'admin'
// }
```

### Working with Different Types

```typescript
interface ProductInfo {
  name: string
  price: number
  inStock: boolean
}

const productKeys = ['name', 'price', 'inStock']
const productValues = ['Laptop', 999.99, true]

const product = collect(productValues)
  .combine(productKeys) as Collection<ProductInfo>

console.log(product.all())
// {
//   name: 'Laptop',
//   price: 999.99,
//   inStock: true
// }
```

### Database Record Creation

```typescript
interface DbRecord {
  id: number
  title: string
  created_at: string
  updated_at: string
}

const columns = ['id', 'title', 'created_at', 'updated_at']
const values = [1, 'New Post', '2024-01-01', '2024-01-01']

const dbRecord = collect(values)
  .combine(columns) as Collection<DbRecord>

console.log(dbRecord.all())
// {
//   id: 1,
//   title: 'New Post',
//   created_at: '2024-01-01',
//   updated_at: '2024-01-01'
// }
```

### Working with Arrays

```typescript
const headers = ['Date', 'Value', 'Category']
const dataRows = [
  ['2024-01-01', 100, 'A'],
  ['2024-01-02', 200, 'B'],
  ['2024-01-03', 300, 'C']
]

const formattedData = collect(dataRows).map((row) => {
  return collect(row).combine(headers).all()
})

console.log(formattedData.all())
// [
//   { Date: '2024-01-01', Value: 100, Category: 'A' },
//   { Date: '2024-01-02', Value: 200, Category: 'B' },
//   { Date: '2024-01-03', Value: 300, Category: 'C' }
// ]
```

### Handling Mismatched Lengths

```typescript
const keys = ['a', 'b', 'c']
const values = [1, 2] // One less value than keys

const combined = collect(values).combine(keys)
console.log(combined.all())
// {
//   a: 1,
//   b: 2,
//   c: undefined
// }
```

### Chaining with Other Methods

```typescript
interface UserSettings {
  theme: string
  notifications: boolean
  language: string
}

const settingKeys = ['theme', 'notifications', 'language']
const defaultValues = ['light', true, 'en']

const settings = collect(defaultValues)
  .combine(settingKeys)
  .map((value, key) => {
    if (key === 'theme')
      return `${value}-mode`
    return value
  }) as Collection<UserSettings>

console.log(settings.all())
// {
//   theme: 'light-mode',
//   notifications: true,
//   language: 'en'
// }
```

## Type Safety

```typescript
// Ensuring type safety with interfaces
interface Config {
  port: number
  host: string
  debug: boolean
}

const configKeys = ['port', 'host', 'debug']
const configValues = [3000, 'localhost', true]

const config = collect(configValues)
  .combine(configKeys) as Collection<Config>

// TypeScript now knows about the types
const port: number = config.get('port')
const host: string = config.get('host')
const debug: boolean = config.get('debug')
```

## Return Value

Returns a new Collection instance containing an object with the combined keys and values. If there are more keys than values, the extra keys will be assigned undefined values.
