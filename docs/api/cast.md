# Cast Method

The `cast()` method transforms each item in the collection into a new instance of the specified class. This is particularly useful when you need to convert plain objects into class instances with methods and additional functionality.

## Basic Syntax

```typescript
cast<U>(constructor: new (...args: any[]) => U): CollectionOperations<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

class User {
  constructor(public name: string, public email: string) {}

  getDisplayName(): string {
    return `${this.name} <${this.email}>`
  }
}

const data = collect([
  { name: 'Chris', email: 'chris@example.com' },
  { name: 'Avery', email: 'avery@example.com' }
])

const users = data.cast(User)
console.log(users.first()?.getDisplayName())
// "Chris <chris@example.com>"
```

### Working with Complex Objects

```typescript
class Product {
  constructor(
    public sku: string,
    public name: string,
    public price: number
  ) {}

  getPriceWithTax(taxRate: number = 0.2): number {
    return this.price * (1 + taxRate)
  }

  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)}`
  }
}

const products = collect([
  { sku: 'LAPTOP1', name: 'Pro Laptop', price: 999 },
  { sku: 'PHONE1', name: 'Smart Phone', price: 699 }
])
.cast(Product)

console.log(products.first()?.getPriceWithTax())
// 1198.80
```

### Real-world Example: E-commerce Order Processing

```typescript
class Order {
  constructor(
    public id: string,
    public customerName: string,
    public items: OrderItem[],
    public status: 'pending' | 'processing' | 'shipped'
  ) {}

  getTotalAmount(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  getShippingStatus(): string {
    return `Order ${this.id} is ${this.status}`
  }

  canBeCancelled(): boolean {
    return this.status === 'pending'
  }
}

class OrderItem {
  constructor(
    public productId: string,
    public name: string,
    public price: number,
    public quantity: number
  ) {}

  getSubtotal(): number {
    return this.price * this.quantity
  }
}

class OrderProcessor {
  processOrders(rawOrders: any[]) {
    return collect(rawOrders)
      .map(order => ({
        ...order,
        items: collect(order.items).cast(OrderItem).all()
      }))
      .cast(Order)
      .map(order => ({
        orderId: order.id,
        total: order.getTotalAmount(),
        status: order.getShippingStatus(),
        cancellable: order.canBeCancelled()
      }))
  }
}

// Usage
const processor = new OrderProcessor()
const result = processor.processOrders([
  {
    id: 'ORD-1',
    customerName: 'Chris',
    items: [
      { productId: 'P1', name: 'Laptop', price: 999, quantity: 1 }
    ],
    status: 'pending'
  }
])
```

## Type Safety

```typescript
class BaseItem {
  constructor(public id: number) {}
}

class ExtendedItem extends BaseItem {
  constructor(id: number, public data: string) {
    super(id)
  }
}

const items = collect([
  { id: 1, data: 'test' },
  { id: 2, data: 'example' }
])

// Type-safe casting
const baseItems: CollectionOperations<BaseItem> = items.cast(BaseItem)
const extendedItems: CollectionOperations<ExtendedItem> = items.cast(ExtendedItem)

// TypeScript enforces constructor compatibility
class InvalidItem {
  constructor(name: string) {}
}
// items.cast(InvalidItem) // ✗ TypeScript error - constructor not compatible
```

## Return Value

- Returns a new Collection of class instances
- Each item is a new instance of the specified class
- Original collection remains unchanged
- Maintains type safety through generics
- Constructor called for each item
- Properties are copied to new instances

## Common Use Cases

### 1. Domain Objects

- Entity instantiation
- Model creation
- Data transfer objects
- Value objects
- Business objects

### 2. Data Enrichment

- Adding methods to data
- Behavior injection
- Functionality extension
- Data transformation
- Type enhancement

### 3. API Integration

- Response transformation
- Request preparation
- Data normalization
- Contract enforcement
- Model mapping

### 4. Business Logic

- Rule enforcement
- Validation logic
- Calculation methods
- State management
- Behavior implementation

### 5. Type Conversion

- Plain object conversion
- Type safety enforcement
- Interface implementation
- Class hierarchy creation
- Model transformation
