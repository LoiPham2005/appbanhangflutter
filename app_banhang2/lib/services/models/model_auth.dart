class User {
  String username;
  String email;
  String password;
  String role;
  String? accessToken;
  String? refreshToken;
  String? avatar;
  String? phone;
  DateTime? birthDate;

  User({
    required this.username,
    required this.email,
    required this.password,
    this.role = 'user',
    this.accessToken,
    this.refreshToken,
    this.avatar,
    this.phone,
    this.birthDate,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      password: json['password'] ?? '',
      role: json['role'] ?? 'user',
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
      avatar: json['avatar'],
      phone: json['phone'],
      birthDate: json['birth_date'] != null
          ? DateTime.parse(json['birth_date'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    final data = {
      'username': username,
      'email': email,
      'password': password,
      'role': role,
    };
    if (accessToken != null) data['accessToken'] = accessToken!;
    if (refreshToken != null) data['refreshToken'] = refreshToken!;
    if (avatar != null) data['avatar'] = avatar!;
    if (phone != null) data['phone'] = phone!;
    if (birthDate != null) data['birth_date'] = birthDate!.toIso8601String();
    return data;
  }

  bool isAdmin() => role.toLowerCase() == 'admin';

  void clearPassword() {
    password = '';
  }
}
