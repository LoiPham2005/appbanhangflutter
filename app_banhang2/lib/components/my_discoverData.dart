// lib/screens/categories_data.dart
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

class CategoriesDataDiscover {
// danh sách các mục
  static final List<Map<String, dynamic>> categories = [
    {
      'image': 'assets/images/clothing.png',
      'label': 'cloting'.tr(),
      'color': const Color(0xffa3a798),
      'screen': const CategoryTest(),
    },
    {
      'image': 'assets/images/accessories.png',
      'label': 'accessries'.tr(),
      'color': const Color(0xff898280),
      'screen': const CategoryTest(),
    },
    {
      'image': 'assets/images/shoes.png',
      'label': 'shoes'.tr(),
      'color': const Color(0xff44565c),
      'screen': const CategoryTest(),
    },
    {
      'image': 'assets/images/collection.png',
      'label': 'collection'.tr(),
      'color': const Color(0xffb9aeb2),
      'screen': const CategoryTest(),
    },
  ];
}

class CategoryTest extends StatelessWidget {
  const CategoryTest({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Text("Category Test"),
    );
  }
}
