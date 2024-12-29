# Zip Method

The `zip()` method merges the elements of the current collection with the corresponding elements from another array. It creates pairs of elements from both sources, returning an array of tuples.

## Basic Syntax

```typescript
collect(items).zip<U>(array: U[]): Collection<[T, U | undefined]>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1, 2, 3])
const letters = ['a', 'b', 'c']

const zipped = numbers.zip(letters)
console.log(zipped.all())
// [[1, 'a'], [2, 'b'], [3, 'c']]

// With arrays of different lengths
const moreNumbers = collect([1, 2, 3, 4])
const fewerLetters = ['a', 'b']
console.log(moreNumbers.zip(fewerLetters).all())
// [[1, 'a'], [2, 'b'], [3, undefined], [4, undefined]]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
}

interface Role {
  id: number
  title: string
}

const users = collect<User>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const roles: Role[] = [
  { id: 1, title: 'Admin' },
  { id: 2, title: 'User' }
]

const usersWithRoles = users.zip(roles)
console.log(usersWithRoles.all())
// [
//   [{ id: 1, name: 'John' }, { id: 1, title: 'Admin' }],
//   [{ id: 2, name: 'Jane' }, { id: 2, title: 'User' }]
// ]
```

### Real-world Examples

#### Data Pairing System

```typescript
interface StudentData {
  id: number
  name: string
  grade: number
}

interface TestScore {
  studentId: number
  score: number
  date: Date
}

class GradeAnalyzer {
  private students: Collection<StudentData>

  constructor(students: StudentData[]) {
    this.students = collect(students)
  }

  pairWithTestScores(scores: TestScore[]): Array<[StudentData, TestScore | undefined]> {
    return this.students.zip(scores).all()
  }

  generateReport(): string[] {
    const scores: TestScore[] = [
      { studentId: 1, score: 85, date: new Date() },
      { studentId: 2, score: 92, date: new Date() }
    ]

    return this.pairWithTestScores(scores)
      .map(([student, score]) =>
        score
          ? `${student.name}: ${score.score}%`
          : `${student.name}: No score available`
      )
  }
}
```

#### Coordinate System

```typescript
interface Point {
  x: number
  y: number
}

class CoordinateMapper {
  createPoints(xCoords: number[], yCoords: number[]): Collection<Point> {
    return collect(xCoords)
      .zip(yCoords)
      .map(([x, y]) => ({
        x,
        y: y ?? 0 // Default to 0 if y coordinate is undefined
      }))
  }

  calculateDistances(points: Point[]): number[] {
    const coordinates = this.splitCoordinates(points)
    return coordinates.map(([p1, p2]) =>
      p2 ? this.distance(p1, p2) : 0
    )
  }

  private splitCoordinates(points: Point[]): Array<[Point, Point | undefined]> {
    const pairs = collect(points.slice(0, -1))
      .zip(points.slice(1))
    return pairs.all()
  }

  private distance(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  }
}
```

### Advanced Usage

#### Translation System

```typescript
interface Translation {
  key: string
  translations: Map<string, string>
}

class TranslationManager {
  private defaultLanguage: string
  private translations: Collection<[string, string]>

  constructor(keys: string[], defaultTranslations: string[]) {
    this.defaultLanguage = 'en'
    this.translations = collect(keys).zip(defaultTranslations)
  }

  addLanguage(translations: string[]): void {
    const languageTranslations = this.translations
      .map(([key, _]) => key)
      .zip(translations)
      .all()

    // Store new language translations
    console.log(languageTranslations)
  }

  translate(key: string, language: string = this.defaultLanguage): string {
    const translation = this.translations
      .first(([k, _]) => k === key)

    return translation?.[1] ?? key
  }
}
```

#### Data Synchronizer

```typescript
interface LocalData {
  id: string
  value: any
  timestamp: number
}

interface RemoteData {
  id: string
  value: any
  lastSync: number
}

class DataSynchronizer {
  synchronize(
    localData: LocalData[],
    remoteData: RemoteData[]
  ): Array<[LocalData, RemoteData | undefined]> {
    return collect(localData)
      .sortBy('id')
      .zip(collect(remoteData).sortBy('id').all())
      .all()
  }

  findConflicts(
    local: LocalData[],
    remote: RemoteData[]
  ): Array<[LocalData, RemoteData]> {
    return this.synchronize(local, remote)
      .filter(([l, r]): r is RemoteData => {
        return r !== undefined && l.timestamp !== r.lastSync
      })
      .map(([l, r]) => [l, r])
  }
}
```

## Type Safety

```typescript
interface FirstType {
  id: number
  value: string
}

interface SecondType {
  id: number
  data: number
}

// Type-safe zipping
const first = collect<FirstType>([
  { id: 1, value: 'one' }
])

const second: SecondType[] = [
  { id: 1, data: 100 }
]

const zipped = first.zip(second)
// Type is Collection<[FirstType, SecondType | undefined]>

// TypeScript ensures type safety
zipped.each(([firstItem, secondItem]) => {
  console.log(firstItem.value) // ✓ Valid
  console.log(secondItem?.data) // ✓ Valid (with optional chaining)
})
```

## Return Value

- Returns a new Collection containing tuples of paired items
- Each tuple contains:
  - Item from the original collection
  - Corresponding item from the provided array (or undefined)
- Length matches the length of the longer collection
- Maintains type safety with TypeScript
- Can be chained with other collection methods
