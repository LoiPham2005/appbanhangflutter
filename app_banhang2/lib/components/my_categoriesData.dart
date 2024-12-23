import 'package:app_banhang2/pages/product_detail.dart';
import 'package:app_banhang2/services/service_image_banner.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/screens/discover_screen.dart';
import 'package:easy_localization/easy_localization.dart';

class CategoriesData {
  // Convert API banner data to Widget list
  static Future<List<Widget>> getBannerWidgets() async {
    final APIBanner apiBanner = APIBanner();
    final banners = await apiBanner.getbanners();

    if (banners.isEmpty) return [];

    final banner = banners[0]; // Get first banner object
    final bannerUrls = [
      banner.homeBanner,
      banner.homeBanner1,
      banner.homeBanner2,
    ].where((url) => url.isNotEmpty).toList();

    return bannerUrls
        .map((url) => Image.network(
              url,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  Image.asset('assets/images/banner.png'),
            ))
        .toList();
  }


// danh sách sliders
  // static final List<Widget> item = [
  //   Image.asset('assets/images/banner.png'),
  //   Image.asset('assets/images/banner1.jpg'),
  //   Image.asset('assets/images/banner2.jpg'),
  // ];

// danh sách các mục
  static final List<Map<String, dynamic>> categories = [
    {
      'image': 'assets/images/women.png',
      'label': 'women_category'.tr(),
      'screen': const ProductDetailPage(),
    },
    {
      'image': 'assets/images/men.png',
      'label': 'men_category'.tr(),
      'screen': const ProductDetailPage(),
    },
    {
      'image': 'assets/images/acces.png',
      'label': 'accessories_category'.tr(),
      'screen': const DiscoverScreen(),
    },
    {
      'image': 'assets/images/beauty.png',
      'label': 'beauty_category'.tr(),
      'screen': const DiscoverScreen(),
    },
  ];

  // danh sách sản phẩm nổi bật
  static final List<Map<String, dynamic>> featuredProducts = [
    {
      'image': 'assets/images/shirt1.png',
      'label': 'product_3_name'.tr(),
      'price': 'product_3_price'.tr(),
    },
    {
      'image': 'assets/images/shirt2.png',
      'label': 'product_2_name'.tr(),
      'price': 'product_2_price'.tr(),
    },
    {
      'image': 'assets/images/shirt3.png',
      'label': 'product_3_name'.tr(),
      'price': 'product_3_price'.tr(),
    },
    {
      'image': 'assets/images/shirt3.png',
      'label': 'product_3_name'.tr(),
      'price': 'product_3_price'.tr(),
    },
    {
      'image': 'assets/images/shirt3.png',
      'label': 'product_3_name'.tr(),
      'price': 'product_3_price'.tr(),
    },
  ];
}
