# toXML Method

The `toXML()` method serializes the collection into an XML string, with options to control field inclusion and exclusion. It automatically creates a root element `<items>` containing individual `<item>` elements for each record in the collection.

## Basic Syntax

```typescript
toXML(options: SerializationOptions = {}): string

// SerializationOptions interface
interface SerializationOptions {
  exclude?: string[]      // Fields to exclude from output
  include?: string[]      // Fields to explicitly include
}
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { name: 'Chris', email: 'chris@example.com' },
  { name: 'Avery', email: 'avery@example.com' }
])

console.log(users.toXML())
// <?xml version="1.0" encoding="UTF-8"?>
// <items>
//   <item>
//     <name>Chris</name>
//     <email>chris@example.com</email>
//   </item>
//   <item>
//     <name>Avery</name>
//     <email>avery@example.com</email>
//   </item>
// </items>
```

### Field Selection

```typescript
interface Product {
  id: number
  name: string
  price: number
  internalCode: string
  metadata: Record<string, any>
}

const products = collect<Product>([
  {
    id: 1,
    name: 'Laptop',
    price: 999,
    internalCode: 'LAP001',
    metadata: { weight: '2kg' }
  }
])

// Exclude internal fields
console.log(products.toXML({
  exclude: ['internalCode', 'metadata']
}))
// <?xml version="1.0" encoding="UTF-8"?>
// <items>
//   <item>
//     <id>1</id>
//     <name>Laptop</name>
//     <price>999</price>
//   </item>
// </items>
```

### Real-world Example: E-commerce Feed Generator

```typescript
interface ProductFeed {
  sku: string
  title: string
  price: number
  category: string
  inStock: boolean
  supplierCode: string
  internalNotes: string
}

class ProductFeedGenerator {
  private products: Collection<ProductFeed>

  constructor(products: ProductFeed[]) {
    this.products = collect(products)
  }

  generateGoogleFeed(): string {
    return this.products.toXML({
      include: ['sku', 'title', 'price', 'category', 'inStock']
    })
  }

  generateSupplierFeed(): string {
    return this.products.toXML({
      exclude: ['internalNotes']
    })
  }
}

const feedGenerator = new ProductFeedGenerator([
  {
    sku: 'LAP001',
    title: 'Professional Laptop',
    price: 1299,
    category: 'Electronics',
    inStock: true,
    supplierCode: 'SUP123',
    internalNotes: 'High demand item'
  }
])

console.log(feedGenerator.generateGoogleFeed())
```

## Return Value

- Returns a valid XML string with UTF-8 encoding declaration
- Root element `<items>` contains individual `<item>` elements
- Special characters are properly escaped in XML format
- Empty collection results in empty items container
- Maintains hierarchical data structure
- Can be parsed by standard XML parsers

## Common Use Cases

1. Product Feed Generation
   - Creating product feeds for shopping platforms
   - Generating marketplace listings
   - Building syndication feeds
   - Export for comparison sites

2. Data Exchange
   - Integration with legacy systems
   - EDI (Electronic Data Interchange)
   - B2B data sharing
   - Cross-platform synchronization

3. System Integration
   - Third-party service integration
   - ERP system feeds
   - Inventory management systems
   - CRM data exchange

4. Document Generation
   - Generating structured reports
   - Creating machine-readable documents
   - Building configuration files
   - System backups

5. Service Communication
   - Web service responses
   - API integrations
   - Data synchronization
   - Configuration exports
