# everyAsync Method

The `everyAsync()` method tests whether all elements in the collection satisfy the provided async testing function. Returns a Promise that resolves to a boolean value.

## Basic Syntax

```typescript
collect(items).everyAsync(callback: AsyncCallback<T, boolean>): Promise<boolean>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple async validation
const numbers = collect([2, 4, 6, 8])
const allEven = await numbers.everyAsync(async (num) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return num % 2 === 0
})
console.log(allEven)  // true

// External validation
const userIds = collect(['user1', 'user2', 'user3'])
const allActive = await userIds.everyAsync(async (userId) => {
  const response = await fetch(`/api/users/${userId}/active`)
  const { active } = await response.json()
  return active
})
```

### Working with Objects

```typescript
interface Product {
  id: string
  sku: string
  minStock: number
}

const products = collect<Product>([
  { id: '1', sku: 'WIDGET-1', minStock: 10 },
  { id: '2', sku: 'GADGET-1', minStock: 5 }
])

// Check if all products are in stock
const allInStock = await products.everyAsync(async (product) => {
  const response = await fetch(`/api/inventory/${product.sku}/stock`)
  const { quantity } = await response.json()
  return quantity >= product.minStock
})
```

### Real-world Examples

#### Order Validator

```typescript
interface OrderItem {
  productId: string
  quantity: number
  customizations: string[]
}

class OrderValidator {
  constructor(private validationApi: string) {}

  async validateOrder(items: Collection<OrderItem>): Promise<{
    valid: boolean
    reason?: string
  }> {
    try {
      const allValid = await items.everyAsync(async (item) => {
        const [stockValid, customizationsValid] = await Promise.all([
          this.validateStock(item),
          this.validateCustomizations(item)
        ])

        return stockValid && customizationsValid
      })

      return {
        valid: allValid,
        reason: allValid ? undefined : 'One or more items failed validation'
      }
    } catch (error) {
      return {
        valid: false,
        reason: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async validateStock(item: OrderItem): Promise<boolean> {
    const response = await fetch(
      `${this.validationApi}/stock/${item.productId}/${item.quantity}`
    )
    return response.json()
  }

  private async validateCustomizations(item: OrderItem): Promise<boolean> {
    if (!item.customizations.length) return true

    const results = await Promise.all(
      item.customizations.map(async (customId) => {
        const response = await fetch(
          `${this.validationApi}/customization/${item.productId}/${customId}`
        )
        return response.json()
      })
    )

    return results.every(result => result === true)
  }
}
```

#### Shipping Validator

```typescript
interface ShipmentItem {
  orderId: string
  destination: {
    country: string
    postal: string
  }
  weight: number
  restrictions: string[]
}

class ShipmentValidator {
  constructor(private shippingApi: string) {}

  async canShipAll(shipments: Collection<ShipmentItem>): Promise<{
    shippable: boolean
    restrictions: string[]
  }> {
    const restrictions: string[] = []

    const allShippable = await shipments.everyAsync(async (shipment) => {
      const [
        destinationValid,
        weightValid,
        restrictionsValid
      ] = await Promise.all([
        this.validateDestination(shipment.destination),
        this.validateWeight(shipment.weight),
        this.validateRestrictions(shipment.restrictions)
      ])

      if (!destinationValid) restrictions.push(`Invalid destination: ${shipment.orderId}`)
      if (!weightValid) restrictions.push(`Invalid weight: ${shipment.orderId}`)
      if (!restrictionsValid) restrictions.push(`Shipping restrictions: ${shipment.orderId}`)

      return destinationValid && weightValid && restrictionsValid
    })

    return {
      shippable: allShippable,
      restrictions: allShippable ? [] : restrictions
    }
  }

  private async validateDestination(destination: ShipmentItem['destination']): Promise<boolean> {
    const response = await fetch(`${this.shippingApi}/validate-destination`, {
      method: 'POST',
      body: JSON.stringify(destination)
    })
    return response.json()
  }

  private async validateWeight(weight: number): Promise<boolean> {
    const response = await fetch(`${this.shippingApi}/validate-weight/${weight}`)
    return response.json()
  }

  private async validateRestrictions(restrictions: string[]): Promise<boolean> {
    if (!restrictions.length) return true

    const response = await fetch(`${this.shippingApi}/validate-restrictions`, {
      method: 'POST',
      body: JSON.stringify(restrictions)
    })
    return response.json()
  }
}
```

