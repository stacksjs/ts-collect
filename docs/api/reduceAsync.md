# reduceAsync Method

The `reduceAsync()` method executes a reducer callback function asynchronously on each element of the collection, resulting in a single output value. This is particularly useful when the reduction operation requires asynchronous operations.

## Basic Syntax

```typescript
collect(items).reduceAsync<U>(
  callback: (acc: U, item: T) => Promise<U>,
  initialValue: U
): Promise<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple async sum
const numbers = collect([1, 2, 3, 4])
const sum = await numbers.reduceAsync(async (acc, num) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return acc + num
}, 0)
console.log(sum)  // 10

// Concatenate strings with delay
const words = collect(['Hello', 'World'])
const sentence = await words.reduceAsync(async (acc, word) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return `${acc} ${word}`.trim()
}, '')
```

### Working with Objects

```typescript
interface CartItem {
  productId: string
  quantity: number
}

const cart = collect<CartItem>([
  { productId: 'P1', quantity: 2 },
  { productId: 'P2', quantity: 1 }
])

// Calculate total price with async price lookup
const total = await cart.reduceAsync(async (acc, item) => {
  const response = await fetch(`/api/products/${item.productId}/price`)
  const { price } = await response.json()
  return acc + (price * item.quantity)
}, 0)
```

### Real-world Examples

#### Order Total Calculator

```typescript
interface OrderItem {
  productId: string
  quantity: number
  customizations: string[]
}

interface PriceResult {
  subtotal: number
  tax: number
  total: number
}

class OrderCalculator {
  constructor(
    private priceApi: string,
    private taxRate: number
  ) {}

  async calculateTotal(items: Collection<OrderItem>): Promise<PriceResult> {
    const subtotal = await items.reduceAsync(async (acc, item) => {
      const [basePrice, customizationPrices] = await Promise.all([
        this.getProductPrice(item.productId),
        this.getCustomizationPrices(item.customizations)
      ])

      const itemTotal = (basePrice + customizationPrices) * item.quantity
      return acc + itemTotal
    }, 0)

    const tax = subtotal * this.taxRate
    const total = subtotal + tax

    return { subtotal, tax, total }
  }

  private async getProductPrice(productId: string): Promise<number> {
    const response = await fetch(`${this.priceApi}/products/${productId}`)
    const { price } = await response.json()
    return price
  }

  private async getCustomizationPrices(customizations: string[]): Promise<number> {
    if (customizations.length === 0) return 0

    const prices = await Promise.all(
      customizations.map(async (customId) => {
        const response = await fetch(`${this.priceApi}/customizations/${customId}`)
        const { price } = await response.json()
        return price
      })
    )

    return prices.reduce((sum, price) => sum + price, 0)
  }
}
```

#### Inventory Aggregator

```typescript
interface StockItem {
  sku: string
  warehouse: string
}

interface StockSummary {
  available: number
  reserved: number
  incoming: number
  total: number
}

class InventoryAggregator {
  constructor(private inventoryApi: string) {}

  async aggregateStock(items: Collection<StockItem>): Promise<StockSummary> {
    return items.reduceAsync(async (summary, item) => {
      const stockInfo = await this.getStockInfo(item.sku, item.warehouse)

      return {
        available: summary.available + stockInfo.available,
        reserved: summary.reserved + stockInfo.reserved,
        incoming: summary.incoming + stockInfo.incoming,
        total: summary.total + stockInfo.total
      }
    }, {
      available: 0,
      reserved: 0,
      incoming: 0,
      total: 0
    })
  }

  private async getStockInfo(sku: string, warehouse: string): Promise<StockSummary> {
    const response = await fetch(
      `${this.inventoryApi}/stock/${sku}/warehouse/${warehouse}`
    )
    return response.json()
  }
}
```

### Advanced Usage

#### Sales Performance Calculator

