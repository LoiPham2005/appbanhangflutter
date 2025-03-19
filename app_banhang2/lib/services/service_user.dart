import 'dart:convert';
import 'dart:io';

import 'package:app_banhang2/services/base/base_url.dart';
import 'package:http/http.dart' as http;
import 'package:app_banhang2/services/models/model_auth.dart';
import 'package:http_parser/http_parser.dart'; // Import thêm thư viện này

class ApiService {
  String baseUrl = BaseURL.baseURL;

  Future<Map<String, dynamic>?> register(User user) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/users/reg'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(user.toJson()),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      return null;
    }
  }

  Future<Map<String, dynamic>?> loginWithEmailAndPassword(
      String email, String password,
      {String platform = 'mobile'}) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/users/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(
            {'email': email, 'password': password, 'platform': platform}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        return null;
      }
    } catch (e) {
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

  Future<Map<String, dynamic>?> updateProfile(
      String userId, Map<String, dynamic> data) async {
    try {
      // Print for debugging
      print('Updating profile for user $userId with data: $data');

      final response = await http.patch(
        Uri.parse('$baseUrl/api/users/edit/$userId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );

      print('Update response: ${response.body}'); // Debug log

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error updating profile: $e');
      return null;
    }
  }

  Future<String?> uploadImage(String filePath) async {
    try {
      final file = File(filePath);
      var uri = Uri.parse('$baseUrl/api/upload/media');
      var request = http.MultipartRequest('POST', uri);

      // Tạo multipart file với các thông tin chi tiết
      var multipartFile = await http.MultipartFile.fromPath(
        'media', // Tên field phải là 'media' để khớp với server
        file.path,
        contentType: MediaType('image', 'jpeg'), // Thêm content type
      );

      // Thêm file vào request
      request.files.add(multipartFile);

      // Gửi request và nhận response
      var streamedResponse = await request.send();
      var response = await http.Response.fromStream(streamedResponse);

      print('Upload response status: ${response.statusCode}'); // Debug log
      print('Upload response body: ${response.body}'); // Debug log

      if (response.statusCode == 200) {
        var jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 200 &&
            jsonResponse['mediaUrls'] != null &&
            jsonResponse['mediaUrls'].isNotEmpty) {
          return jsonResponse['mediaUrls'][0]['url'];
        }
      }
      return null;
    } catch (e) {
      print('Error uploading image: $e'); // Debug log
      return null;
    }
  }
}
