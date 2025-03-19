import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

class SupportScreen extends StatelessWidget {
  const SupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('support.title'.tr()),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Contact Section
            Text(
              'support.contact.title'.tr(),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            Text('support.contact.email'.tr()),
            Text('support.contact.phone'.tr()),
            Text('support.contact.hours'.tr()),
            
            const SizedBox(height: 25),
            
            // FAQ Section
            Text(
              'support.faq.title'.tr(),
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 10),
            
            // FAQ Items
            _buildFaqItem(context, 'support.faq.shipping'.tr()),
            _buildFaqItem(context, 'support.faq.returns'.tr()),
            _buildFaqItem(context, 'support.faq.payment'.tr()),
            
            const SizedBox(height: 25),
            
            // Help Section
            Container(
              padding: const EdgeInsets.all(15),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'support.help.title'.tr(),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text('support.help.description'.tr()),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFaqItem(BuildContext context, String text) {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: Colors.grey[300]!),
        ),
      ),
      child: ListTile(
        title: Text(text),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {},
      ),
    );
  }
}