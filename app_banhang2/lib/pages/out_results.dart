import 'package:app_banhang2/components/my_button_back.dart';
import 'package:app_banhang2/components/my_fillter.dart';
import 'package:app_banhang2/components/my_search_and_fillter.dart';
import 'package:flutter/material.dart';

class OutResults extends StatefulWidget {
  final String searchQuery;
  const OutResults({super.key, this.searchQuery = ''});

  @override
  State<OutResults> createState() => _OutResultsState();
}

class _OutResultsState extends State<OutResults> {
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      endDrawer: MyFillter(),
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
                    isButtonFillter: true,
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
