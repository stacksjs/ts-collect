# WhereIn Method

The `whereIn()` method filters the collection by a given key and array of values, returning a new collection with all items where the given key's value is contained in the given array.

## Basic Syntax

```typescript
collect(items).whereIn(key: keyof T, values: T[key][]): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Filter by multiple values
const users = collect([
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'editor' },
  { id: 4, role: 'user' }
])

const filtered = users.whereIn('role', ['admin', 'editor'])
console.log(filtered.all())
// [
//   { id: 1, role: 'admin' },
//   { id: 3, role: 'editor' }
// ]
```

### Working with Objects

```typescript
interface Product {
  id: number
  category: string
  status: 'available' | 'discontinued' | 'out_of_stock'
  price: number
}

const products = collect<Product>([
  { id: 1, category: 'electronics', status: 'available', price: 100 },
  { id: 2, category: 'books', status: 'discontinued', price: 20 },
  { id: 3, category: 'electronics', status: 'out_of_stock', price: 150 },
  { id: 4, category: 'clothing', status: 'available', price: 45 }
])

// Get products from specific categories
const selectedCategories = products.whereIn('category', ['electronics', 'books'])

// Get products with specific statuses
const activeProducts = products.whereIn('status', ['available', 'out_of_stock'])
```

### Real-world Examples

#### Order Processing

```typescript
interface Order {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customerId: string
  priority: number
}

class OrderProcessor {
  private orders: Collection<Order>

  constructor(orders: Order[]) {
    this.orders = collect(orders)
  }

  getActiveOrders(): Collection<Order> {
    return this.orders.whereIn('status', ['pending', 'processing', 'shipped'])
  }

  getHighPriorityOrders(): Collection<Order> {
    return this.orders.whereIn('priority', [1, 2])
  }

  getCustomerOrders(customerIds: string[]): Collection<Order> {
    return this.orders.whereIn('customerId', customerIds)
  }
}
```

#### Permission System

```typescript
interface Permission {
  userId: string
  resource: string
  access: 'read' | 'write' | 'admin' | 'none'
}

class AccessController {
  private permissions: Collection<Permission>

  constructor(permissions: Permission[]) {
    this.permissions = collect(permissions)
  }

  getResourceUsers(resource: string, accessLevels: string[]): Collection<Permission> {
    return this.permissions
      .where('resource', resource)
      .whereIn('access', accessLevels)
  }

  getUserResources(userId: string, allowedAccess: string[]): Collection<Permission> {
    return this.permissions
      .where('userId', userId)
      .whereIn('access', allowedAccess)
  }
}
```

### Advanced Usage

#### Task Management

```typescript
interface Task {
  id: string
  assignee: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 1 | 2 | 3
  tags: string[]
}

class TaskManager {
  private tasks: Collection<Task>

  constructor(tasks: Task[]) {
    this.tasks = collect(tasks)
  }

  getTasksByAssignees(assignees: string[]): Collection<Task> {
    return this.tasks.whereIn('assignee', assignees)
  }

  getActiveTasksByPriority(priorities: number[]): Collection<Task> {
    return this.tasks
      .whereIn('status', ['todo', 'in_progress', 'review'])
      .whereIn('priority', priorities)
  }

  filterByTags(requiredTags: string[]): Collection<Task> {
    return this.tasks.filter(task =>
      requiredTags.some(tag => task.tags.includes(tag))
    )
  }
}
```

#### Inventory Filter

```typescript
interface InventoryItem {
  sku: string
  warehouse: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  categories: string[]
}

class InventoryFilter {
  private inventory: Collection<InventoryItem>

  constructor(inventory: InventoryItem[]) {
    this.inventory = collect(inventory)
  }

  getItemsByWarehouses(warehouses: string[]): Collection<InventoryItem> {
    return this.inventory.whereIn('warehouse', warehouses)
  }

  getItemsByStatus(statuses: string[]): Collection<InventoryItem> {
    return this.inventory.whereIn('status', statuses)
  }

  getItemsByCategories(categories: string[]): Collection<InventoryItem> {
    return this.inventory.filter(item =>
      categories.some(category => item.categories.includes(category))
    )
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  status: 'active' | 'inactive' | 'pending'
  category: string
  priority: 1 | 2 | 3
}

const items = collect<TypedItem>([
  { id: 1, status: 'active', category: 'A', priority: 1 },
  { id: 2, status: 'inactive', category: 'B', priority: 2 },
  { id: 3, status: 'pending', category: 'C', priority: 3 }
])

// Type-safe filtering
const filtered = items.whereIn('status', ['active', 'pending'])
const highPriority = items.whereIn('priority', [1, 2])

// TypeScript enforces valid keys and values
// items.whereIn('invalid', ['value'])              // ✗ TypeScript error
// items.whereIn('status', ['invalid_status'])      // ✗ TypeScript error
```

## Return Value

- Returns a new Collection containing items with matching values
- Returns empty collection if no matches found
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses strict equality (===) for value comparison

## Common Use Cases

### 1. Status Filtering

- Multiple status selection
- State filtering
- Condition matching
- Status group filtering

### 2. Category Selection

- Multiple category filtering
- Group selection
- Type filtering
- Classification matching

### 3. User Management

- Role-based access
- Permission groups
- User type filtering
- Group membership

### 4. Order Processing

- Status filtering
- Priority levels
- Order types
- Processing stages

### 5. Resource Access

- Permission levels
- Access rights
- Resource groups
- Authorization levels

### 6. Inventory Management

- Product categories
- Stock status
- Location groups
- Item classification

### 7. Task Organization

- Status groups
- Priority levels
- Assignment groups
- Category filtering

### 8. Data Classification

- Type groups
- Category sets
- Classification sets
- Group filtering

### 9. Event Processing

- Event types
- Status groups
- Category sets
- Priority levels

### 10. Configuration Management

- Environment groups
- Feature sets
- Setting groups
- Configuration sets
