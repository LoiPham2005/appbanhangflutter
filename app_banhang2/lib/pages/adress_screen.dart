import 'package:app_banhang2/components/loading.dart';
import 'package:app_banhang2/services/models/model_address.dart';
import 'package:app_banhang2/services/service_address.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AddressScreen extends StatefulWidget {
  const AddressScreen({super.key});

  @override
  State<AddressScreen> createState() => _AddressScreenState();
}

class _AddressScreenState extends State<AddressScreen> {
  final AddressService _addressService = AddressService();
  bool _isLoading = true;
  List<ModelAddress> _addresses = [];

  @override
  void initState() {
    super.initState();
    _loadAddresses();
  }

  Future<void> _loadAddresses() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');
      
      if (userId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('login_required'.tr()))
        );
        return;
      }

      final addresses = await _addressService.getAddresses(userId);
      if (mounted) {
        setState(() => _addresses = addresses);
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _deleteAddress(ModelAddress address) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('delete_address_title'.tr()),
        content: Text('delete_address_message'.tr()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('cancel'.tr()),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: Text('delete'.tr()),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      setState(() => _isLoading = true);
      try {
        final success = await _addressService.deleteAddress(address.id);
        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('delete_success'.tr()))
          );
          _loadAddresses();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('delete_failed'.tr()))
          );
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  void _selectAddress(ModelAddress address) {
    final fullAddress = '${address.fullName}, ${address.phone}, ${address.receivingAddress}, '
        '${address.commune}, ${address.district}, ${address.province}';
    Navigator.pop(context, fullAddress);
  }

  Widget _buildAddressCard(ModelAddress address) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      address.fullName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    PopupMenuButton<String>(
                      onSelected: (value) {
                        if (value == 'delete') {
                          _deleteAddress(address);
                        }
                      },
                      itemBuilder: (context) => [
                        PopupMenuItem(
                          value: 'delete',
                          child: Row(
                            children: [
                              const Icon(Icons.delete_outline, color: Colors.red),
                              const SizedBox(width: 8),
                              Text('delete'.tr()),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${address.receivingAddress}, ${address.commune}, '
                  '${address.district}, ${address.province}',
                  style: const TextStyle(fontSize: 14),
                ),
                const SizedBox(height: 4),
                Text(
                  address.phone,
                  style: const TextStyle(fontSize: 14),
                ),
                const SizedBox(height: 8),
                ElevatedButton(
                  onPressed: () => _selectAddress(address),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    minimumSize: const Size(100, 36),
                  ),
                  child: Text('use_address'.tr()),
                ),
              ],
            ),
          ),
          if (address.isDefault)
            Positioned(
              top: 8,
              right: 48,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  'default'.tr(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          title: Text('address_title'.tr()),
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                // Navigate to add address screen
              },
            ),
          ],
        ),
        body: RefreshIndicator(
          onRefresh: _loadAddresses,
          child: _addresses.isEmpty
              ? Center(child: Text('no_addresses'.tr()))
              : ListView.builder(
                  itemCount: _addresses.length,
                  itemBuilder: (context, index) => 
                    _buildAddressCard(_addresses[index]),
                ),
        ),
      ),
    );
  }
}