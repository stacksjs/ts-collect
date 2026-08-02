import type { CollectionItem, CollectionOperations } from '../src'
import { collect } from '../src'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? (<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false
  : false
type Expect<T extends true> = T

// Construction and literal preservation
const widenedNumbers = collect([1, 2, 3])
const narrowNumbers = collect([1, 2, 3] as const)
const emptyCollection = collect([])
const iterableCollection = collect(new Set<'left' | 'right'>())
type _MutableArrayElementsWiden = Expect<Equal<CollectionItem<typeof widenedNumbers>, number>>
type _ReadonlyArrayElementsStayLiteral = Expect<Equal<CollectionItem<typeof narrowNumbers>, 1 | 2 | 3>>
type _EmptyArrayElementsAreNever = Expect<Equal<CollectionItem<typeof emptyCollection>, never>>
type _IterableElementsArePreserved = Expect<Equal<CollectionItem<typeof iterableCollection>, 'left' | 'right'>>
type _AllPreservesTheItemType = Expect<Equal<ReturnType<typeof narrowNumbers.all>, Array<1 | 2 | 3>>>
type _ToArrayPreservesTheItemType = Expect<Equal<ReturnType<typeof narrowNumbers.toArray>, Array<1 | 2 | 3>>>

// Transformations and tuple callbacks
const literalMap = widenedNumbers.map(() => 'constant')
const tupleMap = widenedNumbers.map(value => [value, 'mapped'] as const)
const tupleFlatMap = widenedNumbers.flatMap(value => [value, 'separator'] as const)
const nullableMap = widenedNumbers.mapOption(value => value > 1 ? value : undefined)
const scan = widenedNumbers.scan((total, value) => total + value, 0)
type _MapPreservesLiteralReturns = Expect<Equal<CollectionItem<typeof literalMap>, 'constant'>>
type _MapPreservesTupleReturns = Expect<Equal<CollectionItem<typeof tupleMap>, readonly [number, 'mapped']>>
type _FlatMapExtractsReadonlyTupleItems = Expect<Equal<CollectionItem<typeof tupleFlatMap>, number | 'separator'>>
type _MapOptionRemovesNullishResults = Expect<Equal<CollectionItem<typeof nullableMap>, number>>
type _ScanPreservesAccumulatorResults = Expect<Equal<CollectionItem<typeof scan>, number>>

const spreadMapped = collect([[1, 'one'], [2, 'two']] as const).mapSpread((id, label) => ({ id, label }))
type SpreadMappedItem = CollectionItem<typeof spreadMapped>
type _MapSpreadPreservesFirstArgument = Expect<Equal<SpreadMappedItem['id'], 1 | 2>>
type _MapSpreadPreservesSecondArgument = Expect<Equal<SpreadMappedItem['label'], 'one' | 'two'>>

// Boolean filtering and user-defined type guards
type FalseyUnion = '' | 0 | 0n | false | null | undefined | 'kept' | 42
const truthyOnly = collect<FalseyUnion>([]).filter(Boolean)
type _BooleanFilteringRemovesEveryRepresentableFalsyValue = Expect<Equal<CollectionItem<typeof truthyOnly>, 'kept' | 42>>

interface PresentValue { value: string }
interface MissingValue { value?: undefined }
type MaybeValue = PresentValue | MissingValue
const maybeValues = collect<MaybeValue>([])
const presentValues = maybeValues.filter((item): item is PresentValue => typeof item.value === 'string')
const missingValues = maybeValues.reject((item): item is PresentValue => typeof item.value === 'string')
const [partitionPresent, partitionMissing] = maybeValues.partition((item): item is PresentValue => typeof item.value === 'string')
const prefixPresent = maybeValues.takeWhile((item): item is PresentValue => typeof item.value === 'string')
type _FilterCanNarrowOptionalProperties = Expect<Equal<CollectionItem<typeof presentValues>, PresentValue>>
type _RejectExcludesGuardedMembers = Expect<Equal<CollectionItem<typeof missingValues>, MissingValue>>
type _PartitionNarrowsPassingMembers = Expect<Equal<CollectionItem<typeof partitionPresent>, PresentValue>>
type _PartitionExcludesPassingMembers = Expect<Equal<CollectionItem<typeof partitionMissing>, MissingValue>>
type _TakeWhileNarrowsEveryRetainedMember = Expect<Equal<CollectionItem<typeof prefixPresent>, PresentValue>>

// Property filtering over discriminated unions
type Result =
  | { state: 'idle', data: null }
  | { state: 'loading', data: null }
  | { state: 'success', data: string }
  | { state: 'failure', data: Error }

const results = collect<Result>([])
const pendingResults = results.whereIn('state', ['idle', 'loading'] as const)
const settledResults = results.whereNotIn('state', ['idle', 'loading'] as const)
const firstFailure = results.firstWhere('state', 'failure')
const successfulResults = results.where('state', 'success')
type _WhereInKeepsMultipleDiscriminants = Expect<Equal<CollectionItem<typeof pendingResults>, Extract<Result, { state: 'idle' | 'loading' }>>>
type _WhereNotInRemovesMultipleDiscriminants = Expect<Equal<CollectionItem<typeof settledResults>, Extract<Result, { state: 'success' | 'failure' }>>>
type _FirstWhereKeepsTheSelectedMember = Expect<Equal<typeof firstFailure, Extract<Result, { state: 'failure' }> | undefined>>
type _WhereKeepsTheSelectedMember = Expect<Equal<CollectionItem<typeof successfulResults>, Extract<Result, { state: 'success' }>>>

interface NullishRecord { value: number | null | undefined, untouched: 'yes' }
const nullishRecords = collect<NullishRecord>([])
const onlyNullish = nullishRecords.whereNull('value')
const withoutNullish = nullishRecords.whereNotNull('value')
type _WhereNullPreservesOtherProperties = Expect<Equal<CollectionItem<typeof onlyNullish>['untouched'], 'yes'>>
type _WhereNullNarrowsTheSelectedProperty = Expect<Equal<CollectionItem<typeof onlyNullish>['value'], null | undefined>>
type _WhereNotNullPreservesOtherProperties = Expect<Equal<CollectionItem<typeof withoutNullish>['untouched'], 'yes'>>
type _WhereNotNullNarrowsTheSelectedProperty = Expect<Equal<CollectionItem<typeof withoutNullish>['value'], number>>

// Array depth manipulation
const nestedValues = collect([1, [2, [3, [4]]]] as const)
const depthZero = nestedValues.flatten(0)
const depthOne = nestedValues.flatten(1)
const depthTwo = nestedValues.flatten(2)
const depthThree = nestedValues.flatten(3)
const depthAll = nestedValues.flatten()
type DepthZeroItem = 1 | readonly [2, readonly [3, readonly [4]]]
type DepthOneItem = 1 | 2 | readonly [3, readonly [4]]
type _FlattenDepthZeroDoesNotChangeItems = Expect<Equal<CollectionItem<typeof depthZero>, DepthZeroItem>>
type _FlattenDepthOneRemovesOneLevel = Expect<Equal<CollectionItem<typeof depthOne>, DepthOneItem>>
type _FlattenDepthTwoRemovesTwoLevels = Expect<Equal<CollectionItem<typeof depthTwo>, 1 | 2 | 3 | readonly [4]>>
type _FlattenDepthThreeRemovesThreeLevels = Expect<Equal<CollectionItem<typeof depthThree>, 1 | 2 | 3 | 4>>
type _FlattenWithoutDepthRemovesEveryLevel = Expect<Equal<CollectionItem<typeof depthAll>, 1 | 2 | 3 | 4>>

const mixedCollapse = collect<1 | readonly [2, 3]>([]).collapse()
type _CollapseLeavesScalarsAndUnwrapsArrays = Expect<Equal<CollectionItem<typeof mixedCollapse>, 1 | 2 | 3>>

// Key selection, removal, replacement, and defaults
type Entity =
  | { kind: 'person', id: number, name: string }
  | { kind: 'company', id: number, legalName: string }

const entities = collect<Entity>([])
const identities = entities.only('kind', 'id')
const withoutIds = entities.except('id')
const withoutKinds = entities.forget('kind')
type Identity = CollectionItem<typeof identities>
type _OnlyDistributesAcrossUnionMembers = Expect<Equal<Identity, { kind: 'person', id: number } | { kind: 'company', id: number }>>
type _ExceptDistributesAcrossUnionMembers = Expect<Equal<CollectionItem<typeof withoutIds>, Omit<Extract<Entity, { kind: 'person' }>, 'id'> | Omit<Extract<Entity, { kind: 'company' }>, 'id'>>>
type _ForgetDistributesAcrossUnionMembers = Expect<Equal<CollectionItem<typeof withoutKinds>, { id: number, name: string } | { id: number, legalName: string }>>

interface Configuration { theme?: 'light' | 'dark', retries: number }
declare const configuration: CollectionOperations<Configuration>
const optionalTheme = configuration.get('theme')
const defaultTheme = configuration.get('theme', 'system')
const defaultRetries = configuration.get('retries', 3 as const)
type _GetWithoutDefaultIncludesUndefined = Expect<Equal<typeof optionalTheme, 'light' | 'dark' | undefined>>
type _GetWithDefaultReplacesUndefined = Expect<Equal<typeof defaultTheme, 'light' | 'dark' | 'system'>>
type _GetDefaultDoesNotWidenRequiredProperties = Expect<Equal<typeof defaultRetries, number>>

const changedEntity = entities.put('kind', 'archived')
const addedMetadata = entities.put('metadata', { source: 'import' })
type _PutReplacesUnionDiscriminants = Expect<Equal<CollectionItem<typeof changedEntity>['kind'], 'archived'>>
type _PutPreservesNestedLiteralValues = Expect<Equal<CollectionItem<typeof addedMetadata>['metadata']['source'], 'import'>>

// Additive and set-like operations
const padded = collect([1, 2]).pad(4, 'empty')
const prepended = collect([1, 2]).prepend('first')
const pushed = collect([1, 2]).push('last')
const splicedWithoutInsertions = collect([1, 2]).splice(1, 1)
const symmetric = collect([1, 2]).symmetricDiff(['x', 'y'] as const)
const product = collect([1, 2]).cartesianProduct(['x', 'y'] as const)
type _PadCarriesPaddingTypes = Expect<Equal<CollectionItem<typeof padded>, number | 'empty'>>
type _PrependCarriesPrependedTypes = Expect<Equal<CollectionItem<typeof prepended>, number | 'first'>>
type _PushCarriesPushedTypes = Expect<Equal<CollectionItem<typeof pushed>, number | 'last'>>
type _SpliceWithoutInsertionsDoesNotAddNever = Expect<Equal<CollectionItem<typeof splicedWithoutInsertions>, number>>
type _SymmetricDiffCarriesBothSides = Expect<Equal<CollectionItem<typeof symmetric>, number | 'x' | 'y'>>
type _CartesianProductCarriesBothTupleSides = Expect<Equal<CollectionItem<typeof product>, [number, 'x' | 'y']>>

const unionFromCollection = collect([1, 2]).union(collect(['x'] as const))
const narrowIntersection = collect<1 | 2 | 3>([]).intersect(collect<2 | 3 | 4>([]))
const disjointIntersection = collect<number>([]).intersect(['none'] as const)
type _UnionAcceptsAnotherCollection = Expect<Equal<CollectionItem<typeof unionFromCollection>, number | 'x'>>
type _IntersectionKeepsUnionOverlap = Expect<Equal<CollectionItem<typeof narrowIntersection>, 2 | 3>>
type _DisjointIntersectionIsNever = Expect<Equal<CollectionItem<typeof disjointIntersection>, never>>

// Wrapping, zipping, dictionaries, and grouping
const wrappedArray = emptyCollection.wrap([1, 2] as const)
const wrappedScalar = emptyCollection.wrap('single' as const)
const unwrappedArray = emptyCollection.unwrap([1, 2] as const)
const unwrappedScalar = emptyCollection.unwrap('single' as const)
const zipped = collect([1, 2]).zip(['a', 'b'] as const)
type _WrapArrayExtractsArrayItems = Expect<Equal<CollectionItem<typeof wrappedArray>, 1 | 2>>
type _WrapScalarPreservesLiteral = Expect<Equal<CollectionItem<typeof wrappedScalar>, 'single'>>
type _UnwrapArrayPreservesItems = Expect<Equal<typeof unwrappedArray, Array<1 | 2>>>
type _UnwrapScalarPreservesLiteral = Expect<Equal<typeof unwrappedScalar, 'single'[]>>
type _ZipCarriesNarrowRightItemsAndUndefined = Expect<Equal<CollectionItem<typeof zipped>, [number, 'a' | 'b' | undefined]>>

interface GroupedItem { group: 'a' | 'b', id: 1 | 2 }
const groupedItems = collect<GroupedItem>([])
const keyed = groupedItems.keyBy('group')
const counted = groupedItems.countBy('group')
const grouped = groupedItems.groupBy('group')
const pivoted = groupedItems.pivot('group', 'id')
const mappedDictionary = groupedItems.mapWithKeys(item => [item.group, item.id] as const)
type _KeyByPreservesKeyAndValueTypes = Expect<Equal<typeof keyed, Map<'a' | 'b', GroupedItem>>>
type _CountByPreservesKeyTypes = Expect<Equal<typeof counted, Map<'a' | 'b', number>>>
type _GroupByPreservesKeyTypes = Expect<Equal<typeof grouped, Map<'a' | 'b', CollectionOperations<GroupedItem>>>>
type _PivotPreservesBothSelectedTypes = Expect<Equal<typeof pivoted, Map<'a' | 'b', 1 | 2>>>
type _MapWithKeysAcceptsReadonlyTuples = Expect<Equal<typeof mappedDictionary, Map<'a' | 'b', 1 | 2>>>

// Conditional operations
const condition: boolean = Math.random() > 0.5
const callbackCondition = (): boolean => condition
const conditionalWhen = collect([1, 2]).when(callbackCondition, () => collect(['changed'] as const))
const conditionalUnless = collect([1, 2]).unless(callbackCondition, () => collect(['changed'] as const))
type _CallbackWhenIncludesBothBranches = Expect<Equal<CollectionItem<typeof conditionalWhen>, number | 'changed'>>
type _CallbackUnlessIncludesBothBranches = Expect<Equal<CollectionItem<typeof conditionalUnless>, number | 'changed'>>

// Lazy, asynchronous, and specialized transformations
const lazyValues = collect<MaybeValue>([]).lazy()
const lazyPresent = lazyValues.filter((item): item is PresentValue => typeof item.value === 'string')
const lazyTruthy = collect<string | null>([]).lazy().filter(Boolean)
const lazyMapped = collect([1, 2]).lazy().map(() => 'lazy')
const lazyFlatMapped = collect([1, 2]).lazy().flatMap(value => [value, 'lazy'] as const)
type _LazyFilterUsesTypeGuards = Expect<Equal<CollectionItem<Awaited<ReturnType<typeof lazyPresent.toCollection>>>, PresentValue>>
type _LazyBooleanFilterRemovesNull = Expect<Equal<CollectionItem<Awaited<ReturnType<typeof lazyTruthy.toCollection>>>, string>>
type _LazyMapPreservesLiterals = Expect<Equal<CollectionItem<Awaited<ReturnType<typeof lazyMapped.toCollection>>>, 'lazy'>>
type _LazyFlatMapExtractsTupleItems = Expect<Equal<CollectionItem<Awaited<ReturnType<typeof lazyFlatMapped.toCollection>>>, number | 'lazy'>>

const asyncMapped = collect([1, 2]).mapAsync(async () => ({ status: 'done' as const }))
const prefetched = collect<Promise<'ready' | 'waiting'>>([]).prefetch()
type _MapAsyncAwaitsAndPreservesLiterals = Expect<Equal<CollectionItem<Awaited<typeof asyncMapped>>, { status: 'done' }>>
type _PrefetchAwaitsItemPromises = Expect<Equal<CollectionItem<Awaited<typeof prefetched>>, 'ready' | 'waiting'>>

interface TransformSource { value: string, score: string, formatted: number, distance: string }
const transformSource = collect<TransformSource>([])
const ceiled = transformSource.ceil('value')
const floored = transformSource.floor('value')
const absolute = transformSource.abs('value')
const clamped = transformSource.clamp('value', 0, 10)
const dated = transformSource.dateTime('value')
const searched = transformSource.search('query', ['value'])
type _CeilReplacesSelectedValuesWithNumbers = Expect<Equal<CollectionItem<typeof ceiled>['value'], number>>
type _FloorReplacesSelectedValuesWithNumbers = Expect<Equal<CollectionItem<typeof floored>['value'], number>>
type _AbsReplacesSelectedValuesWithNumbers = Expect<Equal<CollectionItem<typeof absolute>['value'], number>>
type _ClampReplacesSelectedValuesWithNumbers = Expect<Equal<CollectionItem<typeof clamped>['value'], number>>
type _DateTimeOverwritesFormattedValues = Expect<Equal<CollectionItem<typeof dated>['formatted'], string>>
type _SearchOverwritesScoreValues = Expect<Equal<CollectionItem<typeof searched>['score'], number>>

// Invalid calls remain compile-time errors.
// @ts-expect-error Unknown properties cannot be filtered.
results.where('missing', 'value')
// @ts-expect-error Property values must belong to the selected property.
results.where('state', 'unknown')
// @ts-expect-error firstWhere rejects values outside the property domain.
results.firstWhere('state', 123)
// @ts-expect-error mapToDictionary callbacks must return key-value tuples.
groupedItems.mapToDictionary(item => item.id)
// @ts-expect-error String-only operations reject numeric collections.
collect([1, 2]).join(',')
// @ts-expect-error Numeric-only operations reject string collections.
collect(['a', 'b']).round()
