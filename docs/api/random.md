# MapToDictionary Method

The `mapToDictionary()` method groups the collection's items by a given key or callback function, similar to groupBy but with more flexibility in defining both keys and values.

## Basic Syntax

```typescript
collect(items).mapToDictionary((item: T) => ({ key: string | number, value: any }))
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const users = collect([
  { id: 1, name: 'John Doe', role: 'admin' },
  { id: 2, name: 'Jane Smith', role: 'user' },
  { id: 3, name: 'Bob Johnson', role: 'admin' }
])

const usersByRole = users.mapToDictionary(user => ({
  key: user.role,
  value: user.name
}))

console.log(usersByRole.all())
// {
//   admin: ['John Doe', 'Bob Johnson'],
//   user: ['Jane Smith']
// }
```

### Custom Key-Value Mapping

```typescript
interface Product {
  id: number
  category: string
  name: string
  price: number
}

const products = collect<Product>([
  { id: 1, category: 'electronics', name: 'Laptop', price: 999 },
  { id: 2, category: 'electronics', name: 'Mouse', price: 49 },
  { id: 3, category: 'books', name: 'TypeScript Guide', price: 29 }
])

const productsByCategory = products.mapToDictionary(product => ({
  key: product.category,
  value: {
    name: product.name,
    price: product.price
  }
}))

console.log(productsByCategory.all())
// {
//   electronics: [
//     { name: 'Laptop', price: 999 },
//     { name: 'Mouse', price: 49 }
//   ],
//   books: [
//     { name: 'TypeScript Guide', price: 29 }
//   ]
// }
```

### Real-world Examples

#### Order Processing

```typescript
interface Order {
  orderId: string
  customerId: number
  status: string
  items: {
    productId: number
    quantity: number
    price: number
  }[]
}

const orders = collect<Order>([
  {
    orderId: 'A1',
    customerId: 1,
    status: 'pending',
    items: [{ productId: 1, quantity: 2, price: 100 }]
  },
  {
    orderId: 'A2',
    customerId: 2,
    status: 'completed',
    items: [{ productId: 2, quantity: 1, price: 50 }]
  },
  {
    orderId: 'A3',
    customerId: 1,
    status: 'pending',
    items: [{ productId: 3, quantity: 3, price: 75 }]
  }
])

const ordersByCustomer = orders.mapToDictionary(order => ({
  key: order.customerId,
  value: {
    orderId: order.orderId,
    total: collect(order.items).sum(item => item.quantity * item.price)
  }
}))

console.log(ordersByCustomer.all())
// {
//   1: [
//     { orderId: 'A1', total: 200 },
//     { orderId: 'A3', total: 225 }
//   ],
//   2: [
//     { orderId: 'A2', total: 50 }
//   ]
// }
```

#### Event Logging

```typescript
interface LogEntry {
  timestamp: string
  level: 'info' | 'warning' | 'error'
  message: string
  metadata: Record<string, any>
}

const logs = collect<LogEntry>([
  {
    timestamp: '2024-01-01T10:00:00',
    level: 'info',
    message: 'Application started',
    metadata: { version: '1.0.0' }
  },
  {
    timestamp: '2024-01-01T10:01:00',
    level: 'error',
    message: 'Database connection failed',
    metadata: { retries: 3 }
  },
  {
    timestamp: '2024-01-01T10:02:00',
    level: 'warning',
    message: 'High memory usage',
    metadata: { usage: '85%' }
  }
])

const logsByLevel = logs.mapToDictionary(log => ({
  key: log.level,
  value: {
    time: new Date(log.timestamp).toLocaleTimeString(),
    message: log.message,
    metadata: log.metadata
  }
}))
```

### Advanced Usage

#### Multi-level Grouping

```typescript
interface Employee {
  id: number
  department: string
  location: string
  salary: number
  name: string
}

const employees = collect<Employee>([
  { id: 1, department: 'IT', location: 'NY', salary: 80000, name: 'John' },
  { id: 2, department: 'IT', location: 'SF', salary: 90000, name: 'Jane' },
  { id: 3, department: 'HR', location: 'NY', salary: 70000, name: 'Bob' }
])

const employeesByDeptAndLocation = employees.mapToDictionary(emp => ({
  key: `${emp.department}-${emp.location}`,
  value: {
    name: emp.name,
    salary: emp.salary
  }
}))

console.log(employeesByDeptAndLocation.all())
// {
//   'IT-NY': [{ name: 'John', salary: 80000 }],
//   'IT-SF': [{ name: 'Jane', salary: 90000 }],
//   'HR-NY': [{ name: 'Bob', salary: 70000 }]
// }
```

### Type Safety

```typescript
interface TypedItem {
  id: number
  category: 'A' | 'B' | 'C'
  value: number
}

const items = collect<TypedItem>([
  { id: 1, category: 'A', value: 100 },
  { id: 2, category: 'B', value: 200 },
  { id: 3, category: 'A', value: 300 }
])

// Type-safe dictionary mapping
const dictionary = items.mapToDictionary((item: TypedItem) => ({
  key: item.category,
  value: {
    id: item.id,
    value: item.value
  }
}))

// TypeScript enforces type safety
type ResultType = ReturnType<typeof dictionary.all>
```

## Return Value

- Returns a new Collection instance containing a dictionary where:
  - Keys are determined by the callback's key property
  - Values are arrays containing all values mapped to that key
  - Values preserve the order in which they appeared in the original collection
