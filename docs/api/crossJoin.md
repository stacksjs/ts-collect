# CrossJoin Method

The `crossJoin()` method performs a Cartesian product between two collections, combining each item from the first collection with every item from the second collection.

## Basic Syntax

```typescript
crossJoin<U>(other: CollectionOperations<U>): CollectionOperations<T & U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const sizes = collect(['S', 'M', 'L'])
const colors = collect(['Red', 'Blue'])

const combinations = sizes.crossJoin(colors)
// [
//   { '0': 'S', '1': 'Red' },
//   { '0': 'S', '1': 'Blue' },
//   { '0': 'M', '1': 'Red' },
//   { '0': 'M', '1': 'Blue' },
//   { '0': 'L', '1': 'Red' },
//   { '0': 'L', '1': 'Blue' }
// ]
```

### Real-world Example: E-commerce Product Variants

```typescript
interface Size {
  name: string
  code: string
}

interface Color {
  name: string
  hex: string
}

class ProductVariantGenerator {
  private sizes: Collection<Size>
  private colors: Collection<Color>

  constructor(sizes: Size[], colors: Color[]) {
    this.sizes = collect(sizes)
    this.colors = collect(colors)
  }

  generateVariants(basePrice: number) {
    return this.sizes
      .crossJoin(this.colors)
      .map(variant => ({
        sku: `${variant.code}-${variant.hex}`,
        name: `${variant.name} - ${variant.name}`,
        price: basePrice,
        attributes: {
          size: variant.code,
          color: variant.hex
        }
      }))
  }

  generatePriceMatrix(basePrices: number[]) {
    return collect(basePrices)
      .crossJoin(this.sizes)
      .crossJoin(this.colors)
      .map(item => ({
        size: item.code,
        color: item.hex,
        price: item[0]
      }))
  }
}

// Usage
const generator = new ProductVariantGenerator(
  [
    { name: 'Small', code: 'S' },
    { name: 'Medium', code: 'M' }
  ],
  [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' }
  ]
)

const variants = generator.generateVariants(29.99)
const priceMatrix = generator.generatePriceMatrix([29.99, 34.99])
```

## Type Safety

```typescript
interface Feature {
  id: string
  name: string
}

interface Price {
  amount: number
  currency: string
}

const features = collect<Feature>([
  { id: 'F1', name: 'Basic' }
])

const prices = collect<Price>([
  { amount: 99.99, currency: 'USD' }
])

// Type-safe cross join
const combinations: CollectionOperations<Feature & Price> =
  features.crossJoin(prices)
```

## Return Value

- Returns Collection of combined items
- Result length is product of input lengths
- Merges object properties
- Maintains type safety
- Preserves all fields
- Returns empty if either input empty

## Common Use Cases

### 1. Product Configuration

- Product variants
- Feature combinations
- Package options
- Bundle combinations
- Price matrices

### 2. Testing Scenarios

- Test combinations
- Parameter sets
- Test matrices
- Edge cases
- Config testing

### 3. Pricing Strategies

- Price matrices
- Discount combinations
- Package pricing
- Tier combinations
- Option pricing

### 4. Feature Management

- Feature combinations
- Option sets
- Configuration matrices
- Setting combinations
- Plan features

### 5. Data Analysis

- Combination analysis
- Factor comparison
- Scenario generation
- Variable combinations
- Pattern analysis
