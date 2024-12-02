import type { CollectionOperations } from './types'
import { collect } from './collect'

/**
 * Helper function to create a collection from a range of numbers
 */
export function range(start: number, end: number, step: number = 1): CollectionOperations<number> {
  const items: number[] = []
  for (let i = start; i <= end; i += step) {
    items.push(i)
  }
  return collect(items)
}

/**
 * Helper function to create a collection from a specific value repeated n times
 */
export function times<T>(n: number, callback: (index: number) => T): CollectionOperations<T> {
  return collect(Array.from({ length: n }, (_, index) => callback(index)))
}

/**
 * Type guard to check if a value is a Collection
 */
export function isCollection<T>(value: any): value is CollectionOperations<T> {
  return value
    && typeof value === 'object'
    && Array.isArray(value.items)
    && typeof value.length === 'number'
    && typeof value.map === 'function'
    && typeof value.filter === 'function'
}

/**
 * Helper function to check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
  )
}

/**
 * Helper function to get the next timestamp based on interval
 */
export function getNextTimestamp(date: Date, interval: 'day' | 'week' | 'month' | 'year'): number {
  const nextDate = new Date(date)

  switch (interval) {
    case 'day':
      nextDate.setDate(date.getDate() + 1)
      break
    case 'week':
      nextDate.setDate(date.getDate() + 7)
      break
    case 'month':
      nextDate.setMonth(date.getMonth() + 1)
      break
    case 'year':
      nextDate.setFullYear(date.getFullYear() + 1)
      break
  }

  return nextDate.getTime()
}

export function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}

// function deepEqual(a: any, b: any): boolean {
//   if (a === b)
//     return true

//   if (typeof a !== 'object' || typeof b !== 'object')
//     return false
//   if (a === null || b === null)
//     return false

//   const keysA = Object.keys(a)
//   const keysB = Object.keys(b)

//   if (keysA.length !== keysB.length)
//     return false

//   for (const key of keysA) {
//     if (!keysB.includes(key))
//       return false
//     if (!deepEqual(a[key], b[key]))
//       return false
//   }

//   return true
// }

// function getItemKey(item: any): string {
//   if ('id' in item)
//     return String(item.id)
//   return JSON.stringify(item)
// }