```typescript
interface SalesRecord {
  orderId: string
  salesRepId: string
  products: Array<{
    sku: string
    quantity: number
  }>
  date: string
}

interface SalesMetrics {
  totalRevenue: number
  totalCost: number
  totalProfit: number
  productsSold: number
  uniqueCustomers: Set<string>
}

class SalesCalculator {
  constructor(
    private priceApi: string,
    private costApi: string
  ) {}

  async calculateMetrics(sales: Collection<SalesRecord>): Promise<SalesMetrics> {
    return sales.reduceAsync(async (metrics, sale) => {
      const [revenue, cost, customerInfo] = await Promise.all([
        this.calculateRevenue(sale.products),
        this.calculateCost(sale.products),
        this.getCustomerInfo(sale.orderId)
      ])

      return {
        totalRevenue: metrics.totalRevenue + revenue,
        totalCost: metrics.totalCost + cost,
        totalProfit: metrics.totalProfit + (revenue - cost),
        productsSold: metrics.productsSold + this.countProducts(sale.products),
        uniqueCustomers: metrics.uniqueCustomers.add(customerInfo.customerId)
      }
    }, {
      totalRevenue: 0,
      totalCost: 0,
      totalProfit: 0,
      productsSold: 0,
      uniqueCustomers: new Set<string>()
    })
  }

  private async calculateRevenue(products: Array<{ sku: string, quantity: number }>): Promise<number> {
    const revenues = await Promise.all(
      products.map(async ({ sku, quantity }) => {
        const response = await fetch(`${this.priceApi}/price/${sku}`)
        const { price } = await response.json()
        return price * quantity
      })
    )

    return revenues.reduce((sum, rev) => sum + rev, 0)
  }

  private async calculateCost(products: Array<{ sku: string, quantity: number }>): Promise<number> {
    const costs = await Promise.all(
      products.map(async ({ sku, quantity }) => {
        const response = await fetch(`${this.costApi}/cost/${sku}`)
        const { cost } = await response.json()
        return cost * quantity
      })
    )

    return costs.reduce((sum, cost) => sum + cost, 0)
  }

  private async getCustomerInfo(orderId: string) {
    const response = await fetch(`/api/orders/${orderId}/customer`)
    return response.json()
  }

  private countProducts(products: Array<{ quantity: number }>): number {
    return products.reduce((sum, { quantity }) => sum + quantity, 0)
  }
}
```

## Type Safety

```typescript
interface OrderItem {
  id: string
  quantity: number
}

interface OrderTotal {
  subtotal: number
  tax: number
  total: number
}

const items = collect<OrderItem>([
  { id: 'item1', quantity: 2 },
  { id: 'item2', quantity: 1 }
])

// Type-safe async reduction
const totals = await items.reduceAsync(async (acc: OrderTotal, item): Promise<OrderTotal> => {
  const response = await fetch(`/api/products/${item.id}/price`)
  const { price } = await response.json()
  const itemTotal = price * item.quantity

  return {
    subtotal: acc.subtotal + itemTotal,
    tax: acc.tax + (itemTotal * 0.1),
    total: acc.total + (itemTotal * 1.1)
  }
}, {
  subtotal: 0,
  tax: 0,
  total: 0
})

// TypeScript enforces return type Promise<OrderTotal>
const result: OrderTotal = await totals
```

## Return Value

- Returns a Promise that resolves to a single value
- Value type matches initialValue type
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Processes items sequentially
- Handles async/await operations

## Common Use Cases

### 1. Price Calculations

- Order totals
- Cart summaries
- Discount applications
- Tax calculations
- Shipping costs

### 2. Inventory Aggregation

- Stock totals
- Warehouse summaries
- Location consolidation
- Asset tracking
- Availability checks

### 3. Sales Analytics

- Revenue calculations
- Profit summaries
- Performance metrics
- Commission tracking
- Goal progress

### 4. Order Processing

- Total calculations
- Status aggregation
- Fulfillment tracking
- Shipping costs
- Package details

### 5. Customer Metrics

- Purchase history
- Loyalty points
- Activity summaries
- Engagement metrics
- Value calculation

### 6. Resource Management

- Usage tracking
- Cost accumulation
- Time tracking
- Capacity planning
- Resource allocation

### 7. Financial Calculations

- Transaction totals
- Balance calculations
- Fee accumulation
- Currency conversion
- Payment processing

### 8. Report Generation

- Data aggregation
- Summary calculations
- Metric compilation
- Statistical analysis
- Performance summaries

### 9. Batch Processing

- Data transformation
- Status updates
- Error tracking
- Progress monitoring
- Result accumulation

### 10. Integration Tasks

- Data synchronization
- Status consolidation
- Error accumulation
- Response processing
- Result compilation
