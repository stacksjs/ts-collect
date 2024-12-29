# Reduce Method

The `reduce()` method reduces the collection to a single value by iterating through the collection and applying an accumulator function to each element. The accumulator function receives the accumulated value, current value, and current index.

## Basic Syntax

```typescript
collect(items).reduce<U>(
  callback: (accumulator: U, current: T, index: number) => U,
  initialValue: U
): U
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Sum numbers
const numbers = collect([1, 2, 3, 4, 5])
const sum = numbers.reduce((acc, num) => acc + num, 0)
console.log(sum) // 15

// Concatenate strings
const words = collect(['Hello', 'world', '!'])
const sentence = words.reduce((acc, word) => `${acc} ${word}`, '').trim()
console.log(sentence) // "Hello world !"
```

### Working with Objects

```typescript
interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

const cart = collect<CartItem>([
  { id: 1, name: 'Item 1', price: 10, quantity: 2 },
  { id: 2, name: 'Item 2', price: 15, quantity: 1 },
  { id: 3, name: 'Item 3', price: 20, quantity: 3 }
])

// Calculate total price
const total = cart.reduce((acc, item) =>
  acc + (item.price * item.quantity), 0)
console.log(total) // 85
```

### Real-world Examples

#### Analytics Aggregator

```typescript
interface MetricPoint {
  timestamp: Date
  value: number
  category: string
}

interface Aggregation {
  sum: number
  count: number
  min: number
  max: number
  avg: number
}

class MetricsAggregator {
  aggregate(points: MetricPoint[]): Aggregation {
    return collect(points).reduce<Aggregation>(
      (acc, point) => ({
        sum: acc.sum + point.value,
        count: acc.count + 1,
        min: Math.min(acc.min, point.value),
        max: Math.max(acc.max, point.value),
        avg: (acc.sum + point.value) / (acc.count + 1)
      }),
      { sum: 0, count: 0, min: Infinity, max: -Infinity, avg: 0 }
    )
  }
}
```

#### Path Builder

```typescript
interface PathSegment {
  type: 'directory' | 'file'
  name: string
}

class PathBuilder {
  buildPath(segments: PathSegment[]): string {
    return collect(segments).reduce((path, segment, index) => {
      if (index === 0)
        return segment.name
      return segment.type === 'directory'
        ? `${path}/${segment.name}`
        : `${path}/${segment.name}`
    }, '')
  }

  buildWindowsPath(segments: PathSegment[]): string {
    return collect(segments).reduce((path, segment, index) => {
      if (index === 0)
        return segment.name
      return `${path}\\${segment.name}`
    }, '')
  }
}
```

### Advanced Usage

#### State Machine

```typescript
interface State {
  name: string
  data: any
}

interface Transition {
  from: string
  to: string
  action: string
  payload?: any
}

class StateMachine {
  processTransitions(
    initialState: State,
    transitions: Transition[]
  ): State {
    return collect(transitions).reduce(
      (currentState, transition) => {
        if (transition.from !== currentState.name) {
          throw new Error('Invalid transition')
        }

        return {
          name: transition.to,
          data: this.processStateData(
            currentState.data,
            transition.action,
            transition.payload
          )
        }
      },
      initialState
    )
  }

  private processStateData(
    currentData: any,
    action: string,
    payload?: any
  ): any {
    // State data processing logic
    return { ...currentData, ...payload }
  }
}
```

#### Query Builder

```typescript
interface QueryPart {
  type: 'select' | 'where' | 'orderBy'
  value: string
}

class QueryBuilder {
  buildQuery(parts: QueryPart[]): string {
    return collect(parts).reduce((query, part, index) => {
      switch (part.type) {
        case 'select':
          return `SELECT ${part.value}`
        case 'where':
          return `${query} WHERE ${part.value}`
        case 'orderBy':
          return `${query} ORDER BY ${part.value}`
        default:
          return query
      }
    }, '')
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: number
  metadata?: Record<string, any>
}

interface Summary {
  total: number
  count: number
  items: number[]
}

const items = collect<TypedItem>([
  { id: 1, value: 10 },
  { id: 2, value: 20, metadata: { important: true } },
  { id: 3, value: 30 }
])

// Type-safe reduction
const summary = items.reduce<Summary>(
  (acc, item) => ({
    total: acc.total + item.value,
    count: acc.count + 1,
    items: [...acc.items, item.id]
  }),
  { total: 0, count: 0, items: [] }
)
```

## Return Value

- Returns a single value of type U (specified by initialValue)
- The value type can be different from the collection item type
- The returned value is built up through each iteration
- Initial value is required and used as starting point
- Type safety is maintained through TypeScript generics
- Can be used with any accumulator value type

## Common Use Cases

### 1. Number Operations

- Summing values
- Calculating averages
- Finding min/max values
- Computing running totals

### 2. String Operations

- Building concatenated strings
- Creating HTML/XML
- Generating formatted text
- Building URLs

### 3. Object Aggregation

- Merging objects
- Building complex objects
- Grouping data
- Creating summaries

### 4. State Management

- Building state objects
- Tracking changes
- Computing derived state
- Managing transitions

### 5. Data Transformation

- Converting data structures
- Building hierarchies
- Reshaping data
- Creating indexes

### 6. Statistical Calculations

- Computing averages
- Calculating variance
- Finding medians
- Building histograms

### 7. Collection Operations

- Grouping items
- Creating maps
- Building sets
- Merging collections

### 8. Tree Operations

- Building tree structures
- Traversing hierarchies
- Computing tree properties
- Accumulating path data

### 9. Query Building

- Constructing SQL queries
- Building API parameters
- Creating filter chains
- Composing URLs

### 10. Report Generation

- Building summaries
- Creating aggregations
- Generating statistics
- Compiling results
