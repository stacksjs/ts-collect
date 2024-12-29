# Map Method

The `map()` method creates a new collection by transforming each element in the current collection using a callback function. The callback receives both the current item and its index.

## Basic Syntax

```typescript
collect(items).map<U>((item: T, index: number) => U): Collection<U>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

// Simple number transformation
const numbers = collect([1, 2, 3])
const doubled = numbers.map(n => n * 2)
console.log(doubled.all()) // [2, 4, 6]

// Using the index parameter
const indexed = numbers.map((n, i) => `${i}: ${n}`)
console.log(indexed.all()) // ['0: 1', '1: 2', '2: 3']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
}

interface UserDTO {
  userId: string
  displayName: string
  createdAt: Date
}

const users = collect<User>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const userDTOs = users.map<UserDTO>(user => ({
  userId: `USER_${user.id}`,
  displayName: user.name.toUpperCase(),
  createdAt: new Date()
}))
```

### Real-world Examples

#### Data Transformation Layer

```typescript
interface ApiResponse {
  id: string
  data: any
  timestamp: string
}

interface ProcessedResponse {
  reference: string
  content: any
  processedAt: Date
  status: 'processed' | 'error'
}

class ResponseProcessor {
  process(responses: ApiResponse[]): Collection<ProcessedResponse> {
    return collect(responses).map((response) => {
      try {
        return {
          reference: `REF_${response.id}`,
          content: this.processContent(response.data),
          processedAt: new Date(response.timestamp),
          status: 'processed'
        }
      }
      catch (error) {
        return {
          reference: `REF_${response.id}`,
          content: null,
          processedAt: new Date(response.timestamp),
          status: 'error'
        }
      }
    })
  }

  private processContent(data: any): any {
    // Content processing logic
    return data
  }
}
```

#### Form Data Transformer

```typescript
interface FormField {
  name: string
  value: any
  type: string
}

interface ValidatedField {
  fieldName: string
  originalValue: any
  parsedValue: any
  isValid: boolean
  errors: string[]
}

class FormValidator {
  validateFields(fields: FormField[]): Collection<ValidatedField> {
    return collect(fields).map(field => ({
      fieldName: field.name,
      originalValue: field.value,
      parsedValue: this.parseValue(field),
      isValid: this.validateField(field),
      errors: this.getFieldErrors(field)
    }))
  }

  private parseValue(field: FormField): any {
    switch (field.type) {
      case 'number':
        return Number.parseFloat(field.value)
      case 'date':
        return new Date(field.value)
      default:
        return field.value
    }
  }

  private validateField(field: FormField): boolean {
    // Validation logic
    return true
  }

  private getFieldErrors(field: FormField): string[] {
    // Error collection logic
    return []
  }
}
```

### Advanced Usage

#### Entity Relationship Mapper

```typescript
interface Entity {
  id: number
  relationships: {
    type: string
    targetId: number
  }[]
}

interface MappedEntity {
  entityId: string
  connections: {
    type: string
    target: string
  }[]
  metadata: {
    connectionCount: number
    lastUpdated: Date
  }
}

class EntityMapper {
  mapEntities(entities: Entity[]): Collection<MappedEntity> {
    return collect(entities).map((entity, index) => ({
      entityId: `ENTITY_${entity.id}`,
      connections: entity.relationships.map(rel => ({
        type: rel.type,
        target: `ENTITY_${rel.targetId}`
      })),
      metadata: {
        connectionCount: entity.relationships.length,
        lastUpdated: new Date(),
        index
      }
    }))
  }
}
```

#### Data Aggregator

```typescript
interface MetricPoint {
  timestamp: Date
  value: number
  category: string
}

interface AggregatedMetric {
  period: string
  average: number
  max: number
  min: number
  samples: number
}

class MetricAggregator {
  aggregateByPeriod(points: MetricPoint[]): Collection<AggregatedMetric> {
    return collect(points)
      .groupBy(point => this.getPeriod(point.timestamp))
      .map((group, period) => ({
        period,
        average: this.calculateAverage(group),
        max: Math.max(...group.map(p => p.value)),
        min: Math.min(...group.map(p => p.value)),
        samples: group.length
      }))
  }

  private getPeriod(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  private calculateAverage(points: MetricPoint[]): number {
    const sum = points.reduce((acc, p) => acc + p.value, 0)
    return sum / points.length
  }
}
```

## Type Safety

```typescript
interface SourceType {
  id: number
  value: string
  metadata?: Record<string, any>
}

interface TargetType {
  reference: string
  data: string
  processed: boolean
}

const items = collect<SourceType>([
  { id: 1, value: 'one' },
  { id: 2, value: 'two', metadata: { extra: 'info' } }
])

// Type-safe transformation
const transformed = items.map<TargetType>((item, index) => ({
  reference: `REF_${item.id}`,
  data: item.value,
  processed: true
}))

// TypeScript enforces return type
transformed.each((item) => {
  console.log(item.reference) // ✓ Valid
  console.log(item.data) // ✓ Valid
  console.log(item.processed) // ✓ Valid
})
```

## Return Value

- Returns a new Collection instance with transformed items
- Each item is transformed according to the callback function
- Collection length remains the same as original collection
- Original collection remains unchanged
- Maintains type safety with TypeScript through generics
- Can be chained with other collection methods
- Index parameter is optional in callback function

## Common Use Cases

### 1. Data Transformation

- Converting between data formats
- Normalizing data structures
- Preparing data for API requests
- Formatting response data

### 2. Type Conversion

- Converting database records to DTOs
- Transforming API responses to local models
- Mapping between different interface types
- Converting raw data to typed objects

### 3. Data Enhancement

- Adding computed properties
- Enriching objects with additional data
- Adding metadata to existing records
- Combining data from multiple sources

### 4. Data Cleaning

- Sanitizing input data
- Removing sensitive information
- Normalizing values
- Standardizing formats

### 5. View Model Creation

- Creating view models from domain models
- Preparing data for UI rendering
- Formatting data for display
- Creating presentation-specific structures

### 6. Data Validation

- Adding validation results to objects
- Creating validation summaries
- Adding error messages
- Computing validation states

### 7. Data Analysis

- Computing statistical measures
- Creating analytical summaries
- Generating report data
- Calculating derived values

### 8. Object Construction

- Creating new object instances
- Building complex objects
- Instantiating class instances
- Generating object hierarchies

### 9. String Manipulation

- Formatting text
- Creating string representations
- Building display strings
- Generating identifiers

### 10. Data Aggregation

- Creating summaries
- Building aggregated results
- Combining multiple values
- Generating composite objects
