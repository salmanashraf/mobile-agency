// home_screen.dart — intentionally flawed Flutter code for DART agent review
// This is the "before" state — see output.md for DART's full analysis

import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Product> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    final result = await ProductApi().fetchAll();
    setState(() {
      products = result;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      body: isLoading
          ? CircularProgressIndicator()
          : ListView(
              children: products.map((p) => ProductCard(product: p)).toList(),
            ),
    );
  }
}

class ProductCard extends StatelessWidget {
  final Product product;
  const ProductCard({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    final discounted = product.price * 0.9;

    return Card(
      margin: EdgeInsets.all(8),
      child: ListTile(
        title: Text(product.name),
        subtitle: Text('Was \$${product.price}, now \$${discounted.toStringAsFixed(2)}'),
        trailing: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ProductDetailScreen(product: product)),
            );
          },
          child: Text('View'),
        ),
      ),
    );
  }
}
