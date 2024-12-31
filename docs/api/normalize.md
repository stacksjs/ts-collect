# normalize Method

The `normalize()` method scales numeric values in a collection using either min-max normalization (to a 0-1 range) or z-score standardization (mean 0, standard deviation 1). This is particularly useful for preparing data for analysis or machine learning.

## Basic Syntax

```typescript
normalize<K extends keyof T>(key: K, method: 'minmax' | 'zscore'): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { id: 1, value: 100 },
  { id: 2, value: 200 },
  { id: 3, value: 300 }
])

// Min-Max normalization (0-1 scale)
const minMaxNormalized = data.normalize('value', 'minmax')
// [
//   { id: 1, value: 0 },
//   { id: 2, value: 0.5 },
//   { id: 3, value: 1 }
// ]

// Z-score normalization
const zscoreNormalized = data.normalize('value', 'zscore')
// [
//   { id: 1, value: -1.224744871391589 },
//   { id: 2, value: 0 },
//   { id: 3, value: 1.224744871391589 }
// ]
```

### Multiple Field Normalization

```typescript
interface ProductMetrics {
  id: string
  price: number
  views: number
  rating: number
}

const products = collect<ProductMetrics>([
  { id: 'A1', price: 999, views: 1500, rating: 4.5 },
  { id: 'A2', price: 49, views: 500, rating: 3.8 },
  { id: 'A3', price: 299, views: 1000, rating: 4.2 }
])

const normalized = products
  .normalize('price', 'minmax')
  .normalize('views', 'minmax')
  .normalize('rating', 'zscore')
```

### Real-world Example: E-commerce Data Analysis

```typescript
interface ProductAnalytics {
  productId: string
  name: string
  price: number
  viewCount: number
  salesCount: number
  rating: number
}

class ProductScoreCalculator {
  private products: CollectionOperations<ProductAnalytics>

  constructor(products: ProductAnalytics[]) {
    this.products = collect(products)
  }

  calculatePopularityScores() {
    return this.products
      .normalize('viewCount', 'minmax')
      .normalize('salesCount', 'minmax')
      .normalize('rating', 'minmax')
      .map(product => ({
        ...product,
        popularityScore: (
          product.viewCount * 0.3 +
          product.salesCount * 0.4 +
          product.rating * 0.3
        )
      }))
      .sortByDesc('popularityScore')
  }

  getPerformanceMetrics() {
    return this.products
      .normalize('price', 'zscore')
      .normalize('salesCount', 'zscore')
      .map(product => ({
        productId: product.productId,
        name: product.name,
        pricePerformance: product.price, // Now in standard deviations
        salesPerformance: product.salesCount // Now in standard deviations
      }))
  }
}

// Usage example
const calculator = new ProductScoreCalculator([
  {
    productId: 'LAPTOP1',
    name: 'Pro Laptop',
    price: 1299,
    viewCount: 5000,
    salesCount: 100,
    rating: 4.5
  },
  {
    productId: 'MOUSE1',
    name: 'Wireless Mouse',
    price: 49,
    viewCount: 3000,
    salesCount: 500,
    rating: 4.2
  }
])
```

## Return Value

- Returns a new collection with normalized values
- Preserves original object structure
- Maintains type safety
- Handles numeric values only
- Returns original value if normalization is impossible
- Chain-able with other collection methods

## Common Use Cases

1. Machine Learning Preparation
   - Feature scaling
   - Model input normalization
   - Training data preparation
   - Algorithm preprocessing

2. Performance Scoring
   - Product rankings
   - User activity scores
   - Performance metrics
   - Comparison analysis

3. Data Visualization
   - Chart preparation
   - Graph scaling
   - Visual comparisons
   - Trend analysis

4. Statistical Analysis
   - Performance comparison
   - Outlier detection
   - Distribution analysis
   - Pattern recognition

5. Ranking Systems
   - Product recommendations
   - Search result scoring
   - Customer segmentation
   - Priority calculation
