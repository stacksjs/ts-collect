# Random Method

The `random()` method returns a random item from the collection, or optionally multiple random items if you specify a number.

## Basic Syntax

```typescript
// Get one random item
collect(items).random()

// Get multiple random items
collect(items).random(length: number)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Get single random item
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.random()) // Random number from the collection

// Get multiple random items
console.log(numbers.random(3)) // Array of 3 random numbers
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users = collect<User>([
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' },
  { id: 4, name: 'Alice', role: 'moderator' }
])

// Get random user
const randomUser = users.random()

// Get multiple random users
const randomUsers = users.random(2)
```

### Real-world Examples

#### Random Prize Generator

```typescript
interface Prize {
  id: string
  name: string
  probability: number
  value: number
}

class PrizeGenerator {
  private prizes: Collection<Prize>

  constructor() {
    this.prizes = collect<Prize>([
      { id: 'p1', name: 'Grand Prize', probability: 0.1, value: 1000 },
      { id: 'p2', name: 'Second Prize', probability: 0.2, value: 500 },
      { id: 'p3', name: 'Third Prize', probability: 0.3, value: 100 },
      { id: 'p4', name: 'Consolation', probability: 0.4, value: 10 }
    ])
  }

  drawPrize(): Prize {
    // Simple random selection
    return this.prizes.random()
  }

  drawMultiplePrizes(count: number): Prize[] {
    return this.prizes.random(count)
  }
}
```

#### Quiz Question Selector

```typescript
interface Question {
  id: number
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  answers: string[]
  correctAnswer: number
}

class QuizManager {
  private questions: Collection<Question>

  constructor(questions: Question[]) {
    this.questions = collect(questions)
  }

  getRandomQuestions(count: number, difficulty?: Question['difficulty']): Question[] {
    if (difficulty) {
      return this.questions
        .filter(q => q.difficulty === difficulty)
        .random(count)
    }
    return this.questions.random(count)
  }

  getRandomQuestionByCategory(category: string): Question {
    return this.questions
      .filter(q => q.category === category)
      .random()
  }
}
```

### Advanced Usage

#### Random Team Generator

```typescript
interface Player {
  id: number
  name: string
  skill: number
  position: string
}

class TeamGenerator {
  private players: Collection<Player>

  constructor(players: Player[]) {
    this.players = collect(players)
  }

  generateBalancedTeams(teamCount: number): Player[][] {
    const playersPerTeam = Math.floor(this.players.count() / teamCount)
    const teams: Player[][] = []

    // Sort by skill to ensure balanced distribution
    const sortedPlayers = this.players.sortBy('skill')

    // Create teams
    for (let i = 0; i < teamCount; i++) {
      const teamPlayers = sortedPlayers
        .filter(player => !teams.flat().includes(player))
        .random(playersPerTeam)
      teams.push(teamPlayers)
    }

    return teams
  }

  getRandomSubstitutes(count: number): Player[] {
    return this.players.random(count)
  }
}
```

#### Random Test Data Generator

```typescript
interface TestData {
  id: string
  scenario: string
  inputs: any[]
  expectedOutput: any
}

class TestDataGenerator {
  private testCases: Collection<TestData>

  constructor() {
    this.testCases = collect<TestData>([
      {
        id: 'test1',
        scenario: 'Valid input',
        inputs: [1, 2, 3],
        expectedOutput: 6
      },
      {
        id: 'test2',
        scenario: 'Empty input',
        inputs: [],
        expectedOutput: 0
      },
      // ... more test cases
    ])
  }

  getRandomTestCase(): TestData {
    return this.testCases.random()
  }

  getRandomTestSuite(size: number): TestData[] {
    return this.testCases.random(size)
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  optional?: boolean
}

const items = collect<TypedItem>([
  { id: 1, value: 'one' },
  { id: 2, value: 'two', optional: true },
  { id: 3, value: 'three' }
])

// Type-safe random selections
const singleItem: TypedItem | undefined = items.random()
const multipleItems: TypedItem[] = items.random(2)

// TypeScript knows about the types
if (singleItem) {
  console.log(singleItem.value) // ✓ Valid
  console.log(singleItem.optional) // ✓ Valid (optional)
}
```

## Return Value

- When called without arguments:
  - Returns a single random item from the collection
  - Returns undefined if the collection is empty
- When called with a number argument:
  - Returns an array of random items of the specified length
  - Returns all items in random order if requested length exceeds collection size
  - Returns empty array if collection is empty
