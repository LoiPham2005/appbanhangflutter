// ignore_for_file: use_build_context_synchronously

import 'package:app_banhang2/animations/silde_animation.dart';
import 'package:app_banhang2/components/my_textfleid.dart';
import 'package:app_banhang2/login_register/login.dart';
import 'package:app_banhang2/services/models/model_auth.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/services/service_app.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterState();
}

class _RegisterState extends State<RegisterScreen> {
  TextEditingController tecUserName = TextEditingController();
  TextEditingController tecEmail = TextEditingController();
  TextEditingController tecPassword = TextEditingController();
  TextEditingController tecConfirmPassword = TextEditingController();
  final ApiService _apiService = ApiService();

  Future<void> handleRegister() async {
    final username = tecUserName.text.trim();
    final email = tecEmail.text.trim();
    final password = tecPassword.text.trim();
    final confirmPassword = tecConfirmPassword.text.trim();

    final user = User(username: username, email: email, password: password);

    final result = await _apiService.register(user);
    if (result != null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('register_message'.tr())));
      // chuyển màn đăng nhập
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('register_error'.tr())));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 50, bottom: 20),
              child: Text(
                'register_title'.tr(),
                style: const TextStyle(fontSize: 30),
              ),
            ),
            MyTextFeild(
                controller: tecUserName,
                obscureText: false,
                focusNode: FocusNode(),
                text: "register_enter_name".tr(),
                fontSize: 14),
            const SizedBox(height: 10), // Added space between text fields
            MyTextFeild(
                controller: tecEmail,
                obscureText: false,
                focusNode: FocusNode(),
                text: "register_enter_email".tr(),
                fontSize: 14),
            const SizedBox(height: 10), // Added space between text fields
            MyTextFeild(
                controller: tecPassword,
                obscureText: false,
                focusNode: FocusNode(),
                text: "register_enter_pass".tr(),
                fontSize: 14),
            const SizedBox(height: 10), // Added space between text fields
            MyTextFeild(
                controller: tecConfirmPassword,
                obscureText: false,
                focusNode: FocusNode(),
                text: "register_enter_confirm_pass".tr(),
                fontSize: 14),
            const SizedBox(height: 30), // Added space between password fields
            ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    foregroundColor:
                        Theme.of(context).colorScheme.inversePrimary),
                onPressed: () => handleRegister(),
                child: Text('register_text_button'.tr())),
            const SizedBox(height: 20), // Added space between buttons
            Text('register_text_below_button'.tr()),
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
                  "register_question".tr(),
                  style: const TextStyle(color: Colors.grey),
                ),
                TextButton(
                    onPressed: () =>
                        Navigator.of(context).pop(SlideAnimation.createRoute(
                          const LoginScreen(),
                        )),
                    child: Text('register_question_login'.tr()))
              ],
            )
          ],
        ),
      ),
    );
  }
}
