# Get Method

Use `get(key, defaultValue?)` to read a field from the first record in a collection. It returns the default if the collection is empty, the first record lacks the field, or the field value is `undefined`. The default is `undefined` when omitted.

## Reading a record field

```typescript
import { collect } from 'ts-collect'

const settings = collect<{ name: string, theme?: string }>([
  { name: 'Default' },
  { name: 'Evening', theme: 'dark' },
])
settings.get('name') // 'Default'
settings.get('theme') // undefined
settings.get('theme', 'system') // 'system'
```

Use [`has()`](/api/has) to check whether any record contains a field.

## Reading an item by position

Index the `items` array when you want an item at a zero-based position.

```typescript
import { collect } from 'ts-collect'

collect(['a', 'b', 'c']).items[1] // 'b'
```
