/**
 * Type for any function that takes a value and returns a string/number key
 */
export type KeySelector<T> = (_item: T) => string | number

/**
 * Type for comparison function
 */
export type CompareFunction<T> = (_a: T, _b: T) => number

/**
 * Type for when/unless callback
 */
export type ConditionalCallback<T> = (_collection: CollectionOperations<T>) => boolean

/**
 * Types for pagination
 */
export interface PaginationResult<T> {
  data: CollectionOperations<T>
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  hasMorePages: boolean
}

/**
 * Types for mathematical operations
 */
export interface StandardDeviationResult {
  population: number
  sample: number
}

/**
 * Types for async operations
 */
export type AsyncCallback<T, U> = (_item: T, _index: number) => Promise<U>

/** Extracts the item type carried by a collection. */
export type CollectionItem<C> = C extends CollectionOperations<infer T> ? T : never

/** Recursively extracts values from nested readonly or mutable arrays. */
export type DeepArrayValue<T> = T extends readonly (infer U)[] ? DeepArrayValue<U> : T

/** Extracts values from one array level. */
export type ArrayValue<T> = T extends readonly (infer U)[] ? U : T

/** Extracts values from a requested number of nested array levels. */
export type ArrayValueAtDepth<T, D extends number, Seen extends unknown[] = []> = Seen['length'] extends D
  ? T
  : T extends readonly (infer U)[]
    ? ArrayValueAtDepth<U, D, [...Seen, unknown]>
    : T

/** Converts a tuple-like collection item into mutable callback parameters. */
export type SpreadArguments<T> = T extends readonly [...infer A] ? A : [T]

/** Values removed by JavaScript truthiness filtering. */
export type Falsy = false | 0 | 0n | '' | null | undefined

/** Selects properties distributively across union members. */
export type SelectProperties<T, K extends PropertyKey> = T extends unknown
  ? Pick<T, Extract<keyof T, K>>
  : never

/** Removes properties distributively across union members. */
export type RemoveProperties<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<keyof T, K>>
  : never

/** Replaces a property while retaining every unaffected property. */
export type SetProperty<T, K extends PropertyKey, V> = T extends unknown
  ? { [P in keyof (Omit<T, K> & Record<K, V>)]: (Omit<T, K> & Record<K, V>)[P] }
  : never

/** Narrows a structurally compatible item union to instances of a class. */
export type InstanceOf<T, U> = T extends U ? T : U extends T ? U : never

/** Keeps the structurally overlapping portion of two item types. */
export type Overlap<T, U> = T extends U ? T : U extends T ? U : never

/** Models object spread, where properties from the right-hand value win. */
export type Assign<T, U> = T extends unknown
  ? U extends unknown ? Omit<T, keyof U> & U : never
  : never

/** Models a left join, including unmatched rows and right-side overwrites. */
export type LeftAssign<T, U> = T extends unknown
  ? U extends unknown
    ? { [P in keyof T]: P extends keyof U ? T[P] | U[P] : T[P] } & Partial<Omit<U, keyof T>>
    : never
  : never

/** Narrows collection members to a specific property value. */
export type WithPropertyValue<T, K extends keyof T, V extends T[K]> = T extends unknown
  ? T extends Record<K, V> ? T : V extends T[K] ? T & Record<K, V> : never
  : never

/** Removes collection members with a specific property value. */
export type WithoutPropertyValue<T, K extends keyof T, V> = T extends unknown
  ? T extends Record<K, V>
    ? never
    : Exclude<T[K], V> extends never
      ? never
      : T extends Record<K, Exclude<T[K], V>> ? T : T & Record<K, Exclude<T[K], V>>
  : never

/** Narrows a property to its non-nullable value. */
export type WithNonNullableProperty<T, K extends keyof T> = T extends unknown
  ? NonNullable<T[K]> extends never ? never : T & Record<K, NonNullable<T[K]>>
  : never

/** Narrows a property to nullish values supported by the input type. */
export type WithNullishProperty<T, K extends keyof T> = T extends unknown
  ? Extract<T[K], null | undefined> extends never ? never : T & Record<K, Extract<T[K], null | undefined>>
  : never

/**
 * Represents a collection of items with type safety and chainable methods
 */
export interface Collection<T> {
  readonly items: T[]
  readonly length: number
}

/**
 * Types for time series operations
 */
export interface TimeSeriesOptions {
  dateField: string
  valueField: string
  interval?: 'day' | 'week' | 'month' | 'year'
  fillGaps?: boolean
}

