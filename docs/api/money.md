# Money Method

The `money()` method formats numeric values as currency strings using specified currency code and locale-aware formatting.

## Basic Syntax

```typescript
money<K extends keyof T>(
  key: K,
  currency: string = 'USD'
): CollectionOperations<T & { formatted: string }>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const prices = collect([
  { id: 1, price: 99.99 },
  { id: 2, price: 149.50 }
])

const formatted = prices.money('price')
console.log(formatted.first())
// { id: 1, price: 99.99, formatted: '$99.99' }
```

### Multi-Currency Support

```typescript
interface Product {
  name: string
  basePrice: number
  market: 'US' | 'EU' | 'UK'
}

const products = collect<Product>([
  { name: 'Laptop', basePrice: 999.99, market: 'US' },
  { name: 'Tablet', basePrice: 499.99, market: 'EU' }
])

// Format for different markets
const euPrices = products.money('basePrice', 'EUR')
const gbpPrices = products.money('basePrice', 'GBP')
```

### Real-world Example: E-commerce Price Display

```typescript
interface OrderItem {
  productId: string
  quantity: number
  price: number
  discount?: number
}

class PriceFormatter {
  private items: Collection<OrderItem>

  constructor(items: OrderItem[]) {
    this.items = collect(items)
  }

  formatOrderSummary(currency = 'USD') {
    return {
      items: this.items
        .money('price', currency)
        .map(item => ({
          ...item,
          total: item.price * item.quantity,
          formattedTotal: new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency
          }).format(item.price * item.quantity)
        })),
      summary: this.generateSummary(currency)
    }
  }

  private generateSummary(currency: string) {
    const subtotal = this.items.sum(item => item.price * item.quantity)
    const discount = this.items.sum(item => (item.discount || 0) * item.quantity)

    return {
      subtotal: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(subtotal),
      discount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(discount),
      total: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(subtotal - discount)
    }
  }
}

// Usage
const formatter = new PriceFormatter([
  {
    productId: 'P1',
    quantity: 2,
    price: 99.99,
    discount: 10
  }
])

const summary = formatter.formatOrderSummary('USD')
```

## Type Safety

```typescript
interface Product {
  name: string
  price: number
  category: string
}

const products = collect<Product>([
  { name: 'Laptop', price: 999.99, category: 'Electronics' }
])

// Type-safe money formatting
const formatted = products.money('price', 'USD')

// Won't work with non-numeric fields
// products.money('category', 'USD') // ✗ TypeScript error

// Type includes formatted string
type ResultType = typeof formatted.first()
// Product & { formatted: string }
```

## Return Value

- Returns Collection with added formatted field
- Formatted strings use locale-aware formatting
- Includes currency symbol
- Proper decimal places
- Thousands separators
- Negative value handling

## Common Use Cases

### 1. Product Pricing

- Price display
- Catalogs
- Product lists
- Cart totals
- Invoices

### 2. Financial Reports

- Account balances
- Transaction history
- Financial statements
- Revenue reports
- Cost summaries

### 3. Order Processing

- Order totals
- Line items
- Discounts
- Tax calculations
- Shipping costs

### 4. Marketplace

- Seller earnings
- Commission displays
- Fee calculations
- Balance displays
- Payout amounts

### 5. Analytics

- Revenue metrics
- Sales reports
- Performance dashboards
- Financial analysis
- Budget tracking
