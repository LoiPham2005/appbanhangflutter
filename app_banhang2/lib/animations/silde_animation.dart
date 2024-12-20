import 'package:flutter/material.dart';

abstract class SlideAnimation extends StatelessWidget {
  const SlideAnimation({super.key, required this.child});

  final Widget child;

  static Route<dynamic> createRoute(Widget child) {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOutQuad;

        var tween =
            Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
        var offsetAnimation = animation.drive(tween);

        return SlideTransition(
          position: offsetAnimation,
          child: child,
        );
      },
      transitionDuration: const Duration(milliseconds: 500),
    );
  }

// cách 2
  // return PageRouteBuilder(
  //   pageBuilder: (context, animation, secondaryAnimation) =>
  //       const LoginScreen(),

  //   // cách 1
  //   // transitionsBuilder: (context, animation, secondaryAnimation, child) {
  //   //   final tween = Tween<double>(begin: 0.0, end: 1.0);
  //   //   final curvedAnimation = CurvedAnimation(
  //   //     parent: animation,
  //   //     curve: Curves.easeInOutQuad,
  //   //   );
  //   //   return SlideTransition(
  //   //     position: Tween<Offset>(
  //   //       begin: const Offset(1, 0),
  //   //       end: Offset.zero,
  //   //     ).animate(curvedAnimation),
  //   //     child: child,
  //   //   );
  //   // },
}
