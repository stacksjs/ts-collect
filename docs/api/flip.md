# Flip Method

The `flip()` method swaps the collection's keys with their corresponding values. For arrays, this means the values become the keys and the array indices become the values.

## Basic Syntax

```typescript
collect(items).flip()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple key-value pairs
const data = collect({
  name: 'John',
  age: '30',
  city: 'New York'
})

console.log(data.flip().all())
// {
//   'John': 'name',
//   '30': 'age',
//   'New York': 'city'
// }
```

### Working with Arrays

```typescript
const array = collect(['a', 'b', 'c'])
console.log(array.flip().all())
// {
//   'a': 0,
//   'b': 1,
//   'c': 2
// }
```

### Real-world Examples

#### Language Translations

```typescript
interface Translations {
  [key: string]: string
}

const englishToSpanish = collect<Translations>({
  'hello': 'hola',
  'goodbye': 'adios',
  'thank you': 'gracias'
})

// Create Spanish to English translations
const spanishToEnglish = englishToSpanish.flip()
console.log(spanishToEnglish.all())
// {
//   'hola': 'hello',
//   'adios': 'goodbye',
//   'gracias': 'thank you'
// }
```

#### Status Code Mapping

```typescript
interface StatusCodes {
  [key: string]: number
}

const httpStatusCodes = collect<StatusCodes>({
  'OK': 200,
  'Created': 201,
  'Not Found': 404,
  'Server Error': 500
})

// Create reverse lookup
const statusCodeMessages = httpStatusCodes.flip()
console.log(statusCodeMessages.all())
// {
//   '200': 'OK',
//   '201': 'Created',
//   '404': 'Not Found',
//   '500': 'Server Error'
// }
```

### Advanced Usage

#### Configuration Mapping

```typescript
interface ConfigMap {
  [key: string]: string
}

const environmentVariables = collect<ConfigMap>({
  DB_HOST: 'database.host',
  DB_PORT: 'database.port',
  DB_USER: 'database.username',
  DB_PASS: 'database.password'
})

// Create reverse mapping for configuration lookup
const configToEnvMap = environmentVariables.flip()
console.log(configToEnvMap.all())
// {
//   'database.host': 'DB_HOST',
//   'database.port': 'DB_PORT',
//   'database.username': 'DB_USER',
//   'database.password': 'DB_PASS'
// }
```

#### Role Permission Mapping

```typescript
interface PermissionMap {
  [key: string]: string
}

const rolePermissions = collect<PermissionMap>({
  admin: 'all',
  editor: 'write',
  viewer: 'read'
})

// Create permission to role mapping
const permissionRoles = rolePermissions.flip()
console.log(permissionRoles.all())
// {
//   'all': 'admin',
//   'write': 'editor',
//   'read': 'viewer'
// }
```

### Working with Duplicate Values

```typescript
const dataWithDuplicates = collect({
  key1: 'value',
  key2: 'value',
  key3: 'unique'
})

// Note: When flipping, duplicate values will overwrite each other
console.log(dataWithDuplicates.flip().all())
// {
//   'value': 'key2',  // Only keeps the last occurrence
//   'unique': 'key3'
// }
```

### Practical Applications

#### File Extension Mapping

```typescript
interface MimeTypes {
  [key: string]: string
}

const mimeTypes = collect<MimeTypes>({
  html: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json'
})

// Create reverse lookup for file type detection
const extensionLookup = mimeTypes.flip()
console.log(extensionLookup.all())
// {
//   'text/html': 'html',
//   'text/css': 'css',
//   'application/javascript': 'js',
//   'application/json': 'json'
// }
```

### Type Safety

```typescript
interface TypedMap {
  [key: string]: string | number
}

const typedData = collect<TypedMap>({
  id: 1,
  name: 'John',
  age: '30'
})

// TypeScript ensures type safety
const flipped = typedData.flip()
// The resulting types are automatically inferred
```

## Return Value

Returns a new Collection instance with the keys and values flipped. Note that:

- For objects, the values become the new keys and the keys become the new values
- For arrays, the values become the keys and the indices become the values
- If there are duplicate values in the original collection, only the last occurrence will be preserved in the flipped result
- All values must be either strings or numbers to be valid as object keys
