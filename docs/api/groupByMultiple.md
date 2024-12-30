# groupByMultiple Method

The `groupByMultiple()` method groups collection items by multiple keys, creating composite groups. Returns a Map where keys are combined key values separated by '::' and values are collections of matching items.

## Basic Syntax

```typescript
collect(items).groupByMultiple(...keys: K[]): Map<string, Collection<T>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple grouping by multiple fields
const items = collect([
  { category: 'A', status: 'active', type: '1' },
  { category: 'A', status: 'inactive', type: '2' },
  { category: 'B', status: 'active', type: '1' }
])

const grouped = items.groupByMultiple('category', 'status')
// Map(3) {
//   'A::active' => Collection[{category: 'A', status: 'active', type: '1'}],
//   'A::inactive' => Collection[{category: 'A', status: 'inactive', type: '2'}],
//   'B::active' => Collection[{category: 'B', status: 'active', type: '1'}]
// }
```

### Working with Objects

```typescript
interface Product {
  id: string
  category: string
  brand: string
  status: 'active' | 'discontinued'
}

const products = collect<Product>([
  { id: '1', category: 'electronics', brand: 'Apple', status: 'active' },
  { id: '2', category: 'electronics', brand: 'Samsung', status: 'active' },
  { id: '3', category: 'electronics', brand: 'Apple', status: 'discontinued' }
])

// Group by category and brand
const groupedProducts = products.groupByMultiple('category', 'brand', 'status')
```

### Real-world Examples

#### Product Analytics System

```typescript
interface SalesData {
  productId: string
  category: string
  region: string
  channel: string
  revenue: number
  units: number
}

class SalesAnalyzer {
  constructor(private sales: Collection<SalesData>) {}

  getSegmentedAnalysis(): Map<string, {
    revenue: number
    units: number
    averageOrderValue: number
  }> {
    const grouped = this.sales.groupByMultiple('category', 'region', 'channel')
    const analysis = new Map()

    grouped.forEach((segment, key) => {
      analysis.set(key, {
        revenue: segment.sum('revenue'),
        units: segment.sum('units'),
        averageOrderValue: segment.avg('revenue')
      })
    })

    return analysis
  }

  getTopPerformingSegments(limit: number = 5): Array<{
    segment: string
    metrics: {
      revenue: number
      units: number
    }
  }> {
    const analysis = this.getSegmentedAnalysis()

    return Array.from(analysis.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, limit)
      .map(([segment, metrics]) => ({
        segment,
        metrics: {
          revenue: metrics.revenue,
          units: metrics.units
        }
      }))
  }
}
```

#### Inventory Management System

```typescript
interface InventoryItem {
  sku: string
  warehouse: string
  zone: string
  category: string
  quantity: number
  reorderPoint: number
}

class InventoryManager {
  constructor(private inventory: Collection<InventoryItem>) {}

  getStockLevelsByLocation(): Map<string, {
    totalQuantity: number
    itemsNeedingReorder: number
    utilizationRate: number
  }> {
    const grouped = this.inventory.groupByMultiple('warehouse', 'zone', 'category')
    const analysis = new Map()

    grouped.forEach((items, location) => {
      const totalQuantity = items.sum('quantity')
      const itemsNeedingReorder = items
        .filter(item => item.quantity <= item.reorderPoint)
        .count()

      analysis.set(location, {
        totalQuantity,
        itemsNeedingReorder,
        utilizationRate: this.calculateUtilization(items)
      })
    })

    return analysis
  }

  findLowStockLocations(): Array<{
    location: string
    items: InventoryItem[]
  }> {
    const grouped = this.inventory.groupByMultiple('warehouse', 'zone')
    const lowStock: Array<{location: string, items: InventoryItem[]}> = []

    grouped.forEach((items, location) => {
      const needingReorder = items
        .filter(item => item.quantity <= item.reorderPoint)
        .toArray()

      if (needingReorder.length > 0) {
        lowStock.push({
          location,
          items: needingReorder
        })
      }
    })

    return lowStock
  }

  private calculateUtilization(items: Collection<InventoryItem>): number {
    const totalCapacity = items.count() * 100 // Example capacity calculation
    const currentStock = items.sum('quantity')
    return (currentStock / totalCapacity) * 100
  }
}
```

### Advanced Usage

