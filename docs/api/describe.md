# describe Method

The `describe()` method returns descriptive statistics about the collection or a specific numeric property. Returns a Map containing various statistical measures including count, mean, min, max, sum, standard deviation, variance, quartiles, and interquartile range.

## Basic Syntax

```typescript
collect(items).describe(key?: keyof T): Map<string, number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple numeric array
const numbers = collect([1, 2, 3, 4, 5])
const stats = numbers.describe()
console.log(Object.fromEntries(stats))
// {
//   count: 5,
//   mean: 3,
//   min: 1,
//   max: 5,
//   sum: 15,
//   stdDev: 1.4142...,
//   variance: 2,
//   q1: 2,
//   q3: 4,
//   iqr: 2
// }

// With specific property
const items = collect([
  { value: 10 },
  { value: 20 },
  { value: 30 }
])
const valueStats = items.describe('value')
```

### Working with Objects

```typescript
interface Product {
  id: string
  price: number
  stock: number
  rating: number
}

const products = collect<Product>([
  { id: '1', price: 100, stock: 50, rating: 4.5 },
  { id: '2', price: 200, stock: 30, rating: 4.8 },
  { id: '3', price: 150, stock: 40, rating: 4.2 }
])

// Get price statistics
const priceStats = products.describe('price')
// Get stock statistics
const stockStats = products.describe('stock')
```

### Real-world Examples

#### Price Analysis System

```typescript
interface PriceData {
  productId: string
  category: string
  basePrice: number
  salePrice: number
  margin: number
}

class PriceAnalyzer {
  constructor(private prices: Collection<PriceData>) {}

  getPriceAnalysis(): {
    basePrice: Map<string, number>
    salePrice: Map<string, number>
    margin: Map<string, number>
    insights: {
      averageDiscount: number
      marginRange: string
      priceVariability: string
    }
  } {
    const basePriceStats = this.prices.describe('basePrice')
    const salePriceStats = this.prices.describe('salePrice')
    const marginStats = this.prices.describe('margin')

    return {
      basePrice: basePriceStats,
      salePrice: salePriceStats,
      margin: marginStats,
      insights: {
        averageDiscount: this.calculateAverageDiscount(),
        marginRange: this.getMarginRangeDescription(marginStats),
        priceVariability: this.getPriceVariabilityInsight(basePriceStats)
      }
    }
  }

  getPricingRecommendations(): Array<{
    category: string
    recommendation: string
    confidence: number
  }> {
    return Array.from(
      this.prices.groupBy('category').entries()
    ).map(([category, items]) => {
      const stats = items.describe('margin')
      return {
        category,
        recommendation: this.generateRecommendation(stats),
        confidence: this.calculateConfidence(stats)
      }
    })
  }

  private calculateAverageDiscount(): number {
    return this.prices.avg(item =>
      ((item.basePrice - item.salePrice) / item.basePrice) * 100
    )
  }

  private getMarginRangeDescription(stats: Map<string, number>): string {
    const range = stats.get('iqr') || 0
    if (range > 20) return 'High margin variability'
    if (range > 10) return 'Moderate margin variability'
    return 'Consistent margins'
  }

  private getPriceVariabilityInsight(stats: Map<string, number>): string {
    const cv = (stats.get('stdDev') || 0) / (stats.get('mean') || 1)
    if (cv > 0.5) return 'High price variation'
    if (cv > 0.2) return 'Moderate price variation'
    return 'Consistent pricing'
  }

  private generateRecommendation(stats: Map<string, number>): string {
    const margin = stats.get('mean') || 0
    const variability = stats.get('stdDev') || 0

    if (margin < 20 && variability < 5) {
      return 'Consider price increase'
    }
    if (margin > 40 && variability > 10) {
      return 'Standardize pricing strategy'
    }
    return 'Maintain current strategy'
  }

  private calculateConfidence(stats: Map<string, number>): number {
    const variability = stats.get('stdDev') || 0
    const mean = stats.get('mean') || 0
    return Math.max(0, 100 - (variability / mean * 100))
  }
}
```

#### Sales Performance Analyzer

