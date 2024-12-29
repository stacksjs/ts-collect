# pipe Method

The `pipe()` method passes the collection through a callback and returns the callback's result, allowing you to transform the collection into any value. Unlike `tap()`, `pipe()` can change the type of the data and is often used at the end of collection processing chains.

## Basic Syntax

```typescript
collect(items).pipe(callback: (collection: Collection<T>) => U): U
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Transform collection to a number
const numbers = collect([1, 2, 3, 4, 5])
const sum = numbers.pipe(collection => collection.sum())
console.log(sum) // 15

// Transform collection to an object
const items = collect(['a', 'b', 'c'])
const result = items.pipe(collection => ({
  count: collection.count(),
  items: collection.all(),
  first: collection.first()
}))
console.log(result)
// { count: 3, items: ['a', 'b', 'c'], first: 'a' }
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget', price: 100, stock: 5 },
  { id: 2, name: 'Gadget', price: 200, stock: 10 }
])

// Transform to inventory summary
const summary = products.pipe(collection => ({
  totalProducts: collection.count(),
  totalValue: collection.sum('price'),
  averagePrice: collection.avg('price'),
  totalStock: collection.sum('stock'),
  outOfStock: collection.where('stock', 0).count()
}))
```

### Real-world Examples

#### Order Summary Generator

```typescript
interface Order {
  id: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  status: 'pending' | 'completed' | 'cancelled'
  customerType: 'regular' | 'vip'
}

interface OrderSummary {
  totalOrders: number
  totalValue: number
  averageOrderValue: number
  itemsSold: number
  vipOrders: number
  ordersByStatus: Record<string, number>
}

class OrderAnalyzer {
  generateSummary(orders: Collection<Order>): OrderSummary {
    return orders.pipe(collection => ({
      totalOrders: collection.count(),
      totalValue: collection.sum(order =>
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      ),
      averageOrderValue: collection.avg(order =>
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      ),
      itemsSold: collection.sum(order =>
        order.items.reduce((sum, item) => sum + item.quantity, 0)
      ),
      vipOrders: collection.where('customerType', 'vip').count(),
      ordersByStatus: collection
        .groupBy('status')
        .map(group => group.count())
        .all()
    }))
  }
}
```

#### Inventory Report Generator

```typescript
interface StockItem {
  sku: string
  name: string
  quantity: number
  reorderPoint: number
  location: string
  lastRestocked: Date
}

interface InventoryReport {
  date: Date
  totalItems: number
  totalStock: number
  lowStockItems: string[]
  stockByLocation: Record<string, number>
  reorderNeeded: {
    sku: string
    quantity: number
    daysLastRestocked: number
  }[]
}

class InventoryReporter {
  generateReport(inventory: Collection<StockItem>): InventoryReport {
    const today = new Date()

    return inventory.pipe(collection => ({
      date: today,
      totalItems: collection.count(),
      totalStock: collection.sum('quantity'),
      lowStockItems: collection
        .filter(item => item.quantity <= item.reorderPoint)
        .pluck('sku')
        .all(),
      stockByLocation: collection
        .groupBy('location')
        .map(group => group.sum('quantity'))
        .all(),
      reorderNeeded: collection
        .filter(item => item.quantity <= item.reorderPoint)
        .map(item => ({
          sku: item.sku,
          quantity: item.reorderPoint - item.quantity,
          daysLastRestocked: Math.floor(
            (today.getTime() - new Date(item.lastRestocked).getTime()) /
            (1000 * 60 * 60 * 24)
          )
        }))
        .all()
    }))
  }
}
```

### Advanced Usage

#### Sales Performance Analyzer

```typescript
interface SaleRecord {
  id: string
  date: Date
  amount: number
  category: string
  salesPerson: string
  region: string
}

interface SalesAnalysis {
  topPerformers: Array<{
    salesPerson: string
    totalSales: number
    averageTransaction: number
  }>
  categoryPerformance: Record<string, {
    total: number
    count: number
    average: number
  }>
  regionalBreakdown: Record<string, {
    revenue: number
    transactions: number
    topCategory: string
  }>
}

class SalesAnalyzer {
  analyzeSales(sales: Collection<SaleRecord>): SalesAnalysis {
    return sales.pipe(collection => ({
      topPerformers: collection
        .groupBy('salesPerson')
        .map((sales, person) => ({
          salesPerson: person,
          totalSales: sales.sum('amount'),
          averageTransaction: sales.avg('amount')
        }))
        .sortByDesc('totalSales')
        .take(5)
        .all(),

      categoryPerformance: collection
        .groupBy('category')
        .map((sales, category) => ({
          [category]: {
            total: sales.sum('amount'),
            count: sales.count(),
            average: sales.avg('amount')
          }
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),

      regionalBreakdown: collection
        .groupBy('region')
        .map((sales, region) => ({
          [region]: {
            revenue: sales.sum('amount'),
            transactions: sales.count(),
            topCategory: sales
              .groupBy('category')
              .map((catSales, cat) => ({
                category: cat,
                total: catSales.sum('amount')
              }))
              .sortByDesc('total')
              .first()
              ?.category || ''
          }
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    }))
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  price: number
  stock: number
}

const products = collect<TypedProduct>([
  { id: 1, price: 100, stock: 5 },
  { id: 2, price: 200, stock: 10 }
])

// Type-safe transformation
interface Summary {
  total: number
  average: number
}

const summary: Summary = products.pipe(collection => ({
  total: collection.sum('price'),
  average: collection.avg('price')
}))

// TypeScript enforces return type
// const invalid: string = products.pipe(...)  // ✗ TypeScript error
```

## Return Value

- Returns the result of the callback function
- Can return any type (not limited to collections)
- Return type is inferred by TypeScript
- Original collection remains unchanged
- Callback receives the full collection
- Useful for final transformations

## Common Use Cases

### 1. Report Generation

- Creating summaries
- Generating analytics
- Building dashboards
- Producing statistics
- Formatting data

### 2. Data Transformation

- Converting formats
- Restructuring data
- Creating exports
- Building responses
- Formatting output

### 3. Analysis

- Performance metrics
- Sales analysis
- Inventory reports
- Customer insights
- Market analysis

### 4. API Responses

- Formatting responses
- Building payloads
- Creating DTOs
- Structuring data
- Preparing output

### 5. Business Intelligence

- KPI calculations
- Performance metrics
- Trend analysis
- Market insights
- Revenue reports

### 6. Export Generation

- CSV creation
- PDF preparation
- Excel formatting
- Data extraction
- Report building

### 7. Financial Reports

- Revenue summaries
- Profit calculation
- Cost analysis
- Budget reports
- Sales forecasts

### 8. Inventory Analysis

- Stock summaries
- Reorder reports
- Location analysis
- Movement tracking
- Availability reports

### 9. Customer Analytics

- Behavior analysis
- Purchase patterns
- Segment reports
- Loyalty metrics
- Engagement data

### 10. Performance Metrics

- Sales performance
- Employee metrics
- Product analysis
- Service levels
- Efficiency reports