#### Customer Segmentation System

```typescript
interface CustomerData {
  id: string
  region: string
  segment: string
  industry: string
  spendingTier: 'low' | 'medium' | 'high'
  engagementLevel: 'active' | 'inactive'
}

class CustomerSegmentAnalyzer {
  constructor(private customers: Collection<CustomerData>) {}

  analyzeSegments(): {
    segments: Map<string, CustomerData[]>
    metrics: Map<string, {
      count: number
      activeRatio: number
      spendingDistribution: Record<string, number>
    }>
  } {
    const segments = this.customers.groupByMultiple(
      'region',
      'segment',
      'industry',
      'spendingTier'
    )

    const metrics = new Map()

    segments.forEach((customers, segmentKey) => {
      metrics.set(segmentKey, {
        count: customers.count(),
        activeRatio: this.calculateActiveRatio(customers),
        spendingDistribution: this.calculateSpendingDistribution(customers)
      })
    })

    return {
      segments,
      metrics
    }
  }

  findHighValueSegments(): Array<{
    segment: string
    customers: CustomerData[]
    metrics: {
      totalCustomers: number
      activeCustomers: number
      highSpendingRatio: number
    }
  }> {
    const segments = this.customers.groupByMultiple('region', 'industry')
    const highValue: Array<{
      segment: string
      customers: CustomerData[]
      metrics: any
    }> = []

    segments.forEach((customers, segment) => {
      const activeHighSpending = customers.filter(c =>
        c.engagementLevel === 'active' &&
        c.spendingTier === 'high'
      ).count()

      const ratio = activeHighSpending / customers.count()

      if (ratio > 0.3) { // 30% threshold for high-value segment
        highValue.push({
          segment,
          customers: customers.toArray(),
          metrics: {
            totalCustomers: customers.count(),
            activeCustomers: customers
              .where('engagementLevel', 'active')
              .count(),
            highSpendingRatio: ratio
          }
        })
      }
    })

    return highValue
  }

  private calculateActiveRatio(customers: Collection<CustomerData>): number {
    const active = customers
      .where('engagementLevel', 'active')
      .count()
    return active / customers.count()
  }

  private calculateSpendingDistribution(
    customers: Collection<CustomerData>
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0
    }

    customers.groupBy('spendingTier')
      .forEach((group, tier) => {
        distribution[tier] = group.count() / customers.count()
      })

    return distribution
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  category: string
  subCategory: string
  status: 'active' | 'inactive'
}

const items = collect<TypedItem>([
  { id: 1, category: 'A', subCategory: 'X', status: 'active' },
  { id: 2, category: 'A', subCategory: 'Y', status: 'inactive' }
])

// Type-safe multiple grouping
const grouped: Map<string, Collection<TypedItem>> = items.groupByMultiple(
  'category',
  'subCategory',
  'status'
)

// TypeScript enforces valid keys
// items.groupByMultiple('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a Map with composite keys and Collection values
- Composite keys are joined with '::'
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Groups maintain original item references

## Common Use Cases

### 1. Product Organization

- Category hierarchies
- Stock management
- Pricing structures
- Feature grouping
- Variant organization

### 2. Sales Analysis

- Multi-dimensional analysis
- Performance tracking
- Revenue grouping
- Channel analysis
- Market segmentation

### 3. Inventory Management

- Location tracking
- Stock categorization
- Supply organization
- Storage optimization
- Distribution management

### 4. Customer Segmentation

- Market analysis
- Behavior grouping
- Profile categorization
- Targeting analysis
- Preference grouping

### 5. Order Processing

- Status tracking
- Fulfillment grouping
- Shipping organization
- Priority management
- Process categorization

### 6. Performance Analytics

- Multi-metric analysis
- Trend grouping
- Pattern recognition
- Comparison analysis
- Benchmark grouping

### 7. Content Management

- Category organization
- Tag grouping
- Status tracking
- Access management
- Version control

### 8. User Management

- Role organization
- Permission grouping
- Access control
- Activity tracking
- Profile management

### 9. Reporting Systems

- Data organization
- Metric grouping
- Result categorization
- Analysis structuring
- Comparison grouping

### 10. Resource Management

- Allocation tracking
- Usage categorization
- Availability grouping
- Capacity management
- Distribution analysis
