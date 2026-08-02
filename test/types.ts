import type { CollectionItem, CollectionOperations } from '../src/types'
import { collect } from '../src/collect'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
  ? (<T>() => T extends B ? 1 : 2) extends (<T>() => T extends A ? 1 : 2) ? true : false
  : false
type Expect<T extends true> = T

const literalCollection = collect([1, 2, 3] as const)
type _LiteralItemsStayNarrow = Expect<Equal<CollectionItem<typeof literalCollection>, 1 | 2 | 3>>

const mapped = collect([1, 2]).map(value => ({ kind: 'mapped', value }))
type _MappedResultsStayNarrow = Expect<Equal<CollectionItem<typeof mapped>, { readonly kind: 'mapped', readonly value: number }>>

const truthy = collect<string | 0 | false | null | undefined>([]).filter(Boolean)
type _BooleanFiltersRemoveFalsyValues = Expect<Equal<CollectionItem<typeof truthy>, string>>

type Animal =
  | { kind: 'cat', lives: number }
  | { kind: 'dog', good: boolean }

const animals = collect<Animal>([
  { kind: 'cat', lives: 9 },
  { kind: 'dog', good: true },
])
const cats = animals.filter((animal): animal is Extract<Animal, { kind: 'cat' }> => animal.kind === 'cat')
const dogs = animals.reject((animal): animal is Extract<Animal, { kind: 'cat' }> => animal.kind === 'cat')
const [partitionedCats, partitionedDogs] = animals.partition((animal): animal is Extract<Animal, { kind: 'cat' }> => animal.kind === 'cat')
type _FilterUsesTypeGuards = Expect<Equal<CollectionItem<typeof cats>, { kind: 'cat', lives: number }>>
type _RejectUsesTypeGuards = Expect<Equal<CollectionItem<typeof dogs>, { kind: 'dog', good: boolean }>>
type _PartitionPassesUseTypeGuards = Expect<Equal<CollectionItem<typeof partitionedCats>, { kind: 'cat', lives: number }>>
type _PartitionFailuresExcludeGuardedItems = Expect<Equal<CollectionItem<typeof partitionedDogs>, { kind: 'dog', good: boolean }>>

const firstCat = animals.firstWhere('kind', 'cat')
const whereCats = animals.where('kind', 'cat')
const whereAnimals = animals.whereIn('kind', ['cat'] as const)
const withoutCats = animals.whereNotIn('kind', ['cat'] as const)
type _FirstWhereNarrowsDiscriminants = Expect<Equal<typeof firstCat, { kind: 'cat', lives: number } | undefined>>
type _WhereNarrowsDiscriminants = Expect<Equal<CollectionItem<typeof whereCats>, { kind: 'cat', lives: number }>>
type _WhereInNarrowsDiscriminants = Expect<Equal<CollectionItem<typeof whereAnimals>, { kind: 'cat', lives: number }>>
type _WhereNotInExcludesDiscriminants = Expect<Equal<CollectionItem<typeof withoutCats>, { kind: 'dog', good: boolean }>>

interface NullableItem {
  id: number
  value: string | null | undefined
}

const nullable = collect<NullableItem>([])
const nullish = nullable.whereNull('value')
const present = nullable.whereNotNull('value')
type _WhereNullKeepsOnlyNullishValues = Expect<Equal<CollectionItem<typeof nullish>['value'], null | undefined>>
type _WhereNotNullRemovesNullishValues = Expect<Equal<CollectionItem<typeof present>['value'], string>>

class Alpha { alpha = true }
class Beta { beta = true }
const instances = collect<Alpha | Beta | string>([])
const alphas = instances.whereInstanceOf(Alpha)
type _InstanceFilteringNarrows = Expect<Equal<CollectionItem<typeof alphas>, Alpha>>

const nested = collect([[1, 2], [3, 4]] as const)
const deeplyNested = collect([1, [2, [3]]] as const)
const flattened = deeplyNested.flatten()
type _CollapseRemovesOneArrayLayer = Expect<Equal<CollectionItem<ReturnType<typeof nested.collapse>>, 1 | 2 | 3 | 4>>
type _FlattenRespectsDepth = Expect<Equal<CollectionItem<ReturnType<typeof deeplyNested.flatten<1>>>, 1 | 2 | readonly [3]>>
type _FlattenWithoutDepthIsRecursive = Expect<Equal<CollectionItem<typeof flattened>, 1 | 2 | 3>>

const combined = collect(['name', 'age'] as const).combine(['Chris', 36] as const)
type Combined = CollectionItem<typeof combined>
type _CombineKeepsExactKeys = Expect<Equal<keyof Combined, 'name' | 'age'>>
type _CombineKeepsValueLiterals = Expect<Equal<Combined['name'], 'Chris' | 36 | undefined>>

interface User {
  id: number
  name: string
  active?: boolean
}

