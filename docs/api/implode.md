# Implode Method

The `implode()` method combines the values of a specified key from each item in the collection into a single string, with an optional separator between elements. This is particularly useful for creating delimited strings from object collections.

## Basic Syntax

```typescript
implode<K extends keyof T>(key: K, separator: string = ''): string
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris' },
  { id: 2, name: 'Avery' },
  { id: 3, name: 'Buddy' }
])

console.log(users.implode('name', ', '))
// "Chris, Avery, Buddy"

const ids = users.implode('id', '-')
console.log(ids)
// "1-2-3"
```

### Working with Objects

```typescript
interface Tag {
  id: number
  name: string
  slug: string
}

const tags = collect<Tag>([
  { id: 1, name: 'Electronics', slug: 'electronics' },
  { id: 2, name: 'Computers', slug: 'computers' },
  { id: 3, name: 'Accessories', slug: 'accessories' }
])

// Create URL-friendly string
const urlPath = tags.implode('slug', '/')
console.log(urlPath)
// "electronics/computers/accessories"

// Create display string
const displayTags = tags.implode('name', ' • ')
console.log(displayTags)
// "Electronics • Computers • Accessories"
```

### Real-world Example: E-commerce Product Metadata

```typescript
interface Product {
  id: string
  name: string
  categories: string[]
  tags: string[]
  sku: string
}

class ProductMetadataBuilder {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  generateSkuList(separator: string = ', '): string {
    return this.products.implode('sku', separator)
  }

  generateMetaKeywords(): string {
    // First, get unique categories and tags
    const categories = this.products
      .pluck('categories')
      .flatten()
      .unique()
      .all()

    const tags = this.products
      .pluck('tags')
      .flatten()
      .unique()
      .all()

    // Combine all keywords
    return collect([...categories, ...tags])
      .implode('name', ', ')
  }

  generateBreadcrumbMicrodata(): string {
    return this.products
      .map(product => ({
        name: product.name,
        url: `/products/${product.sku}`
      }))
      .implode('name', ' > ')
  }
}

// Usage
const products = new ProductMetadataBuilder([
  {
    id: '1',
    name: 'Pro Laptop',
    categories: ['Electronics', 'Computers'],
    tags: ['laptop', 'business', 'premium'],
    sku: 'LAPTOP-1'
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    categories: ['Electronics', 'Accessories'],
    tags: ['mouse', 'wireless', 'ergonomic'],
    sku: 'MOUSE-1'
  }
])

console.log(products.generateSkuList())
// "LAPTOP-1, MOUSE-1"
```

## Type Safety

```typescript
interface Item {
  id: number
  value: string
  count: number
}

const items = collect<Item>([
  { id: 1, value: 'first', count: 10 },
  { id: 2, value: 'second', count: 20 }
])

// Type-safe key selection
const values: string = items.implode('value', ', ')
const ids: string = items.implode('id', '-')
const counts: string = items.implode('count', ' | ')

// TypeScript enforces valid keys
// items.implode('nonexistent', ',') // ✗ TypeScript error
```

## Return Value

- Returns a single string containing all values
- Empty string if collection is empty
- Values are automatically converted to strings
- Maintains order of collection
- Optional separator between elements
- Default separator is empty string

## Common Use Cases

### 1. List Generation

- Creating comma-separated lists
- Building delimited strings
- Generating tag lists
- Category strings
- Keyword lists

### 2. URL Generation

- Path segments
- Query parameters
- Slug combinations
- Route generation
- Navigation paths

### 3. Meta Information

- Meta keywords
- Meta descriptions
- Search tags
- Category chains
- Breadcrumbs

### 4. Display Formatting

- User lists
- Product features
- Status messages
- Label combinations
- Navigation menus

### 5. Data Export

- CSV generation
- Data concatenation
- Report formatting
- Audit trails
- Log entries
