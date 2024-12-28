# Unwrap Method

The `unwrap()` method extracts the underlying array from a collection, or returns the given value if it's not a collection. It's particularly useful when you need to get the raw array from a collection or ensure a consistent return type.

## Basic Syntax

```typescript
// Unwrap a collection
collect(items).unwrap()

// Unwrap a value or collection
Collection.unwrap(value: U | U[] | Collection<U>)
```

## Examples

### Basic Usage

```typescript
import { collect } from '@stacksjs/ts-collect'

// Unwrapping a collection
const collection = collect([1, 2, 3])
console.log(Collection.unwrap(collection)) // [1, 2, 3]

// Unwrapping an array
console.log(Collection.unwrap([1, 2, 3])) // [1, 2, 3]

// Unwrapping a single value
console.log(Collection.unwrap('hello')) // ['hello']
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
}

const users = collect<User>([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

// Unwrap collection of objects
const unwrappedUsers = Collection.unwrap(users)
console.log(unwrappedUsers)
// [
//   { id: 1, name: 'John' },
//   { id: 2, name: 'Jane' }
// ]
```

### Real-world Examples

#### Data Transformer

```typescript
interface DataTransformer<T> {
  transform: (data: T | T[] | Collection<T>) => T[]
}

class APIResponseTransformer implements DataTransformer<any> {
  transform(data: any | any[] | Collection<any>): any[] {
    return Collection.unwrap(data).map(item => ({
      ...item,
      transformedAt: new Date()
    }))
  }
}

// Usage
const transformer = new APIResponseTransformer()

// With collection
const collectionData = collect([{ id: 1 }, { id: 2 }])
console.log(transformer.transform(collectionData))

// With array
console.log(transformer.transform([{ id: 1 }, { id: 2 }]))

// With single item
console.log(transformer.transform({ id: 1 }))
```

#### Result Handler

```typescript
interface Result<T> {
  data: T | T[] | Collection<T>
  status: 'success' | 'error'
}

class ResultHandler<T> {
  handleResult(result: Result<T>): T[] {
    if (result.status === 'error') {
      throw new Error('Error processing result')
    }

    return Collection.unwrap(result.data)
  }
}

// Usage
interface ResponseData {
  id: number
  value: string
}

const handler = new ResultHandler<ResponseData>()

const result: Result<ResponseData> = {
  data: collect([
    { id: 1, value: 'one' },
    { id: 2, value: 'two' }
  ]),
  status: 'success'
}

console.log(handler.handleResult(result))
```

### Advanced Usage

#### Generic Data Processor

```typescript
class DataProcessor<T> {
  private preprocessor: (item: T) => T
  private postprocessor: (items: T[]) => T[]

  constructor(
    preprocessor: (item: T) => T,
    postprocessor: (items: T[]) => T[]
  ) {
    this.preprocessor = preprocessor
    this.postprocessor = postprocessor
  }

  process(input: T | T[] | Collection<T>): T[] {
    const items = Collection.unwrap(input)
    const preprocessed = items.map(this.preprocessor)
    return this.postprocessor(preprocessed)
  }
}

// Usage
const processor = new DataProcessor<number>(
  n => n * 2,
  arr => arr.sort((a, b) => b - a)
)

console.log(processor.process(collect([1, 2, 3]))) // [6, 4, 2]
console.log(processor.process([1, 2, 3])) // [6, 4, 2]
console.log(processor.process(1)) // [2]
```

#### Response Normalizer

```typescript
interface APIResponse<T> {
  data: T | T[] | Collection<T>
  meta?: {
    total: number
    page: number
  }
}

class ResponseNormalizer<T> {
  normalize(response: APIResponse<T>): {
    items: T[]
    meta?: APIResponse<T>['meta']
  } {
    return {
      items: Collection.unwrap(response.data),
      meta: response.meta
    }
  }
}

// Usage
interface User {
  id: number
  name: string
}

const normalizer = new ResponseNormalizer<User>()

const response: APIResponse<User> = {
  data: collect([
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]),
  meta: {
    total: 2,
    page: 1
  }
}

console.log(normalizer.normalize(response))
```

## Type Safety

```typescript
interface TypedItem {
  id: number
  value: string
}

// Collection unwrap
const collection = collect<TypedItem>([
  { id: 1, value: 'one' }
])
const items: TypedItem[] = Collection.unwrap(collection)

// Array unwrap
const array: TypedItem[] = [{ id: 1, value: 'one' }]
const unwrappedArray: TypedItem[] = Collection.unwrap(array)

// Single item unwrap
const item: TypedItem = { id: 1, value: 'one' }
const unwrappedItem: TypedItem[] = Collection.unwrap(item)
```

## Return Value

- When given a Collection:
  - Returns the underlying array
- When given an array:
  - Returns the array as-is
- When given a single value:
  - Returns an array containing that single value
- Maintains type safety through TypeScript generics
