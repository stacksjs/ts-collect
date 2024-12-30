# cartesianProduct Method

The `cartesianProduct()` method returns a new collection containing all possible pairs of items from the original collection and the provided collection. This is equivalent to finding all possible combinations between two sets.

## Basic Syntax

```typescript
collect(items).cartesianProduct<U>(other: U[] | Collection<U>): Collection<[T, U]>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple cartesian product
const sizes = collect(['S', 'M', 'L'])
const colors = ['Red', 'Blue']
const variations = sizes.cartesianProduct(colors)
console.log(variations.all())
// [
//   ['S', 'Red'],
//   ['S', 'Blue'],
//   ['M', 'Red'],
//   ['M', 'Blue'],
//   ['L', 'Red'],
//   ['L', 'Blue']
// ]

// Numbers and strings
const numbers = collect([1, 2])
const labels = ['A', 'B', 'C']
const combinations = numbers.cartesianProduct(labels)
```

### Working with Objects

```typescript
interface Size {
  id: string
  name: string
  dimensions: string
}

interface Color {
  id: string
  name: string
  hexCode: string
}

const sizes = collect<Size>([
  { id: 'S', name: 'Small', dimensions: '10x10' },
  { id: 'M', name: 'Medium', dimensions: '20x20' }
])

const colors: Color[] = [
  { id: 'RED', name: 'Red', hexCode: '#FF0000' },
  { id: 'BLUE', name: 'Blue', hexCode: '#0000FF' }
]

// Generate all size and color combinations
const productVariations = sizes.cartesianProduct(colors)
```

### Real-world Examples

#### Product Variant Generator

```typescript
interface BaseOption {
  id: string
  name: string
  price: number
}

interface ProductVariant {
  id: string
  options: [BaseOption, BaseOption]
  totalPrice: number
  sku: string
}

class VariantGenerator {
  generateVariants(
    options1: Collection<BaseOption>,
    options2: BaseOption[]
  ): Collection<ProductVariant> {
    return options1
      .cartesianProduct(options2)
      .map(([opt1, opt2]) => ({
        id: `${opt1.id}-${opt2.id}`,
        options: [opt1, opt2],
        totalPrice: opt1.price + opt2.price,
        sku: this.generateSku(opt1, opt2)
      }))
  }

  generateAllVariants(
    baseProduct: {
      id: string
      basePrice: number
    },
    sizes: BaseOption[],
    colors: BaseOption[],
    materials: BaseOption[]
  ): {
    variants: ProductVariant[]
    priceRange: { min: number; max: number }
  } {
    // Generate size-color combinations
    const sizeColorVariants = collect(sizes)
      .cartesianProduct(colors)
      .map(([size, color]) => ({
        id: `${size.id}-${color.id}`,
        options: [size, color] as [BaseOption, BaseOption],
        price: baseProduct.basePrice + size.price + color.price
      }))

    // Add materials to each size-color combination
    const allVariants = sizeColorVariants
      .cartesianProduct(materials)
      .map(([variant, material]) => ({
        id: `${variant.id}-${material.id}`,
        options: [...variant.options, material],
        totalPrice: variant.price + material.price,
        sku: this.generateFullSku(baseProduct.id, variant.options, material)
      }))
      .toArray()

    const prices = allVariants.map(v => v.totalPrice)
    return {
      variants: allVariants,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      }
    }
  }

  private generateSku(opt1: BaseOption, opt2: BaseOption): string {
    return `${opt1.id}-${opt2.id}`.toUpperCase()
  }

  private generateFullSku(
    productId: string,
    options: BaseOption[],
    material: BaseOption
  ): string {
    return `${productId}-${options.map(o => o.id).join('-')}-${material.id}`.toUpperCase()
  }
}
```

#### Bundle Creator

```typescript
interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface Bundle {
  id: string
  products: [Product, Product]
  totalPrice: number
  discountedPrice: number
  savings: number
}

class BundleCreator {
  constructor(private bundleDiscount: number = 0.1) {}

  generateCompatibleBundles(
    products1: Collection<Product>,
    products2: Product[],
    rules: {
      maxPrice?: number
      categories?: string[]
    } = {}
  ): Collection<Bundle> {
    return products1
      .cartesianProduct(products2)
      .filter(([p1, p2]) => this.areCompatible(p1, p2, rules))
      .map(([p1, p2]) => this.createBundle(p1, p2))
  }

  private areCompatible(
    product1: Product,
    product2: Product,
    rules: {
      maxPrice?: number
      categories?: string[]
    }
  ): boolean {
    const totalPrice = product1.price + product2.price

    if (rules.maxPrice && totalPrice > rules.maxPrice) {
      return false
    }

    if (rules.categories &&
        !rules.categories.includes(product1.category) &&
        !rules.categories.includes(product2.category)) {
      return false
    }

    return product1.id !== product2.id
  }

  private createBundle(p1: Product, p2: Product): Bundle {
    const totalPrice = p1.price + p2.price
    const discountedPrice = totalPrice * (1 - this.bundleDiscount)

    return {
      id: `${p1.id}-${p2.id}`,
      products: [p1, p2],
      totalPrice,
      discountedPrice,
      savings: totalPrice - discountedPrice
    }
  }
}
```

