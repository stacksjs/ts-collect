# variance Method

The `variance()` method calculates the population variance of values in the collection. When a key is provided, it calculates the variance of values for that specific property. The variance represents the average squared deviation from the mean.

## Basic Syntax

```typescript
collect(items).variance(key?: keyof T): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple variance calculation
const numbers = collect([4, 8, 6, 2, 10])
console.log(numbers.variance())  // 8.4

// With objects
const items = collect([
  { value: 10 },
  { value: 20 },
  { value: 15 },
  { value: 25 }
])
console.log(items.variance('value'))  // 35.0
```

### Working with Objects

```typescript
interface Product {
  id: number
  price: number
  salesVolume: number
  restockDays: number
}

const products = collect<Product>([
  { id: 1, price: 100, salesVolume: 50, restockDays: 7 },
  { id: 2, price: 150, salesVolume: 30, restockDays: 5 },
  { id: 3, price: 200, salesVolume: 40, restockDays: 10 },
  { id: 4, price: 120, salesVolume: 45, restockDays: 6 }
])

// Analyze price spread
const priceVariance = products.variance('price')

// Analyze sales volume consistency
const salesVariance = products.variance('salesVolume')
```

### Real-world Examples

#### Price Stability Analyzer

```typescript
interface PricePoint {
  productId: string
  price: number
  date: string
  market: string
  seasonality: number
}

class PriceStabilityAnalyzer {
  constructor(private prices: Collection<PricePoint>) {}

  getMarketStability(): Map<string, number> {
    const markets = new Map<string, number>()

    this.prices
      .groupBy('market')
      .forEach((prices, market) => {
        markets.set(market, prices.variance('price'))
      })

    return markets
  }

  getSeasonalityImpact(): {
    priceVariance: number,
    seasonalityVariance: number,
    correlation: number
  } {
    return {
      priceVariance: this.prices.variance('price'),
      seasonalityVariance: this.prices.variance('seasonality'),
      correlation: this.calculateCorrelation('price', 'seasonality')
    }
  }

  private calculateCorrelation(key1: keyof PricePoint, key2: keyof PricePoint): number {
    // Implementation of correlation calculation
    return 0 // Placeholder
  }

  identifyVolatileProducts(threshold: number): string[] {
    return Array.from(
      this.prices
        .groupBy('productId')
        .entries()
    )
      .filter(([_, prices]) => prices.variance('price') > threshold)
      .map(([productId]) => productId)
  }
}
```

#### Performance Variance Analyzer

```typescript
interface SalesMetric {
  salesRepId: string
  dailySales: number
  customerCount: number
  avgTicketSize: number
}

class PerformanceAnalyzer {
  constructor(private metrics: Collection<SalesMetric>) {}

  getConsistencyScores(): {
    sales: number,
    customers: number,
    ticketSize: number
  } {
    return {
      sales: this.calculateNormalizedVariance('dailySales'),
      customers: this.calculateNormalizedVariance('customerCount'),
      ticketSize: this.calculateNormalizedVariance('avgTicketSize')
    }
  }

  private calculateNormalizedVariance(key: keyof SalesMetric): number {
    const variance = this.metrics.variance(key)
    const mean = this.metrics.avg(key)
    return variance / (mean * mean) // Coefficient of variation squared
  }

  identifyInconsistentPerformers(): string[] {
    const salesVariance = this.metrics
      .groupBy('salesRepId')
      .map(metrics => ({
        id: metrics.first()?.salesRepId ?? '',
        variance: metrics.variance('dailySales')
      }))
      .sortByDesc('variance')
      .take(5)
      .pluck('id')
      .toArray()

    return salesVariance
  }
}
```

### Advanced Usage

#### Inventory Variation Analyzer

```typescript
interface StockLevel {
  sku: string
  quantity: number
  demandRate: number
  leadTime: number
  warehouse: string
}

class InventoryAnalyzer {
  constructor(private inventory: Collection<StockLevel>) {}

  getStockVariability(): Map<string, {
    quantityVariance: number,
    demandVariance: number,
    leadTimeVariance: number
  }> {
    const warehouseMetrics = new Map()

    this.inventory
      .groupBy('warehouse')
      .forEach((items, warehouse) => {
        warehouseMetrics.set(warehouse, {
          quantityVariance: items.variance('quantity'),
          demandVariance: items.variance('demandRate'),
          leadTimeVariance: items.variance('leadTime')
        })
      })

    return warehouseMetrics
  }

  calculateSafetyStock(sku: string): number {
    const skuData = this.inventory.where('sku', sku)
    const leadTimeVar = skuData.variance('leadTime')
    const demandVar = skuData.variance('demandRate')

    // Safety stock calculation using variance
    const avgDemand = skuData.avg('demandRate')
    const avgLeadTime = skuData.avg('leadTime')

    return Math.sqrt(
      avgLeadTime * demandVar +
      avgDemand * avgDemand * leadTimeVar
    ) * 2.33 // 99% service level
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

// Type-safe variance calculation
const valueVariance: number = metrics.variance('value')
const countVariance: number = metrics.variance('count')

// TypeScript enforces valid keys
// metrics.variance('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns the population variance as a number
- Returns 0 for empty collections or single items
- Ignores non-numeric values
- Maintains numeric precision
- Uses population variance formula
- Squares the deviations from mean

## Common Use Cases

### 1. Price Analysis

- Price stability
- Market volatility
- Competitive spread
- Regional variation
- Seasonal fluctuation

### 2. Performance Metrics

- Sales consistency
- Productivity variation
- Quality dispersion
- Efficiency spread
- Response time variation

### 3. Inventory Management

- Stock level variation
- Demand volatility
- Lead time variation
- Safety stock calculation
- Order size dispersion

### 4. Customer Behavior

- Purchase patterns
- Visit frequency
- Order size variation
- Response variation
- Satisfaction spread

### 5. Market Analysis

- Market volatility
- Segment variation
- Share fluctuation
- Growth dispersion
- Penetration spread

### 6. Quality Control

- Process variation
- Product consistency
- Defect spread
- Measurement dispersion
- Tolerance analysis

### 7. Risk Assessment

- Performance risk
- Market volatility
- Supply variation
- Demand uncertainty
- Cost fluctuation

### 8. Operational Metrics

- Process variation
- Time dispersion
- Cost spread
- Efficiency variation
- Resource utilization

### 9. Financial Analysis

- Revenue variation
- Cost dispersion
- Margin spread
- Growth volatility
- Return variation

### 10. Supply Chain

- Lead time variation
- Order size spread
- Delivery dispersion
- Cost fluctuation
- Quality variation
