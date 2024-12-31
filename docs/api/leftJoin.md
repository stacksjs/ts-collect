# LeftJoin Method

The `leftJoin()` method performs a left outer join between two collections based on matching key values.

## Basic Syntax

```typescript
leftJoin<U, K extends keyof T, O extends keyof U>(
  other: CollectionOperations<U>,
  key: K,
  otherKey: O
): CollectionOperations<T & Partial<U>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const orders = collect([
  { id: 1, userId: 'U1', amount: 100 }
])

const users = collect([
  { id: 'U1', name: 'Chris' }
])

const ordersWithUsers = orders.leftJoin(users, 'userId', 'id')
// [
//   { id: 1, userId: 'U1', amount: 100, name: 'Chris' }
// ]
```

### Real-world Example: E-commerce Order Processing

```typescript
interface Order {
  orderId: string
  customerId: string
  total: number
}

interface Customer {
  id: string
  name: string
  tier: string
  email: string
}

class OrderEnricher {
  private orders: Collection<Order>
  private customers: Collection<Customer>

  constructor(orders: Order[], customers: Customer[]) {
    this.orders = collect(orders)
    this.customers = collect(customers)
  }

  enrichOrders() {
    return this.orders
      .leftJoin(this.customers, 'customerId', 'id')
      .map(order => ({
        orderId: order.orderId,
        total: order.total,
        customer: {
          id: order.customerId,
          name: order.name || 'Unknown',
          tier: order.tier || 'Standard',
          email: order.email
        }
      }))
  }

  generateOrderReport() {
    return this.orders
      .leftJoin(this.customers, 'customerId', 'id')
      .groupBy('tier')
      .map(group => ({
        tier: group.first()?.tier || 'Unknown',
        orderCount: group.count(),
        totalRevenue: group.sum('total'),
        averageOrder: group.avg('total')
      }))
  }
}

// Usage
const enricher = new OrderEnricher(
  [
    { orderId: 'O1', customerId: 'C1', total: 99.99 }
  ],
  [
    { id: 'C1', name: 'Chris', tier: 'Gold', email: 'chris@example.com' }
  ]
)

const enrichedOrders = enricher.enrichOrders()
const report = enricher.generateOrderReport()
```

## Type Safety

```typescript
interface Product {
  id: string
  categoryId: string
  price: number
}

interface Category {
  id: string
  name: string
}

const products = collect<Product>([
  { id: 'P1', categoryId: 'C1', price: 99.99 }
])

const categories = collect<Category>([
  { id: 'C1', name: 'Electronics' }
])

// Type-safe join
const result = products.leftJoin(
  categories,
  'categoryId',
  'id'
) // Collection<Product & Partial<Category>>
```

## Return Value

- Returns Collection with joined data
- Includes all left-side records
- Adds matching right-side fields
- Null for unmatched fields
- Maintains type safety
- Chain-friendly operations

## Common Use Cases

### 1. Data Enrichment

- Order processing
- User data
- Product details
- Category information
- Reference data

### 2. Reporting

- Sales reports
- Customer analysis
- Inventory reports
- Performance metrics
- Financial statements

### 3. Data Integration

- API responses
- Database queries
- External data
- System integration
- Data migration

### 4. Analytics

- Customer insights
- Sales analysis
- Product metrics
- Usage statistics
- Performance data

### 5. Reference Data

- Lookup tables
- Master data
- Metadata joining
- Classification data
- Relationship mapping
