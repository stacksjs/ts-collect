# Search Method

The `search()` method performs a text search across specified fields, supporting fuzzy matching and field weighting. It returns matching items with a score indicating relevance.

## Basic Syntax

```typescript
search<K extends keyof T>(
  query: string,
  fields: K[],
  options: {
    fuzzy?: boolean,
    weights?: Partial<Record<K, number>>
  } = {}
): CollectionOperations<T & { score: number }>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const products = collect([
  { name: 'Pro Laptop', description: 'High-performance laptop' },
  { name: 'Gaming Mouse', description: 'RGB gaming mouse' },
  { name: 'Laptop Stand', description: 'Ergonomic stand' }
])

const results = products.search('laptop', ['name', 'description'])
console.log(results.all())
// [
//   { name: 'Pro Laptop', description: '...', score: 1.0 },
//   { name: 'Laptop Stand', description: '...', score: 1.0 }
// ]
```

### Working with Fuzzy Search

```typescript
interface Product {
  sku: string
  name: string
  description: string
  category: string
}

const products = collect<Product>([
  {
    sku: 'LAPTOP1',
    name: 'Professional Laptop',
    description: 'High-end workstation laptop',
    category: 'Electronics'
  },
  {
    sku: 'MOUSE1',
    name: 'Wireless Mouse',
    description: 'Bluetooth labtop accessory',  // Misspelling
    category: 'Accessories'
  }
])

// Fuzzy search will find both due to 'laptop'/'labtop'
const results = products.search('laptop', ['name', 'description'], {
  fuzzy: true
})
```

### Real-world Example: E-commerce Search Engine

```typescript
interface ProductData {
  id: string
  name: string
  description: string
  brand: string
  category: string
  tags: string[]
}

class ProductSearchEngine {
  private products: Collection<ProductData>

  constructor(products: ProductData[]) {
    this.products = collect(products)
  }

  search(query: string, options = {}) {
    return this.products.search(
      query,
      ['name', 'description', 'brand', 'category'],
      {
        fuzzy: true,
        weights: {
          name: 2.0,      // Name matches are most important
          brand: 1.5,     // Brand matches are next
          category: 1.0,  // Category matches
          description: 0.5 // Description matches less important
        },
        ...options
      }
    )
    .filter(result => result.score > 0.3) // Minimum relevance threshold
    .sortBy('score', 'desc')
  }

  searchWithinCategory(query: string, category: string) {
    return this.search(query)
      .filter(product => product.category === category)
  }

  findSimilarProducts(productId: string) {
    const product = this.products
      .where('id', productId)
      .first()

    if (!product) return collect([])

    return this.products
      .search(
        `${product.name} ${product.category}`,
        ['name', 'category', 'tags'],
        { fuzzy: true }
      )
      .filter(p => p.id !== productId) // Exclude original product
      .take(5) // Top 5 similar products
  }
}

// Usage
const searchEngine = new ProductSearchEngine([
  {
    id: 'P1',
    name: 'Pro Laptop 15"',
    description: 'Professional grade laptop',
    brand: 'TechBrand',
    category: 'Laptops',
    tags: ['professional', 'laptop', '15-inch']
  },
  {
    id: 'P2',
    name: 'Gaming Laptop 17"',
    description: 'High-performance gaming laptop',
    brand: 'TechBrand',
    category: 'Laptops',
    tags: ['gaming', 'laptop', '17-inch']
  }
])

const results = searchEngine.search('pro laptop')
```

## Type Safety

```typescript
interface SearchableItem {
  title: string
  content: string
  metadata?: {
    author: string
  }
}

const items = collect<SearchableItem>([
  {
    title: 'Hello World',
    content: 'Welcome to our blog',
    metadata: { author: 'Chris' }
  }
])

// Type-safe field selection
const results = items.search(
  'hello',
  ['title', 'content'],
  { weights: { title: 2.0, content: 1.0 } }
)

// TypeScript enforces valid field names
// items.search('test', ['invalid']) // ✗ TypeScript error
// Invalid weight field
// items.search('test', ['title'], { weights: { invalid: 1 } }) // ✗ TypeScript error
```

## Return Value

- Returns Collection of items with added score property
- Score indicates match relevance (0 to 1)
- Higher scores mean better matches
- Items sorted by score by default
- Original item properties preserved
- Type information maintained

## Common Use Cases

### 1. Product Search

- Catalog search
- Product filtering
- Similar items
- Category search
- Brand search

### 2. Content Search

- Document search
- Article search
- Knowledge base
- FAQ search
- Blog search

### 3. User Search

- User directory
- Profile search
- Contact lookup
- Member search
- Staff directory

### 4. Order Search

- Order lookup
- Reference search
- Status search
- History search
- Invoice search

### 5. Support Search

- Ticket search
- Issue lookup
- Help articles
- Documentation
- Solution finder
