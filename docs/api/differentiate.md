# Differentiate Method

The `differentiate()` method calculates the discrete derivative (rate of change) between consecutive values in the collection. This is particularly useful for analyzing trends, velocities, and rates of change in time series data.

## Basic Syntax

```typescript
differentiate(): CollectionOperations<number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const values = collect([1, 4, 9, 16])
const derivatives = values.differentiate()

console.log(derivatives.all())
// [3, 5, 7]
// Each value represents change between consecutive points
```

### Working with Time Series

```typescript
interface DataPoint {
  timestamp: number
  value: number
}

const data = collect<DataPoint>([
  { timestamp: 0, value: 100 },
  { timestamp: 1, value: 120 },
  { timestamp: 2, value: 115 }
])

const changes = data
  .pluck('value')
  .differentiate()

console.log(changes.all())
// [20, -5]  // Shows value changes over time
```

### Real-world Example: E-commerce Price Analysis

```typescript
interface PricePoint {
  productId: string
  date: Date
  price: number
  stock: number
}

class PriceAnalyzer {
  private data: Collection<PricePoint>

  constructor(data: PricePoint[]) {
    this.data = collect(data)
  }

  analyzePriceChanges(productId: string) {
    const productPrices = this.data
      .filter(point => point.productId === productId)
      .sortBy('date', 'asc')

    const priceChanges = productPrices
      .pluck('price')
      .differentiate()

    return {
      changes: priceChanges.all(),
      metrics: this.calculateChangeMetrics(priceChanges),
      volatility: this.calculateVolatility(priceChanges)
    }
  }

  detectPriceAnomalies(threshold: number = 2) {
    return this.data
      .groupBy('productId')
      .map((group, productId) => {
        const changes = group
          .sortBy('date', 'asc')
          .pluck('price')
          .differentiate()

        const stdDev = changes.standardDeviation().population
        const anomalies = changes
          .map((change, index) => ({
            date: group.nth(index + 1)?.date,
            change,
            isAnomalous: Math.abs(change) > threshold * stdDev
          }))
          .filter(record => record.isAnomalous)

        return {
          productId,
          anomalies: anomalies.all()
        }
      })
  }

  private calculateChangeMetrics(changes: Collection<number>) {
    return {
      averageChange: changes.avg(),
      maxIncrease: changes.max() || 0,
      maxDecrease: changes.min() || 0,
      volatility: changes.standardDeviation().population
    }
  }

  private calculateVolatility(changes: Collection<number>): string {
    const stdDev = changes.standardDeviation().population
    if (stdDev < 0.5) return 'Low'
    if (stdDev < 2.0) return 'Medium'
    return 'High'
  }
}

// Usage
const analyzer = new PriceAnalyzer([
  {
    productId: 'P1',
    date: new Date('2024-01-01'),
    price: 100,
    stock: 10
  },
  {
    productId: 'P1',
    date: new Date('2024-01-02'),
    price: 120,
    stock: 8
  },
  {
    productId: 'P1',
    date: new Date('2024-01-03'),
    price: 110,
    stock: 12
  }
])

const priceChanges = analyzer.analyzePriceChanges('P1')
const anomalies = analyzer.detectPriceAnomalies()
```

## Type Safety

```typescript
// Works with any collection but returns numbers
const numbers = collect([1, 2, 3, 4])
const changes: CollectionOperations<number> = numbers.differentiate()

// Works with objects when used with pluck
interface Point {
  x: number
  y: number
}

const points = collect<Point>([
  { x: 0, y: 10 },
  { x: 1, y: 20 }
])

const deltaY = points
  .pluck('y')
  .differentiate()
```

## Return Value

- Returns Collection of differences between consecutive values
- Length is input length - 1
- Each value represents change between points
- Returns empty collection if input length ≤ 1
- Numeric output regardless of input type
- Maintains precision

## Common Use Cases

### 1. Price Analysis

- Price changes
- Rate of change
- Market velocity
- Price momentum
- Volatility analysis

### 2. Trend Analysis

- Change detection
- Trend velocity
- Growth rates
- Decline rates
- Momentum indicators

### 3. Performance Metrics

- Growth rates
- Change tracking
- Velocity metrics
- Acceleration
- Rate monitoring

### 4. Time Series

- Rate of change
- Velocity calculation
- Trend detection
- Pattern analysis
- Change points

### 5. Market Analysis

- Price derivatives
- Market velocity
- Trading signals
- Momentum tracking
- Change detection
