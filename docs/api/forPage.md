# forPage Method

The `forPage()` method returns a subset of items from the collection based on page number and size. Unlike `paginate()`, it returns only the items without additional pagination metadata.

## Basic Syntax

```typescript
collect(items).forPage(page: number, perPage: number): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple number pagination
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const page2 = numbers.forPage(2, 3)
console.log(page2.all())  // [4, 5, 6]

// Get first page
const firstPage = numbers.forPage(1, 5)
console.log(firstPage.all())  // [1, 2, 3, 4, 5]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget A', price: 100 },
  { id: 2, name: 'Widget B', price: 200 },
  { id: 3, name: 'Widget C', price: 300 },
  { id: 4, name: 'Widget D', price: 400 }
])

// Get second page of products, 2 per page
const secondPage = products.forPage(2, 2)
console.log(secondPage.all())
// [
//   { id: 3, name: 'Widget C', price: 300 },
//   { id: 4, name: 'Widget D', price: 400 }
// ]
```

### Real-world Examples

#### API Response Handler

```typescript
interface ApiProduct {
  id: string
  name: string
  price: number
  category: string
}

class ProductApiHandler {
  constructor(private products: Collection<ApiProduct>) {}

  getProductsResponse(
    page: number,
    pageSize: number,
    category?: string
  ): {
    products: ApiProduct[]
    timestamp: string
  } {
    let filteredProducts = this.products

    if (category) {
      filteredProducts = filteredProducts.where('category', category)
    }

    return {
      products: filteredProducts
        .sortBy('name')
        .forPage(page, pageSize)
        .toArray(),
      timestamp: new Date().toISOString()
    }
  }

  getQuickList(page: number = 1): ApiProduct[] {
    return this.products
      .sortByDesc('price')
      .forPage(page, 10)
      .toArray()
  }
}
```

#### Simple List Provider

```typescript
interface ListItem {
  id: string
  title: string
  sortOrder: number
}

class ListProvider {
  constructor(private items: Collection<ListItem>) {}

  getPage(page: number, size: number = 20): Collection<ListItem> {
    return this.items
      .sortBy('sortOrder')
      .forPage(page, size)
  }

  getVisibleItems(page: number): Collection<ListItem> {
    const itemsPerPage = this.calculateOptimalPageSize()
    return this.items.forPage(page, itemsPerPage)
  }

  private calculateOptimalPageSize(): number {
    // Simple calculation based on total items
    const total = this.items.count()
    if (total <= 20) return 10
    if (total <= 50) return 20
    return 25
  }
}
```

### Advanced Usage

#### Dynamic Feed Generator

```typescript
interface FeedItem {
  id: string
  type: 'product' | 'article' | 'review'
  timestamp: Date
  content: unknown
}

class FeedGenerator {
  constructor(private items: Collection<FeedItem>) {}

  getFeed(options: {
    page: number
    itemsPerPage: number
    type?: FeedItem['type']
    startDate?: Date
  }): Collection<FeedItem> {
    let feed = this.items
      .sortByDesc('timestamp')

    if (options.type) {
      feed = feed.where('type', options.type)
    }

    if (options.startDate) {
      feed = feed.filter(item =>
        item.timestamp >= options.startDate
      )
    }

    return feed.forPage(options.page, options.itemsPerPage)
  }

  getTypeSpecificFeed(
    type: FeedItem['type'],
    page: number = 1
  ): Collection<FeedItem> {
    const typeSpecificSize = this.getTypeSpecificPageSize(type)

    return this.items
      .where('type', type)
      .sortByDesc('timestamp')
      .forPage(page, typeSpecificSize)
  }

  private getTypeSpecificPageSize(type: FeedItem['type']): number {
    switch (type) {
      case 'product': return 12  // Grid layout
      case 'article': return 5   // Article cards
      case 'review': return 10   // Review list
      default: return 10
    }
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  name: string
  value: number
}

const items = collect<TypedItem>([
  { id: 1, name: 'A', value: 100 },
  { id: 2, name: 'B', value: 200 },
  { id: 3, name: 'C', value: 300 }
])

// Type-safe pagination
const page: Collection<TypedItem> = items.forPage(1, 2)

// Type safety maintained in result
const values: number[] = page.pluck('value').toArray()
```

## Return Value

- Returns a new Collection containing items for the specified page
- Original collection remains unchanged
- Returns empty collection for invalid page numbers
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Preserves original item order

## Common Use Cases

### 1. API Responses

- Endpoint pagination
- Resource listing
- Data streaming
- Result limiting
- Offset-based access

### 2. Simple Lists

- Basic catalogs
- Quick views
- Preview lists
- Summary displays
- Brief overviews

### 3. Feed Generation

- Activity feeds
- News streams
- Update lists
- Timeline views
- Event logs

### 4. Resource Access

- File listings
- Media galleries
- Document lists
- Asset collections
- Resource catalogs

### 5. Preview Data

- Quick views
- Thumbnails
- Previews
- Summaries
- Snapshots

### 6. Search Results

- Quick results
- Initial findings
- Preview matches
- Top results
- Limited sets

### 7. Data Export

- Batch processing
- Chunked export
- Sectioned data
- Partial results
- Segmented output

### 8. Report Generation

- Section data
- Page breaks
- Result grouping
- Data segmentation
- Output chunking

### 9. List Management

- Simple pagination
- Basic navigation
- List segments
- Group division
- Set partitioning

### 10. Performance Optimization

- Chunked loading
- Lazy loading
- Partial rendering
- Progressive display
- Optimized viewing
