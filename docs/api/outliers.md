# Outliers Method

The `outliers()` method identifies items in the collection where the specified numeric field value deviates significantly from the mean. It uses standard deviations to detect outliers, with a configurable threshold value.

## Basic Syntax

```typescript
outliers<K extends keyof T>(key: K, threshold = 2): CollectionOperations<T>
```

## Parameters

- `key`: The numeric field to analyze
- `threshold`: Number of standard deviations from mean (default: 2)

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { value: 10 },
  { value: 12 },
  { value: 11 },
  { value: 100 },  // outlier
  { value: 13 }
])

const anomalies = data.outliers('value')
console.log(anomalies.all())
// [{ value: 100 }]
```

### Working with Multiple Fields

```typescript
interface ProductMetrics {
  sku: string
  price: number
  views: number
  conversionRate: number
}

const products = collect<ProductMetrics>([
  { sku: 'A1', price: 99, views: 1000, conversionRate: 0.02 },
  { sku: 'A2', price: 89, views: 950, conversionRate: 0.03 },
  { sku: 'A3', price: 499, views: 800, conversionRate: 0.15 }, // price outlier
  { sku: 'A4', price: 79, views: 5000, conversionRate: 0.02 }  // views outlier
])

// Check price outliers with custom threshold
const priceOutliers = products.outliers('price', 1.5)

// Check view count outliers
const viewOutliers = products.outliers('views')
```

### Real-world Example: E-commerce Anomaly Detection

```typescript
interface OrderMetrics {
  orderId: string
  total: number
  items: number
  shippingCost: number
  processingTime: number
}

class OrderAnomalyDetector {
  private orders: Collection<OrderMetrics>

  constructor(orders: OrderMetrics[]) {
    this.orders = collect(orders)
  }

  findAnomalousOrders() {
    return {
      highValueOrders: this.orders
        .outliers('total', 2)
        .map(order => ({
          ...order,
          reason: 'Unusually high order value'
        })),

      highShippingCost: this.orders
        .outliers('shippingCost', 2)
        .map(order => ({
          ...order,
          reason: 'Abnormal shipping cost'
        })),

      processingDelays: this.orders
        .outliers('processingTime', 2)
        .map(order => ({
          ...order,
          reason: 'Processing time anomaly'
        }))
    }
  }

  generateAnomalyReport(): string {
    const anomalies = this.findAnomalousOrders()

    return collect([
      ...anomalies.highValueOrders,
      ...anomalies.highShippingCost,
      ...anomalies.processingDelays
    ]).unique('orderId')
      .map(order =>
        `Order ${order.orderId}: ${order.reason} (Value: $${order.total})`
      )
      .join('\n')
  }
}

// Usage
const detector = new OrderAnomalyDetector([
  {
    orderId: 'ORD-1',
    total: 99.99,
    items: 2,
    shippingCost: 10,
    processingTime: 24
  },
  {
    orderId: 'ORD-2',
    total: 999.99, // outlier
    items: 1,
    shippingCost: 50, // outlier
    processingTime: 48
  }
])

console.log(detector.generateAnomalyReport())
```

## Type Safety

```typescript
interface MetricData {
  timestamp: Date
  value: number
  category: string
}

const metrics = collect<MetricData>([
  { timestamp: new Date(), value: 100, category: 'A' },
  { timestamp: new Date(), value: 500, category: 'B' }
])

// Type-safe outlier detection
const anomalies: CollectionOperations<MetricData> = metrics.outliers('value')

// TypeScript enforces numeric fields
// metrics.outliers('category') // ✗ TypeScript error
```

## Return Value

- Returns a Collection containing only outlier items
- Outliers are determined by statistical deviation
- Empty collection if no outliers found
- Original items preserved (not modified)
- Maintains type safety through generics
- Skips non-numeric and undefined values

## Common Use Cases

### 1. Fraud Detection

- Unusual transaction amounts
- Suspicious order patterns
- Irregular shipping costs
- Abnormal return rates
- Payment anomalies

### 2. Quality Control

- Processing time anomalies
- Error rate spikes
- Performance outliers
- Resource usage spikes
- Service degradation

### 3. Inventory Analysis

- Price inconsistencies
- Stock level anomalies
- Reorder point violations
- Demand spikes
- Shelf life outliers

### 4. Customer Behavior

- Unusual purchase patterns
- Session duration anomalies
- Cart size outliers
- Conversion rate anomalies
- Traffic spikes

### 5. Performance Monitoring

- Response time outliers
- Load anomalies
- Resource consumption spikes
- Error rate anomalies
- Throughput deviations