const users = collect<User>([])
const selected = users.only('id', 'name')
const updated = users.put('active', true)
const withRole = users.put('role', 'admin')
const changedLiteral = collect([{ active: false }] as const).put('active', true)
type _OnlyKeepsRequiredSelectedKeys = Expect<Equal<CollectionItem<typeof selected>, { id: number, name: string }>>
type _PutNarrowsExistingValues = Expect<Equal<CollectionItem<typeof updated>['active'], true>>
type _PutAddsNarrowValues = Expect<Equal<CollectionItem<typeof withRole>['role'], 'admin'>>
type _PutCanReplaceLiteralValues = Expect<Equal<CollectionItem<typeof changedLiteral>['active'], true>>

const heterogeneous = collect([1, 2]).merge(['a', 'b'] as const)
const replaced = collect([1, 2]).replace(['ready'] as const)
const spliced = collect([1, 2]).splice(1, 0, 'inserted' as const)
const unioned = collect([1, 2]).union(['a', 'b'] as const)
const intersected = collect<number>([]).intersect([1, 2] as const)
type _MergeCarriesBothItemTypes = Expect<Equal<CollectionItem<typeof heterogeneous>, number | 'a' | 'b'>>
type _ReplaceCarriesTheNewItemType = Expect<Equal<CollectionItem<typeof replaced>, 'ready'>>
type _SpliceCarriesInsertedItemTypes = Expect<Equal<CollectionItem<typeof spliced>, number | 'inserted'>>
type _UnionCarriesBothItemTypes = Expect<Equal<CollectionItem<typeof unioned>, number | 'a' | 'b'>>
type _IntersectNarrowsToOverlappingItems = Expect<Equal<CollectionItem<typeof intersected>, 1 | 2>>

declare const settings: CollectionOperations<{ mode?: 'light' | 'dark' }>
const mode = settings.get('mode', 'system')
type _DefaultsExcludeUndefinedAndStayNarrow = Expect<Equal<typeof mode, 'light' | 'dark' | 'system'>>

const dictionary = users.mapToDictionary(user => [user.id, user.name] as const)
type _ReadonlyDictionaryTuplesInfer = Expect<Equal<typeof dictionary, Map<number, string>>>

interface NumericTransform {
  value: '12.5'
  formatted: number
  distance: string
}

const numericTransforms = collect<NumericTransform>([])
const rounded = numericTransforms.round('value')
const normalized = numericTransforms.normalize('value', 'minmax')
const formatted = numericTransforms.money('value')
const distanced = numericTransforms.geoDistance('value', [0, 0])
type _RoundReplacesTheSelectedProperty = Expect<Equal<CollectionItem<typeof rounded>['value'], number>>
type _NormalizeReplacesTheSelectedProperty = Expect<Equal<CollectionItem<typeof normalized>['value'], number>>
type _MoneyReplacesExistingFormattedProperties = Expect<Equal<CollectionItem<typeof formatted>['formatted'], string>>
type _DistanceReplacesExistingDistanceProperties = Expect<Equal<CollectionItem<typeof distanced>['distance'], number>>

const guardedPrefix = animals.takeWhile((animal): animal is Extract<Animal, { kind: 'cat' }> => animal.kind === 'cat')
type _TakeWhileUsesTypeGuards = Expect<Equal<CollectionItem<typeof guardedPrefix>, { kind: 'cat', lives: number }>>

const whenTrue = collect([1, 2]).when(true, () => collect(['yes'] as const))
const whenFalse = collect([1, 2]).when(false, () => collect(['never'] as const))
const unlessTrue = collect([1, 2]).unless(true, () => collect(['never'] as const))
const unlessFalse = collect([1, 2]).unless(false, () => collect(['yes'] as const))
type _WhenTrueReturnsTheCallbackType = Expect<Equal<CollectionItem<typeof whenTrue>, 'yes'>>
type _WhenFalseReturnsTheOriginalType = Expect<Equal<CollectionItem<typeof whenFalse>, number>>
type _UnlessTrueReturnsTheOriginalType = Expect<Equal<CollectionItem<typeof unlessTrue>, number>>
type _UnlessFalseReturnsTheCallbackType = Expect<Equal<CollectionItem<typeof unlessFalse>, 'yes'>>

interface LeftRow { id: number, value: number }
interface RightRow { id: number, value: string, label: string }
const leftRows = collect<LeftRow>([])
const rightRows = collect<RightRow>([])
const crossed = leftRows.crossJoin(rightRows)
const leftJoined = leftRows.leftJoin(rightRows, 'id', 'id')
type _CrossJoinUsesRightSideCollisions = Expect<Equal<CollectionItem<typeof crossed>['value'], string>>
type _LeftJoinIncludesMatchedAndUnmatchedValues = Expect<Equal<CollectionItem<typeof leftJoined>['value'], number | string>>
type _LeftJoinMakesRightOnlyPropertiesOptional = Expect<Equal<CollectionItem<typeof leftJoined>['label'], string | undefined>>

interface Scored { id: number, score: string }
const searched = collect<Scored>([]).search('query', ['id'])
type _SearchReplacesExistingScores = Expect<Equal<CollectionItem<typeof searched>['score'], number>>

collect([[1, 'a'], [2, 'b']] as const).eachSpread((id, label) => {
  type _SpreadFirstArgument = Expect<Equal<typeof id, 1 | 2>>
  type _SpreadSecondArgument = Expect<Equal<typeof label, 'a' | 'b'>>
})
