# Configure Method

The `configure()` method sets global options for number precision, timezone handling, localization, and error behavior for collection operations.

## Basic Syntax

```typescript
configure(options: {
  precision?: number
  timezone?: string
  locale?: string
  errorHandling?: 'strict' | 'loose'
}): void
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const numbers = collect([1.23456, 2.34567])
numbers.configure({ precision: 2 })

// Numbers will now format to 2 decimal places
console.log(numbers.avg()) // 1.79
```

### Timezone and Locale Settings

```typescript
const data = collect([
  { value: 1234.567, date: new Date() }
])

data.configure({
  precision: 2,
  timezone: 'America/New_York',
  locale: 'en-US'
})
```

### Real-world Example: E-commerce Configuration

```typescript
interface OrderProcessor {
  orders: Collection<Order>
  settings: ProcessorSettings
}

class GlobalStoreConfiguration {
  private processor: OrderProcessor

  constructor(processor: OrderProcessor) {
    this.processor = processor
  }

  configureForRegion(region: 'US' | 'EU' | 'ASIA') {
    const configs = {
      US: {
        precision: 2,
        timezone: 'America/New_York',
        locale: 'en-US',
        errorHandling: 'strict' as const
      },
      EU: {
        precision: 2,
        timezone: 'Europe/Paris',
        locale: 'de-DE',
        errorHandling: 'strict' as const
      },
      ASIA: {
        precision: 0,
        timezone: 'Asia/Tokyo',
        locale: 'ja-JP',
        errorHandling: 'loose' as const
      }
    }

    this.processor.orders.configure(configs[region])
    this.setupRegionalDefaults(region)
  }

  private setupRegionalDefaults(region: 'US' | 'EU' | 'ASIA') {
    // Additional region-specific setup
    const formatters = {
      US: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      EU: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
      ASIA: new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })
    }

    this.processor.settings = {
      formatter: formatters[region],
      region
    }
  }
}

// Usage
const configuration = new GlobalStoreConfiguration(processor)
configuration.configureForRegion('EU')
```

## Type Safety

```typescript
interface ConfigOptions {
  precision?: number
  timezone?: string
  locale?: string
  errorHandling?: 'strict' | 'loose'
}

const collection = collect([1, 2, 3])

// Type-safe configuration
const validConfig: ConfigOptions = {
  precision: 2,
  timezone: 'UTC',
  locale: 'en-US',
  errorHandling: 'strict'
}

collection.configure(validConfig)

// Type checking prevents invalid options
// collection.configure({
//   precision: 'high' // ✗ TypeScript error
// })
```

## Parameters

- `precision`: Number of decimal places for numeric operations
- `timezone`: IANA timezone identifier for date operations
- `locale`: BCP 47 language tag for formatting
- `errorHandling`: Error handling strategy
  - `strict`: Throws errors for invalid operations
  - `loose`: Attempts to recover from errors

## Common Use Cases

### 1. Regional Settings

- Currency formatting
- Date/time display
- Number formatting
- Language preferences
- Timezone handling

### 2. Financial Operations

- Decimal precision
- Currency calculations
- Tax computations
- Price rounding
- Financial reports

### 3. Error Management

- Production environments
- Development settings
- Debug configurations
- Error logging
- Validation rules

### 4. Localization

- International markets
- Regional preferences
- Language settings
- Format standards
- Cultural norms

### 5. System Configuration

- Global defaults
- Application settings
- Processing rules
- Format standards
- Operation modes
