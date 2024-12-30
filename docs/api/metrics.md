# metrics Method

The `metrics()` method returns a comprehensive set of metrics about the collection, including count, null values, unique values, and memory usage. This is particularly useful for data quality assessment and performance monitoring.

## Basic Syntax

```typescript
collect(items).metrics(): CollectionMetrics
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple metrics collection
const items = collect([1, 2, 2, null, 3])
const metrics = items.metrics()
console.log(metrics)
// {
//   count: 5,
//   nullCount: 1,
//   uniqueCount: 4,
//   heapUsed: 1024,  // Example value
//   heapTotal: 2048  // Example value
// }
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string | null
  price: number | null
  category: string
}

const products = collect<Product>([
  { id: '1', name: 'Widget', price: 100, category: 'A' },
  { id: '2', name: null, price: null, category: 'B' }
])

const productMetrics = products.metrics()
// Includes field counts and null distribution
```

### Real-world Examples

#### Data Quality Monitor

```typescript
interface DataQualityReport {
  collectionName: string
  timestamp: Date
  metrics: CollectionMetrics
  recommendations: string[]
}

class DataQualityMonitor {
  generateReport(
    data: Collection<unknown>,
    collectionName: string
  ): DataQualityReport {
    const metrics = data.metrics()

    return {
      collectionName,
      timestamp: new Date(),
      metrics,
      recommendations: this.generateRecommendations(metrics)
    }
  }

  generateDailyReport(
    collections: Map<string, Collection<unknown>>
  ): Map<string, DataQualityReport> {
    const reports = new Map()

    collections.forEach((collection, name) => {
      reports.set(name, this.generateReport(collection, name))
    })

    return reports
  }

  private generateRecommendations(
    metrics: CollectionMetrics
  ): string[] {
    const recommendations: string[] = []

    if (metrics.nullCount > (metrics.count * 0.1)) {
      recommendations.push('High number of null values detected')
    }

    if (metrics.uniqueCount === metrics.count) {
      recommendations.push('All values are unique - potential ID field')
    }

    // Memory usage recommendations
    const memoryUsageRatio = metrics.heapUsed / metrics.heapTotal
    if (memoryUsageRatio > 0.8) {
      recommendations.push('High memory usage - consider optimization')
    }

    return recommendations
  }
}
```

#### Performance Monitor

```typescript
interface PerformanceMetrics {
  timestamp: Date
  metrics: CollectionMetrics
  performance: {
    memoryEfficiency: number
    dataQuality: number
    uniquenessRatio: number
  }
}

class PerformanceMonitor {
  constructor(
    private thresholds: {
      memoryUsage: number
      nullRatio: number
      uniquenessRatio: number
    } = {
      memoryUsage: 0.8,
      nullRatio: 0.1,
      uniquenessRatio: 0.5
    }
  ) {}

  analyzePerformance<T>(
    collection: Collection<T>
  ): PerformanceMetrics {
    const metrics = collection.metrics()

    return {
      timestamp: new Date(),
      metrics,
      performance: {
        memoryEfficiency: this.calculateMemoryEfficiency(metrics),
        dataQuality: this.calculateDataQuality(metrics),
        uniquenessRatio: metrics.uniqueCount / metrics.count
      }
    }
  }

  private calculateMemoryEfficiency(
    metrics: CollectionMetrics
  ): number {
    const usageRatio = metrics.heapUsed / metrics.heapTotal
    return Math.max(0, 1 - (usageRatio / this.thresholds.memoryUsage))
  }

  private calculateDataQuality(
    metrics: CollectionMetrics
  ): number {
    const nullRatio = metrics.nullCount / metrics.count
    return Math.max(0, 1 - (nullRatio / this.thresholds.nullRatio))
  }

  shouldOptimize(metrics: CollectionMetrics): boolean {
    return metrics.heapUsed / metrics.heapTotal > this.thresholds.memoryUsage
  }

  generateRecommendations(metrics: CollectionMetrics): string[] {
    const recommendations: string[] = []

    // Memory recommendations
    if (this.shouldOptimize(metrics)) {
      recommendations.push('Consider implementing pagination')
      recommendations.push('Review data structure for optimization')
    }

    // Data quality recommendations
    if (metrics.nullFieldsDistribution) {
      metrics.nullFieldsDistribution.forEach((count, field) => {
        if (count / metrics.count > this.thresholds.nullRatio) {
          recommendations.push(`High null count in field: ${field}`)
        }
      })
    }

    return recommendations
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string | null
}

const items = collect<TypedItem>([
  { id: 1, value: 'A' },
  { id: 2, value: null }
])

// Type-safe metrics collection
const metrics: CollectionMetrics = items.metrics()

// Access metrics properties with type safety
const nullCount: number = metrics.nullCount
const uniqueCount: number = metrics.uniqueCount
```

## Return Value (CollectionMetrics)

```typescript
interface CollectionMetrics {
  count: number              // Total number of items
  nullCount: number          // Number of null values
  uniqueCount: number        // Number of unique values
  heapUsed: number          // Current heap usage
  heapTotal: number         // Total heap size
  fieldCount?: number       // Number of fields (for objects)
  nullFieldsDistribution?: Map<string, number>  // Null values by field
}
```

## Common Use Cases

### 1. Data Quality

- Completeness checking
- Null value analysis
- Uniqueness validation
- Field distribution
- Quality scoring

### 2. Performance

- Memory monitoring
- Resource usage
- Optimization needs
- Scaling decisions
- Capacity planning

### 3. Monitoring

- Health checks
- Usage patterns
- Resource tracking
- System metrics
- Load analysis

### 4. Reporting

- Quality reports
- Usage statistics
- Health status
- Performance metrics
- Resource utilization

### 5. Optimization

- Memory usage
- Data structure
- Resource allocation
- Performance tuning
- Capacity planning

### 6. Validation

- Data integrity
- Quality assurance
- Format checking
- Structure validation
- Completeness verification

### 7. Analysis

- Pattern detection
- Usage analysis
- Trend monitoring
- Behavior tracking
- Performance assessment

### 8. Maintenance

- Health monitoring
- Resource tracking
- System optimization
- Performance tuning
- Capacity management

### 9. Debugging

- Issue diagnosis
- Problem detection
- Error tracking
- Performance bottlenecks
- Resource leaks

### 10. Planning

- Resource allocation
- Capacity planning
- Scaling decisions
- Optimization strategy
- Maintenance scheduling
