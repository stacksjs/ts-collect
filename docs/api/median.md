# Median Method

The `median()` method returns the median value of the collection. When given a key, it returns the median of the values of that key across all objects in the collection.

## Basic Syntax

```typescript
// Median of array values
collect(items).median(): number | undefined

// Median of object property values
collect(items).median(key: keyof T): number | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple array median
const numbers = collect([1, 5, 2, 8, 3])
console.log(numbers.median()) // 3

// Median with objects
const scores = collect([
  { value: 85 },
  { value: 90 },
  { value: 95 },
  { value: 82 },
  { value: 88 }
])
console.log(scores.median('value')) // 88
```

### Working with Objects

```typescript
interface SalesRecord {
  id: number
  amount: number
  region: string
  quarter: number
}

const sales = collect<SalesRecord>([
  { id: 1, amount: 1000, region: 'North', quarter: 1 },
  { id: 2, amount: 1500, region: 'South', quarter: 1 },
  { id: 3, amount: 750, region: 'East', quarter: 1 },
  { id: 4, amount: 2000, region: 'West', quarter: 1 },
  { id: 5, amount: 1250, region: 'Central', quarter: 1 }
])

// Find median sale amount
const medianAmount = sales.median('amount') // 1250
```

### Real-world Examples

#### Price Analysis

```typescript
interface PropertyListing {
  id: string
  price: number
  sqft: number
  bedrooms: number
  location: string
}

class PropertyAnalyzer {
  private listings: Collection<PropertyListing>

  constructor(listings: PropertyListing[]) {
    this.listings = collect(listings)
  }

  getMedianPrice(): number | undefined {
    return this.listings.median('price')
  }

  getMedianPricePerSqft(): number | undefined {
    return this.listings
      .map(listing => listing.price / listing.sqft)
      .median()
  }

  getMedianByBedrooms(bedrooms: number): number | undefined {
    return this.listings
      .filter(listing => listing.bedrooms === bedrooms)
      .median('price')
  }
}
```

#### Performance Metrics

```typescript
interface PerformanceMetric {
  timestamp: Date
  responseTime: number
  errorRate: number
  throughput: number
}

class PerformanceAnalyzer {
  private metrics: Collection<PerformanceMetric>

  constructor(metrics: PerformanceMetric[]) {
    this.metrics = collect(metrics)
  }

  getMedianResponseTime(): number | undefined {
    return this.metrics.median('responseTime')
  }

  getMedianErrorRate(): number | undefined {
    return this.metrics.median('errorRate')
  }

  getHourlyMedian(hour: number): number | undefined {
    return this.metrics
      .filter(metric => metric.timestamp.getHours() === hour)
      .median('responseTime')
  }
}
```

### Advanced Usage

#### Statistical Analysis

```typescript
interface DataPoint {
  value: number
  confidence: number
  category: string
  timestamp: Date
}

class StatisticalAnalyzer {
  private data: Collection<DataPoint>

  constructor(data: DataPoint[]) {
    this.data = collect(data)
  }

  getMedianByCategory(category: string): number | undefined {
    return this.data
      .filter(point => point.category === category)
      .median('value')
  }

  getConfidenceWeightedMedian(): number | undefined {
    return this.data
      .map(point => point.value * point.confidence)
      .median()
  }

  getTimeWindowMedian(startTime: Date, endTime: Date): number | undefined {
    return this.data
      .filter(point =>
        point.timestamp >= startTime
        && point.timestamp <= endTime
      )
      .median('value')
  }
}
```

#### Student Grade Analysis

```typescript
interface Grade {
  studentId: string
  subject: string
  score: number
  term: string
  weight: number
}

class GradeAnalyzer {
  private grades: Collection<Grade>

  constructor(grades: Grade[]) {
    this.grades = collect(grades)
  }

  getMedianBySubject(subject: string): number | undefined {
    return this.grades
      .filter(grade => grade.subject === subject)
      .median('score')
  }

  getWeightedMedian(): number | undefined {
    return this.grades
      .map(grade => grade.score * grade.weight)
      .median()
  }

  getTermMedian(term: string): number | undefined {
    return this.grades
      .filter(grade => grade.term === term)
      .median('score')
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
const medianValue = items.median('value') // ✓ Valid
const medianOptional = items.median('optional') // ✓ Valid
// items.median('nonexistent')                  // ✗ TypeScript error
```

## Return Value

- Returns the median value of the collection
- Returns undefined for empty collections
- For even number of items, returns average of two middle values
- For objects, returns median of specified property values
- Maintains type safety with TypeScript
- Handles undefined/null values appropriately

## Common Use Cases

### 1. Statistical Analysis

- Finding central tendency
- Analyzing distributions
- Processing datasets
- Outlier detection

### 2. Price Analysis

- Market pricing
- Cost analysis
- Value assessment
- Price trends

### 3. Performance Metrics

- Response times
- Load analysis
- System metrics
- Resource usage

### 4. Academic Scoring

- Grade analysis
- Score distributions
- Performance assessment
- Student evaluation

### 5. Financial Analysis

- Transaction values
- Asset pricing
- Market analysis
- Cost assessment

### 6. Time Series Analysis

- Duration analysis
- Response patterns
- Time distributions
- Process timing

### 7. Quality Control

- Measurement analysis
- Process control
- Deviation assessment
- Quality metrics

### 8. Load Balancing

- Resource distribution
- Usage patterns
- Capacity analysis
- Workload assessment

### 9. Demographic Analysis

- Population metrics
- Distribution analysis
- Trend assessment
- Pattern recognition

### 10. Sensor Data

- Measurement analysis
- Reading distributions
- Signal processing
- Data normalization
