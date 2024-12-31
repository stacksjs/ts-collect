# Unfold Method

The `unfold()` method generates a collection by repeatedly applying a function that produces both a value and the next state. It continues until the function returns null, making it ideal for generating sequences or expanding state-based data.

## Basic Syntax

```typescript
unfold<U>(fn: (seed: U) => [T, U] | null, initial: U): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Generate Fibonacci sequence up to 100
const fibonacci = collect([0]).unfold((prev) => {
  const next = prev + prev
  return next > 100 ? null : [next, next]
}, 1)

console.log(fibonacci.all())
// [1, 2, 4, 8, 16, 32, 64]
```

### Working with Complex States

```typescript
interface PricePoint {
  day: number
  price: number
}

// Generate daily prices with 5% random variation
const priceGenerator = collect([]).unfold((state) => {
  if (state.day > 7) return null // One week of prices

  const variation = (Math.random() - 0.5) * 0.05
  const newPrice = state.price * (1 + variation)

  return [{
    day: state.day,
    price: newPrice
  }, {
    day: state.day + 1,
    price: newPrice
  }]
}, { day: 1, price: 100 })
```

### Real-world Example: E-commerce Inventory Projection

```typescript
interface InventoryState {
  date: Date
  stock: number
  reorderPoint: number
  onOrder: number
  dailyDemand: number
}

interface InventorySnapshot {
  date: Date
  currentStock: number
  expectedDeliveries: number
  projectedDemand: number
  needsReorder: boolean
}

class InventoryProjector {
  projectInventory(
    initialState: InventoryState,
    daysToProject: number
  ): Collection<InventorySnapshot> {
    return collect([]).unfold((state) => {
      // Stop if we've projected enough days
      const daysDiff = Math.floor(
        (state.date.getTime() - initialState.date.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysDiff >= daysToProject) return null

      // Calculate next day's state
      const nextDate = new Date(state.date)
      nextDate.setDate(nextDate.getDate() + 1)

      // Simulate stock changes
      const expectedDemand = state.dailyDemand * (1 + (Math.random() - 0.5) * 0.2)
      const deliveries = state.onOrder > 0 ? Math.min(state.onOrder, 100) : 0
      const newStock = state.stock - expectedDemand + deliveries

      // Create snapshot
      const snapshot: InventorySnapshot = {
        date: state.date,
        currentStock: state.stock,
        expectedDeliveries: state.onOrder,
        projectedDemand: expectedDemand,
        needsReorder: newStock < state.reorderPoint
      }

      // Prepare next state
      const nextState: InventoryState = {
        date: nextDate,
        stock: Math.max(0, newStock),
        reorderPoint: state.reorderPoint,
        onOrder: Math.max(0, state.onOrder - deliveries),
        dailyDemand: state.dailyDemand
      }

      return [snapshot, nextState]
    }, initialState)
  }
}

// Usage
const projector = new InventoryProjector()
const projection = projector.projectInventory({
  date: new Date(),
  stock: 1000,
  reorderPoint: 200,
  onOrder: 0,
  dailyDemand: 50
}, 30) // Project 30 days
```

## Type Safety

```typescript
interface State {
  count: number
  value: string
}

// Type-safe unfolding
const sequence = collect([]).unfold((state: State) => {
  if (state.count >= 3) return null

  return [{
    iteration: state.count,
    data: state.value
  }, {
    count: state.count + 1,
    value: state.value + '!'
  }]
}, { count: 0, value: 'Hello' })

// TypeScript enforces return type structure
type SequenceItem = {
  iteration: number
  data: string
}
```

## Return Value

- Returns a Collection of generated values
- Continues until function returns null
- Each iteration produces value and next state
- Maintains type safety through generics
- Preserves collection chain methods
- Empty collection if initial function returns null

## Common Use Cases

### 1. Sequence Generation

- Numeric sequences
- Date ranges
- ID generation
- Pattern creation
- Series expansion

### 2. State Projection

- Inventory forecasting
- Growth modeling
- Balance projection
- Trend prediction
- Usage simulation

### 3. Data Generation

- Test data creation
- Sample generation
- Mock data sets
- Pattern simulation
- Scenario modeling

### 4. Time Series

- Date progressions
- Event sequences
- Schedule generation
- Timeline creation
- Period calculations

### 5. Resource Planning

- Capacity planning
- Resource allocation
- Demand forecasting
- Supply projection
- Usage patterns
