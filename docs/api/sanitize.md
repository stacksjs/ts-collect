# Sanitize Method

The `sanitize()` method applies cleaning and transformation rules to specified fields in the collection.

## Basic Syntax

```typescript
sanitize(rules: Record<keyof T, (value: any) => any>): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: ' Chris ', email: 'CHRIS@example.com' }
])

const cleaned = users.sanitize({
  name: value => value.trim(),
  email: value => value.toLowerCase()
})
```

### Real-world Example: E-commerce Data Cleaning

```typescript
interface Product {
  sku: string
  name: string
  description: string
  price: number
  tags: string[]
}

class ProductSanitizer {
  private products: Collection<Product>

  constructor(products: Product[]) {
    this.products = collect(products)
  }

  cleanProducts() {
    return this.products.sanitize({
      sku: (value) => value.toUpperCase().trim(),
      name: (value) => this.cleanProductName(value),
      description: (value) => this.sanitizeHTML(value),
      price: (value) => this.normalizePrice(value),
      tags: (value) => this.normalizeTags(value)
    })
  }

  private cleanProductName(name: string): string {
    return name
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s-]/g, '')
  }

  private sanitizeHTML(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
  }

  private normalizePrice(price: number): number {
    return Math.max(0, Number(price.toFixed(2)))
  }

  private normalizeTags(tags: string[]): string[] {
    return tags
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => tag.length > 0)
      .filter((tag, index, self) => self.indexOf(tag) === index)
  }
}

// Usage
const sanitizer = new ProductSanitizer([{
  sku: ' prod-1 ',
  name: 'Gaming  Laptop ',
  description: '<p>Great laptop</p><script>alert("hack")</script>',
  price: 999.999,
  tags: ['Gaming ', 'LAPTOP', 'laptop', ' gaming']
}])

const cleanProducts = sanitizer.cleanProducts()
```

## Type Safety

```typescript
interface DataRecord {
  id: number
  text: string
  tags: string[]
}

const data = collect<DataRecord>([
  { id: 1, text: ' sample ', tags: ['TAG1', 'tag1'] }
])

// Type-safe sanitization rules
const rules: Record<keyof DataRecord, (value: any) => any> = {
  id: value => value,
  text: value => value.trim(),
  tags: value => [...new Set(value.map((t: string) => t.toLowerCase()))]
}

const cleaned = data.sanitize(rules)
```

## Return Value

- Returns new Collection with sanitized data
- Preserves original data structure
- Maintains field types
- Handles nested objects
- Processes arrays
- Type-safe transformations

## Common Use Cases

### 1. Input Sanitization

- Form data cleaning
- HTML sanitization
- SQL injection prevention
- XSS prevention
- Input normalization

### 2. Data Normalization

- Consistent formatting
- Case normalization
- Whitespace cleanup
- Value standardization
- Duplicate removal

### 3. Data Quality

- Format consistency
- Value cleaning
- Error correction
- Data standardization
- Validation prep

### 4. Type Conversion

- Number formatting
- Date normalization
- Boolean conversion
- String cleaning
- Array deduplication

### 5. Security

- Input escape
- HTML sanitization
- Script removal
- Path sanitization
- Command escape
