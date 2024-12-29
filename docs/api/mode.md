# Mode Method

The `mode()` method returns the most frequent value in the collection. When given a key, it returns the most frequent value of that key across all objects in the collection.

## Basic Syntax

```typescript
// Mode of array values
collect(items).mode(): T | undefined

// Mode of object property values
collect(items).mode(key: keyof T): T | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple array mode
const numbers = collect([1, 2, 2, 3, 3, 3, 4])
console.log(numbers.mode()) // 3

// Mode with objects
const ratings = collect([
  { score: 5 },
  { score: 4 },
  { score: 5 },
  { score: 3 },
  { score: 5 }
])
console.log(ratings.mode('score')) // 5
```

### Working with Objects

```typescript
interface Product {
  id: number
  category: string
  price: number
  rating: number
}

const products = collect<Product>([
  { id: 1, category: 'electronics', price: 100, rating: 4 },
  { id: 2, category: 'books', price: 20, rating: 5 },
  { id: 3, category: 'electronics', price: 150, rating: 4 },
  { id: 4, category: 'clothing', price: 50, rating: 4 }
])

// Find most common category
const popularCategory = products.mode('category') // 'electronics'

// Find most common rating
const commonRating = products.mode('rating') // 4
```

### Real-world Examples

#### Customer Behavior Analysis

```typescript
interface Purchase {
  customerId: string
  productId: string
  category: string
  amount: number
  dayOfWeek: number
}

class CustomerAnalyzer {
  private purchases: Collection<Purchase>

  constructor(purchases: Purchase[]) {
    this.purchases = collect(purchases)
  }

  getMostPopularCategory(): string | undefined {
    return this.purchases.mode('category')
  }

  getMostCommonPurchaseDay(): number | undefined {
    return this.purchases.mode('dayOfWeek')
  }

  getCustomerPreference(customerId: string): string | undefined {
    return this.purchases
      .filter(p => p.customerId === customerId)
      .mode('category')
  }
}
```

#### Vote Counter

```typescript
interface Vote {
  candidateId: string
  precinct: string
  timestamp: Date
  method: 'in-person' | 'mail' | 'electronic'
}

class VoteAnalyzer {
  private votes: Collection<Vote>

  constructor(votes: Vote[]) {
    this.votes = collect(votes)
  }

  getWinningCandidate(): string | undefined {
    return this.votes.mode('candidateId')
  }

  getMostCommonVotingMethod(): string | undefined {
    return this.votes.mode('method')
  }

  getPrecinctWinner(precinct: string): string | undefined {
    return this.votes
      .filter(vote => vote.precinct === precinct)
      .mode('candidateId')
  }
}
```

### Advanced Usage

#### Inventory Analysis

```typescript
interface InventoryMovement {
  productId: string
  location: string
  quantity: number
  action: 'in' | 'out'
  reason: string
}

class InventoryAnalyzer {
  private movements: Collection<InventoryMovement>

  constructor(movements: InventoryMovement[]) {
    this.movements = collect(movements)
  }

  getMostActiveLocation(): string | undefined {
    return this.movements.mode('location')
  }

  getMostCommonReason(): string | undefined {
    return this.movements
      .filter(m => m.action === 'out')
      .mode('reason')
  }

  getProductMostFrequentLocation(productId: string): string | undefined {
    return this.movements
      .filter(m => m.productId === productId)
      .mode('location')
  }
}
```

#### Survey Results

```typescript
interface SurveyResponse {
  respondentId: string
  question: string
  answer: string
  demographic: string
  timeSpent: number
}

class SurveyAnalyzer {
  private responses: Collection<SurveyResponse>

  constructor(responses: SurveyResponse[]) {
    this.responses = collect(responses)
  }

  getMostCommonAnswer(question: string): string | undefined {
    return this.responses
      .filter(r => r.question === question)
      .mode('answer')
  }

  getDemographicPreference(demographic: string): string | undefined {
    return this.responses
      .filter(r => r.demographic === demographic)
      .mode('answer')
  }

  getMostEngagedDemographic(): string | undefined {
    return this.responses
      .filter(r => r.timeSpent > this.responses.avg('timeSpent'))
      .mode('demographic')
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  category: string
  value: number
  optional?: string
}

const items = collect<TypedItem>([
  { id: 1, category: 'A', value: 100 },
  { id: 2, category: 'B', value: 200 },
  { id: 3, category: 'A', value: 300 }
])

// Type-safe property access
const modeCategory = items.mode('category') // ✓ Valid
const modeOptional = items.mode('optional') // ✓ Valid
// items.mode('nonexistent')                   // ✗ TypeScript error
```

## Return Value

- Returns the most frequent value in the collection
- Returns undefined for empty collections
- If multiple values have the same frequency, returns the first one
- For objects, returns most frequent value of specified property
- Maintains type safety with TypeScript
- Handles undefined/null values appropriately

## Common Use Cases

### 1. Statistical Analysis

- Finding most common values
- Analyzing frequencies
- Pattern detection
- Distribution analysis

### 2. Customer Behavior

- Popular choices
- Common preferences
- Buying patterns
- User habits

### 3. Voting Systems

- Winner determination
- Preference analysis
- Choice aggregation
- Opinion tracking

### 4. Inventory Management

- Popular items
- Common locations
- Movement patterns
- Stock analysis

### 5. Survey Analysis

- Common responses
- Popular opinions
- Response patterns
- Demographic trends

### 6. Error Analysis

- Common issues
- Frequent problems
- Error patterns
- Issue tracking

### 7. Performance Monitoring

- Common states
- Frequent conditions
- Status patterns
- System behavior

### 8. Usage Analytics

- Popular features
- Common actions
- User patterns
- Behavior analysis

### 9. Quality Control

- Common defects
- Frequent issues
- Pattern detection
- Problem analysis

### 10. Market Analysis

- Popular products
- Common prices
- Purchase patterns
- Consumer preferences
