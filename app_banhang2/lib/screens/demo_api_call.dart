import 'package:app_banhang2/components/my_drawer.dart';
import 'package:app_banhang2/services/models/model_product.dart';
import 'package:app_banhang2/services/service_products.dart';
import 'package:flutter/material.dart';

class DemoAPICall extends StatefulWidget {
  const DemoAPICall({super.key});

  @override
  State<DemoAPICall> createState() => _DemoAPICallState();
}

class _DemoAPICallState extends State<DemoAPICall> {
  List<ModelProduct> _products = []; // Danh sách sản phẩm
  final APIProduct _apiProduct = APIProduct();

  @override
  void initState() {
    super.initState();
    _loadProducts(); // Gọi hàm load sản phẩm khi mở màn hình
  }

  // Hàm tải toàn bộ sản phẩm
  void _loadProducts() async {
    final products = await _apiProduct.getProducts();
    setState(() {
      _products = products;
    });
  }

  // Hàm xóa sản phẩm
  void _deleteProduct(String productId) async {
    final message = await _apiProduct.deleteProduct(productId);
    // ignore: use_build_context_synchronously
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
    _loadProducts(); // Reload lại danh sách
  }

  // Hàm chỉnh sửa sản phẩm
  void _editProduct(ModelProduct product) {
    // Chuyển sang màn hình chỉnh sửa (giả định có màn hình EditProductScreen)
    Navigator.push(
      context,
      MaterialPageRoute(
          builder: (context) => EditProductScreen(product: product)),
    ).then((_) => _loadProducts()); // Reload sau khi chỉnh sửa
  }

  // Hàm thêm sản phẩm mới
  void _addProduct() {
    // Chuyển sang màn hình thêm sản phẩm
    Navigator.push(
      context,
      // ignore: prefer_const_constructors
      MaterialPageRoute(builder: (context) => AddProductScreen()),
    ).then((_) => _loadProducts()); // Reload sau khi thêm
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Discover Products'),
      ),
      drawer: const MyDrawer(),
      body: _products.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _products.length,
              itemBuilder: (context, index) {
                final product = _products[index];
                return ListTile(
                  leading: Image.network(
                    product.image,
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        const Icon(Icons.image_not_supported),
                  ),
                  title: Text(product.title),
                  subtitle: Text('Giá: ${product.price.toString()} VND'),
                  trailing: const Icon(Icons.edit),
                  onTap: () => _editProduct(product), // Nhấn để chỉnh sửa
                  onLongPress: () =>
                      _deleteProduct(product.id), // Nhấn giữ để xóa
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addProduct,
        tooltip: 'Thêm sản phẩm', // Thêm sản phẩm mới
        child: const Icon(Icons.add),
      ),
    );
  }
}

// ================== Màn hình chỉnh sửa (giả lập) ==================
class EditProductScreen extends StatelessWidget {
  final ModelProduct product;

  const EditProductScreen({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Chỉnh sửa sản phẩm")),
      body: Center(
        child: Text('Chỉnh sửa sản phẩm: ${product.title}'),
      ),
    );
  }
}

// ================== Màn hình thêm mới (giả lập) ==================
class AddProductScreen extends StatelessWidget {
  const AddProductScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Thêm sản phẩm mới")),
      body: const Center(
        child: Text('Form thêm sản phẩm mới'),
      ),
    );
  }
}
