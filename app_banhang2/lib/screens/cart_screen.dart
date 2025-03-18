import 'package:app_banhang2/components/loading.dart';
import 'package:app_banhang2/pages/order_payment.dart';
import 'package:app_banhang2/services/models/model_cart.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:app_banhang2/services/service_cart.dart';
import 'package:app_banhang2/services/service_products.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final CartService _cartService = CartService();
  final APIProduct _productService = APIProduct();
  final numberFormat = NumberFormat("#,###", "vi_VN");

  bool _isLoading = true;
  List<Map<String, dynamic>> _cartItems = [];
  Map<String, bool> _selectedItems = {};
  double _total = 0;

  @override
  void initState() {
    super.initState();
    _loadCartItems();
  }

  Future<void> _loadCartItems() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      if (userId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('login_required'.tr())),
        );
        return;
      }

      final cartItems = await _cartService.getCartItems(userId);
      setState(() {
        _cartItems = cartItems;
        _calculateTotal();
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _calculateTotal() {
    double total = 0;
    for (var item in _cartItems) {
      if (_selectedItems[item['_id']] ?? false) {
        total +=
            (item['product']?['price'] ?? 0) * (item['purchaseQuantity'] ?? 0);
      }
    }
    setState(() => _total = total);
  }

  Future<void> _updateQuantity(String cartId, int newQuantity) async {
    if (newQuantity < 1) return;

    final success =
        await _cartService.updateCartItemQuantity(cartId, newQuantity);
    if (success) {
      await _loadCartItems();
    }
  }

  Future<void> _removeItem(String cartId) async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('cart_remove_title'.tr()),
        content: Text('cart_remove_message'.tr()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('cancel'.tr()),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final success = await _cartService.removeFromCart(cartId);
              if (success) {
                await _loadCartItems();
              }
            },
            child:
                Text('confirm'.tr(), style: const TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Widget _buildCartItem(Map<String, dynamic> item) {
    // Get product data
    final product = item['product'];

    // Safely get the first image URL
    String imageUrl = '';
    if (product != null &&
        product['media'] is List &&
        (product['media'] as List).isNotEmpty &&
        product['media'][0] is Map) {
      imageUrl = product['media'][0]['url'] ?? '';
    }

    return Card(
      margin: const EdgeInsets.all(8),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Checkbox
            Checkbox(
              value: _selectedItems[item['_id']] ?? false,
              onChanged: (bool? value) {
                setState(() {
                  _selectedItems[item['_id']] = value ?? false;
                  _calculateTotal();
                });
              },
            ),
            // Product Image
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: imageUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      width: 80,
                      height: 80,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => _buildImagePlaceholder(),
                    )
                  : _buildImagePlaceholder(),
            ),
            const SizedBox(width: 12),
            // Product Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item['product']?['title'] ?? 'Unknown Product',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₫${numberFormat.format(item['product']?['price'] ?? 0)}',
                    style: const TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Quantity Controls
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.remove_circle_outline),
                        onPressed: () => _updateQuantity(
                          item['_id'],
                          (item['purchaseQuantity'] ?? 1) - 1,
                        ),
                        iconSize: 20,
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          '${item['purchaseQuantity'] ?? 1}',
                          style: const TextStyle(fontSize: 14),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add_circle_outline),
                        onPressed: () => _updateQuantity(
                          item['_id'],
                          (item['purchaseQuantity'] ?? 1) + 1,
                        ),
                        iconSize: 20,
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Delete Button
            IconButton(
              icon: const Icon(Icons.delete_outline),
              color: Colors.red,
              onPressed: () => _removeItem(item['_id']),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePlaceholder() {
    return Container(
      width: 80,
      height: 80,
      color: Colors.grey[200],
      child: const Icon(Icons.image_not_supported),
    );
  }

  void _handleCheckout() {
    // Filter selected items
    final selectedItems = _cartItems
        .where((item) => _selectedItems[item['_id']] ?? false)
        .toList();

    if (selectedItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('select_items_to_checkout'.tr())));
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OrderPayment(
          selectedItems: selectedItems,
          totalPrice: _total,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          title: Text('your_cart'.tr()),
        ),
        body: _cartItems.isEmpty
            ? Center(child: Text('cart_empty'.tr()))
            : SafeArea(
                child: Column(
                  children: [
                    // Cart items list
                    Expanded(
                      child: ListView.builder(
                        itemCount: _cartItems.length,
                        itemBuilder: (context, index) =>
                            _buildCartItem(_cartItems[index]),
                      ),
                    ),
                    // Bottom section with total and checkout
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.2),
                            spreadRadius: 1,
                            blurRadius: 5,
                            offset: const Offset(0, -1),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text('total'.tr()),
                              Text(
                                '₫${numberFormat.format(_total)}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red,
                                ),
                              ),
                            ],
                          ),
                          ElevatedButton(
                            onPressed:
                                _selectedItems.isEmpty ? null : _handleCheckout,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 32,
                                vertical: 12,
                              ),
                            ),
                            child: Text('checkout'.tr()),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
