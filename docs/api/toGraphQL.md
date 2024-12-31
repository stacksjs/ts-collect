# ToGraphQL Method

The `toGraphQL()` method generates a GraphQL query structure from the collection data. It creates a query using the provided type name and automatically includes all fields from the collection items.

## Basic Syntax

```typescript
toGraphQL(typename: string): string
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', email: 'chris@example.com' },
  { id: 2, name: 'Avery', email: 'avery@example.com' }
])

const query = users.toGraphQL('User')
console.log(query)
// query {
//   Users {
//     nodes {
//       User {
//         id: 1
//         name: "Chris"
//         email: "chris@example.com"
//       }
//       User {
//         id: 2
//         name: "Avery"
//         email: "avery@example.com"
//       }
//     }
//   }
// }
```

### Working with Nested Objects

```typescript
interface Product {
  sku: string
  details: {
    name: string
    price: number
  }
  inventory: {
    inStock: boolean
    quantity: number
  }
}

const products = collect<Product>([{
  sku: 'LAPTOP1',
  details: {
    name: 'Pro Laptop',
    price: 999.99
  },
  inventory: {
    inStock: true,
    quantity: 10
  }
}])

const query = products.toGraphQL('Product')
// Generates nested structure
```

### Real-world Example: E-commerce Data Query Generation

```typescript
interface OrderData {
  id: string
  customer: {
    id: string
    name: string
    email: string
  }
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  totals: {
    subtotal: number
    tax: number
    shipping: number
    total: number
  }
  status: string
}

class OrderQueryBuilder {
  private orders: Collection<OrderData>

  constructor(orders: OrderData[]) {
    this.orders = collect(orders)
  }

  generateOrderQuery() {
    return this.orders.toGraphQL('Order')
  }

  generateOrderFragment() {
    const firstOrder = this.orders.first()
    if (!firstOrder) return ''

    return `
      fragment OrderFields on Order {
        id
        customer {
          id
          name
          email
        }
        items {
          productId
          quantity
          price
        }
        totals {
          subtotal
          tax
          shipping
          total
        }
        status
      }
    `
  }

  generateMutation() {
    const mutations = this.orders.map(order => `
      mutation CreateOrder {
        createOrder(input: {
          customerId: "${order.customer.id}"
          items: ${JSON.stringify(order.items)}
          status: ${order.status}
        }) {
          ...OrderFields
        }
      }
    `).join('\n')

    return `
      ${this.generateOrderFragment()}
      ${mutations}
    `
  }
}

// Usage
const queryBuilder = new OrderQueryBuilder([
  {
    id: 'ORD1',
    customer: {
      id: 'CUST1',
      name: 'Chris',
      email: 'chris@example.com'
    },
    items: [
      { productId: 'P1', quantity: 1, price: 999.99 }
    ],
    totals: {
      subtotal: 999.99,
      tax: 100,
      shipping: 50,
      total: 1149.99
    },
    status: 'PENDING'
  }
])

const query = queryBuilder.generateOrderQuery()
const mutation = queryBuilder.generateMutation()
```

## Type Safety

```typescript
interface User {
  id: number
  profile: {
    name: string
    email: string
  }
}

const users = collect<User>([
  {
    id: 1,
    profile: {
      name: 'Chris',
      email: 'chris@example.com'
    }
  }
])

// Type-safe GraphQL generation
const query: string = users.toGraphQL('User')

// Type name must be a string
// users.toGraphQL(123) // ✗ TypeScript error
```

## Return Value

- Returns a string containing GraphQL query
- Handles nested objects
- Formats arrays properly
- Escapes string values
- Empty query if collection is empty
- Preserves field names

## Common Use Cases

### 1. API Integration

- Query generation
- Data fetching
- API testing
- Schema validation
- Service integration

### 2. Development Tools

- Query building
- Test data
- Documentation
- Schema exploration
- Client generation

### 3. Data Migration

- System integration
- Data transfer
- Service migration
- Platform sync
- API conversion

### 4. Testing

- Query testing
- Integration tests
- Schema validation
- Mock data
- API simulation

### 5. Code Generation

- Client code
- Type definitions
- API wrappers
- Service layers
- Documentation
