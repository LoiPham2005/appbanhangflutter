import 'package:app_banhang2/components/my_button_back.dart';
import 'package:app_banhang2/components/my_search_and_fillter.dart';
import 'package:app_banhang2/pages/out_results.dart';
import 'package:flutter/material.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Column(
        children: [
          Row(
            children: [
              MyButtonBack(),
              Expanded(
                child: Padding(
                  padding: EdgeInsets.only(top: 15),
                  child: SearchAndFillter(
                    screens: OutResults(),
                    isSearchScreen: true,
                    isButtonFillter: false,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
