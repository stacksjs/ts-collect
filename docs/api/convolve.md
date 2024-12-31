# Convolve Method

The `convolve()` method performs convolution between the collection and a given kernel. Convolution is fundamental for signal processing, filtering, and smoothing operations, making it useful for everything from moving averages to edge detection.

## Basic Syntax

```typescript
convolve(kernel: number[]): CollectionOperations<number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple moving average (3-point)
const values = collect([1, 2, 3, 4, 5])
const kernel = [1/3, 1/3, 1/3]
const smoothed = values.convolve(kernel)

console.log(smoothed.all())
// [0.33, 1, 2, 3, 4, 3.67, 1.67]
```

### Working with Different Kernels

```typescript
// Different kernel types for various effects
const signal = collect([10, 20, 15, 30, 25])

// Moving average
const movingAverage = signal.convolve([0.2, 0.2, 0.2, 0.2, 0.2])

// Edge detection
const edges = signal.convolve([-1, 1])

// Gaussian smoothing
const gaussian = signal.convolve([0.1, 0.2, 0.4, 0.2, 0.1])
```

### Real-world Example: E-commerce Signal Processing

```typescript
interface SalesData {
  timestamp: Date
  value: number
}

class SalesSignalProcessor {
  private values: Collection<number>

  constructor(data: SalesData[]) {
    this.values = collect(data.map(d => d.value))
  }

  smoothSalesData() {
    // Gaussian smoothing for noise reduction
    const gaussian = [0.1, 0.15, 0.5, 0.15, 0.1]
    return this.values.convolve(gaussian)
  }

  detectTrendChanges() {
    // First derivative for trend detection
    const derivative = [-1, 0, 1]
    const changes = this.values.convolve(derivative)

    return changes.map((value, index) => ({
      index,
      originalValue: this.values.nth(index),
      change: value,
      trend: value > 0 ? 'increasing' : value < 0 ? 'decreasing' : 'stable'
    }))
  }

  findPeaks() {
    // Peak detection kernel
    const peakKernel = [-1, 2, -1]
    const peaks = this.values.convolve(peakKernel)

    return peaks
      .map((value, index) => ({
        index,
        value: this.values.nth(index),
        isPeak: value > 1
      }))
      .filter(point => point.isPeak)
  }

  applyCustomFilter(options: {
    smoothing?: boolean
    trendDetection?: boolean
    peakDetection?: boolean
  }) {
    let result = this.values

    if (options.smoothing) {
      result = result.convolve([0.2, 0.2, 0.2, 0.2, 0.2])
    }

    if (options.trendDetection) {
      result = result.convolve([-1, 0, 1])
    }

    if (options.peakDetection) {
      result = result.convolve([-1, 2, -1])
    }

    return result
  }
}

// Usage
const processor = new SalesSignalProcessor([
  { timestamp: new Date('2024-01-01'), value: 100 },
  { timestamp: new Date('2024-01-02'), value: 150 },
  { timestamp: new Date('2024-01-03'), value: 120 },
  { timestamp: new Date('2024-01-04'), value: 200 },
  { timestamp: new Date('2024-01-05'), value: 180 }
])

const smoothedData = processor.smoothSalesData()
const trends = processor.detectTrendChanges()
const peaks = processor.findPeaks()
```

## Type Safety

```typescript
// Only works with number collections
const numbers = collect([1, 2, 3, 4, 5])
const kernel = [0.2, 0.2, 0.2, 0.2, 0.2]
const result = numbers.convolve(kernel) // ✓ Valid

// Won't work with non-number collections
const strings = collect(['a', 'b', 'c'])
// strings.convolve(kernel) // ✗ TypeScript error

// Type-safe return value
const convolved: CollectionOperations<number> = numbers.convolve(kernel)
```

## Return Value

- Returns Collection of convolved numbers
- Length = input length + kernel length - 1
- Preserves signal characteristics
- Maintains numeric precision
- Handles edge effects
- Returns empty collection if kernel empty

## Common Use Cases

### 1. Signal Smoothing

- Noise reduction
- Data smoothing
- Moving averages
- Trend smoothing
- Signal cleaning

### 2. Feature Detection

- Edge detection
- Peak detection
- Pattern recognition
- Trend changes
- Anomaly detection

### 3. Time Series Analysis

- Trend analysis
- Pattern matching
- Seasonality detection
- Cycle identification
- Signal filtering

### 4. Data Processing

- Data filtering
- Signal enhancement
- Pattern extraction
- Noise removal
- Feature extraction

### 5. Market Analysis

- Price smoothing
- Trend detection
- Volume analysis
- Pattern recognition
- Signal processing
