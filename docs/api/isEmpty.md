# isEmpty Method

The `isEmpty()` method checks whether the collection contains no elements. It returns `true` if the collection is empty and `false` otherwise.

## Basic Syntax

```typescript
collect(items).isEmpty(): boolean
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const emptyArray = collect([])
console.log(emptyArray.isEmpty())  // true

const nonEmptyArray = collect([1, 2, 3])
console.log(nonEmptyArray.isEmpty())  // false

// After filtering
const filtered = collect([1, 2, 3])
  .filter(num => num > 5)
console.log(filtered.isEmpty())  // true
```

### Working with Objects

```typescript
interface Product {
  id: number
  name: string
  inStock: boolean
  price: number
}

const products = collect<Product>([
  { id: 1, name: 'Widget', inStock: true, price: 100 },
  { id: 2, name: 'Gadget', inStock: false, price: 200 }
])

// Check if any products are in stock
const inStockProducts = products.where('inStock', true)
if (!inStockProducts.isEmpty()) {
  console.log('Products available for purchase')
}

// Check if any products are under $50
const affordableProducts = products.filter(product => product.price < 50)
if (affordableProducts.isEmpty()) {
  console.log('No products under $50 available')
}
```

### Real-world Examples

#### Shopping Cart Validator

```typescript
interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
}

class CartValidator {
  private cart: Collection<CartItem>

  constructor(items: CartItem[]) {
    this.cart = collect(items)
  }

  canProceedToCheckout(): boolean {
    if (this.cart.isEmpty()) {
      throw new Error('Cannot proceed with empty cart')
    }
    return true
  }

  hasDigitalItems(): boolean {
    const digitalItems = this.cart.filter(item =>
      item.productId.startsWith('DIGITAL-')
    )
    return !digitalItems.isEmpty()
  }

  needsShipping(): boolean {
    const physicalItems = this.cart.filter(item =>
      !item.productId.startsWith('DIGITAL-')
    )
    return !physicalItems.isEmpty()
  }
}
```

#### Inventory Manager

```typescript
interface InventoryItem {
  sku: string
  quantity: number
  reorderPoint: number
  lastOrdered: Date
}

class InventoryManager {
  constructor(private inventory: Collection<InventoryItem>) {}

  needsRestock(): boolean {
    const lowStock = this.inventory.filter(item =>
      item.quantity <= item.reorderPoint
    )
    return !lowStock.isEmpty()
  }

  hasStock(sku: string): boolean {
    const item = this.inventory
      .where('sku', sku)
      .filter(item => item.quantity > 0)

    return !item.isEmpty()
  }

  getOutOfStock(): Collection<InventoryItem> {
    const outOfStock = this.inventory.filter(item =>
      item.quantity === 0
    )

    if (outOfStock.isEmpty()) {
      console.log('All items in stock')
    }

    return outOfStock
  }
}
```

### Advanced Usage

#### Order Processor

```typescript
interface Order {
  id: string
  items: CartItem[]
  status: 'pending' | 'processing' | 'completed'
  priority: boolean
}

class OrderProcessor {
  constructor(private orders: Collection<Order>) {}

  hasOrdersToProcess(): boolean {
    const pendingOrders = this.orders
      .where('status', 'pending')

    return !pendingOrders.isEmpty()
  }

  hasPriorityOrders(): boolean {
    const priorityOrders = this.orders
      .where('status', 'pending')
      .where('priority', true)

    return !priorityOrders.isEmpty()
  }

  processOrders(): void {
    if (this.orders.isEmpty()) {
      console.log('No orders to process')
      return
    }

    // Process orders...
  }
}
```

## Type Safety

```typescript
interface TypedProduct {
  id: number
  name: string
  price: number
}

const products = collect<TypedProduct>([
  { id: 1, name: 'A', price: 100 }
])

// Type-safe checks
const hasProducts: boolean = !products.isEmpty()
const hasExpensive = !products
  .filter(p => p.price > 1000)
  .isEmpty()
```

## Return Value

- Returns `true` if the collection has no elements
- Returns `false` if the collection has one or more elements
- Always returns a boolean
- Can be used in conditional statements
- Works with any collection type
- Useful for validation checks

## Common Use Cases

### 1. Cart Validation

- Check for empty cart
- Validate item presence
- Check digital items
- Verify shipping needs
- Confirm quantities

### 2. Inventory Checks

- Verify stock availability
- Check reorder needs
- Validate SKU presence
- Monitor stock levels
- Track empty locations

### 3. Order Processing

- Check pending orders
- Validate order items
- Verify processing queue
- Check priority orders
- Validate fulfillment

### 4. Search Results

- Check result presence
- Validate filter results
- Verify query matches
- Check category results
- Validate suggestions

### 5. Product Validation

- Check availability
- Verify variants
- Validate categories
- Check attributes
- Verify options

### 6. Customer Data

- Validate addresses
- Check order history
- Verify preferences
- Check subscriptions
- Validate payments

### 7. Shipping Options

- Check availability
- Verify methods
- Validate zones
- Check restrictions
- Verify carriers

### 8. Payment Processing

- Validate methods
- Check transactions
- Verify history
- Check refunds
- Validate payments

### 9. Filter Results

- Validate results
- Check matches
- Verify filters
- Validate criteria
- Check conditions

### 10. Category Management

- Check products
- Verify subcategories
- Validate hierarchy
- Check attributes
- Verify relationships
