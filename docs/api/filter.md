# Filter Method

The `filter()` method creates a new collection containing all items that pass a given truth test provided by a predicate function. The predicate receives both the current item and its index.

## Basic Syntax

```typescript
collect(items).filter((item: T, index: number) => boolean): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Filter numbers
const numbers = collect([1, 2, 3, 4, 5])
const evenNumbers = numbers.filter(n => n % 2 === 0)
console.log(evenNumbers.all()) // [2, 4]

// Using the index parameter
const indexFiltered = numbers.filter((n, i) => i < 3)
console.log(indexFiltered.all()) // [1, 2, 3]
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

// Filter active users
const activeUsers = users.filter(user => user.active)

// Filter by role and status
const activeAdmins = users.filter(user =>
  user.active && user.role === 'admin'
)
```

### Real-world Examples

#### Permission System

```typescript
interface Permission {
  resource: string
  action: 'read' | 'write' | 'delete'
  granted: boolean
  conditions?: Record<string, any>
}

class PermissionChecker {
  private permissions: Collection<Permission>

  constructor(permissions: Permission[]) {
    this.permissions = collect(permissions)
  }

  getGrantedPermissions(resource: string): Permission[] {
    return this.permissions
      .filter(permission =>
        permission.resource === resource
        && permission.granted
        && this.validateConditions(permission.conditions)
      )
      .all()
  }

  private validateConditions(conditions?: Record<string, any>): boolean {
    // Conditions validation logic
    return true
  }
}
```

#### Task Queue

```typescript
interface Task {
  id: string
  priority: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  attempts: number
  lastAttempt?: Date
}

class TaskQueue {
  private tasks: Collection<Task>
  private readonly maxAttempts = 3

  constructor(tasks: Task[]) {
    this.tasks = collect(tasks)
  }

  getProcessableTasks(): Task[] {
    const now = new Date()
    return this.tasks
      .filter((task) => {
        // Filter based on multiple conditions
        const isEligible
          = task.status === 'pending'
          || (task.status === 'failed' && task.attempts < this.maxAttempts)

        if (!isEligible)
          return false

        // Check cooldown period if there was a previous attempt
        if (task.lastAttempt) {
          const cooldownPeriod = 5 * 60 * 1000 // 5 minutes
          return now.getTime() - task.lastAttempt.getTime() > cooldownPeriod
        }

        return true
      })
      .sortBy('priority')
      .all()
  }
}
```

### Advanced Usage

#### Data Validator

```typescript
interface ValidationRule<T> {
  field: keyof T
  validate: (value: any) => boolean
  message: string
}

class DataValidator<T> {
  private rules: ValidationRule<T>[]

  constructor(rules: ValidationRule<T>[]) {
    this.rules = rules
  }

  validate(data: T[]): Collection<T> {
    return collect(data).filter((item) => {
      return this.rules.every((rule) => {
        const value = item[rule.field]
        return rule.validate(value)
      })
    })
  }
}

// Usage
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const validator = new DataValidator<Product>([
  {
    field: 'price',
    validate: price => price > 0,
    message: 'Price must be positive'
  },
  {
    field: 'stock',
    validate: stock => stock >= 0,
    message: 'Stock cannot be negative'
  }
])
```

#### Event Processor

```typescript
interface Event {
  type: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
  data: any
  processed: boolean
}

class EventProcessor {
  private events: Collection<Event>
  private readonly processingWindow = 24 * 60 * 60 * 1000 // 24 hours

  constructor(events: Event[]) {
    this.events = collect(events)
  }

  getUnprocessedCriticalEvents(): Event[] {
    const cutoffTime = new Date(Date.now() - this.processingWindow)

    return this.events
      .filter((event) => {
        // Multiple filter conditions
        return (
          !event.processed
          && event.severity === 'high'
          && event.timestamp >= cutoffTime
          && this.isValidEventData(event.data)
        )
      })
      .sortBy('timestamp')
      .all()
  }

  private isValidEventData(data: any): boolean {
    // Data validation logic
    return true
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  status: 'active' | 'inactive'
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, value: 'one', status: 'active' },
  { id: 2, value: 'two', status: 'inactive' },
  { id: 3, value: 'three', status: 'active', metadata: { important: true } }
])

// Type-safe filtering
const activeItems = items.filter(item => item.status === 'active')
const importantItems = items.filter(item => item.metadata?.important === true)

// TypeScript enforces proper property access
items.filter((item) => {
  return item.status === 'active' // ✓ Valid
  // return item.invalid === true  // ✗ TypeScript error
})
```

## Return Value

- Returns a new Collection instance containing only items that pass the predicate
- Original collection remains unchanged
- Collection length may be shorter than original collection
- Items maintain their original type
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Index parameter is optional in predicate function

## Common Use Cases

### 1. Status Filtering

- Filtering active/inactive items
- Finding completed tasks
- Identifying valid records
- Filtering enabled features

### 2. Data Validation

- Removing invalid entries
- Filtering out malformed data
- Validating business rules
- Checking data integrity

### 3. Permission Checking

- Filtering accessible resources
- Checking user permissions
- Validating access rights
- Filtering authorized operations

### 4. Date-based Filtering

- Finding recent items
- Filtering by date range
- Getting upcoming events
- Finding expired records

### 5. Search and Query

- Implementing search functionality
- Filtering by keywords
- Finding matching records
- Query result filtering

### 6. State Management

- Filtering by state
- Finding items in specific states
- Identifying state transitions
- Managing workflow states

### 7. Error Handling

- Filtering successful operations
- Identifying failed operations
- Finding error conditions
- Validating process results

### 8. Business Rules

- Applying business logic
- Enforcing constraints
- Validating requirements
- Checking conditions

### 9. Data Cleanup

- Removing duplicates
- Filtering null values
- Removing empty entries
- Sanitizing data sets

### 10. Performance Optimization

- Filtering unnecessary data
- Reducing data sets
- Optimizing processing
- Filtering for efficiency
