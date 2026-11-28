# Has Method

Use `has(key)` to check whether at least one record contains a field. The method checks property presence, so a field with an `undefined` value still counts as present. An empty collection returns `false`.

## Checking fields

```typescript
import { collect } from 'ts-collect'

const settings = collect<{ name: string, theme?: string, timezone?: string }>([
  { name: 'Default' },
  { name: 'Evening', theme: undefined },
])
settings.has('theme') // true
settings.has('timezone') // false
```

Pass one key at a time. Use [`get()`](/api/get) to read a field from the first record or [`contains()`](/api/contains) to look for an item value in a sequence.
