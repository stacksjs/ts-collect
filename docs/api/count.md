# Count Method

The `count()` method returns the total number of items in the collection. This method can count both array elements and object properties.

## Basic Syntax

```typescript
collect(items).count()
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.count()) // 5

const empty = collect([])
console.log(empty.count()) // 0
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  active: boolean
}

const users = collect<User>([
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false },
  { id: 3, name: 'Bob', active: true }
])

console.log(users.count()) // 3
```

### Real-world Examples

#### Active Users Count

```typescript
interface User {
  id: number
  name: string
  status: 'active' | 'inactive' | 'pending'
}

const users = collect<User>([
  { id: 1, name: 'John', status: 'active' },
  { id: 2, name: 'Jane', status: 'inactive' },
  { id: 3, name: 'Bob', status: 'active' },
  { id: 4, name: 'Alice', status: 'pending' }
])

const activeCount = users
  .filter(user => user.status === 'active')
  .count()

console.log(activeCount) // 2
```

#### Task Statistics

```typescript
interface Task {
  id: number
  title: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', completed: true, priority: 'high' },
  { id: 2, title: 'Task 2', completed: false, priority: 'medium' },
  { id: 3, title: 'Task 3', completed: false, priority: 'high' },
  { id: 4, title: 'Task 4', completed: true, priority: 'low' }
])

// Count completed tasks
const completedCount = tasks
  .filter(task => task.completed)
  .count()

// Count high priority tasks
const highPriorityCount = tasks
  .filter(task => task.priority === 'high')
  .count()

console.log(`Completed tasks: ${completedCount}`) // 2
console.log(`High priority tasks: ${highPriorityCount}`) // 2
```

### Combining with Other Methods

```typescript
interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

const products = collect<Product>([
  { id: 1, name: 'Phone', price: 599, inStock: true },
  { id: 2, name: 'Tablet', price: 799, inStock: false },
  { id: 3, name: 'Laptop', price: 1299, inStock: true },
  { id: 4, name: 'Watch', price: 399, inStock: true }
])

// Count available expensive products
const availableExpensiveCount = products
  .filter(product => product.inStock && product.price > 500)
  .count()

console.log(availableExpensiveCount) // 2
```

### Inventory Management

```typescript
interface InventoryItem {
  sku: string
  quantity: number
  location: string
}

const inventory = collect<InventoryItem>([
  { sku: 'A001', quantity: 5, location: 'Warehouse A' },
  { sku: 'B002', quantity: 0, location: 'Warehouse A' },
  { sku: 'C003', quantity: 3, location: 'Warehouse B' },
  { sku: 'D004', quantity: 0, location: 'Warehouse B' }
])

// Count items out of stock
const outOfStockCount = inventory
  .filter(item => item.quantity === 0)
  .count()

// Count items by location
const warehouseACount = inventory
  .filter(item => item.location === 'Warehouse A')
  .count()

console.log(`Out of stock items: ${outOfStockCount}`) // 2
console.log(`Items in Warehouse A: ${warehouseACount}`) // 2
```

### Error Tracking

```typescript
interface ErrorLog {
  timestamp: string
  type: 'error' | 'warning' | 'info'
  message: string
}

const logs = collect<ErrorLog>([
  { timestamp: '2024-01-01', type: 'error', message: 'Server crash' },
  { timestamp: '2024-01-01', type: 'warning', message: 'High CPU usage' },
  { timestamp: '2024-01-02', type: 'error', message: 'Database timeout' },
  { timestamp: '2024-01-02', type: 'info', message: 'Backup completed' }
])

// Count errors
const errorCount = logs
  .filter(log => log.type === 'error')
  .count()

// Count issues by date
const issuesOnFirstDay = logs
  .filter(log => log.timestamp === '2024-01-01')
  .count()

console.log(`Total errors: ${errorCount}`) // 2
console.log(`Issues on Jan 1: ${issuesOnFirstDay}`) // 2
```

## Type Safety

```typescript
// The count method works with any type of collection
const numbers = collect([1, 2, 3])
const strings = collect(['a', 'b', 'c'])
const mixed = collect([1, 'a', true])

console.log(numbers.count()) // 3
console.log(strings.count()) // 3
console.log(mixed.count()) // 3
```

## Return Value

Returns a number representing the total count of items in the collection.