export interface TimeSeriesPoint {
  date: Date
  value: number
}

export interface MovingAverageOptions {
  window: number
  centered?: boolean
}

/**
 * Types for validation
 */
export type ValidationRule<T> = (_value: T) => boolean | Promise<boolean>

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[]
}

export interface ValidationResult {
  isValid: boolean
  errors: Map<string, string[]>
}

/**
 * Types for serialization
 */
export interface SerializationOptions {
  pretty?: boolean
  exclude?: string[]
  include?: string[]
  transform?: Record<string, (value: unknown) => unknown>
}

/**
 * Valid comparison operators for the having() method
 */
export type HavingOperator = '>' | '<' | '>=' | '<=' | '=' | '!='

/**
 * Types for machine learning operations
 */
export interface KMeansOptions {
  k: number
  maxIterations?: number
  distanceMetric?: 'euclidean' | 'manhattan' | 'cosine'
}

export interface RegressionResult {
  coefficients: number[]
  rSquared: number
  predictions: number[]
  residuals: number[]
}

/**
 * Types for data quality
 */
// interface DataQualityMetrics {
//   completeness: number
//   accuracy: number
//   consistency: number
//   uniqueness: number
//   timeliness: number
// }

export interface AnomalyDetectionOptions<T> {
  method: 'zscore' | 'iqr' | 'isolationForest'
  threshold?: number
  features?: Array<keyof T>
}

export interface VersionStore<T> {
  currentVersion: number
  snapshots: Map<number, {
    items: T[]
    timestamp: Date
  }>
  changes: VersionInfo<T>[]
}

export interface VersionInfo<T> {
  version: number
  timestamp: Date
  changes: Array<{
    type: 'add' | 'update' | 'delete'
    item: T
    previousItem?: T
  }>
}

/**
 * Interface for collection metrics
 */
export interface CollectionMetrics {
  count: number
  nullCount: number
  uniqueCount: number
  heapUsed: number
  heapTotal: number
  fieldCount?: number
  nullFieldsDistribution?: Map<string, number>
}

/**
 * Type for a lazy evaluation generator
 */
export type LazyGenerator<T> = Generator<T, void, unknown> | AsyncGenerator<T, void, unknown>

/**
 * Interface for lazy collection operations
 */
export interface LazyCollectionOperations<T> {
  // Core Operations - these build up the computation chain without executing
  map: <const U>(callback: (item: T, index: number) => U) => LazyCollectionOperations<U>
  filter: {
    (predicate: BooleanConstructor): LazyCollectionOperations<Exclude<T, Falsy>>
    <S extends T>(predicate: (item: T, index: number) => item is S): LazyCollectionOperations<S>
    (predicate: (item: T, index: number) => boolean): LazyCollectionOperations<T>
  }
  flatMap: <const U>(callback: (item: T, index: number) => readonly U[]) => LazyCollectionOperations<U>
  take: (count: number) => LazyCollectionOperations<T>
  skip: (count: number) => LazyCollectionOperations<T>
  chunk: (size: number) => LazyCollectionOperations<T[]>

  // Terminal Operations - these execute the chain
  toArray: () => Promise<T[]>
  toCollection: () => Promise<CollectionOperations<T>>
  forEach: (callback: (item: T) => void) => Promise<void>
  reduce: <U>(callback: (accumulator: U, current: T) => U, initial: U) => Promise<U>
  count: () => Promise<number>
  first: () => Promise<T | undefined>
  last: () => Promise<T | undefined>
  nth: (n: number) => Promise<T | undefined>

  // Utility Operations
  cache: () => LazyCollectionOperations<T>
  batch: (size: number) => LazyCollectionOperations<T>
  pipe: <U>(callback: (lazy: LazyCollectionOperations<T>) => LazyCollectionOperations<U>) => LazyCollectionOperations<U>
}

/**
 * All available collection operations
 */
