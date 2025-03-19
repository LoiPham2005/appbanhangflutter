import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:app_banhang2/pages/chang_password_setting.dart';

class SettingScreen extends StatelessWidget {
  const SettingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> menuItems = [
      {
        'icon': Icons.lock,
        'title': 'settings.changePassword'.tr(),
        'onPressed': () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ChangePasswordScreen(),
              ),
            ),
      },
      {
        'icon': Icons.dark_mode,
        'title': 'settings.darkMode.title'.tr(),
        'onPressed': () => Navigator.pushNamed(context, 'ThemeSettings'),
      },
      {
        'icon': Icons.language,
        'title': 'settings.language'.tr(),
        'onPressed': () => Navigator.pushNamed(context, 'LanguageSettings'),
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text('settings.title'.tr()),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(15),
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: menuItems.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                return Column(
                  children: [
                    ListTile(
                      leading: Icon(
                        item['icon'] as IconData,
                        color: Theme.of(context).primaryColor,
                      ),
                      title: Text(item['title'] as String),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: item['onPressed'] as VoidCallback,
                    ),
                    if (index < menuItems.length - 1)
                      const Divider(height: 1, thickness: 1),
                  ],
                );
              }).toList(),
            ),
          ),
        ),
      ),
    );
  }
}
