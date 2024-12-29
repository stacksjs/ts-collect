# Where Method

The `where()` method filters the collection by a given key-value pair, returning a new collection with all items where the given key matches the given value.

## Basic Syntax

```typescript
collect(items).where(key: keyof T, value: T[key]): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple filtering
const users = collect([
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' }
])

const admins = users.where('role', 'admin')
console.log(admins.all())
// [
//   { name: 'John', role: 'admin' },
//   { name: 'Bob', role: 'admin' }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  category: string
  price: number
  inStock: boolean
}

const products = collect<Product>([
  { id: 1, category: 'electronics', price: 100, inStock: true },
  { id: 2, category: 'books', price: 20, inStock: false },
  { id: 3, category: 'electronics', price: 200, inStock: true }
])

// Get all electronics
const electronics = products.where('category', 'electronics')

// Get in-stock items
const available = products.where('inStock', true)
```

### Real-world Examples

#### Order Management

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  customerId: string
  total: number
  priority: boolean
}

class OrderManager {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getPendingOrders(): Collection<Order> {
    return this.orders.where('status', 'pending')
  }

  getCustomerOrders(customerId: string): Collection<Order> {
    return this.orders.where('customerId', customerId)
  }

  getPriorityOrders(): Collection<Order> {
    return this.orders.where('priority', true)
  }
}
```

#### User Authentication

```typescript
interface User {
  id: string
  email: string
  status: 'active' | 'suspended' | 'banned'
  role: string
  verified: boolean
}

class UserAuthenticator {
  private users: Collection<User>

  constructor(users: User[]) {
    this.users = collect(users)
  }

  findByEmail(email: string): User | undefined {
    return this.users.where('email', email).first()
  }

  getActiveUsers(): Collection<User> {
    return this.users.where('status', 'active')
  }

  getVerifiedUsers(): Collection<User> {
    return this.users.where('verified', true)
  }

  getUsersByRole(role: string): Collection<User> {
    return this.users.where('role', role)
  }
}
```

### Advanced Usage

#### Inventory System

```typescript
interface InventoryItem {
  sku: string
  locationId: string
  status: 'available' | 'reserved' | 'shipped'
  quantity: number
  needsRestock: boolean
}

class InventoryManager {
  private inventory: Collection<InventoryItem>

  constructor(items: InventoryItem[]) {
    this.inventory = collect(items)
  }

  getLocationInventory(locationId: string): Collection<InventoryItem> {
    return this.inventory.where('locationId', locationId)
  }

  getAvailableItems(): Collection<InventoryItem> {
    return this.inventory.where('status', 'available')
  }

  getRestockNeeded(): Collection<InventoryItem> {
    return this.inventory.where('needsRestock', true)
  }

  getReservedItems(): Collection<InventoryItem> {
    return this.inventory
      .where('status', 'reserved')
      .filter(item => item.quantity > 0)
  }
}
```

#### Permission System

```typescript
interface Permission {
  resourceId: string
  roleId: string
  access: 'read' | 'write' | 'admin'
  enabled: boolean
}

class PermissionManager {
  private permissions: Collection<Permission>

  constructor(permissions: Permission[]) {
    this.permissions = collect(permissions)
  }

  getRolePermissions(roleId: string): Collection<Permission> {
    return this.permissions
      .where('roleId', roleId)
      .where('enabled', true)
  }

  getResourceAccess(resourceId: string): Collection<Permission> {
    return this.permissions
      .where('resourceId', resourceId)
      .where('enabled', true)
  }

  getAdminPermissions(): Collection<Permission> {
    return this.permissions.where('access', 'admin')
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  status: 'active' | 'inactive'
  category: string
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, status: 'active', category: 'A' },
  { id: 2, status: 'inactive', category: 'B' },
  { id: 3, status: 'active', category: 'A' }
])

// Type-safe key-value filtering
const activeItems = items.where('status', 'active')
const categoryA = items.where('category', 'A')

// TypeScript enforces valid keys and values
// items.where('invalid', 'value')         // ✗ TypeScript error
// items.where('status', 'invalid')        // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing items matching the key-value pair
- Returns empty collection if no matches found
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Value comparison uses strict equality (===)

## Common Use Cases

### 1. Record Filtering

- Status filtering
- Category matching
- Type selection
- State filtering

### 2. User Management

- Role-based filtering
- Status checking
- Permission validation
- Account management

### 3. Status Tracking

- State monitoring
- Progress tracking
- Status filtering
- Condition checking

### 4. Inventory Control

- Stock management
- Location filtering
- Status tracking
- Availability checking

### 5. Order Processing

- Status filtering
- Priority management
- Category sorting
- Type filtering

### 6. Access Control

- Permission checking
- Role validation
- Access management
- Security filtering

### 7. Data Classification

- Category filtering
- Type matching
- Group selection
- Class filtering

### 8. Resource Management

- Status tracking
- Availability checking
- Type filtering
- State management

### 9. Event Handling

- Type filtering
- Status matching
- Category selection
- Priority management

### 10. Configuration Management

- State filtering
- Type matching
- Environment selection
- Mode filtering
