# mapAsync Method

The `mapAsync()` method transforms each item in the collection using an asynchronous callback function. It returns a Promise that resolves to a new collection containing the transformed items.

## Basic Syntax

```typescript
collect(items).mapAsync<U>(callback: AsyncCallback<T, U>): Promise<Collection<Awaited<U>>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple async transformation
const items = collect([1, 2, 3])
const doubled = await items.mapAsync(async (num) => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return num * 2
})
console.log(doubled.all())  // [2, 4, 6]

// With external API
const users = collect(['user1', 'user2'])
const userDetails = await users.mapAsync(async (username) => {
  const response = await fetch(`/api/users/${username}`)
  return response.json()
})
```

### Working with Objects

```typescript
interface Product {
  id: number
  sku: string
  price: number
}

interface EnrichedProduct {
  id: number
  sku: string
  price: number
  stock: number
  details: Record<string, any>
}

const products = collect<Product>([
  { id: 1, sku: 'WIDGET-1', price: 100 },
  { id: 2, sku: 'GADGET-1', price: 200 }
])

// Enrich products with external data
const enriched = await products.mapAsync(async (product): Promise<EnrichedProduct> => {
  const [stockResponse, detailsResponse] = await Promise.all([
    fetch(`/api/stock/${product.sku}`),
    fetch(`/api/products/${product.id}/details`)
  ])

  const [stock, details] = await Promise.all([
    stockResponse.json(),
    detailsResponse.json()
  ])

  return {
    ...product,
    stock: stock.quantity,
    details
  }
})
```

### Real-world Examples

#### Price Updater Service

```typescript
interface PriceData {
  productId: string
  basePrice: number
  currency: string
}

interface UpdatedPrice {
  productId: string
  basePrice: number
  currency: string
  convertedPrices: Record<string, number>
  lastUpdated: Date
}

class PriceUpdaterService {
  constructor(
    private exchangeRateApi: string,
    private targetCurrencies: string[]
  ) {}

  async updatePrices(prices: Collection<PriceData>): Promise<Collection<UpdatedPrice>> {
    return prices.mapAsync(async (price) => {
      const rates = await this.fetchExchangeRates(price.currency)
      const convertedPrices: Record<string, number> = {}

      for (const currency of this.targetCurrencies) {
        if (currency !== price.currency) {
          convertedPrices[currency] = price.basePrice * rates[currency]
        }
      }

      return {
        ...price,
        convertedPrices,
        lastUpdated: new Date()
      }
    })
  }

  private async fetchExchangeRates(baseCurrency: string): Promise<Record<string, number>> {
    const response = await fetch(`${this.exchangeRateApi}?base=${baseCurrency}`)
    return response.json()
  }
}
```

#### Inventory Enrichment System

```typescript
interface BaseProduct {
  sku: string
  name: string
  supplierId: string
}

interface EnrichedProduct {
  sku: string
  name: string
  supplierId: string
  stock: {
    quantity: number
    location: string
    reorderPoint: number
  }
  supplier: {
    name: string
    leadTime: number
    reliability: number
  }
  pricing: {
    cost: number
    recommendedPrice: number
    competitorPrices: number[]
  }
}

class InventoryEnricher {
  constructor(
    private stockApi: string,
    private supplierApi: string,
    private pricingApi: string
  ) {}

  async enrichProducts(products: Collection<BaseProduct>): Promise<Collection<EnrichedProduct>> {
    return products.mapAsync(async (product) => {
      const [stock, supplier, pricing] = await Promise.all([
        this.fetchStock(product.sku),
        this.fetchSupplier(product.supplierId),
        this.fetchPricing(product.sku)
      ])

      return {
        ...product,
        stock,
        supplier,
        pricing
      }
    })
  }

  private async fetchStock(sku: string) {
    const response = await fetch(`${this.stockApi}/stock/${sku}`)
    return response.json()
  }

  private async fetchSupplier(supplierId: string) {
    const response = await fetch(`${this.supplierApi}/supplier/${supplierId}`)
    return response.json()
  }

  private async fetchPricing(sku: string) {
    const response = await fetch(`${this.pricingApi}/pricing/${sku}`)
    return response.json()
  }
}
```

