# whereNull Method

The `whereNull()` method filters the collection to include only items where the specified key's value is `null` or `undefined`. This is particularly useful for finding incomplete records or handling optional fields.

## Basic Syntax

```typescript
collect(items).whereNull(key: keyof T): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple null check
const items = collect([
  { id: 1, name: 'Widget', description: null },
  { id: 2, name: 'Gadget', description: 'A cool gadget' },
  { id: 3, name: 'Tool', description: null }
])

const missingDescriptions = items.whereNull('description')
console.log(missingDescriptions.all())
// [
//   { id: 1, name: 'Widget', description: null },
//   { id: 3, name: 'Tool', description: null }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  lastSold: Date | null
  lastRestocked: Date | null
  category: string | null
}

const products = collect<Product>([
  { id: 1, name: 'Widget', lastSold: new Date(), lastRestocked: null, category: 'tools' },
  { id: 2, name: 'Gadget', lastSold: null, lastRestocked: new Date(), category: null },
  { id: 3, name: 'Tool', lastSold: null, lastRestocked: null, category: 'tools' }
])

// Find products never sold
const neverSold = products.whereNull('lastSold')

// Find products never restocked
const neverRestocked = products.whereNull('lastRestocked')

// Find uncategorized products
const uncategorized = products.whereNull('category')
```

### Real-world Examples

#### Product Data Quality Checker

```typescript
interface ProductRecord {
  sku: string
  name: string
  description: string | null
  price: number | null
  category: string | null
  imageUrl: string | null
}

class ProductDataChecker {
  constructor(private products: Collection<ProductRecord>) {}

  getIncompleteListings(): {
    missingDescriptions: Collection<ProductRecord>,
    missingPrices: Collection<ProductRecord>,
    missingCategories: Collection<ProductRecord>,
    missingImages: Collection<ProductRecord>
  } {
    return {
      missingDescriptions: this.products.whereNull('description'),
      missingPrices: this.products.whereNull('price'),
      missingCategories: this.products.whereNull('category'),
      missingImages: this.products.whereNull('imageUrl')
    }
  }

  getCompletionStatus(): Map<string, number> {
    const total = this.products.count()
    return new Map([
      ['descriptions', (total - this.products.whereNull('description').count()) / total * 100],
      ['prices', (total - this.products.whereNull('price').count()) / total * 100],
      ['categories', (total - this.products.whereNull('category').count()) / total * 100],
      ['images', (total - this.products.whereNull('imageUrl').count()) / total * 100]
    ])
  }

  getNeedingAttention(): string[] {
    return this.products
      .filter(product =>
        [
          product.description,
          product.price,
          product.category,
          product.imageUrl
        ].filter(value => value === null).length >= 2
      )
      .pluck('sku')
      .toArray()
  }
}
```

#### Order Processing System

```typescript
interface Order {
  id: string
  customerId: string
  shippingAddress: string | null
  processedAt: Date | null
  shippedAt: Date | null
  deliveredAt: Date | null
}

class OrderProcessor {
  constructor(private orders: Collection<Order>) {}

  getUnprocessedOrders(): Collection<Order> {
    return this.orders.whereNull('processedAt')
  }

  getMissingShippingInfo(): Collection<Order> {
    return this.orders
      .whereNull('shippingAddress')
      .where('processedAt', null)
  }

  getShippingStatus(): {
    awaitingShipment: Collection<Order>,
    inTransit: Collection<Order>,
    awaitingDelivery: Collection<Order>
  } {
    return {
      awaitingShipment: this.orders
        .whereNotNull('processedAt')
        .whereNull('shippedAt'),
      inTransit: this.orders
        .whereNotNull('shippedAt')
        .whereNull('deliveredAt'),
      awaitingDelivery: this.orders
        .whereNull('deliveredAt')
    }
  }
}
```

### Advanced Usage

#### Customer Profile Analyzer

```typescript
interface CustomerProfile {
  id: string
  email: string
  phoneNumber: string | null
  birthday: Date | null
  preferences: string[] | null
  lastLoginAt: Date | null
}

class ProfileAnalyzer {
  constructor(private profiles: Collection<CustomerProfile>) {}

  getIncompleteProfiles(): {
    missingPhone: Collection<CustomerProfile>,
    missingBirthday: Collection<CustomerProfile>,
    missingPreferences: Collection<CustomerProfile>
  } {
    return {
      missingPhone: this.profiles.whereNull('phoneNumber'),
      missingBirthday: this.profiles.whereNull('birthday'),
      missingPreferences: this.profiles.whereNull('preferences')
    }
  }

  getInactiveUsers(days: number): Collection<CustomerProfile> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    return this.profiles
      .filter(profile =>
        profile.lastLoginAt === null ||
        profile.lastLoginAt < cutoff
      )
  }

  getProfileCompleteness(): Map<string, {
    complete: number,
    incomplete: number,
    percentage: number
  }> {
    const total = this.profiles.count()
    const fields = ['phoneNumber', 'birthday', 'preferences'] as const

    return new Map(
      fields.map(field => [
        field,
        {
          complete: total - this.profiles.whereNull(field).count(),
          incomplete: this.profiles.whereNull(field).count(),
          percentage: (total - this.profiles.whereNull(field).count()) / total * 100
        }
      ])
    )
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  description: string | null
  category: string | null
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', description: null, category: 'X' },
  { id: 2, name: 'B', description: 'Test', category: null }
])

// Type-safe null checks
const noDescription = products.whereNull('description')
const noCategory = products.whereNull('category')

// TypeScript enforces valid keys and nullable types
// products.whereNull('name')  // ✗ TypeScript error for non-nullable field
// products.whereNull('invalid')  // ✗ TypeScript error for invalid key
```

## Return Value

- Returns a new Collection containing only items where the specified key is null
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Considers both null and undefined as null values
- Empty collection if no matches found

## Common Use Cases

### 1. Data Quality

- Missing information
- Incomplete records
- Required fields
- Data validation
- Quality metrics

### 2. Order Processing

- Missing addresses
- Incomplete orders
- Processing status
- Shipping details
- Payment validation

### 3. Product Management

- Incomplete listings
- Missing details
- Required attributes
- Image validation
- Price verification

### 4. Customer Profiles

- Incomplete profiles
- Missing contact info
- Required preferences
- Profile completion
- Data enrichment

### 5. Inventory Management

- Missing stock levels
- Incomplete records
- Required fields
- Location data
- Supplier information

### 6. Marketing Analysis

- Missing segments
- Incomplete campaigns
- Required metrics
- Attribution data
- Response tracking

### 7. Shipping Management

- Missing addresses
- Incomplete details
- Required documentation
- Tracking information
- Delivery status

### 8. Content Management

- Missing metadata
- Incomplete descriptions
- Required fields
- Media assets
- Category information

### 9. User Management

- Incomplete profiles
- Missing permissions
- Required settings
- Account details
- Contact information

### 10. Analytics

- Missing metrics
- Incomplete data
- Required fields
- Tracking gaps
- Report validation
