# SortDesc Method

The `sortDesc()` method sorts the collection in descending order. For arrays of objects, you can specify a key to sort by.

## Basic Syntax

```typescript
// Sort simple values
collect(items).sortDesc()

// Sort by key
collect(items).sortDesc(key: keyof T)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple array sorting
const numbers = collect([1, 3, 5, 2, 4])
console.log(numbers.sortDesc().all())
// [5, 4, 3, 2, 1]

// String array sorting
const words = collect(['banana', 'apple', 'cherry'])
console.log(words.sortDesc().all())
// ['cherry', 'banana', 'apple']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  age: number
  score: number
}

const users = collect<User>([
  { id: 1, name: 'John', age: 25, score: 85 },
  { id: 2, name: 'Jane', age: 30, score: 92 },
  { id: 3, name: 'Bob', age: 20, score: 78 }
])

// Sort by age
const byAge = users.sortDesc('age')
console.log(byAge.all())
// [
//   { id: 2, name: 'Jane', age: 30, score: 92 },
//   { id: 1, name: 'John', age: 25, score: 85 },
//   { id: 3, name: 'Bob', age: 20, score: 78 }
// ]

// Sort by score
const byScore = users.sortDesc('score')
console.log(byScore.all())
// [
//   { id: 2, name: 'Jane', age: 30, score: 92 },
//   { id: 1, name: 'John', age: 25, score: 85 },
//   { id: 3, name: 'Bob', age: 20, score: 78 }
// ]
```

### Real-world Examples

#### Leaderboard System

```typescript
interface Player {
  id: string
  username: string
  score: number
  rank?: number
  lastActive: Date
}

class Leaderboard {
  private players: Collection<Player>

  constructor(players: Player[]) {
    this.players = collect(players)
  }

  getTopPlayers(limit: number = 10): Player[] {
    return this.players
      .sortDesc('score')
      .take(limit)
      .map((player, index) => ({
        ...player,
        rank: index + 1
      }))
      .all()
  }

  getRecentTopPlayers(hours: number = 24): Player[] {
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - hours)

    return this.players
      .filter(player => player.lastActive >= cutoff)
      .sortDesc('score')
      .all()
  }
}
```

#### Sales Report Generator

```typescript
interface Sale {
  id: string
  date: Date
  amount: number
  customer: string
  product: string
}

class SalesReporter {
  private sales: Collection<Sale>

  constructor(sales: Sale[]) {
    this.sales = collect(sales)
  }

  getTopSales(limit: number = 5): Sale[] {
    return this.sales
      .sortDesc('amount')
      .take(limit)
      .all()
  }

  getMonthlyReport(year: number, month: number): {
    sales: Sale[]
    total: number
    average: number
  } {
    const monthlySales = this.sales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate.getFullYear() === year &&
             saleDate.getMonth() === month - 1
    })

    return {
      sales: monthlySales.sortDesc('amount').all(),
      total: monthlySales.sum('amount'),
      average: monthlySales.average('amount')
    }
  }
}
```

### Advanced Usage

#### Performance Analyzer

```typescript
interface Metric {
  timestamp: Date
  name: string
  value: number
  metadata: {
    category: string
    priority: number
  }
}

class PerformanceAnalyzer {
  private metrics: Collection<Metric>

  constructor(metrics: Metric[]) {
    this.metrics = collect(metrics)
  }

  getTopMetrics(category: string): Metric[] {
    return this.metrics
      .filter(metric => metric.metadata.category === category)
      .sortDesc('value')
      .all()
  }

  getHighPriorityIssues(): Metric[] {
    return this.metrics
      .filter(metric => metric.value > 0)
      .sortDesc('metadata.priority')
      .all()
  }

  getRecentHighValues(threshold: number): Metric[] {
    return this.metrics
      .filter(metric => metric.value >= threshold)
      .sortDesc('timestamp')
      .all()
  }
}
```

#### Content Management

```typescript
interface Article {
  id: string
  title: string
  publishDate: Date
  views: number
  rating: number
  tags: string[]
}

class ContentManager {
  private articles: Collection<Article>

  constructor(articles: Article[]) {
    this.articles = collect(articles)
  }

  getTrendingArticles(): Article[] {
    return this.articles
      .sortDesc('views')
      .take(10)
      .all()
  }

  getTopRatedByTag(tag: string): Article[] {
    return this.articles
      .filter(article => article.tags.includes(tag))
      .sortDesc('rating')
      .all()
  }

  getRecentPopular(days: number = 7): Article[] {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    return this.articles
      .filter(article => new Date(article.publishDate) >= cutoff)
      .sortDesc('views')
      .all()
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: number
  priority: number
  metadata?: {
    score: number
    weight: number
  }
}

const items = collect<TypedItem>([
  { id: 1, value: 100, priority: 2 },
  { id: 2, value: 200, priority: 1, metadata: { score: 85, weight: 1.5 } },
  { id: 3, value: 150, priority: 3 }
])

// Type-safe sorting
const byValue = items.sortDesc('value')
const byPriority = items.sortDesc('priority')

// TypeScript will catch invalid keys
// items.sortDesc('invalidKey') // ✗ TypeScript error
```

## Return Value

- Returns a new Collection instance with items sorted in descending order
- Original collection remains unchanged
- For simple values (numbers, strings), sorts by value
- For objects, sorts by specified key
- Maintains type safety with TypeScript
- Can be chained with other collection methods
