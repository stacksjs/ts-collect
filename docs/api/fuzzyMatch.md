# fuzzyMatch Method

The `fuzzyMatch()` method filters items based on fuzzy string matching against a specified key's value. This is particularly useful for implementing search functionality that tolerates typos and approximate matches.

## Basic Syntax

```typescript
collect(items).fuzzyMatch(
  key: keyof T,
  pattern: string,
  threshold: number = 0.7
): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple fuzzy matching
const items = collect([
  { name: 'iPhone 12 Pro' },
  { name: 'iPhone 13 Pro' },
  { name: 'Samsung Galaxy' }
])

// Find matching items
const matches = items.fuzzyMatch('name', 'iphone pro', 0.7)
console.log(matches.all())
// [
//   { name: 'iPhone 12 Pro' },
//   { name: 'iPhone 13 Pro' }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  description: string
  category: string
}

const products = collect<Product>([
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Bluetooth enabled headphones',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds',
    category: 'Electronics'
  }
])

// Search products
const searchResults = products.fuzzyMatch('name', 'wireless head', 0.6)
```

### Real-world Examples

#### Product Search System

```typescript
interface SearchableProduct {
  id: string
  name: string
  brand: string
  category: string
  description: string
  tags: string[]
}

class ProductSearcher {
  constructor(
    private products: Collection<SearchableProduct>,
    private thresholds: {
      name: number
      brand: number
      description: number
    } = {
      name: 0.7,
      brand: 0.8,
      description: 0.6
    }
  ) {}

  search(query: string): Collection<SearchableProduct> {
    // Search across multiple fields with different thresholds
    const nameMatches = this.products.fuzzyMatch('name', query, this.thresholds.name)
    const brandMatches = this.products.fuzzyMatch('brand', query, this.thresholds.brand)
    const descMatches = this.products.fuzzyMatch('description', query, this.thresholds.description)

    // Combine results without duplicates
    return nameMatches
      .union(brandMatches.toArray())
      .union(descMatches.toArray())
      .sortBy('name')
  }

  findSimilarProducts(product: SearchableProduct): Collection<SearchableProduct> {
    // Find products with similar names or descriptions
    const similarNames = this.products
      .filter(p => p.id !== product.id)
      .fuzzyMatch('name', product.name, 0.6)

    const similarDesc = this.products
      .filter(p => p.id !== product.id)
      .fuzzyMatch('description', product.description, 0.5)

    return similarNames
      .union(similarDesc.toArray())
      .sortBy('name')
  }
}
```

#### Customer Support Lookup

```typescript
interface CustomerQuery {
  id: string
  subject: string
  description: string
  status: 'open' | 'closed'
  category: string
}

class SupportQueryMatcher {
  constructor(private queries: Collection<CustomerQuery>) {}

  findSimilarQueries(
    newQuery: CustomerQuery,
    options: {
      subjectThreshold?: number
      descriptionThreshold?: number
      includeResolved?: boolean
    } = {}
  ): {
    matches: Collection<CustomerQuery>
    categories: string[]
  } {
    const {
      subjectThreshold = 0.7,
      descriptionThreshold = 0.6,
      includeResolved = false
    } = options

    let activeQueries = this.queries
    if (!includeResolved) {
      activeQueries = this.queries.where('status', 'open')
    }

    // Find queries with similar subjects
    const subjectMatches = activeQueries
      .fuzzyMatch('subject', newQuery.subject, subjectThreshold)

    // Find queries with similar descriptions
    const descriptionMatches = activeQueries
      .fuzzyMatch('description', newQuery.description, descriptionThreshold)

    // Combine matches
    const allMatches = subjectMatches
      .union(descriptionMatches.toArray())
      .sortByDesc('id')

    // Get suggested categories based on matches
    const suggestedCategories = allMatches
      .pluck('category')
      .unique()
      .toArray()

    return {
      matches: allMatches,
      categories: suggestedCategories
    }
  }

  findKnowledgeBaseArticles(query: string): Collection<CustomerQuery> {
    return this.queries
      .where('status', 'closed')
      .fuzzyMatch('subject', query, 0.6)
      .sortByDesc('id')
      .take(5)
  }
}
```

