# Collection Methods

ts-collect provides over 100 methods for working with collections. This reference covers all available methods organized by category.

## Core Operations

### all()

Returns all items in the collection as an array.

```typescript
const collection = collect([1, 2, 3])
collection.all() // [1, 2, 3]
```

### map()

Transforms each item in the collection using a callback function.

```typescript
const collection = collect([1, 2, 3])
const doubled = collection.map(n => n * 2)
doubled.all() // [2, 4, 6]
```

### filter()

Filters items based on a predicate function.

```typescript
const collection = collect([1, 2, 3, 4, 5])
const evens = collection.filter(n => n % 2 === 0)
evens.all() // [2, 4]
```

### reduce()

Reduces the collection to a single value.

```typescript
const collection = collect([1, 2, 3, 4, 5])
const sum = collection.reduce((acc, n) => acc + n, 0) // 15
```

### flatMap()

Maps and flattens the collection in one operation.

```typescript
const collection = collect([1, 2, 3])
const result = collection.flatMap(n => [n, n * 2])
result.all() // [1, 2, 2, 4, 3, 6]
```

## Element Access

### first()

Returns the first item in the collection, or undefined if empty.

```typescript
const collection = collect([1, 2, 3])
collection.first() // 1

// With key
const users = collect([{ name: 'John' }, { name: 'Jane' }])
users.first('name') // 'John'
```

### firstOrFail()

Returns the first item or throws an error if empty.

```typescript
const collection = collect([1, 2, 3])
collection.firstOrFail() // 1

const empty = collect([])
empty.firstOrFail() // throws Error
```

### firstWhere()

Returns the first item matching the key-value pair.

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])
users.firstWhere('name', 'Jane') // { id: 2, name: 'Jane' }
```

### last()

Returns the last item in the collection.

```typescript
const collection = collect([1, 2, 3])
collection.last() // 3
```

### nth()

Returns the item at the given index.

```typescript
const collection = collect(['a', 'b', 'c', 'd'])
collection.nth(2) // 'c'
```

### sole()

Returns the only item in the collection, throws if not exactly one item.

```typescript
const collection = collect([42])
collection.sole() // 42

const multiple = collect([1, 2])
multiple.sole() // throws Error
```

## Subset Operations

### take()

Takes the first n items from the collection.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.take(3).all() // [1, 2, 3]
```

### takeUntil()

Takes items until the predicate returns true.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.takeUntil(n => n > 3).all() // [1, 2, 3]
```

### takeWhile()

Takes items while the predicate returns true.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.takeWhile(n => n < 4).all() // [1, 2, 3]
```

### skip()

Skips the first n items.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.skip(2).all() // [3, 4, 5]
```

### skipUntil()

Skips items until the predicate returns true.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.skipUntil(n => n > 2).all() // [3, 4, 5]
```

### skipWhile()

Skips items while the predicate returns true.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.skipWhile(n => n < 3).all() // [3, 4, 5]
```

### slice()

Returns a slice of the collection.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.slice(1, 3).all() // [2, 3, 4]
```

## Aggregation Methods

### sum()

Calculates the sum of items or a specific key.

```typescript
const numbers = collect([1, 2, 3, 4, 5])
numbers.sum() // 15

const orders = collect([
  { product: 'A', amount: 100 },
  { product: 'B', amount: 200 },
])
orders.sum('amount') // 300
```

### avg() / average()

Calculates the average.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.avg() // 3
collection.average() // 3 (alias)
```

### min()

Returns the minimum value.

```typescript
const collection = collect([3, 1, 4, 1, 5])
collection.min() // 1

const products = collect([
  { name: 'A', price: 100 },
  { name: 'B', price: 50 },
])
products.min('price') // { name: 'B', price: 50 }
```

### max()

Returns the maximum value.

```typescript
const collection = collect([3, 1, 4, 1, 5])
collection.max() // 5
```

### median()

Calculates the median value.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.median() // 3
```

### mode()

Returns the most frequent value.

```typescript
const collection = collect([1, 2, 2, 3, 3, 3])
collection.mode() // 3
```

### count()

Returns the number of items.

```typescript
const collection = collect([1, 2, 3])
collection.count() // 3
```

### product()

Calculates the product of all values.

```typescript
const collection = collect([1, 2, 3, 4])
collection.product() // 24
```

## Statistical Methods

### standardDeviation()

