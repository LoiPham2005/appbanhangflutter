import 'package:app_banhang2/components/loading.dart';
import 'package:app_banhang2/services/models/model_voucher.dart';
import 'package:app_banhang2/services/service_voucher.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class VoucherScreen extends StatefulWidget {
  const VoucherScreen({super.key});

  @override
  State<VoucherScreen> createState() => _VoucherScreenState();
}

class _VoucherScreenState extends State<VoucherScreen> {
  final VoucherService _voucherService = VoucherService();
  bool _isLoading = true;
  List<ModelVoucher> _vouchers = [];
  final numberFormat = NumberFormat("#,###", "vi_VN");

  @override
  void initState() {
    super.initState();
    _loadVouchers();
  }

  Future<void> _loadVouchers() async {
    try {
      final vouchers = await _voucherService.getVouchers();
      if (mounted) {
        setState(() {
          _vouchers = vouchers;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('error_loading_vouchers'.tr())),
        );
      }
    }
  }

  void _handleUseVoucher(ModelVoucher voucher) {
    if (!voucher.isValid()) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('voucher_expired'.tr())),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('use_voucher'.tr()),
        content: Text(
          'apply_voucher_discount'.tr(args: [
            '${voucher.discountValue}${voucher.discountType == 'percentage' ? '%' : 'đ'}'
          ]),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('cancel'.tr()),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context,
                  voucher.toJson()); // Return voucher to previous screen
            },
            child: Text('use'.tr()),
          ),
        ],
      ),
    );
  }

  Widget _buildVoucherItem(ModelVoucher voucher) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    voucher.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Code: ${voucher.code}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Discount: ${voucher.discountValue}${voucher.discountType == 'percentage' ? '%' : 'đ'}',
                    style: const TextStyle(
                      color: Colors.blue,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Valid: ${DateFormat('dd/MM/yyyy').format(voucher.startDate)} - ${DateFormat('dd/MM/yyyy').format(voucher.endDate)}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Remaining: ${voucher.quantity}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                  if (voucher.condition != null &&
                      voucher.condition!.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        voucher.condition!,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed:
                  voucher.isValid() ? () => _handleUseVoucher(voucher) : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 8,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              child: Text(
                'use'.tr(),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
          title: Text('available_vouchers'.tr()),
          centerTitle: true,
        ),
        body: _vouchers.isEmpty && !_isLoading
            ? Center(child: Text('no_vouchers'.tr()))
            : ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: _vouchers.length,
                itemBuilder: (context, index) =>
                    _buildVoucherItem(_vouchers[index]),
              ),
      ),
    );
  }
}
