# GroupBy Method

The `groupBy()` method groups the collection's items by a given key or callback function. It returns a Map where each key contains a collection of items that match that key.

## Basic Syntax

```typescript
// Group by property key
collect(items).groupBy(key: keyof T): Map<any, Collection<T>>

// Group by callback function
collect(items).groupBy(callback: (item: T) => any): Map<any, Collection<T>>
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Group by simple property
const users = collect([
  { role: 'admin', name: 'John' },
  { role: 'user', name: 'Jane' },
  { role: 'admin', name: 'Bob' }
])

const byRole = users.groupBy('role')
console.log(byRole.get('admin').all())
// [
//   { role: 'admin', name: 'John' },
//   { role: 'admin', name: 'Bob' }
// ]

// Group by callback
const numbers = collect([1, 2, 3, 4, 5, 6])
const byEvenOdd = numbers.groupBy(num => num % 2 === 0 ? 'even' : 'odd')
```

### Working with Objects

```typescript
interface Transaction {
  id: number
  amount: number
  category: string
  date: Date
}

const transactions = collect<Transaction>([
  { id: 1, amount: 100, category: 'food', date: new Date('2024-01-01') },
  { id: 2, amount: 200, category: 'transport', date: new Date('2024-01-01') },
  { id: 3, amount: 150, category: 'food', date: new Date('2024-01-02') }
])

// Group by category
const byCategory = transactions.groupBy('category')

// Group by date using callback
const byDate = transactions.groupBy(trans =>
  trans.date.toISOString().split('T')[0]
)
```

### Real-world Examples

#### Order Management

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total: number
  customerId: string
  items: string[]
}

class OrderManager {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getOrdersByStatus(): Map<string, Collection<Order>> {
    return this.orders.groupBy('status')
  }

  getOrdersByCustomer(): Map<string, Collection<Order>> {
    return this.orders.groupBy('customerId')
  }

  getOrdersByValueTier(): Map<string, Collection<Order>> {
    return this.orders.groupBy((order) => {
      if (order.total < 100)
        return 'small'
      if (order.total < 500)
        return 'medium'
      return 'large'
    })
  }
}
```

#### Analytics System

```typescript
interface Event {
  timestamp: Date
  eventType: string
  userId: string
  metadata: Record<string, any>
}

class AnalyticsProcessor {
  private events: Collection<Event>

  constructor(events: Event[]) {
    this.events = collect(events)
  }

  getEventsByType(): Map<string, Collection<Event>> {
    return this.events.groupBy('eventType')
  }

  getEventsByHour(): Map<number, Collection<Event>> {
    return this.events.groupBy(event => event.timestamp.getHours())
  }

  getEventsByUser(): Map<string, Collection<Event>> {
    return this.events.groupBy('userId')
  }

  getEventsByTimeframe(): Map<string, Collection<Event>> {
    return this.events.groupBy((event) => {
      const hour = event.timestamp.getHours()
      if (hour < 6)
        return 'night'
      if (hour < 12)
        return 'morning'
      if (hour < 18)
        return 'afternoon'
      return 'evening'
    })
  }
}
```

### Advanced Usage

#### Multi-level Grouping

```typescript
interface Student {
  id: string
  grade: number
  class: string
  subject: string
  score: number
}

class GradeAnalyzer {
  private scores: Collection<Student>

  constructor(scores: Student[]) {
    this.scores = collect(scores)
  }

  getScoresByGradeAndClass(): Map<number, Map<string, Collection<Student>>> {
    const byGrade = this.scores.groupBy('grade')

    return new Map([...byGrade].map(([grade, students]) => [
      grade,
      students.groupBy('class')
    ]))
  }

  getAveragesBySubject(): Map<string, number> {
    const bySubject = this.scores.groupBy('subject')
    return new Map([...bySubject].map(([subject, students]) => [
      subject,
      students.avg('score')
    ]))
  }
}
```

#### Dynamic Grouping

```typescript
type GroupingStrategy = 'status' | 'priority' | 'assignee' | 'custom'

interface Task {
  id: string
  title: string
  status: string
  priority: number
  assignee: string
  tags: string[]
}

class TaskOrganizer {
  private tasks: Collection<Task>

  constructor(tasks: Task[]) {
    this.tasks = collect(tasks)
  }

  groupTasks(strategy: GroupingStrategy): Map<any, Collection<Task>> {
    switch (strategy) {
      case 'status':
        return this.tasks.groupBy('status')
      case 'priority':
        return this.tasks.groupBy(task =>
          task.priority <= 1
            ? 'low'
            : task.priority <= 3 ? 'medium' : 'high'
        )
      case 'assignee':
        return this.tasks.groupBy('assignee')
      case 'custom':
        return this.tasks.groupBy(task =>
          task.tags.length ? task.tags[0] : 'untagged'
        )
    }
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  category: string
  value: number
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, category: 'A', value: 100 },
  { id: 2, category: 'B', value: 200 },
  { id: 3, category: 'A', value: 300 }
])

// Type-safe property grouping
const byCategory = items.groupBy('category')
const byValueRange = items.groupBy(item => item.value > 200 ? 'high' : 'low')

// Type checking on grouped collections
byCategory.get('A')?.each((item) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a Map object where:
  - Keys are the grouping values
  - Values are Collections containing matching items
- Each sub-collection maintains the original item types
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can handle undefined/null values
- Can be chained with other collection methods

## Common Use Cases

### 1. Data Organization

- Category grouping
- Status organization
- Type classification
- Data clustering

### 2. Analysis

- Data segmentation
- Pattern analysis
- Distribution studies
- Trend identification

### 3. Reporting

- Data aggregation
- Summary creation
- Results grouping
- Category analysis

### 4. User Management

- Role-based grouping
- Permission management
- User categorization
- Access control

### 5. Financial Analysis

- Transaction grouping
- Category analysis
- Expense tracking
- Revenue classification

### 6. Time-based Analysis

- Time period grouping
- Event organization
- Schedule management
- Timeline creation

### 7. Resource Management

- Resource allocation
- Capacity planning
- Usage tracking
- Asset organization

### 8. Performance Analysis

- Metric grouping
- Result classification
- Performance tracking
- Benchmark organization

### 9. Content Management

- Content organization
- Category management
- Tag grouping
- Hierarchy creation

### 10. Inventory Management

- Product categorization
- Stock organization
- Supply grouping
- Location tracking
