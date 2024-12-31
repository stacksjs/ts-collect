# Interpolate Method

The `interpolate()` method creates new data points within the range of the collection by linear interpolation. This is useful for resampling data to a desired number of points or smoothing discrete data.

## Basic Syntax

```typescript
interpolate(points: number): CollectionOperations<number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const values = collect([0, 4])
const interpolated = values.interpolate(5)

console.log(interpolated.all())
// [0, 1, 2, 3, 4]
// Created 5 evenly spaced points
```

### Working with Time Series

```typescript
// Price data at irregular intervals
const prices = collect([100, 150, 120])
const smoothPrices = prices.interpolate(10)

console.log(smoothPrices.all())
// [100, 105.56, 111.11, ..., 120]
// Creates smooth price transition
```

### Real-world Example: E-commerce Metrics Smoothing

```typescript
interface MetricPoint {
  timestamp: Date
  value: number
}

class MetricsSmoother {
  private metrics: Collection<number>

  constructor(data: MetricPoint[]) {
    this.metrics = collect(data.map(p => p.value))
  }

  smoothMetrics(targetPoints: number) {
    return {
      original: this.metrics.all(),
      smoothed: this.metrics.interpolate(targetPoints).all(),
      metrics: this.calculateMetrics(targetPoints)
    }
  }

  generateTrendline(points: number) {
    const smoothed = this.metrics.interpolate(points)

    return {
      values: smoothed.all(),
      trend: this.calculateTrend(smoothed),
      confidence: this.calculateConfidence(smoothed)
    }
  }

  private calculateMetrics(points: number) {
    const smoothed = this.metrics.interpolate(points)
    return {
      min: smoothed.min(),
      max: smoothed.max(),
      average: smoothed.avg(),
      trend: this.calculateTrend(smoothed)
    }
  }

  private calculateTrend(values: Collection<number>): 'up' | 'down' | 'stable' {
    const firstHalf = values.take(values.count() / 2).avg()
    const secondHalf = values.skip(values.count() / 2).avg()

    const difference = secondHalf - firstHalf
    if (Math.abs(difference) < 0.05) return 'stable'
    return difference > 0 ? 'up' : 'down'
  }

  private calculateConfidence(values: Collection<number>): number {
    const variance = values
      .map((value, index, arr) => {
        if (index === 0) return 0
        return Math.abs(value - arr[index - 1])
      })
      .avg()

    return Math.max(0, 1 - variance / values.avg())
  }
}

// Usage
const smoother = new MetricsSmoother([
  { timestamp: new Date('2024-01-01'), value: 100 },
  { timestamp: new Date('2024-01-02'), value: 150 },
  { timestamp: new Date('2024-01-03'), value: 120 }
])

const smoothedData = smoother.smoothMetrics(24) // Hourly data points
const trendline = smoother.generateTrendline(7)  // Daily data points
```

## Type Safety

```typescript
// Only works with number collections
const numbers = collect([1, 5])
const result = numbers.interpolate(5) // ✓ Valid

// Won't work with non-number collections
const strings = collect(['a', 'b'])
// strings.interpolate(5) // ✗ TypeScript error

// Type-safe return value
const interpolated: CollectionOperations<number> = numbers.interpolate(3)
```

## Return Value

- Returns Collection of interpolated numbers
- Length matches requested points
- First and last values preserved
- Evenly spaced intervals
- Linear interpolation between points
- Maintains numeric precision

## Common Use Cases

### 1. Time Series Data

- Resampling intervals
- Missing data filling
- Data normalization
- Pattern smoothing
- Trend analysis

### 2. Data Visualization

- Smooth line charts
- Continuous curves
- Data smoothing
- Visual interpolation
- Trend display

### 3. Price Analysis

- Price curves
- Rate transitions
- Cost estimations
- Price modeling
- Value predictions

### 4. Metric Reporting

- Data normalization
- Report generation
- Metric smoothing
- Trend visualization
- Performance graphs

### 5. Data Processing

- Sample rate conversion
- Data harmonization
- Resolution matching
- Gap filling
- Signal processing
