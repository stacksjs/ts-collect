# Lower Method

The `lower()` method transforms all strings in the collection to lowercase. This method is only available on collections of strings and returns a new collection with the transformed values.

## Basic Syntax

```typescript
lower(this: CollectionOperations<string>): CollectionOperations<string>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const words = collect(['Hello', 'WORLD', 'JavaScript'])
const lowered = words.lower()

console.log(lowered.all())
// ['hello', 'world', 'javascript']
```

### Working with Mixed Case

```typescript
const tags = collect(['JavaScript', 'TypeScript', 'NODE.js'])
const normalized = tags.lower()

console.log(normalized.join(', '))
// "javascript, typescript, node.js"
```

### Real-world Example: E-commerce Search Normalization

```typescript
class SearchNormalizer {
  private keywords: Collection<string>

  constructor(keywords: string[]) {
    this.keywords = collect(keywords)
  }

  normalizeSearchTerms(): Collection<string> {
    return this.keywords
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .lower()
  }

  generateUrlKeywords(): string {
    return this.normalizeSearchTerms()
      .join('+')
  }

  generateMetaKeywords(): string {
    return this.normalizeSearchTerms()
      .join(', ')
  }
}

// Usage
const searcher = new SearchNormalizer([
  'Laptop',
  'GAMING',
  'Pro-Level',
  'HIGH Performance'
])

console.log(searcher.normalizeSearchTerms().all())
// ['laptop', 'gaming', 'pro-level', 'high performance']

console.log(searcher.generateUrlKeywords())
// 'laptop+gaming+pro-level+high+performance'
```

## Type Safety

```typescript
// Only works with string collections
const strings = collect(['Hello', 'World'])
const lowered: Collection<string> = strings.lower() // ✓ Valid

// Won't work with number collections
const numbers = collect([1, 2, 3])
// numbers.lower() // ✗ TypeScript error

// Type preservation
type StringCollection = CollectionOperations<string>
const result: StringCollection = strings.lower() // ✓ Valid
```

## Return Value

- Returns a new Collection`<string>` with lowercase values
- Original collection remains unchanged
- Maintains the order of elements
- Preserves collection chain methods
- Empty strings remain empty
- Non-string collections not supported

## Common Use Cases

### 1. Search Normalization

- Query normalization
- Keyword standardization
- Search term processing
- Filter preparation
- Tag matching

### 2. Data Standardization

- Email addresses
- Usernames
- Reference codes
- Category names
- Tag normalization

### 3. URL Generation

- Path segments
- Query parameters
- Slug generation
- Route matching
- Link normalization

### 4. Comparison Operations

- Case-insensitive matching
- String equality checks
- Data validation
- Pattern matching
- Filter operations

### 5. Data Cleaning

- Input normalization
- Text standardization
- Format consistency
- Data preparation
- Import processing
