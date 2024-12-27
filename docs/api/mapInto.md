# MapInto Method

The `mapInto()` method creates a collection of new class instances by mapping each item into the specified class. This is particularly useful when you need to transform raw data into class instances.

## Basic Syntax

```typescript
collect(items).mapInto(constructor: new (...args: any[]) => T)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

class User {
  constructor(public name: string, public email: string) {}

  getFullInfo(): string {
    return `${this.name} (${this.email})`
  }
}

const users = collect([
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' }
]).mapInto(User)

users.each((user) => {
  console.log(user.getFullInfo())
})

// Output:
// "John Doe (john@example.com)"
// "Jane Smith (jane@example.com)"
```

### Working with Complex Classes

```typescript
class Product {
  public id: number
  public name: string
  public price: number

  constructor(data: any) {
    this.id = data.id
    this.name = data.name
    this.price = data.price
  }

  getFormattedPrice(): string {
    return `$${this.price.toFixed(2)}`
  }

  applyDiscount(percentage: number): void {
    this.price = this.price * (1 - percentage / 100)
  }
}

const products = collect([
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Mouse', price: 49.99 }
]).mapInto(Product)

products.each((product) => {
  product.applyDiscount(10)
  console.log(`${product.name}: ${product.getFormattedPrice()}`)
})
```

### Real-world Examples

#### Data Transfer Objects (DTOs)

```typescript
class UserDTO {
  public id: number
  public fullName: string
  public email: string
  private roles: string[]

  constructor(data: any) {
    this.id = data.id
    this.fullName = `${data.firstName} ${data.lastName}`.trim()
    this.email = data.email.toLowerCase()
    this.roles = data.roles || []
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role)
  }

  isAdmin(): boolean {
    return this.hasRole('admin')
  }
}

// Raw data from API
const rawUsers = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'JOHN@example.com', roles: ['user'] },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'JANE@example.com', roles: ['admin', 'user'] }
]

const userDtos = collect(rawUsers).mapInto(UserDTO)

userDtos.each((user) => {
  console.log(`${user.fullName} is admin: ${user.isAdmin()}`)
})
```

#### Entity Mapping

```typescript
class OrderItem {
  constructor(
    public productId: number,
    public quantity: number,
    public unitPrice: number
  ) {}

  getTotalPrice(): number {
    return this.quantity * this.unitPrice
  }
}

class Order {
  public id: number
  public customerId: number
  public items: OrderItem[]

  constructor(data: any) {
    this.id = data.id
    this.customerId = data.customerId
    this.items = collect(data.items).mapInto(OrderItem).all()
  }

  getTotalAmount(): number {
    return collect(this.items)
      .sum(item => item.getTotalPrice())
  }
}

const rawOrders = [
  {
    id: 1,
    customerId: 101,
    items: [
      { productId: 1, quantity: 2, unitPrice: 10 },
      { productId: 2, quantity: 1, unitPrice: 20 }
    ]
  }
]

const orders = collect(rawOrders).mapInto(Order)
orders.each((order) => {
  console.log(`Order #${order.id} total: $${order.getTotalAmount()}`)
})
```

### Advanced Usage

#### With Validation

```typescript
class ValidatedUser {
  private _email: string
  private _age: number

  constructor(data: any) {
    this.validateData(data)
    this._email = data.email
    this._age = data.age
  }

  private validateData(data: any): void {
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Invalid email')
    }
    if (!data.age || data.age < 0) {
      throw new Error('Invalid age')
    }
  }

  get email(): string { return this._email }
  get age(): number { return this._age }
}

try {
  const users = collect([
    { email: 'valid@example.com', age: 25 },
    { email: 'invalid', age: -1 }
  ]).mapInto(ValidatedUser)
}
catch (error) {
  console.error('Validation failed:', error.message)
}
```

### Type Safety

```typescript
interface IEntity {
  id: number
  created: Date
}

class BaseEntity implements IEntity {
  public id: number
  public created: Date

  constructor(data: any) {
    this.id = data.id
    this.created = new Date(data.created)
  }
}

class TypedUser extends BaseEntity {
  public name: string
  public email: string

  constructor(data: any) {
    super(data)
    this.name = data.name
    this.email = data.email
  }
}

const typedUsers = collect<Partial<TypedUser>>([
  { id: 1, name: 'John', email: 'john@example.com', created: '2024-01-01' }
]).mapInto(TypedUser)

// TypeScript ensures type safety
typedUsers.each((user) => {
  const date: Date = user.created // ✓ Valid
  const name: string = user.name // ✓ Valid
  // const invalid = user.nonexistent // ✗ TypeScript error
})
```

## Return Value

- Returns a new Collection instance containing instances of the specified class
- Each item in the collection will be an instance of the provided constructor
- Maintains type safety when used with TypeScript classes and interfaces
