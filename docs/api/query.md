# Query Method

The `query()` method allows SQL-like filtering of collections using a simplified SQL syntax with parameterized queries.

## Basic Syntax

```typescript
query(sql: string, params: any[] = []): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', role: 'admin' },
  { id: 2, name: 'Avery', role: 'user' }
])

// Simple where clause
const admins = users.query('where role = ?', ['admin'])

// Multiple conditions
const results = users.query(
  'where role = ? and id > ?',
  ['user', 1]
)
```

### Using Parameters

```typescript
const products = collect([
  { id: 1, price: 100, category: 'electronics' },
  { id: 2, price: 50, category: 'books' }
])

// Price range query
const filtered = products.query(
  'where price >= ? and price <= ?',
  [50, 150]
)

// Category with dynamic value
const category = 'electronics'
const electronics = products.query(
  'where category = ${category}'
)
```

### Real-world Example: E-commerce Query Builder

```typescript
interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  tags: string[]
}

class ProductQueryBuilder {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  findAvailableProducts(filters: {
    minPrice?: number
    maxPrice?: number
    category?: string
    minStock?: number
  }) {
    const conditions: string[] = []
    const params: any[] = []

    if (filters.minPrice !== undefined) {
      conditions.push('price >= ?')
      params.push(filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      conditions.push('price <= ?')
      params.push(filters.maxPrice)
    }

    if (filters.category) {
      conditions.push('category = ?')
      params.push(filters.category)
    }

    if (filters.minStock !== undefined) {
      conditions.push('stock >= ?')
      params.push(filters.minStock)
    }

    const whereClause = conditions.length > 0
      ? 'where ' + conditions.join(' and ')
      : ''

    return this.products.query(whereClause, params)
  }

  searchProducts(term: string, options: {
    inStock?: boolean
    maxPrice?: number
  } = {}) {
    let sql = 'where name like ${term} or category like ${term}'

    if (options.inStock) {
      sql += ' and stock > 0'
    }

    if (options.maxPrice !== undefined) {
      sql += ' and price <= ?'
      return this.products.query(sql, [options.maxPrice])
    }

    return this.products.query(sql)
  }
}

// Usage
const queryBuilder = new ProductQueryBuilder([
  {
    id: 'P1',
    name: 'Laptop',
    price: 999,
    category: 'electronics',
    stock: 10,
    tags: ['computer', 'tech']
  }
])

const results = queryBuilder.findAvailableProducts({
  minPrice: 500,
  maxPrice: 1000,
  category: 'electronics',
  minStock: 5
})

const searchResults = queryBuilder.searchProducts('laptop', {
  inStock: true,
  maxPrice: 1000
})
```

## Parameters

- `sql`: SQL-like query string with where clause
- `params`: Array of parameter values for ? placeholders
- Supports template literals with ${variable} syntax

## Return Value

- Returns filtered Collection
- Maintains original types
- Preserves collection methods
- Handles null values
- Type-safe operations
- Chain-friendly

## Common Use Cases

### 1. Data Filtering

- Complex conditions
- Dynamic filters
- Range queries
- Pattern matching
- Multi-field filters

### 2. Search Operations

- Product search
- User filtering
- Content queries
- Record lookup
- Data exploration

### 3. Dynamic Queries

- User-defined filters
- Dynamic conditions
- Runtime queries
- Flexible search
- Custom filtering

### 4. Data Analysis

- Subset selection
- Condition testing
- Data exploration
- Pattern matching
- Relationship queries

### 5. Business Rules

- Inventory filtering
- Order selection
- User filtering
- Content moderation
- Access control
