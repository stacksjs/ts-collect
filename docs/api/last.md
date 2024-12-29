# Last Method

The `last()` method retrieves the last element from the collection. When provided with a key, it returns the value of that key from the last element.

## Basic Syntax

```typescript
// Get last element
collect(items).last(): T | undefined

// Get last element's property
collect(items).last<K extends keyof T>(key: K): T[K] | undefined
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array
const numbers = collect([1, 2, 3])
console.log(numbers.last()) // 3

// Empty collection
const empty = collect([])
console.log(empty.last()) // undefined
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  lastLogin: Date
}

const users = collect<User>([
  { id: 1, name: 'John', lastLogin: new Date('2024-01-01') },
  { id: 2, name: 'Jane', lastLogin: new Date('2024-01-02') }
])

// Get last user
console.log(users.last())
// { id: 2, name: 'Jane', lastLogin: '2024-01-02' }

// Get last user's name
console.log(users.last('name')) // 'Jane'

// Get last login
console.log(users.last('lastLogin')) // Date object
```

### Real-world Examples

#### Log Manager

```typescript
interface LogEntry {
  timestamp: Date
  level: 'info' | 'warning' | 'error'
  message: string
  metadata?: Record<string, any>
}

class LogManager {
  private logs: Collection<LogEntry>

  constructor(logs: LogEntry[]) {
    this.logs = collect(logs)
  }

  getLatestLog(): LogEntry | undefined {
    return this.logs
      .sortBy('timestamp')
      .last()
  }

  getLatestErrorMessage(): string | undefined {
    return this.logs
      .filter(log => log.level === 'error')
      .sortBy('timestamp')
      .last('message')
  }
}
```

#### Version Controller

```typescript
interface Version {
  number: string
  releaseDate: Date
  changes: string[]
  stable: boolean
}

class VersionController {
  private versions: Collection<Version>

  constructor(versions: Version[]) {
    this.versions = collect(versions)
  }

  getLatestStableVersion(): Version | undefined {
    return this.versions
      .filter(version => version.stable)
      .sortBy('releaseDate')
      .last()
  }

  getLatestVersionNumber(): string | undefined {
    return this.versions
      .sortBy('releaseDate')
      .last('number')
  }
}
```

### Advanced Usage

#### Audit Trail System

```typescript
interface AuditEntry {
  id: string
  entityId: string
  action: 'create' | 'update' | 'delete'
  timestamp: Date
  changes: Record<string, any>
  user: string
}

class AuditTrailManager {
  private entries: Collection<AuditEntry>

  constructor(entries: AuditEntry[]) {
    this.entries = collect(entries)
  }

  getLatestEntityChange(entityId: string): AuditEntry | undefined {
    return this.entries
      .filter(entry => entry.entityId === entityId)
      .sortBy('timestamp')
      .last()
  }

  getLastModifiedBy(entityId: string): string | undefined {
    return this.entries
      .filter(entry => entry.entityId === entityId)
      .sortBy('timestamp')
      .last('user')
  }
}
```

#### Backup System

```typescript
interface BackupRecord {
  id: string
  filename: string
  size: number
  timestamp: Date
  status: 'pending' | 'complete' | 'failed'
}

class BackupManager {
  private backups: Collection<BackupRecord>

  constructor(backups: BackupRecord[]) {
    this.backups = collect(backups)
  }

  getLatestSuccessfulBackup(): BackupRecord | undefined {
    return this.backups
      .filter(backup => backup.status === 'complete')
      .sortBy('timestamp')
      .last()
  }

  getLatestBackupSize(): number | undefined {
    return this.backups
      .filter(backup => backup.status === 'complete')
      .sortBy('timestamp')
      .last('size')
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, value: 'first' },
  { id: 2, value: 'last', metadata: { important: true } }
])

// Type-safe property access
const id: number | undefined = items.last('id')
const value: string | undefined = items.last('value')
const metadata: Record<string, any> | undefined = items.last('metadata')

// TypeScript enforces valid property names
// items.last('nonexistent') // ✗ TypeScript error
```

## Return Value

- When called without arguments:
  - Returns the last element in the collection
  - Returns undefined if collection is empty
- When called with a key:
  - Returns the value of that key from the last element
  - Returns undefined if collection is empty or key doesn't exist
- Original collection remains unchanged
- Maintains type safety with TypeScript

## Common Use Cases

### 1. Log Management

- Getting most recent log
- Finding latest error
- Retrieving last status
- Accessing recent events

### 2. Version Control

- Finding latest version
- Getting recent changes
- Accessing last release
- Retrieving update info

### 3. Audit Trails

- Tracking last modification
- Finding recent changes
- Getting latest state
- Accessing update history

### 4. Backup Systems

- Finding latest backup
- Getting recent snapshots
- Accessing backup status
- Retrieving recovery points

### 5. User Activity

- Tracking last login
- Finding recent actions
- Getting latest status
- Accessing user history

### 6. Transaction Processing

- Getting latest transaction
- Finding recent payments
- Accessing last status
- Retrieving final state

### 7. System Monitoring

- Finding latest metrics
- Getting recent alerts
- Accessing system state
- Retrieving health status

### 8. Queue Management

- Getting last item
- Finding final entry
- Accessing queue state
- Retrieving process status

### 9. Session Handling

- Tracking last activity
- Finding recent sessions
- Getting final state
- Accessing user status

### 10. Data Analysis

- Finding latest trends
- Getting recent data
- Accessing final results
- Retrieving endpoint values
