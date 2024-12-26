# Contains Method

The `contains()` method determines whether the collection includes a given item. It can check for the presence of a specific value, or use a callback function for more complex conditions.

## Basic Syntax

```typescript
// Check for value
collect(items).contains(value)

// Check using callback
collect(items).contains((value, key?) => boolean)

// Check using key-value pair
collect(items).contains(key, value)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const collection = collect([1, 2, 3, 4, 5])

console.log(collection.contains(3)) // true
console.log(collection.contains(6)) // false
```

### Using with Objects

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

// Check using callback
const hasActiveUser = users.contains(user => user.active)
console.log(hasActiveUser) // true

// Check for specific user
const hasJohn = users.contains(user => user.name === 'John')
console.log(hasJohn) // true
```

### Key-Value Checking

```typescript
const data = collect({
  name: 'John Doe',
  age: 30,
  city: 'New York'
})

// Check if key-value pair exists
console.log(data.contains('age', 30)) // true
console.log(data.contains('city', 'Paris')) // false
```

### Real-world Examples

#### Permission Checking

```typescript
interface UserRole {
  id: number
  name: string
  permissions: string[]
}

const role = collect<UserRole>({
  id: 1,
  name: 'admin',
  permissions: ['read', 'write', 'delete']
})

function hasPermission(permission: string): boolean {
  return role.get('permissions').contains(permission)
}

console.log(hasPermission('write')) // true
console.log(hasPermission('modify')) // false
```

#### Product Search

```typescript
interface Product {
  id: number
  name: string
  categories: string[]
  price: number
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', categories: ['electronics', 'computers'], price: 999 },
  { id: 2, name: 'Headphones', categories: ['electronics', 'audio'], price: 199 },
  { id: 3, name: 'Mouse', categories: ['electronics', 'computers'], price: 49 }
])

// Check if we have any products in a specific category
const hasComputerProducts = products.contains(
  product => product.categories.includes('computers')
)
console.log(hasComputerProducts) // true

// Check if we have any products in a price range
const hasAffordableProducts = products.contains(
  product => product.price < 100
)
console.log(hasAffordableProducts) // true
```

### Working with Arrays

```typescript
const fruits = collect(['apple', 'banana', 'orange'])

// Simple value check
console.log(fruits.contains('banana')) // true
console.log(fruits.contains('grape')) // false

// Check using callback
console.log(fruits.contains(fruit => fruit.length > 5)) // true (banana, orange)
```

### Complex Conditions

```typescript
interface Task {
  id: number
  title: string
  priority: number
  dueDate: string
  completed: boolean
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', priority: 1, dueDate: '2024-01-01', completed: false },
  { id: 2, title: 'Task 2', priority: 2, dueDate: '2024-01-15', completed: false },
  { id: 3, title: 'Task 3', priority: 3, dueDate: '2024-02-01', completed: true }
])

// Check for high priority unfinished tasks
const hasUrgentTasks = tasks.contains(task =>
  task.priority > 2 && !task.completed
)

// Check for overdue tasks
const hasOverdueTasks = tasks.contains(task =>
  new Date(task.dueDate) < new Date() && !task.completed
)
```

### Nested Object Checking

```typescript
interface Department {
  name: string
  employees: {
    name: string
    skills: string[]
  }[]
}

const departments = collect<Department>([
  {
    name: 'IT',
    employees: [
      { name: 'John', skills: ['JavaScript', 'TypeScript'] },
      { name: 'Jane', skills: ['Python', 'Java'] }
    ]
  },
  {
    name: 'HR',
    employees: [
      { name: 'Bob', skills: ['Recruiting', 'Training'] }
    ]
  }
])

// Check for department with TypeScript developers
const hasTypeScriptDev = departments.contains(dept =>
  dept.employees.some(emp =>
    emp.skills.includes('TypeScript')
  )
)
console.log(hasTypeScriptDev) // true
```

### Type Safety

```typescript
// Type-safe checking with interfaces
interface MenuItem {
  id: number
  name: string
  price: number
  available: boolean
}

const menu = collect<MenuItem>([
  { id: 1, name: 'Burger', price: 9.99, available: true },
  { id: 2, name: 'Pizza', price: 12.99, available: false }
])

// TypeScript ensures type safety in callbacks
const hasAvailableItems = menu.contains((item): item is MenuItem => {
  return item.available && item.price < 10
})
```

## Return Value

Returns a boolean indicating whether the collection contains the specified item or if any item matches the given callback condition.
