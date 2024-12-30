# someAsync Method

The `someAsync()` method tests whether at least one element in the collection passes the provided async testing function. Returns a Promise that resolves to a boolean value.

## Basic Syntax

```typescript
collect(items).someAsync(callback: AsyncCallback<T, boolean>): Promise<boolean>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple async check
const numbers = collect([1, 2, 3, 4])
const hasEven = await numbers.someAsync(async (num) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return num % 2 === 0
})
console.log(hasEven)  // true

// External service check
const productIds = collect(['prod1', 'prod2', 'prod3'])
const hasAvailable = await productIds.someAsync(async (id) => {
  const response = await fetch(`/api/products/${id}/available`)
  const { inStock } = await response.json()
  return inStock
})
```

### Working with Objects

```typescript
interface Product {
  id: string
  sku: string
  price: number
}

const products = collect<Product>([
  { id: '1', sku: 'WIDGET-1', price: 100 },
  { id: '2', sku: 'GADGET-1', price: 200 }
])

// Check if any product is on sale
const hasDiscounts = await products.someAsync(async (product) => {
  const response = await fetch(`/api/prices/${product.sku}/discount`)
  const { hasDiscount } = await response.json()
  return hasDiscount
})
```

### Real-world Examples

#### Product Availability Checker

```typescript
interface InventoryItem {
  sku: string
  warehouse: string[]
  minQuantity: number
}

class AvailabilityChecker {
  constructor(private inventoryApi: string) {}

  async hasAvailableStock(items: Collection<InventoryItem>): Promise<{
    available: boolean
    availableSku?: string
    warehouse?: string
  }> {
    let foundSku: string | undefined
    let foundWarehouse: string | undefined

    const hasStock = await items.someAsync(async (item) => {
      // Check each warehouse for the item
      for (const warehouse of item.warehouse) {
        const hasStock = await this.checkWarehouseStock(item.sku, warehouse, item.minQuantity)
        if (hasStock) {
          foundSku = item.sku
          foundWarehouse = warehouse
          return true
        }
      }
      return false
    })

    return {
      available: hasStock,
      availableSku: foundSku,
      warehouse: foundWarehouse
    }
  }

  private async checkWarehouseStock(
    sku: string,
    warehouse: string,
    minQuantity: number
  ): Promise<boolean> {
    const response = await fetch(
      `${this.inventoryApi}/stock/${warehouse}/${sku}`
    )
    const { quantity } = await response.json()
    return quantity >= minQuantity
  }
}
```

#### Payment Method Validator

```typescript
interface PaymentMethod {
  type: string
  customerId: string
  token: string
}

class PaymentValidator {
  constructor(private paymentApi: string) {}

  async hasValidPaymentMethod(
    methods: Collection<PaymentMethod>,
    amount: number
  ): Promise<{
    valid: boolean
    validMethod?: PaymentMethod
    error?: string
  }> {
    try {
      let validMethod: PaymentMethod | undefined

      const isValid = await methods.someAsync(async (method) => {
        const [tokenValid, fundsSufficient] = await Promise.all([
          this.validateToken(method),
          this.checkFunds(method, amount)
        ])

        if (tokenValid && fundsSufficient) {
          validMethod = method
          return true
        }
        return false
      })

      return {
        valid: isValid,
        validMethod: validMethod
      }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async validateToken(method: PaymentMethod): Promise<boolean> {
    const response = await fetch(`${this.paymentApi}/validate-token`, {
      method: 'POST',
      body: JSON.stringify({
        type: method.type,
        token: method.token
      })
    })
    return response.json()
  }

  private async checkFunds(method: PaymentMethod, amount: number): Promise<boolean> {
    const response = await fetch(`${this.paymentApi}/check-funds`, {
      method: 'POST',
      body: JSON.stringify({
        type: method.type,
        customerId: method.customerId,
        amount
      })
    })
    return response.json()
  }
}
```

### Advanced Usage

#### Promotion Eligibility Checker

