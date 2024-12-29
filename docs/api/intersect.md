# intersect Method

The `intersect()` method returns a new collection containing items that are present in both the original collection and the given array or collection. This method is particularly useful for finding common elements between two sets of data.

## Basic Syntax

```typescript
collect(items).intersect(other: T[] | Collection<T>): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array intersection
const items1 = collect([1, 2, 3, 4, 5])
const items2 = [3, 4, 5, 6, 7]

const common = items1.intersect(items2)
console.log(common.all())
// [3, 4, 5]

// Object intersection
const products1 = collect([
  { id: 1, name: 'Widget' },
  { id: 2, name: 'Gadget' }
])
const products2 = [
  { id: 2, name: 'Gadget' },
  { id: 3, name: 'Tool' }
]

const commonProducts = products1.intersect(products2)
```

### Working with Objects

```typescript
interface Product {
  id: number
  sku: string
  inStock: boolean
  category: string
}

const warehouseA = collect<Product>([
  { id: 1, sku: 'WID-1', inStock: true, category: 'widgets' },
  { id: 2, sku: 'GAD-1', inStock: true, category: 'gadgets' }
])

const warehouseB = [
  { id: 2, sku: 'GAD-1', inStock: true, category: 'gadgets' },
  { id: 3, sku: 'TOL-1', inStock: true, category: 'tools' }
]

// Find products available in both warehouses
const commonInventory = warehouseA.intersect(warehouseB)
```

### Real-world Examples

#### Inventory Comparison System

```typescript
interface InventoryItem {
  sku: string
  name: string
  quantity: number
  location: string
  category: string
}

class InventoryComparator {
  compareWarehouses(
    warehouse1: Collection<InventoryItem>,
    warehouse2: InventoryItem[]
  ): {
    common: Collection<InventoryItem>
    unique1: Collection<InventoryItem>
    unique2: Collection<InventoryItem>
  } {
    return {
      // Items in both warehouses
      common: warehouse1.intersect(warehouse2),
      // Items only in warehouse1
      unique1: warehouse1.filter(item =>
        !warehouse2.some(w2Item => w2Item.sku === item.sku)
      ),
      // Items only in warehouse2
      unique2: collect(warehouse2).filter(item =>
        !warehouse1.some(w1Item => w1Item.sku === item.sku)
      )
    }
  }

  findCommonCategories(
    location1: Collection<InventoryItem>,
    location2: InventoryItem[]
  ): Collection<string> {
    return location1
      .pluck('category')
      .intersect(collect(location2).pluck('category'))
  }
}
```

#### Product Catalog Analyzer

```typescript
interface CatalogItem {
  id: string
  name: string
  categories: string[]
  tags: string[]
  price: number
}

class CatalogAnalyzer {
  private catalog1: Collection<CatalogItem>
  private catalog2: Collection<CatalogItem>

  constructor(catalog1: CatalogItem[], catalog2: CatalogItem[]) {
    this.catalog1 = collect(catalog1)
    this.catalog2 = collect(catalog2)
  }

  findCommonProducts(): Collection<CatalogItem> {
    return this.catalog1.intersect(this.catalog2.all())
  }

  findCommonCategories(): string[] {
    const categories1 = this.catalog1.flatMap(item => item.categories)
    const categories2 = this.catalog2.flatMap(item => item.categories)
    return categories1.intersect(categories2).all()
  }

  findCommonTags(): string[] {
    const tags1 = this.catalog1.flatMap(item => item.tags)
    const tags2 = this.catalog2.flatMap(item => item.tags)
    return tags1.intersect(tags2).all()
  }

  findOverlappingPriceRanges(): { min: number; max: number } {
    const range1 = this.getPriceRange(this.catalog1)
    const range2 = this.getPriceRange(this.catalog2)

    return {
      min: Math.max(range1.min, range2.min),
      max: Math.min(range1.max, range2.max)
    }
  }

  private getPriceRange(catalog: Collection<CatalogItem>): { min: number; max: number } {
    return {
      min: catalog.min('price') ?? 0,
      max: catalog.max('price') ?? 0
    }
  }
}
```

### Advanced Usage

#### Customer Segment Analyzer

```typescript
interface Customer {
  id: string
  segments: string[]
  preferences: string[]
  purchasedCategories: string[]
}

class CustomerAnalyzer {
  findCommonSegments(
    group1: Collection<Customer>,
    group2: Collection<Customer>
  ): Collection<string> {
    const segments1 = group1.flatMap(customer => customer.segments).unique()
    const segments2 = group2.flatMap(customer => customer.segments).unique()

    return segments1.intersect(segments2)
  }

  findCommonPreferences(
    group1: Collection<Customer>,
    group2: Collection<Customer>
  ): Collection<string> {
    const prefs1 = group1.flatMap(customer => customer.preferences).unique()
    const prefs2 = group2.flatMap(customer => customer.preferences).unique()

    return prefs1.intersect(prefs2)
  }

  findCommonCategories(
    group1: Collection<Customer>,
    group2: Collection<Customer>
  ): Collection<string> {
    const cats1 = group1.flatMap(customer => customer.purchasedCategories).unique()
    const cats2 = group2.flatMap(customer => customer.purchasedCategories).unique()

    return cats1.intersect(cats2)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  category: string
  tags: string[]
}

const collection1 = collect<TypedItem>([
  { id: 1, category: 'A', tags: ['new'] },
  { id: 2, category: 'B', tags: ['sale'] }
])

const collection2: TypedItem[] = [
  { id: 2, category: 'B', tags: ['sale'] },
  { id: 3, category: 'C', tags: ['featured'] }
]

// Type-safe intersection
const common = collection1.intersect(collection2)

// TypeScript enforces type matching
// collection1.intersect([1, 2, 3])  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing only items present in both collections
- Original collections remain unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses strict equality (===) for comparison
- Preserves the original object references

## Common Use Cases

### 1. Inventory Management

- Common stock between warehouses
- Shared product categories
- Overlapping suppliers
- Common storage locations
- Shared SKUs

### 2. Product Analysis

- Common categories
- Shared attributes
- Overlapping price ranges
- Common tags
- Shared specifications

### 3. Customer Segmentation

- Common demographics
- Shared interests
- Overlapping behaviors
- Common preferences
- Shared characteristics

### 4. Catalog Management

- Common products
- Shared brands
- Overlapping collections
- Common features
- Shared variants

### 5. Order Processing

- Common shipping zones
- Shared payment methods
- Overlapping delivery times
- Common carriers
- Shared fulfillment centers

### 6. Marketing Analysis

- Common customer segments
- Shared campaign targets
- Overlapping promotions
- Common channels
- Shared audiences

### 7. Pricing Strategy

- Common price points
- Shared discount levels
- Overlapping price ranges
- Common tax categories
- Shared payment terms

### 8. Stock Management

- Common suppliers
- Shared storage locations
- Overlapping stock levels
- Common reorder points
- Shared inventory rules

### 9. Category Management

- Common hierarchies
- Shared classifications
- Overlapping taxonomies
- Common groupings
- Shared organizations

### 10. Supplier Management

- Common vendors
- Shared products
- Overlapping services
- Common territories
- Shared capabilities
