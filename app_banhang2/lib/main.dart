import 'package:app_banhang2/screens/home_screen.dart';
import 'package:app_banhang2/themes/light_mode.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

void main() async {
  // Đảm bảo EasyLocalization được khởi tạo trước khi ứng dụng chạy
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();

  runApp(
    EasyLocalization(
      supportedLocales: const [
        Locale('en'), // Tiếng Anh
        Locale('vi'), // Tiếng Việt
      ],
      path: 'assets/translations', // Đường dẫn tới tệp dịch
      fallbackLocale: const Locale('en'), // Ngôn ngữ mặc định
      child: const MainApp(),
    ),
  );
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: lightMode,
      // Add useMaterial3: true
      locale: context.locale, // Lấy locale từ EasyLocalization
      supportedLocales: context.supportedLocales, // Danh sách ngôn ngữ hỗ trợ
      localizationsDelegates:
          context.localizationDelegates, // Cấu hình đa ngôn ngữ
      home: const HomeScreen(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('intro'.tr()), // Sử dụng key dịch
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('login_title'.tr()), // Sử dụng key dịch
            ElevatedButton(
              onPressed: () {
                // Thay đổi ngôn ngữ sang tiếng Anh
                context.setLocale(const Locale('en'));
              },
              child: const Text('Switch to English'),
            ),
            ElevatedButton(
              onPressed: () {
                // Thay đổi ngôn ngữ sang tiếng Việt
                context.setLocale(const Locale('vi'));
              },
              child: const Text('Chuyển sang Tiếng Việt'),
            ),
          ],
        ),
      ),
    );
  }
}
