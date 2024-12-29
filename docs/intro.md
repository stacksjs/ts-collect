<p align="center"><img src="https://github.com/stacksjs/ts-collect/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

# Introduction

> `ts-collect`, a powerful, fully-typed collections library for TypeScript, combining Laravel's collection elegance with advanced data processing capabilities. Features lazy evaluation, statistical analysis, machine learning operations, and comprehensive data manipulation tools—all with zero dependencies.

## Features

- Lightweight & Dependency-free
- Fully typed
- Laravel-inspired APIs

### Core Operations (Laravel Collection API)

- Standard operations _([map](https://ts-collect.netlify.app/api/map), [filter](https://ts-collect.netlify.app/api/filter), [reduce](https://ts-collect.netlify.app/api/reduce))_
- FlatMap and MapSpread operations _([flatMap](https://ts-collect.netlify.app/api/flatMap), [mapSpread](https://ts-collect.netlify.app/api/mapSpread))_
- Element access _([first](https://ts-collect.netlify.app/api/first), [firstOrFail](https://ts-collect.netlify.app/api/firstOrFail), [last](https://ts-collect.netlify.app/api/last), [nth](https://ts-collect.netlify.app/api/nth))_
- Subset operations _([take](https://ts-collect.netlify.app/api/take), [skip](https://ts-collect.netlify.app/api/skip), [slice](https://ts-collect.netlify.app/api/slice))_
- Unique value handling _([unique](https://ts-collect.netlify.app/api/unique))_
- Chunk operations _([chunk](https://ts-collect.netlify.app/api/chunk))_
- Tap and Pipe utilities _([tap](https://ts-collect.netlify.app/api/tap), [pipe](https://ts-collect.netlify.app/api/pipe))_
- Collection conversion _([toArray](https://ts-collect.netlify.app/api/toArray), [toMap](https://ts-collect.netlify.app/api/toMap), [toSet](https://ts-collect.netlify.app/api/toSet))_
- Collection inspection _([count](https://ts-collect.netlify.app/api/count), [isEmpty](https://ts-collect.netlify.app/api/isEmpty), [isNotEmpty](https://ts-collect.netlify.app/api/isNotEmpty))_
- Combine and collapse operations _([combine](https://ts-collect.netlify.app/api/combine), [collapse](https://ts-collect.netlify.app/api/collapse))_
- Contains checks _([contains](https://ts-collect.netlify.app/api/contains), [containsOneItem](https://ts-collect.netlify.app/api/containsOneItem))_
- Each iterations _([each](https://ts-collect.netlify.app/api/each), [eachSpread](https://ts-collect.netlify.app/api/eachSpread))_
- Only and except operations _([only](https://ts-collect.netlify.app/api/only), [except](https://ts-collect.netlify.app/api/except))_
- Forget and random selection _([forget](https://ts-collect.netlify.app/api/forget), [random](https://ts-collect.netlify.app/api/random))_
- Push, prepend, and put operations _([push](https://ts-collect.netlify.app/api/push), [prepend](https://ts-collect.netlify.app/api/prepend), [put](https://ts-collect.netlify.app/api/put))_
- Skip and take variants _([skipUntil](https://ts-collect.netlify.app/api/skipUntil), [skipWhile](https://ts-collect.netlify.app/api/skipWhile), [takeUntil](https://ts-collect.netlify.app/api/takeUntil), [takeWhile](https://ts-collect.netlify.app/api/takeWhile))_
- Sole item retrieval _([sole](https://ts-collect.netlify.app/api/sole))_
- Conditional execution _([when](https://ts-collect.netlify.app/api/when), [unless](https://ts-collect.netlify.app/api/unless))_
- Wrap and unwrap operations _([wrap](https://ts-collect.netlify.app/api/wrap), [unwrap](https://ts-collect.netlify.app/api/unwrap))_

### Advanced Array & Object Operations

- GroupBy with multiple key support _([groupBy](https://ts-collect.netlify.app/api/groupBy), [groupByMultiple](https://ts-collect.netlify.app/api/groupByMultiple))_
- Value extraction _([pluck](https://ts-collect.netlify.app/api/pluck))_
- Where clause variations
  - Basic where operations _([where](https://ts-collect.netlify.app/api/where), [whereIn](https://ts-collect.netlify.app/api/whereIn), [whereNotIn](https://ts-collect.netlify.app/api/whereNotIn))_
  - Range checks _([whereBetween](https://ts-collect.netlify.app/api/whereBetween), [whereNotBetween](https://ts-collect.netlify.app/api/whereNotBetween))_
  - Null handling _([whereNull](https://ts-collect.netlify.app/api/whereNull), [whereNotNull](https://ts-collect.netlify.app/api/whereNotNull))_
  - Pattern matching _([whereLike](https://ts-collect.netlify.app/api/whereLike), [whereRegex](https://ts-collect.netlify.app/api/whereRegex))_
  - Type checks _([whereInstanceOf](https://ts-collect.netlify.app/api/whereInstanceOf))_
- Comprehensive sorting
  - Basic sort operations _([sort](https://ts-collect.netlify.app/api/sort))_
  - Key-based sorting _([sortBy](https://ts-collect.netlify.app/api/sortBy), [sortByDesc](https://ts-collect.netlify.app/api/sortByDesc))_
  - Key sorting _([sortKeys](https://ts-collect.netlify.app/api/sortKeys), [sortKeysDesc](https://ts-collect.netlify.app/api/sortKeysDesc))_
- [Pagination](https://ts-collect.netlify.app/api/pagination) & [Cursor](https://ts-collect.netlify.app/api/cursor) iteration
- [Data partitioning](https://ts-collect.netlify.app/api/partitioning)
- Set operations _([union](https://ts-collect.netlify.app/api/union), [intersect](https://ts-collect.netlify.app/api/intersect), [diff](https://ts-collect.netlify.app/api/diff), [symmetricDiff](https://ts-collect.netlify.app/api/symmetricDiff))_
- Advanced products _([cartesianProduct](https://ts-collect.netlify.app/api/cartesianProduct))_
- Recursive operations _([mergeRecursive](https://ts-collect.netlify.app/api/mergeRecursive), [replaceRecursive](https://ts-collect.netlify.app/api/replaceRecursive))_

### Advanced Transformations

- Group transformations _([mapToGroups](https://ts-collect.netlify.app/api/mapToGroups))_
- Array handling _([mapSpread](https://ts-collect.netlify.app/api/mapSpread), [mapWithKeys](https://ts-collect.netlify.app/api/mapWithKeys))_
- Conditional mapping _([mapUntil](https://ts-collect.netlify.app/api/mapUntil), [mapOption](https://ts-collect.netlify.app/api/mapOption))_
- Data restructuring _([transform](https://ts-collect.netlify.app/api/transform))_
- Type system integration _([cast](https://ts-collect.netlify.app/api/cast), [mapInto](https://ts-collect.netlify.app/api/mapInto))_
- Property operations _([pick](https://ts-collect.netlify.app/api/pick), [omit](https://ts-collect.netlify.app/api/omit))_
- [Fuzzy matching](https://ts-collect.netlify.app/api/fuzzyMatch) algorithms
- Key-value transformations _([flip](https://ts-collect.netlify.app/api/flip), [undot](https://ts-collect.netlify.app/api/undot))_

### Statistical Operations

- Basic statistics
  - [Sum](https://ts-collect.netlify.app/api/sum) and [averages](https://ts-collect.netlify.app/api/avg)
  - [Median](https://ts-collect.netlify.app/api/median) and [mode](https://ts-collect.netlify.app/api/mode)
  - Range _([min](https://ts-collect.netlify.app/api/min), [max](https://ts-collect.netlify.app/api/max))_
  - [Products](https://ts-collect.netlify.app/api/product)
- Advanced statistics
  - [Standard deviation](https://ts-collect.netlify.app/api/standarddeviation)
  - [Variance analysis](https://ts-collect.netlify.app/api/variance)
  - [Percentile calculations](https://ts-collect.netlify.app/api/percentile)
  - [Correlation coefficients](https://ts-collect.netlify.app/api/correlation)
  - [Entropy measures](https://ts-collect.netlify.app/api/entropy)
  - [Z-score computations](https://ts-collect.netlify.app/api/zscore)
  - Distribution analysis _([kurtosis](https://ts-collect.netlify.app/api/kurtosis), [skewness](https://ts-collect.netlify.app/api/skewness))_
  - [Covariance calculations](https://ts-collect.netlify.app/api/covariance)

### Time Series Analysis

- [Series conversion](https://ts-collect.netlify.app/api/timeseries) and [formatting](https://ts-collect.netlify.app/api/datetime)
- [Moving average calculations](https://ts-collect.netlify.app/api/movingAverage)
- [Trend detection](https://ts-collect.netlify.app/api/trend) and analysis
- [Seasonality identification](https://ts-collect.netlify.app/api/seasonality)
- [Time-based forecasting](https://ts-collect.netlify.app/api/forecast)
- [Temporal grouping operations](https://ts-collect.netlify.app/api/groupbymultiple)
- [Time-based aggregations](https://ts-collect.netlify.app/api/aggregate)
- [Interval handling](https://ts-collect.netlify.app/api/timeseries)

### Machine Learning Operations

- Clustering algorithms
  - [K-means implementation](https://ts-collect.netlify.app/api/kmeans)
  - [Cluster analysis tools](https://ts-collect.netlify.app/api/kmeans)
- Regression analysis
  - [Linear regression](https://ts-collect.netlify.app/api/linearRegression)
  - [Multi-variable regression](https://ts-collect.netlify.app/api/linearRegression)
- Classification tools
  - [K-nearest neighbors _(KNN)_](https://ts-collect.netlify.app/api/knn)
  - [Naive Bayes classifier](https://ts-collect.netlify.app/api/naiveBayes)
- [Anomaly detection systems](https://ts-collect.netlify.app/api/detectAnomalies)
- Data preparation
  - [Normalization](https://ts-collect.netlify.app/api/normalize)
  - [Outlier handling](https://ts-collect.netlify.app/api/removeOutliers)
  - [Feature scaling](https://ts-collect.netlify.app/api/normalize)

### Async & Performance Optimization

- Asynchronous operations
  - [Async mapping](https://ts-collect.netlify.app/api/mapAsync)
  - [Async filtering](https://ts-collect.netlify.app/api/filterAsync)
  - [Async reduction](https://ts-collect.netlify.app/api/reduceAsync)
- [Parallel processing capabilities](https://ts-collect.netlify.app/api/parallel)
- [Batch processing systems](https://ts-collect.netlify.app/api/batch)
- [Lazy evaluation strategies](https://ts-collect.netlify.app/api/lazy)
- [Caching mechanisms](https://ts-collect.netlify.app/api/cache)
- Performance tools
  - [Profiling utilities](https://ts-collect.netlify.app/api/profile)
  - [Memory optimization](https://ts-collect.netlify.app/api/metrics)
  - [Index management](https://ts-collect.netlify.app/api/index)
  - [Operation monitoring](https://ts-collect.netlify.app/api/instrument)

### Data Validation & Quality

- Validation framework
  - [Schema validation](https://ts-collect.netlify.app/api/validateSync)
  - [Custom rules](https://ts-collect.netlify.app/api/validate)
  - [Async validation](https://ts-collect.netlify.app/api/validate)
- [Data sanitization tools](https://ts-collect.netlify.app/api/sanitize)
- [Quality metrics](https://ts-collect.netlify.app/api/metrics)
- Constraint management
- Error handling
- [Type enforcement](https://ts-collect.netlify.app/api/assertValid)

### Text Processing

- String manipulation
  - [Join operations](https://ts-collect.netlify.app/api/join)
  - [Implode functionality](https://ts-collect.netlify.app/api/implode)
  - [Case transformation](https://ts-collect.netlify.app/api/lower)
- [URL slug generation](https://ts-collect.netlify.app/api/slug)
- Text analysis
  - [Word frequency](https://ts-collect.netlify.app/api/wordFrequency)
  - [N-gram generation](https://ts-collect.netlify.app/api/ngrams)
  - [Sentiment analysis](https://ts-collect.netlify.app/api/sentiment)
- Pattern matching
- String normalization

### Serialization & Export

- Multiple format support
  - [JSON serialization](https://ts-collect.netlify.app/api/toJSON)
  - [CSV generation](https://ts-collect.netlify.app/api/toCSV)
  - [XML export](https://ts-collect.netlify.app/api/toXML)
- Query generation
  - [SQL queries](https://ts-collect.netlify.app/api/toSQL)
  - [GraphQL operations](https://ts-collect.netlify.app/api/toGraphQL)
- Integration formats
  - [Elasticsearch bulk](https://ts-collect.netlify.app/api/toElastic)
  - [Pandas DataFrame](https://ts-collect.netlify.app/api/toPandas)
- Custom formatting options

### Streaming & I/O

- Stream operations
  - [Stream creation](https://ts-collect.netlify.app/api/stream)
  - [Stream consumption](https://ts-collect.netlify.app/api/fromstream)
- [Batch streaming](https://ts-collect.netlify.app/api/batch)
- Memory-efficient processing
- Buffered operations

### Advanced Mathematical Operations

- Signal processing
  - [Fast Fourier Transform (FFT)](https://ts-collect.netlify.app/api/fft)
  - [Signal interpolation](https://ts-collect.netlify.app/api/interpolate)
  - [Convolution operations](https://ts-collect.netlify.app/api/convolve)
- Calculus operations
  - [Differentiation](https://ts-collect.netlify.app/api/differentiate)
  - [Integration](https://ts-collect.netlify.app/api/integrate)
- Numerical methods
- Mathematical optimizations

### Special Data Types Support

- Geographic calculations
  - [Distance computations](https://ts-collect.netlify.app/api/geodistance)
  - [Coordinate handling](https://ts-collect.netlify.app/api/geodistance)
- Financial operations
  - [Money formatting](https://ts-collect.netlify.app/api/money)
  - [Currency handling](https://ts-collect.netlify.app/api/money)
- DateTime operations
  - [Formatting](https://ts-collect.netlify.app/api/datetime)
  - [Timezone handling](https://ts-collect.netlify.app/api/datetime)
- Complex number support
  - Basic operations
  - Advanced computations

### Versioning & History

- Version management
  - [Version tracking](https://ts-collect.netlify.app/api/snapshot)
  - [History storage](https://ts-collect.netlify.app/api/snapshot)
- Change tracking
  - [Diff generation](https://ts-collect.netlify.app/api/diff)
  - [Change detection](https://ts-collect.netlify.app/api/diffsummary)
- History operations
  - Rollback support
  - Version comparison

### Development Tools

- Development aids
  - [Playground environment](https://ts-collect.netlify.app/api/playground)
  - [Debugging utilities](https://ts-collect.netlify.app/api/debug)
- Analysis tools
  - [Pipeline visualization](https://ts-collect.netlify.app/api/explain)
  - [Performance benchmarking](https://ts-collect.netlify.app/api/benchmark)
- Development modes
  - Debug mode
  - Strict mode

### Utility Features

- System configuration
  - [Configuration management](https://ts-collect.netlify.app/api/configure)
  - Environment handling
- Internationalization
  - [Locale support](https://ts-collect.netlify.app/api/configure)
  - [Timezone management](https://ts-collect.netlify.app/api/datetime)
- Error handling
  - Error modes
  - Exception handling
- Resource management
  - Memory tracking
  - Resource cleanup

  ## Collections API

| API Methods              |      API Methods       |     API Methods       |
| ------------------------ | ---------------------- | -------------------- |
| [avg](https://ts-collect.netlify.app/api/avg)                     | [batch](https://ts-collect.netlify.app/api/batch)             | [cache](https://ts-collect.netlify.app/api/cache)                 |
| [cartesianProduct](https://ts-collect.netlify.app/api/cartesianProduct)        | [cast](https://ts-collect.netlify.app/api/cast)                | [chunk](https://ts-collect.netlify.app/api/chunk)                 |
| [collapse](https://ts-collect.netlify.app/api/collapse)                | [combine](https://ts-collect.netlify.app/api/combine)             | [contains](https://ts-collect.netlify.app/api/contains)              |
| [containsOneItem](https://ts-collect.netlify.app/api/containsOneItem)         | [count](https://ts-collect.netlify.app/api/count)               | [countBy](https://ts-collect.netlify.app/api/countBy)               |
| [cursor](https://ts-collect.netlify.app/api/cursor)                  | [dd](https://ts-collect.netlify.app/api/dd)                  | [describe](https://ts-collect.netlify.app/api/describe)              |
| [diff](https://ts-collect.netlify.app/api/diff)                    | [diffAssoc](https://ts-collect.netlify.app/api/diffAssoc)           | [diffKeys](https://ts-collect.netlify.app/api/diffKeys)              |
| [each](https://ts-collect.netlify.app/api/each)                    | [eachSpread](https://ts-collect.netlify.app/api/eachSpread)          | [except](https://ts-collect.netlify.app/api/except)                |
| [filter](https://ts-collect.netlify.app/api/filter)                  | [first](https://ts-collect.netlify.app/api/first)               | [firstOrFail](https://ts-collect.netlify.app/api/firstOrFail)           |
| [firstWhere](https://ts-collect.netlify.app/api/firstWhere)              | [flatMap](https://ts-collect.netlify.app/api/flatMap)             | [flip](https://ts-collect.netlify.app/api/flip)                  |
| [forget](https://ts-collect.netlify.app/api/forget)                  | [fuzzyMatch](https://ts-collect.netlify.app/api/fuzzyMatch)          | [get](https://ts-collect.netlify.app/api/get)                   |
| [groupBy](https://ts-collect.netlify.app/api/groupBy)                 | [groupByMultiple](https://ts-collect.netlify.app/api/groupByMultiple)     | [has](https://ts-collect.netlify.app/api/has)                   |
| [index](https://ts-collect.netlify.app/api/index)                   | [instrument](https://ts-collect.netlify.app/api/instrument)          | [intersect](https://ts-collect.netlify.app/api/intersect)             |
| [isEmpty](https://ts-collect.netlify.app/api/isEmpty)                 | [isNotEmpty](https://ts-collect.netlify.app/api/isNotEmpty)          | [join](https://ts-collect.netlify.app/api/join)                  |
| [last](https://ts-collect.netlify.app/api/last)                    | [lazy](https://ts-collect.netlify.app/api/lazy)                | [map](https://ts-collect.netlify.app/api/map)                   |
| [mapAsync](https://ts-collect.netlify.app/api/mapAsync)                | [mapInto](https://ts-collect.netlify.app/api/mapInto)             | [mapOption](https://ts-collect.netlify.app/api/mapOption)            |
| [mapSpread](https://ts-collect.netlify.app/api/mapSpread)              | [mapToGroups](https://ts-collect.netlify.app/api/mapToGroups)         | [mapUntil](https://ts-collect.netlify.app/api/mapUntil)             |
| [mapWithKeys](https://ts-collect.netlify.app/api/mapWithKeys)           | [max](https://ts-collect.netlify.app/api/max)                 | [median](https://ts-collect.netlify.app/api/median)                |
| [mergeRecursive](https://ts-collect.netlify.app/api/mergeRecursive)       | [min](https://ts-collect.netlify.app/api/min)                 | [mode](https://ts-collect.netlify.app/api/mode)                  |
| [nth](https://ts-collect.netlify.app/api/nth)                    | [omit](https://ts-collect.netlify.app/api/omit)                | [only](https://ts-collect.netlify.app/api/only)                  |
| [paginate](https://ts-collect.netlify.app/api/paginate)               | [partition](https://ts-collect.netlify.app/api/partition)           | [pick](https://ts-collect.netlify.app/api/pick)                  |
| [pipe](https://ts-collect.netlify.app/api/pipe)                   | [pluck](https://ts-collect.netlify.app/api/pluck)               | [prepend](https://ts-collect.netlify.app/api/prepend)               |
| [product](https://ts-collect.netlify.app/api/product)                | [profile](https://ts-collect.netlify.app/api/profile)             | [push](https://ts-collect.netlify.app/api/push)                  |
| [random](https://ts-collect.netlify.app/api/random)                 | [reduce](https://ts-collect.netlify.app/api/reduce)              | [replaceRecursive](https://ts-collect.netlify.app/api/replaceRecursive) |
| [sanitize](https://ts-collect.netlify.app/api/sanitize)               | [skip](https://ts-collect.netlify.app/api/skip)                | [skipUntil](https://ts-collect.netlify.app/api/skipUntil)            |
| [skipWhile](https://ts-collect.netlify.app/api/skipWhile)              | [slice](https://ts-collect.netlify.app/api/slice)               | [sole](https://ts-collect.netlify.app/api/sole)                  |
| [sort](https://ts-collect.netlify.app/api/sort)                   | [sortBy](https://ts-collect.netlify.app/api/sortBy)              | [sortByDesc](https://ts-collect.netlify.app/api/sortByDesc)           |
| [sortKeys](https://ts-collect.netlify.app/api/sortKeys)               | [sortKeysDesc](https://ts-collect.netlify.app/api/sortKeysDesc)        | [standardDeviation](https://ts-collect.netlify.app/api/standardDeviation) |
| [sum](https://ts-collect.netlify.app/api/sum)                    | [symmetricDiff](https://ts-collect.netlify.app/api/symmetricDiff)      | [take](https://ts-collect.netlify.app/api/take)                  |
| [takeUntil](https://ts-collect.netlify.app/api/takeUntil)             | [takeWhile](https://ts-collect.netlify.app/api/takeWhile)           | [tap](https://ts-collect.netlify.app/api/tap)                   |
| [toArray](https://ts-collect.netlify.app/api/toArray)                | [toCSV](https://ts-collect.netlify.app/api/toCSV)               | [toElastic](https://ts-collect.netlify.app/api/toElastic)            |
| [toGraphQL](https://ts-collect.netlify.app/api/toGraphQL)             | [toJSON](https://ts-collect.netlify.app/api/toJSON)              | [toMap](https://ts-collect.netlify.app/api/toMap)                 |
| [toPandas](https://ts-collect.netlify.app/api/toPandas)               | [toSet](https://ts-collect.netlify.app/api/toSet)               | [toSQL](https://ts-collect.netlify.app/api/toSQL)                 |
| [toXML](https://ts-collect.netlify.app/api/toXML)                  | [transform](https://ts-collect.netlify.app/api/transform)           | [union](https://ts-collect.netlify.app/api/union)                 |
| [unique](https://ts-collect.netlify.app/api/unique)                 | [unless](https://ts-collect.netlify.app/api/unless)              | [unwrap](https://ts-collect.netlify.app/api/unwrap)                |
| [variance](https://ts-collect.netlify.app/api/variance)               | [where](https://ts-collect.netlify.app/api/where)               | [whereBetween](https://ts-collect.netlify.app/api/whereBetween)       |
| [whereIn](https://ts-collect.netlify.app/api/whereIn)                | [whereInstanceOf](https://ts-collect.netlify.app/api/whereInstanceOf)    | [whereLike](https://ts-collect.netlify.app/api/whereLike)            |
| [whereNotBetween](https://ts-collect.netlify.app/api/whereNotBetween)       | [whereNotIn](https://ts-collect.netlify.app/api/whereNotIn)          | [whereNotNull](https://ts-collect.netlify.app/api/whereNotNull)         |
| [whereNull](https://ts-collect.netlify.app/api/whereNull)              | [whereRegex](https://ts-collect.netlify.app/api/whereRegex)           | [wrap](https://ts-collect.netlify.app/api/wrap)                  |
| [zscore](https://ts-collect.netlify.app/api/zscore)                  |                              |                              |

## Changelog

Please see our [releases](https://github.com/stackjs/ts-collect/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](https://github.com/stackjs/contribute) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-collect/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Credits

_Thanks to..._

- [Laravel Collections](https://laravel.com/docs/main/collections) for inspiration
- [Chris Breuer](https://github.com/chrisbreuer) for the initial implementation
- [All Contributors](https://github.com/stacksjs/ts-collect/graphs/contributors) for their contributions to Stacks

## License

The MIT License (MIT). Please see [LICENSE](https://github.com/stacksjs/ts-collect/blob/main/LICENSE.md) for more information.

Made with 💙
