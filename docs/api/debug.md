# debug Method

The `debug()` method logs the current state of the collection and memory usage to the console. It returns the original collection, allowing for method chaining. This is particularly useful during development and troubleshooting.

## Basic Syntax

```typescript
collect(items).debug(): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple debugging
const numbers = collect([1, 2, 3, 4])
  .debug()  // Logs current state
  .map(n => n * 2)
  .debug()  // Logs state after transformation
  .filter(n => n > 4)
  .debug()  // Logs final state

// Debug during transformations
collect([1, 2, 3])
  .debug()
  .map(n => {
    console.log(`Processing: ${n}`)
    return n * 2
  })
  .debug()
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

// Debug product processing
products
  .debug() // Initial state
  .map(product => ({
    ...product,
    price: product.price * 1.1
  }))
  .debug() // After price increase
  .filter(product => product.price < 250)
  .debug() // After filtering
```

### Real-world Examples

#### Order Processing Pipeline

```typescript
interface Order {
  id: string
  items: Array<{ id: string; quantity: number }>
  total: number
  status: 'pending' | 'processing' | 'completed'
}

class OrderProcessor {
  processOrders(orders: Collection<Order>): Collection<Order> {
    return orders
      .debug() // Log initial orders
      .filter(order => order.status === 'pending')
      .debug() // Log filtered pending orders
      .map(order => this.calculateTotals(order))
      .debug() // Log orders with calculated totals
      .map(order => this.validateInventory(order))
      .debug() // Log after inventory validation
      .map(order => ({ ...order, status: 'processing' }))
      .debug() // Log final processed orders

  }

  private calculateTotals(order: Order): Order {
    // Calculation logic
    return order
  }

  private validateInventory(order: Order): Order {
    // Validation logic
    return order
  }
}
```

#### Price Update System

```typescript
interface PriceUpdate {
  productId: string
  oldPrice: number
  newPrice: number
  reason: string
}

class PriceUpdateManager {
  applyPriceUpdates(
    products: Collection<Product>,
    updates: PriceUpdate[]
  ): Collection<Product> {
    return products
      .debug() // Initial product state
      .map(product => {
        const update = updates.find(u => u.productId === product.id)
        if (!update) return product

        console.log(`Updating price for product ${product.id}`)
        console.log(`Old price: ${product.price}, New price: ${update.newPrice}`)

        return {
          ...product,
          price: update.newPrice
        }
      })
      .debug() // After price updates
      .tap(updated => {
        const changedCount = updated.filter(p =>
          updates.some(u => u.productId === p.id)
        ).count()
        console.log(`Updated ${changedCount} products`)
      })
      .debug() // Final state
  }
}
```

### Advanced Usage

#### Performance Monitoring

```typescript
interface PerformanceMetrics {
  operationName: string
  itemCount: number
  memoryUsage: {
    before: number
    after: number
    difference: number
  }
  timeElapsed: number
}

class PerformanceMonitor {
  monitorOperation<T>(
    collection: Collection<T>,
    operation: (items: Collection<T>) => Collection<T>
  ): {
    result: Collection<T>
    metrics: PerformanceMetrics
  } {
    const startTime = performance.now()
    const initialMemory = process.memoryUsage().heapUsed

    const result = collection
      .debug() // Pre-operation state
      .pipe(operation)
      .debug() // Post-operation state

    const endMemory = process.memoryUsage().heapUsed
    const timeElapsed = performance.now() - startTime

    const metrics: PerformanceMetrics = {
      operationName: operation.name,
      itemCount: result.count(),
      memoryUsage: {
        before: initialMemory,
        after: endMemory,
        difference: endMemory - initialMemory
      },
      timeElapsed
    }

    console.log('Performance Metrics:', metrics)
    return { result, metrics }
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
  .debug() // Logs initial state
  .map(item => ({
    ...item,
    value: item.value.toLowerCase()
  }))
  .debug() // Logs transformed state

// TypeScript maintains type information through debug calls
const result: Collection<TypedItem> = items.debug()
```

## Return Value

- Returns the original collection unmodified
- Logs to console:
  - Collection items
  - Collection length
  - Memory usage statistics
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Does not affect collection state

## Common Use Cases

### 1. Development

- State inspection
- Transform validation
- Flow tracking
- Error detection
- Type verification

### 2. Performance Monitoring

- Memory usage
- Operation impact
- State changes
- Resource tracking
- Bottleneck detection

### 3. Data Processing

- Transform validation
- Filter inspection
- Map verification
- Reduce tracking
- Sort checking

### 4. Pipeline Debugging

- Step validation
- Flow tracking
- State inspection
- Error detection
- Process monitoring

### 5. Memory Analysis

- Usage patterns
- Leak detection
- Allocation tracking
- Garbage collection
- Resource management

### 6. Operation Validation

- Transform checking
- Filter verification
- Sort inspection
- Group validation
- Merge checking

### 7. State Tracking

- Process flow
- Data changes
- Operation sequence
- State transitions
- Value updates

### 8. Error Detection

- Value inspection
- Type checking
- Null verification
- Undefined tracking
- Exception monitoring

### 9. Testing Support

- State verification
- Process validation
- Value checking
- Flow inspection
- Output validation

### 10. Optimization

- Performance tracking
- Resource usage
- Operation impact
- Memory patterns
- Processing efficiency