Calculates both population and sample standard deviation.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.standardDeviation()
// { population: 1.41, sample: 1.58 }
```

### variance()

Calculates the variance.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.variance() // 2.5
```

### percentile()

Calculates a specific percentile.

```typescript
const collection = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
collection.percentile(50) // 5.5 (median)
collection.percentile(90) // 9
```

### correlate()

Calculates correlation between two keys.

```typescript
const data = collect([
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 6 },
])
data.correlate('x', 'y') // 1.0 (perfect positive correlation)
```

### covariance()

Calculates covariance between two keys.

```typescript
const data = collect([
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 6 },
])
data.covariance('x', 'y')
```

### zscore()

Calculates z-scores for the collection.

```typescript
const numbers = collect([1, 2, 3, 4, 5])
numbers.zscore().all() // Array of z-scores
```

### kurtosis()

Measures the "tailedness" of the distribution.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.kurtosis()
```

### skewness()

Measures the asymmetry of the distribution.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.skewness()
```

### entropy()

Calculates the entropy of the distribution.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.entropy()
```

## Grouping & Chunking

### groupBy()

Groups items by a key or callback.

```typescript
const users = collect([
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'user' },
])

users.groupBy('role')
// Map {
//   'admin' => [{ name: 'John', role: 'admin' }],
//   'user' => [{ name: 'Jane', ... }, { name: 'Bob', ... }]
// }
```

### groupByMultiple()

Groups by multiple keys.

```typescript
const employees = collect([
  { name: 'John', dept: 'IT', role: 'dev' },
  { name: 'Jane', dept: 'IT', role: 'dev' },
  { name: 'Bob', dept: 'IT', role: 'manager' },
])

employees.groupByMultiple('dept', 'role')
// Map {
//   'IT::dev' => [...],
//   'IT::manager' => [...]
// }
```

### chunk()

Splits the collection into chunks of a given size.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.chunk(2).all()
// [[1, 2], [3, 4], [5]]
```

### partition()

Partitions the collection into two based on a predicate.

```typescript
const numbers = collect([1, 2, 3, 4, 5])
const [evens, odds] = numbers.partition(n => n % 2 === 0)
evens.all() // [2, 4]
odds.all() // [1, 3, 5]
```

### split()

Splits the collection into a number of groups.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.split(2).all() // [[1, 2, 3], [4, 5]]
```

## Filtering Methods

### where()

Filters items where a key equals a value.

```typescript
const users = collect([
  { name: 'John', active: true },
  { name: 'Jane', active: false },
])
users.where('active', true).all()
// [{ name: 'John', active: true }]
```

### whereIn()

Filters items where a key is in an array of values.

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
])
users.whereIn('id', [1, 3]).all()
// [{ id: 1, name: 'John' }, { id: 3, name: 'Bob' }]
```

### whereNotIn()

Filters items where a key is NOT in an array of values.

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])
users.whereNotIn('id', [1]).all()
// [{ id: 2, name: 'Jane' }]
```

### whereBetween()

Filters items where a key is between two values.

```typescript
const products = collect([
  { name: 'A', price: 50 },
  { name: 'B', price: 150 },
  { name: 'C', price: 250 },
])
products.whereBetween('price', 100, 200).all()
// [{ name: 'B', price: 150 }]
```

### whereNotBetween()

Filters items where a key is NOT between two values.

```typescript
products.whereNotBetween('price', 100, 200).all()
// [{ name: 'A', ... }, { name: 'C', ... }]
```

### whereNull()

Filters items where a key is null or undefined.

```typescript
const users = collect([
  { name: 'John', email: 'john@example.com' },
  { name: 'Jane', email: null },
])
users.whereNull('email').all()
// [{ name: 'Jane', email: null }]
```

### whereNotNull()

Filters items where a key is NOT null or undefined.

```typescript
users.whereNotNull('email').all()
// [{ name: 'John', email: 'john@example.com' }]
```

### whereLike()

Filters using SQL-like pattern matching.

```typescript
const products = collect([
  { name: 'Premium Laptop' },
  { name: 'Basic Tablet' },
])
products.whereLike('name', '%Laptop%').all()
// [{ name: 'Premium Laptop' }]
```

### whereRegex()

Filters using regular expressions.

```typescript
const items = collect([
  { code: 'ABC-123' },
  { code: 'XYZ-789' },
])
items.whereRegex('code', /^ABC/).all()
// [{ code: 'ABC-123' }]
```

### whereInstanceOf()

Filters items that are instances of a class.

```typescript
class User {}
class Admin {}

