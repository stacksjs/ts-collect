# Slug Method

The `slug()` method transforms all strings in the collection into URL-friendly slugs by converting to lowercase, removing special characters, and replacing spaces with hyphens. This method is only available on collections of strings.

## Basic Syntax

```typescript
slug(this: CollectionOperations<string>): CollectionOperations<string>
```

## Examples

### Basic Usage

```typescript
import { collect } from 'ts-collect'

const titles = collect(['Hello World', 'My First Post!'])
const slugs = titles.slug()

console.log(slugs.all())
// ['hello-world', 'my-first-post']
```

### Working with Special Characters

```typescript
const productNames = collect([
  'iPhone 14 Pro (256GB)',
  '15" Laptop & Charger',
  'Wireless Mouse 2.0'
])

const urlSlugs = productNames.slug()
console.log(urlSlugs.all())
// [
//   'iphone-14-pro-256gb',
//   '15-laptop-charger',
//   'wireless-mouse-2-0'
// ]
```

### Real-world Example: E-commerce URL Generator

```typescript
class ProductUrlGenerator {
  private products: Collection<string>

  constructor(productNames: string[]) {
    this.products = collect(productNames)
  }

  generateUrlPaths(): Collection<string> {
    return this.products
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .slug()
      .map(slug => `/products/${slug}`)
  }

  generateBreadcrumbs(category: string, subcategory: string): string {
    return collect([category, subcategory])
      .slug()
      .map(slug => `/category/${slug}`)
      .join(' > ')
  }

  generateSitemap(): Array<{ url: string, title: string }> {
    return this.products
      .map(name => ({
        title: name,
        url: `/products/${this.slugify(name)}`
      }))
      .toArray()
  }

  private slugify(text: string): string {
    return collect([text]).slug().first() || ''
  }
}

// Usage
const urlGenerator = new ProductUrlGenerator([
  'Gaming Laptop Pro',
  'Wireless Gaming Mouse (RGB)',
  '4K HDR Monitor - 32"'
])

console.log(urlGenerator.generateUrlPaths().all())
// [
//   '/products/gaming-laptop-pro',
//   '/products/wireless-gaming-mouse-rgb',
//   '/products/4k-hdr-monitor-32'
// ]

console.log(urlGenerator.generateBreadcrumbs('Electronics', 'Gaming Accessories'))
// '/category/electronics > /category/gaming-accessories'
```

## Type Safety

```typescript
// Only works with string collections
const strings = collect(['Hello World', 'Test Post'])
const slugged: Collection<string> = strings.slug() // ✓ Valid

// Won't work with number collections
const numbers = collect([1, 2, 3])
// numbers.slug() // ✗ TypeScript error

// Type preservation
type StringCollection = CollectionOperations<string>
const result: StringCollection = strings.slug() // ✓ Valid
```

## Return Value

- Returns a new Collection<string> with slugified values
- Original collection remains unchanged
- Maintains the order of elements
- Preserves collection chain methods
- Empty strings remain empty
- Non-string collections not supported

## Common Use Cases

### 1. URL Generation

- Product URLs
- Blog post links
- Category paths
- Tag URLs
- SEO-friendly links

### 2. File Naming

- Image files
- Document paths
- Asset names
- Media storage
- Export files

### 3. Route Generation

- API endpoints
- Page routes
- Navigation paths
- Resource identifiers
- Permalink creation

### 4. SEO Optimization

- Meta URLs
- Canonical links
- Sitemap entries
- Structured data
- Rich snippets

### 5. Content Management

- Article URLs
- Category structures
- Tag management
- Content organization
- Resource linking
