# impute Method

The `impute()` method fills missing values (null or undefined) in a collection using specified statistical strategies. It supports mean, median, or mode imputation for numerical or categorical data.

## Basic Syntax

```typescript
impute<K extends keyof T>(key: K, strategy: 'mean' | 'median' | 'mode'): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { id: 1, value: 10 },
  { id: 2, value: null },
  { id: 3, value: 15 },
  { id: 4, value: 20 }
])

// Fill missing values with mean
const meanImputed = data.impute('value', 'mean')
// { id: 1, value: 10 },
// { id: 2, value: 15 }, // Imputed with mean
// { id: 3, value: 15 },
// { id: 4, value: 20 }
```

### Multiple Strategies

```typescript
interface SensorData {
  timestamp: number
  temperature: number | null
  humidity: number | null
  category: string | null
}

const readings = collect<SensorData>([
  { timestamp: 1, temperature: 20, humidity: 45, category: 'normal' },
  { timestamp: 2, temperature: null, humidity: 47, category: null },
  { timestamp: 3, temperature: 22, humidity: null, category: 'normal' }
])

const cleaned = readings
  .impute('temperature', 'mean')
  .impute('humidity', 'median')
  .impute('category', 'mode')
```

### Real-world Example: E-commerce Data Cleaning

```typescript
interface ProductMetrics {
  productId: string
  name: string
  price: number | null
  rating: number | null
  stockLevel: number | null
  category: string | null
}

class ProductDataCleaner {
  private products: CollectionOperations<ProductMetrics>

  constructor(products: ProductMetrics[]) {
    this.products = collect(products)
  }

  cleanData(): CollectionOperations<ProductMetrics> {
    return this.products
      .impute('price', 'median')    // Use median for prices
      .impute('rating', 'mean')     // Use mean for ratings
      .impute('stockLevel', 'mean') // Use mean for stock levels
      .impute('category', 'mode')   // Use mode for categories
  }

  getCategoryAnalytics() {
    const cleaned = this.cleanData()
    return cleaned
      .groupBy('category')
      .map(group => ({
        category: group.first()?.category,
        averagePrice: group.avg('price'),
        averageRating: group.avg('rating'),
        totalStock: group.sum('stockLevel')
      }))
  }
}

// Usage example
const cleaner = new ProductDataCleaner([
  {
    productId: 'A1',
    name: 'Laptop',
    price: 999,
    rating: 4.5,
    stockLevel: 100,
    category: 'Electronics'
  },
  {
    productId: 'A2',
    name: 'Mouse',
    price: null,  // Missing price
    rating: null, // Missing rating
    stockLevel: 50,
    category: 'Electronics'
  }
])
```

## Return Value

- Returns a new collection with imputed values
- Maintains original data structure
- Preserves non-null values
- Handles different data types appropriately
- Maintains collection type safety
- Chain-able with other collection methods

## Common Use Cases

1. Data Cleaning
   - Handling missing prices
   - Filling incomplete records
   - Preparing analysis data
   - Standardizing datasets

2. Statistical Analysis
   - Product metrics analysis
   - Customer behavior studies
   - Performance evaluations
   - Market research

3. Machine Learning Prep
   - Feature preparation
   - Training data cleaning
   - Model input preparation
   - Dataset normalization

4. Quality Assurance
   - Data validation
   - Report preparation
   - Analytics processing
   - Metric calculations

5. Time Series Analysis
   - Sensor data processing
   - Sales trend analysis
   - Performance tracking
   - Usage analytics
