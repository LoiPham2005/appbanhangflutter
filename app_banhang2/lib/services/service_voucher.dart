import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_voucher.dart';
import 'package:http/http.dart' as http;

class VoucherService {
  final String baseUrl = BaseURL.baseURL;

  Future<List<ModelVoucher>> getVouchers() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/voucher/list'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 200 && jsonResponse['data'] != null) {
          final List<dynamic> data = jsonResponse['data'];
          return data.map((item) => ModelVoucher.fromJson(item)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching vouchers: $e');
      return [];
    }
  }
}
