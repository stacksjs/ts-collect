# KMeans Method

The `kmeans()` method performs k-means clustering on the collection, grouping items into `k` clusters based on their numeric properties. This method is particularly useful for identifying patterns and grouping similar items in datasets.

## Basic Syntax

```typescript
kmeans({
  k: number,
  maxIterations?: number,
  distanceMetric?: 'euclidean' | 'manhattan'
}): KMeansResult<T>
```

## Parameters

- `k`: Number of clusters to create
- `maxIterations`: Maximum number of iterations (default: 100)
- `distanceMetric`: Distance calculation method ('euclidean' or 'manhattan', default: 'euclidean')

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const points = collect([
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 10, y: 12 },
  { x: 11, y: 13 },
  { x: -1, y: -2 }
])

const clusters = points.kmeans({ k: 2 })

// Access cluster assignments
console.log(clusters.pluck('cluster').values())
// [0, 0, 1, 1, 0]

// Access original data with cluster assignments
console.log(clusters.all())
// [
//   { cluster: 0, data: { x: 1, y: 2 } },
//   { cluster: 0, data: { x: 2, y: 3 } },
//   { cluster: 1, data: { x: 10, y: 12 } },
//   { cluster: 1, data: { x: 11, y: 13 } },
//   { cluster: 0, data: { x: -1, y: -2 } }
// ]
```

### Working with Complex Objects

```typescript
interface CustomerBehavior {
  customerId: string
  purchaseFrequency: number
  averageOrderValue: number
  totalSpent: number
  returnsRate: number
}

const customers = collect<CustomerBehavior>([
  {
    customerId: 'C1',
    purchaseFrequency: 5,
    averageOrderValue: 100,
    totalSpent: 500,
    returnsRate: 0.1
  },
  // ... more customers
])

const segments = customers.kmeans({
  k: 3,
  maxIterations: 150,
  distanceMetric: 'euclidean'
})
```

### Real-world Example: E-commerce Customer Segmentation

```typescript
interface Customer {
  id: string
  totalOrders: number
  averageOrderValue: number
  lastPurchaseDays: number
  returnsPercentage: number
  totalSpent: number
}

class CustomerSegmentation {
  private customers: Collection<Customer>

  constructor(customers: Customer[]) {
    this.customers = collect(customers)
  }

  identifySegments(): Map<number, string> {
    const clusters = this.customers.kmeans({ k: 4 })

    // Analyze each cluster
    const segmentMap = new Map<number, string>()

    clusters.groupBy('cluster').forEach((group, clusterId) => {
      const avgValue = group.pluck('data').avg('averageOrderValue')
      const avgFrequency = group.pluck('data').avg('totalOrders')

      // Classify segments based on characteristics
      if (avgValue > 200 && avgFrequency > 10) {
        segmentMap.set(Number(clusterId), 'VIP')
      } else if (avgValue > 150) {
        segmentMap.set(Number(clusterId), 'High Value')
      } else if (avgFrequency > 5) {
        segmentMap.set(Number(clusterId), 'Frequent Buyers')
      } else {
        segmentMap.set(Number(clusterId), 'Standard')
      }
    })

    return segmentMap
  }

  getCustomerSegment(customerId: string): string {
    const clusters = this.customers.kmeans({ k: 4 })
    const customerCluster = clusters
      .where('data.id', customerId)
      .pluck('cluster')
      .first()

    const segmentMap = this.identifySegments()
    return segmentMap.get(customerCluster || 0) || 'Unknown'
  }
}
```

## Type Safety

```typescript
interface Point2D {
  x: number
  y: number
}

const points = collect<Point2D>([
  { x: 1, y: 2 },
  { x: 10, y: 12 }
])

// Type-safe clustering
const clusters = points.kmeans({ k: 2 })

// TypeScript enforces type safety for cluster results
const clusterNumbers = clusters.pluck('cluster')
const originalData = clusters.pluck('data')

// Access specific cluster
const cluster0 = clusters
  .where('cluster', 0)
  .pluck('data')
  .all()
```

## Return Value `(KMeansResult<T>)`

- Returns a specialized collection containing:
  - `cluster`: The assigned cluster number (0 to k-1)
  - `data`: The original item data
- Provides additional methods through `pluck`:
  - `pluck('cluster')`: Returns cluster assignments
  - `pluck('data')`: Returns original data points
- Maintains type safety with TypeScript
- Can be grouped, filtered, and manipulated like regular collections

## Common Use Cases

### 1. Customer Segmentation

- Identifying customer groups based on behavior
- Creating targeted marketing segments
- Analyzing spending patterns
- Personalizing customer experience

### 2. Product Categorization

- Grouping similar products
- Identifying product categories
- Organizing inventory
- Creating recommendation clusters

### 3. Inventory Management

- Identifying stock patterns
- Grouping items by demand
- Optimizing storage locations
- Analyzing product movement

### 4. Price Optimization

- Grouping products by price ranges
- Identifying pricing segments
- Analyzing price-performance clusters
- Optimizing pricing strategies

### 5. Behavioral Analysis

- Identifying usage patterns
- Grouping user behaviors
- Analyzing interaction clusters
- Detecting usage segments
