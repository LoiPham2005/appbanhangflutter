import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_order.dart';
import 'package:http/http.dart' as http;

class OrderService {
  final String baseUrl = BaseURL.baseURL;

  Future<Map<String, dynamic>> createOrder(ModelOrder order) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/orders/add'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(order.toJson()),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to create order');
    } catch (e) {
      print('Error creating order: $e');
      throw Exception('Error creating order');
    }
  }

  Future<List<Map<String, dynamic>>> getUserOrders(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/orders/user/$userId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 200 && jsonResponse['data'] != null) {
          final List<dynamic> data = jsonResponse['data'];
          return data.map((item) => Map<String, dynamic>.from(item)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching user orders: $e');
      return [];
    }
  }

  Future<bool> requestReturn(
      String orderId, String reason, List<String> images) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/orders/status/$orderId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'status': 'return_requested',
          'returnRequest': {
            'reason': reason,
            'images': images,
            'requestDate': DateTime.now().toIso8601String(),
          },
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error requesting return: $e');
      return false;
    }
  }
}