const items = collect([new User(), new Admin(), new User()])
items.whereInstanceOf(User).count() // 2
```

### reject()

Opposite of filter - removes items matching the predicate.

```typescript
const numbers = collect([1, 2, 3, 4, 5])
numbers.reject(n => n > 3).all() // [1, 2, 3]
```

### unique()

Returns unique items.

```typescript
const numbers = collect([1, 2, 2, 3, 3, 3])
numbers.unique().all() // [1, 2, 3]

// By key
const users = collect([
  { id: 1, role: 'admin' },
  { id: 2, role: 'admin' },
  { id: 3, role: 'user' },
])
users.unique('role').all()
// [{ id: 1, role: 'admin' }, { id: 3, role: 'user' }]
```

### duplicates()

Returns duplicate items.

```typescript
const items = collect([1, 2, 2, 3, 3, 3])
items.duplicates().all() // [2, 3, 3]
```

## Sorting Methods

### sort()

Sorts the collection.

```typescript
const numbers = collect([3, 1, 4, 1, 5])
numbers.sort().all() // [1, 1, 3, 4, 5]

// Custom comparator
numbers.sort((a, b) => b - a).all() // [5, 4, 3, 1, 1]
```

### sortBy()

Sorts by a key.

```typescript
const users = collect([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
])
users.sortBy('age').all()
// [{ name: 'Jane', age: 25 }, { name: 'John', age: 30 }]
```

### sortByDesc()

Sorts by a key in descending order.

```typescript
users.sortByDesc('age').all()
// [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]
```

### sortDesc()

Sorts in descending order.

```typescript
const numbers = collect([1, 3, 2])
numbers.sortDesc().all() // [3, 2, 1]
```

### sortKeys()

Sorts object keys alphabetically.

```typescript
const data = collect([
  { z: 1, a: 2, m: 3 }
])
data.sortKeys()
```

### sortKeysDesc()

Sorts object keys in reverse alphabetical order.

```typescript
data.sortKeysDesc()
```

### reverse()

Reverses the collection.

```typescript
const collection = collect([1, 2, 3])
collection.reverse().all() // [3, 2, 1]
```

### shuffle()

Randomly shuffles the collection.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.shuffle().all() // Random order
```

## Data Extraction

### pluck()

Extracts values for a given key.

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])
users.pluck('name').all() // ['John', 'Jane']
```

### values()

Returns just the values (reindexed).

```typescript
const collection = collect({ a: 1, b: 2, c: 3 })
collection.values().all() // [1, 2, 3]
```

### keys()

Returns the keys.

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])
users.keys('id').all() // [1, 2]
```

### only()

Returns only specified keys.

```typescript
const user = collect({ id: 1, name: 'John', email: 'john@example.com' })
user.only('name', 'email').all()
// [{ name: 'John', email: 'john@example.com' }]
```

### except()

Returns all except specified keys.

```typescript
user.except('email').all()
// [{ id: 1, name: 'John' }]
```

### pick()

Picks specific keys from each item.

```typescript
const users = collect([
  { id: 1, name: 'John', email: 'john@example.com' },
])
users.pick('name', 'email').all()
// [{ name: 'John', email: 'john@example.com' }]
```

### omit()

Omits specific keys from each item.

```typescript
users.omit('email').all()
// [{ id: 1, name: 'John' }]
```

## Set Operations

### intersect()

Returns items that exist in both collections.

```typescript
const a = collect([1, 2, 3, 4])
const b = [3, 4, 5, 6]
a.intersect(b).all() // [3, 4]
```

### union()

Returns items from both collections (unique).

```typescript
const a = collect([1, 2, 3])
const b = [3, 4, 5]
a.union(b).all() // [1, 2, 3, 4, 5]
```

### diff() / diffAssoc() / diffKeys()

Returns items not in the other collection.

```typescript
const a = collect([1, 2, 3, 4])
const b = [3, 4, 5, 6]
a.diffAssoc(b).all() // [1, 2]
```

### symmetricDiff()

Returns items in either collection but not both.

```typescript
const a = collect([1, 2, 3])
const b = [3, 4, 5]
a.symmetricDiff(b).all() // [1, 2, 4, 5]
```

### cartesianProduct()

Returns the Cartesian product of two collections.

