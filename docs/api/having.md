# Having Method

The `having()` method filters grouped data based on aggregate conditions, similar to SQL HAVING clause.

## Basic Syntax

```typescript
having<K extends keyof T>(key: K, op: string, value: any): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const orders = collect([
  { category: 'electronics', amount: 1000 },
  { category: 'books', amount: 50 }
])

const highValueCategories = orders
  .groupBy('category')
  .having('amount', '>', 500)
```

### Real-world Example: E-commerce Analytics

```typescript
interface OrderData {
  categoryId: string
  revenue: number
  quantity: number
  date: Date
}

class SalesAnalyzer {
  private orders: Collection<OrderData>

  constructor(orders: OrderData[]) {
    this.orders = collect(orders)
  }

  findHighPerformingCategories() {
    return this.orders
      .groupBy('categoryId')
      .having('revenue', '>=', 10000)
      .map(group => ({
        categoryId: group.first()?.categoryId,
        totalRevenue: group.sum('revenue'),
        orderCount: group.count()
      }))
  }

  getPopularCategories(minOrders: number) {
    return this.orders
      .groupBy('categoryId')
      .having('quantity', '>=', minOrders)
      .sortBy('quantity', 'desc')
  }

  analyzePerformance() {
    return {
      highRevenue: this.orders
        .groupBy('categoryId')
        .having('revenue', '>', 50000)
        .all(),

      highVolume: this.orders
        .groupBy('categoryId')
        .having('quantity', '>', 1000)
        .all(),

      lowPerforming: this.orders
        .groupBy('categoryId')
        .having('revenue', '<', 1000)
        .all()
    }
  }
}

// Usage
const analyzer = new SalesAnalyzer([
  {
    categoryId: 'C1',
    revenue: 12000,
    quantity: 100,
    date: new Date()
  }
])

const highPerforming = analyzer.findHighPerformingCategories()
const popular = analyzer.getPopularCategories(50)
```

## Supported Operators

- `>`: Greater than
- `<`: Less than
- `>=`: Greater than or equal
- `<=`: Less than or equal
- `=`: Equal
- `!=`: Not equal

## Return Value

- Returns filtered Collection
- Preserves grouping structure
- Maintains original types
- Chain-friendly operations
- Handles null values
- Type-safe comparisons

## Common Use Cases

### 1. Sales Analysis

- Revenue thresholds
- Order volumes
- Category performance
- Customer segments
- Product analysis

### 2. Performance Metrics

- KPI thresholds
- Goal achievement
- Performance filters
- Metric analysis
- Target tracking

### 3. Inventory Management

- Stock thresholds
- Movement rates
- Category analysis
- Supply levels
- Demand patterns

### 4. Customer Analysis

- Spending levels
- Order frequency
- Segment analysis
- Value thresholds
- Behavior patterns

### 5. Business Intelligence

- Performance filters
- Threshold analysis
- Group filtering
- Metric comparison
- Data segmentation
