import 'package:app_banhang2/animations/silde_animation.dart';
import 'package:app_banhang2/pages/out_results.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class SearchAndFillter extends StatefulWidget {
  final Widget screens;
  final bool isSearchScreen;
  final bool isButtonFillter;
  final String initialSearchText; // Add this

  const SearchAndFillter({
    super.key,
    required this.screens,
    this.isSearchScreen = false,
    required this.isButtonFillter,
    this.initialSearchText = '', // Add this
  });

  @override
  State<SearchAndFillter> createState() => _SearchAndFillterState();
}

class _SearchAndFillterState extends State<SearchAndFillter> {
    late TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.initialSearchText);
  }

  void _handleSearch(String value) {
    if (value.isNotEmpty) {
      Navigator.of(context).push(
        SlideAnimation.createRoute(
          OutResults(
            searchQuery: value,
            initialSearchText: value, // Add this
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Builder(
          builder: (BuildContext context) {
            return Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.5),
                          spreadRadius: 1,
                          blurRadius: 1,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: widget.isSearchScreen
                        ? TextField(
                            controller: _searchController,
                            decoration: InputDecoration(
                              hintText: 'search'.tr(),
                              prefixIcon: const Icon(Icons.search),
                              suffixIcon: _searchController.text.isNotEmpty
                                  ? IconButton(
                                      icon: const Icon(Icons.clear),
                                      onPressed: () {
                                        _searchController.clear();
                                        setState(() {});
                                      },
                                    )
                                  : null,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(30),
                                borderSide: BorderSide.none,
                              ),
                              filled: true,
                              fillColor: const Color.fromRGBO(250, 250, 250, 1),
                              contentPadding: const EdgeInsets.symmetric(
                                  vertical: 13.0, horizontal: 16.0),
                            ),
                            onSubmitted: _handleSearch,
                            textInputAction: TextInputAction.search,
                          )
                        : InkWell(
                            onTap: () => Navigator.of(context).push(
                              SlideAnimation.createRoute(widget.screens),
                            ),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 13.0, horizontal: 16.0),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(30),
                                color: const Color.fromRGBO(250, 250, 250, 1),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.search,
                                    color:
                                        Theme.of(context).colorScheme.secondary,
                                  ),
                                  const SizedBox(width: 8),
                                  Text('search'.tr()),
                                ],
                              ),
                            ),
                          ),
                  ),
                ),
                const SizedBox(width: 16),
                widget.isButtonFillter
                    ? SizedBox(
                        height: 50,
                        width: 50,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                const Color.fromRGBO(250, 250, 250, 1),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            elevation: 0.3,
                            padding: EdgeInsets.zero,
                          ),
                          onPressed: () {
                            Scaffold.of(context).openEndDrawer();
                          },
                          child: const Center(
                            child: Icon(
                              Icons.format_list_bulleted_outlined,
                              size: 20,
                            ),
                          ),
                        ),
                      )
                    : const SizedBox.shrink()
              ],
            );
          },
        ),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
