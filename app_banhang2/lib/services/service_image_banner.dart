import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_image_banner.dart';
import 'package:http/http.dart' as http;

class APIBanner {
  final String baseUrl = BaseURL.baseURL;

  // Thêm sản phẩm
  Future<String> addbanner(ModelBanner banner) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/banners/add'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(banner.toJson()),
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
  Future<String> editbanner(ModelBanner banner) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/banners/edit/${banner.id}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(banner.toJson()),
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
  Future<String> deletebanner(String bannerId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/banners/delete/$bannerId'),
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
  Future<List<ModelBanner>> getbanners() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/banners/list'));

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final List<dynamic> data = jsonResponse['data'];
        return data.map((e) => ModelBanner.fromJson(e)).toList();
      } else {
        throw Exception('Không thể tải danh sách sản phẩm');
      }
    } catch (e) {
      // print('Lỗi khi lấy danh sách sản phẩm: ${e.toString()}');
      return [];
    }
  }
}
