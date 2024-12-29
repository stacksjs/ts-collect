# Partition Method

The `partition()` method separates a collection into two collections based on a predicate function. The first collection contains elements that pass the truth test, while the second contains elements that fail.

## Basic Syntax

```typescript
collect(items).partition((item: T) => boolean): [Collection<T>, Collection<T>]
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Partition numbers by even/odd
const numbers = collect([1, 2, 3, 4, 5, 6])
const [evens, odds] = numbers.partition(num => num % 2 === 0)

console.log(evens.all()) // [2, 4, 6]
console.log(odds.all()) // [1, 3, 5]

// Partition strings by length
const words = collect(['cat', 'dog', 'elephant', 'fox', 'butterfly'])
const [short, long] = words.partition(word => word.length <= 3)

console.log(short.all()) // ['cat', 'dog', 'fox']
console.log(long.all()) // ['elephant', 'butterfly']
```

### Working with Objects

```typescript
interface Task {
  id: number
  title: string
  completed: boolean
  priority: number
}

const tasks = collect<Task>([
  { id: 1, title: 'Task 1', completed: true, priority: 1 },
  { id: 2, title: 'Task 2', completed: false, priority: 2 },
  { id: 3, title: 'Task 3', completed: true, priority: 3 },
  { id: 4, title: 'Task 4', completed: false, priority: 1 }
])

// Partition by completion status
const [completed, pending] = tasks.partition(task => task.completed)

// Partition by priority
const [highPriority, lowPriority] = tasks.partition(task => task.priority > 1)
```

### Real-world Examples

#### Email Filter

```typescript
interface Email {
  id: string
  subject: string
  from: string
  content: string
  spam_score: number
  date: Date
}

class EmailFilter {
  private emails: Collection<Email>
  private spamThreshold: number

  constructor(emails: Email[], spamThreshold: number = 0.7) {
    this.emails = collect(emails)
    this.spamThreshold = spamThreshold
  }

  filterSpam(): [Collection<Email>, Collection<Email>] {
    return this.emails.partition(email =>
      email.spam_score < this.spamThreshold
    )
  }

  getNewEmails(cutoffDate: Date): [Collection<Email>, Collection<Email>] {
    return this.emails.partition(email =>
      email.date >= cutoffDate
    )
  }
}
```

#### Quality Control

```typescript
interface ProductBatch {
  batchId: string
  measurements: number[]
  temperature: number
  humidity: number
  defectRate: number
}

class QualityController {
  private batches: Collection<ProductBatch>
  private tolerances: {
    maxDefectRate: number
    tempRange: [number, number]
  }

  constructor(
    batches: ProductBatch[],
    tolerances = { maxDefectRate: 0.05, tempRange: [20, 25] }
  ) {
    this.batches = collect(batches)
    this.tolerances = tolerances
  }

  separateByQuality(): [Collection<ProductBatch>, Collection<ProductBatch>] {
    return this.batches.partition(batch =>
      this.isWithinSpecifications(batch)
    )
  }

  private isWithinSpecifications(batch: ProductBatch): boolean {
    return batch.defectRate <= this.tolerances.maxDefectRate
      && batch.temperature >= this.tolerances.tempRange[0]
      && batch.temperature <= this.tolerances.tempRange[1]
  }
}
```

### Advanced Usage

#### Transaction Processor

```typescript
interface Transaction {
  id: string
  amount: number
  status: 'pending' | 'processed' | 'failed'
  riskScore: number
  metadata: Record<string, any>
}

class TransactionProcessor {
  private transactions: Collection<Transaction>
  private riskThreshold: number

  constructor(transactions: Transaction[], riskThreshold: number = 0.8) {
    this.transactions = collect(transactions)
    this.riskThreshold = riskThreshold
  }

  separateByRisk(): [Collection<Transaction>, Collection<Transaction>] {
    return this.transactions.partition(transaction =>
      transaction.riskScore < this.riskThreshold
    )
  }

  separateByProcessability(): [Collection<Transaction>, Collection<Transaction>] {
    return this.transactions.partition((transaction) => {
      return transaction.status === 'pending'
        && transaction.amount > 0
        && this.hasRequiredMetadata(transaction)
    })
  }

  private hasRequiredMetadata(transaction: Transaction): boolean {
    const required = ['userId', 'timestamp', 'currency']
    return required.every(field => field in transaction.metadata)
  }
}
```

#### Student Performance Analysis

```typescript
interface StudentRecord {
  studentId: string
  grades: number[]
  attendance: number
  participation: number
  finalExam?: number
}

class PerformanceAnalyzer {
  private records: Collection<StudentRecord>

  constructor(records: StudentRecord[]) {
    this.records = collect(records)
  }

  separateByPerformance(): [Collection<StudentRecord>, Collection<StudentRecord>] {
    return this.records.partition(record =>
      this.isHighPerforming(record)
    )
  }

  separateByRisk(): [Collection<StudentRecord>, Collection<StudentRecord>] {
    return this.records.partition((record) => {
      const avgGrade = this.calculateAverage(record.grades)
      return avgGrade >= 70 && record.attendance >= 0.8
    })
  }

  private isHighPerforming(record: StudentRecord): boolean {
    const avgGrade = this.calculateAverage(record.grades)
    return avgGrade >= 85
      && record.attendance >= 0.9
      && record.participation >= 0.8
  }

  private calculateAverage(grades: number[]): number {
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length
  }
}
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
  status: 'active' | 'inactive'
  metadata?: Record<string, any>
}

const items = collect<TypedItem>([
  { id: 1, value: 'one', status: 'active' },
  { id: 2, value: 'two', status: 'inactive' },
  { id: 3, value: 'three', status: 'active' }
])

// Type-safe partitioning
const [active, inactive] = items.partition(item => item.status === 'active')

// TypeScript knows both collections have TypedItem elements
active.each((item) => {
  console.log(item.id) // ✓ Valid
  console.log(item.value) // ✓ Valid
  console.log(item.metadata) // ✓ Valid (optional)
})
```

## Return Value

- Returns a tuple of two collections `[Collection<T>, Collection<T>]`
  - First collection contains elements that pass the predicate
  - Second collection contains elements that fail the predicate
- Both collections maintain the original item types
- Original collection remains unchanged
- Maintains type safety with TypeScript
- Can be chained with other collection methods

## Common Use Cases

### 1. Data Filtering

- Pass/fail separation
- Valid/invalid division
- Accept/reject sorting
- Include/exclude splitting

### 2. Quality Control

- Pass/fail testing
- Compliance checking
- Standard adherence
- Quality assessment

### 3. Risk Analysis

- High/low risk separation
- Safety assessment
- Risk management
- Threat evaluation

### 4. Performance Analysis

- Above/below threshold
- Pass/fail criteria
- Performance metrics
- Efficiency measures

### 5. User Management

- Active/inactive users
- Role-based separation
- Access control
- Permission management

### 6. Content Moderation

- Approved/rejected content
- Flagged items
- Content filtering
- Moderation queues

### 7. Financial Processing

- Valid/invalid transactions
- Risk assessment
- Fraud detection
- Payment processing

### 8. Resource Allocation

- Available/unavailable
- Allocated/unallocated
- Used/unused
- Reserved/free

### 9. Task Management

- Complete/incomplete
- Assigned/unassigned
- Priority sorting
- Status separation

### 10. Error Handling

- Success/failure separation
- Error categorization
- Exception handling
- Status processing
