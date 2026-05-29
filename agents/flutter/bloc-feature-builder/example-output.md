# Example Output — Flutter BLoC Feature Builder

Generated from [`example-input.md`](example-input.md).

---

## File: domain/entities/product.dart

```dart
import 'package:equatable/equatable.dart';
import 'package:meta/meta.dart';

@immutable
class Product extends Equatable {
  const Product({
    required this.id,
    required this.name,
    required this.price,
    required this.imageUrl,
    required this.rating,
    required this.category,
  });

  final String id;
  final String name;
  final double price;
  final String imageUrl;
  final double rating;
  final String category;

  @override
  List<Object?> get props => [id, name, price, imageUrl, rating, category];
}
```

---

## File: domain/repositories/product_catalog_repository.dart

```dart
import 'package:dartz/dartz.dart';
import '../entities/product.dart';
import '../failures/failure.dart';

abstract class ProductCatalogRepository {
  Future<Either<Failure, ProductPage>> getProducts({
    String? category,
    required int page,
    required int limit,
  });
}

/// Value object returned by getProducts.
class ProductPage {
  const ProductPage({
    required this.products,
    required this.total,
    required this.currentPage,
    required this.hasMore,
  });

  final List<Product> products;
  final int total;
  final int currentPage;
  final bool hasMore;
}
```

---

## File: domain/failures/failure.dart

```dart
abstract class Failure {
  const Failure();
}

class ServerFailure extends Failure {
  const ServerFailure(this.message);
  final String message;
}

class NetworkFailure extends Failure {
  const NetworkFailure();
}

class CacheFailure extends Failure {
  const CacheFailure();
}
```

---

## File: domain/usecases/get_products_usecase.dart

```dart
import 'package:dartz/dartz.dart';
import '../entities/product.dart';
import '../failures/failure.dart';
import '../repositories/product_catalog_repository.dart';

class GetProductsParams {
  const GetProductsParams({
    this.category,
    required this.page,
    this.limit = 20,
  });

  final String? category;
  final int page;
  final int limit;
}

class GetProductsUseCase {
  const GetProductsUseCase(this.repository);

  final ProductCatalogRepository repository;

  Future<Either<Failure, ProductPage>> call(GetProductsParams params) =>
      repository.getProducts(
        category: params.category,
        page: params.page,
        limit: params.limit,
      );
}
```

---

## File: data/models/product_model.dart

```dart
import '../../domain/entities/product.dart';

class ProductModel extends Product {
  const ProductModel({
    required super.id,
    required super.name,
    required super.price,
    required super.imageUrl,
    required super.rating,
    required super.category,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) => ProductModel(
        id:       json['id'] as String,
        name:     json['name'] as String,
        price:    (json['price'] as num).toDouble(),
        imageUrl: json['imageUrl'] as String,
        rating:   (json['rating'] as num).toDouble(),
        category: json['category'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id':       id,
        'name':     name,
        'price':    price,
        'imageUrl': imageUrl,
        'rating':   rating,
        'category': category,
      };

  // Converts to the pure domain entity.
  Product toEntity() => Product(
        id:       id,
        name:     name,
        price:    price,
        imageUrl: imageUrl,
        rating:   rating,
        category: category,
      );
}

class ProductPageModel {
  const ProductPageModel({
    required this.products,
    required this.total,
    required this.currentPage,
    required this.hasMore,
  });

  final List<ProductModel> products;
  final int total;
  final int currentPage;
  final bool hasMore;

  factory ProductPageModel.fromJson(Map<String, dynamic> json) {
    final data = json['data'] as List<dynamic>;
    final meta = json['meta'] as Map<String, dynamic>;
    return ProductPageModel(
      products:    data.map((e) => ProductModel.fromJson(e as Map<String, dynamic>)).toList(),
      total:       meta['total'] as int,
      currentPage: meta['page'] as int,
      hasMore:     meta['hasMore'] as bool,
    );
  }
}
```

---

## File: data/datasources/product_catalog_remote_datasource.dart

```dart
import 'package:dio/dio.dart';
import '../models/product_model.dart';
import '../../domain/usecases/get_products_usecase.dart';

class ServerException implements Exception {
  const ServerException(this.message);
  final String message;
}

class ProductCatalogRemoteDataSource {
  const ProductCatalogRemoteDataSource(this.dio);

  final Dio dio;

  Future<ProductPageModel> getProducts(GetProductsParams params) async {
    try {
      final queryParams = <String, dynamic>{
        'page':  params.page,
        'limit': params.limit,
      };
      if (params.category != null) {
        queryParams['category'] = params.category;
      }

      final response = await dio.get<Map<String, dynamic>>(
        '/v1/products',
        queryParameters: queryParams,
      );

      if (response.data == null) {
        throw const ServerException('Empty response body');
      }

      return ProductPageModel.fromJson(response.data!);
    } on DioException catch (e) {
      final message = (e.response?.data as Map<String, dynamic>?)?['message'] as String?
          ?? e.message
          ?? 'Request failed';
      throw ServerException(message);
    }
  }
}
```