export interface CollectionOperations<T> extends Collection<T> {
  // Laravel-like
  all: () => T[]
  average: (key?: keyof T) => number // alias for avg
  collapse: () => CollectionOperations<ArrayValue<T>>
  combine: <const U>(values: readonly U[]) => CollectionOperations<Record<Extract<T, string | number>, U | undefined>>
  contains: {
    (item: T | undefined): boolean
    <K extends keyof T>(key: K, value: T[K]): boolean
  }
  containsOneItem: () => boolean
  containsAll: {
    (items: Array<T | undefined>): boolean // Handle direct items check with optional undefined
    <K extends keyof T>(key: K, values: Array<T[K] | undefined>): boolean // Handle key/value check
  }
  countBy: {
    <K extends keyof T>(key: K): Map<T[K], number>
    <U extends string | number>(callback: (item: T) => U): Map<U, number>
  }
  diffAssoc: (other: readonly T[] | CollectionOperations<T>) => CollectionOperations<T>
  diffKeys: <K extends keyof T>(other: Record<K, T[K]>[]) => CollectionOperations<T>
  diffUsing: (other: readonly T[], callback: (a: T, b: T) => number) => CollectionOperations<T>
  doesntContain: ((_item: T) => boolean) & (<K extends keyof T>(key: K, value: T[K]) => boolean)
  duplicates: <K extends keyof T>(key?: K) => CollectionOperations<T>
  each: (callback: (item: T) => void) => CollectionOperations<T>
  eachSpread: (callback: (...args: SpreadArguments<T>) => void) => CollectionOperations<T>
  except: <K extends keyof T>(...keys: K[]) => CollectionOperations<RemoveProperties<T, K>>
  firstOrFail: () => T
  firstWhere: <K extends keyof T, const V extends T[K]>(key: K, value: V) => WithPropertyValue<T, K, V> | undefined
  flatten: {
    (): CollectionOperations<DeepArrayValue<T>>
    <D extends number>(depth: D): CollectionOperations<ArrayValueAtDepth<T, D>>
  }
  flip: <R extends Record<string | number, string | number> = {
    [K in Extract<keyof T, string | number> as T[K] extends string | number ? T[K] : never]: K
  }>() => CollectionOperations<R>
  forget: <K extends keyof T>(key: K) => CollectionOperations<RemoveProperties<T, K>>
  get: {
    <K extends keyof T>(key: K): T[K] | undefined
    <K extends keyof T, const D>(key: K, defaultValue: D): Exclude<T[K], undefined> | D
  }
  has: <K extends keyof T>(key: K) => boolean
  keyBy: <K extends keyof T>(key: K) => Map<T[K], T>
  macro: (name: string, callback: (...args: any[]) => any) => void
  make: <const U>(items: readonly U[]) => CollectionOperations<U>
  mapInto: <U extends Record<string, any>>(constructor: new () => U) => CollectionOperations<U>
  mapToDictionary: <const K extends PropertyKey, const V>(
    callback: (item: T) => readonly [K, V]
  ) => Map<K, V>
  mapWithKeys: <const K extends PropertyKey, const V>(
    callback: (item: T) => readonly [K, V]
  ) => Map<K, V>
  merge: <const U>(other: readonly U[] | CollectionOperations<U>) => CollectionOperations<T | U>
  mergeRecursive: <U>(other: readonly U[] | CollectionOperations<U>) => CollectionOperations<RecordMerge<T, U>>
  only: <const K extends PropertyKey>(...keys: K[]) => CollectionOperations<SelectProperties<T, K>>
  // eslint-disable-next-line ts/method-signature-style
  pad<const U = T>(size: number, value: U): CollectionOperations<T | U>
  pop: () => T | undefined
  // eslint-disable-next-line ts/method-signature-style
  prepend<const U = T>(value: U): CollectionOperations<T | U>
  pull: <K extends keyof T>(key: K) => T[K] | undefined
  // eslint-disable-next-line ts/method-signature-style
  push<const U = T>(value: U): CollectionOperations<T | U>
  put: <const K extends string, const V>(key: K, value: V) => CollectionOperations<SetProperty<T, K, V>>
  random: (size?: number) => CollectionOperations<T>
  reject: {
    <S extends T>(predicate: (item: T) => item is S): CollectionOperations<Exclude<T, S>>
    (predicate: (item: T) => boolean): CollectionOperations<T>
  }
  replace: <const U>(items: readonly U[]) => CollectionOperations<U>
  replaceRecursive: <const U>(items: readonly U[]) => CollectionOperations<U>
  reverse: () => CollectionOperations<T>
  shift: () => T | undefined
  shuffle: () => CollectionOperations<T>
  skipUntil: (value: T | ((_item: T) => boolean)) => CollectionOperations<T>
  skipWhile: (value: T | ((_item: T) => boolean)) => CollectionOperations<T>
  slice: (start: number, length?: number) => CollectionOperations<T>
  sole: () => T
  sortDesc: () => CollectionOperations<T>
  sortKeys: () => CollectionOperations<T>
  sortKeysDesc: () => CollectionOperations<T>
  splice: <const U = never>(start: number, deleteCount?: number, ...items: U[]) => CollectionOperations<T | U>
  split: (numberOfGroups: number) => CollectionOperations<T[]>
  takeUntil: (value: T | ((_item: T) => boolean)) => CollectionOperations<T>
  takeWhile: {
    <S extends T>(predicate: (_item: T) => _item is S): CollectionOperations<S>
    (value: T | ((_item: T) => boolean)): CollectionOperations<T>
  }
  times: <U>(count: number, callback: (index: number) => U) => CollectionOperations<U>
  undot: () => CollectionOperations<Record<string, unknown>>
  unlessEmpty: <U = T>(callback: (collection: CollectionOperations<T>) => CollectionOperations<U>) => CollectionOperations<T | U>
  unlessNotEmpty: <U = T>(callback: (collection: CollectionOperations<T>) => CollectionOperations<U>) => CollectionOperations<T | U>
  unwrap: <const U>(value: U | readonly U[] | CollectionOperations<U>) => U[]
  whenEmpty: <U = T>(callback: (collection: CollectionOperations<T>) => CollectionOperations<U>) => CollectionOperations<T | U>
  whenNotEmpty: <U = T>(callback: (collection: CollectionOperations<T>) => CollectionOperations<U>) => CollectionOperations<T | U>
  wrap: <const U>(value: U | readonly U[]) => CollectionOperations<U>
  zip: <const U>(array: readonly U[]) => CollectionOperations<[T, U | undefined]>

