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
    try {
      final prefs = await SharedPreferences.getInstance();

      // Get values as String
      final name = prefs.getString('userName') ?? 'Guest User';
      final email = prefs.getString('userEmail') ?? 'guest@example.com';
      final avatar = prefs.getString('userAvatar');

      if (mounted) {
        setState(() {
          userName = name;
          userEmail = email;
          userAvatar = avatar;
        });
      }
    } catch (e) {
      print('Error loading user info: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
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
            onTap: () => Navigator.pushReplacement(
              context,
              MaterialPageRoute(builder: (context) => const HomeScreen()),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: Text('my_order'.tr()),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const OrderScreen()),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: Text('my_cart'.tr()),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const CartScreen()),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.shopping_cart),
            title: Text('my_profile'.tr()),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ProfileScreen()),
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.settings),
            title: Text('settings.title'.tr()),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const SettingScreen()),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.help),
            title: Text('support2.title'.tr()),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const SupportScreen()),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.info),
            title: Text('aboutUs.title'.tr()),
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const AboutUsScreen()),
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Logout'),
            onTap: () async {
              // Show confirmation dialog
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: const Text("Xác nhận đăng xuất"),
                    content: const Text("Bạn có chắc chắn muốn đăng xuất?"),
                    actions: <Widget>[
                      TextButton(
                        child: const Text("Hủy"),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                      TextButton(
                        child: const Text("Đăng xuất"),
                        onPressed: () async {
                          try {
                            final prefs = await SharedPreferences.getInstance();

                            // Clear specific data
                            await prefs.remove('userId');
                            await prefs.remove('userName');
                            await prefs.remove('userEmail');
                            await prefs.remove('userAvatar');
                            await prefs.remove('accessToken');
                            await prefs.remove('refreshToken');
                            await prefs.remove('userPhone');
                            await prefs.remove('userBirthDate');
                            await prefs.remove('userSex');

                            // Optional: Clear all data if you want to remove everything
                            // await prefs.clear();

                            if (mounted) {
                              // Close dialog and navigate to login
                              Navigator.of(context).pop();
                              // Navigate to login screen and remove all previous routes
                              Navigator.of(context).pushAndRemoveUntil(
                                MaterialPageRoute(
                                    builder: (context) => const LoginScreen()),
                                (route) => false,
                              );
                            }
                          } catch (e) {
                            print('Error during logout: $e');
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content:
                                        Text('Đã xảy ra lỗi khi đăng xuất')),
                              );
                            }
                          }
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
    );
  }
}
