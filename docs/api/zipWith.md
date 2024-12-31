# ZipWith Method

The `zipWith()` method combines two collections element-by-element using a custom function, creating a new collection of transformed pairs.

## Basic Syntax

```typescript
zipWith<U, R>(
  other: CollectionOperations<U>,
  fn: (a: T, b: U) => R
): CollectionOperations<R>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const prices = collect([10, 20, 30])
const quantities = collect([2, 3, 1])

const totals = prices.zipWith(
  quantities,
  (price, qty) => price * qty
)

console.log(totals.all())
// [20, 60, 30]
```

### Real-world Example: E-commerce Price Calculator

```typescript
interface Product {
  id: string
  basePrice: number
  name: string
}

interface PriceRule {
  productId: string
  discount: number
  taxRate: number
}

class PriceCalculator {
  private products: Collection<Product>
  private priceRules: Collection<PriceRule>

  constructor(products: Product[], priceRules: PriceRule[]) {
    this.products = collect(products)
    this.priceRules = collect(priceRules)
  }

  calculateFinalPrices() {
    return this.products.zipWith(
      this.priceRules,
      (product, rule) => ({
        productId: product.id,
        name: product.name,
        originalPrice: product.basePrice,
        discount: rule.discount,
        tax: rule.taxRate,
        finalPrice: this.calculatePrice(
          product.basePrice,
          rule.discount,
          rule.taxRate
        )
      })
    )
  }

  calculateBulkPrices(quantities: Collection<number>) {
    return this.calculateFinalPrices()
      .zipWith(quantities, (price, quantity) => ({
        ...price,
        quantity,
        totalPrice: price.finalPrice * quantity
      }))
  }

  private calculatePrice(
    base: number,
    discount: number,
    taxRate: number
  ): number {
    const discountedPrice = base * (1 - discount)
    return discountedPrice * (1 + taxRate)
  }
}

// Usage
const calculator = new PriceCalculator(
  [
    { id: 'P1', basePrice: 100, name: 'Laptop' }
  ],
  [
    { productId: 'P1', discount: 0.1, taxRate: 0.2 }
  ]
)

const prices = calculator.calculateFinalPrices()
const bulkPrices = calculator.calculateBulkPrices(collect([2]))
```

## Type Safety

```typescript
interface User {
  id: number
  name: string
}

interface Preference {
  userId: number
  theme: string
}

const users = collect<User>([
  { id: 1, name: 'Chris' }
])

const preferences = collect<Preference>([
  { userId: 1, theme: 'dark' }
])

// Type-safe combination
interface UserProfile {
  name: string
  theme: string
}

const profiles = users.zipWith<Preference, UserProfile>(
  preferences,
  (user, pref) => ({
    name: user.name,
    theme: pref.theme
  })
)
```

## Return Value

- Returns new Collection of transformed pairs
- Length matches shorter input
- Custom transformation applied
- Type-safe operations
- Skips unmatched items
- Maintains order

## Common Use Cases

### 1. Price Calculations

- Price combinations
- Discount application
- Tax calculations
- Bulk pricing
- Rate combinations

### 2. Data Transformation

- Record merging
- Field combining
- Data enrichment
- Format conversion
- Structure mapping

### 3. Statistics

- Data pairing
- Value comparison
- Metric combining
- Score calculation
- Rating computation

### 4. User Data

- Profile merging
- Preference combining
- Settings application
- Data enrichment
- State combining

### 5. Order Processing

- Price application
- Quantity calculations
- Rule application
- Status combining
- Total calculations
