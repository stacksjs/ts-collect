# ContainsAll Method

The `containsAll()` method determines if all given values are present in the collection. It supports two different usage patterns:

1. Checking if all provided items exist in the collection
2. Checking if all provided values exist for a specific key in the collection's objects

## Basic Syntax

```typescript
const item: Array<T>
// Check for direct items
collect(items).containsAll(item)

// Check by key/values
const key: K
const values: Array<T[K]>
collect(items).containsAll(key, values)
```

## Examples

### Basic Usage - Direct Items

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])

// Check for direct values
console.log(numbers.containsAll([1, 3, 5])) // true
console.log(numbers.containsAll([1, 3, 6])) // false

// Handle undefined values
const withUndefined = collect([1, 2, undefined, 4])
console.log(withUndefined.containsAll([1, undefined])) // true
```

### Key-Value Checking

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'editor' },
  { id: 3, name: 'Bob', role: 'viewer' }
])

// Check by key and values
console.log(users.containsAll('role', ['admin', 'editor'])) // true
console.log(users.containsAll('role', ['admin', 'superuser'])) // false

// Check by IDs
console.log(users.containsAll('id', [1, 2])) // true
console.log(users.containsAll('id', [1, 4])) // false
```

### Real-world Examples

#### Permission System

```typescript
interface Role {
  id: number
  name: string
  permissions: string[]
}

const roles = collect<Role>([
  { id: 1, name: 'Admin', permissions: ['read', 'write', 'delete'] },
  { id: 2, name: 'Editor', permissions: ['read', 'write'] },
  { id: 3, name: 'Viewer', permissions: ['read'] }
])

// Check if roles exist
console.log(roles.containsAll('name', ['Admin', 'Editor'])) // true

// Direct object checking
const requiredRoles: Role[] = [
  { id: 1, name: 'Admin', permissions: ['read', 'write', 'delete'] },
  { id: 2, name: 'Editor', permissions: ['read', 'write'] }
]
console.log(roles.containsAll(requiredRoles)) // true
```

#### Product Inventory

```typescript
interface Product {
  sku: string
  name: string
  category: string
  inStock: boolean
}

const inventory = collect<Product>([
  { sku: 'A001', name: 'Laptop', category: 'Electronics', inStock: true },
  { sku: 'A002', name: 'Mouse', category: 'Electronics', inStock: true },
  { sku: 'B001', name: 'Desk', category: 'Furniture', inStock: false }
])

// Check by SKU
function hasAllProducts(skus: string[]): boolean {
  return inventory.containsAll('sku', skus)
}

// Check by direct objects
function hasExactProducts(products: Product[]): boolean {
  return inventory.containsAll(products)
}

console.log(hasAllProducts(['A001', 'A002'])) // true
console.log(hasAllProducts(['A001', 'C001'])) // false
```

### Advanced Usage

#### Handling Optional Values

```typescript
interface Task {
  id: number
  title: string
  assignee?: string
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', assignee: 'John' },
  { id: 2, title: 'Task 2' },
  { id: 3, title: 'Task 3', assignee: 'Jane' }
])

// Check including undefined values
console.log(tasks.containsAll('assignee', ['John', undefined])) // true
```

#### Complex Object Matching

```typescript
interface Employee {
  id: number
  department: string
  skills: string[]
  metadata: {
    level: number
    certified: boolean
  }
}

const employees = collect<Employee>([
  {
    id: 1,
    department: 'IT',
    skills: ['JavaScript', 'TypeScript'],
    metadata: { level: 2, certified: true }
  },
  {
    id: 2,
    department: 'IT',
    skills: ['Python', 'Java'],
    metadata: { level: 3, certified: true }
  }
])

// Check by department
console.log(employees.containsAll('department', ['IT'])) // true

// Direct object matching
const requiredEmployees: Employee[] = [
  {
    id: 1,
    department: 'IT',
    skills: ['JavaScript', 'TypeScript'],
    metadata: { level: 2, certified: true }
  }
]
console.log(employees.containsAll(requiredEmployees)) // true
```

## Type Safety

```typescript
interface Vehicle {
  id: number
  type: 'car' | 'truck' | 'motorcycle'
  brand: string
}

const vehicles = collect<Vehicle>([
  { id: 1, type: 'car', brand: 'Toyota' },
  { id: 2, type: 'truck', brand: 'Ford' }
])

// TypeScript ensures type safety for key names
vehicles.containsAll('type', ['car', 'truck']) // ✓ Valid
vehicles.containsAll('brand', ['Toyota']) // ✓ Valid
// vehicles.containsAll('invalid', ['value'])           // ✗ TypeScript error
// vehicles.containsAll('type', ['invalid-type'])       // ✗ TypeScript error
```

## Return Value

Returns a boolean:

- `true` if all specified items/values are found in the collection
- `false` if any specified item/value is not found
- When checking by key/values, returns `true` only if all values exist for the specified key in the collection's objects
