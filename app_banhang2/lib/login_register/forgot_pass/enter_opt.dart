// ignore_for_file: use_build_context_synchronously

import 'package:app_banhang2/components/my_textfleid.dart';
import 'package:app_banhang2/login_register/forgot_pass/reset_password.dart';
import 'package:app_banhang2/services/service_app.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class EnterOTP extends StatefulWidget {
  final String email;
  const EnterOTP({super.key, required this.email});

  @override
  State<EnterOTP> createState() => _EnterOTPState();
}

class _EnterOTPState extends State<EnterOTP> {
  final TextEditingController _tecOTP = TextEditingController();
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  Future<void> checkOTP() async {
    setState(() {
      _isLoading = true;
    });
    final codeOTP = _tecOTP.text.trim();

    final token = await _apiService.checkOTP(widget.email, codeOTP);

    if (token != null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Xác minh thành công')));

      final deleteOTP = await _apiService.deleteOTP(widget.email);

      if (deleteOTP) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Xoá OTP thành công')));

        Navigator.of(context).push(MaterialPageRoute(
            builder: (context) => ResetPassword(email: widget.email)));
      } else {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Xoá OTP thất bại')));
      }
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Mã OTP không hợp lệ')));
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("enter_opt_title".tr()),
      ),
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('code_password'.tr()),
                Text('forgot_password_text'.tr()),
                const SizedBox(height: 20),
                MyTextFeild(
                    controller: _tecOTP,
                    obscureText: false,
                    focusNode: FocusNode(),
                    text: "OTP",
                    fontSize: 20),
                const SizedBox(height: 30),
                ElevatedButton(
                    onPressed: checkOTP,
                    child: _isLoading
                        ? const CircularProgressIndicator()
                        : Text("text_button".tr())),
              ],
            ),
          ),
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(),
            ),
        ],
      ),
    );
  }
}
