# Except Method

Use `except(...keys)` to copy each record with the named fields removed. Pass the keys as separate arguments, or spread an array of keys. The result is a new collection and the original records are unchanged.

## One record

Wrap a single record in an array when calling `collect()`.

```typescript
import { collect } from 'ts-collect'

const user = collect([{ id: 1, name: 'John', email: 'john@example.com' }])
const publicFields = user.except('email')
publicFields.all() // [{ id: 1, name: 'John' }]
```

## Multiple records and keys

```typescript
import { collect } from 'ts-collect'

const users = collect([
  { id: 1, email: 'john@example.com', timezone: 'UTC' },
  { id: 2, email: 'jane@example.com', timezone: 'Europe/Paris' },
])
const fields = ['email', 'timezone'] as const
users.except(...fields).all() // [{ id: 1 }, { id: 2 }]
```

TypeScript checks the keys and removes their fields from the result type. Use [`only()`](/api/only) to specify the fields to keep, or [`forget()`](/api/forget) to remove one field.
