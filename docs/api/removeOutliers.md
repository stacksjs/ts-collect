# removeOutliers Method

The `removeOutliers()` method filters out statistical outliers from a collection based on a specified numeric key using standard deviation. Values that deviate more than the specified threshold (in standard deviations) from the mean are removed.

## Basic Syntax

```typescript
removeOutliers<K extends keyof T>(key: K, threshold = 2): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 100 }, // Outlier
  { value: 4 }
])

const filtered = numbers.removeOutliers('value')
console.log(filtered.pluck('value').all())
// [1, 2, 3, 4]
```

### Statistical Analysis

```typescript
interface DataPoint {
  timestamp: number
  temperature: number
  humidity: number
}

const readings = collect<DataPoint>([
  { timestamp: 1, temperature: 22, humidity: 45 },
  { timestamp: 2, temperature: 23, humidity: 46 },
  { timestamp: 3, temperature: 21, humidity: 44 },
  { timestamp: 4, temperature: 45, humidity: 90 }, // Outlier
  { timestamp: 5, temperature: 22, humidity: 45 }
])

const cleanData = readings
  .removeOutliers('temperature')
  .removeOutliers('humidity')
```

### Real-world Example: E-commerce Price Analysis

```typescript
interface ProductSale {
  productId: string
  name: string
  price: number
  salePrice: number
  quantity: number
}

class SalesAnalyzer {
  private sales: CollectionOperations<ProductSale>

  constructor(sales: ProductSale[]) {
    this.sales = collect(sales)
  }

  getAverageSalePrice() {
    return this.sales
      .removeOutliers('salePrice', 3) // More permissive threshold
      .avg('salePrice')
  }

  getValidPriceRange() {
    const cleanSales = this.sales.removeOutliers('price')
    return {
      min: cleanSales.min('price')?.price,
      max: cleanSales.max('price')?.price,
      average: cleanSales.avg('price')
    }
  }

  getQuantityStats() {
    const cleaned = this.sales.removeOutliers('quantity')
    return {
      totalQuantity: cleaned.sum('quantity'),
      averageQuantity: cleaned.avg('quantity'),
      validTransactions: cleaned.count()
    }
  }
}

// Usage example
const analyzer = new SalesAnalyzer([
  { productId: 'A1', name: 'Laptop', price: 999, salePrice: 899, quantity: 1 },
  { productId: 'A2', name: 'Mouse', price: 49, salePrice: 39, quantity: 2 },
  { productId: 'A3', name: 'Keyboard', price: 89, salePrice: 79, quantity: 1 },
  { productId: 'A4', name: 'Error Entry', price: 9999, salePrice: 8999, quantity: 100 }, // Outlier
])
```

## Return Value

- Returns a new collection with outliers removed
- Maintains original data types and structure
- Preserves collection method chain-ability
- Uses statistical standard deviation for filtering
- Handles numeric values only for specified key
- Empty collections return empty result

## Common Use Cases

1. Data Cleaning
   - Removing price anomalies
   - Filtering sensor data
   - Cleaning statistical data
   - Normalizing datasets

2. Statistical Analysis
   - Sales data analysis
   - Performance metrics
   - Quality control
   - Trend analysis

3. Anomaly Detection
   - Price monitoring
   - Usage pattern analysis
   - Performance outliers
   - Error detection

4. Report Generation
   - Sales reports
   - Performance summaries
   - Statistical analysis
   - Data validation

5. Quality Control
   - Data validation
   - Measurement verification
   - Process monitoring
   - Error detection
