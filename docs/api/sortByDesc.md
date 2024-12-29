# sortByDesc Method

The `sortByDesc()` method sorts the collection by a given key in descending order. It's a convenient shorthand for `sortBy(key, 'desc')`.

## Basic Syntax

```typescript
collect(items).sortByDesc(key: keyof T): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect([
  { id: 1, name: 'Widget', value: 100 },
  { id: 2, name: 'Gadget', value: 200 },
  { id: 3, name: 'Tool', value: 150 }
])

// Sort by value descending
const sortedByValue = items.sortByDesc('value')
console.log(sortedByValue.all())
// [
//   { id: 2, name: 'Gadget', value: 200 },
//   { id: 3, name: 'Tool', value: 150 },
//   { id: 1, name: 'Widget', value: 100 }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  rating: number
  salesCount: number
}

const products = collect<Product>([
  { id: 1, name: 'Basic Widget', price: 19.99, rating: 4.2, salesCount: 100 },
  { id: 2, name: 'Premium Widget', price: 49.99, rating: 4.8, salesCount: 50 },
  { id: 3, name: 'Budget Widget', price: 9.99, rating: 3.9, salesCount: 200 }
])

// Sort by rating descending (best rated first)
const topRated = products.sortByDesc('rating')

// Sort by sales count descending (best sellers first)
const bestSellers = products.sortByDesc('salesCount')
```

### Real-world Examples

#### Product Display Manager

```typescript
interface CatalogItem {
  id: string
  name: string
  price: number
  popularity: number
  lastUpdated: string
  stockLevel: number
}

class ProductDisplayManager {
  private products: Collection<CatalogItem>

  constructor(products: CatalogItem[]) {
    this.products = collect(products)
  }

  getMostPopular(): Collection<CatalogItem> {
    return this.products.sortByDesc('popularity')
  }

  getMostRecent(): Collection<CatalogItem> {
    return this.products.sortByDesc('lastUpdated')
  }

  getMostExpensive(): Collection<CatalogItem> {
    return this.products.sortByDesc('price')
  }

  getBestStocked(): Collection<CatalogItem> {
    return this.products.sortByDesc('stockLevel')
  }
}
```

#### Customer Analytics Manager

```typescript
interface Customer {
  id: string
  name: string
  totalSpent: number
  lastPurchase: string
  loyaltyPoints: number
  purchaseCount: number
}

class CustomerAnalytics {
  private customers: Collection<Customer>

  constructor(customers: Customer[]) {
    this.customers = collect(customers)
  }

  getTopSpenders(): Collection<Customer> {
    return this.customers.sortByDesc('totalSpent')
  }

  getMostFrequent(): Collection<Customer> {
    return this.customers.sortByDesc('purchaseCount')
  }

  getMostLoyal(): Collection<Customer> {
    return this.customers.sortByDesc('loyaltyPoints')
  }

  getMostRecent(): Collection<Customer> {
    return this.customers.sortByDesc('lastPurchase')
  }
}
```

### Advanced Usage

#### Review Management System

```typescript
interface ProductReview {
  id: string
  productId: string
  rating: number
  helpfulVotes: number
  createdAt: string
  responseCount: number
  verified: boolean
}

class ReviewManager {
  private reviews: Collection<ProductReview>

  constructor(reviews: ProductReview[]) {
    this.reviews = collect(reviews)
  }

  getMostHelpful(): Collection<ProductReview> {
    return this.reviews
      .where('verified', true)
      .sortByDesc('helpfulVotes')
      .take(10)
  }

  getHighestRated(): Collection<ProductReview> {
    return this.reviews
      .where('verified', true)
      .sortByDesc('rating')
      .take(5)
  }

  getMostDiscussed(): Collection<ProductReview> {
    return this.reviews
      .sortByDesc('responseCount')
      .take(15)
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
  score: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100, score: 4.5 },
  { id: 2, name: 'B', price: 200, score: 3.8 }
])

// Type-safe key selection
const byPrice = products.sortByDesc('price')
const byScore = products.sortByDesc('score')

// TypeScript enforces valid keys
// products.sortByDesc('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection sorted in descending order
- Original collection remains unchanged
- Handles null/undefined values appropriately
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Equivalent to sortBy(key, 'desc')

## Common Use Cases

### 1. Product Listings

- Highest price first
- Best rated products
- Most popular items
- Newest arrivals
- Highest stock levels

### 2. Customer Management

- Top spenders
- Most frequent buyers
- Highest loyalty points
- Most recent customers
- Most valuable accounts

### 3. Sales Analytics

- Highest revenue items
- Best-selling products
- Top performing categories
- Most profitable items
- Highest margin products

### 4. Review Management

- Highest rated items
- Most helpful reviews
- Most recent feedback
- Most discussed items
- Top critic reviews

### 5. Inventory Priorities

- Highest value stock
- Most critical shortages
- Fastest moving items
- Largest stock holdings
- Most recent updates

### 6. Performance Metrics

- Top performers
- Highest conversion rates
- Best ROI items
- Most efficient processes
- Highest impact changes

### 7. Content Management

- Most viewed content
- Highest engagement
- Most shared items
- Top commented
- Best performing posts

### 8. Support Prioritization

- Most urgent tickets
- Highest priority issues
- Most impacted customers
- Latest submissions
- Most complex cases

### 9. Marketing Analysis

- Most effective campaigns
- Highest click rates
- Best conversion paths
- Top referral sources
- Most valuable channels

### 10. Pricing Strategy

- Highest margins
- Most profitable items
- Best value products
- Premium offerings
- Luxury segment items
