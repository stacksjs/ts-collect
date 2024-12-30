# whereRegex Method

The `whereRegex()` method filters the collection to include items where the specified key's value matches a given regular expression. This provides more powerful and flexible pattern matching capabilities compared to `whereLike`.

## Basic Syntax

```typescript
collect(items).whereRegex(key: keyof T, regex: RegExp): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple regex matching
const items = collect([
  { code: 'ABC-123' },
  { code: 'DEF-456' },
  { code: 'ABC-789' }
])

// Find items with ABC prefix
const abcItems = items.whereRegex('code', /^ABC-/)

// Find items ending with specific numbers
const items456 = items.whereRegex('code', /456$/)
```

### Working with Objects

```typescript
interface Product {
  sku: string
  name: string
  description: string
  email: string
}

const products = collect<Product>([
  {
    sku: 'WIDGET-001',
    name: 'Basic Widget',
    description: 'Contact support@widget.com',
    email: 'info@widget.com'
  },
  {
    sku: 'GADGET-001',
    name: 'Super Gadget',
    description: 'Email sales@gadget.com',
    email: 'support@gadget.com'
  }
])

// Find products with email patterns
const emailPattern = /[a-z]+@[a-z]+\.com/
const withEmails = products.whereRegex('description', emailPattern)

// Find specific SKU patterns
const skuPattern = /^WIDGET-\d{3}$/
const widgetSkus = products.whereRegex('sku', skuPattern)
```

### Real-world Examples

#### Product Validator

```typescript
interface ProductListing {
  sku: string
  modelNumber: string
  serialNumber: string
  upc: string
  manufacturerCode: string
}

class ProductValidator {
  private readonly patterns = {
    sku: /^[A-Z]{2,4}-\d{4}$/,
    modelNumber: /^[A-Z]\d{2}-[A-Z]\d{4}$/,
    serialNumber: /^SN-\d{10}$/,
    upc: /^\d{12}$/,
    manufacturerCode: /^[A-Z]{3}\d{5}$/
  }

  constructor(private products: Collection<ProductListing>) {}

  validateSkus(): Collection<ProductListing> {
    return this.products.whereRegex('sku', this.patterns.sku)
  }

  validateModelNumbers(): Collection<ProductListing> {
    return this.products.whereRegex('modelNumber', this.patterns.modelNumber)
  }

  validateSerialNumbers(): Collection<ProductListing> {
    return this.products.whereRegex('serialNumber', this.patterns.serialNumber)
  }

  getInvalidProducts(): Collection<ProductListing> {
    const validSkus = new Set(this.validateSkus().pluck('sku'))
    return this.products.filter(p => !validSkus.has(p.sku))
  }

  getValidationReport(): Record<string, number> {
    return {
      validSkus: this.validateSkus().count(),
      validModels: this.validateModelNumbers().count(),
      validSerials: this.validateSerialNumbers().count(),
      validUpcs: this.products.whereRegex('upc', this.patterns.upc).count(),
      validMfgCodes: this.products.whereRegex('manufacturerCode', this.patterns.manufacturerCode).count()
    }
  }
}
```

#### Contact Information Validator

```typescript
interface ContactInfo {
  email: string
  phone: string
  website: string
  zipCode: string
}

class ContactValidator {
  private readonly patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?1?\d{10,}$/,
    website: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
    zipCode: /^\d{5}(-\d{4})?$/
  }

  constructor(private contacts: Collection<ContactInfo>) {}

  getValidEmails(): Collection<ContactInfo> {
    return this.contacts.whereRegex('email', this.patterns.email)
  }

  getValidPhones(): Collection<ContactInfo> {
    return this.contacts.whereRegex('phone', this.patterns.phone)
  }

  getValidWebsites(): Collection<ContactInfo> {
    return this.contacts.whereRegex('website', this.patterns.website)
  }

  getValidZipCodes(): Collection<ContactInfo> {
    return this.contacts.whereRegex('zipCode', this.patterns.zipCode)
  }

  getCompletelyValidContacts(): Collection<ContactInfo> {
    return this.contacts
      .filter(contact =>
        this.patterns.email.test(contact.email) &&
        this.patterns.phone.test(contact.phone) &&
        this.patterns.website.test(contact.website) &&
        this.patterns.zipCode.test(contact.zipCode)
      )
  }
}
```

### Advanced Usage

#### Advanced Search System

```typescript
interface SearchableItem {
  title: string
  description: string
  tags: string
  references: string
  metadata: string
}

class AdvancedSearcher {
  constructor(private items: Collection<SearchableItem>) {}

  findByTitlePattern(pattern: RegExp): Collection<SearchableItem> {
    return this.items.whereRegex('title', pattern)
  }

  findByKeywords(keywords: string[]): Collection<SearchableItem> {
    const pattern = new RegExp(keywords.join('|'), 'i')
    return this.items.whereRegex('description', pattern)
  }

  findByTagPattern(pattern: RegExp): Collection<SearchableItem> {
    return this.items.whereRegex('tags', pattern)
  }

  findByReferenceFormat(format: RegExp): Collection<SearchableItem> {
    return this.items.whereRegex('references', format)
  }

  searchMetadata(patterns: Record<string, RegExp>): Collection<SearchableItem> {
    return Object.entries(patterns).reduce(
      (results, [key, pattern]) =>
        results.whereRegex(
          key as keyof SearchableItem,
          pattern
        ),
      this.items
    )
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  sku: string
  code: string
  reference: string
}

const products = collect<TypedProduct>([
  { id: 1, sku: 'ABC123', code: 'X-001', reference: 'REF001' },
  { id: 2, sku: 'DEF456', code: 'Y-002', reference: 'REF002' }
])

// Type-safe regex matching
const skuMatch = products.whereRegex('sku', /^ABC/)
const codeMatch = products.whereRegex('code', /^X-\d{3}$/)

// TypeScript enforces valid keys
// products.whereRegex('invalid', /test/)  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection with matching items
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses RegExp.test() for matching
- Empty collection if no matches found

## Common Use Cases

### 1. Validation

- Format validation
- Pattern matching
- Code verification
- Reference checking
- Structure validation

### 2. Search Systems

- Advanced search
- Pattern matching
- Keyword finding
- Reference lookup
- Format filtering

### 3. Data Cleaning

- Format verification
- Pattern validation
- Structure checking
- Code validation
- Reference verification

### 4. Product Management

- SKU validation
- Code verification
- Reference matching
- Model numbers
- Serial numbers

### 5. Contact Information

- Email validation
- Phone formats
- Website patterns
- Postal codes
- Reference numbers

### 6. Document Management

- Reference patterns
- Code formats
- Version numbers
- File names
- Path patterns

### 7. Inventory Control

- Batch numbers
- Location codes
- Reference formats
- Serial numbers
- Asset tags

### 8. Order Processing

- Order numbers
- Reference codes
- Tracking numbers
- Customer IDs
- Invoice numbers

### 9. User Management

- Username patterns
- Password validation
- Reference codes
- Access patterns
- Permission formats

### 10. System Integration

- API keys
- Access tokens
- Reference formats
- Integration codes
- System identifiers
