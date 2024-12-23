import 'package:app_banhang2/components/my_discoverData.dart';
import 'package:app_banhang2/components/my_drawer.dart';
import 'package:app_banhang2/components/my_fillter.dart';
import 'package:app_banhang2/components/my_search_and_fillter.dart';
import 'package:app_banhang2/pages/search_screen.dart';
import 'package:app_banhang2/services/models/model_image_banner.dart';
import 'package:app_banhang2/services/service_image_banner.dart';
import 'package:flutter/material.dart';

class DiscoverScreen extends StatefulWidget {
  const DiscoverScreen({super.key});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  bool isDark = false;
  Color searchBarColor = Colors.white; // Initial color

  final List<Map<String, dynamic>> category = CategoriesDataDiscover.categories;
  final APIBanner _apiBanner = APIBanner();
  ModelBanner? _banner;

  @override
  void initState() {
    super.initState();
    loadingData();
  }

  Future<void> loadingData() async {
    try {
      final banners = await _apiBanner.getbanners();
      if (banners.isNotEmpty) {
        setState(() {
          _banner = banners[0];
        });
      }
    } catch (e) {
      print('Error loading data: $e');
    }
  }

  String getBannerImage(String bannerKey) {
    if (_banner == null) return '';

    switch (bannerKey) {
      case 'disColothing':
        return _banner!.disColothing;
      case 'disAccess':
        return _banner!.disAccess;
      case 'disShoes':
        return _banner!.disShoes;
      case 'disCollection':
        return _banner!.disCollection;
      default:
        return '';
    }
  }

  Widget _buildCategoryImage(Map<String, dynamic> category) {
    final bannerImage = getBannerImage(category['bannerKey']);

    return bannerImage.isNotEmpty
        ? Image.network(
            bannerImage,
            width: 120,
            height: 130,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => Image.asset(
              'assets/images/intro.png',
              width: 100,
              height: 100,
              fit: BoxFit.cover,
            ),
          )
        : Image.asset(
            'assets/images/intro.png',
            width: 100,
            height: 100,
            fit: BoxFit.cover,
          );
  }

  // danh sách danh mục
  Widget listCategory() {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: 20,
      ),
      child: Column(
        children: category.map((category) {
          return Container(
            width: double.infinity,
            height: 125,
            margin: const EdgeInsets.only(bottom: 10), // Add margin for spacing
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(15),
              color: category['color'] ??
                  const Color(0xffa3a798), // Use color from data or default
            ),
            child: InkWell(
              // Wrap with InkWell for tappable functionality
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => category['screen'],
                  ),
                );
              },
              child: Row(
                children: [
                  Expanded(
                    // Use Expanded to allow text to take remaining space
                    child: Padding(
                      padding: const EdgeInsets.all(20.0),
                      child: Text(
                        category['label'],
                        style: TextStyle(
                            fontSize: 15,
                            color:
                                Theme.of(context).colorScheme.inversePrimary),
                      ),
                    ),
                  ),
                  Stack(
                    // Align the circle to the bottom right
                    children: [
                      Center(
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Container(
                              width: 100,
                              height: 100,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.1),
                              ),
                            ),
                            Container(
                              width: 70,
                              height: 70,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.1),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(0),
                        child: _buildCategoryImage(category),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Center(child: Text('Discover')),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () => {},
          ),
        ],
      ),
      drawer: const MyDrawer(),
      endDrawer: const MyFillter(),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SearchAndFillter(
              screens: SearchScreen(),
              isSearchScreen: false,
              isButtonFillter: true,
            ),
            const SizedBox(height: 16), // Add space between widgets
            listCategory(),
          ],
        ),
      ),
    );
  }
}
