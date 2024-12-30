# dd Method ("Dump and Die")

The `dd()` method dumps the contents of the collection to the console and immediately terminates script execution. This is particularly useful during development for inspecting collection state at critical points and halting execution for debugging.

## Basic Syntax

```typescript
collect(items).dd(): never
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple dump and die
const numbers = collect([1, 2, 3, 4])
numbers.dd()  // Logs: [1, 2, 3, 4] and exits

// Inspect transformation result
collect([1, 2, 3])
  .map(n => n * 2)
  .dd()  // Logs transformed collection and exits
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

// Debug critical point
products
  .filter(p => p.price > 150)
  .dd() // Dumps filtered products and exits
```

### Real-world Examples

#### Order Validation System

```typescript
interface Order {
  id: string
  items: Array<{ productId: string; quantity: number }>
  total: number
  status: string
}

class OrderValidator {
  validateOrders(orders: Collection<Order>): void {
    // Inspect initial state
    if (orders.isEmpty()) {
      collect({ error: 'No orders to process' }).dd()
    }

    // Check for invalid totals
    const suspiciousOrders = orders.filter(order => {
      const calculatedTotal = this.calculateTotal(order)
      return Math.abs(calculatedTotal - order.total) > 0.01
    })

    if (suspiciousOrders.isNotEmpty()) {
      collect({
        error: 'Invalid order totals detected',
        orders: suspiciousOrders.toArray()
      }).dd()
    }

    // Process continues if no issues found...
  }

  private calculateTotal(order: Order): number {
    // Total calculation logic
    return 0
  }
}
```

#### Inventory Debugger

```typescript
interface InventoryAdjustment {
  sku: string
  quantityChange: number
  reason: string
  timestamp: Date
}

class InventoryDebugger {
  debugAdjustments(
    adjustments: Collection<InventoryAdjustment>,
    threshold: number
  ): void {
    // Debug large adjustments
    const largeAdjustments = adjustments
      .filter(adj => Math.abs(adj.quantityChange) > threshold)

    if (largeAdjustments.isNotEmpty()) {
      collect({
        warning: 'Large inventory adjustments detected',
        timestamp: new Date(),
        adjustments: largeAdjustments
          .map(adj => ({
            sku: adj.sku,
            change: adj.quantityChange,
            reason: adj.reason
          }))
          .toArray()
      }).dd()
    }

    // Additional processing would be here...
  }
}
```

### Advanced Usage

#### Transaction Validator

```typescript
interface Transaction {
  id: string
  amount: number
  type: 'credit' | 'debit'
  metadata: Record<string, unknown>
}

class TransactionValidator {
  validateBatch(
    transactions: Collection<Transaction>,
    options: {
      maxAmount: number
      suspiciousPatterns: RegExp[]
    }
  ): void {
    // Debug high-value transactions
    const highValue = transactions
      .filter(t => t.amount > options.maxAmount)

    if (highValue.isNotEmpty()) {
      collect({
        alert: 'High-value transactions require review',
        timestamp: new Date(),
        transactions: highValue.toArray()
      }).dd()
    }

    // Debug suspicious patterns
    const suspicious = transactions.filter(t =>
      options.suspiciousPatterns.some(pattern =>
        pattern.test(JSON.stringify(t.metadata))
      )
    )

    if (suspicious.isNotEmpty()) {
      collect({
        alert: 'Suspicious transaction patterns detected',
        details: suspicious.map(t => ({
          id: t.id,
          flags: options.suspiciousPatterns
            .filter(p => p.test(JSON.stringify(t.metadata)))
            .map(p => p.source)
        }))
      }).dd()
    }
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

// Type-safe debugging
items
  .map(item => ({
    ...item,
    value: item.value.toLowerCase()
  }))
  .dd()

// Function never returns due to exit
const result = items.dd() // TypeScript knows this is unreachable
```

## Return Value

- Return type is `never` (function doesn't return)
- Dumps collection contents to console
- Immediately exits process with code 1
- Stops all further execution
- Useful for debugging critical points
- Should not be used in production

## Common Use Cases

### 1. Development Debugging

- Critical point inspection
- State verification
- Flow interruption
- Data validation
- Process inspection

### 2. Data Validation

- Format checking
- Content verification
- Structure validation
- Type confirmation
- Rule enforcement

### 3. Error Investigation

- State inspection
- Data examination
- Flow verification
- Issue diagnosis
- Bug tracking

### 4. Process Verification

- State checking
- Transform validation
- Flow inspection
- Logic verification
- Result confirmation

### 5. Security Checks

- Input validation
- Pattern detection
- Anomaly inspection
- Rule verification
- Access validation

### 6. Data Processing

- Format validation
- Content verification
- Transform inspection
- Rule checking
- Result validation

### 7. Flow Control

- Critical checks
- State verification
- Process validation
- Logic inspection
- Flow control

### 8. Testing Support

- State inspection
- Result verification
- Process validation
- Error checking
- Flow testing

### 9. Performance Issues

- State examination
- Process inspection
- Flow analysis
- Bottleneck detection
- Resource usage

### 10. Quality Assurance

- Data validation
- Process verification
- Rule enforcement
- Content checking
- Type confirmation
