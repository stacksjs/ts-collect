# validate Method

The `validate()` method performs asynchronous validation of collection items against a provided schema. Returns a Promise that resolves to a validation result containing success status and any validation errors.

## Basic Syntax

```typescript
collect(items).validate(schema: ValidationSchema<T>): Promise<ValidationResult>
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
    async (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ]
}

const result = await items.validate(schema)
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
    async (value: string) => value.length > 0,
    async (value: string) => value.length <= 100
  ],
  price: [
    async (value: number) => value > 0
  ],
  stock: [
    async (value: number) => value >= 0
  ]
}

const validationResult = await products.validate(productSchema)
```

### Real-world Examples

#### Product Validator

```typescript
interface ProductData {
  sku: string
  name: string
  description: string
  price: number
  category: string
  attributes: Record<string, unknown>
}

class ProductValidator {
  constructor(
    private externalApi: string,
    private categoryList: string[]
  ) {}

  async validateProducts(
    products: Collection<ProductData>
  ): Promise<{
    validationResult: ValidationResult,
    validProducts: ProductData[],
    invalidProducts: Array<{
      product: ProductData,
      errors: string[]
    }>
  }> {
    const schema: ValidationSchema<ProductData> = {
      sku: [
        async (sku) => this.isSkuUnique(sku),
        async (sku) => /^[A-Z0-9-]{5,20}$/.test(sku)
      ],
      name: [
        async (name) => name.length >= 3 && name.length <= 100,
        async (name) => !/[<>]/.test(name)  // No HTML tags
      ],
      description: [
        async (desc) => desc.length <= 5000,
        async (desc) => this.containsValidHtml(desc)
      ],
      price: [
        async (price) => price > 0 && price < 1000000,
        async (price) => Number.isFinite(price)
      ],
      category: [
        async (category) => this.categoryList.includes(category)
      ],
      attributes: [
        async (attrs) => this.validateAttributes(attrs)
      ]
    }

    const result = await products.validate(schema)

    const validProducts = products
      .filter(product => !this.hasErrors(result.errors, product.sku))
      .toArray()

    const invalidProducts = products
      .filter(product => this.hasErrors(result.errors, product.sku))
      .map(product => ({
        product,
        errors: this.getErrorsForProduct(result.errors, product.sku)
      }))
      .toArray()

    return {
      validationResult: result,
      validProducts,
      invalidProducts
    }
  }

  private async isSkuUnique(sku: string): Promise<boolean> {
    const response = await fetch(`${this.externalApi}/check-sku/${sku}`)
    return response.json()
  }

  private containsValidHtml(text: string): boolean {
    // HTML validation logic
    return true
  }

  private async validateAttributes(
    attrs: Record<string, unknown>
  ): Promise<boolean> {
    // Attribute validation logic
    return true
  }

  private hasErrors(
    errors: Map<string, string[]>,
    sku: string
  ): boolean {
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

#### Order Validator

```typescript
interface OrderData {
  orderId: string
  customerId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddress: {
    country: string
    zipCode: string
  }
  paymentMethod: string
}

class OrderValidator {
  constructor(
    private inventoryApi: string,
    private customerApi: string,
    private shippingApi: string
  ) {}

  async validateOrders(
    orders: Collection<OrderData>
  ): Promise<ValidationResult> {
    const schema: ValidationSchema<OrderData> = {
      customerId: [
        async (id) => this.customerExists(id),
        async (id) => this.customerIsActive(id)
      ],
      items: [
        async (items) => items.length > 0,
        async (items) => this.validateOrderItems(items)
      ],
      shippingAddress: [
        async (address) => this.validateShippingAddress(address)
      ],
      paymentMethod: [
        async (method) => this.validatePaymentMethod(method)
      ]
    }

    return orders.validate(schema)
  }

  private async customerExists(id: string): Promise<boolean> {
    const response = await fetch(`${this.customerApi}/exists/${id}`)
    return response.json()
  }

  private async customerIsActive(id: string): Promise<boolean> {
    const response = await fetch(`${this.customerApi}/status/${id}`)
    const { status } = await response.json()
    return status === 'active'
  }

  private async validateOrderItems(
    items: OrderData['items']
  ): Promise<boolean> {
    const inventoryChecks = await Promise.all(
      items.map(async item => {
        const response = await fetch(
          `${this.inventoryApi}/check/${item.productId}/${item.quantity}`
        )
        return response.json()
      })
    )

    return inventoryChecks.every(check => check.available)
  }

  private async validateShippingAddress(
    address: OrderData['shippingAddress']
  ): Promise<boolean> {
    const response = await fetch(
      `${this.shippingApi}/validate-address`,
      {
        method: 'POST',
        body: JSON.stringify(address)
      }
    )
    return response.json()
  }

  private async validatePaymentMethod(method: string): Promise<boolean> {
    // Payment method validation logic
    return true
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
    async (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ],
  age: [
    async (value: number) => value >= 0 && value <= 120
  ]
}

// TypeScript enforces schema types
const result = await items.validate(schema)
```

## Return Value

```typescript
interface ValidationResult {
  isValid: boolean       // Overall validation status
  errors: Map<string, string[]>  // Map of field names to error messages
}
```

## Common Use Cases

### 1. Product Validation

- SKU validation
- Price constraints
- Stock levels
- Category rules
- Attribute validation

### 2. Order Validation

- Customer verification
- Stock availability
- Payment validation
- Shipping rules
- Price checks

### 3. Customer Data

- Contact information
- Address validation
- Account rules
- Profile requirements
- Permission checks

### 4. Inventory Management

- Stock levels
- Location validation
- Reorder rules
- Supplier checks
- Category validation

### 5. Price Validation

- Range checks
- Margin rules
- Discount validation
- Currency checks
- Tax calculations

### 6. Shipping Rules

- Address validation
- Weight limits
- Zone restrictions
- Service availability
- Cost validation

### 7. Content Validation

- Format checking
- Size limits
- Type validation
- Structure rules
- Metadata requirements

### 8. Account Validation

- Credentials
- Permissions
- Status checks
- Role requirements
- Access rules

### 9. Payment Validation

- Method verification
- Amount limits
- Currency rules
- Gateway checks
- Security validation

### 10. Business Rules

- Policy compliance
- Process rules
- Workflow validation
- Constraint checks
- Requirement validation
