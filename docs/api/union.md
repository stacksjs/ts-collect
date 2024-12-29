# union Method

The `union()` method returns a new collection containing all unique items from both the original collection and the given array or collection. It effectively combines two sets of data while removing duplicates.

## Basic Syntax

```typescript
collect(items).union(other: T[] | Collection<T>): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array union
const items1 = collect([1, 2, 3, 4])
const items2 = [3, 4, 5, 6]

const combined = items1.union(items2)
console.log(combined.all())
// [1, 2, 3, 4, 5, 6]

// Object union
const products1 = collect([
  { id: 1, name: 'Widget' },
  { id: 2, name: 'Gadget' }
])
const products2 = [
  { id: 2, name: 'Gadget' },
  { id: 3, name: 'Tool' }
]

const allProducts = products1.union(products2)
```

### Working with Objects

```typescript
interface Product {
  sku: string
  name: string
  category: string
  price: number
}

const localInventory = collect<Product>([
  { sku: 'WID-1', name: 'Widget', category: 'tools', price: 10 },
  { sku: 'GAD-1', name: 'Gadget', category: 'electronics', price: 20 }
])

const onlineInventory = [
  { sku: 'GAD-1', name: 'Gadget', category: 'electronics', price: 20 },
  { sku: 'TOL-1', name: 'Tool', category: 'tools', price: 30 }
]

// Combine inventories without duplicates
const totalInventory = localInventory.union(onlineInventory)
```

### Real-world Examples

#### Multi-Channel Inventory Manager

```typescript
interface InventoryItem {
  sku: string
  name: string
  quantity: number
  location: string
  lastUpdated: string
}

class MultiChannelInventory {
  combineInventories(
    channels: Record<string, Collection<InventoryItem>>
  ): Collection<InventoryItem> {
    let combinedInventory = collect<InventoryItem>([])

    Object.values(channels).forEach(channelInventory => {
      combinedInventory = combinedInventory.union(channelInventory.all())
    })

    return combinedInventory
  }

  mergeWarehouseStock(
    warehouses: InventoryItem[][]
  ): Collection<InventoryItem> {
    return warehouses.reduce(
      (combined, warehouse) => combined.union(warehouse),
      collect<InventoryItem>([])
    )
  }

  consolidateStockLevels(
    primary: Collection<InventoryItem>,
    secondary: InventoryItem[]
  ): Collection<InventoryItem> {
    // Combine and sum quantities for same SKUs
    const combined = primary.union(secondary)
    const quantities = new Map<string, number>()

    combined.each(item => {
      quantities.set(
        item.sku,
        (quantities.get(item.sku) || 0) + item.quantity
      )
    })

    return combined
      .unique('sku')
      .map(item => ({
        ...item,
        quantity: quantities.get(item.sku) || item.quantity
      }))
  }
}
```

#### Catalog Consolidator

```typescript
interface CatalogItem {
  id: string
  name: string
  categories: string[]
  variants: string[]
  price: number
}

class CatalogManager {
  private catalogs: Map<string, Collection<CatalogItem>>

  constructor() {
    this.catalogs = new Map()
  }

  addCatalog(name: string, items: CatalogItem[]): void {
    this.catalogs.set(name, collect(items))
  }

  getMasterCatalog(): Collection<CatalogItem> {
    let masterCatalog = collect<CatalogItem>([])

    this.catalogs.forEach(catalog => {
      masterCatalog = masterCatalog.union(catalog.all())
    })

    return masterCatalog
  }

  getConsolidatedCategories(): string[] {
    return this.getMasterCatalog()
      .flatMap(item => item.categories)
      .unique()
      .all()
  }

  getConsolidatedVariants(): string[] {
    return this.getMasterCatalog()
      .flatMap(item => item.variants)
      .unique()
      .all()
  }
}
```

### Advanced Usage

#### Multi-Store Product Manager

```typescript
interface StoreProduct {
  id: string
  name: string
  price: number
  store: string
  available: boolean
}

class MultiStoreManager {
  private storeProducts: Map<string, Collection<StoreProduct>>

  constructor() {
    this.storeProducts = new Map()
  }

  addStoreProducts(store: string, products: StoreProduct[]): void {
    this.storeProducts.set(store, collect(products))
  }

  getAvailableProducts(): Collection<StoreProduct> {
    let available = collect<StoreProduct>([])

    this.storeProducts.forEach(products => {
      available = available.union(
        products.filter(p => p.available).all()
      )
    })

    return available
  }

  getPriceRange(): { min: number; max: number } {
    const allProducts = this.getAvailableProducts()
    return {
      min: allProducts.min('price') ?? 0,
      max: allProducts.max('price') ?? 0
    }
  }

  getStoresWithProduct(productId: string): string[] {
    return Array.from(this.storeProducts.entries())
      .filter(([_, products]) =>
        products.some(p => p.id === productId)
      )
      .map(([store]) => store)
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  category: string
}

const collection1 = collect<TypedProduct>([
  { id: 1, name: 'A', category: 'X' },
  { id: 2, name: 'B', category: 'Y' }
])

const collection2: TypedProduct[] = [
  { id: 2, name: 'B', category: 'Y' },
  { id: 3, name: 'C', category: 'Z' }
]

// Type-safe union
const combined = collection1.union(collection2)

// TypeScript enforces type matching
// collection1.union([1, 2, 3])  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing unique items from both collections
- Original collections remain unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses strict equality (===) for comparison
- Preserves the original object references

## Common Use Cases

### 1. Inventory Management

- Combining warehouse inventories
- Merging store stocks
- Consolidating supplier catalogs
- Unifying product variants
- Combining storage locations

### 2. Multi-Channel Operations

- Merging online/offline inventory
- Combining marketplace listings
- Consolidating sales channels
- Unifying product feeds
- Merging store catalogs

### 3. Product Management

- Combining product categories
- Merging product attributes
- Unifying product variants
- Consolidating product tags
- Combining specifications

### 4. Supplier Integration

- Merging supplier catalogs
- Combining product lines
- Unifying pricing lists
- Consolidating offerings
- Combining availability data

### 5. Store Management

- Merging store inventories
- Combining location data
- Unifying price lists
- Consolidating store products
- Combining store catalogs

### 6. Category Management

- Merging category trees
- Combining taxonomies
- Unifying classifications
- Consolidating hierarchies
- Combining department lists

### 7. Price Management

- Combining price lists
- Merging discount rules
- Unifying promotional offers
- Consolidating pricing tiers
- Combining special prices

### 8. Stock Control

- Merging stock levels
- Combining location data
- Unifying availability info
- Consolidating stock alerts
- Combining reorder points

### 9. Order Management

- Combining order sources
- Merging shipping options
- Unifying payment methods
- Consolidating fulfillment
- Combining delivery zones

### 10. Customer Data

- Merging customer lists
- Combining preferences
- Unifying purchase history
- Consolidating segments
- Combining behavior data
