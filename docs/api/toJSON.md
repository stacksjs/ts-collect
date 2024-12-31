# toJSON Method

The `toJSON()` method serializes the collection into a JSON string with optional formatting and field filtering options. It allows you to customize the output by including or excluding specific fields and controlling the formatting.

## Basic Syntax

```typescript
toJSON(options: SerializationOptions = {}): string

// SerializationOptions interface
interface SerializationOptions {
  pretty?: boolean        // Format output with indentation
  exclude?: string[]      // Fields to exclude
  include?: string[]      // Fields to explicitly include
}
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', role: 'admin', lastLogin: '2024-01-01' },
  { name: 'Avery', role: 'user', lastLogin: '2024-01-02' }
])

console.log(users.toJSON())
// [{"name":"Chris","role":"admin","lastLogin":"2024-01-01"},{"name":"Avery","role":"user","lastLogin":"2024-01-02"}]

// With pretty printing
console.log(users.toJSON({ pretty: true }))
// [
//   {
//     "name": "Chris",
//     "role": "admin",
//     "lastLogin": "2024-01-01"
//   },
//   {
//     "name": "Avery",
//     "role": "user",
//     "lastLogin": "2024-01-02"
//   }
// ]
```

### Field Selection

```typescript
interface Product {
  id: number
  name: string
  price: number
  internalSku: string
  metadata: Record<string, any>
}

const products = collect<Product>([
  { id: 1, name: 'Laptop', price: 999, internalSku: 'LAP001', metadata: { weight: '2kg' } },
  { id: 2, name: 'Mouse', price: 49, internalSku: 'MOU001', metadata: { color: 'black' } }
])

// Exclude internal fields
console.log(products.toJSON({
  exclude: ['internalSku', 'metadata']
}))

// Only include specific fields
console.log(products.toJSON({
  include: ['id', 'name', 'price']
}))
```

### Real-world Example: E-commerce API Response

```typescript
interface OrderItem {
  productId: number
  name: string
  quantity: number
  price: number
  internalNotes: string
  tracking: Record<string, any>
}

class OrderExporter {
  private items: Collection<OrderItem>

  constructor(items: OrderItem[]) {
    this.items = collect(items)
  }

  toCustomerJson(): string {
    return this.items.toJSON({
      exclude: ['internalNotes', 'tracking'],
      pretty: true
    })
  }

  toInternalJson(): string {
    return this.items.toJSON({ pretty: true })
  }
}
```

## Return Value

- Returns a JSON string representation of the collection
- Handles nested objects and arrays
- Maintains data type integrity
- Can be parsed back into JavaScript objects
- Supports custom formatting options

## Common Use Cases

1. API Response Formatting
   - Serializing data for API responses
   - Transforming collections into JSON-compliant formats
   - Creating customer-facing data exports

2. Data Export
   - Generating reports
   - Creating data backups
   - Preparing data for external systems

3. Local Storage
   - Saving application state
   - Caching collection data
   - Storing user preferences

4. Data Transfer
   - Sending data between services
   - Preparing webhook payloads
   - Creating audit logs

5. Document Generation
   - Creating JSON manifests
   - Building configuration files
   - Generating data snapshots
