import 'package:app_banhang2/components/loading.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/services/models/model_cart.dart';
import 'package:app_banhang2/services/service_cart.dart';
import 'package:app_banhang2/screens/cart_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app_banhang2/login_register/login.dart';

class ProductDetailPage extends StatefulWidget {
  final ModelProduct product;

  const ProductDetailPage({super.key, required this.product});

  @override
  State<ProductDetailPage> createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  final numberFormat = NumberFormat("#,###", "de_DE");
  int _currentImageIndex = 0;
  final CartService _cartService = CartService();
  bool _isLoading = false;

  List<String> _getProductImages() {
    return widget.product.image
        .split(',')
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList();
  }

  Widget _buildImageCarousel() {
    final images = _getProductImages();

    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          height: MediaQuery.of(context).size.height * 0.5,
          child: CarouselSlider(
            items: images
                .map((imageUrl) => Image.network(
                      imageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          Image.asset('assets/images/placeholder.png'),
                    ))
                .toList(),
            options: CarouselOptions(
              height: MediaQuery.of(context).size.height * 0.5,
              viewportFraction: 1.0,
              autoPlay: false,
              enableInfiniteScroll: false,
              onPageChanged: (index, reason) {
                setState(() {
                  _currentImageIndex = index;
                });
              },
            ),
          ),
        ),
        // Dots indicator overlay
        Positioned(
          bottom: 20,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: images.asMap().entries.map((entry) {
              return Container(
                width: 8.0,
                height: 8.0,
                margin: const EdgeInsets.symmetric(horizontal: 4.0),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white
                      .withOpacity(_currentImageIndex == entry.key ? 0.9 : 0.4),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Future<void> _addToCart() async {
    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      if (userId == null) {
        // Show login required dialog
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text('login_required'.tr()),
              content: Text('please_login_to_continue'.tr()),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text('cancel'.tr()),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pop(context); // Close dialog
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const LoginScreen()),
                    );
                  },
                  child: Text('login'.tr()),
                ),
              ],
            );
          },
        );
        return;
      }

      final cart = ModelCart(
        id_user: userId,
        id_product: widget.product.id,
        purchaseQuantity: 1,
      );

      final result = await _cartService.addToCart(cart);

      if (mounted) {
        if (result != null && result['status'] == 200) {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text('success'.tr()),
                content: Text('add_to_cart_success'.tr()),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const CartScreen(),
                        ),
                      );
                    },
                    child: Text('view_cart'.tr()),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text('continue_shopping'.tr()),
                  ),
                ],
              );
            },
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('add_to_cart_failed'.tr())),
          );
        }
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.black),
            onPressed: () => Navigator.pop(context),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.favorite_border, color: Colors.black),
              onPressed: () {},
            ),
          ],
        ),
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Replace the single image with carousel
              _buildImageCarousel(),

              // Product Info
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.product.title,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        ...List.generate(
                            5,
                            (index) => const Icon(
                                  Icons.star,
                                  color: Colors.amber,
                                  size: 20,
                                )),
                        const Text(' (32)',
                            style: TextStyle(color: Colors.grey)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '${numberFormat.format(widget.product.price)} VND',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Description
                    const SizedBox(height: 16),
                    ExpansionTile(
                      title: Text(
                        'Description',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      children: [
                        Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Text(
                            '${widget.product.description}',
                          ),
                        ),
                      ],
                    ),

                    // Reviews
                    const ExpansionTile(
                      title: Text(
                        'Reviews',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      children: [
                        ReviewWidget(),
                      ],
                    ),

                    // Similar Products
                    const SizedBox(height: 16),
                    const Text(
                      'Similar Products',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 200,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: 3,
                        itemBuilder: (context, index) {
                          return const SimilarProductCard();
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        bottomNavigationBar: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.3),
                spreadRadius: 1,
                blurRadius: 5,
              ),
            ],
          ),
          child: ElevatedButton(
            onPressed: _isLoading ? null : _addToCart,
            style: ElevatedButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.primary,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text(
              'add_to_cart'.tr(),
              style: TextStyle(
                  color: Theme.of(context).colorScheme.inversePrimary),
            ),
          ),
        ),
      ),
    );
  }
}

class ReviewWidget extends StatelessWidget {
  const ReviewWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                backgroundImage: NetworkImage('https://via.placeholder.com/50'),
              ),
              const SizedBox(width: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Jennifer Rose',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Row(
                    children: List.generate(
                        5,
                        (index) => const Icon(
                              Icons.star,
                              color: Colors.amber,
                              size: 16,
                            )),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Love it, awesome products arrived! I ordered two sets with different colors. Super comfortable.',
          ),
        ],
      ),
    );
  }
}

class SimilarProductCard extends StatelessWidget {
  const SimilarProductCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      margin: const EdgeInsets.only(right: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
                image: const DecorationImage(
                  image: NetworkImage('https://via.placeholder.com/150'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Sport T-Shirt',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const Text(
            '\$45.00',
            style: TextStyle(
              color: Colors.grey,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
