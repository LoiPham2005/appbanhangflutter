import 'package:app_banhang2/components/my_discoverData.dart';
import 'package:app_banhang2/components/my_drawer.dart';
import 'package:app_banhang2/components/my_fillter.dart';
import 'package:app_banhang2/components/my_search_and_fillter.dart';
import 'package:app_banhang2/pages/search_screen.dart';
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
                        child: Image.asset(
                          category['image'],
                          errorBuilder: (context, error, stackTrace) =>
                              const Icon(
                                  Icons.error), //Handle image loading errors
                        ),
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
              isSearchScreen: false, isButtonFillter: true,
            ),
            const SizedBox(height: 16), // Add space between widgets
            listCategory(),
          ],
        ),
      ),
    );
  }
}
