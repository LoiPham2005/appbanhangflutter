import 'package:flutter/material.dart';

class MyFillter extends StatelessWidget {
  const MyFillter({super.key});

  // ignore: non_constant_identifier_names
  Widget _ColorCircle(Color color) {
    return CircleAvatar(
      radius: 10,
      backgroundColor: color,
    );
  }

  // ignore: non_constant_identifier_names
  Widget _DiscountChip({required String label}) {
    return Chip(
      label: Text(label),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Container(
        width: 300,
        color: Colors.white,
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            const Text(
              "Filters",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),

            // Price Slider
            const Text("Price",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            RangeSlider(
              values: const RangeValues(10, 80),
              min: 0,
              max: 100,
              onChanged: (values) {},
            ),

            // Color Selection
            const SizedBox(height: 10),
            const Text("Color",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Row(
              children: [
                _ColorCircle(Colors.amber),
                _ColorCircle(Colors.red),
                _ColorCircle(Colors.black),
                _ColorCircle(Colors.grey),
                _ColorCircle(Colors.brown),
                _ColorCircle(Colors.pink),
              ],
            ),

            // Star Rating
            const SizedBox(height: 10),
            const Text("Star Rating",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Row(
              children: List.generate(5, (index) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: CircleAvatar(
                    backgroundColor: index == 4 ? Colors.black : Colors.white,
                    child: Text(
                      "${index + 1}",
                      style: TextStyle(
                        color: index == 4 ? Colors.white : Colors.grey[700],
                      ),
                    ),
                  ),
                );
              }),
            ),

            // Category Dropdown
            const SizedBox(height: 10),
            const Text("Category",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 5),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(
                  border: OutlineInputBorder(), hintText: 'Select Category'),
              items: const [
                DropdownMenuItem(
                  value: 'Crop Tops',
                  child: Text('Crop Tops'),
                ),
                DropdownMenuItem(
                  value: 'Dresses',
                  child: Text('Dresses'),
                ),
              ],
              onChanged: (value) {},
            ),

            // Discount Options
            const SizedBox(height: 10),
            const Text("Discount",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            Wrap(
              spacing: 8,
              children: [
                _DiscountChip(label: "50% off"),
                _DiscountChip(label: "40% off"),
                _DiscountChip(label: "30% off"),
                _DiscountChip(label: "25% off"),
              ],
            ),

            // Buttons
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
              onPressed: () {},
              child: const Text(
                "Apply Filter",
                style: TextStyle(color: Colors.white),
              ),
            )
          ],
        ),
      ),
    );
  }
}
