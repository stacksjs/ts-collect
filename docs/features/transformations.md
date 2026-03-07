# Transformation Methods

Transform collection data with powerful, chainable methods.

## Overview

ts-collect provides a rich set of transformation methods inspired by Laravel Collections, allowing you to reshape and transform data fluently.

## map

Transform each item in the collection:

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
])

const names = users.map((user) => user.name)
// Collection(['John', 'Jane'])

const formatted = users.map((user, index) => ({
  id: index + 1,
  displayName: `${user.name} (${user.age})`,
}))
```

## flatMap

Map and flatten in one operation:

```typescript
const orders = collect([
  { id: 1, items: ['apple', 'banana'] },
  { id: 2, items: ['orange', 'grape'] },
])

const allItems = orders.flatMap((order) => order.items)
// Collection(['apple', 'banana', 'orange', 'grape'])
```

## pluck

Extract a single property from each item:

```typescript
const users = collect([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
])

const emails = users.pluck('email')
// Collection(['john@example.com', 'jane@example.com'])

// Pluck with key
const emailById = users.pluck('email', 'id')
// Collection({ 1: 'john@example.com', 2: 'jane@example.com' })
```

## transform

Transform the collection in place:

```typescript
const numbers = collect([1, 2, 3])

numbers.transform((n) => n * 2)
// numbers is now Collection([2, 4, 6])
```

## mapWithKeys

Create key-value pairs:

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])

const byId = users.mapWithKeys((user) => [user.id, user])
// Collection({ 1: { id: 1, name: 'John' }, 2: { id: 2, name: 'Jane' } })
```

## mapToGroups

Group items by a computed key:

```typescript
const users = collect([
  { name: 'John', department: 'Sales' },
  { name: 'Jane', department: 'Engineering' },
  { name: 'Bob', department: 'Sales' },
])

const byDepartment = users.mapToGroups((user) => [
  user.department,
  user.name,
])
// Collection({ Sales: ['John', 'Bob'], Engineering: ['Jane'] })
```

## chunk

Split into smaller collections:

```typescript
const numbers = collect([1, 2, 3, 4, 5, 6, 7])

const chunks = numbers.chunk(3)
// Collection([
//   Collection([1, 2, 3]),
//   Collection([4, 5, 6]),
//   Collection([7])
// ])
```

## collapse

Flatten a collection of arrays:

```typescript
const nested = collect([[1, 2], [3, 4], [5]])

const flat = nested.collapse()
// Collection([1, 2, 3, 4, 5])
```

## zip

Merge collections together:

```typescript
const names = collect(['John', 'Jane'])
const ages = collect([30, 25])

const zipped = names.zip(ages)
// Collection([['John', 30], ['Jane', 25]])
```
