# Splice Method

The `splice()` method removes and returns a slice of items from the collection starting at the specified index. You can also replace the removed items with new items.

## Basic Syntax

```typescript
// Remove items
collect(items).splice(start: number, deleteCount?: number)

// Remove and replace items
collect(items).splice(start: number, deleteCount: number, ...items: T[])
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Remove items
const numbers = collect([1, 2, 3, 4, 5])
const removed = numbers.splice(2, 2)
console.log(removed) // [3, 4]
console.log(numbers.all()) // [1, 2, 5]

// Remove and replace items
const words = collect(['apple', 'banana', 'cherry'])
words.splice(1, 1, 'orange', 'grape')
console.log(words.all()) // ['apple', 'orange', 'grape', 'cherry']
```

### Working with Objects

```typescript
interface Task {
  id: number
  title: string
  status: string
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', status: 'pending' },
  { id: 2, title: 'Task 2', status: 'completed' },
  { id: 3, title: 'Task 3', status: 'pending' },
  { id: 4, title: 'Task 4', status: 'pending' }
])

// Remove tasks
const removedTasks = tasks.splice(1, 2)
console.log(removedTasks)
// [
//   { id: 2, title: 'Task 2', status: 'completed' },
//   { id: 3, title: 'Task 3', status: 'pending' }
// ]
```

### Real-world Examples

#### Queue Management

```typescript
interface QueueItem {
  id: string
  priority: number
  payload: any
  timestamp: Date
}

class PriorityQueue {
  private items: Collection<QueueItem>

  constructor() {
    this.items = collect<QueueItem>([])
  }

  addItems(newItems: QueueItem[]) {
    // Find position based on priority
    let insertIndex = this.items.findIndex(
      item => item.priority < newItems[0].priority
    )

    if (insertIndex === -1) {
      insertIndex = this.items.count()
    }

    this.items.splice(insertIndex, 0, ...newItems)
  }

  removeItems(count: number): QueueItem[] {
    return this.items.splice(0, count)
  }

  getItems(): QueueItem[] {
    return this.items.all()
  }
}
```

#### Playlist Manager

```typescript
interface Song {
  id: string
  title: string
  artist: string
  duration: number
}

class PlaylistManager {
  private playlist: Collection<Song>

  constructor(initialSongs: Song[] = []) {
    this.playlist = collect(initialSongs)
  }

  insertSongs(position: number, songs: Song[]) {
    this.playlist.splice(position, 0, ...songs)
  }

  replaceSongs(start: number, count: number, newSongs: Song[]) {
    return this.playlist.splice(start, count, ...newSongs)
  }

  removeSongs(start: number, count: number): Song[] {
    return this.playlist.splice(start, count)
  }

  getCurrentPlaylist(): Song[] {
    return this.playlist.all()
  }
}
```

### Advanced Usage

#### Sliding Window Buffer

```typescript
interface DataPoint {
  timestamp: Date
  value: number
  metadata?: Record<string, any>
}

class SlidingWindow {
  private buffer: Collection<DataPoint>
  private readonly maxSize: number

  constructor(maxSize: number) {
    this.buffer = collect<DataPoint>([])
    this.maxSize = maxSize
  }

  addPoints(points: DataPoint[]) {
    this.buffer.splice(0, 0, ...points)

    // Remove overflow
    if (this.buffer.count() > this.maxSize) {
      this.buffer.splice(this.maxSize)
    }
  }

  getWindow(): DataPoint[] {
    return this.buffer.all()
  }

  removeOldest(count: number): DataPoint[] {
    return this.buffer.splice(-count)
  }
}
```

#### Document Editor

```typescript
interface TextBlock {
  id: string
  content: string
  format?: {
    bold?: boolean
    italic?: boolean
    color?: string
  }
}

class DocumentEditor {
  private blocks: Collection<TextBlock>

  constructor(initialBlocks: TextBlock[] = []) {
    this.blocks = collect(initialBlocks)
  }

  insertBlocks(position: number, newBlocks: TextBlock[]) {
    this.blocks.splice(position, 0, ...newBlocks)
  }

  replaceBlocks(start: number, count: number, newBlocks: TextBlock[]) {
    return this.blocks.splice(start, count, ...newBlocks)
  }

  deleteBlocks(start: number, count: number) {
    const deletedBlocks = this.blocks.splice(start, count)
    return deletedBlocks
  }

  getContent(): TextBlock[] {
    return this.blocks.all()
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
  { id: 1, value: 'one' },
  { id: 2, value: 'two' },
  { id: 3, value: 'three' }
])

// Type-safe operations
const removed = items.splice(1, 1) // TypedItem[]

// Replace with type checking
items.splice(0, 1, { id: 4, value: 'four' } // Must match TypedItem interface
)

// TypeScript will catch type errors
// items.splice(0, 1, { id: 5 }) // ✗ Error: missing 'value' property
```

## Return Value

- Returns an array containing the removed items
- Modifies the original collection
- When replacing items:
  - Removed items are returned
  - New items are inserted at the specified position
- Maintains type safety with TypeScript
- Can be chained with other collection methods
