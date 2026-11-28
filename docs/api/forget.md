# Forget Method

Use `forget(key)` to remove a field from each record. It returns a new collection and leaves the original records unchanged.

## Removing a record field

```typescript
import { collect } from 'ts-collect'

const settings = collect([
  { name: 'Default', theme: 'system' },
  { name: 'Evening', theme: 'dark' },
])
settings.forget('theme').all() // [{ name: 'Default' }, { name: 'Evening' }]
settings.get('theme') // 'system'
```

Use [`except()`](/api/except) to remove several fields.

## Removing an item by position

Use [`filter()`](/api/filter) and its index argument to omit a position from a sequence.

```typescript
import { collect } from 'ts-collect'

collect(['a', 'b', 'c']).filter((_, index) => index !== 1).all() // ['a', 'c']
```