  // Transformations
  map: <const U>(callback: (item: T, index: number) => U) => CollectionOperations<U>
  filter: {
    (predicate: BooleanConstructor): CollectionOperations<Exclude<T, Falsy>>
    <S extends T>(predicate: (item: T, index: number) => item is S): CollectionOperations<S>
    (predicate: (item: T, index: number) => boolean): CollectionOperations<T>
  }
  reduce: <U>(callback: (accumulator: U, current: T, index: number) => U, initialValue: U) => U
  flatMap: <const U>(callback: (item: T, index: number) => readonly U[]) => CollectionOperations<U>

  // Advanced Transformations
  mapToGroups: <K extends keyof T | string | number, V>(callback: (item: T) => [K, V]) => Map<K, CollectionOperations<V>>
  mapSpread: <const U>(callback: (...args: SpreadArguments<T>) => U) => CollectionOperations<U>
  mapUntil: <U>(callback: (item: T, index: number) => U, predicate: (item: U) => boolean) => CollectionOperations<U>

  // Async Operations
  mapAsync: <U>(callback: AsyncCallback<T, U>) => Promise<CollectionOperations<Awaited<U>>>
  filterAsync: (callback: AsyncCallback<T, boolean>) => Promise<CollectionOperations<T>>
  reduceAsync: <U>(callback: (acc: U, item: T) => Promise<U>, initialValue: U) => Promise<U>
  everyAsync: (callback: AsyncCallback<T, boolean>) => Promise<boolean>
  someAsync: (callback: AsyncCallback<T, boolean>) => Promise<boolean>

  // Accessing Elements
  // eslint-disable-next-line ts/method-signature-style
  first(): T | undefined
  // eslint-disable-next-line ts/method-signature-style
  first<K extends keyof T>(key: K): T[K] | undefined
  // eslint-disable-next-line ts/method-signature-style
  last(): T | undefined
  // eslint-disable-next-line ts/method-signature-style
  last<K extends keyof T>(key: K): T[K] | undefined
  nth: (index: number) => T | undefined
  take: (count: number) => CollectionOperations<T>
  skip: (count: number) => CollectionOperations<T>

  // Aggregations
  sum: (key?: keyof T) => number
  avg: (key?: keyof T) => number
  min: (key?: keyof T) => T | undefined
  max: (key?: keyof T) => T | undefined
  median: (key?: keyof T) => number | undefined
  mode: (key?: keyof T) => T | undefined

  /**
   * Round numeric values to the specified precision
   */
  round: {
    (this: CollectionOperations<number>, precision?: number): CollectionOperations<number>
    <K extends keyof T>(key: K, precision?: number): CollectionOperations<SetProperty<T, K, number>>
  }

  /**
   * Ceil numeric values
   */
  ceil: {
    (this: CollectionOperations<number>, precision?: number): CollectionOperations<number>
    <K extends keyof T>(key: K, precision?: number): CollectionOperations<SetProperty<T, K, number>>
  }

