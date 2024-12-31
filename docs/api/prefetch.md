# prefetch Method

The `prefetch()` method resolves all Promise items in a collection concurrently and returns a new collection with the resolved values. This method is particularly useful when working with collections containing Promises or async data.

## Basic Syntax

```typescript
async prefetch(): Promise<CollectionOperations<Awaited<T>>>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const asyncItems = collect([
  Promise.resolve({ id: 1, name: 'Chris' }),
  Promise.resolve({ id: 2, name: 'Avery' })
])

const resolved = await asyncItems.prefetch()
console.log(resolved.all())
// [
//   { id: 1, name: 'Chris' },
//   { id: 2, name: 'Avery' }
// ]
```

### Working with Mixed Data

```typescript
interface User {
  id: number
  name: string
  data: Record<string, any>
}

async function fetchUserData(id: number): Promise<User> {
  // Simulate API call
  return { id, name: 'Chris', data: { /* ... */ } }
}

const users = collect([
  fetchUserData(1),
  { id: 2, name: 'Avery', data: {} }, // Regular object
  fetchUserData(3)
])

const prefetched = await users.prefetch()
```

### Real-world Example: E-commerce Product Loading

```typescript
interface Product {
  id: string
  name: string
  price: number
  inventory: number
}

class ProductLoader {
  private productIds: string[]

  constructor(ids: string[]) {
    this.productIds = ids
  }

  private async fetchProduct(id: string): Promise<Product> {
    // Simulate API call to fetch product details
    return {
      id,
      name: `Product ${id}`,
      price: 99.99,
      inventory: 100
    }
  }

  async loadProducts(): Promise<CollectionOperations<Product>> {
    const productPromises = collect(this.productIds)
      .map(id => this.fetchProduct(id))

    return await productPromises.prefetch()
  }
}

// Usage example
const loader = new ProductLoader(['A1', 'B2', 'C3'])
loader.loadProducts().then(products => {
  products.each(product => {
    console.log(`Loaded ${product.name} with ${product.inventory} units`)
  })
})
```

## Return Value

- Returns a Promise resolving to a new collection
- Resolves all Promise items concurrently
- Maintains non-Promise items as-is
- Preserves collection structure and methods
- Type-safe transformation of Promise types
- Handles mixed Promise and non-Promise items

## Common Use Cases

1. Data Loading
   - Fetching API data
   - Loading user profiles
   - Retrieving product details
   - Gathering analytics data

2. Resource Initialization
   - Loading configuration
   - Initializing services
   - Setting up connections
   - Preparing cache data

3. Parallel Processing
   - Processing batch operations
   - Handling multiple requests
   - Loading related resources
   - Updating multiple records

4. Integration Operations
   - Syncing external services
   - Processing webhooks
   - Loading third-party data
   - Fetching remote configs

5. State Management
   - Loading initial state
   - Prefetching user data
   - Preparing view data
   - Caching remote resources
