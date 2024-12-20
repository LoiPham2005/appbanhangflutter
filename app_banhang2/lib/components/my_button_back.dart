import 'package:flutter/material.dart';

class MyButtonBack extends StatelessWidget {
  const MyButtonBack({super.key});

  @override
  Widget build(BuildContext context) {
    return
        // Container(
        //   margin: const EdgeInsets.all(15), // Add margin to make container smaller
        //   decoration: BoxDecoration(
        //     shape: BoxShape.circle,
        //     color: Colors.white,
        //     boxShadow: [
        //       BoxShadow(
        //         color: Colors.grey.withOpacity(0.5),
        //         spreadRadius: 1,
        //         blurRadius: 1,
        //         offset: const Offset(0, 1),
        //       ),
        //     ],
        //   ),
        //   child: const Center(
        //     // Center the icon
        //     child: Icon(
        //       Icons.arrow_back,
        //       color: Colors.black,
        //       size: 20, // Reduced icon size
        //     ),
        //   ),
        // );
        SafeArea(
      child: Container(
        alignment: Alignment.topLeft,
        width: 30, // Adjusted width
        height: 30,
        margin: const EdgeInsets.only(top: 20, left: 15, bottom: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          color: Colors.white.withOpacity(1),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.5),
              spreadRadius: 1,
              blurRadius: 1,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: IconButton(
          padding: EdgeInsets.zero,
          icon: const Icon(Icons.arrow_back, size: 18), // Adjusted icon size
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
      ),
    );
  }
}
