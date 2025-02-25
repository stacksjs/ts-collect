<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# ts-collect

> A powerful, fully-typed collections library for TypeScript, combining Laravel's collection elegance with advanced data processing capabilities. Features a fluent API, lazy evaluation, statistical analysis, machine learning operations, and comprehensive data manipulation tools—all with zero dependencies.

## Features

- Lightweight & Dependency-free
- Type safe
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

## Available Methods

Please note, all of these methods may be chained to fluently manipulate the underlying data:

| API Methods | API Methods | API Methods |
| --- | --- | --- |
| [_aggregate_](https://ts-collect.netlify.app/api/aggregate) | [_all_](https://ts-collect.netlify.app/api/all) | [_as_](https://ts-collect.netlify.app/api/as) |
| [_assertValid_](https://ts-collect.netlify.app/api/assertValid) | [_avg_](https://ts-collect.netlify.app/api/avg) | [_batch_](https://ts-collect.netlify.app/api/batch) |
| [_benchmark_](https://ts-collect.netlify.app/api/benchmark) | [_cache_](https://ts-collect.netlify.app/api/cache) | [_cartesianProduct_](https://ts-collect.netlify.app/api/cartesianProduct) |
| [_cast_](https://ts-collect.netlify.app/api/cast) | [_chunk_](https://ts-collect.netlify.app/api/chunk) | [_collapse_](https://ts-collect.netlify.app/api/collapse) |
| [_combine_](https://ts-collect.netlify.app/api/combine) | [_configure_](https://ts-collect.netlify.app/api/configure) | [_contains_](https://ts-collect.netlify.app/api/contains) |
| [_containsAll_](https://ts-collect.netlify.app/api/containsAll) | [_containsOneItem_](https://ts-collect.netlify.app/api/containsOneItem) | [_convolve_](https://ts-collect.netlify.app/api/convolve) |
| [_correlate_](https://ts-collect.netlify.app/api/correlate) | [_count_](https://ts-collect.netlify.app/api/count) | [_countBy_](https://ts-collect.netlify.app/api/countBy) |
| [_crossJoin_](https://ts-collect.netlify.app/api/crossJoin) | [_cursor_](https://ts-collect.netlify.app/api/cursor) | [_dateTime_](https://ts-collect.netlify.app/api/dateTime) |
| [_debug_](https://ts-collect.netlify.app/api/debug) | [_dd_](https://ts-collect.netlify.app/api/dd) | [_describe_](https://ts-collect.netlify.app/api/describe) |
| [_detectAnomalies_](https://ts-collect.netlify.app/api/detectAnomalies) | [_differentiate_](https://ts-collect.netlify.app/api/differentiate) | [_diffAssoc_](https://ts-collect.netlify.app/api/diffAssoc) |
| [_diffKeys_](https://ts-collect.netlify.app/api/diffKeys) | [_diffUsing_](https://ts-collect.netlify.app/api/diffUsing) | [_doesntContain_](https://ts-collect.netlify.app/api/doesntContain) |
| [_dump_](https://ts-collect.netlify.app/api/dump) | [_duplicates_](https://ts-collect.netlify.app/api/duplicates) | [_each_](https://ts-collect.netlify.app/api/each) |
| [_eachSpread_](https://ts-collect.netlify.app/api/eachSpread) | [_entropy_](https://ts-collect.netlify.app/api/entropy) | [_everyAsync_](https://ts-collect.netlify.app/api/everyAsync) |
| [_explain_](https://ts-collect.netlify.app/api/explain) | [_except_](https://ts-collect.netlify.app/api/except) | [_fft_](https://ts-collect.netlify.app/api/fft) |
| [_filter_](https://ts-collect.netlify.app/api/filter) | [_filterAsync_](https://ts-collect.netlify.app/api/filterAsync) | [_first_](https://ts-collect.netlify.app/api/first) |
| [_firstOrFail_](https://ts-collect.netlify.app/api/firstOrFail) | [_firstWhere_](https://ts-collect.netlify.app/api/firstWhere) | [_flatten_](https://ts-collect.netlify.app/api/flatten) |
| [_flatMap_](https://ts-collect.netlify.app/api/flatMap) | [_flip_](https://ts-collect.netlify.app/api/flip) | [_forPage_](https://ts-collect.netlify.app/api/forPage) |
| [_forecast_](https://ts-collect.netlify.app/api/forecast) | [_forget_](https://ts-collect.netlify.app/api/forget) | [_fromStream_](https://ts-collect.netlify.app/api/fromStream) |
| [_fuzzyMatch_](https://ts-collect.netlify.app/api/fuzzyMatch) | [_geoDistance_](https://ts-collect.netlify.app/api/geoDistance) | [_get_](https://ts-collect.netlify.app/api/get) |
| [_groupBy_](https://ts-collect.netlify.app/api/groupBy) | [_groupByMultiple_](https://ts-collect.netlify.app/api/groupByMultiple) | [_has_](https://ts-collect.netlify.app/api/has) |
| [_having_](https://ts-collect.netlify.app/api/having) | [_impute_](https://ts-collect.netlify.app/api/impute) | [_implode_](https://ts-collect.netlify.app/api/implode) |
| [_index_](https://ts-collect.netlify.app/api/index) | [_instrument_](https://ts-collect.netlify.app/api/instrument) | [_integrate_](https://ts-collect.netlify.app/api/integrate) |
| [_intersect_](https://ts-collect.netlify.app/api/intersect) | [_isEmpty_](https://ts-collect.netlify.app/api/isEmpty) | [_isNotEmpty_](https://ts-collect.netlify.app/api/isNotEmpty) |
| [_join_](https://ts-collect.netlify.app/api/join) | [_kmeans_](https://ts-collect.netlify.app/api/kmeans) | [_keyBy_](https://ts-collect.netlify.app/api/keyBy) |
| [_keys_](https://ts-collect.netlify.app/api/keys) | [_knn_](https://ts-collect.netlify.app/api/knn) | [_kurtosis_](https://ts-collect.netlify.app/api/kurtosis) |
| [_last_](https://ts-collect.netlify.app/api/last) | [_lazy_](https://ts-collect.netlify.app/api/lazy) | [_leftJoin_](https://ts-collect.netlify.app/api/leftJoin) |
| [_linearRegression_](https://ts-collect.netlify.app/api/linearRegression) | [_lower_](https://ts-collect.netlify.app/api/lower) | [_macro_](https://ts-collect.netlify.app/api/macro) |
| [_make_](https://ts-collect.netlify.app/api/make) | [_map_](https://ts-collect.netlify.app/api/map) | [_mapAsync_](https://ts-collect.netlify.app/api/mapAsync) |
| [_mapInto_](https://ts-collect.netlify.app/api/mapInto) | [_mapOption_](https://ts-collect.netlify.app/api/mapOption) | [_mapSpread_](https://ts-collect.netlify.app/api/mapSpread) |
| [_mapToDictionary_](https://ts-collect.netlify.app/api/mapToDictionary) | [_mapToGroups_](https://ts-collect.netlify.app/api/mapToGroups) | [_mapUntil_](https://ts-collect.netlify.app/api/mapUntil) |
| [_mapWithKeys_](https://ts-collect.netlify.app/api/mapWithKeys) | [_max_](https://ts-collect.netlify.app/api/max) | [_median_](https://ts-collect.netlify.app/api/median) |
| [_memoize_](https://ts-collect.netlify.app/api/memoize) | [_merge_](https://ts-collect.netlify.app/api/merge) | [_mergeRecursive_](https://ts-collect.netlify.app/api/mergeRecursive) |
| [_metrics_](https://ts-collect.netlify.app/api/metrics) | [_min_](https://ts-collect.netlify.app/api/min) | [_mode_](https://ts-collect.netlify.app/api/mode) |
| [_money_](https://ts-collect.netlify.app/api/money) | [_movingAverage_](https://ts-collect.netlify.app/api/movingAverage) | [_naiveBayes_](https://ts-collect.netlify.app/api/naiveBayes) |
| [_ngrams_](https://ts-collect.netlify.app/api/ngrams) | [_nth_](https://ts-collect.netlify.app/api/nth) | [_normalize_](https://ts-collect.netlify.app/api/normalize) |
| [_omit_](https://ts-collect.netlify.app/api/omit) | [_only_](https://ts-collect.netlify.app/api/only) | [_optimize_](https://ts-collect.netlify.app/api/optimize) |
| [_outliers_](https://ts-collect.netlify.app/api/outliers) | [_pad_](https://ts-collect.netlify.app/api/pad) | [_paginate_](https://ts-collect.netlify.app/api/paginate) |
| [_parallel_](https://ts-collect.netlify.app/api/parallel) | [_partition_](https://ts-collect.netlify.app/api/partition) | [_percentile_](https://ts-collect.netlify.app/api/percentile) |
| [_pick_](https://ts-collect.netlify.app/api/pick) | [_pipe_](https://ts-collect.netlify.app/api/pipe) | [_pivot_](https://ts-collect.netlify.app/api/pivot) |
| [_pivotTable_](https://ts-collect.netlify.app/api/pivotTable) | [_pop_](https://ts-collect.netlify.app/api/pop) | [_power_](https://ts-collect.netlify.app/api/power) |
| [_prefetch_](https://ts-collect.netlify.app/api/prefetch) | [_prepend_](https://ts-collect.netlify.app/api/prepend) | [_product_](https://ts-collect.netlify.app/api/product) |
| [_profile_](https://ts-collect.netlify.app/api/profile) | [_pull_](https://ts-collect.netlify.app/api/pull) | [_push_](https://ts-collect.netlify.app/api/push) |
| [_put_](https://ts-collect.netlify.app/api/put) | [_query_](https://ts-collect.netlify.app/api/query) | [_random_](https://ts-collect.netlify.app/api/random) |
| [_reduce_](https://ts-collect.netlify.app/api/reduce) | [_reduceAsync_](https://ts-collect.netlify.app/api/reduceAsync) | [_reject_](https://ts-collect.netlify.app/api/reject) |
| [_removeOutliers_](https://ts-collect.netlify.app/api/removeOutliers) | [_replace_](https://ts-collect.netlify.app/api/replace) | [_replaceRecursive_](https://ts-collect.netlify.app/api/replaceRecursive) |
| [_reverse_](https://ts-collect.netlify.app/api/reverse) | [_sanitize_](https://ts-collect.netlify.app/api/sanitize) | [_scan_](https://ts-collect.netlify.app/api/scan) |
| [_search_](https://ts-collect.netlify.app/api/search) | [_seasonality_](https://ts-collect.netlify.app/api/seasonality) | [_sentiment_](https://ts-collect.netlify.app/api/sentiment) |
| [_shift_](https://ts-collect.netlify.app/api/shift) | [_shuffle_](https://ts-collect.netlify.app/api/shuffle) | [_skip_](https://ts-collect.netlify.app/api/skip) |
| [_skipUntil_](https://ts-collect.netlify.app/api/skipUntil) | [_skipWhile_](https://ts-collect.netlify.app/api/skipWhile) | [_slice_](https://ts-collect.netlify.app/api/slice) |
| [_slug_](https://ts-collect.netlify.app/api/slug) | [_sole_](https://ts-collect.netlify.app/api/sole) | [_someAsync_](https://ts-collect.netlify.app/api/someAsync) |
| [_sort_](https://ts-collect.netlify.app/api/sort) | [_sortBy_](https://ts-collect.netlify.app/api/sortBy) | [_sortByDesc_](https://ts-collect.netlify.app/api/sortByDesc) |
| [_sortDesc_](https://ts-collect.netlify.app/api/sortDesc) | [_sortKeys_](https://ts-collect.netlify.app/api/sortKeys) | [_sortKeysDesc_](https://ts-collect.netlify.app/api/sortKeysDesc) |
| [_splice_](https://ts-collect.netlify.app/api/splice) | [_split_](https://ts-collect.netlify.app/api/split) | [_standardDeviation_](https://ts-collect.netlify.app/api/standardDeviation) |
| [_stream_](https://ts-collect.netlify.app/api/stream) | [_sum_](https://ts-collect.netlify.app/api/sum) | [_symmetricDiff_](https://ts-collect.netlify.app/api/symmetricDiff) |
| [_tap_](https://ts-collect.netlify.app/api/tap) | [_take_](https://ts-collect.netlify.app/api/take) | [_takeUntil_](https://ts-collect.netlify.app/api/takeUntil) |
| [_takeWhile_](https://ts-collect.netlify.app/api/takeWhile) | [_timeSeries_](https://ts-collect.netlify.app/api/timeSeries) | [_times_](https://ts-collect.netlify.app/api/times) |
| [_toArray_](https://ts-collect.netlify.app/api/toArray) | [_toCSV_](https://ts-collect.netlify.app/api/toCSV) | [_toElastic_](https://ts-collect.netlify.app/api/toElastic) |
| [_toGraphQL_](https://ts-collect.netlify.app/api/toGraphQL) | [_toJSON_](https://ts-collect.netlify.app/api/toJSON) | [_toMap_](https://ts-collect.netlify.app/api/toMap) |
| [_toPandas_](https://ts-collect.netlify.app/api/toPandas) | [_toSet_](https://ts-collect.netlify.app/api/toSet) | [_toSQL_](https://ts-collect.netlify.app/api/toSQL) |
| [_toXML_](https://ts-collect.netlify.app/api/toXML) | [_transform_](https://ts-collect.netlify.app/api/transform) | [_trend_](https://ts-collect.netlify.app/api/trend) |
| [_union_](https://ts-collect.netlify.app/api/union) | [_unless_](https://ts-collect.netlify.app/api/unless) | [_unlessEmpty_](https://ts-collect.netlify.app/api/unlessEmpty) |
| [_unlessNotEmpty_](https://ts-collect.netlify.app/api/unlessNotEmpty) | [_unfold_](https://ts-collect.netlify.app/api/unfold) | [_unwrap_](https://ts-collect.netlify.app/api/unwrap) |
| [_upper_](https://ts-collect.netlify.app/api/upper) | [_validate_](https://ts-collect.netlify.app/api/validate) | [_validateSync_](https://ts-collect.netlify.app/api/validateSync) |
| [_values_](https://ts-collect.netlify.app/api/values) | [_variance_](https://ts-collect.netlify.app/api/variance) | [_when_](https://ts-collect.netlify.app/api/when) |
| [_whenEmpty_](https://ts-collect.netlify.app/api/whenEmpty) | [_whenNotEmpty_](https://ts-collect.netlify.app/api/whenNotEmpty) | [_where_](https://ts-collect.netlify.app/api/where) |
| [_whereBetween_](https://ts-collect.netlify.app/api/whereBetween) | [_whereIn_](https://ts-collect.netlify.app/api/whereIn) | [_whereInstanceOf_](https://ts-collect.netlify.app/api/whereInstanceOf) |
| [_whereLike_](https://ts-collect.netlify.app/api/whereLike) | [_whereNotBetween_](https://ts-collect.netlify.app/api/whereNotBetween) | [_whereNotIn_](https://ts-collect.netlify.app/api/whereNotIn) |
| [_whereNotNull_](https://ts-collect.netlify.app/api/whereNotNull) | [_whereNull_](https://ts-collect.netlify.app/api/whereNull) | [_whereRegex_](https://ts-collect.netlify.app/api/whereRegex) |
| [_wordFrequency_](https://ts-collect.netlify.app/api/wordFrequency) | [_wrap_](https://ts-collect.netlify.app/api/wrap) | [_zscore_](https://ts-collect.netlify.app/api/zscore) |

## Get Started

```bash
bun install ts-collect
```

## Usage

### Basic Collection Operations

```typescript
import { collect } from 'ts-collect'

// Create a collection
const collection = collect([1, 2, 3, 4, 5])

// Basic operations with chaining
const result = collection
  .map(n => n * 2) // [2, 4, 6, 8, 10]
  .filter(n => n > 5) // [6, 8, 10]
  .take(2) // [6, 8]
  .toArray()

// Unique values with custom key
const users = collect([
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'admin' }
])
const uniqueRoles = users.unique('role') // [{ id: 1, role: 'admin' }, { id: 2, role: 'user' }]

// Chunk data into smaller arrays
const chunks = collection.chunk(2) // [[1, 2], [3, 4], [5]]

// Find elements
const first = collection.first() // 1
const last = collection.last() // 5
const secondItem = collection.nth(1) // 2

// all() - Get all items as array
const items = collection.all() // [1, 2, 3, 4, 5]

// average/avg - Calculate average of items
collection.average() // 3
collection.avg() // 3

// chunk - Split collection into smaller collections
collection.chunk(2) // [[1, 2], [3, 4], [5]]

// collapse - Flatten a collection of arrays
const nested = collect([[1, 2], [3, 4], [5]])
nested.collapse() // [1, 2, 3, 4, 5]

// combine - Create collection by combining arrays
const keys = collect(['name', 'age'])
const values = ['John', 25]
keys.combine(values) // { name: 'John', age: 25 }

// contains/containsOneItem - Check for item existence
collection.contains(3) // true
collection.containsOneItem() // false

// countBy - Count occurrences by value
const items = collect(['apple', 'banana', 'apple', 'orange'])
items.countBy() // Map { 'apple' => 2, 'banana' => 1, 'orange' => 1 }

// diff/diffAssoc/diffKeys - Find differences between collections
const col1 = collect([1, 2, 3])
const col2 = collect([2, 3, 4])
col1.diff(col2) // [1]

// dd/dump - Dump collection and die or just dump
collection.dump() // Console logs items
collection.dd() // Console logs and exits

// each/eachSpread - Iterate over items
collection.each(item => console.log(item))
collection.eachSpread((a, b) => console.log(a, b)) // For array items

// except/only - Get all items except/only specified keys
const user = collect({ id: 1, name: 'John', age: 25 })
user.except('age') // { id: 1, name: 'John' }
user.only('name', 'age') // { name: 'John', age: 25 }

// firstOrFail - Get first item or throw
collection.firstOrFail() // 1 or throws if empty

// firstWhere - Get first item matching criteria
const users = collect([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])
users.firstWhere('name', 'Jane') // { id: 2, name: 'Jane' }

// flip - Swap keys and values
const flipped = collect({ name: 'John' }).flip() // { John: 'name' }

// forget - Remove an item by key
const array = collect(['a', 'b', 'c'])
array.forget(1) // ['a', 'c']

// has/get - Check key existence / Get value
const item = collect({ name: 'John' })
item.has('name') // true
item.get('name') // 'John'

// mapInto - Map items into new class instances
class User {
  name: string = ''
  greet() { return `Hello ${this.name}` }
}
collect([{ name: 'John' }])
  .mapInto(User)
  .first()
  .greet() // "Hello John"

// prepend/push/put - Add items
collection.prepend(0) // [0, 1, 2, 3, 4, 5]
collection.push(6) // [1, 2, 3, 4, 5, 6]
collection.put('key', 'value') // Adds/updates key-value

// random - Get random item(s)
collection.random() // Random item
collection.random(2) // Array of 2 random items

// skip/skipUntil/skipWhile - Skip items
collection.skip(2) // [3, 4, 5]
collection.skipUntil(3) // [3, 4, 5]
collection.skipWhile(n => n < 3) // [3, 4, 5]

// sole - Get only item in single-item collection
collect([1]).sole() // 1 (throws if not exactly one item)

// take/takeUntil/takeWhile - Take items
collection.take(2) // [1, 2]
collection.takeUntil(3) // [1, 2]
collection.takeWhile(n => n < 3) // [1, 2]

// when/unless - Conditional execution
collection
  .when(true, col => col.take(3))
  .unless(false, col => col.take(2))

// wrap/unwrap - Wrap/unwrap value in collection
collect().wrap([1, 2, 3]) // Collection([1, 2, 3])
collection.unwrap() // [1, 2, 3]
```

### Working with Objects

```typescript
interface User {
  id: number
  name: string
  role: string
}

const users: User[] = [
  { id: 1, name: 'John', role: 'admin' },
  { id: 2, name: 'Jane', role: 'user' },
  { id: 3, name: 'Bob', role: 'user' }
]

const collection = collect(users)

// Group by a key
const byRole = collection.groupBy('role')
// Map { 'admin' => [{ id: 1, ... }], 'user' => [{ id: 2, ... }, { id: 3, ... }] }

// Pluck specific values
const names = collection.pluck('name')
// ['John', 'Jane', 'Bob']

// Find where
const admins = collection.where('role', 'admin')
// [{ id: 1, name: 'John', role: 'admin' }]
```

### Advanced Array & Object Operations

```typescript
interface User {
  id: number
  name: string
  role: string
  department: string
  salary: number
  joinedAt: Date
}

const users: User[] = [
  {
    id: 1,
    name: 'John',
    role: 'admin',
    department: 'IT',
    salary: 80000,
    joinedAt: new Date('2023-01-15')
  },
  {
    id: 2,
    name: 'Jane',
    role: 'manager',
    department: 'Sales',
    salary: 90000,
    joinedAt: new Date('2023-03-20')
  },
  {
    id: 3,
    name: 'Bob',
    role: 'developer',
    department: 'IT',
    salary: 75000,
    joinedAt: new Date('2023-06-10')
  }
]

const collection = collect(users)

// Complex grouping by multiple fields
const groupedUsers = collection.groupByMultiple('department', 'role')
// Map {
//   'IT::admin' => [{ id: 1, ... }],
//   'Sales::manager' => [{ id: 2, ... }],
//   'IT::developer' => [{ id: 3, ... }]
// }

// Advanced filtering combinations
const seniorITStaff = collection
  .where('department', 'IT')
  .filter((user) => {
    const monthsEmployed = (new Date().getTime() - user.joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
    return monthsEmployed > 6
  })
  .whereBetween('salary', 70000, 85000)
  .toArray()

// Sort by multiple fields
const sorted = collection
  .sortBy('department')
  .sortBy('salary', 'desc')
  .toArray()

// Transform data structure
const transformed = collection.transform<{ fullName: string, info: string }>({
  fullName: user => user.name,
  info: user => `${user.role} in ${user.department}`
})

// Pagination
const page = collection.paginate(2, 1) // 2 items per page, first page
// {
//   data: [...],
//   total: 3,
//   perPage: 2,
//   currentPage: 1,
//   lastPage: 2,
//   hasMorePages: true
// }
```

### Advanced Filtering & Pattern Matching

```typescript
interface Product {
  id: number
  name: string
  description: string
  price: number
  categories: string[]
  inStock: boolean
}

const products = collect<Product>([
  {
    id: 1,
    name: 'Premium Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1299.99,
    categories: ['electronics', 'computers'],
    inStock: true
  },
  // ... more products
])

// Fuzzy search
const searchResults = products.fuzzyMatch('name', 'laptop', 0.8)

// Regular expression matching
const matched = products.whereRegex('description', /\d+GB/)

// Complex conditional filtering
const filtered = products
  .when(true, collection =>
    collection.filter(p => p.price > 1000))
  .unless(false, collection =>
    collection.filter(p => p.inStock))

// Pattern matching with whereLike
const pattern = products.whereLike('name', '%Laptop%')
```

### Statistical Operations

```typescript
const numbers = collect([1, 2, 3, 4, 5, 6])

numbers.sum() // 21
numbers.avg() // 3.5
numbers.median() // 3.5
numbers.min() // 1
numbers.max() // 6
numbers.standardDeviation() // { population: 1.707825127659933, sample: 1.8708286933869707 }
```

### Time Series Data

```typescript
const timeData = [
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 150 },
  { date: '2024-01-03', value: 120 }
]

const series = collect(timeData).timeSeries({
  dateField: 'date',
  valueField: 'value',
  interval: 'day'
})

// Calculate moving average
const movingAvg = series.movingAverage({ window: 2 })
```

### Lazy Evaluation

```typescript
const huge = collect(Array.from({ length: 1000000 }, (_, i) => i))

// Operations are deferred until needed
const result = huge
  .lazy()
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .take(5)
  .toArray()
```

### Async Operations & Batch Processing

```typescript
// Process large datasets in batches
const largeDataset = collect(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  data: `Data ${i}`
})))

// Parallel processing with batches
await largeDataset.parallel(
  async (batch) => {
    const processed = await processItems(batch)
    return processed
  },
  { chunks: 4, maxConcurrency: 2 }
)

// Async mapping
const asyncMapped = await largeDataset
  .mapAsync(async (item) => {
    const result = await fetchDataForItem(item)
    return { ...item, ...result }
  })

// Batch processing with cursor
for await (const batch of largeDataset.cursor(100)) {
  await processBatch(batch)
}
```

### Data Validation & Sanitization

```typescript
interface UserData {
  email: string
  age: number
  username: string
}

const userData = collect<UserData>([
  { email: 'john@example.com', age: 25, username: 'john_doe' },
  { email: 'invalid-email', age: -5, username: 'admin' }
])

// Validate data
const validationResult = await userData.validate({
  email: [
    email => /^[^@]+@[^@][^.@]*\.[^@]+$/.test(email),
    email => email.length <= 255
  ],
  age: [
    age => age >= 0,
    age => age <= 120
  ],
  username: [
    username => username.length >= 3,
    username => /^\w+$/.test(username)
  ]
})

// Sanitize data
const sanitized = userData.sanitize({
  email: email => email.toLowerCase().trim(),
  age: age => Math.max(0, Math.min(120, age)),
  username: username => username.toLowerCase().replace(/\W/g, '')
})
```

### Data Analysis & Statistics

```typescript
interface SalesData {
  product: string
  revenue: number
  cost: number
  date: string
  region: string
}

const sales: SalesData[] = [
  { product: 'A', revenue: 100, cost: 50, date: '2024-01-01', region: 'North' },
  { product: 'B', revenue: 200, cost: 80, date: '2024-01-01', region: 'South' },
  { product: 'A', revenue: 150, cost: 60, date: '2024-01-02', region: 'North' },
  { product: 'B', revenue: 180, cost: 75, date: '2024-01-02', region: 'South' },
]

const salesCollection = collect(sales)

// Advanced statistical analysis
const stats = salesCollection
  .describe('revenue') // Get statistical summary
  .pluck('revenue')
  .pipe(numbers => ({
    sum: numbers.sum(),
    average: numbers.avg(),
    median: numbers.median(),
    stdDev: numbers.standardDeviation(),
    variance: numbers.variance()
  }))

// Pivot table analysis
const pivotData = salesCollection.pivotTable(
  'product', // rows
  'region', // columns
  'revenue', // values
  'sum' // aggregation method
)

// Time series analysis with moving averages
const timeSeries = salesCollection
  .timeSeries({
    dateField: 'date',
    valueField: 'revenue',
    interval: 'day'
  })
  .movingAverage({ window: 2, centered: true })

// Correlation analysis
const correlation = salesCollection.correlate('revenue', 'cost')

// Detect anomalies in revenue
const anomalies = salesCollection.detectAnomalies({
  method: 'zscore',
  threshold: 2,
  features: ['revenue']
})
```

### Performance Optimization

```typescript
// Cache expensive operations
const cached = collection
  .map(expensiveOperation)
  .cache(60000) // Cache for 60 seconds

// Lazy evaluation for large datasets
const lazy = collection
  .lazy()
  .filter(predicate)
  .map(transform)
  .take(10)

// Optimize queries with indexing
const indexed = collection
  .index(['id', 'category'])
  .where('category', 'electronics')
  .where('id', 123)

// Profile performance
const metrics = await collection.profile()
// { time: 123, memory: 456 }

// Instrumentation
collection
  .instrument(stats => console.log('Operation stats:', stats))
  .map(transform)
  .filter(predicate)
```

### Advanced Serialization

```typescript
// Export to different formats
const json = collection.toJSON({ pretty: true })
const csv = collection.toCSV()
const xml = collection.toXML()

// SQL generation
const sql = collection.toSQL('users')

// GraphQL query generation
const graphql = collection.toGraphQL('User')

// Elasticsearch bulk format
const elastic = collection.toElastic('users')

// Pandas DataFrame generation
const pandas = collection.toPandas()
```

### Type Safety

```typescript
interface Product {
  id: number
  name: string
  price: number
}

// Collection is fully typed
const products = collect<Product>([
  { id: 1, name: 'Widget', price: 9.99 }
])

// TypeScript will catch errors
products.where('invalid', 'value') // Type error!
```

For more detailed documentation and examples, please visit our documentation site.

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/ts-collect/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-starter/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Postcardware

“Software that is free, but hopes for a postcard.” We love receiving postcards from around the world showing where `ts-collect` is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## Credits

_Thanks to..._

- [Laravel Collections](https://laravel.com/docs/main/collections) for inspiration
- [Chris Breuer](https://github.com/chrisbreuer) for the initial implementation
- [All Contributors](https://github.com/stacksjs/ts-collect/graphs/contributors) for their contributions to Stacks & ts-collect

## 📄 License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ts-collect?style=flat-square
[npm-version-href]: https://npmjs.com/package/ts-collect
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-collect/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-collect/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-collect/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-collect -->
