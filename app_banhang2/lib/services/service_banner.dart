import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_banner.dart';

class ApiServiceBanner {
  final String baseUrl = BaseURL.baseURL;

  Future<List<ModelBanner>> getbanners() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/banners/list'));
      
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);
        
        if (jsonResponse['status'] == 200 && jsonResponse['data'] != null) {
          final List<dynamic> data = jsonResponse['data'];
          return data.map((item) => ModelBanner.fromJson(item)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error getting banners: $e');
      return [];
    }
  }
}