# AssertValid Method

The `assertValid()` method validates collection items against a schema, throwing an error if validation fails.

## Basic Syntax

```typescript
async assertValid(schema: ValidationSchema<T>): Promise<void>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', email: 'chris@example.com', age: 25 }
])

await users.assertValid({
  name: [(value) => value.length > 0],
  email: [(value) => /^[^@]+@[^@]+\.[^@]+$/.test(value)],
  age: [(value) => value >= 18]
})
```

### Real-world Example: E-commerce Order Validation

```typescript
interface Order {
  id: string
  customer: {
    email: string
    name: string
  }
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
}

class OrderValidator {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  async validateOrders() {
    await this.orders.assertValid({
      id: [
        (id) => id.length > 0,
        (id) => /^ORD-\d+$/.test(id)
      ],
      'customer.email': [
        (email) => /^[^@]+@[^@]+\.[^@]+$/.test(email)
      ],
      'items': [
        (items) => items.length > 0,
        (items) => items.every(item => item.quantity > 0),
        (items) => items.every(item => item.price > 0)
      ],
      'total': [
        (total) => total > 0,
        (total, order) => total === order.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        )
      ]
    })
  }

  async validateWithCustomRules(rules: ValidationSchema<Order>) {
    try {
      await this.orders.assertValid(rules)
      return true
    } catch (error) {
      console.error('Validation failed:', error)
      return false
    }
  }
}

// Usage
const validator = new OrderValidator([
  {
    id: 'ORD-001',
    customer: {
      email: 'chris@example.com',
      name: 'Chris'
    },
    items: [
      { productId: 'P1', quantity: 2, price: 99.99 }
    ],
    total: 199.98
  }
])

await validator.validateOrders()
```

## Type Safety

```typescript
interface Product {
  sku: string
  price: number
  stock: number
}

const products = collect<Product>([
  { sku: 'LAPTOP1', price: 999.99, stock: 10 }
])

// Type-safe validation schema
const schema: ValidationSchema<Product> = {
  sku: [
    (sku: string) => sku.length > 0
  ],
  price: [
    (price: number) => price > 0
  ],
  stock: [
    (stock: number) => stock >= 0
  ]
}

await products.assertValid(schema)
```

## Parameters

- `schema`: Object defining validation rules
  - Keys match collection item properties
  - Values are arrays of validation functions
  - Functions return boolean or `Promise<boolean>`
  - Functions can access full item as second parameter

## Error Handling

- Throws error if validation fails
- Error contains field-specific messages
- Stops at first validation failure
- Supports async validation rules
- Handles nested properties
- Reports all invalid fields

## Common Use Cases

### 1. Data Validation

- Input validation
- Form submission
- Data import
- API payloads
- Database writes

### 2. Business Rules

- Order validation
- Price checks
- Stock validation
- User data rules
- Process requirements

### 3. Data Quality

- Data integrity
- Format validation
- Relationship checks
- Constraint validation
- Schema enforcement

### 4. Security

- Input sanitization
- Access control
- Permission checks
- Data constraints
- Security rules

### 5. Process Control

- Workflow validation
- State transitions
- Status checks
- Condition checks
- Rule enforcement
