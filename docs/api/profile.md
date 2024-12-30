# profile Method

The `profile()` method measures the execution time and memory consumption of collection operations. Returns a Promise that resolves to time and memory metrics, useful for performance optimization and resource monitoring.

## Basic Syntax

```typescript
collect(items).profile(): Promise<{ time: number, memory: number }>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple profiling
const numbers = collect([1, 2, 3, 4, 5])
const profile = await numbers.profile()
console.log(profile)
// {
//   time: 0.123,    // Time in milliseconds
//   memory: 1024    // Memory usage in bytes
// }

// Profile with operations
const result = await collect([1, 2, 3])
  .map(n => n * 2)
  .filter(n => n > 4)
  .profile()
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  price: number
  variants: string[]
}

const products = collect<Product>([
  {
    id: '1',
    name: 'Widget',
    price: 100,
    variants: ['red', 'blue']
  },
  {
    id: '2',
    name: 'Gadget',
    price: 200,
    variants: ['small', 'large']
  }
])

// Profile complex operations
const metrics = await products
  .map(p => ({ ...p, variants: p.variants.length }))
  .sortBy('price')
  .profile()
```

### Real-world Examples

#### Performance Analyzer

```typescript
interface OperationProfile {
  operationName: string
  time: number
  memory: number
  itemCount: number
  memoryPerItem: number
  timePerItem: number
}

class PerformanceAnalyzer {
  async analyzeOperations<T>(
    collection: Collection<T>,
    operations: Array<{
      name: string
      operation: (items: Collection<T>) => Collection<T>
    }>
  ): Promise<{
    profiles: OperationProfile[]
    recommendations: string[]
  }> {
    const profiles: OperationProfile[] = []

    for (const op of operations) {
      const beforeOp = collection
      const afterOp = op.operation(collection)
      const profile = await afterOp.profile()

      profiles.push({
        operationName: op.name,
        time: profile.time,
        memory: profile.memory,
        itemCount: afterOp.count(),
        memoryPerItem: profile.memory / afterOp.count(),
        timePerItem: profile.time / afterOp.count()
      })
    }

    return {
      profiles,
      recommendations: this.generateRecommendations(profiles)
    }
  }

  private generateRecommendations(
    profiles: OperationProfile[]
  ): string[] {
    const recommendations: string[] = []

    // Time-based recommendations
    const slowOperations = profiles
      .filter(p => p.timePerItem > 1) // More than 1ms per item

    if (slowOperations.length > 0) {
      recommendations.push(
        `Consider optimizing slow operations: ${
          slowOperations.map(op => op.operationName).join(', ')
        }`
      )
    }

    // Memory-based recommendations
    const highMemoryOps = profiles
      .filter(p => p.memoryPerItem > 1024) // More than 1KB per item

    if (highMemoryOps.length > 0) {
      recommendations.push(
        `High memory usage in operations: ${
          highMemoryOps.map(op => op.operationName).join(', ')
        }`
      )
    }

    return recommendations
  }
}
```

#### Query Optimizer

```typescript
interface QueryProfile {
  query: string
  results: number
  time: number
  memory: number
  optimizationPotential: 'low' | 'medium' | 'high'
}

class QueryOptimizer {
  async analyzeQuery<T>(
    collection: Collection<T>,
    query: {
      filter?: (item: T) => boolean
      sort?: keyof T
      limit?: number
    }
  ): Promise<QueryProfile> {
    let operation = collection

    // Apply operations
    if (query.filter) {
      operation = operation.filter(query.filter)
    }
    if (query.sort) {
      operation = operation.sortBy(query.sort)
    }
    if (query.limit) {
      operation = operation.take(query.limit)
    }

    // Profile the operation
    const profile = await operation.profile()
    const resultCount = operation.count()

    return {
      query: this.stringifyQuery(query),
      results: resultCount,
      time: profile.time,
      memory: profile.memory,
      optimizationPotential: this.calculateOptimizationPotential(
        profile,
        resultCount
      )
    }
  }

  async compareQueries<T>(
    collection: Collection<T>,
    queries: Array<{
      name: string
      query: {
        filter?: (item: T) => boolean
        sort?: keyof T
        limit?: number
      }
    }>
  ): Promise<{
    profiles: Array<QueryProfile & { name: string }>
    recommendations: string[]
  }> {
    const profiles = await Promise.all(
      queries.map(async ({ name, query }) => ({
        name,
        ...(await this.analyzeQuery(collection, query))
      }))
    )

    return {
      profiles,
      recommendations: this.generateOptimizationRecommendations(profiles)
    }
  }

  private stringifyQuery(query: any): string {
    return JSON.stringify(query, (key, value) =>
      typeof value === 'function' ? value.toString() : value
    )
  }

  private calculateOptimizationPotential(
    profile: { time: number, memory: number },
    resultCount: number
  ): 'low' | 'medium' | 'high' {
    const timePerResult = profile.time / resultCount
    const memoryPerResult = profile.memory / resultCount

    if (timePerResult > 1 || memoryPerResult > 1024) {
      return 'high'
    }
    if (timePerResult > 0.1 || memoryPerResult > 512) {
      return 'medium'
    }
    return 'low'
  }

  private generateOptimizationRecommendations(
    profiles: Array<QueryProfile & { name: string }>
  ): string[] {
    const recommendations: string[] = []

    // Find queries needing optimization
    const highPotentialQueries = profiles
      .filter(p => p.optimizationPotential === 'high')
      .map(p => p.name)

    if (highPotentialQueries.length > 0) {
      recommendations.push(
        `Consider optimizing queries: ${highPotentialQueries.join(', ')}`
      )
    }

    // Compare query performance
    const slowestQuery = profiles
      .reduce((prev, curr) =>
        prev.time > curr.time ? prev : curr
      )

    if (slowestQuery.time > 100) {
      recommendations.push(
        `Query "${slowestQuery.name}" is particularly slow`
      )
    }

    return recommendations
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

const items = collect<TypedItem>([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' }
])

// Type-safe profiling
const profile = await items
  .map(item => ({ ...item, processed: true }))
  .profile()

// Type-safe profile result
const time: number = profile.time
const memory: number = profile.memory
```

## Return Value

```typescript
interface ProfileResult {
  time: number    // Execution time in milliseconds
  memory: number  // Memory usage in bytes
}
```

## Common Use Cases

### 1. Performance Optimization

- Operation profiling
- Resource usage
- Bottleneck detection
- Query optimization
- Memory analysis

### 2. Resource Monitoring

- Memory usage
- Execution time
- Resource allocation
- Usage patterns
- Capacity planning

### 3. Query Analysis

- Query performance
- Execution metrics
- Operation costs
- Resource usage
- Optimization needs

### 4. Development

- Performance testing
- Resource monitoring
- Operation analysis
- Code optimization
- Memory leaks

### 5. System Tuning

- Performance tweaks
- Resource allocation
- Operation costs
- Memory management
- Execution optimization

### 6. Benchmarking

- Operation comparison
- Performance metrics
- Resource usage
- Execution time
- Memory consumption

### 7. Debugging

- Performance issues
- Resource problems
- Memory leaks
- Execution bottlenecks
- Operation costs

### 8. Capacity Planning

- Resource needs
- Performance limits
- Scaling decisions
- Usage patterns
- Growth planning

### 9. Quality Assurance

- Performance testing
- Resource validation
- Operation verification
- Memory checks
- Execution analysis

### 10. Production Monitoring

- Live performance
- Resource usage
- Operation costs
- System health
- Memory status