### Advanced Usage

#### Order Processor with Rate Limiting

```typescript
interface Order {
  id: string
  items: string[]
  status: 'pending' | 'processing' | 'completed'
}

interface ProcessedOrder {
  id: string
  items: string[]
  status: 'completed'
  processedAt: Date
  shippingLabel?: string
  trackingNumber?: string
}

class OrderProcessor {
  private processingDelay = 1000 // 1 second between orders
  private maxConcurrent = 5

  async processOrders(orders: Collection<Order>): Promise<Collection<ProcessedOrder>> {
    const semaphore = new Array(this.maxConcurrent).fill(Promise.resolve())
    let currentSemaphoreIndex = 0

    return orders.mapAsync(async (order) => {
      // Wait for current semaphore slot
      await semaphore[currentSemaphoreIndex]

      // Create new promise for this slot
      const processPromise = (async () => {
        try {
          // Add processing delay
          await new Promise(resolve => setTimeout(resolve, this.processingDelay))

          // Process order
          const [shippingLabel, trackingNumber] = await Promise.all([
            this.generateShippingLabel(order),
            this.generateTrackingNumber(order)
          ])

          return {
            ...order,
            status: 'completed' as const,
            processedAt: new Date(),
            shippingLabel,
            trackingNumber
          }
        } catch (error) {
          console.error(`Error processing order ${order.id}:`, error)
          throw error
        }
      })()

      // Update semaphore slot
      semaphore[currentSemaphoreIndex] = processPromise
      currentSemaphoreIndex = (currentSemaphoreIndex + 1) % this.maxConcurrent

      return processPromise
    })
  }

  private async generateShippingLabel(order: Order): Promise<string> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return `SHIP-${order.id}`
  }

  private async generateTrackingNumber(order: Order): Promise<string> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return `TRACK-${order.id}`
  }
}
```

## Type Safety

```typescript
interface SourceData {
  id: number
  value: string
}

interface TransformedData {
  id: number
  processed: boolean
  result: number
}

const items = collect<SourceData>([
  { id: 1, value: '100' },
  { id: 2, value: '200' }
])

// Type-safe async transformation
const transformed = await items.mapAsync(async (item): Promise<TransformedData> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  return {
    id: item.id,
    processed: true,
    result: parseInt(item.value)
  }
})

// TypeScript enforces return type Promise<Collection<TransformedData>>
const result: Collection<TransformedData> = await transformed
```

## Return Value

- Returns a Promise that resolves to a new Collection
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Handles async/await operations
- Preserves order of results

## Common Use Cases

### 1. Data Enrichment

- API integrations
- External data fetching
- Content enhancement
- Detail expansion
- Information augmentation

### 2. Price Processing

- Currency conversion
- Rate calculations
- Price updates
- Cost computations
- Discount processing

### 3. Order Processing

- Status updates
- Shipping labels
- Tracking numbers
- Payment processing
- Fulfillment updates

### 4. Inventory Management

- Stock checks
- Supplier queries
- Location updates
- Availability checks
- Reorder processing

### 5. User Operations

- Profile enrichment
- Permission checks
- Preference loading
- Status updates
- Activity tracking

### 6. Content Processing

- Media processing
- Format conversion
- Data validation
- Content enrichment
- Meta data updates

### 7. Batch Operations

- Bulk updates
- Mass processing
- Batch imports
- Data migrations
- Bulk exports

### 8. Integration Operations

- API calls
- Service integration
- External validation
- Third-party updates
- System synchronization

### 9. Validation Operations

- Async validation
- External verification
- Status checking
- Compliance verification
- Rule validation

### 10. Report Generation

- Data aggregation
- Metric collection
- Status compilation
- Performance analysis
- Result accumulation
