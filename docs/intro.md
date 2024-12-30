<p align="center"><img src="https://github.com/stacksjs/ts-collect/blob/main/.github/art/cover.jpg?raw=true" alt="Social Card of this repo"></p>

# Introduction

> `ts-collect`, a powerful, fully-typed collections library for TypeScript, combining Laravel's collection elegance with advanced data processing capabilities. Features lazy evaluation, statistical analysis, machine learning operations, and comprehensive data manipulation tools—all with zero dependencies.

## Features

- Lightweight & Dependency-free
- Fully typed
- Laravel-inspired APIs

### Core Operations (Laravel Collection API)

- Standard operations _([map](/api/map), [filter](/api/filter), [reduce](/api/reduce))_
- FlatMap and MapSpread operations _([flatMap](/api/flatMap), [mapSpread](/api/mapSpread))_
- Element access _([first](/api/first), [firstOrFail](/api/firstOrFail), [last](/api/last), [nth](/api/nth))_
- Subset operations _([take](/api/take), [skip](/api/skip), [slice](/api/slice))_
- Unique value handling _([unique](/api/unique))_
- Chunk operations _([chunk](/api/chunk))_
- Tap and Pipe utilities _([tap](/api/tap), [pipe](/api/pipe))_
- Collection conversion _([toArray](/api/toArray), [toMap](/api/toMap), [toSet](/api/toSet))_
- Collection inspection _([count](/api/count), [isEmpty](/api/isEmpty), [isNotEmpty](/api/isNotEmpty))_
- Combine and collapse operations _([combine](/api/combine), [collapse](/api/collapse))_
- Contains checks _([contains](/api/contains), [containsOneItem](/api/containsOneItem))_
- Each iterations _([each](/api/each), [eachSpread](/api/eachSpread))_
- Only and except operations _([only](/api/only), [except](/api/except))_
- Forget and random selection _([forget](/api/forget), [random](/api/random))_
- Push, prepend, and put operations _([push](/api/push), [prepend](/api/prepend), [put](/api/put))_
- Skip and take variants _([skipUntil](/api/skipUntil), [skipWhile](/api/skipWhile), [takeUntil](/api/takeUntil), [takeWhile](/api/takeWhile))_
- Sole item retrieval _([sole](/api/sole))_
- Conditional execution _([when](/api/when), [unless](/api/unless))_
- Wrap and unwrap operations _([wrap](/api/wrap), [unwrap](/api/unwrap))_

### Advanced Array & Object Operations

- GroupBy with multiple key support _([groupBy](/api/groupBy), [groupByMultiple](/api/groupByMultiple))_
- Value extraction _([pluck](/api/pluck))_
- Where clause variations
  - Basic where operations _([where](/api/where), [whereIn](/api/whereIn), [whereNotIn](/api/whereNotIn))_
  - Range checks _([whereBetween](/api/whereBetween), [whereNotBetween](/api/whereNotBetween))_
  - Null handling _([whereNull](/api/whereNull), [whereNotNull](/api/whereNotNull))_
  - Pattern matching _([whereLike](/api/whereLike), [whereRegex](/api/whereRegex))_
  - Type checks _([whereInstanceOf](/api/whereInstanceOf))_
- Comprehensive sorting
  - Basic sort operations _([sort](/api/sort))_
  - Key-based sorting _([sortBy](/api/sortBy), [sortByDesc](/api/sortByDesc))_
  - Key sorting _([sortKeys](/api/sortKeys), [sortKeysDesc](/api/sortKeysDesc))_
- [Pagination](/api/pagination) & [Cursor](/api/cursor) iteration
- [Data partitioning](/api/partitioning)
- Set operations _([union](/api/union), [intersect](/api/intersect), [diff](/api/diff), [symmetricDiff](/api/symmetricDiff))_
- Advanced products _([cartesianProduct](/api/cartesianProduct))_
- Recursive operations _([mergeRecursive](/api/mergeRecursive), [replaceRecursive](/api/replaceRecursive))_

### Advanced Transformations

- Group transformations _([mapToGroups](/api/mapToGroups))_
- Array handling _([mapSpread](/api/mapSpread), [mapWithKeys](/api/mapWithKeys))_
- Conditional mapping _([mapUntil](/api/mapUntil), [mapOption](/api/mapOption))_
- Data restructuring _([transform](/api/transform))_
- Type system integration _([cast](/api/cast), [mapInto](/api/mapInto))_
- Property operations _([pick](/api/pick), [omit](/api/omit))_
- [Fuzzy matching](/api/fuzzyMatch) algorithms
- Key-value transformations _([flip](/api/flip), [undot](/api/undot))_

### Statistical Operations

- Basic statistics
  - [Sum](/api/sum) and [averages](/api/avg)
  - [Median](/api/median) and [mode](/api/mode)
  - Range _([min](/api/min), [max](/api/max))_
  - [Products](/api/product)
