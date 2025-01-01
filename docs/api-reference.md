# API Reference

This API reference page provides a list of available methods available in the `ts-collect` package.

## Table of Contents

| API Methods | API Methods | API Methods |
| --- | --- | --- |
| [_aggregate_](/api-reference#aggregate) | [_all_](/api-reference#all) | [_as_](/api-reference#as) |
| [_assertValid_](/api-reference#assertValid) | [_avg_](/api-reference#avg) | [_batch_](/api-reference#batch) |
| [_benchmark_](/api-reference#benchmark) | [_cache_](/api-reference#cache) | [_cartesianProduct_](/api-reference#cartesianProduct) |
| [_cast_](/api-reference#cast) | [_chunk_](/api-reference#chunk) | [_collapse_](/api-reference#collapse) |
| [_combine_](/api-reference#combine) | [_configure_](/api-reference#configure) | [_contains_](/api-reference#contains) |
| [_containsAll_](/api-reference#containsAll) | [_containsOneItem_](/api-reference#containsOneItem) | [_convolve_](/api-reference#convolve) |
| [_correlate_](/api-reference#correlate) | [_count_](/api-reference#count) | [_countBy_](/api-reference#countBy) |
| [_crossJoin_](/api-reference#crossJoin) | [_cursor_](/api-reference#cursor) | [_dateTime_](/api-reference#dateTime) |
| [_debug_](/api-reference#debug) | [_dd_](/api-reference#dd) | [_describe_](/api-reference#describe) |
| [_detectAnomalies_](/api-reference#detectAnomalies) | [_differentiate_](/api-reference#differentiate) | [_diffAssoc_](/api-reference#diffAssoc) |
| [_diffKeys_](/api-reference#diffKeys) | [_diffUsing_](/api-reference#diffUsing) | [_doesntContain_](/api-reference#doesntContain) |
| [_dump_](/api-reference#dump) | [_duplicates_](/api-reference#duplicates) | [_each_](/api-reference#each) |
| [_eachSpread_](/api-reference#eachSpread) | [_entropy_](/api-reference#entropy) | [_everyAsync_](/api-reference#everyAsync) |
| [_explain_](/api-reference#explain) | [_except_](/api-reference#except) | [_fft_](/api-reference#fft) |
| [_filter_](/api-reference#filter) | [_filterAsync_](/api-reference#filterAsync) | [_first_](/api-reference#first) |
| [_firstOrFail_](/api-reference#firstOrFail) | [_firstWhere_](/api-reference#firstWhere) | [_flatten_](/api-reference#flatten) |
| [_flatMap_](/api-reference#flatMap) | [_flip_](/api-reference#flip) | [_forPage_](/api-reference#forPage) |
| [_forecast_](/api-reference#forecast) | [_forget_](/api-reference#forget) | [_fromStream_](/api-reference#fromStream) |
| [_fuzzyMatch_](/api-reference#fuzzyMatch) | [_geoDistance_](/api-reference#geoDistance) | [_get_](/api-reference#get) |
| [_groupBy_](/api-reference#groupBy) | [_groupByMultiple_](/api-reference#groupByMultiple) | [_has_](/api-reference#has) |
| [_having_](/api-reference#having) | [_impute_](/api-reference#impute) | [_implode_](/api-reference#implode) |
| [_index_](/api-reference#index) | [_instrument_](/api-reference#instrument) | [_integrate_](/api-reference#integrate) |
| [_intersect_](/api-reference#intersect) | [_isEmpty_](/api-reference#isEmpty) | [_isNotEmpty_](/api-reference#isNotEmpty) |
| [_join_](/api-reference#join) | [_kmeans_](/api-reference#kmeans) | [_keyBy_](/api-reference#keyBy) |
| [_keys_](/api-reference#keys) | [_knn_](/api-reference#knn) | [_kurtosis_](/api-reference#kurtosis) |
| [_last_](/api-reference#last) | [_lazy_](/api-reference#lazy) | [_leftJoin_](/api-reference#leftJoin) |
| [_linearRegression_](/api-reference#linearRegression) | [_lower_](/api-reference#lower) | [_macro_](/api-reference#macro) |
| [_make_](/api-reference#make) | [_map_](/api-reference#map) | [_mapAsync_](/api-reference#mapAsync) |
| [_mapInto_](/api-reference#mapInto) | [_mapOption_](/api-reference#mapOption) | [_mapSpread_](/api-reference#mapSpread) |
| [_mapToDictionary_](/api-reference#mapToDictionary) | [_mapToGroups_](/api-reference#mapToGroups) | [_mapUntil_](/api-reference#mapUntil) |
| [_mapWithKeys_](/api-reference#mapWithKeys) | [_max_](/api-reference#max) | [_median_](/api-reference#median) |
| [_memoize_](/api-reference#memoize) | [_merge_](/api-reference#merge) | [_mergeRecursive_](/api-reference#mergeRecursive) |
| [_metrics_](/api-reference#metrics) | [_min_](/api-reference#min) | [_mode_](/api-reference#mode) |
| [_money_](/api-reference#money) | [_movingAverage_](/api-reference#movingAverage) | [_naiveBayes_](/api-reference#naiveBayes) |
| [_ngrams_](/api-reference#ngrams) | [_nth_](/api-reference#nth) | [_normalize_](/api-reference#normalize) |
| [_omit_](/api-reference#omit) | [_only_](/api-reference#only) | [_optimize_](/api-reference#optimize) |
| [_outliers_](/api-reference#outliers) | [_pad_](/api-reference#pad) | [_paginate_](/api-reference#paginate) |
| [_parallel_](/api-reference#parallel) | [_partition_](/api-reference#partition) | [_percentile_](/api-reference#percentile) |
| [_pick_](/api-reference#pick) | [_pipe_](/api-reference#pipe) | [_pivot_](/api-reference#pivot) |
| [_pivotTable_](/api-reference#pivotTable) | [_pop_](/api-reference#pop) | [_power_](/api-reference#power) |
| [_prefetch_](/api-reference#prefetch) | [_prepend_](/api-reference#prepend) | [_product_](/api-reference#product) |
| [_profile_](/api-reference#profile) | [_pull_](/api-reference#pull) | [_push_](/api-reference#push) |
| [_put_](/api-reference#put) | [_query_](/api-reference#query) | [_random_](/api-reference#random) |
| [_reduce_](/api-reference#reduce) | [_reduceAsync_](/api-reference#reduceAsync) | [_reject_](/api-reference#reject) |
| [_removeOutliers_](/api-reference#removeOutliers) | [_replace_](/api-reference#replace) | [_replaceRecursive_](/api-reference#replaceRecursive) |
| [_reverse_](/api-reference#reverse) | [_sanitize_](/api-reference#sanitize) | [_scan_](/api-reference#scan) |
| [_search_](/api-reference#search) | [_seasonality_](/api-reference#seasonality) | [_sentiment_](/api-reference#sentiment) |
| [_shift_](/api-reference#shift) | [_shuffle_](/api-reference#shuffle) | [_skip_](/api-reference#skip) |
| [_skipUntil_](/api-reference#skipUntil) | [_skipWhile_](/api-reference#skipWhile) | [_slice_](/api-reference#slice) |
| [_slug_](/api-reference#slug) | [_sole_](/api-reference#sole) | [_someAsync_](/api-reference#someAsync) |
| [_sort_](/api-reference#sort) | [_sortBy_](/api-reference#sortBy) | [_sortByDesc_](/api-reference#sortByDesc) |
| [_sortDesc_](/api-reference#sortDesc) | [_sortKeys_](/api-reference#sortKeys) | [_sortKeysDesc_](/api-reference#sortKeysDesc) |
| [_splice_](/api-reference#splice) | [_split_](/api-reference#split) | [_standardDeviation_](/api-reference#standardDeviation) |
| [_stream_](/api-reference#stream) | [_sum_](/api-reference#sum) | [_symmetricDiff_](/api-reference#symmetricDiff) |
| [_tap_](/api-reference#tap) | [_take_](/api-reference#take) | [_takeUntil_](/api-reference#takeUntil) |
| [_takeWhile_](/api-reference#takeWhile) | [_timeSeries_](/api-reference#timeSeries) | [_times_](/api-reference#times) |
| [_toArray_](/api-reference#toArray) | [_toCSV_](/api-reference#toCSV) | [_toElastic_](/api-reference#toElastic) |
| [_toGraphQL_](/api-reference#toGraphQL) | [_toJSON_](/api-reference#toJSON) | [_toMap_](/api-reference#toMap) |
| [_toPandas_](/api-reference#toPandas) | [_toSet_](/api-reference#toSet) | [_toSQL_](/api-reference#toSQL) |
| [_toXML_](/api-reference#toXML) | [_transform_](/api-reference#transform) | [_trend_](/api-reference#trend) |
| [_union_](/api-reference#union) | [_unless_](/api-reference#unless) | [_unlessEmpty_](/api-reference#unlessEmpty) |
| [_unlessNotEmpty_](/api-reference#unlessNotEmpty) | [_unfold_](/api-reference#unfold) | [_unwrap_](/api-reference#unwrap) |
| [_upper_](/api-reference#upper) | [_validate_](/api-reference#validate) | [_validateSync_](/api-reference#validateSync) |
| [_values_](/api-reference#values) | [_variance_](/api-reference#variance) | [_when_](/api-reference#when) |
| [_whenEmpty_](/api-reference#whenEmpty) | [_whenNotEmpty_](/api-reference#whenNotEmpty) | [_where_](/api-reference#where) |
| [_whereBetween_](/api-reference#whereBetween) | [_whereIn_](/api-reference#whereIn) | [_whereInstanceOf_](/api-reference#whereInstanceOf) |
| [_whereLike_](/api-reference#whereLike) | [_whereNotBetween_](/api-reference#whereNotBetween) | [_whereNotIn_](/api-reference#whereNotIn) |
| [_whereNotNull_](/api-reference#whereNotNull) | [_whereNull_](/api-reference#whereNull) | [_whereRegex_](/api-reference#whereRegex) |
| [_wordFrequency_](/api-reference#wordFrequency) | [_wrap_](/api-reference#wrap) | [_zscore_](/api-reference#zscore) |

## `aggregate`

wip
