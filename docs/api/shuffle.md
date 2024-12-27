# Shuffle Method

The `shuffle()` method randomly shuffles the items in the collection. This method uses a Fisher-Yates shuffle algorithm to ensure unbiased randomization.

## Basic Syntax

```typescript
collect(items).shuffle()
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Simple array shuffle
const numbers = collect([1, 2, 3, 4, 5])
console.log(numbers.shuffle().all())
// [3, 1, 5, 2, 4] (random order)

// String array shuffle
const words = collect(['apple', 'banana', 'cherry'])
console.log(words.shuffle().all())
// ['cherry', 'apple', 'banana'] (random order)
```

### Working with Objects

```typescript
interface Card {
  suit: string
  value: string
}

const deck = collect<Card>([
  { suit: 'hearts', value: 'A' },
  { suit: 'hearts', value: 'K' },
  { suit: 'hearts', value: 'Q' },
  { suit: 'hearts', value: 'J' }
])

const shuffledDeck = deck.shuffle()
console.log(shuffledDeck.all())
// Cards in random order
```

### Real-world Examples

#### Quiz Generator

```typescript
interface Question {
  id: number
  text: string
  answers: string[]
  correctAnswer: number
}

class QuizGenerator {
  private questions: Collection<Question>

  constructor(questions: Question[]) {
    this.questions = collect(questions)
  }

  generateQuiz(numQuestions: number) {
    return this.questions
      .shuffle()
      .take(numQuestions)
      .map(question => ({
        ...question,
        answers: collect(question.answers).shuffle().all()
      }))
      .all()
  }
}

// Usage
const quizGen = new QuizGenerator([
  {
    id: 1,
    text: 'What is TypeScript?',
    answers: [
      'A superset of JavaScript',
      'A database',
      'A web browser',
      'An operating system'
    ],
    correctAnswer: 0
  },
  // More questions...
])

const quiz = quizGen.generateQuiz(5)
```

#### Game Card Dealer

```typescript
interface PlayingCard {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  rank: string
  value: number
}

class CardDealer {
  private deck: Collection<PlayingCard>

  constructor() {
    this.initializeDeck()
  }

  private initializeDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

    const deck: PlayingCard[] = []
    suits.forEach((suit) => {
      ranks.forEach((rank, index) => {
        deck.push({
          suit: suit as PlayingCard['suit'],
          rank,
          value: index + 2
        })
      })
    })

    this.deck = collect(deck)
  }

  shuffle() {
    this.deck = this.deck.shuffle()
    return this
  }

  deal(numCards: number): PlayingCard[] {
    return this.deck.take(numCards).all()
  }
}
```

### Advanced Usage

#### Playlist Shuffler

```typescript
interface Song {
  id: string
  title: string
  artist: string
  duration: number
  lastPlayed?: Date
}

class PlaylistManager {
  private songs: Collection<Song>
  private history: Collection<Song>

  constructor(songs: Song[]) {
    this.songs = collect(songs)
    this.history = collect([])
  }

  shufflePlaylist() {
    // Weight shuffle based on last played
    const now = new Date()
    const weightedSongs = this.songs
      .map(song => ({
        ...song,
        weight: song.lastPlayed
          ? (now.getTime() - song.lastPlayed.getTime()) / 1000 / 3600 // hours since last played
          : 24 // default to 24 hours if never played
      }))
      .sortBy('weight')
      .shuffle()
      .all()

    this.songs = collect(weightedSongs)
    return this.songs
  }

  getNextSong(): Song | undefined {
    const song = this.songs.shift()
    if (song) {
      song.lastPlayed = new Date()
      this.history.push(song)
    }
    return song
  }
}
```

#### Team Randomizer

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

  createBalancedTeams(numTeams: number): Player[][] {
    // Sort by skill and then shuffle within skill levels
    const sortedPlayers = this.players
      .sortBy('skill')
      .chunk(Math.ceil(this.players.count() / numTeams))
      .map(group => group.shuffle())
      .all()

    // Distribute players across teams
    const teams: Player[][] = new Array(numTeams).fill([]).map(() => [])
    sortedPlayers.forEach((skillGroup, index) => {
      skillGroup.forEach((player, playerIndex) => {
        teams[playerIndex % numTeams].push(player)
      })
    })

    return teams
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
  { id: 2, value: 'two', metadata: { extra: 'info' } },
  { id: 3, value: 'three' }
])

// Type-safe shuffle
const shuffled = items.shuffle()

// TypeScript maintains type information
shuffled.each((item: TypedItem) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a new Collection instance with items in randomized order
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Uses Fisher-Yates shuffle algorithm for unbiased randomization
- Returns empty collection if input collection is empty
