# WhereBetween Method

The `whereBetween()` method filters the collection to get items where the given key's value is between the given minimum and maximum values (inclusive).

## Basic Syntax

```typescript
collect(items).whereBetween(key: keyof T, min: T[K], max: T[K]): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Filter numbers in range
const numbers = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const between = numbers.whereBetween('value', 4, 7)
console.log(between.all()) // [4, 5, 6, 7]

// Filter objects by numeric property
const items = collect([
  { id: 1, score: 50 },
  { id: 2, score: 75 },
  { id: 3, score: 90 },
  { id: 4, score: 60 }
])

const midScores = items.whereBetween('score', 60, 80)
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
  weight: number
}

const products = collect<Product>([
  { id: 1, name: 'Item 1', price: 100, stock: 5, weight: 1.2 },
  { id: 2, name: 'Item 2', price: 200, stock: 10, weight: 2.5 },
  { id: 3, name: 'Item 3', price: 150, stock: 3, weight: 1.8 },
  { id: 4, name: 'Item 4', price: 300, stock: 8, weight: 3.0 }
])

// Filter by price range
const midPriceProducts = products.whereBetween('price', 150, 250)

// Filter by stock range
const stockRange = products.whereBetween('stock', 5, 10)
```

### Real-world Examples

#### Price Filter

```typescript
interface PriceRange {
  min: number
  max: number
  label: string
}

class PriceFilter {
  private items: Collection<Product>
  private ranges: PriceRange[]

  constructor(items: Product[]) {
    this.items = collect(items)
    this.ranges = [
      { min: 0, max: 100, label: 'Budget' },
      { min: 101, max: 500, label: 'Mid-Range' },
      { min: 501, max: 1000, label: 'Premium' }
    ]
  }

  getItemsInRange(label: string): Collection<Product> {
    const range = this.ranges.find(r => r.label === label)
    if (!range)
      return collect([])
    return this.items.whereBetween('price', range.min, range.max)
  }

  getCustomRange(min: number, max: number): Collection<Product> {
    return this.items.whereBetween('price', min, max)
  }
}
```

#### Date Range Filter

```typescript
interface Event {
  id: string
  title: string
  date: Date
  attendees: number
}

class EventManager {
  private events: Collection<Event>

  constructor(events: Event[]) {
    this.events = collect(events)
  }

  getEventsInDateRange(startDate: Date, endDate: Date): Collection<Event> {
    return this.events.filter((event) => {
      const timestamp = event.date.getTime()
      return timestamp >= startDate.getTime()
        && timestamp <= endDate.getTime()
    })
  }

  getEventsByAttendees(minAttendees: number, maxAttendees: number): Collection<Event> {
    return this.events.whereBetween('attendees', minAttendees, maxAttendees)
  }
}
```

### Advanced Usage

#### Performance Metrics

```typescript
interface Metric {
  timestamp: Date
  value: number
  confidence: number
  source: string
}

class MetricsAnalyzer {
  private metrics: Collection<Metric>

  constructor(metrics: Metric[]) {
    this.metrics = collect(metrics)
  }

  getMetricsInRange(min: number, max: number): Collection<Metric> {
    return this.metrics
      .whereBetween('value', min, max)
      .filter(metric => metric.confidence >= 0.8)
  }

  getMetricsByConfidence(minConfidence: number, maxConfidence: number): Collection<Metric> {
    return this.metrics.whereBetween('confidence', minConfidence, maxConfidence)
  }
}
```

#### Grade Analysis

```typescript
interface StudentGrade {
  studentId: string
  course: string
  score: number
  semester: number
}

class GradeAnalyzer {
  private grades: Collection<StudentGrade>
  private readonly gradeRanges = {
    A: { min: 90, max: 100 },
    B: { min: 80, max: 89 },
    C: { min: 70, max: 79 },
    D: { min: 60, max: 69 },
    F: { min: 0, max: 59 }
  }

  constructor(grades: StudentGrade[]) {
    this.grades = collect(grades)
  }

  getGradeRange(grade: keyof typeof this.gradeRanges): Collection<StudentGrade> {
    const range = this.gradeRanges[grade]
    return this.grades.whereBetween('score', range.min, range.max)
  }

  getCustomRange(min: number, max: number): Collection<StudentGrade> {
    return this.grades.whereBetween('score', min, max)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: number
  score: number
  timestamp: Date
}

const items = collect<TypedItem>([
  { id: 1, value: 100, score: 85, timestamp: new Date() },
  { id: 2, value: 150, score: 92, timestamp: new Date() },
  { id: 3, value: 200, score: 78, timestamp: new Date() }
])

// Type-safe range filtering
const valueRange = items.whereBetween('value', 100, 180)
const scoreRange = items.whereBetween('score', 80, 95)

// TypeScript enforces valid keys and comparable values
// items.whereBetween('invalid', 0, 100)           // ✗ TypeScript error
// items.whereBetween('id', 'min', 'max')          // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing items within the specified range
- Range is inclusive of min and max values
- Returns empty collection if no matches found
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods

## Common Use Cases

### 1. Price Filtering

- Price ranges
- Cost categories
- Budget filtering
- Value ranges

### 2. Date Ranges

- Time periods
- Date filtering
- Schedule ranges
- Timeline segments

### 3. Numeric Ranges

- Score ranges
- Value spans
- Quantity ranges
- Measurement bounds

### 4. Grade Systems

- Score ranges
- Grade boundaries
- Performance bands
- Rating ranges

### 5. Age Groups

- Age ranges
- Year groups
- Time spans
- Period filtering

### 6. Size Categories

- Dimension ranges
- Size groups
- Weight classes
- Volume spans

### 7. Performance Metrics

- Score ranges
- Rating bands
- Performance levels
- Metric bounds

### 8. Stock Levels

- Inventory ranges
- Quantity spans
- Stock levels
- Supply bounds

### 9. Statistical Ranges

- Value ranges
- Confidence intervals
- Distribution bands
- Probability ranges

### 10. Resource Usage

- Usage levels
- Consumption ranges
- Capacity bounds
- Utilization spans
