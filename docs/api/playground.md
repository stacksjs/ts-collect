# Playground Method

The `playground()` method provides a development experience feature that logs the current state of the collection, including items, length, and available operations. This is particularly useful for debugging and exploring collection capabilities during development.

## Basic Syntax

```typescript
playground(): void
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])
numbers.playground()
// Console output:
// Collection Playground: {
//   items: [1, 2, 3, 4, 5],
//   length: 5,
//   operations: ['map', 'filter', 'reduce', ...]
// }
```

### Working with Complex Data

```typescript
interface Product {
  id: string
  name: string
  price: number
}

const products = collect<Product>([
  { id: 'P1', name: 'Laptop', price: 999 },
  { id: 'P2', name: 'Mouse', price: 49.99 }
])

// Inspect collection state during development
products
  .filter(p => p.price > 100)
  .map(p => ({ ...p, category: 'Electronics' }))
  .playground()
```

### Real-world Example: E-commerce Development Debugging

```typescript
interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  debug() {
    console.log('Starting order processing debug...')

    // Inspect initial state
    this.orders.playground()

    // Inspect after filtering
    this.orders
      .filter(order => order.total > 100)
      .playground()

    // Inspect after transformation
    this.orders
      .map(order => ({
        ...order,
        itemCount: order.items.length,
        averageItemPrice: order.total / order.items.length
      }))
      .playground()

    console.log('Debug session complete')
  }

  validateOrders() {
    const validationSteps = [
      // Check order totals
      this.orders
        .map(order => ({
          ...order,
          calculatedTotal: order.items.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0)
        }))
        .playground(),

      // Check for empty orders
      this.orders
        .filter(order => order.items.length === 0)
        .playground(),

      // Check for invalid prices
      this.orders
        .filter(order =>
          order.items.some(item => item.price <= 0))
        .playground()
    ]

    return validationSteps
  }
}

// Usage
const processor = new OrderProcessor([
  {
    id: 'ORD1',
    items: [
      { productId: 'P1', quantity: 2, price: 99.99 }
    ],
    total: 199.98
  }
])

processor.debug()
```

## Type Safety

```typescript
interface Debuggable {
  id: number
  status: string
}

const items = collect<Debuggable>([
  { id: 1, status: 'active' }
])

// Safe debugging during development
items.playground()
```

## Return Value

- Returns void (undefined)
- Logs to console:
  - Collection items
  - Current length
  - Available operations
- Does not modify collection
- Safe for production code
- No side effects

## Common Use Cases

### 1. Development

- Interactive debugging
- Code exploration
- Method discovery
- State inspection
- Learning tool

### 2. Debugging

- State verification
- Data inspection
- Flow tracking
- Error hunting
- Value checking

### 3. Documentation

- Method exploration
- Feature discovery
- API learning
- Example generation
- Usage understanding

### 4. Testing

- State verification
- Transformation checking
- Flow validation
- Data inspection
- Result verification

### 5. Development Flow

- Quick inspection
- Chain debugging
- Operation verification
- Data validation
- Process tracking
