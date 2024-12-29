# standardDeviation Method

The `standardDeviation()` method calculates both population and sample standard deviations for the collection. When a key is provided, it calculates the standard deviations of values for that specific property. Returns an object containing both population and sample standard deviations.

## Basic Syntax

```typescript
collect(items).standardDeviation(key?: keyof T): StandardDeviationResult
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple number collection
const numbers = collect([2, 4, 4, 4, 5, 5, 7, 9])
const result = numbers.standardDeviation()
console.log(result)
// {
//   population: 2.0,
//   sample: 2.138
// }

// With specific key
const items = collect([
  { value: 2 },
  { value: 4 },
  { value: 6 }
])
const deviation = items.standardDeviation('value')
```

### Working with Objects

```typescript
interface Product {
  id: number
  price: number
  dailySales: number
}

const products = collect<Product>([
  { id: 1, price: 100, dailySales: 5 },
  { id: 2, price: 200, dailySales: 3 },
  { id: 3, price: 150, dailySales: 8 }
])

// Analyze price variation
const priceDeviation = products.standardDeviation('price')

// Analyze sales variation
const salesDeviation = products.standardDeviation('dailySales')
```

### Real-world Examples

#### Price Analysis System

```typescript
interface PricePoint {
  productId: string
  price: number
  date: string
  market: string
  competitorPrice?: number
}

class PriceAnalyzer {
  constructor(private priceData: Collection<PricePoint>) {}

  getPriceVolatility(): {
    internal: StandardDeviationResult
    competitor: StandardDeviationResult
    difference: number
  } {
    const internalDeviation = this.priceData.standardDeviation('price')
    const competitorDeviation = this.priceData
      .filter(p => p.competitorPrice !== undefined)
      .standardDeviation('competitorPrice')

    return {
      internal: internalDeviation,
      competitor: competitorDeviation,
      difference: Math.abs(internalDeviation.population - competitorDeviation.population)
    }
  }

  getMarketVolatility(market: string): StandardDeviationResult {
    return this.priceData
      .filter(p => p.market === market)
      .standardDeviation('price')
  }

  identifyAnomalies(threshold: number): PricePoint[] {
    const { population } = this.priceData.standardDeviation('price')
    const mean = this.priceData.avg('price')

    return this.priceData
      .filter(point => Math.abs(point.price - mean) > threshold * population)
      .toArray()
  }
}
```

#### Sales Performance Analyzer

```typescript
interface SalesMetric {
  salesRepId: string
  dailySales: number
  conversion: number
  region: string
}

class PerformanceAnalyzer {
  constructor(private metrics: Collection<SalesMetric>) {}

  getSalesConsistency(): Map<string, StandardDeviationResult> {
    return new Map(
      Array.from(
        this.metrics
          .groupBy('salesRepId')
          .entries()
      ).map(([id, data]) => [
        id,
        data.standardDeviation('dailySales')
      ])
    )
  }

  getRegionalVariation(): Map<string, StandardDeviationResult> {
    return new Map(
      Array.from(
        this.metrics
          .groupBy('region')
          .entries()
      ).map(([region, data]) => [
        region,
        data.standardDeviation('conversion')
      ])
    )
  }

  identifyOutperformers(threshold: number): string[] {
    const { population } = this.metrics.standardDeviation('dailySales')
    const mean = this.metrics.avg('dailySales')

    return this.metrics
      .filter(rep => rep.dailySales > mean + (threshold * population))
      .pluck('salesRepId')
      .unique()
      .toArray()
  }
}
```

### Advanced Usage

#### Inventory Fluctuation Analyzer

```typescript
interface StockLevel {
  sku: string
  quantity: number
  warehouse: string
  date: string
  reorderPoint: number
}

class InventoryAnalyzer {
  constructor(private stockData: Collection<StockLevel>) {}

  getStockVariability(): {
    overall: StandardDeviationResult
    byWarehouse: Map<string, StandardDeviationResult>
  } {
    return {
      overall: this.stockData.standardDeviation('quantity'),
      byWarehouse: new Map(
        Array.from(
          this.stockData
            .groupBy('warehouse')
            .entries()
        ).map(([warehouse, data]) => [
          warehouse,
          data.standardDeviation('quantity')
        ])
      )
    }
  }

  identifyUnstableItems(threshold: number): string[] {
    const skuGroups = this.stockData.groupBy('sku')
    const unstableSkus: string[] = []

    skuGroups.forEach((data, sku) => {
      const { population } = data.standardDeviation('quantity')
      const mean = data.avg('quantity')
      const coefficient = population / mean

      if (coefficient > threshold) {
        unstableSkus.push(sku)
      }
    })

    return unstableSkus
  }

  getReorderPointEfficiency(): Map<string, number> {
    const skuGroups = this.stockData.groupBy('sku')
    const efficiency = new Map<string, number>()

    skuGroups.forEach((data, sku) => {
      const { population } = data.standardDeviation('quantity')
      const reorderPoint = data.first()?.reorderPoint || 0
      efficiency.set(sku, population / reorderPoint)
    })

    return efficiency
  }
}
```

## Type Safety

```typescript
interface TypedMetric {
  id: number
  value: number
  count: number
}

const metrics = collect<TypedMetric>([
  { id: 1, value: 100, count: 5 },
  { id: 2, value: 200, count: 3 }
])

// Type-safe standard deviation calculation
const valueDeviation: StandardDeviationResult = metrics.standardDeviation('value')
const countDeviation: StandardDeviationResult = metrics.standardDeviation('count')

// TypeScript enforces valid keys
// metrics.standardDeviation('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns an object containing:
  - `population`: Population standard deviation
  - `sample`: Sample standard deviation
- Both values are numbers
- Returns { population: 0, sample: 0 } for empty collections
- Ignores non-numeric values
- Maintains precision
- Handles decimal values

## Common Use Cases

### 1. Price Analysis

- Price volatility
- Market variation
- Competitor analysis
- Seasonal fluctuation
- Regional differences

### 2. Sales Performance

- Sales consistency
- Performance variation
- Regional differences
- Team comparison
- Trend analysis

### 3. Inventory Management

- Stock variation
- Demand fluctuation
- Supply consistency
- Location comparison
- Level stability

### 4. Quality Control

- Process variation
- Product consistency
- Performance stability
- Error rates
- Defect analysis

### 5. Customer Behavior

- Purchase patterns
- Usage variation
- Engagement consistency
- Response times
- Satisfaction scores

### 6. Performance Metrics

- Response times
- Load variations
- Usage patterns
- Error rates
- System stability

### 7. Financial Analysis

- Revenue variation
- Cost fluctuation
- Margin stability
- Growth patterns
- Risk assessment

### 8. Marketing Analytics

- Campaign performance
- Response variation
- Engagement patterns
- Conversion stability
- ROI consistency

### 9. Operational Efficiency

- Process stability
- Time variations
- Resource usage
- Cost patterns
- Output consistency

### 10. Supply Chain

- Lead time variation
- Delivery consistency
- Order patterns
- Cost stability
- Quality variation
