<p align="center"><img src="https://github.com/stacksjs/ts-collect/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

# Introduction

> `ts-collect`, a powerful, fully-typed collections library for TypeScript, combining Laravel's collection elegance with advanced data processing capabilities. Features lazy evaluation, statistical analysis, machine learning operations, and comprehensive data manipulation tools—all with zero dependencies.

## Features

- Lightweight & Dependency-free
- Fully typed
- Laravel-inspired APIs

### Core Operations (Laravel Collection API)

- Standard operations _(map, filter, reduce)_
- FlatMap and MapSpread operations
- Element access _(first, firstOrFail, last, nth)_
- Subset operations _(take, skip, slice)_
- Unique value handling
- Chunk operations
- Tap and Pipe utilities
- Collection conversion _(toArray, toMap, toSet)_
- Collection inspection _(count, isEmpty, isNotEmpty)_
- Combine and collapse operations
- Contains checks _(contains, containsOneItem)_
- Each iterations _(each, eachSpread)_
- Only and except operations
- Forget and random selection
- Push, prepend, and put operations
- Skip and take variants _(skipUntil, skipWhile, takeUntil, takeWhile)_
- Sole item retrieval
- Conditional execution _(when, unless)_
- Wrap and unwrap operations

### Advanced Array & Object Operations

- GroupBy with multiple key support
- Value extraction _(pluck)_
- Where clause variations
  - Basic where operations _(where, whereIn, whereNotIn)_
  - Range checks _(whereBetween, whereNotBetween)_
  - Null handling _(whereNull, whereNotNull)_
  - Pattern matching _(whereLike, whereRegex)_
  - Type checks _(whereInstanceOf)_
- Comprehensive sorting
  - Basic sort operations
  - Key-based sorting _(sortBy, sortByDesc)_
  - Key sorting _(sortKeys, sortKeysDesc)_
- Pagination & Cursor iteration
- Data partitioning
- Set operations _(union, intersect, diff, symmetricDiff)_
- Advanced products _(cartesianProduct)_
- Recursive operations _(mergeRecursive, replaceRecursive)_

### Advanced Transformations

- Group transformations _(mapToGroups)_
- Array handling _(mapSpread, mapWithKeys)_
- Conditional mapping _(mapUntil, mapOption)_
- Data restructuring _(transform)_
- Type system integration _(cast, mapInto)_
- Property operations _(pick, omit)_
- Fuzzy matching algorithms
- Key-value transformations _(flip, undot)_

### Statistical Operations

- Basic statistics
  - Sum and averages
  - Median and mode
  - Range _(min, max)_
  - Products
- Advanced statistics
  - Standard deviation
  - Variance analysis
  - Percentile calculations
  - Correlation coefficients
  - Entropy measures
  - Z-score computations
  - Distribution analysis _(kurtosis, skewness)_
  - Covariance calculations

### Time Series Analysis

- Series conversion and formatting
- Moving average calculations
- Trend detection and analysis
- Seasonality identification
- Time-based forecasting
- Temporal grouping operations
- Time-based aggregations
- Interval handling

### Machine Learning Operations

- Clustering algorithms
  - K-means implementation
  - Cluster analysis tools
- Regression analysis
  - Linear regression
  - Multi-variable regression
- Classification tools
  - K-nearest neighbors _(KNN)_
  - Naive Bayes classifier
- Anomaly detection systems
- Data preparation
  - Normalization
  - Outlier handling
  - Feature scaling

### Async & Performance Optimization

- Asynchronous operations
  - Async mapping
  - Async filtering
  - Async reduction
- Parallel processing capabilities
- Batch processing systems
- Lazy evaluation strategies
- Caching mechanisms
- Performance tools
  - Profiling utilities
  - Memory optimization
  - Index management
  - Operation monitoring

### Data Validation & Quality

- Validation framework
  - Schema validation
  - Custom rules
  - Async validation
- Data sanitization tools
- Quality metrics
- Constraint management
- Error handling
- Type enforcement

### Text Processing

- String manipulation
  - Join operations
  - Implode functionality
  - Case transformation
- URL slug generation
- Text analysis
  - Word frequency
  - N-gram generation
  - Sentiment analysis
- Pattern matching
- String normalization

### Serialization & Export

- Multiple format support
  - JSON serialization
  - CSV generation
  - XML export
- Query generation
  - SQL queries
  - GraphQL operations
- Integration formats
  - Elasticsearch bulk
  - Pandas DataFrame
- Custom formatting options

### Streaming & I/O

- Stream operations
  - Stream creation
  - Stream consumption
- Batch streaming
- Memory-efficient processing
- Buffered operations

### Advanced Mathematical Operations

- Signal processing
  - Fast Fourier Transform (FFT)
  - Signal interpolation
  - Convolution operations
- Calculus operations
  - Differentiation
  - Integration
- Numerical methods
- Mathematical optimizations

### Special Data Types Support

- Geographic calculations
  - Distance computations
  - Coordinate handling
- Financial operations
  - Money formatting
  - Currency handling
- DateTime operations
  - Formatting
  - Timezone handling
- Complex number support
  - Basic operations
  - Advanced computations

### Versioning & History

- Version management
  - Version tracking
  - History storage
- Change tracking
  - Diff generation
  - Change detection
- History operations
  - Rollback support
  - Version comparison

### Development Tools

- Development aids
  - Playground environment
  - Debugging utilities
- Analysis tools
  - Pipeline visualization
  - Performance benchmarking
- Development modes
  - Debug mode
  - Strict mode

### Utility Features

- System configuration
  - Configuration management
  - Environment handling
- Internationalization
  - Locale support
  - Timezone management
- Error handling
  - Error modes
  - Exception handling
- Resource management
  - Memory tracking
  - Resource cleanup

## Changelog

Please see our [releases](https://github.com/stackjs/ts-collect/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](https://github.com/stackjs/contribute) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-collect/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/ts-collect/blob/main/LICENSE.md) for more information.

Made with 💙
