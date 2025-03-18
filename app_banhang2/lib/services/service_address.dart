import 'dart:convert';
import 'package:app_banhang2/services/base/base_url.dart';
import 'package:app_banhang2/services/models/model_address.dart';
import 'package:http/http.dart' as http;

class AddressService {
  final String baseUrl = BaseURL.baseURL;

  Future<List<ModelAddress>> getAddresses(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/address/list?id_user=$userId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 200 && jsonResponse['data'] != null) {
          final List<dynamic> data = jsonResponse['data'];
          return data.map((item) => ModelAddress.fromJson(item)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching addresses: $e');
      return [];
    }
  }

  Future<bool> deleteAddress(String addressId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/address/delete/$addressId'),
        headers: {'Content-Type': 'application/json'},
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting address: $e');
      return false;
    }
  }
}