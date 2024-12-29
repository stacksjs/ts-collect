# toArray Method

The `toArray()` method converts the collection into a standard JavaScript array. This is particularly useful when you need to pass the collection's data to external APIs, libraries, or functions that expect regular arrays.

## Basic Syntax

```typescript
collect(items).toArray(): T[]
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3, 4, 5])
const array = numbers.toArray()
console.log(array)  // [1, 2, 3, 4, 5]

// After transformations
const doubled = collect([1, 2, 3])
  .map(x => x * 2)
  .toArray()
console.log(doubled)  // [2, 4, 6]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget', price: 100 },
  { id: 2, name: 'Gadget', price: 200 }
])

// Convert to array for API submission
const productArray = products
  .map(p => ({
    ...p,
    price: p.price * 100  // Convert to cents
  }))
  .toArray()
```

### Real-world Examples

#### API Integration Service

```typescript
interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
}

class OrderAPIService {
  constructor(private apiEndpoint: string) {}

  async submitOrder(items: Collection<OrderItem>): Promise<void> {
    // Convert collection to array for API submission
    const orderData = items.toArray()

    await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: orderData })
    })
  }

  async bulkUpdatePrices(items: Collection<OrderItem>): Promise<void> {
    // Convert to array and format for API
    const updates = items
      .map(item => ({
        id: item.id,
        newPrice: item.price
      }))
      .toArray()

    await fetch(`${this.apiEndpoint}/bulk-update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ updates })
    })
  }
}
```

#### Report Generator

```typescript
interface SalesRecord {
  id: string
  date: string
  amount: number
  category: string
}

class ReportGenerator {
  constructor(private sales: Collection<SalesRecord>) {}

  exportToCsv(): string {
    const records = this.sales
      .map(sale => ({
        ...sale,
        amount: sale.amount.toFixed(2)
      }))
      .toArray()

    const headers = ['ID', 'Date', 'Amount', 'Category']
    const rows = records.map(record =>
      [record.id, record.date, record.amount, record.category].join(',')
    )

    return [headers.join(','), ...rows].join('\n')
  }

  prepareForExcel(): Array<Record<string, string | number>> {
    return this.sales
      .map(sale => ({
        ID: sale.id,
        'Sale Date': sale.date,
        'Amount ($)': sale.amount,
        Category: sale.category
      }))
      .toArray()
  }
}
```

### Advanced Usage

#### Data Migration Service

```typescript
interface DataRecord {
  oldId: string
  newId: string
  content: unknown
  status: 'pending' | 'migrated' | 'failed'
}

class DataMigrationService {
  constructor(private records: Collection<DataRecord>) {}

  prepareBatchInsert(): Array<Record<string, unknown>> {
    return this.records
      .where('status', 'pending')
      .map(record => ({
        id: record.newId,
        data: record.content,
        migrated_at: new Date().toISOString()
      }))
      .toArray()
  }

  getFailedRecords(): Array<string> {
    return this.records
      .where('status', 'failed')
      .pluck('oldId')
      .toArray()
  }

  generateMigrationReport(): Array<{
    oldId: string
    newId: string
    status: string
  }> {
    return this.records
      .map(({ oldId, newId, status }) => ({
        oldId,
        newId,
        status
      }))
      .toArray()
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100 },
  { id: 2, name: 'B', price: 200 }
])

// Type-safe array conversion
const array: TypedProduct[] = products.toArray()

// Type safety maintained through transformations
const formatted: Array<{ id: number, displayPrice: string }> = products
  .map(p => ({
    id: p.id,
    displayPrice: `$${p.price.toFixed(2)}`
  }))
  .toArray()
```

## Return Value

- Returns a standard JavaScript array containing all items
- Maintains original item types
- Items maintain their original order
- Array is a new instance (shallow copy)
- Can be used with array spread operator
- Safe to modify without affecting collection

## Common Use Cases

### 1. API Integration

- Data submission
- Request payloads
- Response handling
- Batch operations
- External services

### 2. Data Export

- CSV generation
- Excel export
- Report creation
- Data downloads
- File generation

### 3. External Libraries

- Library compatibility
- Framework integration
- Plugin support
- Tool integration
- Module interop

### 4. Data Migration

- Batch processing
- Data transfer
- System migration
- Import/export
- Conversion tasks

### 5. Legacy Integration

- System compatibility
- Format conversion
- Data bridging
- API adaptation
- Protocol support

### 6. Report Generation

- Data formatting
- Table creation
- Chart preparation
- Summary generation
- Export formatting

### 7. Database Operations

- Bulk inserts
- Batch updates
- Query parameters
- Result processing
- Data seeding

### 8. Frontend Integration

- Component props
- State management
- Form handling
- Data display
- UI updates

### 9. Testing

- Test data prep
- Assertion inputs
- Mock data
- Scenario setup
- Result validation

### 10. Cache Management

- Data serialization
- Cache storage
- State persistence
- Backup creation
- Snapshot generation