```typescript
interface SalesMetric {
  period: string
  revenue: number
  units: number
  acquisitionCost: number
  customerCount: number
}

class SalesAnalyzer {
  constructor(private metrics: Collection<SalesMetric>) {}

  getPerformanceMetrics(): {
    revenue: Map<string, number>
    efficiency: {
      costPerUnit: Map<string, number>
      customerAcquisition: Map<string, number>
    }
    trends: {
      revenueGrowth: string
      unitEconomics: string
      scalability: string
    }
  } {
    const revenue = this.metrics.describe('revenue')
    const cpuStats = this.calculateCostPerUnit()
    const cacStats = this.calculateCustomerAcquisitionCost()

    return {
      revenue,
      efficiency: {
        costPerUnit: cpuStats,
        customerAcquisition: cacStats
      },
      trends: {
        revenueGrowth: this.analyzeGrowth(revenue),
        unitEconomics: this.analyzeUnitEconomics(cpuStats),
        scalability: this.analyzeScalability(cacStats)
      }
    }
  }

  private calculateCostPerUnit(): Map<string, number> {
    const costPerUnit = this.metrics.map(m => ({
      cpu: m.acquisitionCost / m.units
    }))
    return collect(costPerUnit).describe('cpu')
  }

  private calculateCustomerAcquisitionCost(): Map<string, number> {
    const cac = this.metrics.map(m => ({
      cac: m.acquisitionCost / m.customerCount
    }))
    return collect(cac).describe('cac')
  }

  private analyzeGrowth(stats: Map<string, number>): string {
    const mean = stats.get('mean') || 0
    const stdDev = stats.get('stdDev') || 0
    const cv = stdDev / mean

    if (cv < 0.1) return 'Stable growth'
    if (cv < 0.3) return 'Moderate volatility'
    return 'High volatility'
  }

  private analyzeUnitEconomics(stats: Map<string, number>): string {
    const mean = stats.get('mean') || 0
    if (mean < 10) return 'Efficient'
    if (mean < 20) return 'Moderate'
    return 'Needs optimization'
  }

  private analyzeScalability(stats: Map<string, number>): string {
    const trend = (stats.get('q3') || 0) - (stats.get('q1') || 0)
    if (trend < 0) return 'Improving efficiency'
    if (trend < 5) return 'Stable efficiency'
    return 'Declining efficiency'
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

// Type-safe statistical description
const valueStats: Map<string, number> = metrics.describe('value')
const countStats: Map<string, number> = metrics.describe('count')

// TypeScript enforces valid keys
// metrics.describe('invalid')  // ✗ TypeScript error
```

## Return Value

Map containing the following statistics:

```typescript
{
  count: number      // Number of items
  mean: number       // Average value
  min: number        // Minimum value
  max: number        // Maximum value
  sum: number        // Sum of values
  stdDev: number     // Standard deviation
  variance: number   // Variance
  q1: number        // First quartile (25th percentile)
  q3: number        // Third quartile (75th percentile)
  iqr: number       // Interquartile range
}
```

## Common Use Cases

### 1. Price Analysis

- Price distribution
- Margin analysis
- Discount impact
- Price segmentation
- Market positioning

### 2. Sales Performance

- Revenue analysis
- Unit economics
- Growth metrics
- Efficiency measures
- Performance trends

### 3. Inventory Analysis

- Stock levels
- Reorder patterns
- Usage statistics
- Turnover metrics
- Supply analysis

### 4. Customer Metrics

- Purchase values
- Order frequency
- Lifetime value
- Engagement scores
- Satisfaction ratings

### 5. Product Performance

- Sales metrics
- Rating analysis
- Review scores
- Return rates
- Conversion rates

### 6. Marketing Analysis

- Campaign performance
- Conversion metrics
- Cost efficiency
- Engagement rates
- ROI analysis

### 7. Financial Analysis

- Revenue patterns
- Cost structure
- Profit margins
- Growth rates
- Expense analysis

### 8. Operational Metrics

- Processing times
- Efficiency rates
- Error rates
- Performance scores
- Quality metrics

### 9. User Behavior

- Usage patterns
- Activity levels
- Engagement metrics
- Response times
- Interaction rates

### 10. Performance Tracking

- Speed metrics
- Load times
- Error rates
- Resource usage
- Capacity utilization
