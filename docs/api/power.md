# Power Method

The `power()` method generates all possible subsets of the collection (power set). It returns a new collection containing all possible combinations of items, including the empty set and the full set.

## Basic Syntax

```typescript
power(): CollectionOperations<CollectionOperations<T>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2])
const powerSet = numbers.power()

console.log(powerSet.map(set => set.all()).all())
// [
//   [],        // empty set
//   [1],       // single element sets
//   [2],
//   [1, 2]     // full set
// ]
```

### Working with Objects

```typescript
interface Feature {
  name: string
  enabled: boolean
}

const features = collect<Feature>([
  { name: 'dark-mode', enabled: true },
  { name: 'notifications', enabled: true }
])

const featureCombinations = features.power()
console.log(featureCombinations.count()) // 4 combinations
```

### Real-world Example: E-commerce Product Bundle Generator

```typescript
interface Product {
  id: string
  name: string
  price: number
  category: string
}

class BundleGenerator {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  generateAllBundles(): Collection<{
    items: Product[]
    totalPrice: number
    discount: number
  }> {
    return this.products
      .power()
      .filter(bundle => bundle.count() > 1) // Exclude empty and single-item bundles
      .map(bundle => ({
        items: bundle.all(),
        totalPrice: bundle.sum('price'),
        discount: this.calculateBundleDiscount(bundle.count())
      }))
  }

  generateCategoryBundles(category: string): Collection<CollectionOperations<Product>> {
    return this.products
      .where('category', category)
      .power()
      .filter(bundle => bundle.count() > 0)
  }

  private calculateBundleDiscount(itemCount: number): number {
    // More items = bigger discount
    return Math.min(itemCount * 5, 25) // Max 25% discount
  }
}

// Usage
const bundler = new BundleGenerator([
  { id: 'P1', name: 'Mouse', price: 29.99, category: 'accessories' },
  { id: 'P2', name: 'Keyboard', price: 49.99, category: 'accessories' },
  { id: 'P3', name: 'Headset', price: 79.99, category: 'accessories' }
])

const bundles = bundler.generateAllBundles()
```

## Type Safety

```typescript
interface Item {
  id: number
  value: string
}

const items = collect<Item>([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' }
])

// Type-safe power set generation
const powerSet: CollectionOperations<CollectionOperations<Item>> = items.power()

// Each subset is also a collection
powerSet.forEach(subset => {
  const values: string[] = subset.pluck('value').all()
})
```

## Return Value

- Returns a Collection of Collections (power set)
- Includes empty set and full set
- Maintains type safety through generics
- Each subset is a Collection instance
- Number of subsets is 2^n (n = collection size)
- Order of elements is preserved in subsets

## Common Use Cases

### 1. Product Bundling

- Bundle combinations
- Package options
- Product sets
- Accessory combinations
- Kit configurations

### 2. Feature Combinations

- Feature toggles
- Permission sets
- Setting combinations
- Configuration options
- Test scenarios

### 3. Menu Generation

- Combo meals
- Selection options
- Add-on combinations
- Customization choices
- Package deals

### 4. Analysis

- Option analysis
- Combination testing
- Path exploration
- Set operations
- Pattern matching

### 5. Configuration Management

- System settings
- User preferences
- Module combinations
- Plugin configurations
- Component sets
