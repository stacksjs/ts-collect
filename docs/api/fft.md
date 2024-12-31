# FFT Method

The `fft()` method performs a Fast Fourier Transform on a collection of numbers, converting time-domain signals into frequency-domain components. It returns pairs of real and imaginary components for each frequency.

## Basic Syntax

```typescript
fft(this: CollectionOperations<T>): T extends number ? CollectionOperations<[number, number]> : never
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple sine wave
const signal = collect([0, 1, 0, -1])
const frequencies = signal.fft()

console.log(frequencies.all())
// [
//   [0, 0],           // DC component
//   [0, 2],           // Primary frequency
//   [0, 0],           // Second harmonic
//   [0, -2]           // Nyquist frequency
// ]
```

### Working with Signal Data

```typescript
// Generate a signal with two frequency components
const sampleRate = 100 // Hz
const duration = 1    // second
const t = Array.from({ length: sampleRate }, (_, i) => i / sampleRate)
const signal = collect(t.map(t =>
  Math.sin(2 * Math.PI * 10 * t) +  // 10 Hz component
  0.5 * Math.sin(2 * Math.PI * 20 * t)  // 20 Hz component
))

const spectrum = signal.fft()
```

### Real-world Example: E-commerce Time Series Analysis

```typescript
interface SalesTimeSeries {
  timestamps: number[]
  values: number[]
}

class TimeSeriesAnalyzer {
  private data: Collection<number>

  constructor(timeSeries: SalesTimeSeries) {
    this.data = collect(timeSeries.values)
  }

  analyzeSeasonality() {
    const spectrum = this.data.fft()

    return {
      frequencies: this.findDominantFrequencies(spectrum),
      seasonality: this.interpretSeasonality(spectrum)
    }
  }

  detectAnomalies(threshold = 2) {
    // Remove high-frequency components (noise)
    const filtered = this.lowPassFilter(this.data)

    // Calculate residuals
    const residuals = this.data.map((value, i) =>
      value - filtered[i]
    )

    // Find anomalies using standard deviation
    const std = residuals.standardDeviation().population
    return this.data
      .map((value, i) => ({
        value,
        isAnomaly: Math.abs(residuals[i]) > threshold * std
      }))
  }

  private findDominantFrequencies(spectrum: CollectionOperations<[number, number]>) {
    return spectrum
      .map((pair, i) => ({
        frequency: i,
        magnitude: Math.sqrt(pair[0] * pair[0] + pair[1] * pair[1])
      }))
      .sortBy('magnitude', 'desc')
      .take(5)
  }

  private interpretSeasonality(spectrum: CollectionOperations<[number, number]>) {
    const dominantFreq = this.findDominantFrequencies(spectrum)
      .first()?.frequency || 0

    // Convert frequency to period
    const period = this.data.count() / dominantFreq

    if (period >= 365) return 'Yearly'
    if (period >= 30) return 'Monthly'
    if (period >= 7) return 'Weekly'
    return 'Daily'
  }

  private lowPassFilter(signal: Collection<number>): number[] {
    const spectrum = signal.fft()
    const filtered = spectrum.map((pair, i) => {
      // Cut off high frequencies
      if (i > signal.count() / 4) return [0, 0]
      return pair
    })

    // Inverse FFT (simplified)
    return this.ifft(filtered)
  }

  private ifft(spectrum: CollectionOperations<[number, number]>): number[] {
    // Simplified inverse FFT implementation
    // In practice, you'd use a proper IFFT algorithm
    return spectrum.map(pair => pair[0]).all()
  }
}

// Usage
const analyzer = new TimeSeriesAnalyzer({
  timestamps: [1, 2, 3, 4, 5],
  values: [100, 120, 110, 130, 125]
})

const seasonalityAnalysis = analyzer.analyzeSeasonality()
const anomalies = analyzer.detectAnomalies()
```

## Type Safety

```typescript
// Only works with number collections
const numbers = collect([1, 2, 3, 4])
const spectrum = numbers.fft() // ✓ Valid

// Won't work with non-number collections
const strings = collect(['a', 'b', 'c'])
// strings.fft() // ✗ TypeScript error

// Type-safe return value
type SpectrumPoint = [number, number]
const result: CollectionOperations<SpectrumPoint> = numbers.fft()
```

## Return Value

- Returns Collection of [real, imaginary] number pairs
- Length matches input length
- First pair represents DC component
- Middle pairs represent frequencies
- Last pair represents Nyquist frequency
- Never type if input isn't numeric

## Common Use Cases

### 1. Signal Processing

- Frequency analysis
- Signal filtering
- Noise reduction
- Harmonic analysis
- Wave decomposition

### 2. Time Series Analysis

- Pattern detection
- Seasonality analysis
- Trend analysis
- Cycle identification
- Anomaly detection

### 3. Data Filtering

- Noise removal
- Signal smoothing
- Feature extraction
- Pattern matching
- Data cleaning

### 4. Market Analysis

- Price cycle analysis
- Trading patterns
- Market seasonality
- Trend detection
- Volume analysis

### 5. Performance Monitoring

- System oscillations
- Load patterns
- Resource usage
- Traffic analysis
- Periodic behavior
