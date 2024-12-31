# DateTime Method

The `dateTime()` method formats date fields into locale-specific strings using the specified format.

## Basic Syntax

```typescript
dateTime<K extends keyof T>(
  key: K,
  format: string = 'en-US'
): CollectionOperations<T & { formatted: string }>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const orders = collect([
  { id: 1, createdAt: new Date('2024-01-15T10:30:00') }
])

const formatted = orders.dateTime('createdAt')
console.log(formatted.first())
// { id: 1, createdAt: [Date], formatted: '1/15/2024, 10:30 AM' }

// Different locales
const frenchDates = orders.dateTime('createdAt', 'fr-FR')
// { id: 1, createdAt: [Date], formatted: '15/01/2024 10:30' }
```

### Working with Different Formats

```typescript
interface Event {
  id: string
  timestamp: Date
  type: string
}

const events = collect<Event>([
  {
    id: 'E1',
    timestamp: new Date('2024-01-15T14:30:00'),
    type: 'login'
  }
])

// Format for different regions
const usFormat = events.dateTime('timestamp', 'en-US')
const ukFormat = events.dateTime('timestamp', 'en-GB')
const jpFormat = events.dateTime('timestamp', 'ja-JP')
```

### Real-world Example: E-commerce Order Timeline

```typescript
interface OrderEvent {
  orderId: string
  event: string
  timestamp: Date
  metadata?: Record<string, any>
}

class OrderTimeline {
  private events: Collection<OrderEvent>

  constructor(events: OrderEvent[]) {
    this.events = collect(events)
  }

  generateTimeline(locale = 'en-US') {
    return this.events
      .sortBy('timestamp')
      .dateTime('timestamp', locale)
      .map(event => ({
        ...event,
        displayEvent: this.formatEvent(event.event),
        timeSince: this.getTimeSince(event.timestamp)
      }))
  }

  getLocalizedTimelines() {
    return {
      us: this.generateTimeline('en-US'),
      uk: this.generateTimeline('en-GB'),
      eu: this.generateTimeline('de-DE'),
      asia: this.generateTimeline('ja-JP')
    }
  }

  private formatEvent(event: string): string {
    const eventMap: Record<string, string> = {
      'order_placed': 'Order Placed',
      'payment_received': 'Payment Confirmed',
      'processing': 'Processing Order',
      'shipped': 'Order Shipped'
    }
    return eventMap[event] || event
  }

  private getTimeSince(date: Date): string {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes/60)}h ago`
    return `${Math.floor(minutes/1440)}d ago`
  }
}

// Usage
const timeline = new OrderTimeline([
  {
    orderId: 'ORD1',
    event: 'order_placed',
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    orderId: 'ORD1',
    event: 'payment_received',
    timestamp: new Date('2024-01-15T10:35:00')
  }
])

const localTimelines = timeline.getLocalizedTimelines()
```

## Type Safety

```typescript
interface Record {
  id: string
  date: Date
  title: string
}

const records = collect<Record>([
  { id: '1', date: new Date(), title: 'Test' }
])

// Type-safe date formatting
const formatted = records.dateTime('date')

// Won't work with non-date fields
// records.dateTime('title') // ✗ TypeScript error

// Type includes formatted string
type ResultType = typeof formatted.first()
// Record & { formatted: string }
```

## Return Value

- Returns Collection with added formatted field
- Formatted strings use locale-specific format
- Proper date and time components
- Timezone handling
- Language-specific names
- Cultural preferences

## Common Use Cases

### 1. Order Management

- Order timestamps
- Delivery schedules
- Processing timelines
- Shipping updates
- Payment history

### 2. User Activity

- Login history
- Action timestamps
- Event logging
- Session tracking
- Audit trails

### 3. Content Management

- Publication dates
- Release schedules
- Update timestamps
- Version history
- Content lifecycle

### 4. Reporting

- Transaction logs
- Activity reports
- Performance metrics
- Time-based analysis
- Period summaries

### 5. International Business

- Multi-timezone support
- Regional formatting
- Local time display
- Global scheduling
- Cross-border operations