  /**
   * Floor numeric values
   */
  floor: {
    (this: CollectionOperations<number>, precision?: number): CollectionOperations<number>
    <K extends keyof T>(key: K, precision?: number): CollectionOperations<SetProperty<T, K, number>>
  }

  /**
   * Get absolute values
   */
  abs: {
    (this: CollectionOperations<number>): CollectionOperations<number>
    <K extends keyof T>(key: K): CollectionOperations<SetProperty<T, K, number>>
  }

  /**
   * Clamp values between min and max
   */
  clamp: {
    (this: CollectionOperations<number>, min: number, max: number): CollectionOperations<number>
    <K extends keyof T>(key: K, min: number, max: number): CollectionOperations<SetProperty<T, K, number>>
  }

  /**
   * Calculate mean (alias for avg)
   */
  mean: {
    (this: CollectionOperations<number>): number
    <K extends keyof T>(key: K): number
  }

  // Advanced Mathematical Operations
  product: (key?: keyof T) => number
  standardDeviation: (key?: keyof T) => StandardDeviationResult
  percentile: (p: number, key?: keyof T) => number | undefined
  variance: (key?: keyof T) => number
  frequency: {
    (): Map<T, number>
    <K extends keyof T>(key: K): Map<T[K], number>
  }

  // Grouping & Chunking
  chunk: (size: number) => CollectionOperations<T[]>
  groupBy: (<K extends keyof T>(_key: K) => Map<T[K], CollectionOperations<T>>) & ((callback: KeySelector<T>) => Map<string | number, CollectionOperations<T>>)
  partition: {
    <S extends T>(predicate: (item: T) => item is S): [CollectionOperations<S>, CollectionOperations<Exclude<T, S>>]
    (predicate: (item: T) => boolean): [CollectionOperations<T>, CollectionOperations<T>]
  }

  // Advanced Grouping
  groupByMultiple: <K extends keyof T>(...keys: K[]) => Map<string, CollectionOperations<T>>
  pivot: <K extends keyof T, V extends keyof T>(keyField: K, valueField: V) => Map<T[K], T[V]>

  // Filtering & Searching
  where: <K extends keyof T, const V extends T[K]>(key: K, value: V) => CollectionOperations<WithPropertyValue<T, K, V>>
  whereIn: <K extends keyof T, const V extends T[K]>(key: K, values: readonly V[]) => CollectionOperations<WithPropertyValue<T, K, V>>
  whereNotIn: <K extends keyof T, const V extends T[K]>(key: K, values: readonly V[]) => CollectionOperations<WithoutPropertyValue<T, K, V>>
  whereBetween: <K extends keyof T>(key: K, min: T[K], max: T[K]) => CollectionOperations<T>
  whereNotBetween: <K extends keyof T>(key: K, min: T[K], max: T[K]) => CollectionOperations<T>
  unique: <K extends keyof T>(key?: K) => CollectionOperations<T>
  when: {
    <const C extends boolean, U = T>(condition: C, callback: (collection: CollectionOperations<T>) => CollectionOperations<U>): CollectionOperations<C extends true ? U : T>
    <U = T>(condition: ConditionalCallback<T>, callback: (collection: CollectionOperations<T>) => CollectionOperations<U>): CollectionOperations<T | U>
  }

  unless: {
    <const C extends boolean, U = T>(condition: C, callback: (collection: CollectionOperations<T>) => CollectionOperations<U>): CollectionOperations<C extends true ? T : U>
    <U = T>(condition: ConditionalCallback<T>, callback: (collection: CollectionOperations<T>) => CollectionOperations<U>): CollectionOperations<T | U>
  }

  // Advanced Filtering
  whereNull: <K extends keyof T>(key: K) => CollectionOperations<WithNullishProperty<T, K>>
  whereNotNull: <K extends keyof T>(key: K) => CollectionOperations<WithNonNullableProperty<T, K>>
  whereLike: <K extends keyof T>(key: K, pattern: string) => CollectionOperations<T>
  whereRegex: <K extends keyof T>(key: K, regex: RegExp) => CollectionOperations<T>
  whereInstanceOf: <U>(constructor: abstract new (...args: never[]) => U) => CollectionOperations<InstanceOf<T, U>>

  // Sorting
  sort: (compareFunction?: CompareFunction<T>) => CollectionOperations<T>
  sortBy: <K extends keyof T>(key: K, direction?: 'asc' | 'desc') => CollectionOperations<T>
  sortByDesc: <K extends keyof T>(key: K) => CollectionOperations<T>

