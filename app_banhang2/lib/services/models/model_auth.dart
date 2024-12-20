class User {
  String username;
  String email;
  String password;
  String role;
  String? token; // token có thể là null

  User({
    required this.username,
    required this.email,
    required this.password,
    this.role = 'user', // mặc định là 'user'
    this.token,
  });

  // Phương thức để chuyển đổi từ JSON sang đối tượng User
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      role: json['role'] ?? 'user',
      token: json['token'],
    );
  }

  // Phương thức để chuyển đổi từ đối tượng User sang JSON
  Map<String, dynamic> toJson() {
    final data = {
      'username': username,
      'email': email,
      'password': password,
      'role': role,
    };
    if (token != null) {
      data['token'] = token!; // Chỉ thêm token nếu có giá trị
    }
    return data;
  }

  // Phương thức để kiểm tra xem người dùng có phải là admin không
  bool isAdmin() => role.toLowerCase() == 'admin';

  // Xóa password sau khi sử dụng
  void clearPassword() {
    password = '';
  }
}
