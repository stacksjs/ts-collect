# FlatMap Method

The `flatMap()` method maps each element in the collection using a callback function, then flattens the result into a single collection. It's particularly useful when your mapping operation returns arrays that you want to combine.

## Basic Syntax

```typescript
collect(items).flatMap<U>((item: T, index: number) => U[]): Collection<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Expand numbers into ranges
const numbers = collect([1, 2, 3])
const expanded = numbers.flatMap(n => [n, n + 0.5])
console.log(expanded.all()) // [1, 1.5, 2, 2.5, 3, 3.5]

// Split strings and combine
const words = collect(['hello world', 'typescript rocks'])
const allWords = words.flatMap(str => str.split(' '))
console.log(allWords.all()) // ['hello', 'world', 'typescript', 'rocks']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  roles: string[]
}

interface UserRole {
  userId: number
  userName: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', roles: ['admin', 'user'] },
  { id: 2, name: 'Jane', roles: ['user'] }
])

// Expand users into role-specific records
const userRoles = users.flatMap<UserRole>(user =>
  user.roles.map(role => ({
    userId: user.id,
    userName: user.name,
    role
  }))
)

console.log(userRoles.all())
// [
//   { userId: 1, userName: 'John', role: 'admin' },
//   { userId: 1, userName: 'John', role: 'user' },
//   { userId: 2, userName: 'Jane', role: 'user' }
// ]
```

### Real-world Examples

#### Permission Expander

```typescript
interface Permission {
  resource: string
  actions: string[]
  conditions?: string[]
}

interface ExpandedPermission {
  resource: string
  action: string
  condition?: string
}

class PermissionExpander {
  expandPermissions(permissions: Permission[]): Collection<ExpandedPermission> {
    return collect(permissions).flatMap((permission) => {
      const basePermissions = permission.actions.map(action => ({
        resource: permission.resource,
        action
      }))

      if (!permission.conditions) {
        return basePermissions
      }

      return basePermissions.flatMap(base =>
        permission.conditions!.map(condition => ({
          ...base,
          condition
        }))
      )
    })
  }
}
```

#### Event Schedule Generator

```typescript
interface EventTemplate {
  name: string
  weekdays: number[]
  timeSlots: string[]
}

interface ScheduledEvent {
  name: string
  datetime: Date
  duration: number
}

class EventScheduler {
  generateEvents(
    template: EventTemplate,
    startDate: Date,
    weeks: number
  ): Collection<ScheduledEvent> {
    const dates = this.generateDates(startDate, weeks)

    return collect(dates).flatMap(date =>
      template.weekdays.includes(date.getDay())
        ? template.timeSlots.map(timeSlot => ({
            name: template.name,
            datetime: this.combineDateTime(date, timeSlot),
            duration: 60 // minutes
          }))
        : []
    )
  }

  private generateDates(start: Date, weeks: number): Date[] {
    // Generate array of dates for the specified weeks
    return []
  }

  private combineDateTime(date: Date, timeSlot: string): Date {
    // Combine date and time slot into DateTime
    return new Date()
  }
}
```

### Advanced Usage

#### Query Parameter Builder

```typescript
interface QueryFilter {
  field: string
  operators: string[]
  values: any[]
}

interface QueryParameter {
  key: string
  value: string
  operator: string
}

class QueryBuilder {
  buildParameters(filters: QueryFilter[]): Collection<QueryParameter> {
    return collect(filters).flatMap(filter =>
      filter.operators.flatMap(operator =>
        filter.values.map(value => ({
          key: filter.field,
          value: String(value),
          operator
        }))
      )
    )
  }

  generateQueryString(filters: QueryFilter[]): string {
    return this.buildParameters(filters)
      .map(param =>
        `${param.key}${param.operator}${encodeURIComponent(param.value)}`
      )
      .join('&')
  }
}
```

#### Tree Traversal

```typescript
interface TreeNode<T> {
  value: T
  children: TreeNode<T>[]
}

class TreeTraverser<T> {
  flattenTree(root: TreeNode<T>): Collection<T> {
    return collect([root]).flatMap(node => [
      node.value,
      ...this.flattenChildren(node.children)
    ])
  }

  private flattenChildren(nodes: TreeNode<T>[]): T[] {
    return collect(nodes).flatMap(node => [
      node.value,
      ...this.flattenChildren(node.children)
    ]).all()
  }

  getLeafNodes(root: TreeNode<T>): Collection<T> {
    return collect([root]).flatMap(node =>
      node.children.length === 0
        ? [node.value]
        : this.getLeafNodes(node.children).all()
    )
  }
}
```

## Type Safety

```typescript
interface SourceType {
  id: number
  values: string[]
}

interface TargetType {
  sourceId: number
  value: string
  index: number
}

const items = collect<SourceType>([
  { id: 1, values: ['a', 'b'] },
  { id: 2, values: ['c'] }
])

// Type-safe transformation with index
const result = items.flatMap<TargetType>((item, sourceIndex) =>
  item.values.map((value, valueIndex) => ({
    sourceId: item.id,
    value,
    index: sourceIndex * 100 + valueIndex
  }))
)
```

## Return Value

- Returns a new Collection instance containing all flattened and mapped items
- Transforms each item into an array of new items
- Concatenates all resulting arrays into a single flat collection
- Original collection remains unchanged
- Maintains type safety with TypeScript through generics
- Can be chained with other collection methods
- Index parameter in callback is optional

## Common Use Cases

### 1. Data Expansion

- Expanding nested arrays
- Converting one-to-many relationships
- Generating combinations
- Creating data permutations

### 2. Permission Processing

- Expanding role permissions
- Generating access rules
- Creating security policies
- Processing authorization rules

### 3. Event Generation

- Creating recurring events
- Generating schedules
- Expanding time slots
- Processing calendar data

### 4. Query Building

- Generating query parameters
- Building search criteria
- Creating filter combinations
- Expanding search terms

### 5. Data Transformation

- Converting complex structures
- Processing nested data
- Flattening hierarchies
- Normalizing data structures

### 6. Text Processing

- Tokenizing text
- Processing sentences
- Extracting keywords
- Generating variations

### 7. Tree Operations

- Flattening tree structures
- Processing hierarchical data
- Extracting node information
- Traversing graphs

### 8. Relationship Mapping

- Processing many-to-many relationships
- Expanding associations
- Generating connection maps
- Creating relationship matrices

### 9. Configuration Expansion

- Processing configuration templates
- Generating settings combinations
- Expanding rule sets
- Creating configuration variants

### 10. Dataset Generation

- Creating test data
- Generating sample sets
- Producing data variations
- Building training datasets
