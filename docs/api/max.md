# Max Method

The `max()` method returns the maximum value in the collection. When given a key, it returns the maximum value of that key across all objects in the collection.

## Basic Syntax

```typescript
// Max of array values
collect(items).max(): T | undefined

// Max of object property values
collect(items).max(key: keyof T): T | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array maximum
const numbers = collect([5, 3, 8, 1, 9])
console.log(numbers.max()) // 9

// Maximum with objects
const scores = collect([
  { value: 85 },
  { value: 92 },
  { value: 78 },
  { value: 95 }
])
console.log(scores.max('value')) // 95
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 999, stock: 5 },
  { id: 2, name: 'Mouse', price: 25, stock: 15 },
  { id: 3, name: 'Keyboard', price: 59, stock: 8 }
])

// Find highest price
const highestPrice = products.max('price') // 999

// Find highest stock
const highestStock = products.max('stock') // 15
```

### Real-world Examples

#### Performance Analysis

```typescript
interface PerformanceMetric {
  timestamp: Date
  throughput: number
  responseTime: number
  errorCount: number
}

class PerformanceAnalyzer {
  private metrics: Collection<PerformanceMetric>

  constructor(metrics: PerformanceMetric[]) {
    this.metrics = collect(metrics)
  }

  getPeakThroughput(): number | undefined {
    return this.metrics.max('throughput')
  }

  getWorstResponseTime(period: Date): number | undefined {
    return this.metrics
      .filter(m => m.timestamp >= period)
      .max('responseTime')
  }

  getHighestErrorRate(): number | undefined {
    return this.metrics.max('errorCount')
  }
}
```

#### Resource Monitoring

```typescript
interface ResourceUsage {
  resourceId: string
  cpuUsage: number
  memoryUsage: number
  timestamp: Date
}

class ResourceMonitor {
  private usage: Collection<ResourceUsage>

  constructor(usage: ResourceUsage[]) {
    this.usage = collect(usage)
  }

  getPeakCPUUsage(resourceId: string): number | undefined {
    return this.usage
      .filter(u => u.resourceId === resourceId)
      .max('cpuUsage')
  }

  getPeakMemoryUsage(): number | undefined {
    return this.usage.max('memoryUsage')
  }

  getMostStressedResource(): string | undefined {
    return this.usage
      .sortByDesc('cpuUsage')
      .first()
      ?.resourceId
  }
}
```

### Advanced Usage

#### Sales Analytics

```typescript
interface SalesRecord {
  orderId: string
  amount: number
  profit: number
  customerSegment: string
  timestamp: Date
}

class SalesAnalyzer {
  private sales: Collection<SalesRecord>

  constructor(sales: SalesRecord[]) {
    this.sales = collect(sales)
  }

  getLargestOrder(): number | undefined {
    return this.sales.max('amount')
  }

  getHighestProfit(segment?: string): number | undefined {
    let query = this.sales
    if (segment) {
      query = query.filter(s => s.customerSegment === segment)
    }
    return query.max('profit')
  }

  getPeakSalesDay(): Date | undefined {
    return this.sales
      .sortByDesc('amount')
      .first()
      ?.timestamp
  }
}
```

#### Athletic Performance

```typescript
interface AthletePerformance {
  athleteId: string
  event: string
  score: number
  wind: number
  altitude: number
}

class PerformanceTracker {
  private performances: Collection<AthletePerformance>

  constructor(performances: AthletePerformance[]) {
    this.performances = collect(performances)
  }

  getPersonalBest(athleteId: string): number | undefined {
    return this.performances
      .filter(p => p.athleteId === athleteId)
      .max('score')
  }

  getEventRecord(event: string, maxWind: number = 2.0): number | undefined {
    return this.performances
      .filter(p => p.event === event && p.wind <= maxWind)
      .max('score')
  }

  getHighestAltitudePerformance(): AthletePerformance | undefined {
    return this.performances
      .sortByDesc('altitude')
      .first()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: number
  optional?: number
}

const items = collect<TypedItem>([
  { id: 1, value: 100 },
  { id: 2, value: 200, optional: 50 },
  { id: 3, value: 300 }
])

// Type-safe property access
const maxValue = items.max('value') // ✓ Valid
const maxOptional = items.max('optional') // ✓ Valid
// items.max('nonexistent')              // ✗ TypeScript error
```

## Return Value

- Returns the maximum value in the collection
- Returns undefined for empty collections
- For objects, returns maximum value of specified property
- Maintains type safety with TypeScript
- Handles undefined/null values appropriately
- Compares values using standard JavaScript comparison operators

## Common Use Cases

### 1. Performance Analysis

- Peak performance
- Maximum throughput
- Highest efficiency
- Best results

### 2. Resource Monitoring

- Peak usage
- Maximum capacity
- Highest demand
- Resource limits

### 3. Financial Analysis

- Highest profits
- Maximum returns
- Peak values
- Top performance

### 4. Sports Analytics

- Best performances
- Record scores
- Peak achievements
- Top results

### 5. Sales Analysis

- Highest sales
- Peak periods
- Maximum revenue
- Best performers

### 6. Load Testing

- Peak loads
- Maximum stress
- Highest demand
- Capacity limits

### 7. Usage Analytics

- Peak usage
- Maximum concurrent
- Highest activity
- Top utilization

### 8. Environmental Monitoring

- Maximum readings
- Peak levels
- Highest values
- Critical thresholds

### 9. Quality Control

- Maximum tolerance
- Highest deviation
- Peak measures
- Upper limits

### 10. System Monitoring

- Peak performance
- Maximum load
- Highest activity
- Critical points
