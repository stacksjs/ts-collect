# Filtering & Searching

Filter and search through collections with powerful query methods.

## Overview

ts-collect provides comprehensive filtering and searching capabilities to find exactly the data you need.

## filter

Filter items based on a condition:

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5, 6])

const evens = numbers.filter((n) => n % 2 === 0)
// Collection([2, 4, 6])

// Filter with index
const firstThree = numbers.filter((n, i) => i < 3)
// Collection([1, 2, 3])
```

## where

Filter by property value:

```typescript
const users = collect([
  { name: 'John', role: 'admin', active: true },
  { name: 'Jane', role: 'user', active: true },
  { name: 'Bob', role: 'user', active: false },
])

const admins = users.where('role', 'admin')
// Collection([{ name: 'John', role: 'admin', active: true }])

const activeUsers = users.where('active', true)
```

## whereIn

Filter by multiple values:

```typescript
const products = collect([
  { id: 1, category: 'electronics' },
  { id: 2, category: 'clothing' },
  { id: 3, category: 'electronics' },
  { id: 4, category: 'food' },
])

const filtered = products.whereIn('category', ['electronics', 'clothing'])
// Collection([items with electronics or clothing])
```

## whereBetween

Filter by range:

```typescript
const products = collect([
  { name: 'A', price: 10 },
  { name: 'B', price: 25 },
  { name: 'C', price: 50 },
  { name: 'D', price: 100 },
])

const midRange = products.whereBetween('price', [20, 60])
// Collection([{ name: 'B', ... }, { name: 'C', ... }])
```

## first & last

Find first or last matching item:

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
])

const firstUser = users.first()
// { id: 1, name: 'John' }

const jane = users.first((u) => u.name === 'Jane')
// { id: 2, name: 'Jane' }

const lastUser = users.last()
// { id: 3, name: 'Bob' }
```

## search

Find the index of an item:

```typescript
const items = collect(['apple', 'banana', 'orange'])

const index = items.search('banana')
// 1

const notFound = items.search('grape')
// false
```

## contains

Check if collection contains a value:

```typescript
const numbers = collect([1, 2, 3, 4, 5])

numbers.contains(3) // true
numbers.contains(10) // false

// With callback
const users = collect([{ name: 'John' }, { name: 'Jane' }])
users.contains((u) => u.name === 'John') // true
```

## reject

Inverse of filter:

```typescript
const numbers = collect([1, 2, 3, 4, 5, 6])

const odds = numbers.reject((n) => n % 2 === 0)
// Collection([1, 3, 5])
```

## unique

Get unique values:

```typescript
const numbers = collect([1, 2, 2, 3, 3, 3, 4])

const unique = numbers.unique()
// Collection([1, 2, 3, 4])

// Unique by property
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'John' },
  { id: 3, name: 'Jane' },
])

const uniqueNames = users.unique('name')
// Collection([{ id: 1, name: 'John' }, { id: 3, name: 'Jane' }])
```
