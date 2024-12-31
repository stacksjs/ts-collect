# parse Method

The `parse()` method converts string data in JSON, CSV, or XML format into a collection. This method serves as a universal parser for common data formats, making it easy to import data from various sources into your collection.

## Basic Syntax

```typescript
parse(data: string, format: 'json' | 'csv' | 'xml'): CollectionOperations<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Parsing JSON
const jsonData = '[{"name":"Chris","age":25},{"name":"Avery","age":30}]'
const jsonCollection = collect([]).parse(jsonData, 'json')

// Parsing CSV
const csvData = 'name,age\n"Chris",25\n"Avery",30'
const csvCollection = collect([]).parse(csvData, 'csv')
```

### Working with Complex Data

```typescript
interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

const jsonProducts = `[
  {"id": 1, "name": "Laptop", "price": 999, "inStock": true},
  {"id": 2, "name": "Mouse", "price": 49, "inStock": false}
]`

const products = collect<Product>([]).parse(jsonProducts, 'json')
console.log(products.where('inStock', true).all())
```

### Real-world Example: E-commerce Data Import

```typescript
interface OrderImport {
  orderId: string
  customerName: string
  total: number
  items: string
}

class OrderImporter {
  importFromJSON(data: string): CollectionOperations<OrderImport> {
    return collect<OrderImport>([]).parse(data, 'json')
  }

  importFromCSV(data: string): CollectionOperations<OrderImport> {
    return collect<OrderImport>([]).parse(data, 'csv')
  }

  async processImport(data: string, format: 'json' | 'csv'): Promise<void> {
    const orders = collect<OrderImport>([]).parse(data, format)

    orders.each(order => {
      console.log(`Processing order ${order.orderId} for ${order.customerName}`)
      // Process order logic here
    })
  }
}

const importer = new OrderImporter()
const jsonData = `[
  {
    "orderId": "ORD-001",
    "customerName": "Chris",
    "total": 299.99,
    "items": "Laptop, Mouse"
  }
]`

importer.processImport(jsonData, 'json')
```

## Return Value

- Returns a new Collection instance containing the parsed data
- Maintains type safety with TypeScript generics
- Preserves data types when possible (numbers, booleans, etc.)
- Handles nested structures in JSON format
- Empty or invalid input returns an empty collection
- Throws error for unsupported XML format

## Common Use Cases

1. Data Import Operations
   - Importing customer data
   - Loading product catalogs
   - Processing bulk orders
   - Migrating system data

2. File Processing
   - Processing uploaded files
   - Handling exported data
   - Converting between formats
   - Batch data updates

3. API Integration
   - Processing API responses
   - Handling webhook payloads
   - Importing third-party data
   - System synchronization

4. Legacy System Integration
   - Converting legacy data formats
   - Importing historical records
   - System migration support
   - Data transformation

5. Testing and Development
   - Loading test data sets
   - Mocking API responses
   - Developing data migrations
   - Prototyping integrations
