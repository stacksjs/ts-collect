# Flatten Method

The `flatten()` method flattens a multi-dimensional collection into a single dimension. You can optionally specify the depth level to flatten, with infinite depth being the default.

## Basic Syntax

```typescript
// Default (infinite depth)
collect(items).flatten()

// With specific depth
const depth: number // optional
collect(items).flatten(depth)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const array = collect([1, [2, 3], [4, [5, 6]]])
console.log(array.flatten().all())
// [1, 2, 3, 4, 5, 6]

// With specific depth
const arrayWithDepth = collect([1, [2, 3], [4, [5, 6]]])
console.log(arrayWithDepth.flatten(1).all())
// [1, 2, 3, 4, [5, 6]]
```

### Working with Objects

```typescript
interface NestedData {
  id: number
  items: any[]
}

const data = collect<NestedData[]>([
  {
    id: 1,
    items: ['a', 'b']
  },
  {
    id: 2,
    items: ['c', ['d', 'e']]
  }
])

const flattened = data.pluck('items').flatten()
console.log(flattened.all())
// ['a', 'b', 'c', 'd', 'e']
```

### Real-world Examples

#### Menu Structure

```typescript
interface MenuItem {
  id: number
  name: string
  subItems?: MenuItem[]
}

const menu = collect<MenuItem[]>([
  {
    id: 1,
    name: 'Home',
    subItems: [
      { id: 2, name: 'Dashboard' },
      { id: 3, name: 'Profile' }
    ]
  },
  {
    id: 4,
    name: 'Products',
    subItems: [
      { id: 5, name: 'List' },
      {
        id: 6,
        name: 'Categories',
        subItems: [
          { id: 7, name: 'Electronics' },
          { id: 8, name: 'Books' }
        ]
      }
    ]
  }
])

// Flatten menu structure for sitemap
const flatMenu = menu.pluck('name').flatten()
console.log(flatMenu.all())
// ['Home', 'Dashboard', 'Profile', 'Products', 'List', 'Categories', 'Electronics', 'Books']
```

#### Category Hierarchy

```typescript
interface Category {
  id: number
  name: string
  subcategories?: Category[]
}

const categories = collect<Category[]>([
  {
    id: 1,
    name: 'Electronics',
    subcategories: [
      {
        id: 2,
        name: 'Computers',
        subcategories: [
          { id: 3, name: 'Laptops' },
          { id: 4, name: 'Desktops' }
        ]
      },
      { id: 5, name: 'Phones' }
    ]
  }
])

// Get all category names in a flat list
function getAllCategoryNames(cats: Category[]): string[] {
  return collect(cats)
    .map(cat => [
      cat.name,
      cat.subcategories ? getAllCategoryNames(cat.subcategories) : []
    ])
    .flatten()
    .all()
}

console.log(getAllCategoryNames(categories.all()))
// ['Electronics', 'Computers', 'Laptops', 'Desktops', 'Phones']
```

### Advanced Usage

#### Nested Comments System

```typescript
interface Comment {
  id: number
  text: string
  replies?: Comment[]
}

const comments = collect<Comment[]>([
  {
    id: 1,
    text: 'Parent comment 1',
    replies: [
      {
        id: 2,
        text: 'Reply 1',
        replies: [
          { id: 3, text: 'Nested reply 1' }
        ]
      }
    ]
  },
  {
    id: 4,
    text: 'Parent comment 2',
    replies: [
      { id: 5, text: 'Reply 2' }
    ]
  }
])

// Flatten comments to get all texts
const allComments = comments
  .map(comment => [
    comment.text,
    comment.replies ? collect(comment.replies).pluck('text').all() : []
  ])
  .flatten(Infinity)

console.log(allComments.all())
// [
//   'Parent comment 1',
//   'Reply 1',
//   'Nested reply 1',
//   'Parent comment 2',
//   'Reply 2'
// ]
```

### Working with Mixed Types

```typescript
const mixedData = collect([
  1,
  ['a', 'b', [2, 3]],
  [{ id: 1 }, [{ id: 2 }]],
  new Set([1, 2, 3])
])

const flattened = mixedData.flatten()
console.log(flattened.all())
// [1, 'a', 'b', 2, 3, { id: 1 }, { id: 2 }, 1, 2, 3]
```

## Type Safety

```typescript
// Type-safe flattening with interfaces
interface NestedItem<T> {
  value: T
  children?: NestedItem<T>[]
}

const nestedNumbers = collect<NestedItem<number>[]>([
  {
    value: 1,
    children: [
      { value: 2 },
      { value: 3, children: [{ value: 4 }] }
    ]
  }
])

// Extract and flatten values
const values = nestedNumbers
  .map(item => [
    item.value,
    item.children ? collect(item.children).pluck('value').all() : []
  ])
  .flatten()

console.log(values.all())
// [1, 2, 3, 4]
```

## Return Value

- Returns a new Collection instance with the flattened items
- The original nested structure is preserved in the original collection
- The depth of flattening can be controlled with the optional depth parameter
