import 'package:flutter/material.dart';

class MyTextFeild extends StatelessWidget {
  final TextEditingController controller;
  final bool obscureText;
  final FocusNode focusNode;
  final String text;
  final double fontSize;

  const MyTextFeild(
      {super.key,
      required this.controller,
      required this.obscureText,
      required this.focusNode,
      required this.text,
      required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        focusNode: focusNode,
        decoration: InputDecoration(
            hintText: text, hintStyle: TextStyle(fontSize: fontSize)),
      ),
    );
  }
}
