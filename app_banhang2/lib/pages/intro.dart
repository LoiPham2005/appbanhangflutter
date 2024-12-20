import 'package:app_banhang2/animations/silde_animation.dart';
import 'package:app_banhang2/login_register/login.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class Intro extends StatelessWidget {
  const Intro({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SizedBox(
        width: double.infinity,
        height: double.infinity,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.asset(
                'assets/images/intro.png',
                fit: BoxFit.cover,
              ),
            ),
            Positioned.fill(
              child: Container(
                color: Colors.black.withOpacity(0.3),
              ),
            ),
            Container(
              margin: const EdgeInsets.only(top: 50),
              child: Text(
                'intro'.tr(),
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Theme.of(context).colorScheme.inversePrimary,
                  fontSize: 30,
                ),
              ),
            ),
            Align(
              alignment: Alignment.bottomCenter,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 50),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(SlideAnimation.createRoute(const LoginScreen()));
                  },
                  child: const Text('Nhấn vào đây'),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
