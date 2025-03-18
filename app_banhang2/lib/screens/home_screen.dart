import 'package:app_banhang2/components/my_drawer.dart';
import 'package:app_banhang2/pages/product_detail.dart';
import 'package:app_banhang2/pages/search_screen.dart';
import 'package:app_banhang2/services/models/model_image_banner.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:app_banhang2/services/service_image_banner.dart';
import 'package:app_banhang2/services/service_products.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/data/categories_data.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  List<ModelProduct> _products = [];
  List<Widget> _bannerItems = [];
  bool _isLoading = true;
  String _error = '';

  // final numberFormat = NumberFormat("#,###", "en_US"); // Format số có dấu phẩy hoặc dấu chấm tùy locale
  final numberFormat =
      NumberFormat("#,###", "de_DE"); // Sử dụng dấu chấm thay vì dấu phẩy

  // Sử dụng dữ liệu từ file my_categoryData.dart
  // final List<Widget> item = CategoriesData.item;
  final List<Map<String, dynamic>> categories = CategoriesData.categories;
  // final List<Map<String, dynamic>> featuredProducts =
  //     CategoriesData.featuredProducts;

  final APIProduct _apiProduct = APIProduct();
  final APIBanner _apiBanner = APIBanner();

// slide ảnh chạy
  Widget _buildCarousel() {
    if (_bannerItems.isEmpty) {
      return const Center(child: CircularProgressIndicator());
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 25),
      child: CarouselSlider(
        items: _bannerItems,
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

  Widget _buildIndicators() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        _bannerItems.length,
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
    try {
      setState(() {
        _isLoading = true;
        _error = '';
      });

      // Load products
      final products = await _apiProduct.getProducts();

      // Load banners
      final banners = await _apiBanner.getbanners();
      final bannerWidgets = [];

      if (banners.isNotEmpty && banners[0].homeBanner.isNotEmpty) {
        for (String imageUrl in banners[0].homeBanner) {
          bannerWidgets.add(
            Image.network(
              imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  Image.asset('assets/images/banner.png'),
            ),
          );
        }
      }

      if (mounted) {
        setState(() {
          _products = products;
          // _bannerItems = bannerWidgets;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Error loading data: $e';
          _isLoading = false;
        });
      }
    }
  }

// select banner default
  Widget selectImage(String? imageUrl) {
    return imageUrl != null && imageUrl.isNotEmpty
        ? Image.network(
            imageUrl,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) =>
                Image.asset('assets/images/banner.png'),
          )
        : Image.asset('assets/images/banner.png');
  }

  Widget _buildCategoryItem(Map<String, dynamic> category) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Column(
        children: [
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              color: category['color'],
              borderRadius: BorderRadius.circular(35),
            ),
            child: Icon(
              category['icon'],
              size: 35,
              color: Colors.black54,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            category['labelKey'].toString().tr(),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 8,
        title: GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const SearchScreen()),
            );
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 15),
            height: 40,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.search,
                  color: Colors.grey,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'search_products'.tr(),
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 16,
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ],
            ),
          ),
        ),
        actions: [
          IconButton(
            onPressed: () => {},
            icon: const Icon(Icons.notifications_none),
          ),
        ],
      ),
      drawer: const MyDrawer(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error.isNotEmpty
              ? Center(child: Text(_error))
              : RefreshIndicator(
                  onRefresh: loadingData,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      children: [
                        // Categories section
                        SizedBox(
                          height: 110,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 15),
                            itemCount: CategoriesData.categories.length,
                            itemBuilder: (context, index) => _buildCategoryItem(
                                CategoriesData.categories[index]),
                          ),
                        ),

                        // Banner carousel section
                        if (_bannerItems.isNotEmpty) ...[
                          _buildCarousel(),
                          _buildIndicators(),
                        ],

                        // Featured products section
                        if (_products.isNotEmpty) ...[
                          _buildFeaturedProductsHeader(),
                          _buildProductsList(),
                        ],
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildFeaturedProductsHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'featured_products_title'.tr(),
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          TextButton(
            onPressed: () {
              // Navigate to all products
            },
            child: Text('show_all'.tr()),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsList() {
    return Padding(
      padding: const EdgeInsets.only(left: 15),
      child: SizedBox(
        height: 200,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: _products.length,
          itemBuilder: (context, index) => _buildProductItem(_products[index]),
        ),
      ),
    );
  }

  Widget _buildProductItem(ModelProduct product) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailPage(product: product),
          ),
        );
      },
      child: Container(
        width: 160,
        margin: const EdgeInsets.only(right: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image
            Container(
              height: 120,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                image: DecorationImage(
                  image: NetworkImage(product.image.split(',').first),
                  fit: BoxFit.cover,
                  onError: (exception, stackTrace) =>
                      const AssetImage('assets/images/product_placeholder.png'),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Product Title
            Text(
              product.title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),

            // Product Price
            Text(
              '${numberFormat.format(product.price)} đ',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