```typescript
const a = collect([1, 2])
const b = ['a', 'b']
a.cartesianProduct(b).all()
// [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
```

## Conditional Methods

### when()

Executes a callback when a condition is true.

```typescript
const collection = collect([1, 2, 3])
collection
  .when(true, col => col.map(n => n * 2))
  .all() // [2, 4, 6]

collection
  .when(false, col => col.map(n => n * 2))
  .all() // [1, 2, 3]
```

### unless()

Executes a callback when a condition is false.

```typescript
const collection = collect([1, 2, 3])
collection
  .unless(false, col => col.map(n => n * 2))
  .all() // [2, 4, 6]
```

### whenEmpty()

Executes when the collection is empty.

```typescript
const collection = collect([])
collection.whenEmpty(col => col.push(1)).all() // [1]
```

### whenNotEmpty()

Executes when the collection is not empty.

```typescript
const collection = collect([1, 2])
collection.whenNotEmpty(col => col.map(n => n * 10)).all() // [10, 20]
```

## Mutation Methods

### push()

Adds an item to the end.

```typescript
const collection = collect([1, 2])
collection.push(3).all() // [1, 2, 3]
```

### prepend()

Adds an item to the beginning.

```typescript
const collection = collect([2, 3])
collection.prepend(1).all() // [1, 2, 3]
```

### pop()

Removes and returns the last item.

```typescript
const collection = collect([1, 2, 3])
collection.pop() // 3
```

### shift()

Removes and returns the first item.

```typescript
const collection = collect([1, 2, 3])
collection.shift() // 1
```

### put()

Sets a key-value pair.

```typescript
const collection = collect({ name: 'John' })
collection.put('age', 30).all()
// [{ name: 'John', age: 30 }]
```

### pull()

Gets and removes a key.

```typescript
const collection = collect({ name: 'John', age: 30 })
collection.pull('age') // 30
```

### splice()

Removes and replaces a portion.

```typescript
const collection = collect([1, 2, 3, 4, 5])
collection.splice(1, 2, 10, 20).all() // [1, 10, 20, 4, 5]
```

### merge()

Merges with another collection.

```typescript
const a = collect([1, 2])
const b = [3, 4]
a.merge(b).all() // [1, 2, 3, 4]
```

### mergeRecursive()

Deeply merges collections.

```typescript
const a = collect({ user: { name: 'John' } })
const b = { user: { age: 30 } }
a.mergeRecursive(b).all()
// [{ user: { name: 'John', age: 30 } }]
```

### replace()

Replaces items.

```typescript
const collection = collect([1, 2, 3])
collection.replace([10, 20]).all() // [10, 20]
```

## Conversion Methods

### toArray()

Converts to an array.

```typescript
const collection = collect([1, 2, 3])
collection.toArray() // [1, 2, 3]
```

### toMap()

Converts to a Map keyed by a field.

```typescript
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
])
users.toMap('id')
// Map { 1 => { id: 1, name: 'John' }, 2 => { id: 2, name: 'Jane' } }
```

### toSet()

Converts to a Set.

```typescript
const collection = collect([1, 2, 2, 3])
collection.toSet() // Set { 1, 2, 3 }
```

### toJSON()

Converts to a JSON string.

```typescript
const collection = collect([{ name: 'John' }])
collection.toJSON() // '[{"name":"John"}]'
collection.toJSON({ pretty: true }) // Formatted JSON
```

### toCSV()

Converts to CSV format.

```typescript
const users = collect([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
])
users.toCSV()
// "name,age\nJohn,30\nJane,25"
```

### toXML()

Converts to XML format.

```typescript
const users = collect([{ name: 'John' }])
users.toXML()
```

### toSQL()

Generates SQL INSERT statements.

```typescript
const users = collect([{ id: 1, name: 'John' }])
users.toSQL('users')
// "INSERT INTO users (id, name) VALUES (1, 'John');"
```

### toGraphQL()

Generates GraphQL query format.

```typescript
const users = collect([{ id: 1, name: 'John' }])
users.toGraphQL('User')
```

### toElastic()

Generates Elasticsearch bulk format.

```typescript
const users = collect([{ id: 1, name: 'John' }])
users.toElastic('users')
```

### toPandas()

Generates Python pandas DataFrame code.

```typescript
const data = collect([{ x: 1, y: 2 }])
data.toPandas()
```

## Async Operations

### mapAsync()

Async map operation.

