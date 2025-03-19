import 'package:app_banhang2/login_register/login.dart';
import 'package:app_banhang2/screens/about_us_screen.dart';
// import 'package:app_banhang2/screens/discover_screen.dart'; // Remove this import
import 'package:app_banhang2/screens/home_screen.dart';
import 'package:app_banhang2/screens/cart_screen.dart'; // Make sure this import exists
import 'package:app_banhang2/screens/order_screen.dart';
import 'package:app_banhang2/screens/profile_screen.dart';
import 'package:app_banhang2/screens/setting_screen.dart';
import 'package:app_banhang2/screens/support_screen.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MyDrawer extends StatefulWidget {
  const MyDrawer({super.key});

  @override
  State<MyDrawer> createState() => _DrawerState();
}

class _DrawerState extends State<MyDrawer> {
  String? userName;
  String? userEmail;
  String? userAvatar;

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
  }

  Future<void> _loadUserInfo() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      userName = prefs.getString('userName');
      userEmail = prefs.getString('userEmail');
      userAvatar = prefs.getString('userAvatar');
    });
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Drawer(
        width: MediaQuery.of(context).size.width / 1.5,
        child: ListView(
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 35,
                    backgroundColor: Colors.grey[300],
                    backgroundImage:
                        userAvatar != null ? NetworkImage(userAvatar!) : null,
                    child: userAvatar == null
                        ? const Icon(Icons.person, size: 35, color: Colors.grey)
                        : null,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    userName ?? 'Guest User',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    userEmail ?? 'guest@example.com',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
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
              leading: const Icon(Icons.shopping_cart),
              title: Text('my_order'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const OrderScreen(), // Changed from DiscoverScreen to OrderScreen
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.shopping_cart),
              title: Text('my_cart'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const CartScreen(), // Changed from DiscoverScreen to OrderScreen
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: Text('my_profile'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const ProfileScreen(), // Changed from DiscoverScreen to OrderScreen
                  )),
            ),
            Container(
                margin: const EdgeInsets.only(left: 10),
                child: Text('other'.tr())),
            ListTile(
              leading: const Icon(Icons.settings),
              title: Text('setting'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const SettingScreen(), // Changed from DiscoverScreen to OrderScreen
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.support),
              title: Text('support'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const SupportScreen(), // Changed from DiscoverScreen to OrderScreen
                  )),
            ),
            ListTile(
              leading: const Icon(Icons.info),
              title: Text('about_us'.tr()),
              onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) =>
                        const AboutUsScreen(), // Changed from DiscoverScreen to OrderScreen
                  )),
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
