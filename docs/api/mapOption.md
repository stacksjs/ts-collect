# MapOption Method

The `mapOption()` method transforms each item in the collection while safely handling null or undefined results. It automatically filters out any null or undefined values from the resulting collection.

## Basic Syntax

```typescript
mapOption<U>(callback: (item: T) => U | null | undefined): CollectionOperations<NonNullable<U>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', email: 'chris@example.com' },
  { name: 'Avery', email: null },
  { name: 'Buddy', email: 'buddy@example.com' }
])

const validEmails = users.mapOption(user => user.email)
console.log(validEmails.all())
// ['chris@example.com', 'buddy@example.com']
```

### Working with Optional Properties

```typescript
interface Product {
  sku: string
  name: string
  salePrice?: number
  discountCode?: string
}

const products = collect<Product>([
  { sku: 'LAPTOP1', name: 'Pro Laptop', salePrice: 899 },
  { sku: 'PHONE1', name: 'Smart Phone' },
  { sku: 'TABLET1', name: 'Tablet', salePrice: 299 }
])

const discountedPrices = products.mapOption(product => ({
  sku: product.sku,
  price: product.salePrice
}))
```

### Real-world Example: E-commerce Order Processing

```typescript
interface Order {
  id: string
  customerEmail?: string
  items: OrderItem[]
  shippingAddress?: Address
}

interface OrderItem {
  productId: string
  quantity: number
}

interface Address {
  street: string
  city: string
  country: string
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getShippableOrders() {
    return this.orders.mapOption(order => {
      if (!order.shippingAddress || !order.customerEmail) {
        return null
      }

      return {
        orderId: order.id,
        email: order.customerEmail,
        address: order.shippingAddress,
        itemCount: order.items.length
      }
    })
  }

  generateShippingLabels() {
    return this.orders.mapOption(order => {
      const address = order.shippingAddress
      if (!address) return null

      return {
        orderId: order.id,
        label: `${address.street}\n${address.city}\n${address.country}`
      }
    })
  }

  getCustomerNotifications() {
    return this.orders.mapOption(order => {
      if (!order.customerEmail) return null

      return {
        email: order.customerEmail,
        subject: `Order ${order.id} Update`,
        items: order.items.length
      }
    })
  }
}

// Usage
const processor = new OrderProcessor([
  {
    id: 'ORD1',
    customerEmail: 'customer@example.com',
    items: [{ productId: 'P1', quantity: 1 }],
    shippingAddress: {
      street: '123 Main St',
      city: 'Example City',
      country: 'Country'
    }
  },
  {
    id: 'ORD2',
    items: [{ productId: 'P2', quantity: 1 }]
    // Missing email and address
  }
])

const shippable = processor.getShippableOrders()
```

## Type Safety

```typescript
interface Data {
  id: number
  optionalValue?: string
  nullableValue: string | null
}

const data = collect<Data>([
  { id: 1, optionalValue: 'test', nullableValue: 'value' },
  { id: 2, nullableValue: null }
])

// Type-safe optional mapping
const values: CollectionOperations<string> = data.mapOption(item => item.optionalValue)
const nonNull: CollectionOperations<string> = data.mapOption(item => item.nullableValue)

// TypeScript ensures non-null return type
type ResultType = ReturnType<typeof values.first> // string | undefined
```

## Return Value

- Returns a new Collection without null/undefined values
- Automatically filters out null and undefined results
- Maintains type safety through generics
- Result type is NonNullable`<U>`
- Preserves collection chain methods
- Empty collection if all results are null/undefined

## Common Use Cases

### 1. Data Validation

- Email validation
- Required field checking
- Address verification
- Contact information
- Document processing

### 2. Optional Processing

- Conditional transformations
- Nullable field handling
- Optional data extraction
- Selective mapping
- Safe type conversion

### 3. Error Handling

- Safe data access
- Null value handling
- Undefined checking
- Error recovery
- Default value handling

### 4. Data Cleaning

- Invalid data removal
- Null filtering
- Missing value handling
- Data normalization
- Format validation

### 5. Type Safety

- Null-safe operations
- Type narrowing
- Optional chaining
- Safe transformations
- Type guarantees
