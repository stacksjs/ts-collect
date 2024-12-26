# average()/avg()

Returns the average of all items in the collection.

## Basic Collection Operations

```typescript
import { collect } from 'ts-collect'

const collection = collect([1, 2, 3])

// average/avg - Calculate average of items
collection.average() // 3
collection.avg() // 3
```

## Statistical Operations

```typescript
const numbers = collect([1, 2, 3, 4, 5, 6])

numbers.avg() // 3.5
```
