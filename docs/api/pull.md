# Pull Method

The `pull()` method removes and returns an item from the collection by its key. The original collection is modified in the process.

## Basic Syntax

```typescript
collect(items).pull(key: string | number)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// With arrays
const numbers = collect([1, 2, 3, 4, 5])
const pulled = numbers.pull(2) // Pull item at index 2

console.log(pulled) // 3
console.log(numbers.all()) // [1, 2, 4, 5]

// With objects
const data = collect({ name: 'John', age: 30, city: 'New York' })
const age = data.pull('age')

console.log(age) // 30
console.log(data.all()) // { name: 'John', city: 'New York' }
```

### Working with Complex Types

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' }
])

const secondUser = users.pull(1) // Pull index 1
console.log(secondUser) // { id: 2, name: 'Jane', role: 'user' }
console.log(users.all()) // [{ id: 1, ... }, { id: 3, ... }]
```

### Real-world Examples

#### Task Queue Management

```typescript
interface Task {
  id: string
  type: string
  priority: number
  data: any
}

class TaskQueue {
  private tasks: Collection<Task>

  constructor() {
    this.tasks = collect<Task>([])
  }

  addTask(task: Task) {
    this.tasks.push(task)
  }

  pullTask(taskId: string): Task | undefined {
    const index = this.tasks.findIndex(task => task.id === taskId)
    if (index !== -1) {
      return this.tasks.pull(index)
    }
    return undefined
  }

  getRemaining(): number {
    return this.tasks.count()
  }
}

// Usage
const queue = new TaskQueue()
queue.addTask({
  id: 'task1',
  type: 'email',
  priority: 1,
  data: { to: 'user@example.com' }
})

const pulledTask = queue.pullTask('task1')
```

#### Shopping Cart

```typescript
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

class ShoppingCart {
  private items: Collection<CartItem>

  constructor() {
    this.items = collect<CartItem>([])
  }

  addItem(item: CartItem) {
    this.items.push(item)
  }

  removeItem(index: number): CartItem | undefined {
    return this.items.pull(index)
  }

  getTotal(): number {
    return this.items.sum(item => item.price * item.quantity)
  }
}
```

### Advanced Usage

#### State Management

```typescript
interface State {
  key: string
  value: any
  timestamp: number
}

class StateManager {
  private states: Collection<State>

  constructor() {
    this.states = collect<State>([])
  }

  setState(key: string, value: any) {
    this.states.push({
      key,
      value,
      timestamp: Date.now()
    })
  }

  removeState(index: number): State | undefined {
    const state = this.states.pull(index)
    console.log(`State removed at ${new Date().toISOString()}`)
    return state
  }

  getStates(): State[] {
    return this.states.all()
  }
}
```

#### Document Management

```typescript
interface Document {
  id: string
  title: string
  content: string
  metadata: {
    created: Date
    modified: Date
    version: number
  }
}

class DocumentManager {
  private documents: Collection<Document>

  constructor() {
    this.documents = collect<Document>([])
  }

  addDocument(doc: Document) {
    this.documents.push(doc)
  }

  archiveDocument(index: number): Document | undefined {
    const doc = this.documents.pull(index)
    if (doc) {
      console.log(`Document ${doc.id} archived`)
      // Additional archiving logic here
    }
    return doc
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  optional?: boolean
}

const items = collect<TypedItem>([
  { id: 1, value: 'first' },
  { id: 2, value: 'second', optional: true }
])

// Type-safe pull operation
const item: TypedItem | undefined = items.pull(0)
if (item) {
  console.log(item.id) // TypeScript knows this is safe
  console.log(item.value) // TypeScript knows this is safe
  console.log(item.optional) // TypeScript knows this is optional
}
```

## Return Value

- Returns the removed item from the collection
- Returns undefined if the key doesn't exist
- Modifies the original collection by removing the item
- For arrays, removes the item at the specified index
- For objects, removes the item with the specified key
