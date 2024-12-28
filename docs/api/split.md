# Split Method

The `split(numberOfGroups: number)` method breaks the collection into the specified number of groups. It attempts to divide the items as evenly as possible among the groups.

## Basic Syntax

```typescript
collect(items).split(numberOfGroups: number)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Split numbers into groups
const numbers = collect([1, 2, 3, 4, 5, 6])
const groups = numbers.split(3)
console.log(groups.all())
// [
//   [1, 2],
//   [3, 4],
//   [5, 6]
// ]

// Uneven split
const letters = collect(['a', 'b', 'c', 'd', 'e'])
console.log(letters.split(3).all())
// [
//   ['a', 'b'],
//   ['c', 'd'],
//   ['e']
// ]
```

### Working with Objects

```typescript
interface Task {
  id: number
  title: string
  priority: number
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', priority: 1 },
  { id: 2, title: 'Task 2', priority: 2 },
  { id: 3, title: 'Task 3', priority: 3 },
  { id: 4, title: 'Task 4', priority: 4 }
])

const taskGroups = tasks.split(2)
console.log(taskGroups.all())
// [
//   [
//     { id: 1, title: 'Task 1', priority: 1 },
//     { id: 2, title: 'Task 2', priority: 2 }
//   ],
//   [
//     { id: 3, title: 'Task 3', priority: 3 },
//     { id: 4, title: 'Task 4', priority: 4 }
//   ]
// ]
```

### Real-world Examples

#### Workload Distribution

```typescript
interface WorkItem {
  id: string
  type: string
  estimatedTime: number
  priority: number
}

class WorkloadDistributor {
  private items: Collection<WorkItem>

  constructor(items: WorkItem[]) {
    this.items = collect(items)
  }

  distributeToWorkers(workerCount: number) {
    // Sort by priority first
    return this.items
      .sortByDesc('priority')
      .split(workerCount)
      .map((workload, index) => ({
        workerId: `worker-${index + 1}`,
        items: workload
      }))
      .all()
  }

  getEstimatedTimePerWorker(workerCount: number) {
    const workloads = this.items.split(workerCount)

    return workloads.map(workload =>
      workload.reduce((total, item) => total + item.estimatedTime, 0)
    )
  }
}

// Usage
const distributor = new WorkloadDistributor([
  { id: '1', type: 'task', estimatedTime: 30, priority: 1 },
  { id: '2', type: 'task', estimatedTime: 45, priority: 2 },
  { id: '3', type: 'task', estimatedTime: 60, priority: 3 },
  { id: '4', type: 'task', estimatedTime: 15, priority: 4 }
])
```

#### Team Assignment

```typescript
interface Player {
  id: number
  name: string
  skill: number
  position: string
}

class TeamBalancer {
  private players: Collection<Player>

  constructor(players: Player[]) {
    this.players = collect(players)
  }

  createBalancedTeams(teamCount: number) {
    // Sort by skill level first for even distribution
    return this.players
      .sortByDesc('skill')
      .split(teamCount)
      .map((team, index) => ({
        teamName: `Team ${index + 1}`,
        players: team,
        averageSkill: team.reduce((sum, player) => sum + player.skill, 0) / team.length
      }))
      .all()
  }
}
```

### Advanced Usage

#### Batch Processing

```typescript
interface DataBatch {
  id: string
  data: any[]
  processedAt?: Date
}

class BatchProcessor {
  private items: Collection<any>
  private batchSize: number

  constructor(items: any[], maxBatchSize: number = 1000) {
    this.items = collect(items)
    this.batchSize = maxBatchSize
  }

  getBatches(): DataBatch[] {
    const batchCount = Math.ceil(this.items.count() / this.batchSize)

    return this.items
      .split(batchCount)
      .map((batch, index) => ({
        id: `batch-${index + 1}`,
        data: batch
      }))
      .all()
  }

  async processBatches(processor: (batch: DataBatch) => Promise<void>) {
    const batches = this.getBatches()

    for (const batch of batches) {
      await processor(batch)
      batch.processedAt = new Date()
    }

    return batches
  }
}
```

#### Resource Allocation

```typescript
interface Resource {
  id: string
  name: string
  capacity: number
  available: boolean
}

class ResourceAllocator {
  private resources: Collection<Resource>

  constructor(resources: Resource[]) {
    this.resources = collect(resources)
  }

  allocateToGroups(groupCount: number) {
    return this.resources
      .filter(resource => resource.available)
      .sortByDesc('capacity')
      .split(groupCount)
      .map((resources, index) => ({
        groupId: `group-${index + 1}`,
        resources,
        totalCapacity: resources.reduce((sum, r) => sum + r.capacity, 0)
      }))
      .all()
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
  { id: 3, value: 'three' },
  { id: 4, value: 'four' }
])

// Type-safe split operation
const groups = items.split(2)

// TypeScript knows this is a Collection<TypedItem[]>
groups.each((group) => {
  group.forEach((item) => {
    console.log(item.id) // ✓ Valid
    console.log(item.value) // ✓ Valid
    console.log(item.metadata) // ✓ Valid (optional)
  })
})
```

## Return Value

- Returns a new Collection containing arrays of items
- Original collection remains unchanged
- Number of groups is exactly as specified
- Items are distributed as evenly as possible
- Last group may have fewer items if total count is not evenly divisible
- Maintains type safety with TypeScript
