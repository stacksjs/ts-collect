# Linear Regression Method

The `linearRegression()` method performs multiple linear regression analysis on the collection, predicting a dependent variable based on one or more independent variables. It returns coefficients, R-squared value, predictions, and residuals.

## Basic Syntax

```typescript
linearRegression<K extends keyof T>(
  dependent: K,
  independents: K[]
): RegressionResult
```

## Return Type (RegressionResult)

```typescript
interface RegressionResult {
  coefficients: number[]      // First value is intercept, followed by coefficients for each independent variable
  rSquared: number           // R-squared value (0 to 1) indicating fit quality
  predictions: number[]      // Predicted values for each data point
  residuals: number[]       // Differences between actual and predicted values
}
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 5 },
  { x: 4, y: 8 }
])

const regression = data.linearRegression('y', ['x'])

console.log(regression)
// {
//   coefficients: [0.4, 1.9],  // y = 0.4 + 1.9x
//   rSquared: 0.97,
//   predictions: [2.3, 4.2, 6.1, 8.0],
//   residuals: [-0.3, -0.2, -1.1, 0.0]
// }
```

### Working with Multiple Variables

```typescript
interface SalesData {
  revenue: number
  adSpend: number
  customerCount: number
  seasonality: number
}

const salesData = collect<SalesData>([
  { revenue: 100000, adSpend: 20000, customerCount: 500, seasonality: 0.8 },
  { revenue: 150000, adSpend: 25000, customerCount: 600, seasonality: 1.2 },
  { revenue: 120000, adSpend: 22000, customerCount: 550, seasonality: 1.0 }
])

const analysis = salesData.linearRegression(
  'revenue',
  ['adSpend', 'customerCount', 'seasonality']
)
```

### Real-world Example: E-commerce Sales Prediction

```typescript
interface SalesMetrics {
  date: string
  sales: number
  marketingSpend: number
  websiteTraffic: number
  conversionRate: number
  averageOrderValue: number
}

class SalesPredictor {
  private historicalData: Collection<SalesMetrics>

  constructor(data: SalesMetrics[]) {
    this.historicalData = collect(data)
  }

  predictSales(
    marketingSpend: number,
    expectedTraffic: number,
    projectedConversion: number,
    avgOrder: number
  ): number {
    const model = this.historicalData.linearRegression(
      'sales',
      ['marketingSpend', 'websiteTraffic', 'conversionRate', 'averageOrderValue']
    )

    // Get coefficients [intercept, b1, b2, b3, b4]
    const [intercept, b1, b2, b3, b4] = model.coefficients

    // Calculate prediction using regression equation
    const prediction = intercept +
      (b1 * marketingSpend) +
      (b2 * expectedTraffic) +
      (b3 * projectedConversion) +
      (b4 * avgOrder)

    return prediction
  }

  getModelQuality(): {
    rSquared: number
    averageResidual: number
  } {
    const model = this.historicalData.linearRegression(
      'sales',
      ['marketingSpend', 'websiteTraffic', 'conversionRate', 'averageOrderValue']
    )

    return {
      rSquared: model.rSquared,
      averageResidual: model.residuals.reduce((a, b) => a + Math.abs(b), 0) / model.residuals.length
    }
  }
}
```

## Type Safety

```typescript
interface MetricsData {
  target: number
  predictor1: number
  predictor2: number
}

const metrics = collect<MetricsData>([
  { target: 100, predictor1: 20, predictor2: 30 },
  { target: 150, predictor1: 25, predictor2: 35 }
])

// Type-safe regression
const regression = metrics.linearRegression(
  'target',
  ['predictor1', 'predictor2']
)

// TypeScript enforces valid column names
// metrics.linearRegression('invalid', ['predictor1'])  // ✗ TypeScript error
// metrics.linearRegression('target', ['invalid'])      // ✗ TypeScript error
```

## Return Value

- Returns a RegressionResult object containing:
  - `coefficients`: Array of regression coefficients (intercept + variable coefficients)
  - `rSquared`: Coefficient of determination (0-1, higher is better)
  - `predictions`: Array of predicted values for each data point
  - `residuals`: Array of prediction errors (actual - predicted)
- Handles missing data gracefully
- Supports multiple independent variables
- Automatically adds intercept term
- Uses least squares estimation

## Common Use Cases

### 1. Sales Forecasting

- Predicting future revenue
- Analyzing sales drivers
- Estimating marketing impact
- Forecasting seasonal trends

### 2. Pricing Optimization

- Analyzing price elasticity
- Predicting demand
- Optimizing profit margins
- Understanding price sensitivity

### 3. Customer Behavior Analysis

- Predicting customer lifetime value
- Analyzing conversion factors
- Understanding retention drivers
- Forecasting churn probability

### 4. Marketing Performance

- Measuring campaign effectiveness
- Optimizing ad spend
- Predicting conversion rates
- Analyzing channel performance

### 5. Inventory Planning

- Forecasting demand
- Optimizing stock levels
- Predicting reorder points
- Analyzing supply chain factors
