# filterAsync Method

The `filterAsync()` method filters items in the collection using an asynchronous callback function. It returns a Promise that resolves to a new collection containing only the items that pass the async test.

## Basic Syntax

```typescript
collect(items).filterAsync(callback: AsyncCallback<T, boolean>): Promise<Collection<T>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple async filtering
const items = collect([1, 2, 3, 4, 5])
const evenNumbers = await items.filterAsync(async (num) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return num % 2 === 0
})
console.log(evenNumbers.all())  // [2, 4]

// With external validation
const userIds = collect(['user1', 'user2', 'user3'])
const activeUsers = await userIds.filterAsync(async (userId) => {
  const response = await fetch(`/api/users/${userId}/status`)
  const { active } = await response.json()
  return active
})
```

### Working with Objects

```typescript
interface Product {
  id: number
  sku: string
  price: number
}

const products = collect<Product>([
  { id: 1, sku: 'WIDGET-1', price: 100 },
  { id: 2, sku: 'GADGET-1', price: 200 }
])

// Check stock availability
const inStockProducts = await products.filterAsync(async (product) => {
  const response = await fetch(`/api/inventory/${product.sku}/available`)
  const { inStock } = await response.json()
  return inStock
})
```

### Real-world Examples

#### Product Availability Checker

```typescript
interface InventoryItem {
  sku: string
  name: string
  warehouse: string
  quantity: number
}

class AvailabilityChecker {
  constructor(
    private inventoryApi: string,
    private minimumQuantity: number = 1
  ) {}

  async getAvailableProducts(items: Collection<InventoryItem>): Promise<Collection<InventoryItem>> {
    return items.filterAsync(async (item) => {
      try {
        const [stockResponse, reservationsResponse] = await Promise.all([
          this.checkStock(item.sku),
          this.checkReservations(item.sku)
        ])

        const availableQuantity = stockResponse.quantity - reservationsResponse.reserved
        return availableQuantity >= this.minimumQuantity
      } catch (error) {
        console.error(`Error checking availability for ${item.sku}:`, error)
        return false
      }
    })
  }

  private async checkStock(sku: string) {
    const response = await fetch(`${this.inventoryApi}/stock/${sku}`)
    return response.json()
  }

  private async checkReservations(sku: string) {
    const response = await fetch(`${this.inventoryApi}/reservations/${sku}`)
    return response.json()
  }
}
```

#### Order Validator

```typescript
interface Order {
  id: string
  customerId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  totalAmount: number
}

class OrderValidator {
  constructor(private maxConcurrentChecks: number = 5) {}

  async getValidOrders(orders: Collection<Order>): Promise<Collection<Order>> {
    let runningChecks = 0
    const queue: Array<() => void> = []

    return orders.filterAsync(async (order) => {
      // Wait if too many concurrent checks
      if (runningChecks >= this.maxConcurrentChecks) {
        await new Promise<void>(resolve => queue.push(resolve))
      }

      runningChecks++

      try {
        const [
          customerValid,
          itemsAvailable,
          paymentValid
        ] = await Promise.all([
          this.validateCustomer(order.customerId),
          this.validateItemsAvailability(order.items),
          this.validatePayment(order)
        ])

        return customerValid && itemsAvailable && paymentValid
      } finally {
        runningChecks--
        if (queue.length > 0) {
          const next = queue.shift()
          next?.()
        }
      }
    })
  }

  private async validateCustomer(customerId: string): Promise<boolean> {
    const response = await fetch(`/api/customers/${customerId}/validate`)
    return response.json()
  }

  private async validateItemsAvailability(items: Array<{ productId: string, quantity: number }>): Promise<boolean> {
    const checks = await Promise.all(
      items.map(async item => {
        const response = await fetch(`/api/products/${item.productId}/available/${item.quantity}`)
        return response.json()
      })
    )
    return checks.every(result => result.available)
  }

  private async validatePayment(order: Order): Promise<boolean> {
    const response = await fetch('/api/payments/validate', {
      method: 'POST',
      body: JSON.stringify(order)
    })
    return response.json()
  }
}
```

### Advanced Usage

#### Content Moderator

```typescript
interface Content {
  id: string
  title: string
  body: string
  authorId: string
  tags: string[]
}

class ContentModerator {
  constructor(
    private moderationApi: string,
    private profanityApi: string,
    private userApi: string
  ) {}

  async getAppropriateContent(content: Collection<Content>): Promise<Collection<Content>> {
    return content.filterAsync(async (item) => {
      const [
        moderationPassed,
        noProfanity,
        authorValid
      ] = await Promise.all([
        this.checkModeration(item),
        this.checkProfanity(item),
        this.checkAuthor(item.authorId)
      ])

      return moderationPassed && noProfanity && authorValid
    })
  }

  private async checkModeration(content: Content): Promise<boolean> {
    const response = await fetch(`${this.moderationApi}/check`, {
      method: 'POST',
      body: JSON.stringify({
        text: content.body,
        title: content.title,
        tags: content.tags
      })
    })
    return response.json()
  }

  private async checkProfanity(content: Content): Promise<boolean> {
    const response = await fetch(`${this.profanityApi}/validate`, {
      method: 'POST',
      body: JSON.stringify({
        text: `${content.title} ${content.body}`
      })
    })
    const { clean } = await response.json()
    return clean
  }

  private async checkAuthor(authorId: string): Promise<boolean> {
    const response = await fetch(`${this.userApi}/users/${authorId}/standing`)
    const { goodStanding } = await response.json()
    return goodStanding
  }
}
```

## Type Safety

```typescript
interface Product {
  id: number
  sku: string
  price: number
}

const products = collect<Product>([
  { id: 1, sku: 'ABC', price: 100 },
  { id: 2, sku: 'DEF', price: 200 }
])

// Type-safe async filtering
const filtered = await products.filterAsync(async (product): Promise<boolean> => {
  const response = await fetch(`/api/products/${product.sku}/validate`)
  return response.json()
})

// TypeScript enforces return type Promise<Collection<Product>>
const result: Collection<Product> = await filtered
```

## Return Value

- Returns a Promise that resolves to a new Collection
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Preserves item order for matching items
- Empty collection if no items pass the test

## Common Use Cases

### 1. Inventory Validation

- Stock checking
- Availability verification
- Supplier validation
- Location verification
- Quantity confirmation

### 2. Order Processing

- Payment validation
- Stock verification
- Customer checks
- Shipping validation
- Discount verification

### 3. Content Moderation

- Text moderation
- Image validation
- Tag verification
- Author validation
- Category checks

### 4. User Validation

- Permission checks
- Status verification
- Account validation
- Access control
- Role verification

### 5. Payment Processing

- Fund verification
- Account validation
- Credit checks
- Fraud detection
- Balance confirmation

### 6. Data Validation

- External validation
- Format verification
- Rule checking
- Constraint validation
- Dependency verification

### 7. Product Management

- Availability checks
- Price validation
- Category verification
- Supplier validation
- Feature verification

### 8. Security Checks

- Authorization checks
- Access validation
- Token verification
- Rate limiting
- Compliance validation

### 9. Integration Validation

- API verification
- Service checks
- External validation
- System integration
- Connection verification

### 10. Business Rules

- Policy validation
- Rule enforcement
- Constraint checking
- Threshold validation
- Limit verification
