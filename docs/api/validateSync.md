# validateSync Method

The `validateSync()` method performs synchronous validation of collection items against a provided schema. Returns a validation result containing success status and any validation errors. Unlike `validate()`, this method cannot perform async operations.

## Basic Syntax

```typescript
collect(items).validateSync(schema: ValidationSchema<T>): ValidationResult
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple validation
const items = collect([
  { id: 1, email: 'test@example.com' },
  { id: 2, email: 'invalid-email' }
])

const schema = {
  email: [
    (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ]
}

const result = items.validateSync(schema)
console.log(result)
// {
//   isValid: false,
//   errors: Map {
//     'email' => ['Validation failed for email']
//   }
// }
```

### Working with Objects

```typescript
interface Product {
  id: string
  name: string
  price: number
  stock: number
}

const products = collect<Product>([
  { id: '1', name: 'Widget', price: 100, stock: 10 },
  { id: '2', name: '', price: -50, stock: -5 }
])

const productSchema = {
  name: [
    (value: string) => value.length > 0,
    (value: string) => value.length <= 100
  ],
  price: [
    (value: number) => value > 0,
    (value: number) => Number.isFinite(value)
  ],
  stock: [
    (value: number) => value >= 0,
    (value: number) => Number.isInteger(value)
  ]
}

const validationResult = products.validateSync(productSchema)
```

### Real-world Examples

#### Product Input Validator

```typescript
interface ProductInput {
  sku: string
  name: string
  description: string
  price: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  weight: number
}

class ProductInputValidator {
  private readonly rules = {
    sku: [
      (sku: string) => /^[A-Z0-9-]{5,20}$/.test(sku),
      (sku: string) => !sku.includes('--')
    ],
    name: [
      (name: string) => name.length >= 3,
      (name: string) => name.length <= 100,
      (name: string) => !/[<>]/.test(name)
    ],
    description: [
      (desc: string) => desc.length <= 5000,
      (desc: string) => !/<script>/i.test(desc)
    ],
    price: [
      (price: number) => price > 0,
      (price: number) => price < 1000000,
      (price: number) => Number.isFinite(price)
    ],
    dimensions: [
      (dims: ProductInput['dimensions']) => dims.length > 0,
      (dims: ProductInput['dimensions']) => dims.width > 0,
      (dims: ProductInput['dimensions']) => dims.height > 0,
      (dims: ProductInput['dimensions']) =>
        dims.length * dims.width * dims.height <= 1000000 // Max volume
    ],
    weight: [
      (weight: number) => weight > 0,
      (weight: number) => weight <= 1000 // Max weight in kg
    ]
  }

  validateInput(products: Collection<ProductInput>): {
    validationResult: ValidationResult,
    validProducts: ProductInput[],
    invalidProducts: Array<{
      product: ProductInput,
      errors: string[]
    }>
  } {
    const result = products.validateSync(this.rules)

    return {
      validationResult: result,
      validProducts: products
        .filter(p => !this.hasErrors(result.errors, p.sku))
        .toArray(),
      invalidProducts: products
        .filter(p => this.hasErrors(result.errors, p.sku))
        .map(p => ({
          product: p,
          errors: this.getErrorsForProduct(result.errors, p.sku)
        }))
        .toArray()
    }
  }

  private hasErrors(errors: Map<string, string[]>, sku: string): boolean {
    return Array.from(errors.keys()).some(key => key.includes(sku))
  }

  private getErrorsForProduct(
    errors: Map<string, string[]>,
    sku: string
  ): string[] {
    return Array.from(errors.entries())
      .filter(([key]) => key.includes(sku))
      .flatMap(([_, errs]) => errs)
  }
}
```

#### Form Data Validator

```typescript
interface FormData {
  name: string
  email: string
  phone: string
  message: string
  preferences: string[]
}

class ContactFormValidator {
  private readonly validationRules = {
    name: [
      (name: string) => name.length >= 2,
      (name: string) => name.length <= 50,
      (name: string) => /^[a-zA-Z\s'-]+$/.test(name)
    ],
    email: [
      (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ],
    phone: [
      (phone: string) => /^\+?[\d\s-]{10,}$/.test(phone)
    ],
    message: [
      (msg: string) => msg.length >= 10,
      (msg: string) => msg.length <= 1000,
      (msg: string) => !/<script>/i.test(msg)
    ],
    preferences: [
      (prefs: string[]) => prefs.length > 0,
      (prefs: string[]) => prefs.length <= 5,
      (prefs: string[]) => prefs.every(p => this.isValidPreference(p))
    ]
  }

  private validPreferences = new Set([
    'email', 'phone', 'sms', 'mail', 'newsletter'
  ])

  validateForms(forms: Collection<FormData>): {
    valid: FormData[]
    invalid: Array<{
      form: FormData
      errors: string[]
    }>
  } {
    const result = forms.validateSync(this.validationRules)

    return {
      valid: forms
        .filter(form => !this.hasErrors(result.errors, form.email))
        .toArray(),
      invalid: forms
        .filter(form => this.hasErrors(result.errors, form.email))
        .map(form => ({
          form,
          errors: this.getErrors(result.errors, form.email)
        }))
        .toArray()
    }
  }

  private isValidPreference(pref: string): boolean {
    return this.validPreferences.has(pref)
  }

  private hasErrors(errors: Map<string, string[]>, identifier: string): boolean {
    return Array.from(errors.keys())
      .some(key => key.includes(identifier))
  }

  private getErrors(errors: Map<string, string[]>, identifier: string): string[] {
    return Array.from(errors.entries())
      .filter(([key]) => key.includes(identifier))
      .flatMap(([_, errs]) => errs)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  email: string
  age: number
}

const items = collect<TypedItem>([
  { id: 1, email: 'test@example.com', age: 25 },
  { id: 2, email: 'invalid', age: -5 }
])

// Type-safe validation schema
const schema: ValidationSchema<TypedItem> = {
  email: [
    (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ],
  age: [
    (value: number) => value >= 0 && value <= 120
  ]
}

// TypeScript enforces schema types
const result = items.validateSync(schema)
```

## Return Value

```typescript
interface ValidationResult {
  isValid: boolean       // Overall validation status
  errors: Map<string, string[]>  // Map of field names to error messages
}
```

## Common Use Cases

### 1. Form Validation

- Input validation
- Format checking
- Required fields
- Field constraints
- Cross-field validation

### 2. Product Data

- SKU format
- Price ranges
- Weight limits
- Dimensions
- Inventory levels

### 3. User Input

- Name formats
- Email validation
- Phone numbers
- Postal codes
- Date formats

### 4. Configuration

- Setting ranges
- Format validation
- Required fields
- Type checking
- Value constraints

### 5. Business Rules

- Value ranges
- Format requirements
- Data relationships
- Constraint checks
- Logic validation

### 6. Data Import

- Format validation
- Required fields
- Value ranges
- Type checking
- Relationship validation

### 7. Search Criteria

- Query format
- Range validation
- Filter rules
- Sort parameters
- Limit checks

### 8. Export Options

- Format validation
- Field selection
- Range limits
- Type checking
- Option validation

### 9. Display Settings

- Layout options
- Color formats
- Size ranges
- Position validation
- Style checks

### 10. System Settings

- Configuration values
- Format requirements
- Range limits
- Option validation
- Type checking
