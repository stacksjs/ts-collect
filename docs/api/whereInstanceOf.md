# whereInstanceOf Method

The `whereInstanceOf()` method filters the collection to include only items that are instances of the specified class. This is particularly useful when working with inheritance hierarchies and polymorphic collections.

## Basic Syntax

```typescript
collect(items).whereInstanceOf<U>(constructor: new (...args: any[]) => U): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Basic class hierarchy
class Product {
  constructor(public name: string) {}
}

class DigitalProduct extends Product {
  constructor(name: string, public downloadUrl: string) {
    super(name)
  }
}

class PhysicalProduct extends Product {
  constructor(name: string, public weight: number) {
    super(name)
  }
}

const products = collect([
  new DigitalProduct('E-book', 'https://example.com/book'),
  new PhysicalProduct('Chair', 10),
  new DigitalProduct('Software', 'https://example.com/software')
])

// Find digital products
const digitalProducts = products.whereInstanceOf(DigitalProduct)

// Find physical products
const physicalProducts = products.whereInstanceOf(PhysicalProduct)
```

### Working with Objects

```typescript
// Base payment class
class Payment {
  constructor(
    public id: string,
    public amount: number
  ) {}
}

// Specific payment types
class CreditCardPayment extends Payment {
  constructor(
    id: string,
    amount: number,
    public cardLast4: string
  ) {
    super(id, amount)
  }
}

class PayPalPayment extends Payment {
  constructor(
    id: string,
    amount: number,
    public email: string
  ) {
    super(id, amount)
  }
}

const payments = collect([
  new CreditCardPayment('p1', 100, '4242'),
  new PayPalPayment('p2', 200, 'user@example.com'),
  new CreditCardPayment('p3', 300, '1234')
])

// Filter by payment type
const creditCardPayments = payments.whereInstanceOf(CreditCardPayment)
const paypalPayments = payments.whereInstanceOf(PayPalPayment)
```

### Real-world Examples

#### Order System

```typescript
abstract class OrderItem {
  constructor(
    public id: string,
    public price: number
  ) {}

  abstract calculateShipping(): number
}

class PhysicalItem extends OrderItem {
  constructor(
    id: string,
    price: number,
    public weight: number,
    public dimensions: { l: number; w: number; h: number }
  ) {
    super(id, price)
  }

  calculateShipping(): number {
    return this.weight * 2 + this.dimensions.l * 0.1
  }
}

class DigitalItem extends OrderItem {
  constructor(
    id: string,
    price: number,
    public fileSize: number
  ) {
    super(id, price)
  }

  calculateShipping(): number {
    return 0
  }
}

class OrderProcessor {
  constructor(private items: Collection<OrderItem>) {}

  calculatePhysicalShipping(): number {
    return this.items
      .whereInstanceOf(PhysicalItem)
      .reduce((total, item) => total + item.calculateShipping(), 0)
  }

  getDigitalDeliveries(): Collection<DigitalItem> {
    return this.items
      .whereInstanceOf(DigitalItem)
  }

  generatePackingList(): PhysicalItem[] {
    return this.items
      .whereInstanceOf(PhysicalItem)
      .sortBy('weight', 'desc')
      .toArray()
  }
}
```

#### Content Management System

```typescript
abstract class Content {
  constructor(
    public id: string,
    public title: string,
    public createdAt: Date
  ) {}

  abstract render(): string
}

class Article extends Content {
  constructor(
    id: string,
    title: string,
    createdAt: Date,
    public body: string,
    public author: string
  ) {
    super(id, title, createdAt)
  }

  render(): string {
    return `<article><h1>${this.title}</h1><p>By ${this.author}</p>${this.body}</article>`
  }
}

class Product extends Content {
  constructor(
    id: string,
    title: string,
    createdAt: Date,
    public price: number,
    public description: string
  ) {
    super(id, title, createdAt)
  }

  render(): string {
    return `<div class="product"><h2>${this.title}</h2><p>${this.description}</p><p>$${this.price}</p></div>`
  }
}

class ContentManager {
  constructor(private content: Collection<Content>) {}

  getArticles(): Collection<Article> {
    return this.content.whereInstanceOf(Article)
  }

  getProducts(): Collection<Product> {
    return this.content.whereInstanceOf(Product)
  }

  renderArticles(): string {
    return this.getArticles()
      .map(article => article.render())
      .join('\n')
  }

  renderProducts(): string {
    return this.getProducts()
      .map(product => product.render())
      .join('\n')
  }
}
```

