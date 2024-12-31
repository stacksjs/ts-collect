# PivotTable Method

The `pivotTable()` method creates a two-dimensional pivot table by organizing data across row and column dimensions, with values aggregated using the specified operation. The result is a nested Map structure representing the pivot table.

## Basic Syntax

```typescript
pivotTable<R extends keyof T, C extends keyof T, V extends keyof T>(
  rows: R,
  cols: C,
  values: V,
  aggregation: 'sum' | 'avg' | 'count'
): Map<T[R], Map<T[C], number>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const sales = collect([
  { product: 'Laptop', region: 'North', revenue: 1000 },
  { product: 'Laptop', region: 'South', revenue: 1200 },
  { product: 'Mouse', region: 'North', revenue: 100 }
])

const pivot = sales.pivotTable(
  'product',    // Rows
  'region',     // Columns
  'revenue',    // Values
  'sum'         // Aggregation
)

// Results in:
// Laptop | North: 1000 | South: 1200
// Mouse  | North: 100  | South: 0
```

### Working with Complex Data

```typescript
interface SalesData {
  category: string
  salesPerson: string
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  units: number
  revenue: number
}

const salesData = collect<SalesData>([
  {
    category: 'Electronics',
    salesPerson: 'Chris',
    quarter: 'Q1',
    units: 10,
    revenue: 10000
  },
  {
    category: 'Electronics',
    salesPerson: 'Avery',
    quarter: 'Q1',
    units: 15,
    revenue: 15000
  }
])

// Sales by Category and Quarter
const quarterlyRevenue = salesData.pivotTable(
  'category',
  'quarter',
  'revenue',
  'sum'
)

// Sales Performance by Person and Category
const salesPerformance = salesData.pivotTable(
  'salesPerson',
  'category',
  'units',
  'sum'
)
```

### Real-world Example: E-commerce Sales Analysis

```typescript
interface OrderData {
  productId: string
  category: string
  region: string
  channel: string
  revenue: number
  quantity: number
  date: Date
}

class SalesAnalyzer {
  private orders: Collection<OrderData>

  constructor(orders: OrderData[]) {
    this.orders = collect(orders)
  }

  getCategoryPerformanceByRegion() {
    return this.orders.pivotTable(
      'category',
      'region',
      'revenue',
      'sum'
    )
  }

  getChannelPerformance() {
    const pivot = this.orders.pivotTable(
      'channel',
      'category',
      'revenue',
      'sum'
    )

    return Array.from(pivot.entries()).map(([channel, categoryData]) => ({
      channel,
      categories: Object.fromEntries(categoryData),
      totalRevenue: Array.from(categoryData.values())
        .reduce((sum, value) => sum + value, 0)
    }))
  }

  getQuarterlySalesByCategory() {
    const withQuarter = this.orders.map(order => ({
      ...order,
      quarter: `Q${Math.floor(order.date.getMonth() / 3) + 1}`
    }))

    return collect(withQuarter).pivotTable(
      'category',
      'quarter',
      'revenue',
      'avg'
    )
  }

  formatPivotTable(
    pivot: Map<string, Map<string, number>>,
    formatter: (value: number) => string = n => n.toString()
  ) {
    const rows: string[][] = []
    const columns = new Set<string>()

    // Get all column headers
    pivot.forEach((columnData) => {
      columnData.forEach((_, col) => columns.add(col))
    })

    // Add header row
    const headers = ['', ...Array.from(columns)]
    rows.push(headers)

    // Add data rows
    pivot.forEach((columnData, rowHeader) => {
      const row = [rowHeader]
      columns.forEach(col => {
        const value = columnData.get(col) || 0
        row.push(formatter(value))
      })
      rows.push(row)
    })

    return rows
  }
}

// Usage
const analyzer = new SalesAnalyzer([
  {
    productId: 'P1',
    category: 'Electronics',
    region: 'North',
    channel: 'Online',
    revenue: 1000,
    quantity: 1,
    date: new Date('2024-01-15')
  },
  {
    productId: 'P2',
    category: 'Electronics',
    region: 'South',
    channel: 'Retail',
    revenue: 1500,
    quantity: 2,
    date: new Date('2024-02-15')
  }
])

const categoryRevenue = analyzer.getCategoryPerformanceByRegion()
const formattedTable = analyzer.formatPivotTable(
  categoryRevenue,
  value => `$${value.toLocaleString()}`
)
```

## Type Safety

```typescript
interface Data {
  department: string
  employee: string
  sales: number
  rating: string  // non-numeric field
}

const data = collect<Data>([
  { department: 'Sales', employee: 'Chris', sales: 1000, rating: 'A' },
  { department: 'Sales', employee: 'Avery', sales: 1500, rating: 'B' }
])

// Type-safe pivot table creation
const salesPivot = data.pivotTable(
  'department',
  'employee',
  'sales',     // Must be numeric for 'sum' or 'avg'
  'sum'
)

// TypeScript enforces numeric values for sum/avg
// data.pivotTable('department', 'employee', 'rating', 'sum')  // ✗ TypeScript error
```

## Return Value

- Returns a nested Map structure:
  - Outer Map: Row values to inner Maps
  - Inner Maps: Column values to aggregated numbers
- Missing combinations get:
  - 0 for 'sum'
  - 0 for 'count'
  - undefined for 'avg'
- Maintains type safety
- Preserves field types
- Enforces numeric values for aggregation

## Common Use Cases

### 1. Sales Analysis

- Region performance
- Product categories
- Sales channels
- Time periods
- Team performance

### 2. Inventory Analysis

- Stock by location
- Category distribution
- Supplier analysis
- Seasonal patterns
- Movement rates

### 3. Performance Metrics

- Employee metrics
- Department goals
- Regional targets
- Time comparisons
- Success rates

### 4. Customer Analysis

- Segment behavior
- Geographic trends
- Channel preferences
- Product affinities
- Time patterns

### 5. Financial Analysis

- Revenue breakdowns
- Cost centers
- Budget analysis
- Profit margins
- Investment returns
