# EachSpread Method

The `eachSpread()` method iterates over the collection by spreading each nested item values into the given callback. This is particularly useful when working with nested arrays or objects that you want to destructure while iterating.

## Basic Syntax

```typescript
const callback: (param1, param2, ...rest) => void
collect(items).eachSpread(callback)
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const pairs = collect([
  ['key1', 'value1'],
  ['key2', 'value2'],
  ['key3', 'value3']
])

pairs.eachSpread((key, value) => {
  console.log(`${key}: ${value}`)
})

// Output:
// key1: value1
// key2: value2
// key3: value3
```

### Working with Object Arrays

```typescript
interface Coordinates {
  x: number
  y: number
}

const points = collect<[number, number]>([
  [10, 20],
  [30, 40],
  [50, 60]
])

points.eachSpread((x, y) => {
  console.log(`Point at (${x}, ${y})`)
})

// Output:
// Point at (10, 20)
// Point at (30, 40)
// Point at (50, 60)
```

### Real-world Examples

#### User Data Processing

```typescript
interface UserData {
  id: number
  details: [string, string, number] // [name, email, age]
}

const userData = collect<[string, string, number]>([
  ['John Doe', 'john@example.com', 30],
  ['Jane Smith', 'jane@example.com', 25],
  ['Bob Johnson', 'bob@example.com', 35]
])

userData.eachSpread((name, email, age) => {
  console.log(`Processing user: ${name}`)
  console.log(`- Email: ${email}`)
  console.log(`- Age: ${age}`)
})
```

#### Database Record Updates

```typescript
type RecordUpdate = [number, string, boolean] // [id, status, notify]

const updates = collect<RecordUpdate>([
  [1, 'active', true],
  [2, 'inactive', false],
  [3, 'pending', true]
])

updates.eachSpread((id, status, shouldNotify) => {
  console.log(`Updating record #${id}`)
  console.log(`- New status: ${status}`)
  if (shouldNotify) {
    console.log('- Sending notification')
  }
})
```

### Advanced Usage

#### Coordinate Transformation

```typescript
type Point3D = [number, number, number]
type TransformFunction = (x: number, y: number, z: number) => void

const points3D = collect<Point3D>([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
])

// Scale all points
points3D.eachSpread((x, y, z) => {
  const scaled = {
    x: x * 2,
    y: y * 2,
    z: z * 2
  }
  console.log(`Scaled point: (${scaled.x}, ${scaled.y}, ${scaled.z})`)
})
```

#### Data Mapping

```typescript
type DataRow = [string, number, boolean]

const dataSet = collect<DataRow>([
  ['A', 100, true],
  ['B', 200, false],
  ['C', 300, true]
])

interface ProcessedData {
  code: string
  value: number
  valid: boolean
}

const processed: ProcessedData[] = []

dataSet.eachSpread((code, value, valid) => {
  processed.push({
    code,
    value,
    valid
  })
})
```

### Working with Tuples

```typescript
type TimeRange = [string, string, number] // [startTime, endTime, duration]

const timeRanges = collect<TimeRange>([
  ['09:00', '10:00', 60],
  ['10:30', '11:30', 60],
  ['13:00', '14:30', 90]
])

timeRanges.eachSpread((start, end, duration) => {
  console.log(`Session: ${start} - ${end}`)
  console.log(`Duration: ${duration} minutes`)
})
```

### Error Handling

```typescript
type ValidationData = [string, any, string[]] // [field, value, errors]

const validations = collect<ValidationData>([
  ['email', 'test@example.com', []],
  ['age', 17, ['Must be 18 or older']],
  ['name', '', ['Required field']]
])

validations.eachSpread((field, value, errors) => {
  if (errors.length > 0) {
    console.log(`Validation failed for ${field}:`)
    errors.forEach(error => console.log(`- ${error}`))
  }
  else {
    console.log(`${field} is valid`)
  }
})
```

## Type Safety

```typescript
// TypeScript ensures correct types for spread parameters
type TypedTuple = [string, number, boolean]

const typedData = collect<TypedTuple>([
  ['item1', 100, true],
  ['item2', 200, false]
])

typedData.eachSpread((str: string, num: number, bool: boolean) => {
  // TypeScript ensures type safety
  const upperStr = str.toUpperCase() // ✓ Valid
  const doubled = num * 2 // ✓ Valid
  const negated = !bool // ✓ Valid
})
```

## Return Value

Returns the collection instance for method chaining. The callback function can return `false` to break the iteration early.
