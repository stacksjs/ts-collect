# WhereNotIn Method

The `whereNotIn()` method filters the collection by a given key and array of values, returning a new collection with all items where the given key's value is not contained in the given array.

## Basic Syntax

```typescript
collect(items).whereNotIn(key: keyof T, values: T[K][]): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Filter excluding specific values
const users = collect([
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'editor' },
  { id: 4, role: 'user' }
])

const nonUsers = users.whereNotIn('role', ['user'])
console.log(nonUsers.all())
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
  status: 'active' | 'discontinued' | 'draft'
  price: number
}

const products = collect<Product>([
  { id: 1, category: 'electronics', status: 'active', price: 100 },
  { id: 2, category: 'books', status: 'discontinued', price: 20 },
  { id: 3, category: 'electronics', status: 'draft', price: 150 },
  { id: 4, category: 'clothing', status: 'active', price: 45 }
])

// Get products excluding specific categories
const nonElectronics = products.whereNotIn('category', ['electronics'])

// Get non-draft products
const publishedProducts = products.whereNotIn('status', ['draft'])
```

### Real-world Examples

#### Task Management

```typescript
interface Task {
  id: string
  status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
  assignee: string
  priority: number
}

class TaskManager {
  private tasks: Collection<Task>

  constructor(tasks: Task[]) {
    this.tasks = collect(tasks)
  }

  getActiveTasks(): Collection<Task> {
    return this.tasks.whereNotIn('status', ['done', 'cancelled'])
  }

  getUnassignedTasks(assignedUsers: string[]): Collection<Task> {
    return this.tasks.whereNotIn('assignee', assignedUsers)
  }

  getNonPriorityTasks(priorityLevels: number[]): Collection<Task> {
    return this.tasks.whereNotIn('priority', priorityLevels)
  }
}
```

#### User Permission System

```typescript
interface UserAccess {
  userId: string
  resource: string
  permission: 'read' | 'write' | 'admin' | 'none'
}

class AccessManager {
  private permissions: Collection<UserAccess>

  constructor(permissions: UserAccess[]) {
    this.permissions = collect(permissions)
  }

  getRestrictedUsers(resource: string, excludedPermissions: string[]): Collection<UserAccess> {
    return this.permissions
      .where('resource', resource)
      .whereNotIn('permission', excludedPermissions)
  }

  getNonAdminAccess(users: string[]): Collection<UserAccess> {
    return this.permissions
      .whereNotIn('userId', users)
      .whereNotIn('permission', ['admin'])
  }
}
```

### Advanced Usage

#### Content Moderation

```typescript
interface Content {
  id: string
  type: string
  status: 'draft' | 'pending' | 'published' | 'archived' | 'flagged'
  categories: string[]
  authorId: string
}

class ContentModerator {
  private content: Collection<Content>

  constructor(content: Content[]) {
    this.content = collect(content)
  }

  getReviewableContent(excludedStatuses: string[]): Collection<Content> {
    return this.content
      .whereNotIn('status', excludedStatuses)
  }

  getNonRestrictedContent(excludedCategories: string[]): Collection<Content> {
    return this.content.filter(item =>
      !item.categories.some(cat => excludedCategories.includes(cat))
    )
  }

  getContentExcludingAuthors(excludedAuthors: string[]): Collection<Content> {
    return this.content.whereNotIn('authorId', excludedAuthors)
  }
}
```

#### Inventory Management

```typescript
interface StockItem {
  sku: string
  location: string
  status: 'available' | 'reserved' | 'damaged' | 'sold'
  categories: string[]
}

class InventoryManager {
  private inventory: Collection<StockItem>

  constructor(inventory: StockItem[]) {
    this.inventory = collect(inventory)
  }

  getAvailableStock(excludedLocations: string[]): Collection<StockItem> {
    return this.inventory
      .whereNotIn('location', excludedLocations)
      .whereNotIn('status', ['damaged', 'sold'])
  }

  getNonRestrictedItems(restrictedCategories: string[]): Collection<StockItem> {
    return this.inventory.filter(item =>
      !item.categories.some(cat => restrictedCategories.includes(cat))
    )
  }

  getProcessableItems(excludedStatuses: string[]): Collection<StockItem> {
    return this.inventory.whereNotIn('status', excludedStatuses)
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
const active = items.whereNotIn('status', ['inactive', 'pending'])
const lowPriority = items.whereNotIn('priority', [1, 2])

// TypeScript enforces valid keys and values
// items.whereNotIn('invalid', ['value'])         // ✗ TypeScript error
// items.whereNotIn('status', ['invalid_status']) // ✗ TypeScript error
```

## Return Value

- Returns a new Collection excluding items with matching values
- Returns empty collection if all items match excluded values
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods
- Uses strict equality (===) for value comparison

## Common Use Cases

### 1. Status Filtering

- Exclude completed items
- Filter out inactive states
- Remove archived content
- Exclude specific statuses

### 2. User Management

- Filter out restricted users
- Exclude specific roles
- Remove inactive accounts
- Filter non-authorized users

### 3. Content Management

- Exclude draft content
- Filter out specific types
- Remove restricted categories
- Hide archived items

### 4. Inventory Control

- Exclude out-of-stock items
- Filter unavailable products
- Remove discontinued items
- Exclude specific locations

### 5. Access Control

- Filter out restricted access
- Exclude specific permissions
- Remove blocked users
- Filter unauthorized access

### 6. Task Management

- Exclude completed tasks
- Filter out cancelled items
- Remove specific priorities
- Exclude assigned tasks

### 7. Data Analysis

- Exclude outliers
- Filter out categories
- Remove specific types
- Exclude data ranges

### 8. Resource Management

- Exclude reserved resources
- Filter out specific types
- Remove unavailable items
- Exclude locations

### 9. Event Processing

- Exclude processed events
- Filter out specific types
- Remove cancelled events
- Exclude categories

### 10. Configuration Management

- Exclude specific settings
- Filter out environments
- Remove feature flags
- Exclude configurations