---

## File: data/repositories/product_catalog_repository_impl.dart

```dart
import 'dart:io';
import 'package:dartz/dartz.dart';
import '../../domain/entities/product.dart';
import '../../domain/failures/failure.dart';
import '../../domain/repositories/product_catalog_repository.dart';
import '../../domain/usecases/get_products_usecase.dart';
import '../datasources/product_catalog_remote_datasource.dart';

class ProductCatalogRepositoryImpl implements ProductCatalogRepository {
  const ProductCatalogRepositoryImpl(this.remoteDataSource);

  final ProductCatalogRemoteDataSource remoteDataSource;

  @override
  Future<Either<Failure, ProductPage>> getProducts({
    String? category,
    required int page,
    required int limit,
  }) async {
    try {
      final pageModel = await remoteDataSource.getProducts(
        GetProductsParams(category: category, page: page, limit: limit),
      );
      return Right(ProductPage(
        products:    pageModel.products.map((m) => m.toEntity()).toList(),
        total:       pageModel.total,
        currentPage: pageModel.currentPage,
        hasMore:     pageModel.hasMore,
      ));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on SocketException {
      return const Left(NetworkFailure());
    }
  }
}
```

---

## File: presentation/cubit/product_catalog_state.dart

```dart
import 'package:equatable/equatable.dart';
import '../../domain/entities/product.dart';

sealed class ProductCatalogState extends Equatable {
  const ProductCatalogState();

  @override
  List<Object?> get props => [];
}

final class ProductCatalogInitial extends ProductCatalogState {
  const ProductCatalogInitial();
}

final class ProductCatalogLoading extends ProductCatalogState {
  const ProductCatalogLoading();
}

/// Emitted while more pages are being fetched (pagination).
/// The existing [products] list is still shown.
final class ProductCatalogLoadingMore extends ProductCatalogState {
  const ProductCatalogLoadingMore({
    required this.products,
    required this.selectedCategory,
  });

  final List<Product> products;
  final String? selectedCategory;

  @override
  List<Object?> get props => [products, selectedCategory];
}

final class ProductCatalogLoaded extends ProductCatalogState {
  const ProductCatalogLoaded({
    required this.products,
    required this.selectedCategory,
    required this.currentPage,
    required this.hasMore,
  });

  final List<Product> products;
  final String? selectedCategory;
  final int currentPage;
  final bool hasMore;

  ProductCatalogLoaded copyWith({
    List<Product>? products,
    String? selectedCategory,
    int? currentPage,
    bool? hasMore,
  }) =>
      ProductCatalogLoaded(
        products:         products ?? this.products,
        selectedCategory: selectedCategory ?? this.selectedCategory,
        currentPage:      currentPage ?? this.currentPage,
        hasMore:          hasMore ?? this.hasMore,
      );

  @override
  List<Object?> get props => [products, selectedCategory, currentPage, hasMore];
}

final class ProductCatalogEmpty extends ProductCatalogState {
  const ProductCatalogEmpty({this.category});
  final String? category;

  @override
  List<Object?> get props => [category];
}

final class ProductCatalogError extends ProductCatalogState {
  const ProductCatalogError(this.message);
  final String message;

  @override
  List<Object?> get props => [message];
}
```

---

## File: presentation/cubit/product_catalog_cubit.dart

