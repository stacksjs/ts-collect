# whereNotNull Method

The `whereNotNull()` method filters the collection to include only items where the specified key's value is not `null` or `undefined`. This is particularly useful for finding complete records and validating data presence.

## Basic Syntax

```typescript
collect(items).whereNotNull(key: keyof T): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple not-null check
const items = collect([
  { id: 1, name: 'Widget', description: null },
  { id: 2, name: 'Gadget', description: 'A cool gadget' },
  { id: 3, name: 'Tool', description: null }
])

const withDescriptions = items.whereNotNull('description')
console.log(withDescriptions.all())
// [
//   { id: 2, name: 'Gadget', description: 'A cool gadget' }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  price: number | null
  inStock: boolean | null
  lastSold: Date | null
}

const products = collect<Product>([
  { id: 1, name: 'Widget', price: 99.99, inStock: true, lastSold: new Date() },
  { id: 2, name: 'Gadget', price: null, inStock: true, lastSold: null },
  { id: 3, name: 'Tool', price: 49.99, inStock: null, lastSold: new Date() }
])

// Find products with prices
const pricedProducts = products.whereNotNull('price')

// Find products with known stock status
const stockKnown = products.whereNotNull('inStock')

// Find products with sales history
const withSales = products.whereNotNull('lastSold')
```

### Real-world Examples

#### Product Listing Manager

```typescript
interface ListingData {
  sku: string
  name: string
  description: string | null
  price: number | null
  images: string[] | null
  specifications: Record<string, string> | null
}

class ListingManager {
  constructor(private listings: Collection<ListingData>) {}

  getPublishableListings(): Collection<ListingData> {
    return this.listings
      .whereNotNull('description')
      .whereNotNull('price')
      .whereNotNull('images')
      .whereNotNull('specifications')
  }

  getListingStatus(): {
    total: number,
    publishable: number,
    requiresWork: Collection<ListingData>
  } {
    const publishable = this.getPublishableListings()

    return {
      total: this.listings.count(),
      publishable: publishable.count(),
      requiresWork: this.listings
        .filter(listing => !publishable.pluck('sku').contains(listing.sku))
    }
  }

  getCompletionReport(): Record<string, number> {
    return {
      description: this.listings.whereNotNull('description').count(),
      price: this.listings.whereNotNull('price').count(),
      images: this.listings.whereNotNull('images').count(),
      specifications: this.listings.whereNotNull('specifications').count()
    }
  }
}
```

#### Order Tracking System

```typescript
interface OrderStatus {
  orderId: string
  processedAt: Date | null
  shippedAt: Date | null
  deliveredAt: Date | null
  trackingNumber: string | null
  estimatedDelivery: Date | null
}

class OrderTracker {
  constructor(private orders: Collection<OrderStatus>) {}

  getActiveShipments(): Collection<OrderStatus> {
    return this.orders
      .whereNotNull('shippedAt')
      .whereNotNull('trackingNumber')
      .whereNull('deliveredAt')
  }

  getTrackableOrders(): Collection<OrderStatus> {
    return this.orders
      .whereNotNull('trackingNumber')
      .whereNotNull('estimatedDelivery')
  }

  getShipmentProgress(): Record<string, number> {
    const total = this.orders.count()
    return {
      processed: this.orders.whereNotNull('processedAt').count() / total * 100,
      shipped: this.orders.whereNotNull('shippedAt').count() / total * 100,
      delivered: this.orders.whereNotNull('deliveredAt').count() / total * 100
    }
  }
}
```

### Advanced Usage

#### Customer Analysis System

```typescript
interface CustomerData {
  id: string
  email: string
  phoneNumber: string | null
  preferences: string[] | null
  lastPurchase: Date | null
  segment: string | null
}

class CustomerAnalyzer {
  constructor(private customers: Collection<CustomerData>) {}

  getMarketableCustomers(): {
    email: Collection<CustomerData>,
    phone: Collection<CustomerData>,
    both: Collection<CustomerData>
  } {
    const withEmail = this.customers.whereNotNull('email')
    const withPhone = this.customers.whereNotNull('phoneNumber')

    return {
      email: withEmail,
      phone: withPhone,
      both: withEmail.intersect(withPhone)
    }
  }

  getSegmentedCustomers(): Collection<CustomerData> {
    return this.customers
      .whereNotNull('segment')
      .whereNotNull('preferences')
  }

  getActiveCustomers(): Collection<CustomerData> {
    return this.customers
      .whereNotNull('lastPurchase')
      .filter(customer => {
        const lastPurchase = new Date(customer.lastPurchase!)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return lastPurchase >= thirtyDaysAgo
      })
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  description: string | null
  price: number | null
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', description: null, price: 100 },
  { id: 2, name: 'B', description: 'Test', price: null }
])

// Type-safe not-null checks
const withDescription = products.whereNotNull('description')
const withPrice = products.whereNotNull('price')

// TypeScript enforces valid keys and nullable types
// products.whereNotNull('name')  // ✗ TypeScript error for non-nullable field
// products.whereNotNull('invalid')  // ✗ TypeScript error for invalid key
```

## Return Value

- Returns a new Collection containing only items where the specified key is not null
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Excludes both null and undefined values
- Empty collection if no matches found

## Common Use Cases

### 1. Product Management

- Complete listings
- Valid products
- Active items
- Publishable content
- Available items

### 2. Order Processing

- Trackable shipments
- Valid orders
- Complete information
- Active deliveries
- Processable orders

### 3. Customer Management

- Valid contacts
- Complete profiles
- Active customers
- Marketable users
- Segmented customers

### 4. Inventory Control

- Available stock
- Valid items
- Active products
- Trackable inventory
- Complete records

### 5. Marketing Analysis

- Valid segments
- Complete campaigns
- Active promotions
- Trackable metrics
- Analyzable data

### 6. Data Validation

- Complete records
- Valid entries
- Active status
- Required fields
- Quality checks

### 7. Reporting

- Valid metrics
- Complete data
- Active periods
- Analyzable records
- Valid comparisons

### 8. User Management

- Active users
- Valid accounts
- Complete profiles
- Verified users
- Contactable customers

### 9. Content Management

- Published content
- Valid entries
- Complete articles
- Active listings
- Viewable items

### 10. Analytics

- Valid metrics
- Complete datasets
- Active tracking
- Analyzable periods
- Reportable data
