# Flip Method

Use `flip()` to build a lookup from record values to their original field names. It combines the flipped entries into one record. It skips records that contain a value other than a string or number. When multiple entries share a value, the last entry wins.

## One record

```typescript
import { collect } from 'ts-collect'

const states = collect([{ active: 1, archived: 2 }] as const)
states.flip().all() // [{ 1: 'active', 2: 'archived' }]
```

## Multiple records

```typescript
import { collect } from 'ts-collect'

const extensions = collect([{ yaml: 'text/yaml' }, { yml: 'text/yaml' }])
extensions.flip().all() // [{ 'text/yaml': 'yml' }]
```

An empty input produces an empty collection. The input records stay unchanged.
