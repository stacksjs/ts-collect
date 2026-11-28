# Only Method

Use `only(...keys)` to keep the named fields on each record. It returns a new collection of projected records. A field missing from a record is omitted from its projection.

## One record

Wrap a single record in an array when calling `collect()`.

```typescript
import { collect } from 'ts-collect'

const user = collect([{ id: 1, name: 'John', email: 'john@example.com' }])
user.only('id', 'name').all() // [{ id: 1, name: 'John' }]
```

## Multiple records

```typescript
import { collect } from 'ts-collect'

const products = collect([
  { sku: 'A', name: 'Notebook', price: 4 },
  { sku: 'B', name: 'Pencil', price: 2 },
])
const fields = ['sku', 'price'] as const
products.only(...fields).all()
// [{ sku: 'A', price: 4 }, { sku: 'B', price: 2 }]
```

The inferred item type contains the selected fields. Use [`except()`](/api/except) to specify the fields to remove.