### Advanced Usage

#### Price Compliance Checker

```typescript
interface PriceRule {
  marketId: string
  minPrice: number
  maxPrice: number
  currency: string
}

class PriceComplianceChecker {
  constructor(
    private exchangeRateApi: string,
    private rules: PriceRule[]
  ) {}

  async validatePriceCompliance(
    products: Collection<{ sku: string; marketId: string; price: number }>
  ): Promise<{
    compliant: boolean
    violations: Array<{
      sku: string
      marketId: string
      reason: string
    }>
  }> {
    const violations: Array<{
      sku: string
      marketId: string
      reason: string
    }> = []

    const allCompliant = await products.everyAsync(async (product) => {
      const rule = this.rules.find(r => r.marketId === product.marketId)
      if (!rule) {
        violations.push({
          sku: product.sku,
          marketId: product.marketId,
          reason: 'No price rules found for market'
        })
        return false
      }

      const convertedPrice = await this.convertPrice(
        product.price,
        rule.currency
      )

      const isCompliant = convertedPrice >= rule.minPrice &&
                         convertedPrice <= rule.maxPrice

      if (!isCompliant) {
        violations.push({
          sku: product.sku,
          marketId: product.marketId,
          reason: `Price ${convertedPrice} outside allowed range ${rule.minPrice}-${rule.maxPrice}`
        })
      }

      return isCompliant
    })

    return {
      compliant: allCompliant,
      violations
    }
  }

  private async convertPrice(price: number, targetCurrency: string): Promise<number> {
    const response = await fetch(
      `${this.exchangeRateApi}/convert?price=${price}&to=${targetCurrency}`
    )
    const { convertedPrice } = await response.json()
    return convertedPrice
  }
}
```

## Type Safety

```typescript
interface ValidatableItem {
  id: string
  status: string
  rules: string[]
}

const items = collect<ValidatableItem>([
  { id: '1', status: 'active', rules: ['A', 'B'] },
  { id: '2', status: 'active', rules: ['C'] }
])

// Type-safe async validation
const allValid = await items.everyAsync(async (item): Promise<boolean> => {
  const response = await fetch(`/api/validate/${item.id}`)
  return response.json()
})

// TypeScript enforces return type Promise<boolean>
const result: boolean = await allValid
```

## Return Value

- Returns a Promise that resolves to a boolean
- Returns true if all items pass the test
- Returns false if any item fails
- Returns true for empty collections
- Executes tests in parallel
- Short-circuits on first false

## Common Use Cases

### 1. Order Validation

- Stock availability
- Price validation
- Shipping rules
- Customer eligibility
- Payment verification

### 2. Inventory Checks

- Stock levels
- Availability
- Location validation
- Supplier checks
- Reorder points

### 3. Price Validation

- Market compliance
- Margin checks
- Discount rules
- Currency validation
- Price range checks

### 4. Shipping Validation

- Destination checks
- Weight limits
- Restrictions
- Service availability
- Cost validation

### 5. User Validation

- Permission checks
- Access rights
- Account status
- Usage limits
- Subscription status

### 6. Product Validation

- Availability
- Restrictions
- Category rules
- Feature availability
- Market compliance

### 7. Compliance Checks

- Legal requirements
- Policy compliance
- Regulatory checks
- Standard adherence
- Rule validation

### 8. Integration Validation

- API availability
- Service status
- Connection checks
- Resource access
- Response validation

### 9. Business Rules

- Policy enforcement
- Process validation
- Workflow rules
- Constraint checks
- Logic validation

### 10. Security Checks

- Access rights
- Token validation
- Rate limits
- Authentication
- Authorization
