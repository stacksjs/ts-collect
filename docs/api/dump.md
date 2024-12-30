# dump Method

The `dump()` method outputs the contents of the collection to the console. Unlike `debug()`, it only logs the collection items without additional metadata and doesn't return the collection.

## Basic Syntax

```typescript
collect(items).dump(): void
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple dump
const numbers = collect([1, 2, 3, 4])
numbers.dump()  // Logs: [1, 2, 3, 4]

// Dump after transformation
collect([1, 2, 3])
  .map(n => n * 2)
  .dump()  // Logs: [2, 4, 6]
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  price: number
}

const products = collect<Product>([
  { id: '1', name: 'Widget', price: 100 },
  { id: '2', name: 'Gadget', price: 200 }
])

// Inspect products
products.dump()
// Logs:
// [
//   { id: '1', name: 'Widget', price: 100 },
//   { id: '2', name: 'Gadget', price: 200 }
// ]
```

### Real-world Examples

#### Order Processing Inspection

```typescript
interface Order {
  id: string
  items: Array<{ productId: string; quantity: number }>
  total: number
  status: 'pending' | 'processing' | 'completed'
}

class OrderInspector {
  inspectOrderProcessing(orders: Collection<Order>): void {
    // Inspect initial orders
    console.log('Initial Orders:')
    orders.dump()

    // Filter pending orders
    console.log('\nPending Orders:')
    orders
      .filter(order => order.status === 'pending')
      .dump()

    // Check high-value orders
    console.log('\nHigh Value Orders:')
    orders
      .filter(order => order.total > 1000)
      .dump()

    // Inspect items count
    console.log('\nOrders by Item Count:')
    orders
      .map(order => ({
        id: order.id,
        itemCount: order.items.length
      }))
      .dump()
  }
}
```

#### Inventory Checker

```typescript
interface StockItem {
  sku: string
  quantity: number
  location: string
  reorderPoint: number
}

class StockChecker {
  checkInventoryLevels(inventory: Collection<StockItem>): void {
    // Check low stock items
    console.log('Low Stock Items:')
    inventory
      .filter(item => item.quantity <= item.reorderPoint)
      .dump()

    // Check by location
    console.log('\nWarehouse A Stock:')
    inventory
      .where('location', 'Warehouse A')
      .dump()

    // Check critical items
    console.log('\nOut of Stock Items:')
    inventory
      .filter(item => item.quantity === 0)
      .dump()

    // Check reorder quantities
    console.log('\nReorder Quantities:')
    inventory
      .map(item => ({
        sku: item.sku,
        reorderQuantity: Math.max(0, item.reorderPoint - item.quantity)
      }))
      .filter(item => item.reorderQuantity > 0)
      .dump()
  }
}
```

### Advanced Usage

#### Price Update Verification

```typescript
interface PriceUpdate {
  productId: string
  oldPrice: number
  newPrice: number
  effective: Date
}

class PriceUpdateVerifier {
  verifyUpdates(updates: Collection<PriceUpdate>): void {
    // Check significant price increases
    console.log('Significant Price Increases:')
    updates
      .filter(update =>
        (update.newPrice - update.oldPrice) / update.oldPrice > 0.2
      )
      .dump()

    // Check price decreases
    console.log('\nPrice Decreases:')
    updates
      .filter(update => update.newPrice < update.oldPrice)
      .dump()

    // Check updates by date
    console.log('\nUpcoming Updates:')
    updates
      .filter(update => update.effective > new Date())
      .dump()

    // Check average change
    console.log('\nPrice Change Summary:')
    updates
      .map(update => ({
        productId: update.productId,
        changePercent: ((update.newPrice - update.oldPrice) / update.oldPrice) * 100
      }))
      .dump()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

const items = collect<TypedItem>([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' }
])

// Simple dump of typed collection
items.dump()

// Dump after transformation
items
  .map(item => ({
    ...item,
    value: item.value.toLowerCase()
  }))
  .dump()
```

## Return Value

- Returns void (no return value)
- Logs collection contents to console
- Does not modify the collection
- Can be used in method chains
- Shows raw data without formatting
- Useful for quick inspections

## Common Use Cases

### 1. Development

- Quick inspection
- Value verification
- State checking
- Data validation
- Type confirmation

### 2. Debugging

- Value checking
- Transform verification
- Filter validation
- Process inspection
- Error investigation

### 3. Data Inspection

- Content review
- Format checking
- Structure validation
- Value verification
- Type confirmation

### 4. Process Validation

- State inspection
- Flow checking
- Transform verification
- Filter validation
- Result confirmation

### 5. Testing Support

- Value verification
- Output validation
- State inspection
- Result checking
- Error detection

### 6. Data Monitoring

- Value tracking
- Change inspection
- Update verification
- State monitoring
- Result validation

### 7. Quality Control

- Data validation
- Format checking
- Structure verification
- Content inspection
- Type confirmation

### 8. Development Flow

- Quick checks
- Process verification
- State inspection
- Result validation
- Error detection

### 9. Troubleshooting

- Value inspection
- State checking
- Process verification
- Error investigation
- Result validation

### 10. Data Verification

- Content checking
- Structure validation
- Format inspection
- Value verification
- Type confirmation
