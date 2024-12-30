# Benchmark Method

The `benchmark()` method measures the performance characteristics of collection operations, providing detailed timing, memory usage, and algorithmic complexity information. This is particularly useful for optimizing performance-critical operations in large datasets.

## Basic Syntax

```typescript
async benchmark(): Promise<{
  timing: Record<string, number>     // Operation execution times in milliseconds
  memory: Record<string, number>     // Memory usage in bytes
  complexity: Record<string, string> // Big O notation for each operation
}>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const collection = collect([1, 2, 3, 4, 5])

const metrics = await collection
  .map(x => x * 2)
  .filter(x => x > 5)
  .benchmark()

console.log(metrics)
// {
//   timing: {
//     map: 0.05,
//     filter: 0.03
//   },
//   memory: {
//     map: 240,
//     filter: 120
//   },
//   complexity: {
//     map: 'O(n)',
//     filter: 'O(n)'
//   }
// }
```

### Working with Objects

```typescript
interface DataPoint {
  id: number
  value: number
}

const data = collect<DataPoint>([
  { id: 1, value: 100 },
  { id: 2, value: 200 },
  { id: 3, value: 300 }
])

const performanceMetrics = await data
  .sortBy('value')
  .map(item => ({ ...item, squared: item.value ** 2 }))
  .benchmark()

// Check performance of different operations
console.log('Sort Performance:', performanceMetrics.timing.sort)
console.log('Memory Usage:', performanceMetrics.memory.sort)
console.log('Algorithmic Complexity:', performanceMetrics.complexity.sort)
```

### Real-world Example: E-commerce Performance Analysis

```typescript
interface Product {
  id: string
  name: string
  price: number
  category: string
  tags: string[]
}

class CatalogPerformanceAnalyzer {
  private catalog: Collection<Product>

  constructor(products: Product[]) {
    this.catalog = collect(products)
  }

  async analyzeOperations() {
    const results: Record<string, any> = {}

    // Benchmark category grouping
    results.categoryGrouping = await this.catalog
      .groupBy('category')
      .map(group => ({
        category: group.first()?.category,
        count: group.count(),
        averagePrice: group.avg('price')
      }))
      .benchmark()

    // Benchmark search operations
    results.searchOperations = await this.catalog
      .filter(p => p.tags.includes('bestseller'))
      .sortBy('price')
      .take(10)
      .benchmark()

    // Analyze and format results
    return this.formatBenchmarkResults(results)
  }

  private formatBenchmarkResults(results: Record<string, any>) {
    return {
      categoryAnalysis: {
        executionTime: results.categoryGrouping.timing,
        memoryUsage: this.formatMemoryUsage(results.categoryGrouping.memory),
        complexity: results.categoryGrouping.complexity
      },
      searchAnalysis: {
        executionTime: results.searchOperations.timing,
        memoryUsage: this.formatMemoryUsage(results.searchOperations.memory),
        complexity: results.searchOperations.complexity
      }
    }
  }

  private formatMemoryUsage(bytes: number): string {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
}
```

## Type Safety

```typescript
interface MetricData {
  timestamp: Date
  value: number
}

const metrics = collect<MetricData>([
  { timestamp: new Date(), value: 100 },
  { timestamp: new Date(), value: 200 }
])

// Type-safe benchmarking
type BenchmarkResult = Awaited<ReturnType<typeof metrics.benchmark>>
const result: BenchmarkResult = await metrics
  .sortBy('value')
  .map(m => ({ ...m, normalized: m.value / 100 }))
  .benchmark()
```

## Return Value

- Returns a Promise resolving to an object containing:
  - `timing`: Record of execution times for each operation
  - `memory`: Record of memory usage for each operation
  - `complexity`: Record of Big O notation for each operation
- All timing measurements in milliseconds
- Memory measurements in bytes
- Complexity analysis based on algorithm characteristics
- Maintains type safety through generics

## Common Use Cases

### 1. Performance Optimization

- Identifying bottlenecks
- Measuring operation costs
- Comparing algorithms
- Optimizing memory usage
- Profiling complex operations

### 2. Capacity Planning

- Load testing
- Resource estimation
- Scaling decisions
- Performance budgeting
- Infrastructure planning

### 3. Development Monitoring

- Development benchmarks
- Performance regression testing
- Code optimization
- Memory leak detection
- Operation profiling

### 4. Query Optimization

- Query performance analysis
- Index effectiveness
- Operation cost comparison
- Memory usage optimization
- Algorithm selection

### 5. System Health Checks

- Performance monitoring
- Resource utilization
- Operation efficiency
- Memory consumption
- Runtime analysis
