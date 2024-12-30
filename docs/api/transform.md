# Transform Method

The `transform()` method maps each item in the collection into a new shape using a schema of transformation functions, returning a new collection with the transformed items.

## Basic Syntax

```typescript
transform<U>(schema: Record<keyof U, (item: T) => U[keyof U]>): CollectionOperations<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', age: 28, email: 'chris@example.com' },
  { name: 'Avery', age: 32, email: 'avery@example.com' }
])

const transformed = users.transform({
  displayName: item => item.name.toUpperCase(),
  isAdult: item => item.age >= 18,
  contact: item => ({ email: item.email })
})

console.log(transformed.all())
// [
//   {
//     displayName: 'CHRIS',
//     isAdult: true,
//     contact: { email: 'chris@example.com' }
//   },
//   {
//     displayName: 'AVERY',
//     isAdult: true,
//     contact: { email: 'avery@example.com' }
//   }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: string
}

interface TransformedProduct {
  sku: string
  displayName: string
  priceUSD: string
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock'
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 999.99, stock: 5, category: 'Electronics' },
  { id: 2, name: 'Headphones', price: 199.99, stock: 0, category: 'Electronics' }
])

const displayProducts = products.transform<TransformedProduct>({
  sku: item => `PROD-${item.id}`,
  displayName: item => `${item.name} (${item.category})`,
  priceUSD: item => `$${item.price.toFixed(2)}`,
  stockStatus: item => {
    if (item.stock === 0) return 'Out of Stock'
    if (item.stock < 3) return 'Low Stock'
    return 'In Stock'
  }
})
```

### Real-world Example: E-commerce Order Processing

```typescript
interface Order {
  orderId: string
  customerData: {
    name: string
    email: string
  }
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  timestamp: string
}

interface ProcessedOrder {
  reference: string
  customer: string
  totalAmount: string
  itemCount: number
  orderDate: string
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getProcessedOrders(): Collection<ProcessedOrder> {
    return this.orders.transform<ProcessedOrder>({
      reference: order => `ORD-${order.orderId}`,
      customer: order => order.customerData.name,
      totalAmount: order => {
        const total = order.items.reduce(
          (sum, item) => sum + (item.quantity * item.unitPrice),
          0
        )
        return `$${total.toFixed(2)}`
      },
      itemCount: order => order.items.reduce(
        (count, item) => count + item.quantity,
        0
      ),
      orderDate: order => new Date(order.timestamp).toLocaleDateString()
    })
  }
}
```

## Type Safety

```typescript
interface SourceData {
  id: number
  value: string
  active: boolean
}

interface TargetData {
  identifier: string
  processed: boolean
  metadata: {
    original: string
    modified: boolean
  }
}

const data = collect<SourceData>([
  { id: 1, value: 'test', active: true }
])

// Type-safe transformation
const processed = data.transform<TargetData>({
  identifier: item => `ID-${item.id}`,
  processed: item => item.active,
  metadata: item => ({
    original: item.value,
    modified: false
  })
})

// TypeScript enforces schema property types
// Incorrect return type will cause compilation error
// processed = data.transform<TargetData>({
//   identifier: item => item.id, // ✗ Type 'number' is not assignable to type 'string'
// })
```

## Return Value

- Returns a new Collection containing the transformed items
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Each item is transformed according to the provided schema
- Schema functions have access to the entire original item
- Can be chained with other collection methods

## Common Use Cases

### 1. Data Normalization

- Standardizing data formats
- Converting units
- Normalizing field names
- Restructuring nested data

### 2. API Response Processing

- Converting backend formats to frontend models
- Adding computed properties
- Removing sensitive information
- Transforming date formats

### 3. E-commerce Data Management

- Processing product information
- Formatting prices and currencies
- Computing stock status
- Generating SKUs and product codes

### 4. Report Generation

- Calculating summaries
- Formatting values for display
- Adding computed metrics
- Transforming raw data into presentable format

### 5. User Interface Preparation

- Converting data for display
- Adding display-specific properties
- Computing derived values
- Formatting dates and numbers
