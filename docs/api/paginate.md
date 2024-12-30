# paginate Method

The `paginate()` method divides the collection into subsets for pagination. Returns a `PaginationResult` object containing the current page data and pagination metadata.

## Basic Syntax

```typescript
collect(items).paginate(perPage: number, page: number = 1): PaginationResult<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple number pagination
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const page1 = numbers.paginate(3, 1)
console.log(page1)
// {
//   data: [1, 2, 3],
//   total: 10,
//   perPage: 3,
//   currentPage: 1,
//   lastPage: 4,
//   hasMorePages: true
// }

// Default to first page
const firstPage = numbers.paginate(5)
console.log(firstPage.data)  // [1, 2, 3, 4, 5]
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
  { id: 4, name: 'Widget D', price: 400 },
  { id: 5, name: 'Widget E', price: 500 }
])

const productPage = products.paginate(2, 2)
console.log(productPage)
// {
//   data: [
//     { id: 3, name: 'Widget C', price: 300 },
//     { id: 4, name: 'Widget D', price: 400 }
//   ],
//   total: 5,
//   perPage: 2,
//   currentPage: 2,
//   lastPage: 3,
//   hasMorePages: true
// }
```

### Real-world Examples

#### Product Catalog Manager

```typescript
interface CatalogProduct {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
}

class CatalogManager {
  constructor(private products: Collection<CatalogProduct>) {}

  getProductPage(page: number = 1, perPage: number = 10): PaginationResult<CatalogProduct> {
    return this.products
      .where('inStock', true)
      .sortBy('name')
      .paginate(perPage, page)
  }

  getCategoryProducts(
    category: string,
    page: number = 1,
    perPage: number = 10
  ): PaginationResult<CatalogProduct> {
    return this.products
      .where('category', category)
      .where('inStock', true)
      .sortBy('price')
      .paginate(perPage, page)
  }

  getPaginationInfo(result: PaginationResult<CatalogProduct>): {
    pageInfo: string,
    pageRange: number[]
  } {
    return {
      pageInfo: `Showing ${result.data.count()} of ${result.total} products`,
      pageRange: Array.from(
        { length: result.lastPage },
        (_, i) => i + 1
      )
    }
  }
}
```

#### Order History Viewer

```typescript
interface Order {
  id: string
  date: Date
  status: 'pending' | 'processing' | 'completed'
  total: number
}

class OrderHistoryManager {
  constructor(private orders: Collection<Order>) {}

  getOrderHistory(
    page: number = 1,
    perPage: number = 20,
    status?: Order['status']
  ): PaginationResult<Order> {
    let filteredOrders = this.orders.sortByDesc('date')

    if (status) {
      filteredOrders = filteredOrders.where('status', status)
    }

    return filteredOrders.paginate(perPage, page)
  }

  generatePageLinks(result: PaginationResult<Order>): Array<{
    page: number
    active: boolean
    label: string
  }> {
    const links = []

    // Previous
    if (result.currentPage > 1) {
      links.push({
        page: result.currentPage - 1,
        active: false,
        label: '← Previous'
      })
    }

    // Page numbers
    for (let i = 1; i <= result.lastPage; i++) {
      links.push({
        page: i,
        active: i === result.currentPage,
        label: String(i)
      })
    }

    // Next
    if (result.hasMorePages) {
      links.push({
        page: result.currentPage + 1,
        active: false,
        label: 'Next →'
      })
    }

    return links
  }
}
```

### Advanced Usage

#### Search Results Manager

```typescript
interface SearchResult {
  id: string
  title: string
  description: string
  relevance: number
  category: string
}

class SearchResultManager {
  constructor(private results: Collection<SearchResult>) {}

  getPaginatedResults(
    options: {
      page?: number
      perPage?: number
      category?: string
      minRelevance?: number
    } = {}
  ): PaginationResult<SearchResult> {
    const {
      page = 1,
      perPage = 10,
      category,
      minRelevance = 0
    } = options

    let filtered = this.results
      .filter(result => result.relevance >= minRelevance)
      .sortByDesc('relevance')

    if (category) {
      filtered = filtered.where('category', category)
    }

    return filtered.paginate(perPage, page)
  }

  generateMetadata(result: PaginationResult<SearchResult>): {
    showing: string
    total: string
    pageCount: string
  } {
    const start = (result.currentPage - 1) * result.perPage + 1
    const end = Math.min(start + result.perPage - 1, result.total)

    return {
      showing: `Showing results ${start}-${end}`,
      total: `${result.total} total results`,
      pageCount: `Page ${result.currentPage} of ${result.lastPage}`
    }
  }

  getPageSizeOptions(result: PaginationResult<SearchResult>): number[] {
    // Generate reasonable page size options based on total results
    if (result.total <= 10) return [5, 10]
    if (result.total <= 50) return [10, 25, 50]
    return [10, 25, 50, 100]
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  name: string
  active: boolean
}

const items = collect<TypedItem>([
  { id: 1, name: 'A', active: true },
  { id: 2, name: 'B', active: false },
  { id: 3, name: 'C', active: true }
])

// Type-safe pagination
const page: PaginationResult<TypedItem> = items.paginate(2, 1)

// Access typed data
const activeItems = page.data.filter(item => item.active)
```

## Return Value (PaginationResult<T>)

```typescript
interface PaginationResult<T> {
  data: Collection<T>      // Current page items
  total: number           // Total number of items
  perPage: number        // Items per page
  currentPage: number    // Current page number
  lastPage: number       // Last page number
  hasMorePages: boolean  // Whether more pages exist
}
```

## Common Use Cases

### 1. Product Listings

- Category pages
- Search results
- Featured products
- New arrivals
- Sale items

### 2. Order Management

- Order history
- Processing queue
- Status updates
- Transaction logs
- Shipment tracking

### 3. Customer Data

- User lists
- Activity logs
- Purchase history
- Support tickets
- Reviews

### 4. Inventory Management

- Stock listings
- Location inventory
- Order items
- Product variants
- Supplier lists

### 5. Transaction History

- Payment records
- Refund history
- Credit notes
- Invoices
- Receipts

### 6. Search Results

- Product search
- Order search
- Customer search
- Content search
- Log search

### 7. Content Management

- Blog posts
- Articles
- Media gallery
- Documents
- Comments

### 8. Analytics Data

- Performance metrics
- Sales reports
- Usage statistics
- Traffic logs
- Error logs

### 9. Administrative Lists

- User accounts
- Role assignments
- Permission sets
- Audit logs
- System logs

### 10. Review Management

- Product reviews
- User feedback
- Ratings
- Comments
- Testimonials
