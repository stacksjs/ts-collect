# Min Method

The `min()` method returns the minimum value in the collection. When given a key, it returns the minimum value of that key across all objects in the collection.

## Basic Syntax

```typescript
// Min of array values
collect(items).min(): T | undefined

// Min of object property values
collect(items).min(key: keyof T): T | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple array minimum
const numbers = collect([5, 3, 8, 1, 9])
console.log(numbers.min()) // 1

// Minimum with objects
const scores = collect([
  { value: 85 },
  { value: 92 },
  { value: 78 },
  { value: 95 }
])
console.log(scores.min('value')) // 78
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

// Find lowest price
const lowestPrice = products.min('price') // 25

// Find lowest stock
const lowestStock = products.min('stock') // 5
```

### Real-world Examples

#### Price Analysis

```typescript
interface PricePoint {
  timestamp: Date
  price: number
  volume: number
  exchange: string
}

class PriceAnalyzer {
  private prices: Collection<PricePoint>

  constructor(prices: PricePoint[]) {
    this.prices = collect(prices)
  }

  getDailyLow(date: Date): number | undefined {
    return this.prices
      .filter(p => this.isSameDay(p.timestamp, date))
      .min('price')
  }

  getLowestVolume(): number | undefined {
    return this.prices.min('volume')
  }

  private isSameDay(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString()
  }
}
```

#### Performance Metrics

```typescript
interface Metric {
  serviceId: string
  responseTime: number
  errorRate: number
  timestamp: Date
}

class PerformanceMonitor {
  private metrics: Collection<Metric>

  constructor(metrics: Metric[]) {
    this.metrics = collect(metrics)
  }

  getBestResponseTime(serviceId?: string): number | undefined {
    let query = this.metrics
    if (serviceId) {
      query = query.filter(m => m.serviceId === serviceId)
    }
    return query.min('responseTime')
  }

  getLowestErrorRate(): number | undefined {
    return this.metrics.min('errorRate')
  }
}
```

### Advanced Usage

#### Resource Allocation

```typescript
interface ResourceUsage {
  resourceId: string
  utilization: number
  cost: number
  timestamp: Date
}

class ResourceManager {
  private usage: Collection<ResourceUsage>

  constructor(usage: ResourceUsage[]) {
    this.usage = collect(usage)
  }

  findLeastUtilizedResource(): string | undefined {
    return this.usage
      .sortBy('utilization')
      .first()
      ?.resourceId
  }

  getLowestCostResource(): string | undefined {
    return this.usage
      .filter(u => u.utilization < 80) // Only consider available resources
      .sortBy('cost')
      .first()
      ?.resourceId
  }

  getMinUtilizationByResource(resourceId: string): number | undefined {
    return this.usage
      .filter(u => u.resourceId === resourceId)
      .min('utilization')
  }
}
```

#### Temperature Monitoring

```typescript
interface TemperatureReading {
  sensorId: string
  temperature: number
  humidity: number
  timestamp: Date
}

class TemperatureMonitor {
  private readings: Collection<TemperatureReading>

  constructor(readings: TemperatureReading[]) {
    this.readings = collect(readings)
  }

  getLowestTemperature(sensorId?: string): number | undefined {
    let query = this.readings
    if (sensorId) {
      query = query.filter(r => r.sensorId === sensorId)
    }
    return query.min('temperature')
  }

  getLowestHumidity(): number | undefined {
    return this.readings.min('humidity')
  }

  getLowestReadingTime(sensorId: string): Date | undefined {
    return this.readings
      .filter(r => r.sensorId === sensorId)
      .sortBy('temperature')
      .first()
      ?.timestamp
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
const minValue = items.min('value') // ✓ Valid
const minOptional = items.min('optional') // ✓ Valid
// items.min('nonexistent')              // ✗ TypeScript error
```

## Return Value

- Returns the minimum value in the collection
- Returns undefined for empty collections
- For objects, returns minimum value of specified property
- Maintains type safety with TypeScript
- Handles undefined/null values appropriately
- Compares values using standard JavaScript comparison operators

## Common Use Cases

### 1. Price Analysis

- Finding lowest prices
- Cost minimization
- Value comparison
- Pricing strategies

### 2. Performance Metrics

- Best response times
- Lowest error rates
- Optimal performance
- Resource efficiency

### 3. Resource Management

- Minimum utilization
- Lowest costs
- Resource optimization
- Capacity planning

### 4. Environmental Monitoring

- Temperature minimums
- Humidity lows
- Sensor readings
- Climate analysis

### 5. Financial Analysis

- Lowest values
- Minimum balances
- Risk assessment
- Cost analysis

### 6. Inventory Management

- Lowest stock levels
- Minimum quantities
- Order thresholds
- Supply management

### 7. Load Balancing

- Minimum load
- Resource availability
- Capacity planning
- Usage optimization

### 8. Quality Control

- Minimum tolerances
- Lowest measures
- Quality thresholds
- Process control

### 9. Time Analysis

- Shortest durations
- Minimum intervals
- Time optimization
- Process efficiency

### 10. Score Analysis

- Lowest scores
- Minimum ratings
- Performance floors
- Baseline measures
