# naiveBayes Method

The `naiveBayes()` method implements a Naive Bayes classifier that predicts a categorical label based on given features. It returns a classifier function that can be used to predict labels for new items.

## Basic Syntax

```typescript
naiveBayes<K extends keyof T>(
  features: K[],
  label: K
): (item: Pick<T, K>) => T[K]
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const data = collect([
  { color: 'red', size: 'large', category: 'A' },
  { color: 'blue', size: 'small', category: 'B' },
  { color: 'red', size: 'small', category: 'A' }
])

const classifier = data.naiveBayes(
  ['color', 'size'],
  'category'
)

const prediction = classifier({ color: 'red', size: 'small' })
console.log(prediction) // 'A'
```

### Feature Classification

```typescript
interface Document {
  words: string[]
  language: string
}

const documents = collect<Document>([
  { words: ['hello', 'world'], language: 'english' },
  { words: ['bonjour', 'monde'], language: 'french' },
  { words: ['hola', 'mundo'], language: 'spanish' }
])

const languageClassifier = documents.naiveBayes(
  ['words'],
  'language'
)
```

### Real-world Example: E-commerce Category Prediction

```typescript
interface Product {
  name: string
  price: number
  description: string
  brand: string
  category: string
}

class ProductCategorizer {
  private trainingData: CollectionOperations<Product>
  private classifier: (item: Pick<Product, 'price' | 'brand'>) => string

  constructor(products: Product[]) {
    this.trainingData = collect(products)
    this.classifier = this.trainingData.naiveBayes(
      ['price', 'brand'],
      'category'
    )
  }

  predictCategory(product: Pick<Product, 'price' | 'brand'>): string {
    return this.classifier(product)
  }

  batchPredict(products: Array<Pick<Product, 'price' | 'brand'>>) {
    return products.map(product => ({
      ...product,
      predictedCategory: this.predictCategory(product)
    }))
  }
}

// Usage example
const categorizer = new ProductCategorizer([
  {
    name: 'Pro Laptop',
    price: 1299,
    description: 'High-performance laptop',
    brand: 'TechCo',
    category: 'Electronics'
  },
  {
    name: 'Office Chair',
    price: 299,
    description: 'Ergonomic chair',
    brand: 'FurnishCo',
    category: 'Furniture'
  },
  {
    name: 'Wireless Mouse',
    price: 49,
    brand: 'TechCo',
    description: 'Bluetooth mouse',
    category: 'Electronics'
  }
])

const newProduct = {
  price: 1199,
  brand: 'TechCo'
}

console.log(categorizer.predictCategory(newProduct))
```

## Return Value

- Returns a classifier function
- Function accepts partial objects with feature keys
- Returns predicted label of same type as training data
- Maintains type safety through generics
- Handles missing feature values
- Uses Laplace smoothing for probability calculation

## Common Use Cases

1. Product Categorization
   - Automatic category assignment
   - Product classification
   - Inventory organization
   - Tag prediction

2. Customer Analysis
   - Customer segmentation
   - Behavior prediction
   - Preference classification
   - Target group identification

3. Content Classification
   - Text categorization
   - Document classification
   - Language detection
   - Topic identification

4. Quality Control
   - Defect prediction
   - Quality classification
   - Automated sorting
   - Issue categorization

5. Risk Assessment
   - Fraud detection
   - Risk classification
   - Order validation
   - Security screening
