// ignore_for_file: use_build_context_synchronously

import 'package:app_banhang2/components/my_textfleid.dart';
import 'package:app_banhang2/screens/home_screen.dart';
import 'package:app_banhang2/services/service_user.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class ResetPassword extends StatefulWidget {
  final String email;

  const ResetPassword({super.key, required this.email});

  @override
  State<ResetPassword> createState() => _ResetPasswordState();
}

class _ResetPasswordState extends State<ResetPassword> {
  TextEditingController tecNewPass = TextEditingController();
  TextEditingController tecConfirmPass = TextEditingController();
  final ApiService _apiService = ApiService();
  bool _isLoading = false; // Add loading state variable

  Future<void> checkPassword() async {
    setState(() {
      _isLoading = true; // Set loading to true
    });
    String newPass = tecNewPass.text;
    String confirmPass = tecConfirmPass.text;

    final token = await _apiService.resetPassword(widget.email, newPass);

    if (token != null) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đổi mật khẩu thành công')));
      Navigator.of(context)
          .push(MaterialPageRoute(builder: (context) => const HomeScreen()));
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Đổi mật khẩu thất bại')));
    }
    setState(() {
      _isLoading = false; // Set loading to false after API call completes
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        // Use Stack to overlay loading indicator
        children: [
          Column(
            children: [
              const SizedBox(
                height: 50,
              ),
              Text(
                'new_pass_title'.tr(),
                style: const TextStyle(fontSize: 30),
              ),
              const SizedBox(
                height: 20,
              ),
              Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  child: Text('new_pass_content'.tr())),
              MyTextFeild(
                  controller: tecNewPass,
                  obscureText: false,
                  focusNode: FocusNode(),
                  text: 'new_pass'.tr(),
                  fontSize: 14),
              MyTextFeild(
                  controller: tecConfirmPass,
                  obscureText: false,
                  focusNode: FocusNode(),
                  text: 'new_confi_pass'.tr(),
                  fontSize: 14),
              const SizedBox(
                height: 20,
              ),
              ElevatedButton(
                onPressed: () => checkPassword(),
                child: Text('text_button'.tr()),
              ),
            ],
          ),
          if (_isLoading) // Show loading indicator if _isLoading is true
            const Center(
              child: CircularProgressIndicator(),
            ),
        ],
      ),
    );
  }
}