  // Data Extraction
  pluck: <K extends keyof T>(key: K) => CollectionOperations<T[K]>
  values: () => CollectionOperations<T>
  keys: <K extends keyof T>(key: K) => CollectionOperations<T[K]>

  // Pagination
  paginate: (perPage: number, page?: number) => PaginationResult<T>
  forPage: (page: number, perPage: number) => CollectionOperations<T>
  cursor: (size: number) => AsyncGenerator<CollectionOperations<T>, void, unknown>

  // String Operations (for string collections)
  join: (this: CollectionOperations<string>, separator?: string) => string
  implode: <K extends keyof T>(key: K, separator?: string) => string
  lower: (this: CollectionOperations<string>) => CollectionOperations<string>
  upper: (this: CollectionOperations<string>) => CollectionOperations<string>
  slug: (this: CollectionOperations<string>) => CollectionOperations<string>

  // Set Operations
  symmetricDiff: <const U = T>(other: readonly U[] | CollectionOperations<U>) => CollectionOperations<T | U>
  cartesianProduct: <const U>(other: readonly U[] | CollectionOperations<U>) => CollectionOperations<[T, U]>
  power: () => CollectionOperations<CollectionOperations<T>>

  // Set Operations
  intersect: <const U>(other: readonly U[] | CollectionOperations<U>) => CollectionOperations<Overlap<T, U>>
  union: <const U>(other: readonly U[] | CollectionOperations<U>) => CollectionOperations<T | U>

  // Analysis and Statistics
  describe: <K extends keyof T>(key?: K) => Map<string, number>
  correlate: <K extends keyof T>(key1: K, key2: K) => number
  outliers: <K extends keyof T>(key: K, threshold?: number) => CollectionOperations<T>

  // Type Conversion
  cast: <U>(constructor: new (...args: any[]) => U) => CollectionOperations<U>

  // Utilities
  tap: (callback: (collection: CollectionOperations<T>) => void) => CollectionOperations<T>
  pipe: <U>(callback: (collection: CollectionOperations<T>) => U) => U
  isEmpty: () => boolean
  isNotEmpty: () => boolean
  count: () => number
  toArray: () => T[]
  toMap: <K extends keyof T>(key: K) => Map<T[K], T>
  toSet: () => Set<T>

  // Debugging and Development
  debug: () => CollectionOperations<T>
  dump: () => void
  dd: () => never

  // Time Series Operations
  timeSeries: (options: TimeSeriesOptions) => CollectionOperations<TimeSeriesPoint>
  movingAverage: (options: MovingAverageOptions) => CollectionOperations<number>
  trend: (options: TimeSeriesOptions) => { slope: number, intercept: number }
  seasonality: (options: TimeSeriesOptions) => Map<string, number>
  forecast: (periods: number) => CollectionOperations<T>

  // Advanced Validation
  validate: (schema: ValidationSchema<T>) => Promise<ValidationResult>
  validateSync: (schema: ValidationSchema<T>) => ValidationResult
  assertValid: (schema: ValidationSchema<T>) => Promise<void>
  sanitize: (rules: { [K in keyof T]?: (value: T[K]) => T[K] }) => CollectionOperations<T>

  // Advanced Querying
  query: (sql: string, params?: unknown[]) => CollectionOperations<T>
  having: <K extends keyof T>(key: K, op: HavingOperator, value: T[K]) => CollectionOperations<T>
  crossJoin: <U>(other: CollectionOperations<U>) => CollectionOperations<Assign<T, U>>
  leftJoin: <U, K extends keyof T>(
    other: CollectionOperations<U>,
    key: K,
    otherKey: keyof U
  ) => CollectionOperations<LeftAssign<T, U>>

  // Streaming Operations
  stream: () => ReadableStream<T>
  fromStream: (stream: ReadableStream<T>) => Promise<CollectionOperations<T>>
  batch: (size: number) => AsyncGenerator<CollectionOperations<T>, void, unknown>

  // Serialization & Deserialization
  toJSON: (options?: SerializationOptions) => string
  toCSV: (options?: SerializationOptions) => string
  toXML: (options?: SerializationOptions) => string
  parse: (data: string, format: 'json' | 'csv' | 'xml') => CollectionOperations<T>

