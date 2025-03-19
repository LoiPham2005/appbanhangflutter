import 'package:app_banhang2/pages/edit_profile.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:easy_localization/easy_localization.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String? userName;
  String? userEmail;
  String? userAvatar;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        userName = prefs.getString('userName');
        userEmail = prefs.getString('userEmail');
        userAvatar = prefs.getString('userAvatar');
      });
    } catch (e) {
      print('Error loading user data: $e');
    }
  }

  List<Map<String, dynamic>> get menuItems => [
        {
          'icon': Icons.credit_card,
          'title': 'profile.paymentMethod'.tr(),
          'onPressed': () {
            // Navigate to WalletScreen
          },
        },
        {
          'icon': Icons.favorite,
          'title': 'profile.wishlist'.tr(),
          'onPressed': () {},
        },
        {
          'icon': Icons.star,
          'title': 'profile.appReviews'.tr(),
          'onPressed': () {},
        },
      ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Header Section
            Container(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  // Avatar
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.grey[300],
                    backgroundImage:
                        userAvatar != null ? NetworkImage(userAvatar!) : null,
                    child: userAvatar == null
                        ? const Icon(Icons.person, size: 40, color: Colors.grey)
                        : null,
                  ),
                  const SizedBox(width: 15),
                  // User Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          userName ?? 'User Name',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          userEmail ?? 'email@example.com',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Edit Button
                  IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () async {
                      final result = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const EditProfileScreen(),
                        ),
                      );

                      // Nếu cập nhật thành công thì load lại thông tin
                      if (result == true) {
                        await _loadUserData();
                      }
                    },
                  ),
                ],
              ),
            ),
            // Menu Items
            Container(
              margin: const EdgeInsets.only(top: 20),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                children: menuItems.map((item) {
                  final isLast = item == menuItems.last;
                  return Container(
                    decoration: BoxDecoration(
                      border: !isLast
                          ? Border(
                              bottom: BorderSide(color: Colors.grey[300]!),
                            )
                          : null,
                    ),
                    child: ListTile(
                      leading: Icon(
                        item['icon'] as IconData,
                        color: Theme.of(context).primaryColor,
                      ),
                      title: Text(item['title'] as String),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: item['onPressed'] as void Function(),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
