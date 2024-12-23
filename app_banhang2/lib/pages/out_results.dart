import 'package:app_banhang2/components/my_button_back.dart';
import 'package:app_banhang2/components/my_fillter.dart';
import 'package:app_banhang2/components/my_search_and_fillter.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:app_banhang2/services/service_products.dart';
import 'package:flutter/material.dart';

class OutResults extends StatefulWidget {
  final String searchQuery;
  final String initialSearchText;

  const OutResults({
    super.key,
    this.searchQuery = '',
    this.initialSearchText = '',
  });

  @override
  State<OutResults> createState() => _OutResultsState();
}

class _OutResultsState extends State<OutResults> {
  final APIProduct _apiProduct = APIProduct();
  List<ModelProduct> _searchResults = [];
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.searchQuery.isNotEmpty) {
      _performSearch(widget.searchQuery);
    }
  }

  Future<void> _performSearch(String query) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final results = await _apiProduct.searchProducts(query);
      setState(() {
        _searchResults = results;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      endDrawer: const MyFillter(),
      body: Column(
        children: [
          Row(
            children: [
              const MyButtonBack(),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: SearchAndFillter(
                    screens: OutResults(),
                    isSearchScreen: true,
                    isButtonFillter: true,
                    initialSearchText: widget.initialSearchText, // Fixed: widget instead of Widget
                  ),
                ),
              ),
            ],
          ),
          if (_isLoading) const LinearProgressIndicator(),
          Expanded(
            child: _searchResults.isEmpty
                ? const Center(
                    child: Text('No results found'),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(10),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.7,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                    ),
                    itemCount: _searchResults.length,
                    itemBuilder: (context, index) {
                      final product = _searchResults[index];
                      return Card(
                        elevation: 2,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Container(
                                width: double.infinity,
                                decoration: const BoxDecoration(
                                  borderRadius: BorderRadius.vertical(
                                    top: Radius.circular(4),
                                  ),
                                ),
                                child: Image.network(
                                  product.image,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) =>
                                      const Icon(Icons.error),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    product.title,
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '\$${product.price}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