- Advanced statistics
  - [Standard deviation](/api/standarddeviation)
  - [Variance analysis](/api/variance)
  - [Percentile calculations](/api/percentile)
  - [Correlation coefficients](/api/correlation)
  - [Entropy measures](/api/entropy)
  - [Z-score computations](/api/zscore)
  - Distribution analysis _([kurtosis](/api/kurtosis), [skewness](/api/skewness))_
  - [Covariance calculations](/api/covariance)

### Time Series Analysis

- [Series conversion](/api/timeseries) and [formatting](/api/datetime)
- [Moving average calculations](/api/movingAverage)
- [Trend detection](/api/trend) and analysis
- [Seasonality identification](/api/seasonality)
- [Time-based forecasting](/api/forecast)
- [Temporal grouping operations](/api/groupbymultiple)
- [Time-based aggregations](/api/aggregate)
- [Interval handling](/api/timeseries)

### Machine Learning Operations

- Clustering algorithms
  - [K-means implementation](/api/kmeans)
  - [Cluster analysis tools](/api/kmeans)
- Regression analysis
  - [Linear regression](/api/linearRegression)
  - [Multi-variable regression](/api/linearRegression)
- Classification tools
  - [K-nearest neighbors _(KNN)_](/api/knn)
  - [Naive Bayes classifier](/api/naiveBayes)
- [Anomaly detection systems](/api/detectAnomalies)
- Data preparation
  - [Normalization](/api/normalize)
  - [Outlier handling](/api/removeOutliers)
  - [Feature scaling](/api/normalize)

### Async & Performance Optimization

- Asynchronous operations
  - [Async mapping](/api/mapAsync)
  - [Async filtering](/api/filterAsync)
  - [Async reduction](/api/reduceAsync)
- [Parallel processing capabilities](/api/parallel)
- [Batch processing systems](/api/batch)
- [Lazy evaluation strategies](/api/lazy)
- [Caching mechanisms](/api/cache)
- Performance tools
  - [Profiling utilities](/api/profile)
  - [Memory optimization](/api/metrics)
  - [Index management](/api/index)
  - [Operation monitoring](/api/instrument)

### Data Validation & Quality

- Validation framework
  - [Schema validation](/api/validateSync)
  - [Custom rules](/api/validate)
  - [Async validation](/api/validate)
- [Data sanitization tools](/api/sanitize)
- [Quality metrics](/api/metrics)
- Constraint management
- Error handling
- [Type enforcement](/api/assertValid)

### Text Processing

- String manipulation
  - [Join operations](/api/join)
  - [Implode functionality](/api/implode)
  - [Case transformation](/api/lower)
- [URL slug generation](/api/slug)
- Text analysis
  - [Word frequency](/api/wordFrequency)
  - [N-gram generation](/api/ngrams)
  - [Sentiment analysis](/api/sentiment)
- Pattern matching
- String normalization

### Serialization & Export

- Multiple format support
  - [JSON serialization](/api/toJSON)
  - [CSV generation](/api/toCSV)
  - [XML export](/api/toXML)
- Query generation
  - [SQL queries](/api/toSQL)
  - [GraphQL operations](/api/toGraphQL)
- Integration formats
  - [Elasticsearch bulk](/api/toElastic)
  - [Pandas DataFrame](/api/toPandas)
- Custom formatting options

### Streaming & I/O

- Stream operations
  - [Stream creation](/api/stream)
  - [Stream consumption](/api/fromstream)
- [Batch streaming](/api/batch)
- Memory-efficient processing
- Buffered operations

### Advanced Mathematical Operations

- Signal processing
  - [Fast Fourier Transform (FFT)](/api/fft)
  - [Signal interpolation](/api/interpolate)
  - [Convolution operations](/api/convolve)
- Calculus operations
  - [Differentiation](/api/differentiate)
  - [Integration](/api/integrate)
- Numerical methods
- Mathematical optimizations

### Special Data Types Support

- Geographic calculations
  - [Distance computations](/api/geodistance)
  - [Coordinate handling](/api/geodistance)
- Financial operations
  - [Money formatting](/api/money)
  - [Currency handling](/api/money)
- DateTime operations
  - [Formatting](/api/datetime)
  - [Timezone handling](/api/datetime)
- Complex number support
  - Basic operations
  - Advanced computations

### Versioning & History

- Version management
  - [Version tracking](/api/snapshot)
  - [History storage](/api/snapshot)
- Change tracking
  - [Diff generation](/api/diff)
  - [Change detection](/api/diffsummary)
- History operations
  - Rollback support
  - Version comparison

### Development Tools

- Development aids
  - [Playground environment](/api/playground)
  - [Debugging utilities](/api/debug)
- Analysis tools
  - [Pipeline visualization](/api/explain)
  - [Performance benchmarking](/api/benchmark)
- Development modes
  - Debug mode
  - Strict mode

### Utility Features

- System configuration
  - [Configuration management](/api/configure)
  - Environment handling
- Internationalization
  - [Locale support](/api/configure)
  - [Timezone management](/api/datetime)
