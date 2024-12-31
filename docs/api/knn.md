# knn Method

The `knn()` method (k-Nearest Neighbors) finds the k closest items to a given point based on specified features. It uses Euclidean distance to calculate similarity between points, making it useful for recommendation systems and similarity searches.

## Basic Syntax

```typescript
knn<K extends keyof T>(
  point: { [P in K]?: T[P] },
  k: number,
  features: ReadonlyArray<K> | K[]
): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const products = collect([
  { id: 1, price: 100, rating: 4.5 },
  { id: 2, price: 150, rating: 4.2 },
  { id: 3, price: 90, rating: 4.7 },
  { id: 4, price: 200, rating: 4.0 }
])

// Find 2 products most similar to target
const similar = products.knn(
  { price: 95, rating: 4.6 },
  2,
  ['price', 'rating']
)
```

### Similarity Search

```typescript
interface Item {
  id: string
  category: string
  price: number
  weight: number
  dimensions: number[]
}

const inventory = collect<Item>([
  {
    id: 'A1',
    category: 'electronics',
    price: 999,
    weight: 2.5,
    dimensions: [30, 20, 2]
  },
  // ... more items
])

const similarItems = inventory.knn(
  { price: 1000, weight: 2.3 },
  5,
  ['price', 'weight']
)
```

### Real-world Example: E-commerce Recommendation System

```typescript
interface Product {
  productId: string
  name: string
  price: number
  rating: number
  salesVolume: number
  category: string
}

class ProductRecommender {
  private products: CollectionOperations<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  getSimilarProducts(
    targetProduct: Product,
    count: number = 5
  ): CollectionOperations<Product> {
    return this.products
      .where('category', targetProduct.category)
      .knn(
        {
          price: targetProduct.price,
          rating: targetProduct.rating,
          salesVolume: targetProduct.salesVolume
        },
        count,
        ['price', 'rating', 'salesVolume']
      )
  }

  getRecommendationsByPrice(
    budget: number,
    category: string
  ): CollectionOperations<Product> {
    return this.products
      .where('category', category)
      .knn(
        { price: budget },
        3,
        ['price']
      )
  }
}

// Usage example
const recommender = new ProductRecommender([
  {
    productId: 'LAPTOP1',
    name: 'Pro Laptop',
    price: 1299,
    rating: 4.5,
    salesVolume: 1000,
    category: 'Electronics'
  },
  {
    productId: 'LAPTOP2',
    name: 'Budget Laptop',
    price: 699,
    rating: 4.2,
    salesVolume: 1500,
    category: 'Electronics'
  },
  {
    productId: 'LAPTOP3',
    name: 'Gaming Laptop',
    price: 1499,
    rating: 4.7,
    salesVolume: 800,
    category: 'Electronics'
  }
])
```

## Return Value

- Returns a collection of k nearest neighbors
- Ordered by proximity to target point
- Maintains original item structure
- Excludes exact matches if present
- Handles missing feature values
- Preserves type safety of original collection

## Common Use Cases

1. Product Recommendations
   - Similar product suggestions
   - Price-based recommendations
   - Feature-based matching
   - Category recommendations

2. Customer Segmentation
   - Similar customer grouping
   - Behavior analysis
   - Target audience identification
   - User similarity matching

3. Price Analysis
   - Competitive pricing
   - Price range suggestions
   - Market positioning
   - Value comparison

4. Inventory Management
   - Similar item identification
   - Stock substitutions
   - Product categorization
   - Warehouse organization

5. Search Enhancement
   - Similar item search
   - Alternative suggestions
   - Related product finding
   - Search result ranking
