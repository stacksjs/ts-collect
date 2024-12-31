# ToElastic Method

The `toElastic()` method transforms collection data into a format suitable for Elasticsearch bulk indexing operations. It creates an object containing the index name and a body structured for bulk API operations.

## Basic Syntax

```typescript
toElastic(index: string): Record<string, any>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const products = collect([
  { id: 1, name: 'Pro Laptop', price: 999.99 },
  { id: 2, name: 'Wireless Mouse', price: 49.99 }
])

const bulkData = products.toElastic('products')
console.log(bulkData)
// {
//   index: 'products',
//   body: [
//     { index: { _index: 'products' } },
//     { id: 1, name: 'Pro Laptop', price: 999.99 },
//     { index: { _index: 'products' } },
//     { id: 2, name: 'Wireless Mouse', price: 49.99 }
//   ]
// }
```

### Working with Complex Objects

```typescript
interface Product {
  sku: string
  name: string
  price: number
  metadata: {
    category: string
    tags: string[]
  }
  inventory: {
    inStock: boolean
    quantity: number
  }
}

const products = collect<Product>([{
  sku: 'LAPTOP1',
  name: 'Pro Laptop',
  price: 999.99,
  metadata: {
    category: 'Electronics',
    tags: ['laptop', 'professional', 'high-performance']
  },
  inventory: {
    inStock: true,
    quantity: 10
  }
}])

const bulkData = products.toElastic('catalog')
```

### Real-world Example: E-commerce Search Index Generation

```typescript
interface ProductData {
  id: string
  name: string
  description: string
  brand: string
  price: number
  categories: string[]
  attributes: Record<string, any>
  searchData: {
    keywords: string[]
    searchableText: string
  }
}

class SearchIndexGenerator {
  private products: Collection<ProductData>

  constructor(products: ProductData[]) {
    this.products = collect(products)
  }

  generateBulkIndex(indexName: string = 'products') {
    // Prepare products for indexing
    const enrichedProducts = this.products.map(product => ({
      ...product,
      // Add computed fields for search
      searchData: {
        ...product.searchData,
        allText: this.generateSearchableText(product),
        categoryHierarchy: this.buildCategoryHierarchy(product.categories)
      },
      // Add metadata
      indexedAt: new Date().toISOString()
    }))

    return enrichedProducts.toElastic(indexName)
  }

  generateAliasUpdate(indexName: string) {
    const timestamp = new Date().getTime()
    const newIndex = `${indexName}_${timestamp}`
    const bulkData = this.generateBulkIndex(newIndex)

    return {
      bulkData,
      aliasActions: {
        actions: [
          { remove: { index: '*', alias: indexName } },
          { add: { index: newIndex, alias: indexName } }
        ]
      }
    }
  }

  private generateSearchableText(product: ProductData): string {
    return [
      product.name,
      product.description,
      product.brand,
      ...product.categories,
      ...product.searchData.keywords,
      Object.values(product.attributes).join(' ')
    ].join(' ').toLowerCase()
  }

  private buildCategoryHierarchy(categories: string[]): string[] {
    const hierarchy: string[] = []
    let path = ''

    categories.forEach(category => {
      path = path ? `${path}/${category}` : category
      hierarchy.push(path)
    })

    return hierarchy
  }
}

// Usage
const indexGenerator = new SearchIndexGenerator([
  {
    id: 'P1',
    name: 'Professional Laptop',
    description: 'High-performance laptop for professionals',
    brand: 'TechBrand',
    price: 999.99,
    categories: ['Electronics', 'Computers', 'Laptops'],
    attributes: {
      processor: 'Intel i7',
      ram: '16GB',
      storage: '512GB SSD'
    },
    searchData: {
      keywords: ['laptop', 'professional', 'computer'],
      searchableText: 'professional laptop computer high performance'
    }
  }
])

const bulkIndexing = indexGenerator.generateBulkIndex()
const aliasUpdate = indexGenerator.generateAliasUpdate('products')
```

## Type Safety

```typescript
interface Document {
  id: string
  content: string
}

const docs = collect<Document>([
  { id: 'doc1', content: 'Test content' }
])

// Type-safe Elasticsearch bulk format generation
const bulkData: Record<string, any> = docs.toElastic('docs')

// Index name must be a string
// docs.toElastic(123) // ✗ TypeScript error
```

## Return Value

- Returns an object containing:
  - `index`: The specified index name
  - `body`: Array alternating between operation and document
- Properly formats nested objects
- Preserves array values
- Handles all JSON types
- Empty body if collection is empty
- Maintains object references

## Common Use Cases

### 1. Search Integration

- Product search
- Content indexing
- Document search
- Full-text search
- Catalog indexing

### 2. Data Indexing

- Bulk indexing
- Data updates
- Index creation
- Document management
- Content management

### 3. Search Optimization

- Search enhancement
- Index optimization
- Query improvement
- Relevance tuning
- Performance optimization

### 4. Data Migration

- Index migration
- Data reindexing
- Version updates
- Schema changes
- Data transformation

### 5. Search Management

- Index management
- Alias management
- Version control
- Rollback support
- Index maintenance