- Error handling
  - Error modes
  - Exception handling
- Resource management
  - Memory tracking
  - Resource cleanup

## Available Methods

Please note, all of these methods may be chained to fluently manipulate the underlying data:

| API Methods              |      API Methods       |     API Methods       |
| ------------------------ | ---------------------- | -------------------- |
| [avg](/api/avg)                     | [batch](/api/batch)             | [cache](/api/cache)                 |
| [cartesianProduct](/api/cartesianProduct)        | [cast](/api/cast)                | [chunk](/api/chunk)                 |
| [collapse](/api/collapse)                | [combine](/api/combine)             | [contains](/api/contains)              |
| [containsOneItem](/api/containsOneItem)         | [count](/api/count)               | [countBy](/api/countBy)               |
| [cursor](/api/cursor)                  | [dd](/api/dd)                  | [describe](/api/describe)              |
| [diff](/api/diff)                    | [diffAssoc](/api/diffAssoc)           | [diffKeys](/api/diffKeys)              |
| [each](/api/each)                    | [eachSpread](/api/eachSpread)          | [except](/api/except)                |
| [filter](/api/filter)                  | [first](/api/first)               | [firstOrFail](/api/firstOrFail)           |
| [firstWhere](/api/firstWhere)              | [flatMap](/api/flatMap)             | [flip](/api/flip)                  |
| [forget](/api/forget)                  | [fuzzyMatch](/api/fuzzyMatch)          | [get](/api/get)                   |
| [groupBy](/api/groupBy)                 | [groupByMultiple](/api/groupByMultiple)     | [has](/api/has)                   |
| [index](/api/index)                   | [instrument](/api/instrument)          | [intersect](/api/intersect)             |
| [isEmpty](/api/isEmpty)                 | [isNotEmpty](/api/isNotEmpty)          | [join](/api/join)                  |
| [last](/api/last)                    | [lazy](/api/lazy)                | [map](/api/map)                   |
| [mapAsync](/api/mapAsync)                | [mapInto](/api/mapInto)             | [mapOption](/api/mapOption)            |
| [mapSpread](/api/mapSpread)              | [mapToGroups](/api/mapToGroups)         | [mapUntil](/api/mapUntil)             |
| [mapWithKeys](/api/mapWithKeys)           | [max](/api/max)                 | [median](/api/median)                |
| [mergeRecursive](/api/mergeRecursive)       | [min](/api/min)                 | [mode](/api/mode)                  |
| [nth](/api/nth)                    | [omit](/api/omit)                | [only](/api/only)                  |
| [paginate](/api/paginate)               | [partition](/api/partition)           | [pick](/api/pick)                  |
| [pipe](/api/pipe)                   | [pluck](/api/pluck)               | [prepend](/api/prepend)               |
| [product](/api/product)                | [profile](/api/profile)             | [push](/api/push)                  |
| [random](/api/random)                 | [reduce](/api/reduce)              | [replaceRecursive](/api/replaceRecursive) |
| [sanitize](/api/sanitize)               | [skip](/api/skip)                | [skipUntil](/api/skipUntil)            |
| [skipWhile](/api/skipWhile)              | [slice](/api/slice)               | [sole](/api/sole)                  |
| [sort](/api/sort)                   | [sortBy](/api/sortBy)              | [sortByDesc](/api/sortByDesc)           |
| [sortKeys](/api/sortKeys)               | [sortKeysDesc](/api/sortKeysDesc)        | [standardDeviation](/api/standardDeviation) |
| [sum](/api/sum)                    | [symmetricDiff](/api/symmetricDiff)      | [take](/api/take)                  |
| [takeUntil](/api/takeUntil)             | [takeWhile](/api/takeWhile)           | [tap](/api/tap)                   |
| [toArray](/api/toArray)                | [toCSV](/api/toCSV)               | [toElastic](/api/toElastic)            |
| [toGraphQL](/api/toGraphQL)             | [toJSON](/api/toJSON)              | [toMap](/api/toMap)                 |
| [toPandas](/api/toPandas)               | [toSet](/api/toSet)               | [toSQL](/api/toSQL)                 |
| [toXML](/api/toXML)                  | [transform](/api/transform)           | [union](/api/union)                 |
| [unique](/api/unique)                 | [unless](/api/unless)              | [unwrap](/api/unwrap)                |
| [variance](/api/variance)               | [where](/api/where)               | [whereBetween](/api/whereBetween)       |
| [whereIn](/api/whereIn)                | [whereInstanceOf](/api/whereInstanceOf)    | [whereLike](/api/whereLike)            |
| [whereNotBetween](/api/whereNotBetween)       | [whereNotIn](/api/whereNotIn)          | [whereNotNull](/api/whereNotNull)         |
| [whereNull](/api/whereNull)              | [whereRegex](/api/whereRegex)           | [wrap](/api/wrap)                  |
| [zscore](/api/zscore)                  |                              |                              |

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
