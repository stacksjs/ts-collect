# ToSQL Method

The `toSQL()` method generates an SQL INSERT statement for the collection data. It automatically creates the appropriate column names and formats values correctly for SQL insertion.

## Basic Syntax

```typescript
toSQL(table: string): string
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, name: 'Chris', email: 'chris@example.com' },
  { id: 2, name: 'Avery', email: 'avery@example.com' }
])

const sql = users.toSQL('users')
console.log(sql)
// INSERT INTO users (id, name, email)
// VALUES
// (1, "Chris", "chris@example.com"),
// (2, "Avery", "avery@example.com");
```

### Working with Different Types

```typescript
interface Product {
  sku: string
  name: string
  price: number
  inStock: boolean
  updatedAt: Date
}

const products = collect<Product>([
  {
    sku: 'LAPTOP1',
    name: 'Pro Laptop',
    price: 999.99,
    inStock: true,
    updatedAt: new Date('2024-01-01')
  }
])

const sql = products.toSQL('products')
// INSERT INTO products (sku, name, price, inStock, updatedAt)
// VALUES
// ("LAPTOP1", "Pro Laptop", 999.99, true, "2024-01-01T00:00:00.000Z");
```

### Real-world Example: E-commerce Data Export

```typescript
interface OrderData {
  orderId: string
  customerEmail: string
  items: string  // JSON string
  total: number
  status: string
  createdAt: Date
}

class OrderExporter {
  private orders: Collection<OrderData>

  constructor(orders: OrderData[]) {
    this.orders = collect(orders)
  }

  generateInsertStatements() {
    // Format orders for SQL insertion
    const formattedOrders = this.orders.map(order => ({
      ...order,
      items: JSON.stringify(order.items),
      createdAt: order.createdAt.toISOString()
    }))

    return collect(formattedOrders).toSQL('orders')
  }

  generateBackupQueries() {
    const timestamp = new Date().toISOString().split('T')[0]
    const backupTable = `orders_backup_${timestamp}`

    return [
      // Create backup table
      `CREATE TABLE ${backupTable} LIKE orders;`,
      // Insert data
      this.orders.toSQL(backupTable)
    ].join('\n\n')
  }

  generateBatchInserts(batchSize: number = 1000) {
    return this.orders
      .chunk(batchSize)
      .map(batch => batch.toSQL('orders'))
      .all()
  }
}

// Usage
const exporter = new OrderExporter([
  {
    orderId: 'ORD-1',
    customerEmail: 'chris@example.com',
    items: JSON.stringify([{ id: 'P1', qty: 1 }]),
    total: 999.99,
    status: 'completed',
    createdAt: new Date()
  }
])

const sqlStatements = exporter.generateBatchInserts()
```

## Type Safety

```typescript
interface User {
  id: number
  name: string
  isActive: boolean
}

const users = collect<User>([
  { id: 1, name: 'Chris', isActive: true }
])

// Type-safe SQL generation
const sql: string = users.toSQL('users')

// Table name must be a string
// users.toSQL(123) // ✗ TypeScript error
```

## Return Value

- Returns a string containing SQL INSERT statement
- Properly escapes string values
- Formats dates as ISO strings
- Handles boolean values
- Handles null values
- Empty string if collection is empty

## Common Use Cases

### 1. Data Migration

- Database transfers
- System migrations
- Data backups
- Schema updates
- Archive creation

### 2. Data Import

- Bulk imports
- Data seeding
- Test data creation
- Sample data generation
- Initial data setup

### 3. Backup Operations

- Database backups
- Data snapshots
- Version control
- Recovery points
- Audit trails

### 4. Data Synchronization

- System sync
- Database replication
- Mirror updates
- Cross-platform sync
- Data consistency

### 5. Data Export

- Report generation
- Data extraction
- System integration
- External sharing
- Data transfer
