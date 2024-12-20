import 'package:app_banhang2/login_register/login.dart';
import 'package:app_banhang2/screens/discover_screen.dart';
import 'package:app_banhang2/screens/home_screen.dart';
import 'package:app_banhang2/screens/order_screen.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class MyDrawer extends StatefulWidget {
  const MyDrawer({super.key});

  @override
  State<MyDrawer> createState() => _DrawerState();
}

class _DrawerState extends State<MyDrawer> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Drawer(
        width: MediaQuery.of(context).size.width / 1.5,
        child: ListView(
          children: [
            const DrawerHeader(child: Text("hhh")),
            ListTile(
              leading: const Icon(Icons.home),
              title: Text('homepage'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const HomeScreen(),
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.search),
              title: Text('discover'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const DiscoverScreen(),
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.shopping_cart),
              title: Text('my_order'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const CartScreen(),
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: Text('my_profile'.tr()),
            ),
            Container(
                margin: const EdgeInsets.only(left: 10),
                child: Text('other'.tr())),
            ListTile(
              leading: const Icon(Icons.settings),
              title: Text('setting'.tr()),
            ),
            ListTile(
              leading: const Icon(Icons.support),
              title: Text('support'.tr()),
            ),
            ListTile(
              leading: const Icon(Icons.info),
              title: Text('about_us'.tr()),
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (BuildContext context) {
                    return AlertDialog(
                      title: const Text("Do you want to logout?"),
                      actions: <Widget>[
                        TextButton(
                          child: const Text("No"),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                        TextButton(
                          child: const Text("Yes"),
                          onPressed: () {
                            Navigator.of(context).pop();
                            Navigator.of(context).push(MaterialPageRoute(
                              builder: (context) => const LoginScreen(),
                            ));
                          },
                        ),
                      ],
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
