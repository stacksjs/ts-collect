# symmetricDiff Method

The `symmetricDiff()` method returns a new collection containing items that exist in either the original collection or the provided collection, but not in both. This is also known as the symmetric difference or disjunctive union.

## Basic Syntax

```typescript
collect(items).symmetricDiff<U = T>(other: U[] | Collection<U>): Collection<T | U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple symmetric difference
const set1 = collect([1, 2, 3, 4])
const set2 = [3, 4, 5, 6]
const diff = set1.symmetricDiff(set2)
console.log(diff.all())  // [1, 2, 5, 6]

// With strings
const tags1 = collect(['new', 'sale', 'featured'])
const tags2 = ['sale', 'clearance', 'featured']
const uniqueTags = tags1.symmetricDiff(tags2)
console.log(uniqueTags.all())  // ['new', 'clearance']
```

### Working with Objects

```typescript
interface Product {
  id: string
  sku: string
  name: string
}

const catalog1 = collect<Product>([
  { id: '1', sku: 'WIDGET-1', name: 'Widget' },
  { id: '2', sku: 'GADGET-1', name: 'Gadget' }
])

const catalog2 = [
  { id: '2', sku: 'GADGET-1', name: 'Gadget' },
  { id: '3', sku: 'TOOL-1', name: 'Tool' }
]

// Find unique products in each catalog
const uniqueProducts = catalog1.symmetricDiff(catalog2)
```

### Real-world Examples

#### Inventory Comparison System

```typescript
interface InventoryItem {
  sku: string
  warehouse: string
  quantity: number
  lastUpdated: Date
}

class InventoryComparer {
  compareWarehouses(
    warehouse1: Collection<InventoryItem>,
    warehouse2: Collection<InventoryItem>
  ): {
    uniqueItems: Collection<InventoryItem>
    summary: {
      onlyInWarehouse1: number
      onlyInWarehouse2: number
      different: InventoryItem[]
    }
  } {
    const uniqueItems = warehouse1.symmetricDiff(warehouse2)

    return {
      uniqueItems,
      summary: {
        onlyInWarehouse1: warehouse1
          .filter(item => !warehouse2.pluck('sku').contains(item.sku))
          .count(),
        onlyInWarehouse2: warehouse2
          .filter(item => !warehouse1.pluck('sku').contains(item.sku))
          .count(),
        different: this.findDifferentQuantities(warehouse1, warehouse2)
      }
    }
  }

  private findDifferentQuantities(
    warehouse1: Collection<InventoryItem>,
    warehouse2: Collection<InventoryItem>
  ): InventoryItem[] {
    const commonSkus = warehouse1
      .pluck('sku')
      .intersect(warehouse2.pluck('sku'))
      .toArray()

    return commonSkus
      .filter(sku => {
        const qty1 = warehouse1.firstWhere('sku', sku)?.quantity
        const qty2 = warehouse2.firstWhere('sku', sku)?.quantity
        return qty1 !== qty2
      })
      .map(sku => warehouse1.firstWhere('sku', sku)!)
  }
}
```

#### Catalog Change Detector

```typescript
interface CatalogItem {
  id: string
  name: string
  category: string
  price: number
  status: 'active' | 'discontinued'
}

class CatalogChangeDetector {
  detectChanges(
    oldCatalog: Collection<CatalogItem>,
    newCatalog: Collection<CatalogItem>
  ): {
    changes: Collection<CatalogItem>
    summary: {
      added: CatalogItem[]
      removed: CatalogItem[]
      priceChanges: Array<{
        id: string
        oldPrice: number
        newPrice: number
      }>
      statusChanges: Array<{
        id: string
        oldStatus: 'active' | 'discontinued'
        newStatus: 'active' | 'discontinued'
      }>
    }
  } {
    const changes = oldCatalog.symmetricDiff(newCatalog)

    const added = newCatalog
      .filter(item => !oldCatalog.pluck('id').contains(item.id))
      .toArray()

    const removed = oldCatalog
      .filter(item => !newCatalog.pluck('id').contains(item.id))
      .toArray()

    const commonItems = oldCatalog
      .filter(item => newCatalog.pluck('id').contains(item.id))

    const priceChanges = commonItems
      .filter(oldItem => {
        const newItem = newCatalog.firstWhere('id', oldItem.id)
        return newItem && newItem.price !== oldItem.price
      })
      .map(oldItem => {
        const newItem = newCatalog.firstWhere('id', oldItem.id)!
        return {
          id: oldItem.id,
          oldPrice: oldItem.price,
          newPrice: newItem.price
        }
      })
      .toArray()

    const statusChanges = commonItems
      .filter(oldItem => {
        const newItem = newCatalog.firstWhere('id', oldItem.id)
        return newItem && newItem.status !== oldItem.status
      })
      .map(oldItem => {
        const newItem = newCatalog.firstWhere('id', oldItem.id)!
        return {
          id: oldItem.id,
          oldStatus: oldItem.status,
          newStatus: newItem.status
        }
      })
      .toArray()

    return {
      changes,
      summary: {
        added,
        removed,
        priceChanges,
        statusChanges
      }
    }
  }
}
```

