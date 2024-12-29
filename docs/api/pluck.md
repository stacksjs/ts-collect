# pluck Method

The `pluck()` method retrieves all values for a given key from the collection objects. It creates a new collection containing only the values of the specified key.

## Basic Syntax

```typescript
collect(items).pluck(key: keyof T): Collection<T[K]>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const items = collect([
  { id: 1, name: 'Widget', price: 100 },
  { id: 2, name: 'Gadget', price: 200 },
  { id: 3, name: 'Tool', price: 150 }
])

// Get all names
const names = items.pluck('name')
console.log(names.all())
// ['Widget', 'Gadget', 'Tool']

// Get all prices
const prices = items.pluck('price')
console.log(prices.all())
// [100, 200, 150]
```

### Working with Objects

```typescript
interface Product {
  id: number
  sku: string
  price: number
  tags: string[]
  category: string
}

const products = collect<Product>([
  { id: 1, sku: 'WID-1', price: 19.99, tags: ['new'], category: 'widgets' },
  { id: 2, sku: 'GAD-1', price: 29.99, tags: ['featured'], category: 'gadgets' },
  { id: 3, sku: 'WID-2', price: 39.99, tags: ['sale'], category: 'widgets' }
])

// Get all SKUs
const skus = products.pluck('sku')

// Get all categories
const categories = products.pluck('category')
```

### Real-world Examples

#### Price Analysis System

```typescript
interface PricedItem {
  id: string
  name: string
  basePrice: number
  salePrice: number
  cost: number
  margin: number
}

class PriceAnalyzer {
  private items: Collection<PricedItem>

  constructor(items: PricedItem[]) {
    this.items = collect(items)
  }

  getBasePrices(): Collection<number> {
    return this.items.pluck('basePrice')
  }

  calculateAverageMargin(): number {
    return this.items.pluck('margin').avg()
  }

  getTotalCost(): number {
    return this.items.pluck('cost').sum()
  }

  getMarginRange(): { min: number; max: number } {
    const margins = this.items.pluck('margin')
    return {
      min: margins.min() ?? 0,
      max: margins.max() ?? 0
    }
  }
}
```

#### Inventory Analysis

```typescript
interface StockItem {
  sku: string
  warehouse: string
  quantity: number
  reorderPoint: number
  lastOrderDate: string
}

class InventoryAnalyzer {
  private stock: Collection<StockItem>

  constructor(items: StockItem[]) {
    this.stock = collect(items)
  }

  getWarehouses(): Collection<string> {
    return this.stock.pluck('warehouse').unique()
  }

  getTotalStock(): number {
    return this.stock.pluck('quantity').sum()
  }

  getItemsNeedingReorder(): Collection<string> {
    return this.stock
      .filter(item => item.quantity <= item.reorderPoint)
      .pluck('sku')
  }

  getLastOrderDates(): Collection<string> {
    return this.stock
      .pluck('lastOrderDate')
      .sort()
  }
}
```

### Advanced Usage

#### Sales Report Generator

```typescript
interface SaleRecord {
  orderId: string
  productId: string
  quantity: number
  unitPrice: number
  discount: number
  date: string
}

class SalesReporter {
  private sales: Collection<SaleRecord>

  constructor(sales: SaleRecord[]) {
    this.sales = collect(sales)
  }

  getRevenueByProduct(): Map<string, number> {
    const productIds = this.sales.pluck('productId')
    const revenues = this.sales.map(sale => sale.quantity * sale.unitPrice)
    return new Map(productIds.zip(revenues).all())
  }

  getTotalDiscounts(): number {
    return this.sales.pluck('discount').sum()
  }

  getUniqueOrderIds(): Collection<string> {
    return this.sales.pluck('orderId').unique()
  }

  getDailySales(): Map<string, number> {
    return this.sales
      .groupBy('date')
      .map(group => group.pluck('quantity').sum())
      .toMap('date')
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
  stock: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100, stock: 5 },
  { id: 2, name: 'B', price: 200, stock: 10 }
])

// Type-safe plucking
const names: Collection<string> = products.pluck('name')
const prices: Collection<number> = products.pluck('price')

// TypeScript enforces valid keys and return types
// products.pluck('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing only the values of the specified key
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Values maintain their original type from the source object
- Handles undefined/null values gracefully

## Common Use Cases

### 1. Price Analysis

- Extracting prices for calculations
- Gathering costs for analysis
- Collecting margins for review
- Price comparison lists
- Discount rate analysis

### 2. Product Management

- Collecting product IDs
- Gathering SKUs
- Extracting categories
- Tag collection
- Name listings

### 3. Inventory Analysis

- Stock level extraction
- Warehouse location lists
- Reorder point collection
- Quantity summaries
- Supply chain tracking

### 4. Order Processing

- Order ID collection
- Status extraction
- Date gathering
- Customer ID lists
- Shipping method analysis

### 5. Customer Analysis

- Email collection
- Name extraction
- Purchase history analysis
- Loyalty point tracking
- Location analysis

### 6. Sales Analytics

- Revenue extraction
- Quantity analysis
- Discount tracking
- Commission calculation
- Performance metrics

### 7. Category Management

- Category listing
- Subcategory extraction
- Path analysis
- Hierarchy mapping
- Classification tracking

### 8. Review Management

- Rating extraction
- Comment collection
- Date tracking
- Author listing
- Score analysis

### 9. Marketing Analysis

- Campaign ID collection
- Source tracking
- Click rate extraction
- Conversion tracking
- Response collection

### 10. Financial Reporting

- Transaction ID collection
- Amount extraction
- Fee calculation
- Tax analysis
- Currency tracking
