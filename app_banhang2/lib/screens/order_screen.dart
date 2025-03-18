import 'package:flutter/material.dart';
import 'package:app_banhang2/services/service_order.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'package:app_banhang2/services/service_review_order.dart';

class OrderScreen extends StatefulWidget {
  const OrderScreen({super.key});

  @override
  State<OrderScreen> createState() => _OrderScreenState();
}

class _OrderScreenState extends State<OrderScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final OrderService _orderService = OrderService();
  final ReviewOrderService _reviewService = ReviewOrderService();
  final ImagePicker _picker = ImagePicker();
  bool _isLoading = true;
  List<Map<String, dynamic>> _orders = [];
  String? _userId;
  final numberFormat = NumberFormat("#,###", "vi_VN");

  final List<Tab> _tabs = [
    Tab(text: 'Chờ xác nhận'),
    Tab(text: 'Đã xác nhận'),
    Tab(text: 'Đang giao'),
    Tab(text: 'Đã giao'),
    Tab(text: 'Yêu cầu trả'),
    Tab(text: 'Đã chấp nhận'),
    Tab(text: 'Đã từ chối'),
    Tab(text: 'Đã trả hàng'),
    Tab(text: 'Đã đánh giá'),
    Tab(text: 'Đã hủy'),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _loadOrders();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadOrders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');
      if (userId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('login_required'.tr())),
        );
        return;
      }
      setState(() => _userId = userId);
      await _fetchOrders();
    } catch (e) {
      print('Error loading orders: $e');
    }
  }

  Future<void> _fetchOrders() async {
    if (_userId == null) return;
    setState(() => _isLoading = true);
    try {
      final orders = await _orderService.getUserOrders(_userId!);
      if (mounted) {
        setState(() {
          _orders = orders;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching orders: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _showReturnRequestDialog(Map<String, dynamic> order) async {
    final TextEditingController reasonController = TextEditingController();
    List<String> selectedImages = [];

    final bool? result = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text('request_return'.tr()),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: reasonController,
                  decoration: InputDecoration(
                    labelText: 'return_reason'.tr(),
                    hintText: 'enter_return_reason'.tr(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () async {
                    final XFile? image = await _picker.pickImage(
                      source: ImageSource.gallery,
                    );
                    if (image != null) {
                      setState(() {
                        selectedImages.add(image.path);
                      });
                    }
                  },
                  child: Text('add_photos'.tr()),
                ),
                if (selectedImages.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text('${selectedImages.length} ${'photos_selected'.tr()}'),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text('cancel'.tr()),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(context, true),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              child: Text('submit_return'.tr()),
            ),
          ],
        ),
      ),
    );

    if (result == true && reasonController.text.isNotEmpty) {
      setState(() => _isLoading = true);
      try {
        final success = await _orderService.requestReturn(
          order['_id'],
          reasonController.text,
          selectedImages,
        );

        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('return_request_success'.tr())),
          );
          await _fetchOrders();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('return_request_failed'.tr())),
          );
        }
      } finally {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _showReviewDialog(Map<String, dynamic> order) async {
    final TextEditingController reviewController = TextEditingController();
    int rating = 0;
    List<String> selectedImages = [];

    final bool? result = await showDialog<bool>(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text('write_review'.tr()),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) {
                    return IconButton(
                      icon: Icon(
                        index < rating ? Icons.star : Icons.star_border,
                        color: Colors.amber,
                      ),
                      onPressed: () {
                        setState(() => rating = index + 1);
                      },
                    );
                  }),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: reviewController,
                  decoration: InputDecoration(
                    labelText: 'review'.tr(),
                    hintText: 'write_your_review'.tr(),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () async {
                    final XFile? image = await _picker.pickImage(
                      source: ImageSource.gallery,
                    );
                    if (image != null) {
                      setState(() {
                        selectedImages.add(image.path);
                      });
                    }
                  },
                  child: Text('add_photos'.tr()),
                ),
                if (selectedImages.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text('${selectedImages.length} ${'photos_selected'.tr()}'),
                ],
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text('cancel'.tr()),
            ),
            ElevatedButton(
              onPressed: rating > 0 ? () => Navigator.pop(context, true) : null,
              child: Text('submit_review'.tr()),
            ),
          ],
        ),
      ),
    );

    if (result == true && rating > 0) {
      setState(() => _isLoading = true);
      try {
        final success = await _reviewService.addReview(
          userId: _userId!,
          orderId: order['_id'],
          productId: order['items'][0]['id_product'],
          rating: rating,
          comment: reviewController.text,
          images: selectedImages,
        );

        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('review_success'.tr())),
          );
          await _fetchOrders();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('review_failed'.tr())),
          );
        }
      } finally {
        setState(() => _isLoading = false);
      }
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return const Color(0xFFFFA500);
      case 'confirmed':
        return const Color(0xFF2196F3);
      case 'shipping':
        return const Color(0xFF9C27B0);
      case 'delivered':
        return const Color(0xFF4CAF50);
      case 'cancelled':
        return const Color(0xFFF44336);
      default:
        return Colors.black;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  Widget _buildOrderCard(Map<String, dynamic> order) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Đơn hàng #${order['_id'].toString().substring(order['_id'].toString().length - 6)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      DateFormat('dd/MM/yyyy HH:mm').format(
                        DateTime.parse(order['createdAt']),
                      ),
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(order['status']),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusText(order['status']),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '₫${numberFormat.format(order['finalTotal'])}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Địa chỉ: ${order['shippingAddress']}',
              style: const TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 4),
            Text(
              'Phương thức: ${order['paymentMethod'] == 'wallet' ? 'Ví điện tử' : 'Tiền mặt'}',
              style: const TextStyle(fontSize: 13),
            ),
            if (order['status'] == 'delivered')
              Padding(
                padding: const EdgeInsets.only(top: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    ElevatedButton(
                      onPressed: () => _showReviewDialog(order),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      child: Text('review'.tr()),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () => _showReturnRequestDialog(order),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      child: Text('request_return'.tr()),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderList(String status) {
    final filteredOrders =
        _orders.where((order) => order['status'] == status).toList();

    return RefreshIndicator(
      onRefresh: _fetchOrders,
      child: filteredOrders.isEmpty
          ? Center(child: Text('no_orders'.tr()))
          : ListView.builder(
              itemCount: filteredOrders.length,
              itemBuilder: (context, index) =>
                  _buildOrderCard(filteredOrders[index]),
            ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('my_orders'.tr()),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: _tabs,
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildOrderList('pending'),
                _buildOrderList('confirmed'),
                _buildOrderList('shipping'),
                _buildOrderList('delivered'),
                _buildOrderList('return_requested'),
                _buildOrderList('return_approved'),
                _buildOrderList('return_rejected'),
                _buildOrderList('returned'),
                _buildOrderList('reviewed'),
                _buildOrderList('cancelled'),
              ],
            ),
    );
  }
}