### Advanced Usage

#### Address Matcher

```typescript
interface Address {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
}

class AddressMatcher {
  constructor(private addresses: Collection<Address>) {}

  findDuplicates(
    threshold: number = 0.8
  ): Array<{
    group: Address[]
    similarity: number
  }> {
    const duplicateGroups: Array<{
      group: Address[]
      similarity: number
    }> = []

    this.addresses.each(address => {
      // Find similar addresses
      const matches = this.addresses
        .filter(a => a.id !== address.id)
        .fuzzyMatch('street', address.street, threshold)
        .filter(a => this.isSameArea(address, a))

      if (matches.isNotEmpty()) {
        duplicateGroups.push({
          group: [address, ...matches.toArray()],
          similarity: threshold
        })
      }
    })

    return this.consolidateGroups(duplicateGroups)
  }

  findAddress(searchText: string): Collection<Address> {
    // Search across all address fields
    const streetMatches = this.addresses
      .fuzzyMatch('street', searchText, 0.7)

    const cityMatches = this.addresses
      .fuzzyMatch('city', searchText, 0.8)

    const stateMatches = this.addresses
      .fuzzyMatch('state', searchText, 0.9)

    return streetMatches
      .union(cityMatches.toArray())
      .union(stateMatches.toArray())
      .sortBy('street')
  }

  private isSameArea(addr1: Address, addr2: Address): boolean {
    return addr1.city === addr2.city &&
           addr1.state === addr2.state &&
           addr1.postalCode === addr2.postalCode
  }

  private consolidateGroups(
    groups: Array<{
      group: Address[]
      similarity: number
    }>
  ): Array<{
    group: Address[]
    similarity: number
  }> {
    // Consolidate overlapping groups
    return groups.reduce((acc, curr) => {
      const overlapping = acc.find(g =>
        g.group.some(addr =>
          curr.group.some(currAddr => currAddr.id === addr.id)
        )
      )

      if (overlapping) {
        overlapping.group = [...new Set([...overlapping.group, ...curr.group])]
        overlapping.similarity = Math.min(overlapping.similarity, curr.similarity)
      } else {
        acc.push(curr)
      }

      return acc
    }, [] as Array<{ group: Address[]; similarity: number }>)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  name: string
  description: string
}

const items = collect<TypedItem>([
  { id: 1, name: 'Test Item', description: 'A test item' },
  { id: 2, name: 'Another Item', description: 'Another test' }
])

// Type-safe fuzzy matching
const matches = items.fuzzyMatch('name', 'test', 0.7)

// TypeScript enforces valid keys
// items.fuzzyMatch('invalid', 'test')  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection of matching items
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other methods
- Results ordered by match quality
- Empty collection if no matches

## Common Use Cases

### 1. Product Search

- Name matching
- Description search
- Category matching
- Brand lookup
- Tag matching

### 2. Customer Support

- Query matching
- Knowledge base search
- Ticket routing
- FAQ matching
- Solution lookup

### 3. Address Validation

- Duplicate detection
- Address matching
- Location search
- Area lookup
- Postal matching

### 4. Content Search

- Title matching
- Description search
- Tag matching
- Category lookup
- Keyword search

### 5. User Lookup

- Name search
- Email matching
- Username lookup
- Profile search
- Contact matching

### 6. Error Handling

- Error matching
- Log searching
- Issue lookup
- Problem matching
- Solution finding

### 7. Data Cleaning

- Duplicate detection
- Record matching
- Entry validation
- Data normalization
- Format matching

### 8. Navigation

- Menu search
- Category matching
- Route lookup
- Link matching
- Path finding

### 9. Autocomplete

- Suggestion generation
- Term completion
- Query matching
- Search assistance
- Input helping

### 10. Reference Data

- Code lookup
- ID matching
- Reference search
- Key finding
- Value matching
