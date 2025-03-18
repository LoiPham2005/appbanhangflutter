import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_cart.dart';
import 'package:http/http.dart' as http;

class CartService {
  final String baseUrl = BaseURL.baseURL;

  Future<Map<String, dynamic>?> addToCart(ModelCart cart) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/carts/add'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(cart.toJson()),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error adding to cart: $e');
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> getCartItems(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/carts/list'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 200 && jsonResponse['data'] != null) {
          final List<dynamic> cartItems = jsonResponse['data'];
          // Lọc các items của user hiện tại
          final userCartItems =
              cartItems.where((item) => item['id_user'] == userId);

          // Sửa đường dẫn API từ /products/{id} thành /products/getbyid/{id}
          final itemsWithDetails = await Future.wait(
            userCartItems.map((item) async {
              final productResponse = await http.get(
                Uri.parse(
                    '$baseUrl/api/products/getbyid/${item['id_product']}'),
                headers: {'Content-Type': 'application/json'},
              );

              if (productResponse.statusCode == 200) {
                final productData = jsonDecode(productResponse.body)['data'];
                return {
                  ...item,
                  'product': productData,
                };
              }
              return item;
            }),
          );

          return itemsWithDetails
              .map((e) => Map<String, dynamic>.from(e))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching cart items: $e');
      return [];
    }
  }

  Future<bool> updateCartItemQuantity(String cartId, int quantity) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/carts/edit/$cartId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'purchaseQuantity': quantity}),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating cart quantity: $e');
      return false;
    }
  }

  Future<bool> removeFromCart(String cartId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/carts/delete/$cartId'),
        headers: {'Content-Type': 'application/json'},
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error removing item from cart: $e');
      return false;
    }
  }
}
