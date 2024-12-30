# MapToGroups Method

The `mapToGroups()` method transforms each item in the collection into a key-value pair and groups the values by their keys. Each group is itself a collection, allowing for further chaining of operations on the grouped results.

## Basic Syntax

```typescript
mapToGroups<K extends keyof T | string | number, V>(
  callback: (item: T) => [K, V]
): Map<K, CollectionOperations<V>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', role: 'admin' },
  { id: 2, name: 'Avery', role: 'user' },
  { id: 3, name: 'Buddy', role: 'admin' }
])

const groupedByRole = users.mapToGroups(user => [
  user.role,
  user.name
])

console.log([...groupedByRole.entries()])
// [
//   ['admin', Collection(['Chris', 'Buddy'])],
//   ['user', Collection(['Avery'])]
// ]
```

### Working with Complex Objects

```typescript
interface Order {
  id: string
  customerId: string
  total: number
  items: number
}

const orders = collect<Order>([
  { id: 'A1', customerId: 'C1', total: 100, items: 2 },
  { id: 'A2', customerId: 'C2', total: 200, items: 3 },
  { id: 'A3', customerId: 'C1', total: 150, items: 1 }
])

const ordersByCustomer = orders.mapToGroups(order => [
  order.customerId,
  {
    orderId: order.id,
    total: order.total,
    itemCount: order.items
  }
])

// Access grouped data
ordersByCustomer.get('C1')?.sum('total') // 250
```

### Real-world Example: E-commerce Order Analysis

```typescript
interface PurchaseOrder {
  id: string
  customerId: string
  customerName: string
  total: number
  status: 'pending' | 'shipped' | 'delivered'
  date: Date
}

class OrderAnalyzer {
  private orders: Collection<PurchaseOrder>

  constructor(orders: PurchaseOrder[]) {
    this.orders = collect(orders)
  }

  getCustomerOrderStats() {
    return this.orders.mapToGroups(order => [
      order.customerId,
      {
        customer: order.customerName,
        orderValue: order.total,
        date: order.date,
        status: order.status
      }
    ]).map((group, customerId) => ({
      customerId,
      totalOrders: group.count(),
      totalSpent: group.sum('orderValue'),
      averageOrderValue: group.avg('orderValue'),
      lastOrder: group.max('date'),
      pendingOrders: group.where('status', 'pending').count()
    }))
  }

  getMonthlyOrdersByCustomer() {
    return this.orders.mapToGroups(order => [
      `${order.customerId}-${order.date.getMonth() + 1}`,
      {
        month: order.date.getMonth() + 1,
        value: order.total
      }
    ])
  }
}
```

## Type Safety

```typescript
interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
}

const transactions = collect<Transaction>([
  { id: 'T1', type: 'credit', amount: 100 },
  { id: 'T2', type: 'debit', amount: 50 }
])

// Type-safe grouping
const groupedByType = transactions.mapToGroups<'credit' | 'debit', number>(
  tx => [tx.type, tx.amount]
)

// TypeScript enforces type safety
groupedByType.get('credit')?.sum() // Type-safe operations on groups
```

## Return Value

- Returns a Map where:
  - Keys are of type K (string, number, or keyof T)
  - Values are Collections of type V
- Each group is a full Collection instance
- Supports all Collection operations on grouped results
- Maintains type safety through generics
- Groups are lazily evaluated when accessed
- Empty groups are automatically handled

## Common Use Cases

### 1. Customer Analysis

- Grouping orders by customer
- Analyzing purchase patterns
- Customer segmentation
- Loyalty tracking
- Behavior analysis

### 2. Inventory Management

- Grouping products by category
- Stock level analysis
- Supplier management
- Location-based grouping
- Reorder tracking

### 3. Sales Reporting

- Revenue by category
- Sales by region
- Performance by period
- Commission calculations
- Target tracking

### 4. Order Processing

- Status-based grouping
- Fulfillment management
- Shipping optimization
- Priority handling
- Batch processing

### 5. Financial Analysis

- Transaction categorization
- Revenue grouping
- Expense tracking
- Budget analysis
- Cost center grouping
