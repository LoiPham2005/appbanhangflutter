import 'package:app_banhang2/components/my_drawer.dart';
import 'package:app_banhang2/pages/product_detail.dart';
import 'package:app_banhang2/pages/search_screen.dart';
import 'package:app_banhang2/services/models/model_image_banner.dart'
    as image_banner;
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:app_banhang2/services/service_image_banner.dart';
import 'package:app_banhang2/services/service_products.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/data/categories_data.dart';
import 'package:app_banhang2/services/models/model_banner.dart';
import 'package:app_banhang2/services/service_banner.dart';
import 'package:app_banhang2/services/service_products.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final TextEditingController _searchController = TextEditingController();
  int _currentIndex = 0;
  List<ModelProduct> _products = [];
  List<ModelBanner> _banners = [];
  bool _isLoading = true;
  String _error = '';
  final numberFormat = NumberFormat("#,###", "vi_VN");
  final APIProduct _apiProduct = APIProduct();
  final ApiServiceBanner _apiBanner = ApiServiceBanner();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      setState(() => _isLoading = true);
      await Future.wait([
        _loadProducts(),
        _loadBanners(),
      ]);
    } catch (e) {
      print('Error loading data: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadProducts() async {
    try {
      final products = await _apiProduct.getProducts();
      setState(() => _products = products);
    } catch (e) {
      print('Error loading products: $e');
    }
  }

  Future<void> _loadBanners() async {
    try {
      final banners = await _apiBanner.getbanners();
      if (mounted) {
        setState(() => _banners = banners);
      }
    } catch (e) {
      print('Error loading banners: $e');
    }
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.grey[300]!),
        ),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () => _scaffoldKey.currentState?.openDrawer(),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SearchScreen()),
              ),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.search, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(
                      'search'.tr(),
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.message_outlined),
            onPressed: () {
              // Handle chat
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {
              // Handle notifications
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestCategories() {
    final List<Map<String, dynamic>> suggestions = [
      {
        'icon': Icons.book_outlined,
        'title': 'home.bestsellers'.tr(),
      },
      {
        'icon': Icons.local_offer_outlined,
        'title': 'home.onSale'.tr(),
      },
      {
        'icon': Icons.star_outline,
        'title': 'home.goldenDeals'.tr(),
      },
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: suggestions
            .map((item) => Column(
                  children: [
                    Icon(item['icon'] as IconData, size: 24),
                    const SizedBox(height: 8),
                    Text(
                      item['title'] as String,
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ))
            .toList(),
      ),
    );
  }

  Widget _buildBannerSlider() {
    if (_banners.isEmpty) return const SizedBox();

    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            itemCount: _banners[0].homeBanner.length,
            onPageChanged: (index) => setState(() => _currentIndex = index),
            itemBuilder: (context, index) {
              return Image.network(
                _banners[0].homeBanner[index],
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) =>
                    Image.asset('assets/placeholder.png'),
              );
            },
          ),
        ),
        const SizedBox(height: 10),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _banners[0].homeBanner.length,
            (index) => Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _currentIndex == index ? Colors.black : Colors.grey[400],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProductList() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'home.featured'.tr(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text('home.viewAll'.tr()),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 280,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _products.length,
            itemBuilder: (context, index) =>
                _buildProductItem(_products[index]),
          ),
        ),
      ],
    );
  }

  Widget _buildProductItem(ModelProduct product) {
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetailPage(product: product),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(8)),
              child: Image.network(
                product.image.split(',').first,
                height: 160,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) =>
                    Image.asset('assets/product_placeholder.png'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.description,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${numberFormat.format(product.price)}₫',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      drawer: const MyDrawer(),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadData,
          child: _isLoading
              ? const Center(child: CircularProgressIndicator())
              : CustomScrollView(
                  slivers: [
                    SliverToBoxAdapter(child: _buildHeader()),
                    SliverToBoxAdapter(child: _buildSuggestCategories()),
                    SliverToBoxAdapter(child: _buildBannerSlider()),
                    SliverToBoxAdapter(child: _buildProductList()),
                  ],
                ),
        ),
      ),
    );
  }
}
