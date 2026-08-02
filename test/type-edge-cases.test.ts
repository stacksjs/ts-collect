import { describe, expect, it, mock } from 'bun:test'
import { collect } from '../src'

describe('type-driven collection edge cases', () => {
  describe('readonly and literal inputs', () => {
    it('accepts a frozen readonly array without exposing it to mutations', () => {
      const input = Object.freeze([1, 2, 3] as const)
      const collection = collect(input)

      expect(collection.pop()).toBe(3)
      expect(collection.shift()).toBe(1)
      expect(input).toEqual([1, 2, 3])
      expect(collection.toArray()).toEqual([2])
    })

    it('accepts readonly tuples in flatMap callbacks', () => {
      const result = collect([1, 2]).flatMap(value => [value, value * 10] as const)

      expect(result.toArray()).toEqual([1, 10, 2, 20])
    })

    it('accepts readonly tuples in dictionary callbacks', () => {
      const result = collect([{ id: 1, name: 'one' }])
        .mapToDictionary(item => [item.id, item.name] as const)

      expect(result).toEqual(new Map([[1, 'one']]))
    })

    it('wraps frozen readonly arrays as individual collection items', () => {
      const values = Object.freeze(['a', 'b'] as const)

      expect(collect([]).wrap(values).toArray()).toEqual(['a', 'b'])
      expect(collect([]).unwrap(values)).toEqual(['a', 'b'])
    })
  })

  describe('predicate narrowing behavior', () => {
    it('filters every JavaScript falsy value with Boolean', () => {
      const values = ['', 0, 0n, false, null, undefined, Number.NaN, 'kept', 42]

      expect(collect(values).filter(Boolean).toArray()).toEqual(['kept', 42])
    })

    it('rejects exactly the values accepted by a guard', () => {
      const values: Array<string | number> = [1, 'a', 2, 'b']
      const result = collect(values).reject((value): value is string => typeof value === 'string')

      expect(result.toArray()).toEqual([1, 2])
    })

    it('partitions guard matches without losing order', () => {
      const values: Array<string | number> = [1, 'a', 2, 'b']
      const [strings, numbers] = collect(values).partition((value): value is string => typeof value === 'string')

      expect(strings.toArray()).toEqual(['a', 'b'])
      expect(numbers.toArray()).toEqual([1, 2])
    })

    it('stops a guarded takeWhile at the first non-match', () => {
      const values: Array<string | number> = ['a', 'b', 1, 'c']
      const result = collect(values).takeWhile((value): value is string => typeof value === 'string')

      expect(result.toArray()).toEqual(['a', 'b'])
    })

    it('returns an empty guarded prefix when the first item fails', () => {
      const values: Array<string | number> = [1, 'a']
      const result = collect(values).takeWhile((value): value is string => typeof value === 'string')

      expect(result.toArray()).toEqual([])
    })
  })

  describe('property narrowing behavior', () => {
    const states = [
      { state: 'idle' as const, value: null },
      { state: 'loading' as const, value: undefined },
      { state: 'success' as const, value: 'done' },
      { state: 'failure' as const, value: new Error('failed') },
    ]

    it('selects multiple discriminants with whereIn', () => {
      expect(collect(states).whereIn('state', ['idle', 'loading']).pluck('state').toArray())
        .toEqual(['idle', 'loading'])
    })

    it('excludes multiple discriminants with whereNotIn', () => {
      expect(collect(states).whereNotIn('state', ['idle', 'loading']).pluck('state').toArray())
        .toEqual(['success', 'failure'])
    })

    it('treats an empty whereIn set as matching nothing', () => {
      expect(collect(states).whereIn('state', []).toArray()).toEqual([])
    })

    it('treats an empty whereNotIn set as excluding nothing', () => {
      expect(collect(states).whereNotIn('state', []).toArray()).toEqual(states)
    })

    it('distinguishes nullish from false, zero, and empty strings', () => {
      const values = [
        { value: null },
        { value: undefined },
        { value: false },
        { value: 0 },
        { value: '' },
      ]

      expect(collect(values).whereNull('value').toArray()).toEqual([
        { value: null },
        { value: undefined },
      ])
      expect(collect(values).whereNotNull('value').toArray()).toEqual([
        { value: false },
        { value: 0 },
        { value: '' },
      ])
    })

    it('returns undefined for a narrowed firstWhere miss', () => {
      expect(collect(states).firstWhere('state', 'failure')?.state).toBe('failure')
      expect(collect(states.slice(0, 2)).firstWhere('state', 'failure')).toBeUndefined()
    })

    it('filters subclasses using whereInstanceOf', () => {
      class Parent {}
      class Child extends Parent {}
      const child = new Child()

      expect(collect([child, {}, 'value']).whereInstanceOf(Parent).toArray()).toEqual([child])
    })
  })

  describe('nested array manipulation', () => {
    const values = [1, [2, [3, [4]]]]

    it('preserves nested items at depth zero', () => {
      expect(collect(values).flatten(0).toArray()).toEqual(values)
    })

    it('flattens exactly one requested level', () => {
      expect(collect(values).flatten(1).toArray()).toEqual([1, 2, [3, [4]]])
    })

    it('flattens exactly two requested levels', () => {
      expect(collect(values).flatten(2).toArray()).toEqual([1, 2, 3, [4]])
    })

    it('fully flattens when depth is omitted', () => {
      expect(collect(values).flatten().toArray()).toEqual([1, 2, 3, 4])
    })

    it('collapses one level while retaining scalar items', () => {
      expect(collect([1, [2, 3], 4]).collapse().toArray()).toEqual([1, 2, 3, 4])
    })
  })

  describe('key and property manipulation', () => {
    it('keeps requested symbol keys in only', () => {
      const token = Symbol('token')
      const result = collect([{ id: 1, [token]: 'secret' }]).only(token)

      expect(result.first()).toEqual({ [token]: 'secret' })
      expect(Reflect.ownKeys(result.first()!)).toEqual([token])
    })

    it('ignores nonexistent keys while retaining existing requested keys', () => {
      expect(collect([{ id: 1, name: 'one' }]).only('id', 'missing').toArray())
        .toEqual([{ id: 1 }])
    })

    it('keeps requested numeric keys in only', () => {
      expect(collect([{ 0: 'zero', 1: 'one' }]).only(0).toArray())
        .toEqual([{ 0: 'zero' }])
    })

    it('overwrites an existing literal property with put', () => {
      expect(collect([{ active: false }] as const).put('active', true).toArray())
        .toEqual([{ active: true }])
    })

    it('adds a deeply literal property with put', () => {
      expect(collect([{ id: 1 }]).put('metadata', { source: 'import' } as const).toArray())
        .toEqual([{ id: 1, metadata: { source: 'import' } }])
    })

    it('uses defaults only for undefined values', () => {
      expect(collect([{ value: 0 }]).get('value', 10)).toBe(0)
      expect(collect([{ value: false }]).get('value', true)).toBe(false)
      expect(collect([{ value: '' }]).get('value', 'fallback')).toBe('')
      expect(collect([{ value: null }]).get('value', 'fallback')).toBeNull()
      expect(collect([{ value: undefined }]).get('value', 'fallback')).toBe('fallback')
    })

    it('returns a default for an empty typed collection', () => {
      expect(collect<{ value?: string }>([]).get('value', 'fallback')).toBe('fallback')
    })

    it('combines missing values as explicit undefined properties', () => {
      expect(collect(['first', 'second'] as const).combine([1] as const).first())
        .toEqual({ first: 1, second: undefined })
    })
  })

  describe('heterogeneous set operations', () => {
    it('merges unrelated item types', () => {
      expect(collect([1, 2]).merge(['a', 'b'] as const).toArray()).toEqual([1, 2, 'a', 'b'])
    })

    it('unions unrelated item types while preserving first occurrence order', () => {
      expect(collect([1, 2, 1]).union(['a', 2, 'a']).toArray()).toEqual([1, 2, 'a'])
    })

    it('intersects NaN using Set equality semantics', () => {
      expect(collect([Number.NaN, 1]).intersect([Number.NaN]).toArray()).toEqual([Number.NaN])
    })

    it('intersects objects by reference identity', () => {
      const shared = { id: 1 }
      expect(collect([shared, { id: 1 }]).intersect([shared]).toArray()).toEqual([shared])
    })

    it('supports heterogeneous splice insertions', () => {
      expect(collect([1, 2, 3]).splice(1, 1, 'middle' as const).toArray())
        .toEqual([1, 'middle', 3])
    })

    it('does not change element types when splice inserts nothing', () => {
      expect(collect([1, 2, 3]).splice(1, 1).toArray()).toEqual([1, 3])
    })

    it('computes symmetric differences across unrelated types', () => {
      expect(collect([1, 2]).symmetricDiff([2, 'a']).toArray()).toEqual([1, 'a'])
    })

    it('builds cartesian tuples across unrelated types', () => {
      expect(collect([1, 2]).cartesianProduct(['a']).toArray()).toEqual([[1, 'a'], [2, 'a']])
    })
  })

  describe('conditional branches', () => {
    it('does not invoke a true-only callback for false when', () => {
      const callback = mock(() => collect(['changed']))
      const result = collect([1, 2]).when(false, callback)

      expect(callback).not.toHaveBeenCalled()
      expect(result.toArray()).toEqual([1, 2])
    })

    it('does not invoke a false-only callback for true unless', () => {
      const callback = mock(() => collect(['changed']))
      const result = collect([1, 2]).unless(true, callback)

      expect(callback).not.toHaveBeenCalled()
      expect(result.toArray()).toEqual([1, 2])
    })

    it('evaluates callback conditions exactly once', () => {
      const condition = mock(() => true)
      const result = collect([1, 2]).when(condition, () => collect(['changed']))

      expect(condition).toHaveBeenCalledTimes(1)
      expect(result.toArray()).toEqual(['changed'])
    })
  })

  describe('joins and overwrites', () => {
    it('uses right-hand values for cross-join key collisions', () => {
      const left = collect([{ id: 1, value: 10 }])
      const right = collect([{ id: 1, value: 'right', label: 'matched' }])

      expect(left.crossJoin(right).toArray()).toEqual([
        { id: 1, value: 'right', label: 'matched' },
      ])
    })

    it('uses right-hand values for matched left-join collisions', () => {
      const left = collect([{ id: 1, value: 10 }])
      const right = collect([{ id: 1, value: 'right', label: 'matched' }])

      expect(left.leftJoin(right, 'id', 'id').toArray()).toEqual([
        { id: 1, value: 'right', label: 'matched' },
      ])
    })

    it('retains original rows when a left join has no match', () => {
      const left = collect([{ id: 1, value: 10 }])
      const right = collect([{ id: 2, value: 'right', label: 'matched' }])

      expect(left.leftJoin(right, 'id', 'id').toArray()).toEqual([{ id: 1, value: 10 }])
    })

    it('uses the last duplicate right row in a left join', () => {
      const left = collect([{ id: 1, value: 10 }])
      const right = collect([
        { id: 1, label: 'first' },
        { id: 1, label: 'last' },
      ])

      expect(left.leftJoin(right, 'id', 'id').first()?.label).toBe('last')
    })
  })

  describe('specialized property overwrites', () => {
    it('overwrites numeric transform fields with numbers', () => {
      const source = collect([{ value: '-1.8' }])

      expect(source.round('value').first()?.value).toBe(-2)
      expect(source.ceil('value').first()?.value).toBe(-1)
      expect(source.floor('value').first()?.value).toBe(-2)
      expect(source.abs('value').first()?.value).toBe(1.8)
      expect(source.clamp('value', 0, 1).first()?.value).toBe(0)
    })

    it('overwrites an existing formatted field with money output', () => {
      const result = collect([{ amount: 12.5, formatted: 123 }]).money('amount')

      expect(result.first()?.formatted).toBe('$12.50')
    })

    it('overwrites an existing score field during search', () => {
      const result = collect([{ text: 'needle', score: 'old' }]).search('needle', ['text'])

      expect(result.first()?.score).toBe(1)
    })

    it('normalizes constant fields to zero', () => {
      expect(collect([{ value: 5 }, { value: 5 }]).normalize('value', 'minmax').pluck('value').toArray())
        .toEqual([0, 0])
    })

    it('keeps normalized empty collections empty', () => {
      expect(collect<{ value: number }>([]).normalize('value', 'zscore').toArray()).toEqual([])
    })

    it('removes zero-score search results', () => {
      expect(collect([{ text: 'haystack', score: 'old' }]).search('needle', ['text']).toArray())
        .toEqual([])
    })
  })

  describe('lazy operation boundaries', () => {
    it('flat-maps readonly tuples into individual lazy values', async () => {
      const result = await collect([1, 2])
        .lazy()
        .flatMap(value => [value, value * 10] as const)
        .toArray()

      expect(result).toEqual([1, 10, 2, 20])
    })

    it('drops empty lazy flat-map results', async () => {
      const result = await collect([1, 2, 3])
        .lazy()
        .flatMap(value => value % 2 === 0 ? [value] : [])
        .toArray()

      expect(result).toEqual([2])
    })

    it('passes source indices to lazy flat-map callbacks', async () => {
      const result = await collect(['a', 'b'])
        .lazy()
        .flatMap((value, index) => [`${index}:${value}`])
        .toArray()

      expect(result).toEqual(['0:a', '1:b'])
    })

    it('allows lazy operations after flat-map', async () => {
      const result = await collect([1, 2])
        .lazy()
        .flatMap(value => [value, value * 10])
        .filter(value => value >= 10)
        .map(value => value + 1)
        .toArray()

      expect(result).toEqual([11, 21])
    })

    it('emits a final partial lazy chunk', async () => {
      const result = await collect([1, 2, 3, 4, 5]).lazy().chunk(2).toArray()

      expect(result).toEqual([[1, 2], [3, 4], [5]])
    })

    it('does not emit an extra chunk for exact multiples', async () => {
      const result = await collect([1, 2, 3, 4]).lazy().chunk(2).toArray()

      expect(result).toEqual([[1, 2], [3, 4]])
    })

    it('does not emit chunks for empty collections', async () => {
      expect(await collect<number>([]).lazy().chunk(2).toArray()).toEqual([])
    })

    it('rejects non-positive lazy chunk sizes', () => {
      expect(() => collect([1]).lazy().chunk(0)).toThrow('Chunk size must be greater than 0')
      expect(() => collect([1]).lazy().chunk(-1)).toThrow('Chunk size must be greater than 0')
    })

    it('narrows lazy Boolean filtering at runtime', async () => {
      const result = await collect(['a', null, '', 'b']).lazy().filter(Boolean).toArray()

      expect(result).toEqual(['a', 'b'])
    })
  })
})
