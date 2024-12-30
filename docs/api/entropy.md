# Entropy Method

The `entropy()` method calculates the Shannon entropy (information entropy) of a collection's values or specified field. Entropy measures the average unpredictability or randomness in a dataset, with higher values indicating more uncertainty or variability.

## Basic Syntax

```typescript
entropy<K extends keyof T>(key?: K): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const categories = collect(['A', 'A', 'B', 'C', 'C', 'C'])
const entropy = categories.entropy()

console.log(entropy)
// Lower value indicates less randomness (C is more frequent)
```

### Working with Object Properties

```typescript
interface OrderStatus {
  orderId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
}

const orders = collect<OrderStatus>([
  { orderId: 'ORD1', status: 'delivered' },
  { orderId: 'ORD2', status: 'processing' },
  { orderId: 'ORD3', status: 'delivered' },
  { orderId: 'ORD4', status: 'pending' }
])

const statusEntropy = orders.entropy('status')
// Measures distribution randomness of order statuses
```

### Real-world Example: E-commerce Customer Analysis

```typescript
interface CustomerBehavior {
  customerId: string
  preferredCategory: string
  deviceType: string
  paymentMethod: string
  purchaseFrequency: 'low' | 'medium' | 'high'
}

class CustomerAnalyzer {
  private behaviors: Collection<CustomerBehavior>

  constructor(behaviors: CustomerBehavior[]) {
    this.behaviors = collect(behaviors)
  }

  analyzeVariability() {
    return {
      categoryDiversity: {
        entropy: this.behaviors.entropy('preferredCategory'),
        interpretation: this.interpretEntropy('preferredCategory')
      },
      deviceDiversity: {
        entropy: this.behaviors.entropy('deviceType'),
        interpretation: this.interpretEntropy('deviceType')
      },
      paymentDiversity: {
        entropy: this.behaviors.entropy('paymentMethod'),
        interpretation: this.interpretEntropy('paymentMethod')
      }
    }
  }

  interpretEntropy(field: keyof CustomerBehavior): string {
    const entropy = this.behaviors.entropy(field)

    if (entropy < 1) {
      return `${field} shows low variability - customer preferences are concentrated`
    }
    if (entropy < 2) {
      return `${field} shows moderate variability - some preference patterns exist`
    }
    return `${field} shows high variability - diverse customer preferences`
  }

  getMarketingRecommendations(): string[] {
    const recommendations: string[] = []
    const categoryEntropy = this.behaviors.entropy('preferredCategory')
    const deviceEntropy = this.behaviors.entropy('deviceType')

    if (categoryEntropy < 1) {
      recommendations.push(
        'Consider expanding product categories - customer interests are narrow'
      )
    }

    if (deviceEntropy > 2) {
      recommendations.push(
        'Optimize for multiple devices - customers use diverse platforms'
      )
    }

    return recommendations
  }
}

// Usage
const analyzer = new CustomerAnalyzer([
  {
    customerId: 'C1',
    preferredCategory: 'Electronics',
    deviceType: 'mobile',
    paymentMethod: 'credit',
    purchaseFrequency: 'high'
  },
  {
    customerId: 'C2',
    preferredCategory: 'Electronics',
    deviceType: 'desktop',
    paymentMethod: 'paypal',
    purchaseFrequency: 'medium'
  }
])

const analysis = analyzer.analyzeVariability()
```

## Type Safety

```typescript
interface Sales {
  product: string
  quantity: number
}

const sales = collect<Sales>([
  { product: 'A', quantity: 10 },
  { product: 'B', quantity: 20 }
])

// Type-safe entropy calculation
const productEntropy: number = sales.entropy('product')

// TypeScript enforces valid field names
// sales.entropy('invalid') // ✗ TypeScript error
```

## Return Value

- Returns a number representing entropy where:
  - = 0: No uncertainty (all values same)
  - > 0: Increasing uncertainty/randomness
  - Maximum value depends on number of unique values
- Returns 0 for empty collections
- Handles undefined values
- Works with any value type
- Maintains type safety
- Uses log base 2 (bits of information)

## Common Use Cases

### 1. Customer Analysis

- Purchase diversity
- Preference patterns
- Behavior variability
- Channel usage
- Product selection

### 2. Product Analysis

- Category distribution
- Stock variability
- Price range diversity
- Rating patterns
- Feature usage

### 3. Sales Analysis

- Order patterns
- Payment methods
- Shipping options
- Time distribution
- Geographic spread

### 4. Marketing Impact

- Campaign effectiveness
- Channel diversity
- Message variability
- Response patterns
- Engagement diversity

### 5. System Analysis

- User behavior
- Error distribution
- Resource usage
- Access patterns
- Load variability
