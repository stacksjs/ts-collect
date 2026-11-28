# Diff Method

Use `diff(other)` to remove all occurrences of values that appear in another array or collection. It returns a new collection with the original order and duplicates of the remaining values.

```typescript
import { collect } from 'ts-collect'

const items = collect([1, 2, 3, 1, 2])
items.diff([2, 4]).all() // [1, 3, 1]
items.diff(collect([2, 4])).all() // [1, 3, 1]
```

Object values match by reference. `NaN` matches `NaN`. Use [`diffAssoc()`](/api/diffAssoc) to compare values at corresponding positions, or [`diffUsing()`](/api/diffUsing) to supply a comparison function.