```typescript
const collection = collect([1, 2, 3])
const result = await collection.mapAsync(async n => {
  const data = await fetchData(n)
  return data
})
```

### filterAsync()

Async filter operation.

```typescript
const result = await collection.filterAsync(async item => {
  const isValid = await validateItem(item)
  return isValid
})
```

### reduceAsync()

Async reduce operation.

```typescript
const result = await collection.reduceAsync(async (acc, item) => {
  const processed = await processItem(item)
  return acc + processed
}, 0)
```

### everyAsync()

Checks if all items pass an async predicate.

```typescript
const allValid = await collection.everyAsync(async item => {
  return await validateItem(item)
})
```

### someAsync()

Checks if any item passes an async predicate.

```typescript
const anyValid = await collection.someAsync(async item => {
  return await validateItem(item)
})
```

## Pagination

### paginate()

Paginates the collection.

```typescript
const items = collect(Array.from({ length: 100 }, (_, i) => i))
const page = items.paginate(10, 1)
// {
//   data: Collection([0-9]),
//   total: 100,
//   perPage: 10,
//   currentPage: 1,
//   lastPage: 10,
//   hasMorePages: true
// }
```

### forPage()

Gets a specific page.

```typescript
const items = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
items.forPage(2, 3).all() // [4, 5, 6]
```

### cursor()

Creates an async iterator for batch processing.

```typescript
const items = collect(largeArray)
for await (const batch of items.cursor(100)) {
  await processBatch(batch)
}
```

## Utility Methods

### tap()

Performs a side effect without modifying the collection.

```typescript
const result = collect([1, 2, 3])
  .tap(col => console.log('Count:', col.count()))
  .map(n => n * 2)
  .tap(col => console.log('After map:', col.all()))
  .toArray()
```

### pipe()

Pipes the collection through a callback.

```typescript
const result = collect([1, 2, 3])
  .pipe(col => col.sum()) // 6
```

### each()

Iterates over items.

```typescript
collect([1, 2, 3]).each(item => {
  console.log(item)
})
```

### eachSpread()

Iterates with spread arguments.

```typescript
collect([[1, 2], [3, 4]]).eachSpread((a, b) => {
  console.log(a, b)
})
```

### isEmpty()

Checks if the collection is empty.

```typescript
collect([]).isEmpty() // true
collect([1]).isEmpty() // false
```

### isNotEmpty()

Checks if the collection is not empty.

```typescript
collect([1]).isNotEmpty() // true
```

### contains()

Checks if an item exists.

```typescript
collect([1, 2, 3]).contains(2) // true
collect([{ id: 1 }]).contains('id', 1) // true
```

### containsAll()

Checks if all items exist.

```typescript
collect([1, 2, 3, 4]).containsAll([1, 2]) // true
```

### doesntContain()

Checks if an item doesn't exist.

```typescript
collect([1, 2, 3]).doesntContain(5) // true
```

### containsOneItem()

Checks if the collection has exactly one item.

```typescript
collect([1]).containsOneItem() // true
collect([1, 2]).containsOneItem() // false
```

### random()

Returns random item(s).

```typescript
collect([1, 2, 3, 4, 5]).random() // Random item
collect([1, 2, 3, 4, 5]).random(2).all() // 2 random items
```

### debug()

Returns collection for debugging (logs to console).

```typescript
const result = collect([1, 2, 3])
  .debug()
  .map(n => n * 2)
  .debug()
  .toArray()
```

### dump()

Dumps the collection to console.

```typescript
collect([1, 2, 3]).dump()
```

### dd()

Dumps and dies (throws after logging).

```typescript
collect([1, 2, 3]).dd() // Logs and throws
```

## Machine Learning Methods

### kmeans()

K-means clustering.

```typescript
const data = collect([
  { x: 1, y: 1 },
  { x: 1.5, y: 2 },
  { x: 10, y: 10 },
  { x: 10.5, y: 11 },
])

const clustered = data.kmeans({ k: 2 })
// Collection of { cluster: 0|1, data: {...} }
```

### linearRegression()

Linear regression analysis.

```typescript
const data = collect([
  { sqft: 1000, bedrooms: 2, price: 200000 },
  { sqft: 1500, bedrooms: 3, price: 300000 },
  { sqft: 2000, bedrooms: 4, price: 400000 },
])

const result = data.linearRegression('price', ['sqft', 'bedrooms'])
// {
//   coefficients: [...],
//   rSquared: 0.99,
//   predictions: [...],
//   residuals: [...]
// }
```