### Advanced Usage

#### Menu Sync System

```typescript
interface MenuItem {
  id: string
  name: string
  price: number
  available: boolean
  modifiers: string[]
}

class MenuSyncManager {
  compareLocations(
    location1: Collection<MenuItem>,
    location2: Collection<MenuItem>
  ): {
    differences: Collection<MenuItem>
    report: {
      uniqueToLocation1: MenuItem[]
      uniqueToLocation2: MenuItem[]
      priceDifferences: Array<{
        id: string
        location1Price: number
        location2Price: number
        difference: number
      }>
      availabilityDifferences: Array<{
        id: string
        name: string
        location1Available: boolean
        location2Available: boolean
      }>
      modifierDifferences: Array<{
        id: string
        name: string
        location1Modifiers: string[]
        location2Modifiers: string[]
      }>
    }
  } {
    const differences = location1.symmetricDiff(location2)

    const commonItems = location1
      .filter(item => location2.pluck('id').contains(item.id))

    return {
      differences,
      report: {
        uniqueToLocation1: location1
          .filter(item => !location2.pluck('id').contains(item.id))
          .toArray(),
        uniqueToLocation2: location2
          .filter(item => !location1.pluck('id').contains(item.id))
          .toArray(),
        priceDifferences: this.findPriceDifferences(commonItems, location2),
        availabilityDifferences: this.findAvailabilityDifferences(commonItems, location2),
        modifierDifferences: this.findModifierDifferences(commonItems, location2)
      }
    }
  }

  private findPriceDifferences(
    items1: Collection<MenuItem>,
    items2: Collection<MenuItem>
  ) {
    return items1
      .filter(item1 => {
        const item2 = items2.firstWhere('id', item1.id)
        return item2 && item2.price !== item1.price
      })
      .map(item1 => {
        const item2 = items2.firstWhere('id', item1.id)!
        return {
          id: item1.id,
          location1Price: item1.price,
          location2Price: item2.price,
          difference: item2.price - item1.price
        }
      })
      .toArray()
  }

  private findAvailabilityDifferences(
    items1: Collection<MenuItem>,
    items2: Collection<MenuItem>
  ) {
    return items1
      .filter(item1 => {
        const item2 = items2.firstWhere('id', item1.id)
        return item2 && item2.available !== item1.available
      })
      .map(item1 => {
        const item2 = items2.firstWhere('id', item1.id)!
        return {
          id: item1.id,
          name: item1.name,
          location1Available: item1.available,
          location2Available: item2.available
        }
      })
      .toArray()
  }

  private findModifierDifferences(
    items1: Collection<MenuItem>,
    items2: Collection<MenuItem>
  ) {
    return items1
      .filter(item1 => {
        const item2 = items2.firstWhere('id', item1.id)
        return item2 && !this.arraysEqual(item1.modifiers, item2.modifiers)
      })
      .map(item1 => {
        const item2 = items2.firstWhere('id', item1.id)!
        return {
          id: item1.id,
          name: item1.name,
          location1Modifiers: item1.modifiers,
          location2Modifiers: item2.modifiers
        }
      })
      .toArray()
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length &&
           a.every((val, index) => val === b[index])
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

const set1 = collect<TypedItem>([
  { id: 1, value: 'A' },
  { id: 2, value: 'B' }
])

const set2: TypedItem[] = [
  { id: 2, value: 'B' },
  { id: 3, value: 'C' }
]

// Type-safe symmetric difference
const diff: Collection<TypedItem> = set1.symmetricDiff(set2)
```

## Return Value

- Returns a new Collection with items unique to each set
- Original collections remain unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses strict equality (===) for comparison
- Empty collection if sets are identical

## Common Use Cases

### 1. Inventory Management

- Stock differences
- Location comparisons
- Supplier catalogs
- Warehouse sync
- Stock transfers

### 2. Catalog Management

- Product updates
- Price changes
- Category changes
- Feature changes
- Availability updates

### 3. Menu Management

- Location differences
- Price variations
- Availability changes
- Modifier updates
- Special offerings

### 4. Order Processing

- Status changes
- Fulfillment differences
- Shipping variations
- Payment discrepancies
- Item changes

### 5. Customer Data

- Profile changes
- Preference updates
- Setting differences
- Access changes
- Status updates

### 6. Price Management

- Rate differences
- Discount variations
- Promotion changes
- Special pricing
- Regional differences

### 7. Feature Management

- Access differences
- Permission changes
- Role variations
- Setting updates
- Configuration changes

### 8. Content Management

- Version differences
- Update tracking
- Change detection
- Content sync
- Publication status

### 9. Data Synchronization

- System differences
- Integration sync
- Data migration
- Change tracking
- Update detection

### 10. Report Generation

- Change reports
- Difference analysis
- Variation tracking
- Update summaries
- Sync status
