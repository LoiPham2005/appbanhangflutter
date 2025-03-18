import 'package:flutter/material.dart';

class CategoriesData {
  static final List<Map<String, dynamic>> categories = [
    {
      'icon': Icons.woman,
      'labelKey': 'women_category',
      'color': const Color(0xFFFCE4EC),
    },
    {
      'icon': Icons.man,
      'labelKey': 'men_category',
      'color': const Color(0xFFE3F2FD),
    },
    {
      'icon': Icons.watch,
      'labelKey': 'accessories_category',
      'color': const Color(0xFFF3E5F5),
    },
    {
      'icon': Icons.spa,
      'labelKey': 'beauty_category',
      'color': const Color(0xFFE8F5E9),
    },
  ];
}
