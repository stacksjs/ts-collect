# Avg Method

The `avg()` method (alias for `average()`) returns the average of all items in the collection. When given a key, it returns the average of the values of that key across all objects in the collection.

## Basic Syntax

```typescript
// Average of array values
collect(items).avg(): number

// Average of object property values
collect(items).avg(key: keyof T): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array average
const numbers = collect([2, 4, 6, 8, 10])
console.log(numbers.avg()) // 6

// Average with objects
const scores = collect([
  { value: 85 },
  { value: 90 },
  { value: 95 }
])
console.log(scores.avg('value')) // 90
```

### Working with Objects

```typescript
interface StudentGrade {
  studentId: number
  subject: string
  score: number
  weight: number
}

const grades = collect<StudentGrade>([
  { studentId: 1, subject: 'Math', score: 85, weight: 1.0 },
  { studentId: 1, subject: 'Science', score: 92, weight: 1.2 },
  { studentId: 1, subject: 'History', score: 78, weight: 0.8 }
])

// Simple average
const averageScore = grades.avg('score') // 85

// Weighted average
const weightedAvg = grades
  .map(grade => grade.score * grade.weight)
  .sum() / grades.sum('weight')
```

### Real-world Examples

#### Performance Metrics

```typescript
interface Performance {
  employeeId: string
  metric: string
  value: number
  period: string
}

class PerformanceAnalyzer {
  private metrics: Collection<Performance>

  constructor(metrics: Performance[]) {
    this.metrics = collect(metrics)
  }

  getAverageMetric(metric: string, period?: string): number {
    let filtered = this.metrics.filter(m => m.metric === metric)
    if (period) {
      filtered = filtered.filter(m => m.period === period)
    }
    return filtered.avg('value')
  }

  getEmployeeAverage(employeeId: string): number {
    return this.metrics
      .filter(m => m.employeeId === employeeId)
      .avg('value')
  }
}
```

#### Quality Control

```typescript
interface ProductMeasurement {
  batchId: string
  timestamp: Date
  measurement: number
  tolerance: number
}

class QualityController {
  private measurements: Collection<ProductMeasurement>

  constructor(measurements: ProductMeasurement[]) {
    this.measurements = collect(measurements)
  }

  getBatchAverage(batchId: string): number {
    return this.measurements
      .filter(m => m.batchId === batchId)
      .avg('measurement')
  }

  getDeviationFromTarget(target: number): number {
    return Math.abs(
      target - this.measurements.avg('measurement')
    )
  }

  isWithinTolerance(target: number): boolean {
    const avgDeviation = this.measurements
      .map(m => Math.abs(m.measurement - target))
      .avg()

    return avgDeviation <= this.measurements.avg('tolerance')
  }
}
```

### Advanced Usage

#### Financial Analysis

```typescript
interface Transaction {
  date: Date
  amount: number
  category: string
  isRecurring: boolean
}

class SpendingAnalyzer {
  private transactions: Collection<Transaction>

  constructor(transactions: Transaction[]) {
    this.transactions = collect(transactions)
  }

  getAverageTransaction(): number {
    return this.transactions.avg('amount')
  }

  getAverageByCategory(category: string): number {
    return this.transactions
      .filter(t => t.category === category)
      .avg('amount')
  }

  getRecurringAverage(): number {
    return this.transactions
      .filter(t => t.isRecurring)
      .avg('amount')
  }

  getMonthlyAverage(month: number, year: number): number {
    return this.transactions
      .filter((t) => {
        const date = new Date(t.date)
        return date.getMonth() === month
          && date.getFullYear() === year
      })
      .avg('amount')
  }
}
```

#### Sensor Data Analysis

```typescript
interface SensorReading {
  sensorId: string
  value: number
  confidence: number
  timestamp: Date
}

class SensorAnalyzer {
  private readings: Collection<SensorReading>

  constructor(readings: SensorReading[]) {
    this.readings = collect(readings)
  }

  getWeightedAverage(sensorId: string): number {
    const sensorData = this.readings
      .filter(r => r.sensorId === sensorId)

    const weightedSum = sensorData
      .map(r => r.value * r.confidence)
      .sum()

    return weightedSum / sensorData.sum('confidence')
  }

  getHourlyAverage(hour: number): number {
    return this.readings
      .filter(r => r.timestamp.getHours() === hour)
      .avg('value')
  }

  getConfidenceThresholdAverage(threshold: number): number {
    return this.readings
      .filter(r => r.confidence >= threshold)
      .avg('value')
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
const avgValue = items.avg('value') // ✓ Valid
const avgOptional = items.avg('optional') // ✓ Valid
// items.avg('nonexistent')              // ✗ TypeScript error
```

## Return Value

- Returns a number representing the average value
- For arrays: computes average of numeric values
- For objects: computes average of specified property values
- Returns 0 for empty collections
- Maintains type safety with TypeScript
- Handles undefined/null values appropriately

## Common Use Cases

### 1. Statistical Analysis

- Computing averages
- Calculating means
- Processing measurements
- Analyzing datasets

### 2. Performance Metrics

- Average response times
- Mean performance scores
- Metric calculations
- KPI analysis

### 3. Financial Calculations

- Average transaction value
- Mean account balance
- Spending patterns
- Cost analysis

### 4. Quality Control

- Average measurements
- Mean deviations
- Quality metrics
- Process control

### 5. Sensor Data

- Average readings
- Mean values
- Sensor metrics
- Data aggregation

### 6. Academic Scoring

- Grade averaging
- Score calculations
- Performance metrics
- Assessment analysis

### 7. Load Balancing

- Average load
- Mean utilization
- Resource usage
- Capacity planning

### 8. Time Analysis

- Average duration
- Mean processing time
- Time metrics
- Period analysis

### 9. Usage Statistics

- Average consumption
- Mean usage
- Utilization metrics
- Resource analysis

### 10. Market Analysis

- Average prices
- Mean values
- Market metrics
- Trend analysis

## Note

Remember that `avg()` is simply an alias for `average()`, so you can use either method interchangeably based on your preference:

```typescript
const numbers = collect([1, 2, 3, 4, 5])

// These are equivalent
numbers.avg() // 3
numbers.average() // 3
```