```typescript
interface Promotion {
  code: string
  conditions: {
    minimumSpend?: number
    requiredItems?: string[]
    customerGroups?: string[]
  }
}

class PromotionChecker {
  constructor(
    private promotionApi: string,
    private customerApi: string
  ) {}

  async hasEligiblePromotion(
    promotions: Collection<Promotion>,
    cartTotal: number,
    customerId: string
  ): Promise<{
    eligible: boolean
    promotion?: Promotion
    reason?: string
  }> {
    let eligiblePromotion: Promotion | undefined
    let failureReason: string | undefined

    const isEligible = await promotions.someAsync(async (promotion) => {
      try {
        const [spendOk, itemsOk, groupOk] = await Promise.all([
          this.checkMinimumSpend(promotion, cartTotal),
          this.checkRequiredItems(promotion),
          this.checkCustomerGroup(promotion, customerId)
        ])

        if (!spendOk) {
          failureReason = 'Minimum spend not met'
          return false
        }

        if (!itemsOk) {
          failureReason = 'Required items not in cart'
          return false
        }

        if (!groupOk) {
          failureReason = 'Customer not in eligible group'
          return false
        }

        eligiblePromotion = promotion
        return true
      } catch (error) {
        failureReason = 'Error checking eligibility'
        return false
      }
    })

    return {
      eligible: isEligible,
      promotion: eligiblePromotion,
      reason: isEligible ? undefined : failureReason
    }
  }

  private async checkMinimumSpend(
    promotion: Promotion,
    cartTotal: number
  ): Promise<boolean> {
    if (!promotion.conditions.minimumSpend) return true
    return cartTotal >= promotion.conditions.minimumSpend
  }

  private async checkRequiredItems(promotion: Promotion): Promise<boolean> {
    if (!promotion.conditions.requiredItems?.length) return true

    const response = await fetch(`${this.promotionApi}/check-items`, {
      method: 'POST',
      body: JSON.stringify(promotion.conditions.requiredItems)
    })
    return response.json()
  }

  private async checkCustomerGroup(
    promotion: Promotion,
    customerId: string
  ): Promise<boolean> {
    if (!promotion.conditions.customerGroups?.length) return true

    const response = await fetch(`${this.customerApi}/check-groups`, {
      method: 'POST',
      body: JSON.stringify({
        customerId,
        groups: promotion.conditions.customerGroups
      })
    })
    return response.json()
  }
}
```

## Type Safety

```typescript
interface CheckableItem {
  id: string
  status: string
  flags: string[]
}

const items = collect<CheckableItem>([
  { id: '1', status: 'active', flags: ['new'] },
  { id: '2', status: 'inactive', flags: ['special'] }
])

// Type-safe async checking
const hasSpecial = await items.someAsync(async (item): Promise<boolean> => {
  const response = await fetch(`/api/check-flags/${item.id}`)
  return response.json()
})

// TypeScript enforces return type Promise<boolean>
const result: boolean = await hasSpecial
```

## Return Value

- Returns a Promise that resolves to a boolean
- Returns true if any item passes the test
- Returns false if all items fail
- Returns false for empty collections
- Executes tests in parallel
- Short-circuits on first true

## Common Use Cases

### 1. Availability Checks

- Stock availability
- Service availability
- Delivery options
- Time slots
- Resource allocation

### 2. Payment Validation

- Payment methods
- Fund availability
- Credit checks
- Token validation
- Account status

### 3. Promotion Checks

- Eligibility validation
- Code validation
- Condition checks
- Time restrictions
- Group eligibility

### 4. Product Validation

- Stock checks
- Price validation
- Feature availability
- Market access
- Restriction checks

### 5. User Validation

- Permission checks
- Group membership
- Feature access
- License validation
- Status checks

### 6. Shipping Options

- Service availability
- Route validation
- Rate checks
- Time slots
- Delivery options

### 7. Feature Access

- Permission checks
- License validation
- Feature flags
- Access rights
- Subscription status

### 8. Service Checks

- API availability
- Service status
- Resource access
- Connection checks
- Health validation

### 9. Business Rules

- Condition checks
- Policy validation
- Rule evaluation
- Constraint checks
- Eligibility validation

### 10. Integration Status

- Service checks
- Connection status
- API availability
- Resource access
- Health checks
