import 'package:app_banhang2/pages/adress_screen.dart';
import 'package:app_banhang2/pages/voucher_screen.dart';
import 'package:app_banhang2/screens/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:app_banhang2/components/loading.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app_banhang2/services/models/model_order.dart';
import 'package:app_banhang2/services/service_order.dart';

class OrderPayment extends StatefulWidget {
  final List<Map<String, dynamic>> selectedItems;
  final double totalPrice;

  const OrderPayment({
    super.key,
    required this.selectedItems,
    required this.totalPrice,
  });

  @override
  State<OrderPayment> createState() => _OrderPaymentState();
}

class _OrderPaymentState extends State<OrderPayment> {
  final OrderService _orderService = OrderService();
  bool _isLoading = false;
  String _address = '';
  String _paymentMethod = 'cod';
  double _shippingFee = 30000;
  double _discount = 0;
  Map<String, dynamic>? _selectedVoucher;
  final numberFormat = NumberFormat("#,###", "vi_VN");

  double _calculateTotal() {
    return widget.totalPrice + _shippingFee - _discount;
  }

  Future<void> _selectAddress() async {
    final result = await Navigator.push<String>(
      context,
      MaterialPageRoute(builder: (context) => const AddressScreen()),
    );

    if (result != null) {
      setState(() => _address = result);
    }
  }

  Future<void> _placeOrder() async {
    // Validate address
    if (_address.isEmpty) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('please_select_address'.tr())));
      return;
    }

    setState(() => _isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      if (userId == null) {
        throw Exception('User not logged in');
      }

      final order = ModelOrder(
        idUser: userId,
        items: widget.selectedItems,
        totalPrice: widget.totalPrice,
        shippingFee: _shippingFee,
        discount: _discount,
        finalTotal: _calculateTotal(),
        paymentMethod: _paymentMethod,
        shippingAddress: _address,
        voucherId: _selectedVoucher?['_id'],
      );

      final result = await _orderService.createOrder(order);

      if (mounted) {
        if (result['status'] == 200) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (context) => AlertDialog(
              title: Text('order_success'.tr()),
              content: Text('order_success_message'.tr()),
              actions: [
                TextButton(
                  onPressed: () {
                    // Navigator.popUntil(context, (route) => route.isFirst);
                    Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => HomeScreen(),
                        ));
                  },
                  child: Text('ok'.tr()),
                ),
              ],
            ),
          );
        } else {
          throw Exception(result['message'] ?? 'Unknown error');
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('order_failed'.tr())));
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Widget _buildSelectedItems() {
    return Column(
      children: widget.selectedItems.map((item) {
        final product = item['product'];
        final imageUrl = product?['media']?[0]?['url'] ?? '';

        return Container(
          padding: const EdgeInsets.all(8),
          margin: const EdgeInsets.only(bottom: 8),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              // Product Image
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  imageUrl,
                  width: 70,
                  height: 70,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    width: 70,
                    height: 70,
                    color: Colors.grey[300],
                    child: const Icon(Icons.image_not_supported),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Product Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product?['title'] ?? '',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '₫${numberFormat.format(product?['price'] ?? 0)}',
                          style: const TextStyle(
                            color: Colors.red,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'x${item['purchaseQuantity']}',
                          style: TextStyle(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          title: Text('order_payment'.tr()),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Delivery Address Section
              Card(
                child: ListTile(
                  leading: const Icon(Icons.location_on_outlined),
                  title: Text('delivery_address'.tr()),
                  subtitle:
                      Text(_address.isEmpty ? 'select_address'.tr() : _address),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: _selectAddress,
                ),
              ),
              const SizedBox(height: 16),

              // Selected Items Section
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'selected_items'.tr(),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildSelectedItems(),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Voucher Section
              Card(
                child: ListTile(
                  leading: const Icon(Icons.local_offer_outlined),
                  title: Text('voucher'.tr()),
                  subtitle: Text(_selectedVoucher != null
                      ? '${_selectedVoucher!['name']} - ${_selectedVoucher!['discountValue']}${_selectedVoucher!['discountType'] == 'percentage' ? '%' : 'đ'}'
                      : 'select_voucher'.tr()),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () async {
                    final result = await Navigator.push<Map<String, dynamic>>(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const VoucherScreen()),
                    );

                    if (result != null) {
                      setState(() {
                        _selectedVoucher = result;
                        _discount = result['discountType'] == 'percentage'
                            ? widget.totalPrice * result['discountValue'] / 100
                            : result['discountValue'].toDouble();
                      });
                    }
                  },
                ),
              ),
              const SizedBox(height: 16),

              // Payment Method Section
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'payment_method'.tr(),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      RadioListTile(
                        value: 'cod',
                        groupValue: _paymentMethod,
                        title: Text('cod'.tr()),
                        onChanged: (value) =>
                            setState(() => _paymentMethod = value.toString()),
                      ),
                      RadioListTile(
                        value: 'wallet',
                        groupValue: _paymentMethod,
                        title: Text('e_wallet'.tr()),
                        onChanged: (value) =>
                            setState(() => _paymentMethod = value.toString()),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Order Summary
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      _buildSummaryRow('subtotal'.tr(), widget.totalPrice),
                      _buildSummaryRow('shipping_fee'.tr(), _shippingFee),
                      _buildSummaryRow('discount'.tr(), _discount,
                          isDiscount: true),
                      const Divider(),
                      _buildSummaryRow(
                        'total'.tr(),
                        _calculateTotal(),
                        isTotal: true,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        bottomNavigationBar: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.2),
                spreadRadius: 1,
                blurRadius: 5,
                offset: const Offset(0, -1),
              ),
            ],
          ),
          child: ElevatedButton(
            onPressed: _isLoading ? null : _placeOrder,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            child: Text(_isLoading ? 'processing'.tr() : 'place_order'.tr()),
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, double amount,
      {bool isTotal = false, bool isDiscount = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: isTotal ? 18 : 16,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            '${isDiscount ? "-" : ""}₫${numberFormat.format(amount)}',
            style: TextStyle(
              fontSize: isTotal ? 18 : 16,
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              color: isDiscount ? Colors.green : (isTotal ? Colors.red : null),
            ),
          ),
        ],
      ),
    );
  }
}