  // Caching & Performance
  cache: (ttl?: number) => CollectionOperations<T>
  memoize: <K extends keyof T>(key: K) => CollectionOperations<T>
  prefetch: () => Promise<CollectionOperations<Awaited<T>>>
  lazy: () => LazyCollectionOperations<T>

  // Advanced Math & Statistics
  zscore: {
    (this: CollectionOperations<number>): CollectionOperations<number>
    <K extends keyof T>(key: K): CollectionOperations<number>
  }

  kurtosis: {
    (this: CollectionOperations<number>): number
    <K extends keyof T>(key: K): number
  }

  skewness: {
    (this: CollectionOperations<number>): number
    <K extends keyof T>(key: K): number
  }

  entropy: {
    (this: CollectionOperations<number>): number
    <K extends keyof T>(key: K): number
  }

  covariance: <K extends keyof T>(
    key1: K,
    key2: K
  ) => number

  // Pattern Matching & Text Analysis
  fuzzyMatch: <K extends keyof T>(key: K, pattern: string, threshold?: number) => CollectionOperations<T>
  sentiment: (this: CollectionOperations<string>) => CollectionOperations<{ score: number, comparative: number }>
  wordFrequency: (this: CollectionOperations<string>) => Map<string, number>
  ngrams: (this: CollectionOperations<string>, n: number) => CollectionOperations<string>

  // Advanced Transformations
  mapOption: <U>(callback: (item: T) => U | null | undefined) => CollectionOperations<NonNullable<U>>
  zipWith: <U, R>(other: CollectionOperations<U>, fn: (a: T, b: U) => R) => CollectionOperations<R>
  scan: <U>(callback: (acc: U, item: T) => U, initial: U) => CollectionOperations<U>
  unfold: <U>(fn: (seed: U) => [T, U] | null, initial: U) => CollectionOperations<T>

  // Monitoring & Metrics
  metrics: () => CollectionMetrics
  profile: () => Promise<{ time: number, memory: number }>
  instrument: (callback: (stats: Map<string, number>) => void) => CollectionOperations<T>

  // Type Conversions & Casting
  as: <U extends Record<string, any>>(type: new () => U) => CollectionOperations<U>
  pick: <K extends keyof T>(...keys: K[]) => CollectionOperations<Pick<T, K>>
  omit: <K extends keyof T>(...keys: K[]) => CollectionOperations<Omit<T, K>>
  transform: <U>(schema: { [K in keyof U]: (item: T) => U[K] }) => CollectionOperations<U>

  // Machine Learning Operations
  kmeans: (options: KMeansOptions) => CollectionOperations<{ cluster: number, data: T }>
  linearRegression: <K extends keyof T>(
    dependent: K,
    independents: K[]
  ) => RegressionResult
  knn: <K extends keyof T>(
    point: { [P in K]?: T[P] },
    k: number,
    features: ReadonlyArray<K> | K[]
  ) => CollectionOperations<T>
  naiveBayes: <K extends keyof T>(
    features: K[],
    label: K
  ) => (item: Pick<T, K>) => T[K]

  // Data Quality & Cleaning
  // dataQuality: () => DataQualityMetrics
  detectAnomalies: (options: AnomalyDetectionOptions<T>) => CollectionOperations<T>
  impute: <K extends keyof T>(key: K, strategy: 'mean' | 'median' | 'mode') => CollectionOperations<T>
  normalize: <K extends keyof T>(key: K, method: 'minmax' | 'zscore') => CollectionOperations<SetProperty<T, K, number>>
  removeOutliers: <K extends keyof T>(key: K, threshold?: number) => CollectionOperations<T>

  // Versioning & History
  // readonly currentVersion: number
  // snapshot: () => Promise<number>
  // hasVersion: (version: number) => boolean
  // getVersion: (version: number) => CollectionOperations<T> | null
  // diff: (version1: number, version2: number) => CollectionOperations<VersionInfo<T>>
  // diffSummary: (version1: number, version2: number) => {
  //   added: number
  //   removed: number
  //   updated: number
  //   changes: Array<{
  //     type: 'add' | 'update' | 'delete'
  //     field?: keyof T
  //     oldValue?: any
  //     newValue?: any
  //   }>
  // }
  // setDiff: (other: T[] | CollectionOperations<T>) => CollectionOperations<T>

  // Advanced Querying & Search
  /**
   * Search through collection items using string matching
   * @param query Search query string
   * @param fields Fields to search in
   * @param options Search options including fuzzy matching and field weights
   */
  search: <K extends keyof T>(
    query: string,
    fields: K[],
    options?: { fuzzy?: boolean, weights?: Partial<Record<K, number>> }
  ) => CollectionOperations<SetProperty<T, 'score', number>>

