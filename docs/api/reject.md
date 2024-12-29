# Reject Method

The `reject()` method filters items that do NOT pass the given truth test callback. It's essentially the inverse of the `filter()` method.

## Basic Syntax

```typescript
collect(items).reject((item: T, key?: any) => boolean)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Reject even numbers
const numbers = collect([1, 2, 3, 4, 5, 6])
const odds = numbers.reject(number => number % 2 === 0)
console.log(odds.all()) // [1, 3, 5]

// Reject strings with specific length
const words = collect(['hi', 'hello', 'hey', 'goodbye'])
const shortWords = words.reject(word => word.length > 3)
console.log(shortWords.all()) // ['hi', 'hey']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  active: boolean
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', active: true, role: 'admin' },
  { id: 2, name: 'Jane', active: false, role: 'user' },
  { id: 3, name: 'Bob', active: true, role: 'user' }
])

// Reject inactive users
const activeUsers = users.reject(user => !user.active)
console.log(activeUsers.all())
// [
//   { id: 1, name: 'John', active: true, role: 'admin' },
//   { id: 3, name: 'Bob', active: true, role: 'user' }
// ]
```

### Real-world Examples

#### Task Filter System

```typescript
interface Task {
  id: number
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: number
  deadline: Date
}

class TaskManager {
  private tasks: Collection<Task>

  constructor(tasks: Task[]) {
    this.tasks = collect(tasks)
  }

  getActiveTasks() {
    return this.tasks.reject(task =>
      task.status === 'completed' || task.status === 'cancelled'
    )
  }

  getNonUrgentTasks() {
    const now = new Date()
    return this.tasks.reject((task) => {
      const daysUntilDeadline = Math.floor(
        (task.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysUntilDeadline <= 2 || task.priority > 3
    })
  }
}
```

#### Data Validation

```typescript
interface ValidationRule {
  field: string
  test: (value: any) => boolean
  message: string
}

class DataValidator {
  private rules: Collection<ValidationRule>

  constructor() {
    this.rules = collect<ValidationRule>([
      {
        field: 'email',
        test: value => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(value),
        message: 'Invalid email format'
      },
      {
        field: 'age',
        test: value => value >= 18 && value <= 100,
        message: 'Age must be between 18 and 100'
      }
    ])
  }

  getFailedRules(data: Record<string, any>) {
    return this.rules.reject(rule => rule.test(data[rule.field]))
  }
}
```

### Advanced Usage

#### Event Filtering System

```typescript
interface Event {
  id: string
  type: string
  timestamp: Date
  priority: number
  metadata: {
    source: string
    category: string
  }
}

class EventProcessor {
  private events: Collection<Event>

  constructor(events: Event[]) {
    this.events = collect(events)
  }

  getNonCriticalEvents() {
    return this.events.reject((event) => {
      // Reject events that match any critical criteria
      return (
        event.priority >= 8
        || event.type.includes('error')
        || event.metadata.category === 'security'
      )
    })
  }

  getRelevantEvents(context: string) {
    const threshold = new Date()
    threshold.setHours(threshold.getHours() - 24)

    return this.events.reject((event) => {
      // Reject events that are irrelevant to the context
      return (
        event.timestamp < threshold
        || !event.metadata.source.includes(context)
      )
    })
  }
}
```

#### Data Sanitization

```typescript
interface DataRecord {
  id: string
  value: any
  metadata: {
    valid: boolean
    errors: string[]
    lastChecked: Date
  }
}

class DataSanitizer {
  private records: Collection<DataRecord>

  constructor(records: DataRecord[]) {
    this.records = collect(records)
  }

  getCleanData() {
    return this.records.reject((record) => {
      // Reject any record that fails validation criteria
      return (
        !record.metadata.valid
        || record.metadata.errors.length > 0
        || record.value === null
        || record.value === undefined
        || (typeof record.value === 'string' && record.value.trim() === '')
      )
    })
  }

  getOutdatedRecords(maxAge: number) {
    const threshold = new Date()
    threshold.setHours(threshold.getHours() - maxAge)

    return this.records.reject(record =>
      record.metadata.lastChecked >= threshold
    )
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  status: 'active' | 'inactive'
  optional?: boolean
}

const items = collect<TypedItem>([
  { id: 1, value: 'one', status: 'active' },
  { id: 2, value: 'two', status: 'inactive' },
  { id: 3, value: 'three', status: 'active', optional: true }
])

// Type-safe rejections
const activeItems = items.reject(item => item.status === 'inactive')
const requiredItems = items.reject(item => item.optional === true)

// TypeScript ensures type safety in the callback
items.reject((item: TypedItem) => {
  return item.status === 'inactive' // ✓ Valid
  // return item.invalid === true   // ✗ TypeScript error
})
```

## Return Value

- Returns a new Collection instance containing items that did NOT pass the truth test
- Original collection remains unchanged
- If no items are rejected, returns an empty collection
- Maintains type safety with TypeScript
