# Pad Method

The `pad()` method will fill an array with the given value until the array reaches the specified size. You can optionally specify which side to pad the array (left, right, or both).

## Basic Syntax

```typescript
collect(items).pad(size: number, value: any, side?: 'left' | 'right' | 'both')
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Right padding (default)
const numbers = collect([1, 2, 3])
console.log(numbers.pad(5, 0).all())
// [1, 2, 3, 0, 0]

// Left padding
console.log(numbers.pad(5, 0, 'left').all())
// [0, 0, 1, 2, 3]

// Both sides
console.log(numbers.pad(5, 0, 'both').all())
// [0, 1, 2, 3, 0]
```

### Working with Different Types

```typescript
// Strings
const words = collect(['hello', 'world'])
console.log(words.pad(4, 'empty').all())
// ['hello', 'world', 'empty', 'empty']

// Objects
interface Item {
  id: number
  value: string
}

const defaultItem: Item = { id: 0, value: 'default' }
const items = collect<Item>([
  { id: 1, value: 'first' }
])

console.log(items.pad(3, defaultItem).all())
// [
//   { id: 1, value: 'first' },
//   { id: 0, value: 'default' },
//   { id: 0, value: 'default' }
// ]
```

### Real-world Examples

#### Grid System

```typescript
interface GridCell {
  content: string | null
  position: number
}

class Grid {
  private cells: Collection<GridCell>

  constructor(content: string[], size: number) {
    this.cells = collect(content.map((c, i) => ({
      content: c,
      position: i
    })))

    // Pad to fill grid
    this.cells = this.cells.pad(size, {
      content: null,
      position: -1
    })
  }

  render() {
    return this.cells.all()
  }
}

// Usage
const grid = new Grid(['A', 'B', 'C'], 6)
console.log(grid.render())
// [
//   { content: 'A', position: 0 },
//   { content: 'B', position: 1 },
//   { content: 'C', position: 2 },
//   { content: null, position: -1 },
//   { content: null, position: -1 },
//   { content: null, position: -1 }
// ]
```

#### Calendar Display

```typescript
interface CalendarDay {
  date: Date | null
  events: string[]
  isCurrentMonth: boolean
}

class CalendarWeek {
  private days: Collection<CalendarDay>

  constructor(startingDays: CalendarDay[]) {
    this.days = collect(startingDays)

    // Pad to 7 days if needed
    const emptyDay: CalendarDay = {
      date: null,
      events: [],
      isCurrentMonth: false
    }

    this.days = this.days.pad(7, emptyDay)
  }

  getDays() {
    return this.days.all()
  }
}

// Usage
const weekDays: CalendarDay[] = [
  {
    date: new Date('2024-01-01'),
    events: ['New Year'],
    isCurrentMonth: true
  },
  {
    date: new Date('2024-01-02'),
    events: [],
    isCurrentMonth: true
  }
]

const week = new CalendarWeek(weekDays)
```

### Advanced Usage

#### Matrix Operations

```typescript
class Matrix {
  private data: Collection<number[]>

  constructor(rows: number[][], size: number) {
    this.data = collect(rows)

    // Pad rows to make square matrix
    this.data = this.data.map(row =>
      collect(row).pad(size, 0).all()
    )

    // Pad to add missing rows
    this.data = this.data.pad(size, new Array(size).fill(0))
  }

  getMatrix() {
    return this.data.all()
  }
}

// Usage
const matrix = new Matrix([
  [1, 2],
  [3, 4]
], 3)

console.log(matrix.getMatrix())
// [
//   [1, 2, 0],
//   [3, 4, 0],
//   [0, 0, 0]
// ]
```

#### Data Normalization

```typescript
interface DataPoint {
  timestamp: Date
  value: number | null
}

class TimeseriesData {
  private data: Collection<DataPoint>

  constructor(points: DataPoint[], totalPoints: number) {
    this.data = collect(points)

    const defaultPoint: DataPoint = {
      timestamp: new Date(),
      value: null
    }

    // Fill missing points
    this.data = this.data.pad(totalPoints, defaultPoint)
  }

  getData() {
    return this.data.all()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number | null
  value: string | null
}

const items = collect<TypedItem>([
  { id: 1, value: 'one' }
])

const defaultItem: TypedItem = { id: null, value: null }

// Type-safe padding
const padded = items.pad(3, defaultItem)

// TypeScript ensures type consistency
type ResultType = typeof padded.all() // TypedItem[]
```

## Return Value

- Returns a new Collection instance containing the padded array
- The original collection remains unchanged
- The resulting array will have the specified size
- Padding elements are added according to the specified side:
  - 'right' (default): adds elements to the end
  - 'left': adds elements to the beginning
  - 'both': distributes padding elements evenly on both sides
