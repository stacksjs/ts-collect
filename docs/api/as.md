# As Method

The `as()` method converts each item in the collection into an instance of the specified class, copying matching properties. Unlike `cast()`, it only copies properties that exist in the target type, making it safer for partial type conversions.

## Basic Syntax

```typescript
as<U extends Record<string, any>>(type: new () => U): CollectionOperations<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

class User {
  id: number = 0
  name: string = ''
}

const data = collect([
  { id: 1, name: 'Chris', extraField: 'ignored' },
  { id: 2, name: 'Avery', extraField: 'ignored' }
])

const users = data.as(User)
console.log(users.first())
// User { id: 1, name: 'Chris' }
// Note: extraField is not copied
```

### Working with Typed Objects

```typescript
class Product {
  sku: string = ''
  name: string = ''
  price: number = 0

  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)}`
  }
}

const rawProducts = collect([
  { sku: 'LAPTOP1', name: 'Pro Laptop', price: 999.99, category: 'Electronics' },
  { sku: 'MOUSE1', name: 'Wireless Mouse', price: 49.99, stock: 100 }
])

const products = rawProducts.as(Product)
console.log(products.first()?.getDisplayPrice())
// "$999.99"
```

### Real-world Example: E-commerce Order Processing

```typescript
class OrderItem {
  productId: string = ''
  quantity: number = 0
  price: number = 0

  getTotal(): number {
    return this.quantity * this.price
  }
}

class Order {
  id: string = ''
  customerId: string = ''
  items: OrderItem[] = []
  status: 'pending' | 'processing' | 'completed' = 'pending'

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.getTotal(), 0)
  }

  canBeCancelled(): boolean {
    return this.status === 'pending'
  }
}

class OrderProcessor {
  processOrders(rawOrders: any[]) {
    return collect(rawOrders)
      .map(order => ({
        ...order,
        items: collect(order.items)
          .as(OrderItem)
          .all()
      }))
      .as(Order)
      .map(order => ({
        orderId: order.id,
        total: order.getTotalAmount(),
        isCancellable: order.canBeCancelled(),
        itemCount: order.items.length
      }))
  }
}

// Usage
const processor = new OrderProcessor()
const results = processor.processOrders([
  {
    id: 'ORD1',
    customerId: 'CUST1',
    status: 'pending',
    items: [
      { productId: 'P1', quantity: 2, price: 99.99 }
    ],
    extraData: 'ignored'
  }
])
```

## Type Safety

```typescript
class BaseProduct {
  id: number = 0
  name: string = ''
}

class ExtendedProduct extends BaseProduct {
  price: number = 0
}

const data = collect([
  { id: 1, name: 'Item', price: 10, extra: 'ignored' }
])

// Type-safe conversion
const baseProducts: CollectionOperations<BaseProduct> = data.as(BaseProduct)
const extendedProducts: CollectionOperations<ExtendedProduct> = data.as(ExtendedProduct)

// TypeScript enforces type constraints
class InvalidType {
  wrongField: boolean = false
}
// data.as(InvalidType) // Properties won't match source data
```

## Return Value

- Returns a Collection of new class instances
- Only copies matching properties
- Ignores extra source properties
- Uses default values for missing properties
- Maintains type safety through generics
- Preserves collection chain methods

## Common Use Cases

### 1. API Integration

- Response transformation
- Data normalization
- Contract mapping
- Type conversion
- Schema validation

### 2. Model Creation

- Domain object creation
- Entity mapping
- DTO conversion
- View model generation
- Data transfer

### 3. Type Migration

- Safe type conversion
- Partial mapping
- Schema evolution
- Model updates
- Version migration

### 4. Data Validation

- Input sanitization
- Property filtering
- Type enforcement
- Shape validation
- Default values

### 5. Object Transformation

- Class instantiation
- Property mapping
- Object conversion
- Type casting
- Shape transformation
