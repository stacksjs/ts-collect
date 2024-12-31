# Pick Method

The `pick()` method creates a new collection where each item contains only the specified properties from the original items. This is useful for creating subset objects with only required fields.

## Basic Syntax

```typescript
pick<K extends keyof T>(...keys: K[]): CollectionOperations<Pick<T, K>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', email: 'chris@example.com', role: 'admin' },
  { id: 2, name: 'Avery', email: 'avery@example.com', role: 'user' }
])

const basicInfo = users.pick('id', 'name')
console.log(basicInfo.first())
// { id: 1, name: 'Chris' }
```

### Working with Nested Objects

```typescript
interface Product {
  sku: string
  name: string
  price: {
    amount: number
    currency: string
  }
  inventory: {
    inStock: number
    reserved: number
  }
}

const products = collect<Product>([{
  sku: 'LAPTOP1',
  name: 'Pro Laptop',
  price: { amount: 999, currency: 'USD' },
  inventory: { inStock: 10, reserved: 2 }
}])

const displayData = products.pick('name', 'price')
// { name: 'Pro Laptop', price: { amount: 999, currency: 'USD' } }
```

### Real-world Example: E-commerce Data Processing

```typescript
interface OrderData {
  orderId: string
  customerInfo: {
    id: string
    name: string
    email: string
    phone: string
  }
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shipping: {
    address: string
    method: string
    tracking: string
  }
  payment: {
    method: string
    status: string
    lastFour: string
  }
  metadata: {
    source: string
    campaign: string
  }
}

class OrderExporter {
  private orders: Collection<OrderData>

  constructor(orders: OrderData[]) {
    this.orders = collect(orders)
  }

  generateCustomerReport() {
    return this.orders.map(order => ({
      orderId: order.orderId,
      customer: order.customerInfo,
      items: order.items
    }))
  }

  prepareShippingLabels() {
    return this.orders
      .pick('orderId', 'customerInfo', 'shipping')
      .map(order => ({
        reference: order.orderId,
        name: order.customerInfo.name,
        address: order.shipping.address
      }))
  }

  getPaymentSummary() {
    return this.orders
      .pick('orderId', 'payment')
      .map(order => ({
        orderId: order.orderId,
        method: order.payment.method,
        status: order.payment.status
      }))
  }

  generateInvoiceData() {
    return this.orders
      .pick('orderId', 'customerInfo', 'items')
      .map(order => ({
        invoiceId: `INV-${order.orderId}`,
        customer: {
          name: order.customerInfo.name,
          email: order.customerInfo.email
        },
        items: order.items,
        total: order.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        )
      }))
  }
}
```

## Type Safety

```typescript
interface ComplexData {
  id: number
  name: string
  optional?: string
  nested: {
    value: number
  }
}

const data = collect<ComplexData>([
  {
    id: 1,
    name: 'Test',
    nested: { value: 10 }
  }
])

// Type-safe property picking
const picked = data.pick('id', 'name')
type PickedType = typeof picked.first()
// { id: number; name: string }

// TypeScript enforces valid keys
// data.pick('id', 'nonexistent') // ✗ TypeScript error
```

## Return Value

- Returns a new Collection with picked properties
- Original object structure preserved for picked properties
- Type information preserved through generics
- Maintains collection chain methods
- Undefined properties are excluded
- Original collection remains unchanged

## Common Use Cases

### 1. Data Transformation

- Response formatting
- API transformation
- Data extraction
- View models
- DTO creation

### 2. Security

- Data sanitization
- Permission filtering
- Sensitive data removal
- Access control
- Content filtering

### 3. Data Export

- Report generation
- CSV creation
- API responses
- Document generation
- Data downloads

### 4. Performance

- Payload optimization
- Data minimization
- Network efficiency
- Cache optimization
- Memory usage

### 5. Integration

- API compatibility
- Format conversion
- Schema mapping
- Interface adaptation
- Data migration
