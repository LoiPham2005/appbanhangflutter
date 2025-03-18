import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:http/http.dart' as http;

class ReviewOrderService {
  final String baseUrl = BaseURL.baseURL;

  Future<bool> addReview({
    required String userId,
    required String orderId,
    required String productId,
    required int rating,
    required String comment,
    List<String>? images,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/reviews/add'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'id_user': userId,
          'id_order': orderId,
          'id_product': productId,
          'rating': rating,
          'comment': comment,
          'images': images ?? [],
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error adding review: $e');
      return false;
    }
  }
}