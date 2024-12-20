import 'dart:convert';

import 'package:app_banhang2/services/base_url.dart';
import 'package:http/http.dart' as http;
import 'package:app_banhang2/services/models/model_auth.dart';

class ApiService {
  // ignore: constant_identifier_names
  // static const String BASE_URL = 'http://192.168.1.102:3000';
  String baseUrl = BaseURL.baseURL;

  Future<String?> register(User user) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/users/reg'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(user.toJson()),
    );

    if (response.statusCode == 200) {
      return "User registered successfully";
    } else {
      return jsonDecode(response.body)['error'];
    }
  }

  Future<String?> loginWithEmailAndPassword(
      String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/users/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['token']; // Trả về token nếu thành công
      } else {
        // Nếu mã lỗi không phải 200, trả về null
        return null;
      }
    } catch (e) {
      // Xử lý trường hợp lỗi mạng hoặc lỗi khác

      return null;
    }
  }

  Future<String?> sendOtp(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/check/sendOtp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );

      if (response.statusCode == 200) {
        // Nếu gửi OTP thành công
        return "OTP đã được gửi thành công";
      } else {
        // Nếu có lỗi trong quá trình gửi OTP
        return null;
      }
    } catch (e) {
      // Xử lý lỗi khi không thể kết nối mạng hoặc lỗi khác
      return null;
    }
  }

  Future<String?> checkOTP(String email, String otp) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/check/checkOTP'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'otp': otp}),
      );

      if (response.statusCode == 200) {
        // Nếu gửi OTP thành công
        return "xác minh thành công";
      } else {
        // Nếu có lỗi trong quá trình gửi OTP
        return null;
      }
    } catch (e) {
      // Xử lý lỗi khi không thể kết nối mạng hoặc lỗi khác
      return null;
    }
  }

  Future<String?> resetPassword(String email, String newPassword) async {
    try {
      final url = Uri.parse('$baseUrl/api/check/reset-password/$email');
      final response = await http.put(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
          // 'otp': otp,
          'newPassword': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return "xác minh thành công";
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
  }

  Future<bool> deleteOTP(String email) async {
    try {
      final url = Uri.parse('$baseUrl/api/check/deleteOTP/$email');
      final response = await http.delete(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'email': email,
        }),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}
