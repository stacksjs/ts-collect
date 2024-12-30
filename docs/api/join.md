# Join Method

The `join()` method concatenates all string elements in the collection into a single string with an optional separator. This method is only available on collections of strings.

## Basic Syntax

```typescript
join(separator?: string): string
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const words = collect(['Hello', 'World'])
console.log(words.join(' '))
// "Hello World"

const tags = collect(['php', 'laravel', 'typescript'])
console.log(tags.join(', '))
// "php, laravel, typescript"
```

### Working with String Arrays

```typescript
const paths = collect(['user', 'profile', 'settings'])
const urlPath = `/${paths.join('/')}`
console.log(urlPath)
// "/user/profile/settings"

const cssClasses = collect(['bg-blue', 'text-white', 'p-4'])
const className = cssClasses.join(' ')
console.log(className)
// "bg-blue text-white p-4"
```

### Real-world Example: E-commerce URL Generation

```typescript
class UrlGenerator {
  private segments: Collection<string>

  constructor(segments: string[] = []) {
    this.segments = collect(segments)
  }

  generateProductUrl(product: {
    category: string
    subCategory?: string
    slug: string
  }): string {
    const urlParts = collect(['products'])

    if (product.category) {
      urlParts.push(this.slugify(product.category))
    }

    if (product.subCategory) {
      urlParts.push(this.slugify(product.subCategory))
    }

    urlParts.push(product.slug)

    return `/${urlParts.join('/')}`
  }

  generateBreadcrumbText(segments: string[]): string {
    return collect(segments)
      .map(segment => this.capitalize(segment))
      .join(' > ')
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
}

// Usage
const urlGenerator = new UrlGenerator()

const productUrl = urlGenerator.generateProductUrl({
  category: 'Electronics',
  subCategory: 'Laptops',
  slug: 'pro-laptop-2024'
})
console.log(productUrl)
// "/products/electronics/laptops/pro-laptop-2024"

const breadcrumb = urlGenerator.generateBreadcrumbText([
  'home',
  'electronics',
  'laptops'
])
console.log(breadcrumb)
// "Home > Electronics > Laptops"
```

## Type Safety

```typescript
// Only works with string collections
const strings = collect(['a', 'b', 'c'])
const result: string = strings.join(',') // ✓ Valid

// Won't work with number collections
const numbers = collect([1, 2, 3])
// numbers.join(',') // ✗ TypeScript error

// Type checking for separator
const validSeparator: string = '-'
strings.join(validSeparator) // ✓ Valid

// numbers as separators not allowed
// strings.join(5) // ✗ TypeScript error
```

## Return Value

- Returns a string combining all elements
- Empty string if collection is empty
- Empty separator if not specified
- Maintains type safety through generics
- Automatically converts values to strings
- Preserves order of elements

## Common Use Cases

### 1. URL Generation

- Building path segments
- Query parameters
- URL slugs
- Route generation
- Breadcrumbs

### 2. Text Formatting

- List formatting
- CSV generation
- Text concatenation
- String building
- Content assembly

### 3. HTML/CSS Classes

- Class name concatenation
- Style generation
- Attribute building
- Tag composition
- DOM manipulation

### 4. File Paths

- Directory paths
- File names
- Path segments
- Route mapping
- Navigation paths

### 5. Display Text

- Menu items
- Navigation links
- Breadcrumb trails
- List formatting
- Status messages