  aggregate: <K extends keyof T>(
    key: K,
    operations: Array<'sum' | 'avg' | 'min' | 'max' | 'count'>
  ) => Map<T[K], Record<string, number>>
  pivotTable: <R extends keyof T, C extends keyof T, V extends keyof T>(
    rows: R,
    cols: C,
    values: V,
    aggregation: 'sum' | 'avg' | 'count'
  ) => Map<T[R], Map<T[C], number>>

  // Performance Optimizations
  parallel: <U>(
    callback: (chunk: CollectionOperations<T>) => Promise<U>,
    options?: { chunks?: number, maxConcurrency?: number }
  ) => Promise<CollectionOperations<U>>
  index: <K extends keyof T>(keys: K[]) => CollectionOperations<T>
  optimize: () => CollectionOperations<T>

  // Export & Integration
  toSQL: (table: string) => string
  /**
   * Convert collection to GraphQL-formatted string
   * @param typename The GraphQL type name for the objects
   */
  toGraphQL: (typename: string) => string
  toElastic: (index: string) => Record<string, unknown>
  toPandas: () => string // Returns Python code for pandas DataFrame

  // Developer Experience
  playground: () => void // Opens collection in interactive playground
  explain: () => string // Explains the current collection pipeline
  benchmark: () => Promise<{
    timing: Record<string, number>
    memory: Record<string, number>
    complexity: Record<string, string>
  }>

  // Advanced Mathematical Operations
  /**
   * Compute Fast Fourier Transform
   * Only available when T is number
   */
  fft: (this: CollectionOperations<T>) => T extends number ? CollectionOperations<[number, number]> : never
  interpolate: (this: CollectionOperations<number>, points: number) => CollectionOperations<number>
  convolve: (this: CollectionOperations<number>, kernel: number[]) => CollectionOperations<number>
  differentiate: (this: CollectionOperations<T>) => CollectionOperations<number>
  integrate: (this: CollectionOperations<number>) => CollectionOperations<number>

  // Specialized Data Types Support
  geoDistance: <K extends keyof T>(
    key: K,
    point: readonly [number, number],
    unit?: 'km' | 'mi'
  ) => CollectionOperations<SetProperty<T, 'distance', number>>
  money: <K extends keyof T>(
    key: K,
    currency?: string
  ) => CollectionOperations<SetProperty<T, 'formatted', string>>
  dateTime: <K extends keyof T>(
    key: K,
    format?: string
  ) => CollectionOperations<SetProperty<T, 'formatted', string>>

  // Configuration & Metadata
  configure: (options: {
    precision?: number
    timezone?: string
    locale?: string
    errorHandling?: 'strict' | 'loose'
  }) => void
  // metadata: () => {
  //   schema: Record<keyof T, string>
  //   constraints: Record<keyof T, string[]>
  //   statistics: Record<keyof T, Record<string, number>>
  //   quality: DataQualityMetrics
  // }
}

export interface CacheEntry<T> {
  data: T[]
  expiry: number
}

export interface ClusterResult<T> {
  cluster: number
  data: T
}

export interface PluckedCluster {
  values: () => number[]
  toArray: () => number[]
  [Symbol.iterator]: () => IterableIterator<number>
}

export interface PluckedData<T> {
  values: () => T[]
  toArray: () => T[]
  forEach: (callback: (item: T) => void) => void
  avg: (field: keyof T) => number
  filter: (predicate: (item: T) => boolean) => PluckedData<T>
}

export interface KMeansResult<T> extends CollectionOperations<ClusterResult<T>> {
  pluck: {
    (key: 'cluster'): PluckedCluster
    (key: 'data'): PluckedData<T>
    <K extends keyof ClusterResult<T>>(key: K): CollectionOperations<ClusterResult<T>[K]>
  }
}

type IsEmptyType<T> = T extends readonly never[] ? true : T extends Record<string, never> ? true : false

export type RecordMerge<T, U> = IsEmptyType<U> extends true
  ? T
  : [T, U] extends [readonly unknown[], readonly unknown[]]
      ? U
      : [T, U] extends [object, object]
          ? {
              [K in keyof T | keyof U]: K extends keyof T
                ? K extends keyof U
                  ? RecordMerge<T[K], U[K]>
                  : T[K]
                : K extends keyof U
                  ? U[K]
                  : never
            }
          : U
