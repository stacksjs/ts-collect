# Make Method

The `make()` method is a static method that creates a new collection instance. It's an alternative to using the `collect()` helper function and is particularly useful when you need explicit typing.

## Basic Syntax

```typescript
// Create a new collection
Collection.make<T>(items?: T[])
```

## Examples

### Basic Usage

```typescript
import { Collection } from '@stacksjs/ts-collect'

// Create an empty collection
const empty = Collection.make()

// Create a collection with items
const numbers = Collection.make([1, 2, 3, 4, 5])

// Create a typed collection
const strings = Collection.make<string>(['a', 'b', 'c'])
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Create a typed collection of users
const users = Collection.make<User>([
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' }
])

// Use collection methods
console.log(users.pluck('name').all()) // ['John', 'Jane']
```

### Real-world Examples

#### Data Repository Pattern

```typescript
interface Repository<T> {
  all: () => Collection<T>
  find: (id: number) => T | undefined
  create: (item: T) => void
}

interface Product {
  id: number
  name: string
  price: number
}

class ProductRepository implements Repository<Product> {
  private products: Collection<Product>

  constructor(initialData: Product[] = []) {
    this.products = Collection.make<Product>(initialData)
  }

  all(): Collection<Product> {
    return this.products
  }

  find(id: number): Product | undefined {
    return this.products.firstWhere('id', id)
  }

  create(product: Product): void {
    this.products = Collection.make([...this.products.all(), product])
  }
}

// Usage
const repository = new ProductRepository([
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 59 }
])
```

#### Form Data Management

```typescript
interface FormField {
  name: string
  value: any
  validation: string[]
  errors: string[]
}

class FormManager {
  private fields: Collection<FormField>

  constructor() {
    this.fields = Collection.make<FormField>()
  }

  addField(field: FormField) {
    this.fields = Collection.make([...this.fields.all(), field])
  }

  validate(): boolean {
    return this.fields.every(field => field.errors.length === 0)
  }

  getValues() {
    return this.fields.mapWithKeys(field => [field.name, field.value])
  }
}

// Usage
const form = new FormManager()
form.addField({
  name: 'email',
  value: 'test@example.com',
  validation: ['required', 'email'],
  errors: []
})
```

### Advanced Usage

#### Generic Data Structures

```typescript
class Stack<T> {
  private items: Collection<T>

  constructor() {
    this.items = Collection.make<T>()
  }

  push(item: T): void {
    this.items = Collection.make([...this.items.all(), item])
  }

  pop(): T | undefined {
    const items = this.items.all()
    const lastItem = items.pop()
    this.items = Collection.make(items)
    return lastItem
  }

  peek(): T | undefined {
    return this.items.last()
  }
}

// Usage
const stack = new Stack<number>()
stack.push(1)
stack.push(2)
console.log(stack.pop()) // 2
```

### Type Safety

```typescript
// Strict typing with interfaces
interface TypedItem {
  id: number
  value: string
  metadata?: Record<string, any>
}

// Create with type assertion
const typedCollection = Collection.make<TypedItem>([
  { id: 1, value: 'one' },
  { id: 2, value: 'two', metadata: { extra: 'info' } }
])

// TypeScript will enforce the interface
typedCollection.push({ id: 3, value: 'three' }) // ✓ Valid
// typedCollection.push({ id: 4 }) // ✗ TypeScript error: missing value property
```

### Factory Pattern

```typescript
interface DataProvider<T> {
  getData: () => Collection<T>
}

class ArrayDataProvider<T> implements DataProvider<T> {
  constructor(private data: T[]) {}

  getData(): Collection<T> {
    return Collection.make(this.data)
  }
}

class ApiDataProvider<T> implements DataProvider<T> {
  constructor(private apiUrl: string) {}

  async getData(): Promise<Collection<T>> {
    const response = await fetch(this.apiUrl)
    const data = await response.json()
    return Collection.make(data)
  }
}

// Usage
interface TodoItem {
  id: number
  title: string
  completed: boolean
}

const localProvider = new ArrayDataProvider<TodoItem>([
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true }
])

const todos = localProvider.getData()
```

## Return Value

- Returns a new Collection instance
- The collection will be typed if a generic type parameter is provided
- Returns an empty collection if no items are provided