### Advanced Usage

#### Payment Processing System

```typescript
abstract class PaymentMethod {
  constructor(
    public id: string,
    public customerId: string
  ) {}

  abstract validate(): boolean
  abstract process(amount: number): Promise<boolean>
}

class CreditCard extends PaymentMethod {
  constructor(
    id: string,
    customerId: string,
    public cardNumber: string,
    public expiry: string
  ) {
    super(id, customerId)
  }

  validate(): boolean {
    return this.cardNumber.length === 16 && new Date(this.expiry) > new Date()
  }

  async process(amount: number): Promise<boolean> {
    // Implementation here
    return true
  }
}

class BankAccount extends PaymentMethod {
  constructor(
    id: string,
    customerId: string,
    public accountNumber: string,
    public routingNumber: string
  ) {
    super(id, customerId)
  }

  validate(): boolean {
    return this.accountNumber.length > 0 && this.routingNumber.length > 0
  }

  async process(amount: number): Promise<boolean> {
    // Implementation here
    return true
  }
}

class PaymentProcessor {
  constructor(private methods: Collection<PaymentMethod>) {}

  getValidCreditCards(): Collection<CreditCard> {
    return this.methods
      .whereInstanceOf(CreditCard)
      .filter(card => card.validate())
  }

  getValidBankAccounts(): Collection<BankAccount> {
    return this.methods
      .whereInstanceOf(BankAccount)
      .filter(account => account.validate())
  }

  async processByType(amount: number, preferredType: typeof CreditCard | typeof BankAccount): Promise<boolean> {
    const methods = this.methods
      .whereInstanceOf(preferredType)
      .filter(method => method.validate())

    if (methods.isEmpty()) return false

    return await methods.first()?.process(amount) ?? false
  }
}
```

## Type Safety

```typescript
class BaseProduct {
  constructor(public id: number) {}
}

class DigitalProduct extends BaseProduct {
  constructor(id: number, public downloadUrl: string) {
    super(id)
  }
}

class PhysicalProduct extends BaseProduct {
  constructor(id: number, public weight: number) {
    super(id)
  }
}

const products = collect([
  new DigitalProduct(1, 'http://example.com'),
  new PhysicalProduct(2, 10)
])

// Type-safe filtering
const digital: Collection<DigitalProduct> = products.whereInstanceOf(DigitalProduct)
const physical: Collection<PhysicalProduct> = products.whereInstanceOf(PhysicalProduct)

// TypeScript enforces valid constructors
// products.whereInstanceOf('invalid')  // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing only instances of the specified class
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses instanceof operator for checking
- Empty collection if no matches found

## Common Use Cases

### 1. Product Management

- Digital vs physical products
- Product type filtering
- Category specialization
- Product variants
- Product hierarchies

### 2. Payment Processing

- Payment method types
- Transaction types
- Payment providers
- Refund types
- Payment statuses

### 3. Order Management

- Order types
- Delivery methods
- Fulfillment types
- Shipping methods
- Order statuses

### 4. Content Management

- Content types
- Media types
- Document types
- Asset categories
- Content hierarchies

### 5. User Management

- User types
- Role hierarchies
- Permission classes
- Account types
- Access levels

### 6. Inventory Management

- Stock types
- Location types
- Storage units
- Asset classes
- Resource types

### 7. Service Management

- Service types
- Provider types
- Delivery methods
- Support types
- Maintenance classes

### 8. Event Handling

- Event types
- Message types
- Notification classes
- Alert categories
- Action types

### 9. Report Generation

- Report types
- Data formats
- Export types
- Analysis types
- Summary classes

### 10. Validation

- Validator types
- Rule classes
- Constraint types
- Check methods
- Verification types
