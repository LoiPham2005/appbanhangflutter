import 'package:app_banhang2/animations/silde_animation.dart';
import 'package:app_banhang2/components/loading.dart';
import 'package:app_banhang2/components/my_textfleid.dart';
import 'package:app_banhang2/login_register/forgot_pass.dart';
import 'package:app_banhang2/login_register/register.dart';
import 'package:app_banhang2/screens/home_screen.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/services/service_user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _tecEmail = TextEditingController();
  final TextEditingController _tecPassword = TextEditingController();
  final ApiService _apiService = ApiService();

  // Thêm biến loading state
  bool _isLoading = false;

  Future<void> handleLogin() async {
    setState(() => _isLoading = true);

    try {
      final email = _tecEmail.text.trim();
      final password = _tecPassword.text.trim();

      if (email.isEmpty || password.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('please_fill_all_fields'.tr())));
        return;
      }

      final result =
          await _apiService.loginWithEmailAndPassword(email, password);

      if (result != null && result['status'] == 200) {
        // Save complete user data to SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        final userData = result['user'];

        await prefs.setString('userId', userData['_id']);
        await prefs.setString('userName', userData['username']);
        await prefs.setString('userEmail', userData['email']);
        await prefs.setString('userAvatar', userData['avatar'] ?? '');
        await prefs.setString('accessToken', result['accessToken']);
        await prefs.setString('refreshToken', result['refreshToken']);

        if (mounted) {
          ScaffoldMessenger.of(context)
              .showSnackBar(SnackBar(content: Text('login_success'.tr())));

          Navigator.of(context).pushAndRemoveUntil(
              MaterialPageRoute(builder: (context) => const HomeScreen()),
              (route) => false);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
              content: Text(result?['message'] ?? 'login_failed'.tr())));
        }
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  // Trong widget build, wrap Scaffold với LoadingOverlay
  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        body: SingleChildScrollView(
          child: Column(
            children: [
              Container(
                margin: const EdgeInsets.only(
                    top: 50,
                    left: 20,
                    right: 20,
                    bottom: 10), // Tạo khoảng cách trên cùng cho tiêu đề
                child: const Text(
                  "login_title",
                  style: TextStyle(fontSize: 30),
                ).tr(),
              ),
              Container(
                margin: const EdgeInsets.only(bottom: 100),
                child: Column(
                  // mainAxisSize: MainAxisSize.min, // Chỉ chiếm không gian vừa đủ
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    MyTextFeild(
                      controller: _tecEmail,
                      obscureText: false,
                      focusNode: FocusNode(),
                      text: "login_enter_email".tr(),
                      fontSize: 14,
                    ),
                    const SizedBox(height: 20),
                    MyTextFeild(
                      controller: _tecPassword,
                      obscureText: true,
                      focusNode: FocusNode(),
                      text: "login_enter_pass".tr(),
                      fontSize: 14,
                    ),
                    const SizedBox(height: 20),
                    Container(
                      margin: const EdgeInsets.only(right: 20),
                      alignment: Alignment.centerRight,
                      child: GestureDetector(
                        child: Text(
                          "login_forgot_pass".tr(),
                          style: const TextStyle(color: Colors.blue),
                        ),
                        onTap: () => Navigator.of(context)
                            .push(SlideAnimation.createRoute(
                          ForgotPassword(),
                        )),
                      ),
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context)
                            .colorScheme
                            .primary, // Chỉnh màu nền của nút
                        foregroundColor: Theme.of(context)
                            .colorScheme
                            .inversePrimary, // Chỉnh màu chữ của nút
                      ),
                      onPressed: handleLogin,
                      child: Text(
                        "login_text_button".tr(),
                      ),
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    Text('login_text_below_button'.tr()),
                    const SizedBox(
                      height: 10,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.apple, color: Colors.black),
                          onPressed: () {
                            // Apple login logic
                          },
                        ),
                        const SizedBox(
                          width: 10,
                        ),
                        Image.asset(
                          "assets/images/google.png",
                          width: 30,
                          height: 30,
                        ),
                        const SizedBox(
                          width: 10,
                        ),
                        IconButton(
                          icon: const Icon(Icons.facebook, color: Colors.blue),
                          onPressed: () {
                            // Facebook login logic
                          },
                        )
                      ],
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "login_question".tr(),
                          style: const TextStyle(color: Colors.grey),
                        ),
                        TextButton(
                            onPressed: () => Navigator.of(context).push(
                                  SlideAnimation.createRoute(
                                      const RegisterScreen()),
                                ),
                            child: Text('login_question_login'.tr()))
                      ],
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
