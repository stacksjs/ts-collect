# MapWithKeys Method

The `mapWithKeys()` method iterates through the collection and passes each value to the given callback, which should return an array containing a single key/value pair to be included in the new collection.

## Basic Syntax

```typescript
collect(items).mapWithKeys((item: T) => [key: string | number, value: any])
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const userMap = users.mapWithKeys(user => [user.id, user.name])

console.log(userMap.all())
// {
//   '1': 'John',
//   '2': 'Jane'
// }
```

### Complex Objects

```typescript
interface Product {
  sku: string
  name: string
  price: number
  stock: number
}

const products = collect<Product>([
  { sku: 'LAPTOP1', name: 'Laptop Pro', price: 1299, stock: 10 },
  { sku: 'MOUSE1', name: 'Magic Mouse', price: 79, stock: 20 }
])

const inventory = products.mapWithKeys(product => [
  product.sku,
  {
    name: product.name,
    value: product.price * product.stock
  }
])

console.log(inventory.all())
// {
//   'LAPTOP1': { name: 'Laptop Pro', value: 12990 },
//   'MOUSE1': { name: 'Magic Mouse', value: 1580 }
// }
```

### Real-world Examples

#### Configuration Management

```typescript
interface ConfigItem {
  key: string
  value: any
  environment: string
}

const configurations = collect<ConfigItem>([
  { key: 'APP_NAME', value: 'MyApp', environment: 'production' },
  { key: 'DEBUG', value: false, environment: 'production' },
  { key: 'API_URL', value: 'https://api.example.com', environment: 'production' }
])

const config = configurations.mapWithKeys(item => [
  item.key,
  {
    value: item.value,
    env: item.environment
  }
])

console.log(config.all())
// {
//   'APP_NAME': { value: 'MyApp', env: 'production' },
//   'DEBUG': { value: false, env: 'production' },
//   'API_URL': { value: 'https://api.example.com', env: 'production' }
// }
```

#### User Session Management

```typescript
interface Session {
  userId: number
  token: string
  lastActivity: Date
  device: string
}

const sessions = collect<Session>([
  {
    userId: 1,
    token: 'token1',
    lastActivity: new Date('2024-01-01'),
    device: 'desktop'
  },
  {
    userId: 2,
    token: 'token2',
    lastActivity: new Date('2024-01-02'),
    device: 'mobile'
  }
])

const sessionMap = sessions.mapWithKeys(session => [
  session.token,
  {
    user: session.userId,
    activity: session.lastActivity,
    device: session.device
  }
])

// Usage for session lookup
console.log(sessionMap.get('token1'))
// { user: 1, activity: Date, device: 'desktop' }
```

### Advanced Usage

#### Nested Data Structures

```typescript
interface Department {
  code: string
  name: string
  employees: {
    id: number
    name: string
    role: string
  }[]
}

const departments = collect<Department>([
  {
    code: 'IT',
    name: 'Information Technology',
    employees: [
      { id: 1, name: 'John', role: 'Developer' },
      { id: 2, name: 'Jane', role: 'Designer' }
    ]
  },
  {
    code: 'HR',
    name: 'Human Resources',
    employees: [
      { id: 3, name: 'Bob', role: 'Manager' }
    ]
  }
])

const departmentStructure = departments.mapWithKeys(dept => [
  dept.code,
  {
    name: dept.name,
    staff: collect(dept.employees).mapWithKeys(emp => [
      emp.id,
      { name: emp.name, role: emp.role }
    ]).all()
  }
])

console.log(departmentStructure.all())
// {
//   'IT': {
//     name: 'Information Technology',
//     staff: {
//       '1': { name: 'John', role: 'Developer' },
//       '2': { name: 'Jane', role: 'Designer' }
//     }
//   },
//   'HR': {
//     name: 'Human Resources',
//     staff: {
//       '3': { name: 'Bob', role: 'Manager' }
//     }
//   }
// }
```

#### Data Transformation

```typescript
interface RawData {
  timestamp: string
  metric: string
  value: number
}

const metrics = collect<RawData>([
  { timestamp: '2024-01-01', metric: 'cpu', value: 80 },
  { timestamp: '2024-01-01', metric: 'memory', value: 60 },
  { timestamp: '2024-01-02', metric: 'cpu', value: 70 }
])

const formattedMetrics = metrics.mapWithKeys(item => [
  `${item.metric}_${item.timestamp}`,
  {
    value: item.value,
    timestamp: new Date(item.timestamp)
  }
])

console.log(formattedMetrics.all())
// {
//   'cpu_2024-01-01': { value: 80, timestamp: Date },
//   'memory_2024-01-01': { value: 60, timestamp: Date },
//   'cpu_2024-01-02': { value: 70, timestamp: Date }
// }
```

## Type Safety

```typescript
interface TypedItem {
  id: string
  data: {
    value: number
    label: string
  }
}

const items = collect<TypedItem>([
  { id: 'a', data: { value: 1, label: 'First' } },
  { id: 'b', data: { value: 2, label: 'Second' } }
])

// Type-safe mapping
const result = items.mapWithKeys((item: TypedItem) => [
  item.id,
  item.data
])

// TypeScript enforces return type
type ResultType = ReturnType<typeof result.all>
```

## Return Value

- Returns a new Collection instance containing the key/value pairs
- The original collection remains unchanged
- If multiple items map to the same key, later values will overwrite earlier ones
