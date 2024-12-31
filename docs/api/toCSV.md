# toCSV Method

The `toCSV()` method converts the collection into a CSV (Comma-Separated Values) string, with options to control which fields are included in the output. The first row contains headers based on the object keys, followed by the data rows.

## Basic Syntax

```typescript
toCSV(options: SerializationOptions = {}): string

// SerializationOptions interface
interface SerializationOptions {
  exclude?: string[]      // Fields to exclude from output
  include?: string[]      // Fields to explicitly include
}
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', email: 'chris@example.com', role: 'admin' },
  { name: 'Avery', email: 'avery@example.com', role: 'user' }
])

console.log(users.toCSV())
// name,email,role
// "Chris","chris@example.com","admin"
// "Avery","avery@example.com","user"
```

### Field Selection

```typescript
interface Product {
  id: number
  name: string
  price: number
  sku: string
  internalNotes: string
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 999, sku: 'LAP001', internalNotes: 'Check stock' },
  { id: 2, name: 'Mouse', price: 49, sku: 'MOU001', internalNotes: 'New shipment' }
])

// Exclude internal fields
console.log(products.toCSV({
  exclude: ['internalNotes']
}))
// id,name,price,sku
// "1","Laptop","999","LAP001"
// "2","Mouse","49","MOU001"

// Only include specific fields
console.log(products.toCSV({
  include: ['name', 'price']
}))
// name,price
// "Laptop","999"
// "Mouse","49"
```

### Real-world Example: E-commerce Order Export

```typescript
interface OrderDetails {
  orderId: string
  customerName: string
  total: number
  status: string
  internalRemarks: string
  paymentDetails: Record<string, any>
}

class OrderReportGenerator {
  private orders: Collection<OrderDetails>

  constructor(orders: OrderDetails[]) {
    this.orders = collect(orders)
  }

  generateCustomerReport(): string {
    return this.orders.toCSV({
      include: ['orderId', 'customerName', 'total', 'status']
    })
  }

  generateInternalReport(): string {
    return this.orders.toCSV({
      exclude: ['paymentDetails']
    })
  }
}

const generator = new OrderReportGenerator([
  {
    orderId: 'ORD-001',
    customerName: 'Chris',
    total: 299.99,
    status: 'shipped',
    internalRemarks: 'Priority customer',
    paymentDetails: { method: 'credit_card' }
  }
])

console.log(generator.generateCustomerReport())
// orderId,customerName,total,status
// "ORD-001","Chris","299.99","shipped"
```

## Return Value

- Returns a string in CSV format
- First row contains headers based on object keys
- Values are properly escaped and quoted
- Empty collection returns empty string
- Handles nested object serialization
- Maintains data integrity for import/export operations

## Common Use Cases

1. Report Generation
   - Creating downloadable order reports
   - Exporting customer lists
   - Generating inventory summaries
   - Building sales reports

2. Data Migration
   - Exporting data for spreadsheet software
   - Creating importable data files
   - Transferring records between systems

3. Inventory Management
   - Stock level reports
   - Product catalogs
   - Price lists
   - Warehouse manifests

4. Batch Processing
   - Order batch exports
   - Customer data exports
   - Bulk update templates
   - Transaction logs

5. Analysis Preparation
   - Financial data exports
   - Marketing data collection
   - Performance metrics
   - Audit trails
