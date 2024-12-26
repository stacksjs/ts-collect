# Filter Method

The `filter()` method creates a new collection containing all elements that pass a given truth test. This method is useful for selecting specific items from a collection based on certain conditions.

## Basic Syntax

```typescript
collect(items).filter((item, index?) => boolean)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

const numbers = collect([1, 2, 3, 4, 5, 6])
const evenNumbers = numbers.filter(num => num % 2 === 0)

console.log(evenNumbers.all()) // [2, 4, 6]
```

### Filtering Objects

```typescript
interface User {
  id: number
  name: string
  age: number
  active: boolean
}

const users = collect<User>([
  { id: 1, name: 'John', age: 25, active: true },
  { id: 2, name: 'Jane', age: 30, active: false },
  { id: 3, name: 'Bob', age: 35, active: true },
  { id: 4, name: 'Alice', age: 28, active: true }
])

// Get active users
const activeUsers = users.filter(user => user.active)
console.log(activeUsers.all())
// [
//   { id: 1, name: 'John', age: 25, active: true },
//   { id: 3, name: 'Bob', age: 35, active: true },
//   { id: 4, name: 'Alice', age: 28, active: true }
// ]

// Get users over 30
const over30 = users.filter(user => user.age > 30)
console.log(over30.all())
// [
//   { id: 3, name: 'Bob', age: 35, active: true }
// ]
```

### Multiple Conditions

```typescript
interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
  category: string
}

const products = collect<Product>([
  { id: 1, name: 'Phone', price: 599, inStock: true, category: 'Electronics' },
  { id: 2, name: 'Laptop', price: 1299, inStock: false, category: 'Electronics' },
  { id: 3, name: 'Book', price: 20, inStock: true, category: 'Books' },
  { id: 4, name: 'Headphones', price: 99, inStock: true, category: 'Electronics' }
])

// Get in-stock electronics under $1000
const affordableElectronics = products.filter(product =>
  product.category === 'Electronics'
  && product.inStock
  && product.price < 1000
)

console.log(affordableElectronics.all())
// [
//   { id: 1, name: 'Phone', price: 599, inStock: true, category: 'Electronics' },
//   { id: 4, name: 'Headphones', price: 99, inStock: true, category: 'Electronics' }
// ]
```

### Using with Type Guards

```typescript
interface BaseItem {
  id: number
  type: string
}

interface BookItem extends BaseItem {
  type: 'book'
  author: string
}

interface MovieItem extends BaseItem {
  type: 'movie'
  director: string
}

type Item = BookItem | MovieItem

const items = collect<Item>([
  { id: 1, type: 'book', author: 'John Doe' },
  { id: 2, type: 'movie', director: 'Jane Smith' },
  { id: 3, type: 'book', author: 'Bob Johnson' }
])

// Filter only books with type guard
const books = items.filter((item): item is BookItem => item.type === 'book')

// TypeScript now knows these are definitely books
books.each(book => console.log(book.author))
```

### Filtering with Index

```typescript
const numbers = collect([10, 20, 30, 40, 50])

// Filter items based on both value and index
const filtered = numbers.filter((value, index) => {
  return value > 20 && index < 3
})

console.log(filtered.all()) // [30]
```

### Chaining with Other Methods

```typescript
interface Task {
  id: number
  title: string
  completed: boolean
  priority: number
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', completed: false, priority: 1 },
  { id: 2, title: 'Task 2', completed: true, priority: 2 },
  { id: 3, title: 'Task 3', completed: false, priority: 3 },
  { id: 4, title: 'Task 4', completed: true, priority: 1 }
])

// Get high priority incomplete tasks, sorted by priority
const highPriorityTasks = tasks
  .filter(task => !task.completed && task.priority > 1)
  .sortBy('priority')
  .all()

console.log(highPriorityTasks)
// [
//   { id: 3, title: 'Task 3', completed: false, priority: 3 }
// ]
```

### Working with Nested Data

```typescript
interface Department {
  name: string
  employees: {
    id: number
    name: string
    salary: number
  }[]
}

const departments = collect<Department>([
  {
    name: 'IT',
    employees: [
      { id: 1, name: 'John', salary: 60000 },
      { id: 2, name: 'Jane', salary: 70000 }
    ]
  },
  {
    name: 'HR',
    employees: [
      { id: 3, name: 'Bob', salary: 55000 },
      { id: 4, name: 'Alice', salary: 65000 }
    ]
  }
])

// Filter departments that have employees with salary > 65000
const highPayDepts = departments
  .filter(dept => dept.employees
    .some(emp => emp.salary > 65000)
  )

console.log(highPayDepts.all())
// [
//   {
//     name: 'IT',
//     employees: [
//       { id: 1, name: 'John', salary: 60000 },
//       { id: 2, name: 'Jane', salary: 70000 }
//     ]
//   }
// ]
```

## Type Safety

The filter method maintains type safety and can be used with type guards to narrow types:

```typescript
interface BaseItem {
  type: string
  id: number
}

interface SpecialItem extends BaseItem {
  type: 'special'
  extraData: string
}

// Using type guard with filter
const items = collect<BaseItem>([...])
const specialItems = items
  .filter((item): item is SpecialItem => item.type === 'special')

// TypeScript knows these items have extraData
specialItems.each(item => console.log(item.extraData))
```

## Return Value

Returns a new Collection instance containing all elements that pass the truth test.
