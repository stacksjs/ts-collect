# frequency Method

The `frequency()` method returns a Map containing the count of each unique value in the collection. When a key is provided, it counts occurrences of values for that specific property.

## Basic Syntax

```typescript
collect(items).frequency(key?: keyof T): Map<any, number>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple frequency count
const numbers = collect([1, 2, 2, 3, 3, 3, 4, 4])
const freq = numbers.frequency()
console.log(Array.from(freq.entries()))
// [[1, 1], [2, 2], [3, 3], [4, 2]]

// With objects
const items = collect([
  { category: 'A' },
  { category: 'B' },
  { category: 'A' },
  { category: 'C' }
])
const categoryFreq = items.frequency('category')
// Map { 'A' => 2, 'B' => 1, 'C' => 1 }
```

### Working with Objects

```typescript
interface Product {
  id: number
  category: string
  brand: string
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock'
}

const products = collect<Product>([
  { id: 1, category: 'electronics', brand: 'Apple', stockStatus: 'in-stock' },
  { id: 2, category: 'electronics', brand: 'Samsung', stockStatus: 'low-stock' },
  { id: 3, category: 'books', brand: 'Penguin', stockStatus: 'in-stock' },
  { id: 4, category: 'electronics', brand: 'Apple', stockStatus: 'out-of-stock' }
])

// Category distribution
const categoryDist = products.frequency('category')
// Map { 'electronics' => 3, 'books' => 1 }

// Brand distribution
const brandDist = products.frequency('brand')
// Map { 'Apple' => 2, 'Samsung' => 1, 'Penguin' => 1 }
```

### Real-world Examples

#### Order Analysis System

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  paymentMethod: string
  itemCount: number
  shippingZone: string
}

class OrderAnalyzer {
  constructor(private orders: Collection<Order>) {}

  getStatusDistribution(): Map<string, number> {
    return this.orders.frequency('status')
  }

  getPaymentMethodUsage(): Map<string, number> {
    return this.orders.frequency('paymentMethod')
  }

  getCommonOrderSizes(): {
    sizes: Map<number, number>,
    mostCommon: number
  } {
    const sizeFreq = this.orders.frequency('itemCount')
    let mostCommon = 0
    let maxFreq = 0

    sizeFreq.forEach((freq, size) => {
      if (freq > maxFreq) {
        maxFreq = freq
        mostCommon = size
      }
    })

    return {
      sizes: sizeFreq,
      mostCommon
    }
  }

  getShippingZoneLoad(): Map<string, number> {
    return this.orders
      .where('status', 'pending')
      .frequency('shippingZone')
  }
}
```

#### Product Category Analyzer

```typescript
interface CategoryData {
  productId: string
  mainCategory: string
  subCategory: string
  tags: string[]
  attributes: string[]
}

class CategoryAnalyzer {
  constructor(private categories: Collection<CategoryData>) {}

  getCategoryDistribution(): {
    main: Map<string, number>,
    sub: Map<string, number>
  } {
    return {
      main: this.categories.frequency('mainCategory'),
      sub: this.categories.frequency('subCategory')
    }
  }

  getPopularTags(): Map<string, number> {
    return this.categories
      .flatMap(cat => cat.tags)
      .frequency()
  }

  getCommonAttributes(): Map<string, number> {
    return this.categories
      .flatMap(cat => cat.attributes)
      .frequency()
  }

  getCategoryDensity(): Map<string, { count: number, percentage: number }> {
    const freq = this.categories.frequency('mainCategory')
    const total = this.categories.count()
    const density = new Map()

    freq.forEach((count, category) => {
      density.set(category, {
        count,
        percentage: (count / total) * 100
      })
    })

    return density
  }
}
```

### Advanced Usage

#### Customer Behavior Analyzer

```typescript
interface CustomerAction {
  customerId: string
  actionType: string
  deviceType: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  outcome: 'purchase' | 'abandon' | 'browse'
}

class BehaviorAnalyzer {
  constructor(private actions: Collection<CustomerAction>) {}

  getActionPatterns(): {
    byType: Map<string, number>,
    byDevice: Map<string, number>,
    byTime: Map<string, number>,
    byOutcome: Map<string, number>
  } {
    return {
      byType: this.actions.frequency('actionType'),
      byDevice: this.actions.frequency('deviceType'),
      byTime: this.actions.frequency('timeOfDay'),
      byOutcome: this.actions.frequency('outcome')
    }
  }

  getCustomerEngagement(): Map<string, number> {
    return this.actions.frequency('customerId')
  }

  getMostActiveTimeSlots(): string[] {
    const timeFreq = this.actions.frequency('timeOfDay')
    const maxFreq = Math.max(...timeFreq.values())

    return Array.from(timeFreq.entries())
      .filter(([_, freq]) => freq === maxFreq)
      .map(([time]) => time)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  category: string
  status: 'active' | 'inactive'
}

const items = collect<TypedItem>([
  { id: 1, category: 'A', status: 'active' },
  { id: 2, category: 'B', status: 'inactive' },
  { id: 3, category: 'A', status: 'active' }
])

// Type-safe frequency calculation
const categoryFreq: Map<string, number> = items.frequency('category')
const statusFreq: Map<string, number> = items.frequency('status')

// TypeScript enforces valid keys
// items.frequency('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a Map object
- Keys are unique values from collection
- Values are occurrence counts
- Empty collection returns empty Map
- Handles all value types
- Maintains insertion order (ES2015+)

## Common Use Cases

### 1. Category Analysis

- Product categories
- Content types
- Tag frequency
- Attribute counts
- Classification distribution

### 2. Order Analytics

- Order sizes
- Payment methods
- Shipping options
- Status distribution
- Return reasons

### 3. Customer Behavior

- Purchase patterns
- Visit frequency
- Device usage
- Time patterns
- Action types

### 4. Inventory Management

- Stock status
- Location distribution
- Supplier frequency
- Reorder patterns
- Storage usage

### 5. Performance Analysis

- Error types
- Response codes
- Success rates
- Usage patterns
- Load distribution

### 6. Product Analysis

- Feature frequency
- Option popularity
- Size distribution
- Color preferences
- Style trends

### 7. Marketing Analysis

- Campaign responses
- Channel usage
- Conversion paths
- Source attribution
- Content engagement

### 8. Support Analysis

- Issue types
- Resolution paths
- Contact methods
- Response times
- Satisfaction levels

### 9. User Experience

- Page visits
- Feature usage
- Navigation paths
- Error encounters
- Device types

### 10. Sales Analysis

- Sale types
- Discount usage
- Bundle combinations
- Promotion effectiveness
- Purchase patterns
