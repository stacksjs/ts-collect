# Take Method

The `take()` method returns a new collection with the specified number of items. When the count is positive, it takes items from the beginning; when negative, it takes items from the end.

## Basic Syntax

```typescript
collect(items).take(count: number): Collection<T>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Take from beginning
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.take(3).all()) // [1, 2, 3]

// Take from end
console.log(numbers.take(-2).all()) // [4, 5]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  score: number
}

const users = collect<User>([
  { id: 1, name: 'John', score: 85 },
  { id: 2, name: 'Jane', score: 92 },
  { id: 3, name: 'Bob', score: 78 },
  { id: 4, name: 'Alice', score: 95 }
])

// Take top 2 users by score
const topUsers = users
  .sortByDesc('score')
  .take(2)

console.log(topUsers.all())
// [
//   { id: 4, name: 'Alice', score: 95 },
//   { id: 2, name: 'Jane', score: 92 }
// ]
```

### Real-world Examples

#### Leaderboard System

```typescript
interface PlayerScore {
  playerId: string
  username: string
  score: number
  rank?: number
}

class LeaderboardManager {
  private scores: Collection<PlayerScore>

  constructor(scores: PlayerScore[]) {
    this.scores = collect(scores)
  }

  getTopPlayers(count: number): Collection<PlayerScore> {
    return this.scores
      .sortByDesc('score')
      .take(count)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }))
  }

  getBottomPlayers(count: number): Collection<PlayerScore> {
    return this.scores
      .sortBy('score')
      .take(count)
      .map((player, index) => ({
        ...player,
        rank: this.scores.count() - count + index + 1
      }))
  }
}
```

#### Recent Activity Feed

```typescript
interface Activity {
  id: string
  userId: string
  action: string
  timestamp: Date
  metadata?: Record<string, any>
}

class ActivityFeed {
  private activities: Collection<Activity>

  constructor(activities: Activity[]) {
    this.activities = collect(activities)
  }

  getRecentActivities(count: number = 10): Collection<Activity> {
    return this.activities
      .sortByDesc(activity => activity.timestamp)
      .take(count)
  }

  getUserRecentActivities(userId: string, count: number = 5): Collection<Activity> {
    return this.activities
      .filter(activity => activity.userId === userId)
      .sortByDesc(activity => activity.timestamp)
      .take(count)
  }
}
```

### Advanced Usage

#### Data Sampling System

```typescript
interface DataPoint {
  timestamp: Date
  value: number
  metadata: Record<string, any>
}

class DataSampler {
  private data: Collection<DataPoint>

  constructor(data: DataPoint[]) {
    this.data = collect(data)
  }

  getLatestSamples(count: number): Collection<DataPoint> {
    return this.data
      .sortByDesc(point => point.timestamp)
      .take(count)
  }

  getOutliers(count: number): Collection<DataPoint> {
    return this.data
      .sortByDesc(point => Math.abs(point.value))
      .take(count)
  }
}
```

#### Cache Management

```typescript
interface CacheEntry {
  key: string
  value: any
  accessCount: number
  lastAccess: Date
}

class CacheManager {
  private entries: Collection<CacheEntry>
  private capacity: number

  constructor(capacity: number) {
    this.entries = collect<CacheEntry>([])
    this.capacity = capacity
  }

  evictLeastUsed(count: number): void {
    const toEvict = this.entries
      .sortBy('accessCount')
      .take(count)
      .pluck('key')
      .all()

    this.entries = this.entries
      .filter(entry => !toEvict.includes(entry.key))
  }

  getRecentlyAccessed(count: number): Collection<CacheEntry> {
    return this.entries
      .sortByDesc(entry => entry.lastAccess)
      .take(count)
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
  { id: 2, value: 'second' },
  { id: 3, value: 'third', metadata: { important: true } }
])

// Type-safe operations
const firstTwo: Collection<TypedItem> = items.take(2)
const lastTwo: Collection<TypedItem> = items.take(-2)

// Type checking preserved in chaining
const filtered = items
  .filter(item => item.id > 1)
  .take(1)
  .map(item => item.value)
```

## Return Value

- Returns a new Collection with the specified number of items
- For positive count: takes items from the beginning
- For negative count: takes items from the end
- If count exceeds collection size, returns all items
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods

## Common Use Cases

### 1. Pagination

- Limiting result sets
- Implementing page sizes
- Managing data chunks
- Handling offsets

### 2. Leaderboards

- Showing top scores
- Displaying rankings
- Managing high scores
- Presenting standings

### 3. Recent Activity

- Showing latest items
- Managing feed entries
- Displaying updates
- Handling notifications

### 4. Data Sampling

- Taking data samples
- Managing subsets
- Handling selections
- Processing excerpts

### 5. Cache Management

- Managing capacity
- Handling evictions
- Processing entries
- Managing storage

### 6. Performance Optimization

- Limiting result sets
- Managing memory
- Optimizing queries
- Handling large datasets

### 7. UI Components

- Displaying previews
- Managing lists
- Showing summaries
- Handling views

### 8. Data Analysis

- Processing samples
- Analyzing subsets
- Managing segments
- Handling distributions

### 9. Feed Management

- Showing recent posts
- Managing updates
- Handling streams
- Processing feeds

### 10. Resource Management

- Allocating resources
- Managing quotas
- Handling limits
- Processing batches