### Advanced Usage

#### Custom Menu Builder

```typescript
interface MenuItem {
  id: string
  name: string
  price: number
  type: 'main' | 'side' | 'drink'
  calories: number
}

interface MenuCombo {
  id: string
  items: [MenuItem, MenuItem]
  totalPrice: number
  totalCalories: number
  savings: number
}

class MenuComboBuilder {
  generateCombos(
    mains: Collection<MenuItem>,
    sides: MenuItem[]
  ): {
    combos: Collection<MenuCombo>
    categories: {
      budget: MenuCombo[]
      regular: MenuCombo[]
      premium: MenuCombo[]
    }
  } {
    const allCombos = mains
      .cartesianProduct(sides)
      .map(([main, side]) => this.createCombo(main, side))

    return {
      combos: allCombos,
      categories: {
        budget: allCombos
          .filter(combo => combo.totalPrice < 15)
          .toArray(),
        regular: allCombos
          .filter(combo => combo.totalPrice >= 15 && combo.totalPrice < 25)
          .toArray(),
        premium: allCombos
          .filter(combo => combo.totalPrice >= 25)
          .toArray()
      }
    }
  }

  private createCombo(main: MenuItem, side: MenuItem): MenuCombo {
    const totalPrice = main.price + side.price
    const comboDiscount = this.calculateComboDiscount(main, side)

    return {
      id: `${main.id}-${side.id}`,
      items: [main, side],
      totalPrice: totalPrice * (1 - comboDiscount),
      totalCalories: main.calories + side.calories,
      savings: totalPrice * comboDiscount
    }
  }

  private calculateComboDiscount(main: MenuItem, side: MenuItem): number {
    // Example discount logic
    if (main.price + side.price > 30) return 0.15
    if (main.price + side.price > 20) return 0.1
    return 0.05
  }
}
```

## Type Safety

```typescript
interface Option1 {
  id: string
  value: string
}

interface Option2 {
  id: string
  code: number
}

const options1 = collect<Option1>([
  { id: 'A', value: 'Value A' },
  { id: 'B', value: 'Value B' }
])

const options2: Option2[] = [
  { id: 'X', code: 1 },
  { id: 'Y', code: 2 }
]

// Type-safe cartesian product
const combinations: Collection<[Option1, Option2]> = options1.cartesianProduct(options2)

// Type safety maintained in results
combinations.forEach(([opt1, opt2]) => {
  const value: string = opt1.value
  const code: number = opt2.code
})
```

## Return Value

- Returns a new Collection of tuple pairs
- Original collections remain unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Preserves original order for pairs
- Empty collection if either input is empty

## Common Use Cases

### 1. Product Variations

- Size/color combinations
- Style variations
- Material options
- Customization choices
- Feature combinations

### 2. Bundle Creation

- Product bundles
- Package deals
- Combo offers
- Set combinations
- Kit assemblies

### 3. Menu Combinations

- Meal combos
- Dish pairings
- Drink combinations
- Side options
- Special menus

### 4. Pricing Options

- Price tiers
- Service levels
- Package options
- Subscription combinations
- Payment plans

### 5. Booking Options

- Time slots
- Service combinations
- Resource allocation
- Venue options
- Package selections

### 6. Configuration Options

- Feature combinations
- Setting pairs
- Option selections
- Customization choices
- Setup variations

### 7. Service Packages

- Service combinations
- Add-on options
- Package builds
- Upgrade options
- Custom solutions

### 8. Event Planning

- Venue/date combinations
- Service pairings
- Resource allocation
- Schedule options
- Package selections

### 9. Travel Packages

- Flight/hotel combinations
- Activity pairings
- Transportation options
- Meal plans
- Tour combinations

### 10. Customization Options

- Design combinations
- Style pairings
- Material selections
- Color schemes
- Feature sets
