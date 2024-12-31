# GeoDistance Method

The `geoDistance()` method calculates the Haversine distance between coordinates in a collection and a reference point, returning items with their distances.

## Basic Syntax

```typescript
geoDistance<K extends keyof T>(
  key: K,
  point: readonly [number, number],
  unit: 'km' | 'mi' = 'km'
): CollectionOperations<T & { distance: number }>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const locations = collect([
  { id: 1, coords: [40.7128, -74.0060] },  // NYC
  { id: 2, coords: [34.0522, -118.2437] }  // LA
])

// Distance from Chicago [41.8781, -87.6298]
const distances = locations.geoDistance(
  'coords',
  [41.8781, -87.6298],
  'mi'
)

console.log(distances.first())
// {
//   id: 1,
//   coords: [40.7128, -74.0060],
//   distance: 787.91  // Miles to NYC
// }
```

### Working with Store Locations

```typescript
interface Store {
  id: string
  name: string
  location: [number, number]  // [lat, lng]
  type: 'retail' | 'warehouse'
}

const stores = collect<Store>([
  {
    id: 'ST1',
    name: 'Downtown Store',
    location: [40.7128, -74.0060],
    type: 'retail'
  },
  {
    id: 'ST2',
    name: 'Suburb Store',
    location: [40.7589, -73.9851],
    type: 'retail'
  }
])

// Find stores near Times Square [40.7580, -73.9855]
const nearbyStores = stores
  .geoDistance('location', [40.7580, -73.9855])
  .filter(store => store.distance < 10)
  .sortBy('distance')
```

### Real-world Example: E-commerce Delivery Optimization

```typescript
interface DeliveryLocation {
  orderId: string
  address: string
  coordinates: [number, number]
  timeWindow: string
  priority: number
}

class DeliveryOptimizer {
  private locations: Collection<DeliveryLocation>
  private warehouse: readonly [number, number]

  constructor(
    locations: DeliveryLocation[],
    warehouse: [number, number]
  ) {
    this.locations = collect(locations)
    this.warehouse = warehouse
  }

  optimizeRoutes(maxDistance: number = 50) {
    return this.locations
      .geoDistance('coordinates', this.warehouse)
      .map(location => ({
        ...location,
        zone: this.calculateZone(location.distance),
        estimatedTime: this.estimateDeliveryTime(location.distance)
      }))
      .groupBy(location => location.zone)
      .map(group => ({
        zone: group.first()?.zone,
        orders: group.sortBy('priority', 'desc').all(),
        totalDistance: group.sum('distance'),
        estimatedDuration: group.sum('estimatedTime')
      }))
  }

  findNearestDrivers(
    drivers: Array<{ id: string, coordinates: [number, number] }>,
    order: DeliveryLocation
  ) {
    return collect(drivers)
      .geoDistance('coordinates', order.coordinates)
      .filter(driver => driver.distance <= 30)
      .sortBy('distance')
      .take(3)
  }

  private calculateZone(distance: number): string {
    if (distance <= 10) return 'Zone A'
    if (distance <= 25) return 'Zone B'
    return 'Zone C'
  }

  private estimateDeliveryTime(distance: number): number {
    const baseTime = 15  // Base time in minutes
    const timePerKm = 2  // Minutes per kilometer
    return baseTime + (distance * timePerKm)
  }
}

// Usage
const optimizer = new DeliveryOptimizer([
  {
    orderId: 'ORD1',
    address: '123 Main St',
    coordinates: [40.7128, -74.0060],
    timeWindow: '9AM-11AM',
    priority: 1
  }
], [40.7580, -73.9855])

const routes = optimizer.optimizeRoutes()
const nearestDrivers = optimizer.findNearestDrivers([
  { id: 'D1', coordinates: [40.7300, -73.9950] }
], {
  orderId: 'ORD1',
  address: '123 Main St',
  coordinates: [40.7128, -74.0060],
  timeWindow: '9AM-11AM',
  priority: 1
})
```

## Type Safety

```typescript
interface Location {
  name: string
  coords: [number, number]
}

const locations = collect<Location>([
  { name: 'Store', coords: [40.7128, -74.0060] }
])

// Type-safe coordinate access
const result = locations.geoDistance(
  'coords',
  [41.8781, -87.6298]
)

// Type includes distance
type ResultType = typeof result.first()
// Location & { distance: number }

// Type checking for coordinates
// locations.geoDistance('name', [0, 0]) // ✗ TypeScript error
```

## Return Value

- Returns Collection of original items with distance field
- Distances in kilometers (default) or miles
- Uses Haversine formula
- Accounts for Earth's curvature
- Maintains precision
- Handles invalid coordinates

## Common Use Cases

### 1. Delivery Optimization

- Route planning
- Driver assignment
- Zone planning
- Coverage analysis
- Time estimation

### 2. Store Location

- Nearest store
- Coverage analysis
- Service areas
- Store clustering
- Market analysis

### 3. Service Planning

- Service areas
- Coverage maps
- Resource allocation
- Territory planning
- Access analysis

### 4. Customer Analysis

- Market reach
- Service availability
- Customer clustering
- Coverage gaps
- Expansion planning

### 5. Logistics

- Route optimization
- Fleet management
- Delivery zones
- Resource placement
- Distribution planning
