# Extending Collections

Extend ts-collect with custom methods and functionality.

## Overview

ts-collect provides multiple ways to extend its functionality, from simple macros to full class extensions.

## Using Macros

Add methods to all collections:

```typescript
import { Collection } from 'ts-collect'

// Simple macro
Collection.macro('double', function (this: Collection<number>) {
  return this.map((n) => n * 2)
})

// Use it
const doubled = collect([1, 2, 3]).double()
// Collection([2, 4, 6])

// Macro with parameters
Collection.macro('filterByRange', function (
  this: Collection<number>,
  min: number,
  max: number
) {
  return this.filter((n) => n >= min && n <= max)
})

collect([1, 5, 10, 15, 20]).filterByRange(5, 15)
// Collection([5, 10, 15])
```

## TypeScript Type Extensions

Add type definitions for macros:

```typescript
declare module 'ts-collect' {
  interface Collection<T> {
    double(): Collection<number>
    filterByRange(min: number, max: number): Collection<number>
    toUpperCase(): Collection<string>
  }
}

// Now TypeScript knows about the methods
const result = collect([1, 2, 3]).double() // Typed correctly
```

## Custom Collection Class

Create specialized collection types:

```typescript
import { Collection } from 'ts-collect'

class UserCollection extends Collection<User> {
  active() {
    return this.filter((user) => user.active)
  }

  admins() {
    return this.filter((user) => user.role === 'admin')
  }

  byDepartment(dept: string) {
    return this.filter((user) => user.department === dept)
  }

  emailList() {
    return this.pluck('email').join(', ')
  }
}

// Factory function
function users(items: User[]): UserCollection {
  return new UserCollection(items)
}

// Usage
const activeAdmins = users(allUsers)
  .active()
  .admins()
  .emailList()
```

## Mixins

Add functionality through mixins:

```typescript
// Mixin for statistical methods
const StatsMixin = {
  variance(this: Collection<number>) {
    const mean = this.avg()
    return this.map((x) => Math.pow(x - mean, 2)).avg()
  },

  stdDev(this: Collection<number>) {
    return Math.sqrt(this.variance())
  },

  percentile(this: Collection<number>, p: number) {
    const sorted = this.sort().toArray()
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]
  },
}

// Apply mixin
Object.assign(Collection.prototype, StatsMixin)

// TypeScript declarations
declare module 'ts-collect' {
  interface Collection<T> {
    variance(): number
    stdDev(): number
    percentile(p: number): number
  }
}
```

## Plugin System

Create shareable plugins:

```typescript
interface CollectionPlugin {
  name: string
  install(Collection: typeof Collection): void
}

const ecommercePlugin: CollectionPlugin = {
  name: 'ecommerce',
  install(Collection) {
    Collection.macro('totalPrice', function (this: Collection<CartItem>) {
      return this.sum((item) => item.price * item.quantity)
    })

    Collection.macro('groupByCategory', function (this: Collection<Product>) {
      return this.groupBy('category')
    })

    Collection.macro('inStock', function (this: Collection<Product>) {
      return this.filter((p) => p.stock > 0)
    })
  },
}

// Plugin registry
function usePlugin(plugin: CollectionPlugin) {
  plugin.install(Collection)
}

usePlugin(ecommercePlugin)
```

## Domain-Specific Collections

Create collections for specific domains:

```typescript
class OrderCollection extends Collection<Order> {
  pending() {
    return this.where('status', 'pending')
  }

  totalRevenue() {
    return this.sum('total')
  }

  byCustomer(customerId: string) {
    return this.where('customerId', customerId)
  }

  lastMonth() {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    return this.filter((o) => new Date(o.createdAt) > oneMonthAgo)
  }
}
```
