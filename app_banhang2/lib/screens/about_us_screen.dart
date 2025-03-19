import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

class AboutUsScreen extends StatelessWidget {
  const AboutUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('aboutUs.title'.tr()),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'aboutUs.description'.tr(),
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 20),
            
            // Mission, Vision, Story section
            _buildText(context, 'aboutUs.content.mission'.tr()),
            _buildText(context, 'aboutUs.content.vision'.tr()),
            _buildText(context, 'aboutUs.content.story'.tr()),
            const SizedBox(height: 20),
            
            // Features section
            Text(
              'Features:',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            
            // Feature items
            _buildFeatureItem('aboutUs.features.variety'.tr()),
            _buildFeatureItem('aboutUs.features.service'.tr()),
            _buildFeatureItem('aboutUs.features.delivery'.tr()),
            _buildFeatureItem('aboutUs.features.payment'.tr()),
          ],
        ),
      ),
    );
  }

  Widget _buildText(BuildContext context, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(
        text,
        style: const TextStyle(fontSize: 16),
      ),
    );
  }

  Widget _buildFeatureItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 10, bottom: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(fontSize: 16)),
          Expanded(
            child: Text(text, style: const TextStyle(fontSize: 16)),
          ),
        ],
      ),
    );
  }
}