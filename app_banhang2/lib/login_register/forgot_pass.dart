// ignore_for_file: avoid_unnecessary_containers, prefer_const_constructors, use_build_context_synchronously

import 'package:app_banhang2/animations/loading_animation.dart';
import 'package:app_banhang2/components/my_textfleid.dart';
import 'package:app_banhang2/login_register/forgot_pass/enter_opt.dart';
import 'package:app_banhang2/services/service_app.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class ForgotPassword extends StatefulWidget {
  final TextEditingController _tecEmail = TextEditingController();
  final ApiService _apiService = ApiService();
  ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  bool _isLoading = false;

  Future<void> handleForgtPass() async {
    setState(() {
      _isLoading = true; // Hiển thị loading animation
    });

    final email = widget._tecEmail.text.trim();

    final token = await widget._apiService.sendOtp(email);

    if (token != null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Email hợp lệ')));
      Navigator.of(context).push(
          MaterialPageRoute(builder: (context) => EnterOTP(email: email)));
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Email không hợp lệ')));
    }

    setState(() {
      _isLoading = false; // Ẩn loading animation
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "forgot_title".tr(),
        ),
      ),
      body: Stack(
        children: [
          // Lớp chính
          Container(
            margin: const EdgeInsets.only(top: 40),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    "forgot_text".tr(),
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
                const SizedBox(height: 15),
                MyTextFeild(
                  controller: widget._tecEmail,
                  obscureText: false,
                  focusNode: FocusNode(),
                  text: "forgot_textfleid".tr(),
                  fontSize: 14,
                ),
                const SizedBox(height: 50),
                ElevatedButton(
                  onPressed: handleForgtPass,
                  child: Text('button_continue'.tr()),
                ),
              ],
            ),
          ),

          // Lớp loading animation
          if (_isLoading)
            Container(
              child: LoadingAnimation(), // Hiển thị widget loading
            ),
        ],
      ),
    );
  }
}
