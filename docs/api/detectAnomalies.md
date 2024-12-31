# detectAnomalies Method

The `detectAnomalies()` method identifies unusual patterns or outliers in a collection using various statistical methods. It supports z-score, IQR (Interquartile Range), and Isolation Forest approaches for anomaly detection.

## Basic Syntax

```typescript
detectAnomalies(options: AnomalyDetectionOptions<T>): CollectionOperations<T>

interface AnomalyDetectionOptions<T> {
  method?: 'zscore' | 'iqr' | 'isolationForest'
  threshold?: number
  features?: Array<keyof T>
}
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const transactions = collect([
  { id: 1, amount: 100 },
  { id: 2, amount: 150 },
  { id: 3, amount: 1500 }, // Anomaly
  { id: 4, amount: 120 }
])

// Using z-score method
const anomalies = transactions.detectAnomalies({
  method: 'zscore',
  threshold: 2,
  features: ['amount']
})
```

### Multiple Feature Detection

```typescript
interface UserActivity {
  userId: string
  loginCount: number
  downloadCount: number
  uploadSize: number
}

const activities = collect<UserActivity>([
  { userId: 'A1', loginCount: 10, downloadCount: 20, uploadSize: 1000 },
  { userId: 'A2', loginCount: 100, downloadCount: 500, uploadSize: 50000 }, // Anomaly
  { userId: 'A3', loginCount: 15, downloadCount: 25, uploadSize: 1200 }
])

const suspicious = activities.detectAnomalies({
  method: 'iqr',
  threshold: 1.5,
  features: ['loginCount', 'downloadCount', 'uploadSize']
})
```

### Real-world Example: E-commerce Fraud Detection

```typescript
interface Order {
  orderId: string
  customerId: string
  amount: number
  itemCount: number
  shippingDistance: number
  processingTime: number
}

class FraudDetector {
  private orders: CollectionOperations<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  detectSuspiciousOrders() {
    return this.orders.detectAnomalies({
      method: 'isolationForest',
      threshold: 0.9,
      features: ['amount', 'itemCount', 'shippingDistance', 'processingTime']
    })
  }

  getHighRiskTransactions() {
    const amountAnomalies = this.orders.detectAnomalies({
      method: 'zscore',
      threshold: 3,
      features: ['amount']
    })

    const timeAnomalies = this.orders.detectAnomalies({
      method: 'iqr',
      threshold: 2,
      features: ['processingTime']
    })

    return amountAnomalies.merge(timeAnomalies).unique('orderId')
  }
}

// Usage example
const detector = new FraudDetector([
  {
    orderId: 'ORD-001',
    customerId: 'CUST-1',
    amount: 199.99,
    itemCount: 2,
    shippingDistance: 50,
    processingTime: 30
  },
  {
    orderId: 'ORD-002',
    customerId: 'CUST-2',
    amount: 9999.99, // Anomaly
    itemCount: 1,
    shippingDistance: 500,
    processingTime: 5
  }
])
```

## Return Value

- Returns a collection containing detected anomalies
- Maintains original data structure and types
- Excludes normal data points
- Preserves feature relationships
- Chain-able with other collection methods
- Handles missing or invalid values gracefully

## Common Use Cases

1. Fraud Detection
   - Transaction monitoring
   - Order validation
   - Account security
   - Payment verification

2. Quality Control
   - Performance monitoring
   - Product testing
   - Process validation
   - Error detection

3. Security Monitoring
   - User behavior analysis
   - Access pattern detection
   - System monitoring
   - Risk assessment

4. Data Validation
   - Input verification
   - Data cleaning
   - Outlier detection
   - Error identification

5. Performance Analysis
   - System metrics
   - User activity monitoring
   - Resource usage
   - Response time analysis
