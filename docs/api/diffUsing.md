# DiffUsing Method

The `diffUsing()` method compares the collection against another array or collection using a custom callback function. This allows for complex comparison logic when determining which items should be considered different.

## Basic Syntax

```typescript
const callback: (a: T, b: T) => boolean
collect(items).diffUsing(array, callback)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

interface Item {
  id: number
  value: string
}

const collection = collect<Item>([
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
  { id: 3, value: 'c' }
])

const comparison = [
  { id: 1, value: 'a' },
  { id: 2, value: 'x' },
  { id: 4, value: 'd' }
]

const diff = collection.diffUsing(comparison, (a, b) => a.id === b.id)
console.log(diff.all())
// [
//   { id: 3, value: 'c' }
// ]
```

### Complex Comparisons

```typescript
interface User {
  id: number
  email: string
  permissions: string[]
}

const currentUsers = collect<User>([
  { id: 1, email: 'john@example.com', permissions: ['read', 'write'] },
  { id: 2, email: 'jane@example.com', permissions: ['read'] },
  { id: 3, email: 'bob@example.com', permissions: ['admin'] }
])

const newUsers = [
  { id: 1, email: 'john@example.com', permissions: ['read'] },
  { id: 2, email: 'jane@example.com', permissions: ['read'] },
  { id: 4, email: 'alice@example.com', permissions: ['read'] }
]

// Compare users based on both ID and permissions
const diff = currentUsers.diffUsing(newUsers, (a, b) =>
  a.id === b.id
  && JSON.stringify(a.permissions) === JSON.stringify(b.permissions))

console.log(diff.all())
// [
//   { id: 1, email: 'john@example.com', permissions: ['read', 'write'] },
//   { id: 3, email: 'bob@example.com', permissions: ['admin'] }
// ]
```

### Real-world Examples

#### Version Comparison

```typescript
interface Version {
  major: number
  minor: number
  patch: number
  label?: string
}

const installedVersions = collect<Version>([
  { major: 1, minor: 0, patch: 0 },
  { major: 1, minor: 1, patch: 0 },
  { major: 2, minor: 0, patch: 0, label: 'beta' }
])

const availableVersions = [
  { major: 1, minor: 0, patch: 0 },
  { major: 1, minor: 1, patch: 1 },
  { major: 2, minor: 0, patch: 0 }
]

const needsUpdate = installedVersions.diffUsing(availableVersions, (a, b) => {
  return a.major === b.major
    && a.minor === b.minor
    && a.patch === b.patch
    && (!a.label === !b.label)
})

console.log(needsUpdate.all())
// [
//   { major: 2, minor: 0, patch: 0, label: 'beta' }
// ]
```

#### Document Change Detection

```typescript
interface Document {
  id: string
  title: string
  content: string
  metadata: {
    author: string
    lastModified: string
  }
}

const originalDocs = collect<Document>([
  {
    id: '1',
    title: 'Hello',
    content: 'World',
    metadata: { author: 'John', lastModified: '2024-01-01' }
  },
  {
    id: '2',
    title: 'Test',
    content: 'Content',
    metadata: { author: 'Jane', lastModified: '2024-01-02' }
  }
])

const updatedDocs = [
  {
    id: '1',
    title: 'Hello',
    content: 'Updated World',
    metadata: { author: 'John', lastModified: '2024-01-03' }
  },
  {
    id: '2',
    title: 'Test',
    content: 'Content',
    metadata: { author: 'Jane', lastModified: '2024-01-02' }
  }
]

// Compare documents ignoring lastModified date
const changedDocs = originalDocs.diffUsing(updatedDocs, (a, b) => {
  return a.id === b.id
    && a.content === b.content
    && a.metadata.author === b.metadata.author
})

console.log(changedDocs.all())
// [
//   {
//     id: '1',
//     title: 'Hello',
//     content: 'World',
//     metadata: { author: 'John', lastModified: '2024-01-01' }
//   }
// ]
```

### Advanced Usage

#### Deep Object Comparison

```typescript
interface ConfigItem {
  key: string
  settings: {
    enabled: boolean
    options: string[]
    nested?: {
      value: number
    }
  }
}

const originalConfig = collect<ConfigItem>([
  {
    key: 'feature1',
    settings: {
      enabled: true,
      options: ['a', 'b'],
      nested: { value: 1 }
    }
  },
  {
    key: 'feature2',
    settings: {
      enabled: false,
      options: ['x']
    }
  }
])

const newConfig = [
  {
    key: 'feature1',
    settings: {
      enabled: true,
      options: ['a', 'b', 'c'],
      nested: { value: 1 }
    }
  },
  {
    key: 'feature2',
    settings: {
      enabled: false,
      options: ['x']
    }
  }
]

// Deep comparison ignoring specific nested properties
const diff = originalConfig.diffUsing(newConfig, (a, b) => {
  return a.key === b.key
    && a.settings.enabled === b.settings.enabled
    && JSON.stringify(a.settings.nested) === JSON.stringify(b.settings.nested)
})

console.log(diff.all())
// Shows items where the comparison returned false
```

## Type Safety

```typescript
interface TypedItem<T> {
  id: number
  value: T
}

const numbers = collect<TypedItem<number>>([
  { id: 1, value: 100 },
  { id: 2, value: 200 }
])

const comparison = [
  { id: 1, value: 100 },
  { id: 2, value: 300 }
]

// TypeScript ensures type safety in the callback
const diff = numbers.diffUsing(comparison, (a, b) => {
  return a.id === b.id && a.value === b.value
})
```

## Return Value

Returns a new Collection instance containing the items from the original collection that are considered different based on the callback function's comparison logic.
