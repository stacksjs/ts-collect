# Omit Method

The `omit()` method creates a new collection where each item excludes the specified properties from the original items. This is the inverse of `pick()` and is useful for removing unwanted fields while keeping everything else.

## Basic Syntax

```typescript
omit<K extends keyof T>(...keys: K[]): CollectionOperations<Omit<T, K>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', password: 'secret123', role: 'admin' },
  { id: 2, name: 'Avery', password: 'secret456', role: 'user' }
])

const safeData = users.omit('password')
console.log(safeData.first())
// { id: 1, name: 'Chris', role: 'admin' }
```

### Working with Nested Objects

```typescript
interface Product {
  sku: string
  name: string
  internalData: {
    cost: number
    supplier: string
  }
  price: number
  metadata: {
    created: Date
    modified: Date
  }
}

const products = collect<Product>([{
  sku: 'LAPTOP1',
  name: 'Pro Laptop',
  internalData: { cost: 800, supplier: 'SecretVendor' },
  price: 999,
  metadata: {
    created: new Date(),
    modified: new Date()
  }
}])

const publicData = products.omit('internalData', 'metadata')
// { sku: 'LAPTOP1', name: 'Pro Laptop', price: 999 }
```

### Real-world Example: E-commerce Response Sanitization

```typescript
interface OrderData {
  orderId: string
  customer: {
    id: string
    name: string
    email: string
    internalScore: number
    paymentHistory: string[]
  }
  items: Array<{
    productId: string
    quantity: number
    price: number
    internalMargin: number
  }>
  payment: {
    method: string
    cardToken: string
    lastFour: string
    secretKey: string
  }
  internalNotes: string[]
}

class OrderResponseHandler {
  private orders: Collection<OrderData>

  constructor(orders: OrderData[]) {
    this.orders = collect(orders)
  }

  getPublicOrderDetails() {
    return this.orders
      .map(order => ({
        ...order,
        customer: { ...order.customer },
        items: order.items.map(item => ({ ...item })),
        payment: { ...order.payment }
      }))
      .map(order => {
        // Remove sensitive customer data
        const safeCustomer = collect([order.customer])
          .omit('internalScore', 'paymentHistory')
          .first()

        // Remove internal item data
        const safeItems = collect(order.items)
          .omit('internalMargin')
          .all()

        // Remove sensitive payment data
        const safePayment = collect([order.payment])
          .omit('cardToken', 'secretKey')
          .first()

        return {
          orderId: order.orderId,
          customer: safeCustomer,
          items: safeItems,
          payment: safePayment
        }
      })
  }

  getAdminOrderView() {
    return this.orders.omit('payment')  // Exclude full payment details even from admin
  }

  getAnalyticsData() {
    return this.orders
      .omit('payment', 'internalNotes')
      .map(order => ({
        ...order,
        customer: collect([order.customer])
          .omit('paymentHistory')
          .first()
      }))
  }
}
```

## Type Safety

```typescript
interface UserData {
  id: number
  name: string
  email: string
  password: string
  settings: {
    theme: string
    notifications: boolean
  }
}

const users = collect<UserData>([
  {
    id: 1,
    name: 'Chris',
    email: 'chris@example.com',
    password: 'secret',
    settings: { theme: 'dark', notifications: true }
  }
])

// Type-safe property omission
const publicData = users.omit('password', 'settings')
type PublicType = typeof publicData.first()
// { id: number; name: string; email: string }

// TypeScript enforces valid keys
// users.omit('nonexistent') // ✗ TypeScript error
```

## Return Value

- Returns a new Collection with specified properties removed
- Original object structure preserved for remaining properties
- Type information preserved through generics
- Maintains collection chain methods
- Properties not in keys list are kept
- Original collection remains unchanged

## Common Use Cases

### 1. Security Sanitization

- Password removal
- Token exclusion
- Internal data hiding
- Sensitive info removal
- PII protection

### 2. API Responses

- Response cleaning
- Data filtering
- Field exclusion
- Privacy protection
- Output formatting

### 3. Data Export

- Public data export
- Report generation
- Safe data sharing
- Document creation
- Audit logs

### 4. View Models

- UI data preparation
- Display formatting
- Template data
- Client responses
- Form data
