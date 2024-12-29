# toSet Method

The `toSet()` method converts the collection into a JavaScript Set object, automatically removing any duplicate values. This is particularly useful when you need to work with unique values or perform set operations.

## Basic Syntax

```typescript
collect(items).toSet(): Set<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Basic deduplication
const numbers = collect([1, 2, 2, 3, 3, 4])
const uniqueNumbers = numbers.toSet()
console.log([...uniqueNumbers])  // [1, 2, 3, 4]

// Category tags
const tags = collect(['sale', 'new', 'sale', 'featured'])
const uniqueTags = tags.toSet()
console.log([...uniqueTags])  // ['sale', 'new', 'featured']
```

### Working with Objects

```typescript
interface Product {
  id: number
  category: string
  tags: string[]
}

const products = collect<Product>([
  { id: 1, category: 'electronics', tags: ['new', 'sale'] },
  { id: 2, category: 'electronics', tags: ['featured'] },
  { id: 3, category: 'clothing', tags: ['sale'] }
])

// Get unique categories
const categories = products
  .pluck('category')
  .toSet()

// Get unique tags
const allTags = products
  .flatMap(product => product.tags)
  .toSet()
```

### Real-world Examples

#### Category Manager

```typescript
interface CategoryData {
  id: string
  name: string
  parent: string | null
  attributes: string[]
}

class CategoryManager {
  private categories: Collection<CategoryData>

  constructor(categories: CategoryData[]) {
    this.categories = collect(categories)
  }

  getUniqueAttributes(): Set<string> {
    return this.categories
      .flatMap(cat => cat.attributes)
      .toSet()
  }

  getTopLevelCategories(): Set<string> {
    return this.categories
      .filter(cat => cat.parent === null)
      .pluck('name')
      .toSet()
  }

  getCategoryHierarchy(): Map<string, Set<string>> {
    const hierarchy = new Map<string, Set<string>>()

    this.categories.each(category => {
      if (category.parent) {
        const children = hierarchy.get(category.parent) || new Set()
        children.add(category.name)
        hierarchy.set(category.parent, children)
      }
    })

    return hierarchy
  }
}
```

#### Product Tag System

```typescript
interface ProductTag {
  productId: string
  tags: string[]
  automatic: boolean
  source: string
}

class TagManager {
  constructor(private tagData: Collection<ProductTag>) {}

  getAllTags(): Set<string> {
    return this.tagData
      .flatMap(data => data.tags)
      .toSet()
  }

  getAutomaticTags(): Set<string> {
    return this.tagData
      .filter(data => data.automatic)
      .flatMap(data => data.tags)
      .toSet()
  }

  getTagsBySource(source: string): Set<string> {
    return this.tagData
      .filter(data => data.source === source)
      .flatMap(data => data.tags)
      .toSet()
  }

  getProductsWithTag(tag: string): Set<string> {
    return this.tagData
      .filter(data => data.tags.includes(tag))
      .pluck('productId')
      .toSet()
  }
}
```

### Advanced Usage

#### Attribute Analyzer

```typescript
interface ProductAttribute {
  productId: string
  name: string
  value: string
  metadata: {
    unit?: string
    group?: string
    searchable: boolean
  }
}

class AttributeAnalyzer {
  constructor(private attributes: Collection<ProductAttribute>) {}

  getSearchableAttributes(): Set<string> {
    return this.attributes
      .filter(attr => attr.metadata.searchable)
      .pluck('name')
      .toSet()
  }

  getAttributeUnits(): Set<string> {
    return this.attributes
      .map(attr => attr.metadata.unit)
      .filter(unit => unit !== undefined)
      .toSet()
  }

  getAttributeGroups(): Set<string> {
    return this.attributes
      .map(attr => attr.metadata.group)
      .filter(group => group !== undefined)
      .toSet()
  }

  getUniqueValues(attributeName: string): Set<string> {
    return this.attributes
      .filter(attr => attr.name === attributeName)
      .pluck('value')
      .toSet()
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  category: string
  tags: string[]
}

const products = collect<TypedProduct>([
  { id: 1, category: 'A', tags: ['new'] },
  { id: 2, category: 'A', tags: ['sale'] }
])

// Type-safe set creation
const categories: Set<string> = products
  .pluck('category')
  .toSet()

const allTags: Set<string> = products
  .flatMap(p => p.tags)
  .toSet()
```

## Return Value

- Returns a new Set object
- Automatically removes duplicates
- Maintains type safety
- Elements maintain their original type
- Set provides O(1) lookup performance
- Elements maintain insertion order (ES2015+)

## Common Use Cases

### 1. Category Management

- Unique categories
- Attribute sets
- Tag collections
- Feature flags
- Property lists

### 2. Product Attributes

- Unique specifications
- Available options
- Color variants
- Size ranges
- Material types

### 3. Filter Options

- Unique filters
- Search facets
- Available options
- Selection criteria
- Filter values

### 4. Tag Management

- Unique tags
- Label collections
- Classification sets
- Marker groups
- Identifier lists

### 5. Metadata Management

- Unique properties
- Attribute sets
- Field collections
- Parameter lists
- Option groups

### 6. Configuration

- Unique settings
- Feature sets
- Option groups
- Parameter lists
- Flag collections

### 7. User Preferences

- Unique selections
- Setting groups
- Permission sets
- Access rights
- Feature flags

### 8. Data Validation

- Valid options
- Allowed values
- Acceptable inputs
- Valid states
- Permitted choices

### 9. Search Operations

- Unique terms
- Filter options
- Search facets
- Result grouping
- Category sets

### 10. Inventory Management

- Unique SKUs
- Location sets
- Warehouse codes
- Supplier lists
- Status options
