# product Method

The `product()` method calculates the product of all values in the collection. When a key is provided, it multiplies the values of that specific property. This is useful for calculating compound rates, multipliers, and cumulative effects.

## Basic Syntax

```typescript
collect(items).product(key?: keyof T): number
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple multiplication
const numbers = collect([2, 3, 4])
console.log(numbers.product())  // 24 (2 * 3 * 4)

// Empty collection
const empty = collect([])
console.log(empty.product())  // 0

// With specific key
const items = collect([
  { value: 2 },
  { value: 3 },
  { value: 4 }
])
console.log(items.product('value'))  // 24
```

### Working with Objects

```typescript
interface ProductMultiplier {
  id: number
  rate: number
  factor: number
}

const multipliers = collect<ProductMultiplier>([
  { id: 1, rate: 1.1, factor: 2 },
  { id: 2, rate: 1.2, factor: 1.5 }
])

// Calculate compound rate
const compoundRate = multipliers.product('rate')
console.log(compoundRate)  // 1.32 (1.1 * 1.2)

// Calculate total factor
const totalFactor = multipliers.product('factor')
console.log(totalFactor)  // 3 (2 * 1.5)
```

### Real-world Examples

#### Discount Calculator

```typescript
interface DiscountTier {
  id: string
  multiplier: number
  stackable: boolean
  category: string
}

class DiscountCalculator {
  constructor(private discounts: Collection<DiscountTier>) {}

  calculateStackedDiscount(category: string): number {
    return this.discounts
      .filter(d => d.stackable && d.category === category)
      .product('multiplier')
  }

  calculateFinalPrice(originalPrice: number, category: string): number {
    const multiplier = this.calculateStackedDiscount(category)
    return originalPrice * multiplier
  }

  getEffectiveDiscount(): number {
    const totalMultiplier = this.discounts
      .filter(d => d.stackable)
      .product('multiplier')

    return (1 - totalMultiplier) * 100
  }
}
```

#### Growth Rate Calculator

```typescript
interface GrowthRate {
  period: string
  rate: number
  confidence: number
}

class GrowthCalculator {
  constructor(private rates: Collection<GrowthRate>) {}

  calculateCompoundGrowth(): number {
    return this.rates
      .map(rate => 1 + (rate.rate / 100))
      .product()
  }

  calculateConfidenceLevel(): number {
    return this.rates
      .product('confidence') / 100
  }

  projectValue(initialValue: number): number {
    const growthMultiplier = this.calculateCompoundGrowth()
    return initialValue * growthMultiplier
  }
}
```

### Advanced Usage

#### Price Impact Calculator

```typescript
interface PriceModifier {
  type: string
  impact: number
  isMultiplicative: boolean
  priority: number
}

class PriceImpactCalculator {
  constructor(private modifiers: Collection<PriceModifier>) {}

  calculateMultiplicativeImpact(): number {
    return this.modifiers
      .filter(mod => mod.isMultiplicative)
      .sortBy('priority')
      .map(mod => 1 + (mod.impact / 100))
      .product()
  }

  applyModifiers(basePrice: number): number {
    // Apply multiplicative modifiers
    const multiplicativeImpact = this.calculateMultiplicativeImpact()

    // Apply additive modifiers
    const additiveImpact = this.modifiers
      .filter(mod => !mod.isMultiplicative)
      .sum('impact')

    return (basePrice * multiplicativeImpact) * (1 + (additiveImpact / 100))
  }
}
```

## Type Safety

```typescript
interface TypedMultiplier {
  id: number
  rate: number
  factor: number
}

const multipliers = collect<TypedMultiplier>([
  { id: 1, rate: 1.1, factor: 2 },
  { id: 2, rate: 1.2, factor: 1.5 }
])

// Type-safe product calculation
const rateProduct: number = multipliers.product('rate')
const factorProduct: number = multipliers.product('factor')

// TypeScript enforces valid keys
// multipliers.product('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns the product of all values
- Returns 0 for empty collections
- Skips non-numeric values
- Maintains numeric precision
- Returns number type
- Handles decimal values

## Common Use Cases

### 1. Discount Calculations

- Stacked discounts
- Compound rates
- Multiplicative effects
- Price reductions
- Loyalty multipliers

### 2. Growth Calculations

- Compound growth
- Rate multiplication
- Period calculations
- Trend analysis
- Projection factors

### 3. Price Modifications

- Price multipliers
- Rate compounds
- Factor calculations
- Impact multiplication
- Adjustment rates

### 4. Performance Metrics

- Compound rates
- Efficiency factors
- Impact multipliers
- Success rates
- Quality factors

### 5. Risk Assessment

- Probability products
- Risk multipliers
- Impact factors
- Confidence levels
- Reliability rates

### 6. Commission Calculations

- Rate multiplication
- Tier factors
- Bonus multipliers
- Performance rates
- Incentive calculations

### 7. Inventory Calculations

- Stock multipliers
- Buffer factors
- Safety stock
- Reorder rates
- Turnover factors

### 8. Rating Calculations

- Score products
- Weight factors
- Impact multipliers
- Quality rates
- Performance products

### 9. Financial Calculations

- Interest compounds
- Rate products
- Factor calculations
- Return multipliers
- Growth rates

### 10. Analytics Calculations

- Impact factors
- Conversion rates
- Effect multipliers
- Performance products
- Success probabilities
