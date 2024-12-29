# Sum Method

The `sum()` method returns the sum of all items in the collection. When given a key, it returns the sum of the values of that key across all objects in the collection.

## Basic Syntax

```typescript
// Sum of array values
collect(items).sum(): number

// Sum of object property values
collect(items).sum(key: keyof T): number
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple array sum
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.sum()) // 15

// Sum with objects
const items = collect([
  { value: 10 },
  { value: 20 },
  { value: 30 }
])
console.log(items.sum('value')) // 60
```

### Working with Objects

```typescript
interface Transaction {
  id: number
  amount: number
  tax: number
  discount: number
}

const transactions = collect<Transaction>([
  { id: 1, amount: 100, tax: 10, discount: 5 },
  { id: 2, amount: 200, tax: 20, discount: 10 },
  { id: 3, amount: 300, tax: 30, discount: 15 }
])

// Sum individual properties
const totalAmount = transactions.sum('amount') // 600
const totalTax = transactions.sum('tax') // 60
const totalDiscount = transactions.sum('discount') // 30
```

### Real-world Examples

#### Sales Analysis

```typescript
interface SaleRecord {
  orderId: string
  items: number
  subtotal: number
  tax: number
  shipping: number
}

class SalesAnalyzer {
  private sales: Collection<SaleRecord>

  constructor(sales: SaleRecord[]) {
    this.sales = collect(sales)
  }

  getTotalRevenue(): number {
    return this.sales.sum('subtotal')
  }

  getTotalTax(): number {
    return this.sales.sum('tax')
  }

  getGrossTotal(): number {
    return this.sales
      .map(sale => sale.subtotal + sale.tax + sale.shipping)
      .sum()
  }
}
```

#### Budget Calculator

```typescript
interface BudgetItem {
  category: string
  planned: number
  actual: number
  variance?: number
}

class BudgetAnalyzer {
  private items: Collection<BudgetItem>

  constructor(items: BudgetItem[]) {
    this.items = collect(items)
  }

  getTotalPlanned(): number {
    return this.items.sum('planned')
  }

  getTotalActual(): number {
    return this.items.sum('actual')
  }

  getVariance(): number {
    return this.items
      .map(item => item.actual - item.planned)
      .sum()
  }
}
```

### Advanced Usage

#### Portfolio Analysis

```typescript
interface Investment {
  symbol: string
  shares: number
  costBasis: number
  currentPrice: number
}

class PortfolioManager {
  private investments: Collection<Investment>

  constructor(investments: Investment[]) {
    this.investments = collect(investments)
  }

  getTotalCost(): number {
    return this.investments
      .map(inv => inv.shares * inv.costBasis)
      .sum()
  }

  getCurrentValue(): number {
    return this.investments
      .map(inv => inv.shares * inv.currentPrice)
      .sum()
  }

  getTotalGainLoss(): number {
    return this.investments
      .map(inv => inv.shares * (inv.currentPrice - inv.costBasis))
      .sum()
  }
}
```

#### Time Tracking

```typescript
interface TimeEntry {
  taskId: string
  duration: number // in minutes
  billable: boolean
  rate?: number
}

class TimeTracker {
  private entries: Collection<TimeEntry>

  constructor(entries: TimeEntry[]) {
    this.entries = collect(entries)
  }

  getTotalTime(): number {
    return this.entries.sum('duration')
  }

  getBillableTime(): number {
    return this.entries
      .filter(entry => entry.billable)
      .sum('duration')
  }

  getBillableAmount(): number {
    return this.entries
      .filter(entry => entry.billable && entry.rate)
      .map(entry => (entry.duration / 60) * (entry.rate || 0))
      .sum()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: number
  optional?: number
}

const items = collect<TypedItem>([
  { id: 1, value: 100 },
  { id: 2, value: 200, optional: 50 },
  { id: 3, value: 300 }
])

// Type-safe property access
const totalValue = items.sum('value') // ✓ Valid
const totalOptional = items.sum('optional') // ✓ Valid
// items.sum('nonexistent')                 // ✗ TypeScript error
```

## Return Value

- Returns a number representing the sum
- For arrays: adds all numeric values
- For objects: adds values of specified property
- Non-numeric values are typically ignored
- Returns 0 for empty collections
- Maintains type safety with TypeScript

## Common Use Cases

### 1. Financial Calculations

- Calculating totals
- Summing transactions
- Computing balances
- Adding expenses

### 2. Quantity Management

- Inventory totals
- Order quantities
- Stock calculations
- Usage metrics

### 3. Statistics

- Data aggregation
- Score totals
- Point calculations
- Metric summation

### 4. Time Tracking

- Duration totals
- Billable hours
- Time accumulation
- Period calculations

### 5. Budget Analysis

- Expense totals
- Revenue calculations
- Budget variances
- Cost aggregation

### 6. Performance Metrics

- Score totals
- Rating calculations
- Performance sums
- Metric aggregation

### 7. Resource Management

- Usage totals
- Allocation sums
- Capacity calculations
- Resource totals

### 8. Analytics

- Data summation
- Metric totals
- Usage statistics
- Value aggregation

### 9. Sales Analysis

- Revenue totals
- Sales aggregation
- Commission calculations
- Discount totals

### 10. Inventory Management

- Stock totals
- Order quantities
- Value calculations
- Weight summations