```dart
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/product.dart';
import '../../domain/failures/failure.dart';
import '../../domain/usecases/get_products_usecase.dart';
import 'product_catalog_state.dart';

class ProductCatalogCubit extends Cubit<ProductCatalogState> {
  ProductCatalogCubit(this._getProducts) : super(const ProductCatalogInitial());

  final GetProductsUseCase _getProducts;

  static const int _pageSize = 20;

  Future<void> loadProducts({String? category}) async {
    emit(const ProductCatalogLoading());
    final result = await _getProducts(
      GetProductsParams(category: category, page: 1, limit: _pageSize),
    );
    result.fold(
      (failure) => emit(ProductCatalogError(_mapFailure(failure))),
      (page) => page.products.isEmpty
          ? emit(ProductCatalogEmpty(category: category))
          : emit(ProductCatalogLoaded(
              products:         page.products,
              selectedCategory: category,
              currentPage:      1,
              hasMore:          page.hasMore,
            )),
    );
  }

  Future<void> loadMore() async {
    final current = state;
    if (current is! ProductCatalogLoaded || !current.hasMore) return;

    emit(ProductCatalogLoadingMore(
      products:         current.products,
      selectedCategory: current.selectedCategory,
    ));

    final result = await _getProducts(
      GetProductsParams(
        category: current.selectedCategory,
        page:     current.currentPage + 1,
        limit:    _pageSize,
      ),
    );

    result.fold(
      // On load-more failure, restore the previous loaded state without losing existing items.
      (failure) => emit(current),
      (page) => emit(current.copyWith(
        products:    List.of(current.products)..addAll(page.products),
        currentPage: page.currentPage,
        hasMore:     page.hasMore,
      )),
    );
  }

  Future<void> refresh() => loadProducts(
        category: state is ProductCatalogLoaded
            ? (state as ProductCatalogLoaded).selectedCategory
            : null,
      );

  Future<void> filterByCategory(String? category) => loadProducts(category: category);

  String _mapFailure(Failure failure) => switch (failure) {
        ServerFailure f => f.message,
        NetworkFailure _ => 'No internet connection. Check your network and try again.',
        CacheFailure _  => 'Local data error. Please try again.',
        _ => 'An unexpected error occurred.',
      };
}
```

---

## File: presentation/pages/product_catalog_page.dart

```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../cubit/product_catalog_cubit.dart';
import '../cubit/product_catalog_state.dart';
import '../widgets/product_card.dart';
import '../widgets/category_filter_chips.dart';

class ProductCatalogPage extends StatefulWidget {
  const ProductCatalogPage({super.key});

  @override
  State<ProductCatalogPage> createState() => _ProductCatalogPageState();
}

class _ProductCatalogPageState extends State<ProductCatalogPage> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<ProductCatalogCubit>().loadProducts();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController
      ..removeListener(_onScroll)
      ..dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<ProductCatalogCubit>().loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Category filter chips
          BlocBuilder<ProductCatalogCubit, ProductCatalogState>(
            buildWhen: (prev, curr) =>
                curr is ProductCatalogLoaded || curr is ProductCatalogLoading,
            builder: (context, state) {
              final selected = state is ProductCatalogLoaded
                  ? state.selectedCategory
                  : null;
              return CategoryFilterChips(
                selected: selected,
                onSelected: context.read<ProductCatalogCubit>().filterByCategory,
              );
            },
          ),
          // Main content
          Expanded(
            child: BlocBuilder<ProductCatalogCubit, ProductCatalogState>(
              builder: (context, state) => switch (state) {
                ProductCatalogInitial() || ProductCatalogLoading() =>
                  const Center(child: CircularProgressIndicator()),

                ProductCatalogEmpty(:final category) => _EmptyView(
                    category:   category,
                    onRefresh: context.read<ProductCatalogCubit>().refresh,
                  ),

                ProductCatalogError(:final message) => _ErrorView(
                    message: message,
                    onRetry: context.read<ProductCatalogCubit>().refresh,
                  ),

                ProductCatalogLoaded(:final products, :final hasMore) ||
                ProductCatalogLoadingMore(:final products) => RefreshIndicator(
                    onRefresh: context.read<ProductCatalogCubit>().refresh,
                    child: GridView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(12),
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 0.75,
                      ),
                      itemCount: products.length + (state is ProductCatalogLoadingMore ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index >= products.length) {
                          return const Center(child: CircularProgressIndicator());
                        }
                        final product = products[index];
                        return ProductCard(
                          key: ValueKey(product.id),
                          product: product,
                          onTap: () =>
                              Navigator.of(context).pushNamed('/product/${product.id}'),
                        );
                      },
                    ),
                  ),

                _ => const SizedBox.shrink(),
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  const _EmptyView({required this.onRefresh, this.category});
  final String? category;
  final VoidCallback onRefresh;

  @override
  Widget build(BuildContext context) {
    final message = category != null
        ? 'No products found in "$category"'
        : 'No products found';
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.inventory_2_outlined, size: 72),
          const SizedBox(height: 16),
          Text(message, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 24),
          FilledTonalButton(onPressed: onRefresh, child: const Text('Refresh')),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48),
            const SizedBox(height: 16),
            Text('Failed to load products',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Text(message,
                style: Theme.of(context).textTheme.bodySmall,
                textAlign: TextAlign.center),
            const SizedBox(height: 24),
            FilledButton(onPressed: onRetry, child: const Text('Retry')),
          ],
        ),
      ),
    );
  }
}
```

---

## File: presentation/widgets/product_card.dart

