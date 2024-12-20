import 'package:app_banhang2/components/my_categoriesData.dart';
import 'package:app_banhang2/components/my_drawer.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:app_banhang2/services/service_products.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  List<ModelProduct> _products = [];
  // final numberFormat = NumberFormat("#,###", "en_US"); // Format số có dấu phẩy hoặc dấu chấm tùy locale
  final numberFormat =
      NumberFormat("#,###", "de_DE"); // Sử dụng dấu chấm thay vì dấu phẩy

  // Sử dụng dữ liệu từ file my_categoryData.dart
  final List<Widget> item = CategoriesData.item;
  final List<Map<String, dynamic>> categories = CategoriesData.categories;
  final List<Map<String, dynamic>> featuredProducts =
      CategoriesData.featuredProducts;

  final APIProduct _apiProduct = APIProduct();

// slide ảnh chạy
  Widget _buildCarousel() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 25),
      child: CarouselSlider(
        items: item,
        options: CarouselOptions(
          autoPlay: true,
          viewportFraction: 1.0,
          onPageChanged: (index, reason) {
            setState(() => _currentIndex = index);
          },
        ),
      ),
    );
  }

// dấu chấm ảnh chạy đến đâu dấu chạy đến đấy
  Widget _buildIndicators() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        item.length,
        (index) => GestureDetector(
          onTap: () => setState(() => _currentIndex = index),
          child: Container(
            width: 8.0,
            height: 8.0,
            margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 2),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: (Theme.of(context).brightness == Brightness.dark
                      ? Colors.white
                      : Colors.black)
                  .withOpacity(_currentIndex == index ? 0.9 : 0.4),
            ),
          ),
        ),
      ),
    );
  }

  // hiển thị sản phẩm bằng API
  @override
  void initState() {
    super.initState();
    loadingData();
  }

  Future<void> loadingData() async {
    final data = await _apiProduct.getProducts();
    setState(() {
      _products = data; // Handle null case to prevent errors
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text('store_name'.tr())),
        actions: [
          IconButton(
            onPressed: () => {},
            icon: const Icon(Icons.notifications_none),
          ),
        ],
      ),
      drawer: const MyDrawer(),
      body: NotificationListener<OverscrollIndicatorNotification>(
        onNotification: (overscroll) {
          return true;
        },
        child: RefreshIndicator( // Add RefreshIndicator here
          onRefresh: () async {
            await loadingData(); // Reuse existing load method
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(), // Enable scroll when content is small
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: categories.map((category) {
                    return Column(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => category['screen'],
                            ),
                          ),
                          icon: Image.asset(
                            category['image'],
                            height: 40,
                            width: 40,
                            errorBuilder: (context, error, stackTrace) =>
                                const Icon(
                                    Icons.error), //Handle image loading errors
                          ),
                        ),
                        Text(category['label']),
                      ],
                    );
                  }).toList(),
                ),
                // slide và dấu chấm
                Column(
                  children: [
                    _buildCarousel(),
                    _buildIndicators(),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'featured_products_title'.tr(),
                        style: const TextStyle(fontSize: 18),
                      ),
                      Text(
                        'show_all'.tr(),
                        style: TextStyle(
                            fontSize: 13,
                            color: Theme.of(context).colorScheme.secondary),
                      )
                    ],
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 15),
                  child: SizedBox(
                    height: 200,
                    child: _products.isEmpty
                        ? const Center(child: CircularProgressIndicator())
                        : ListView.builder(
                            shrinkWrap: true,
                            scrollDirection: Axis.horizontal,
                            itemCount: _products.length,
                            itemBuilder: (context, index) {
                              final item = _products[index];
                              return Container(
                                width: 130,
                                // margin: const EdgeInsets.symmetric(horizontal: 4.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Image.network(
                                      item.image,
                                      height: 150,
                                      width: 100,
                                      fit: BoxFit.cover,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      item.title,
                                      style: const TextStyle(fontSize: 13),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      '${numberFormat.format(item.price)} VNĐ',
                                      style: const TextStyle(
                                          fontSize: 12, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Image.asset('assets/images/banner4.png'),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
