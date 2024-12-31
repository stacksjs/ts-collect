# ToPandas Method

The `toPandas()` method generates Python Pandas DataFrame construction code from the collection data. This is particularly useful when preparing data for analysis in Python or generating code for data science workflows.

## Basic Syntax

```typescript
toPandas(): string
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { id: 1, value: 100, category: 'A' },
  { id: 2, value: 200, category: 'B' }
])

const pandasCode = data.toPandas()
console.log(pandasCode)
// pd.DataFrame([
//   {"id": 1, "value": 100, "category": "A"},
//   {"id": 2, "value": 200, "category": "B"}
// ])
```

### Working with Complex Data Types

```typescript
interface Metrics {
  timestamp: Date
  values: number[]
  metadata: {
    source: string
    confidence: number
  }
}

const metrics = collect<Metrics>([{
  timestamp: new Date('2024-01-01'),
  values: [1, 2, 3],
  metadata: {
    source: 'sensor1',
    confidence: 0.95
  }
}])

const pandasCode = metrics.toPandas()
// Handles complex types appropriately
```

### Real-world Example: E-commerce Data Analysis Export

```typescript
interface SalesData {
  orderId: string
  date: Date
  customer: {
    id: string
    segment: string
  }
  products: Array<{
    id: string
    quantity: number
    price: number
  }>
  totals: {
    subtotal: number
    tax: number
    shipping: number
  }
}

class SalesAnalysisExporter {
  private sales: Collection<SalesData>

  constructor(sales: SalesData[]) {
    this.sales = collect(sales)
  }

  generateAnalysisScript(): string {
    // Flatten the data structure for analysis
    const flattenedData = this.sales.map(sale => ({
      order_id: sale.orderId,
      date: sale.date,
      customer_id: sale.customer.id,
      customer_segment: sale.customer.segment,
      product_count: sale.products.length,
      total_items: sale.products.reduce((sum, p) => sum + p.quantity, 0),
      subtotal: sale.totals.subtotal,
      tax: sale.totals.tax,
      shipping: sale.totals.shipping,
      total: sale.totals.subtotal + sale.totals.tax + sale.totals.shipping
    }))

    return `
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Create DataFrame
df = ${flattenedData.toPandas()}

# Basic analysis
print("Sales Summary:")
print(df.describe())

# Time series analysis
df['date'] = pd.to_datetime(df['date'])
daily_sales = df.groupby('date')['total'].sum().reset_index()

# Plot daily sales
plt.figure(figsize=(12, 6))
plt.plot(daily_sales['date'], daily_sales['total'])
plt.title('Daily Sales Trend')
plt.xlabel('Date')
plt.ylabel('Total Sales')
plt.xticks(rotation=45)

# Segment analysis
segment_summary = df.groupby('customer_segment').agg({
    'total': ['mean', 'sum', 'count'],
    'product_count': 'mean'
}).round(2)

print("\nSegment Analysis:")
print(segment_summary)
    `.trim()
  }

  generateProductAnalysis(): string {
    // Create product-level DataFrame
    const productData = this.sales.flatMap(sale =>
      sale.products.map(product => ({
        order_id: sale.orderId,
        date: sale.date,
        product_id: product.id,
        quantity: product.quantity,
        price: product.price,
        revenue: product.quantity * product.price,
        customer_segment: sale.customer.segment
      }))
    )

    return `
import pandas as pd

# Create product DataFrame
product_df = ${collect(productData).toPandas()}

# Product performance analysis
product_performance = product_df.groupby('product_id').agg({
    'quantity': 'sum',
    'revenue': 'sum',
    'order_id': 'count'
}).rename(columns={'order_id': 'order_count'})

print("Product Performance:")
print(product_performance.sort_values('revenue', ascending=False).head())
    `.trim()
  }
}

// Usage
const exporter = new SalesAnalysisExporter([
  {
    orderId: 'ORD1',
    date: new Date('2024-01-01'),
    customer: {
      id: 'C1',
      segment: 'Premium'
    },
    products: [
      { id: 'P1', quantity: 2, price: 99.99 }
    ],
    totals: {
      subtotal: 199.98,
      tax: 20.00,
      shipping: 10.00
    }
  }
])

const analysisScript = exporter.generateAnalysisScript()
const productAnalysis = exporter.generateProductAnalysis()
```

## Type Safety

```typescript
interface DataPoint {
  x: number
  y: number | null  // Handles null values
  label: string
}

const data = collect<DataPoint>([
  { x: 1, y: 10, label: 'A' },
  { x: 2, y: null, label: 'B' }
])

// Type-safe Pandas code generation
const pandasCode: string = data.toPandas()
```

## Return Value

- Returns a string containing Pandas DataFrame constructor code
- Properly formats JSON values
- Handles null values
- Preserves array structures
- Empty DataFrame if collection is empty
- Maintains data types where possible

## Common Use Cases

### 1. Data Analysis

- Statistical analysis
- Data exploration
- Time series analysis
- Pattern recognition
- Trend analysis

### 2. Data Science

- Machine learning prep
- Model training
- Feature engineering
- Data preprocessing
- Exploratory analysis

### 3. Reporting

- Data visualization
- Statistical reports
- Performance analysis
- Trend reporting
- KPI tracking

### 4. Integration

- Python integration
- Jupyter notebooks
- Analysis pipelines
- Data workflows
- Script generation

### 5. Data Export

- Analysis export
- Data sharing
- Format conversion
- Code generation
- Analysis templates
