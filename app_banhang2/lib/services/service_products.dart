import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:http/http.dart' as http;

class APIProduct {
  final String baseUrl = BaseURL.baseURL;

  // Thêm sản phẩm
  Future<String> addProduct(ModelProduct product) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/products/add'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(product.toJson()),
      );

      if (response.statusCode == 200) {
        return "Thêm sản phẩm thành công";
      } else {
        final jsonResponse = jsonDecode(response.body);
        return jsonResponse['message'] ?? 'Thêm sản phẩm thất bại';
      }
    } catch (e) {
      return 'Thêm sản phẩm thất bại: ${e.toString()}';
    }
  }

  // Cập nhật sản phẩm
  Future<String> editProduct(ModelProduct product) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/products/edit/${product.id}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(product.toJson()),
      );

      if (response.statusCode == 200) {
        return "Cập nhật sản phẩm thành công";
      } else {
        final jsonResponse = jsonDecode(response.body);
        return jsonResponse['message'] ?? 'Cập nhật sản phẩm thất bại';
      }
    } catch (e) {
      return 'Cập nhật sản phẩm thất bại: ${e.toString()}';
    }
  }

  // Xóa sản phẩm
  Future<String> deleteProduct(String productId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/products/delete/$productId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return "Xóa sản phẩm thành công";
      } else {
        final jsonResponse = jsonDecode(response.body);
        return jsonResponse['message'] ?? 'Xóa sản phẩm thất bại';
      }
    } catch (e) {
      return 'Xóa sản phẩm thất bại: ${e.toString()}';
    }
  }

  // Lấy danh sách sản phẩm
  Future<List<ModelProduct>> getProducts() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/products/list'));

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final List<dynamic> data = jsonResponse['data'];
        return data.map((e) => ModelProduct.fromJson(e)).toList();
      } else {
        throw Exception('Không thể tải danh sách sản phẩm');
      }
    } catch (e) {
      // print('Lỗi khi lấy danh sách sản phẩm: ${e.toString()}');
      return [];
    }
  }

  // Tìm kiếm sản phẩm
  Future<List<ModelProduct>> searchProducts(String keyword) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/products/search?key=$keyword'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final List<dynamic> data = jsonResponse['data'];
        return data.map((e) => ModelProduct.fromJson(e)).toList();
      } else {
        throw Exception('Không thể tìm kiếm sản phẩm');
      }
    } catch (e) {
      return [];
    }
  }

  // Hiển thị thông tin sản phẩm theo ID
  Future<ModelProduct?> getProductById(String productId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/products/$productId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        return ModelProduct.fromJson(jsonResponse['data']);
      } else {
        throw Exception('Không thể tìm thấy sản phẩm với ID: $productId');
      }
    } catch (e) {
      return null;
    }
  }
}
