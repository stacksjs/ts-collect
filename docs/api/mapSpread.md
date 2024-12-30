# MapSpread Method

The `mapSpread()` method maps each array item in the collection by spreading it into individual arguments for the callback function. This is particularly useful when working with tuples or arrays that need to be processed as separate parameters.

## Basic Syntax

```typescript
mapSpread<U>(callback: (...args: any[]) => U): CollectionOperations<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const pairs = collect([
  [1, 2],
  [3, 4],
  [5, 6]
])

const sums = pairs.mapSpread((a, b) => a + b)
console.log(sums.all())
// [3, 7, 11]

// Equivalent to:
// pairs.map(([a, b]) => a + b)
```

### Working with Complex Arrays

```typescript
const coordinates = collect([
  ['point1', 10, 20, 'active'],
  ['point2', 30, 40, 'inactive'],
  ['point3', 50, 60, 'active']
])

const points = coordinates.mapSpread((id, x, y, status) => ({
  id,
  coordinates: { x, y },
  isActive: status === 'active'
}))

console.log(points.first())
// {
//   id: 'point1',
//   coordinates: { x: 10, y: 20 },
//   isActive: true
// }
```

### Real-world Example: E-commerce Order Processing

```typescript
interface OrderItem {
  productId: string
  quantity: number
  price: number
}

class OrderProcessor {
  private orderData: Collection<[string, OrderItem[], string]> // [orderId, items, status]

  constructor(orders: [string, OrderItem[], string][]) {
    this.orderData = collect(orders)
  }

  processOrders() {
    return this.orderData.mapSpread((orderId, items, status) => ({
      orderId,
      items: items.length,
      total: items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      status,
      processed: new Date()
    }))
  }

  getActiveOrders() {
    return this.orderData
      .mapSpread((orderId, items, status) => ({
        orderId,
        itemCount: items.length,
        isActive: status === 'active',
        total: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      }))
      .filter(order => order.isActive)
  }
}

// Usage
const orders = new OrderProcessor([
  ['ORD-1', [{ productId: 'P1', quantity: 2, price: 100 }], 'active'],
  ['ORD-2', [{ productId: 'P2', quantity: 1, price: 50 }], 'pending']
])

const processed = orders.processOrders()
```

## Type Safety

```typescript
type PricePoint = [string, number, number] // [date, open, close]

const stockPrices = collect<PricePoint>([
  ['2024-01-01', 100, 105],
  ['2024-01-02', 105, 110]
])

// Type-safe spread mapping
interface PriceData {
  date: string
  change: number
  percentageChange: number
}

const priceChanges = stockPrices.mapSpread((date, open, close): PriceData => ({
  date,
  change: close - open,
  percentageChange: ((close - open) / open) * 100
}))

// TypeScript ensures return type safety
const firstChange: PriceData = priceChanges.first()!
```

## Return Value

- Returns a new Collection containing transformed items
- Spreads array elements into individual parameters
- Maintains type safety through generics
- Preserves collection chain methods
- Handles variable-length arrays
- Automatically handles undefined values

## Common Use Cases

### 1. Coordinate Processing

- Processing geographic coordinates
- Handling 2D/3D points
- Mapping vectors
- Processing spatial data
- Converting coordinate systems

### 2. Data Transformation

- Converting tuples to objects
- Processing CSV rows
- Transforming array data
- Flattening nested arrays
- Converting data formats

### 3. Order Processing

- Processing order records
- Handling transaction data
- Converting line items
- Processing shipping details
- Transforming invoice data

### 4. Price Calculations

- Processing price ranges
- Calculating discounts
- Handling currency pairs
- Computing tax rates
- Processing rate cards

### 5. Event Handling

- Processing event data
- Handling time ranges
- Converting log entries
- Processing audit trails
- Transforming metrics