### knn()

K-nearest neighbors.

```typescript
const data = collect([
  { x: 1, y: 1, category: 'A' },
  { x: 2, y: 2, category: 'A' },
  { x: 10, y: 10, category: 'B' },
])

const neighbors = data.knn({ x: 1.5, y: 1.5 }, 2, ['x', 'y'])
```

### naiveBayes()

Naive Bayes classifier.

```typescript
const data = collect([
  { outlook: 'sunny', play: 'no' },
  { outlook: 'overcast', play: 'yes' },
  { outlook: 'rainy', play: 'yes' },
])

const classifier = data.naiveBayes(['outlook'], 'play')
classifier({ outlook: 'sunny' }) // Predicted class
```

### detectAnomalies()

Anomaly detection.

```typescript
const data = collect([
  { value: 10 },
  { value: 12 },
  { value: 100 }, // Anomaly
  { value: 11 },
])

const anomalies = data.detectAnomalies({
  method: 'zscore',
  threshold: 2,
  features: ['value']
})
```

## Time Series Methods

### timeSeries()

Converts to time series format.

```typescript
const data = collect([
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 150 },
])

const series = data.timeSeries({
  dateField: 'date',
  valueField: 'value',
  interval: 'day'
})
```

### movingAverage()

Calculates moving average.

```typescript
const series = collect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
series.movingAverage({ window: 3 })
// [2, 3, 4, 5, 6, 7, 8, 9]
```

### trend()

Detects trend in time series.

```typescript
const data = collect([
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 120 },
  { date: '2024-01-03', value: 140 },
])

const trend = data.trend({
  dateField: 'date',
  valueField: 'value'
})
// { slope: 20, intercept: 100 }
```

### seasonality()

Detects seasonal patterns.

```typescript
data.seasonality({
  dateField: 'date',
  valueField: 'value',
  interval: 'month'
})
```

### forecast()

Forecasts future values.

```typescript
const predictions = data.forecast(5) // Predict next 5 periods
```

## Validation Methods

### validate()

Validates collection items against a schema (async).

```typescript
const users = collect([
  { email: 'john@example.com', age: 25 },
  { email: 'invalid', age: -5 },
])

const result = await users.validate({
  email: [email => /^[^@]+@[^@]+\.[^@]+$/.test(email)],
  age: [age => age >= 0, age => age <= 120]
})
// { isValid: false, errors: Map { ... } }
```

### validateSync()

Synchronous validation.

```typescript
const result = users.validateSync({
  email: [email => email.includes('@')],
  age: [age => age > 0]
})
```

### assertValid()

Throws if validation fails.

```typescript
await users.assertValid({
  email: [email => email.includes('@')]
})
```

### sanitize()

Sanitizes data using rules.

```typescript
const sanitized = users.sanitize({
  email: email => email.toLowerCase().trim(),
  age: age => Math.max(0, age)
})
```

## Performance Methods

### cache()

Caches the collection.

```typescript
const cached = collection.map(expensiveOperation).cache(60000) // 60 seconds
```

### memoize()

Memoizes by key.

```typescript
const memoized = collection.memoize('id')
```

### prefetch()

Prefetches async data.

```typescript
const prefetched = await collection.prefetch()
```

### lazy()

Creates a lazy collection for deferred evaluation.

```typescript
const lazy = collection.lazy()
// See Lazy Collections guide for details
```

### parallel()

Processes in parallel.

```typescript
const results = await collection.parallel(
  async chunk => await processChunk(chunk),
  { chunks: 4, maxConcurrency: 2 }
)
```

### index()

Indexes for faster lookups.

```typescript
const indexed = collection.index(['id', 'category'])
```

### optimize()

Optimizes the collection.

```typescript
const optimized = collection.optimize()
```

### profile()

Profiles performance.

```typescript
const { time, memory } = await collection.profile()
```

### benchmark()

Benchmarks operations.

```typescript
const stats = await collection.benchmark()
// { timing: {...}, memory: {...}, complexity: {...} }
```

### metrics()

Gets collection metrics.

```typescript
const metrics = collection.metrics()
// {
//   count: 100,
//   nullCount: 5,
//   uniqueCount: 95,
//   heapUsed: 1024,
//   heapTotal: 2048
// }
```

This reference covers the most commonly used methods. For complete details and more examples, see the [API documentation](/api-reference).