```dart
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../domain/entities/product.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.product, required this.onTap});

  final Product product;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: CachedNetworkImage(
                imageUrl: product.imageUrl,
                fit: BoxFit.cover,
                width: double.infinity,
                placeholder: (_, __) =>
                    const ColoredBox(color: Color(0xFFE0E0E0)),
                errorWidget: (_, __, ___) =>
                    const Icon(Icons.broken_image_outlined),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: Theme.of(context).textTheme.bodyMedium,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '\$${product.price.toStringAsFixed(2)}',
                    style: Theme.of(context)
                        .textTheme
                        .titleSmall
                        ?.copyWith(color: Theme.of(context).colorScheme.primary),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, size: 14, color: Color(0xFFFFC107)),
                      const SizedBox(width: 2),
                      Text(
                        product.rating.toStringAsFixed(1),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## File: test/product_catalog_cubit_test.dart (stub)

```dart
import 'package:bloc_test/bloc_test.dart';
import 'package:dartz/dartz.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

// Replace with your actual import paths
import '../lib/domain/entities/product.dart';
import '../lib/domain/failures/failure.dart';
import '../lib/domain/repositories/product_catalog_repository.dart';
import '../lib/domain/usecases/get_products_usecase.dart';
import '../lib/presentation/cubit/product_catalog_cubit.dart';
import '../lib/presentation/cubit/product_catalog_state.dart';

class MockGetProductsUseCase extends Mock implements GetProductsUseCase {}

void main() {
  late MockGetProductsUseCase mockUseCase;
  late ProductCatalogCubit cubit;

  const testProducts = [
    Product(id: '1', name: 'Widget A', price: 9.99, imageUrl: '', rating: 4.2, category: 'tools'),
    Product(id: '2', name: 'Widget B', price: 14.99, imageUrl: '', rating: 3.8, category: 'tools'),
  ];

  setUp(() {
    mockUseCase = MockGetProductsUseCase();
    cubit = ProductCatalogCubit(mockUseCase);
  });

  tearDown(() => cubit.close());

  group('loadProducts', () {
    blocTest<ProductCatalogCubit, ProductCatalogState>(
      'emits [Loading, Loaded] when products are returned',
      build: () {
        when(() => mockUseCase(any())).thenAnswer((_) async => Right(ProductPage(
              products: testProducts, total: 2, currentPage: 1, hasMore: false)));
        return cubit;
      },
      act: (c) => c.loadProducts(),
      expect: () => [
        isA<ProductCatalogLoading>(),
        isA<ProductCatalogLoaded>().having((s) => s.products.length, 'length', 2),
      ],
    );

    blocTest<ProductCatalogCubit, ProductCatalogState>(
      'emits [Loading, Empty] when API returns empty list',
      build: () {
        when(() => mockUseCase(any())).thenAnswer((_) async => Right(ProductPage(
              products: [], total: 0, currentPage: 1, hasMore: false)));
        return cubit;
      },
      act: (c) => c.loadProducts(),
      expect: () => [isA<ProductCatalogLoading>(), isA<ProductCatalogEmpty>()],
    );

    blocTest<ProductCatalogCubit, ProductCatalogState>(
      'emits [Loading, Error] on NetworkFailure',
      build: () {
        when(() => mockUseCase(any()))
            .thenAnswer((_) async => const Left(NetworkFailure()));
        return cubit;
      },
      act: (c) => c.loadProducts(),
      expect: () => [
        isA<ProductCatalogLoading>(),
        isA<ProductCatalogError>()
            .having((s) => s.message, 'message', contains('internet')),
      ],
    );
  });
}
```

---

## Dependency Injection (get_it)

```dart
// injection_container.dart — add these registrations

void _registerProductCatalog(GetIt sl) {
  // Data sources
  sl.registerLazySingleton<ProductCatalogRemoteDataSource>(
    () => ProductCatalogRemoteDataSource(sl<Dio>()),
  );

  // Repositories
  sl.registerLazySingleton<ProductCatalogRepository>(
    () => ProductCatalogRepositoryImpl(sl<ProductCatalogRemoteDataSource>()),
  );

  // Use cases
  sl.registerLazySingleton(
    () => GetProductsUseCase(sl<ProductCatalogRepository>()),
  );

  // Cubit — registerFactory so each page gets a fresh instance
  sl.registerFactory(
    () => ProductCatalogCubit(sl<GetProductsUseCase>()),
  );
}
```

---

## pubspec.yaml additions

```yaml
dependencies:
  flutter_bloc: ^8.1.6
  equatable: ^2.0.5
  dartz: ^0.10.1
  dio: ^5.7.0
  cached_network_image: ^3.4.1

dev_dependencies:
  bloc_test: ^9.1.7
  mocktail: ^1.0.4
```
