# Upper Method

The `upper()` method transforms all strings in the collection to uppercase. This method is only available on collections of strings and returns a new collection with the transformed values.

## Basic Syntax

```typescript
upper(this: CollectionOperations<string>): CollectionOperations<string>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const words = collect(['hello', 'world', 'typescript'])
const uppercase = words.upper()

console.log(uppercase.all())
// ['HELLO', 'WORLD', 'TYPESCRIPT']
```

### Working with Mixed Case

```typescript
const codes = collect(['prod-123', 'dev-456', 'test-789'])
const normalized = codes.upper()

console.log(normalized.join(', '))
// "PROD-123, DEV-456, TEST-789"
```

### Real-world Example: E-commerce Status Codes

```typescript
class OrderStatusManager {
  private statuses: Collection<string>

  constructor(statusCodes: string[]) {
    this.statuses = collect(statusCodes)
  }

  normalizeStatusCodes(): Collection<string> {
    return this.statuses
      .map(status => status.trim())
      .filter(status => status.length > 0)
      .upper()
  }

  generateStatusLog(orderId: string): string {
    return this.normalizeStatusCodes()
      .map(status => `${orderId}:${status}`)
      .join('\n')
  }

  getDisplayStatuses(): string[] {
    return this.normalizeStatusCodes()
      .map(status => `Status: ${status}`)
      .toArray()
  }
}

// Usage
const orderManager = new OrderStatusManager([
  'pending',
  'in-transit',
  'delivered'
])

console.log(orderManager.normalizeStatusCodes().all())
// ['PENDING', 'IN-TRANSIT', 'DELIVERED']

console.log(orderManager.generateStatusLog('ORD-123'))
// ORD-123:PENDING
// ORD-123:IN-TRANSIT
// ORD-123:DELIVERED
```

## Type Safety

```typescript
// Only works with string collections
const strings = collect(['hello', 'world'])
const uppercased: Collection<string> = strings.upper() // ✓ Valid

// Won't work with number collections
const numbers = collect([1, 2, 3])
// numbers.upper() // ✗ TypeScript error

// Type preservation
type StringCollection = CollectionOperations<string>
const result: StringCollection = strings.upper() // ✓ Valid
```

## Return Value

- Returns a new Collection`<string>` with uppercase values
- Original collection remains unchanged
- Maintains the order of elements
- Preserves collection chain methods
- Empty strings remain empty
- Non-string collections not supported

## Common Use Cases

### 1. Status Codes

- Order statuses
- System codes
- Error codes
- Response types
- Process states

### 2. Data Standardization

- Reference codes
- Serial numbers
- Product SKUs
- Transaction IDs
- Category codes

### 3. System Integration

- API response codes
- Integration keys
- System identifiers
- Protocol messages
- Command strings

### 4. Display Formatting

- Headers
- Labels
- Alerts
- Notifications
- Emphasis text

### 5. Data Processing

- Log entries
- Audit trails
- System messages
- Debug output
- Event codes
