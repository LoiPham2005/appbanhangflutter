class ModelProduct {
  final String id; // ID của sản phẩm
  final String image; // This will be a comma-separated string of image URLs
  final String title; // Tên sản phẩm
  final String brand; // Thương hiệu
  final double price; // Giá sản phẩm
  final String description; // Mô tả chi tiết
  final String size; // Kích cỡ
  final String color; // Màu sắc
  final String material; // Chất liệu
  final int stockQuantity; // Số lượng tồn kho
  final String idCategory; // ID danh mục sản phẩm
  final String
      status; // Trạng thái sản phẩm: active, out of stock, discontinued
  final DateTime createdAt; // Ngày tạo
  final DateTime updatedAt; // Ngày cập nhật

  ModelProduct({
    required this.id,
    required this.image,
    required this.title,
    required this.brand,
    required this.price,
    required this.description,
    required this.size,
    required this.color,
    required this.material,
    required this.stockQuantity,
    required this.idCategory,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  // Tạo Product từ JSON (phục vụ lấy dữ liệu từ API)
  factory ModelProduct.fromJson(Map<String, dynamic> json) {
    return ModelProduct(
      id: json['_id'] ?? '',
      // Handle media array from API
      image: (json['media'] as List<dynamic>?)
              ?.map((media) => media['url'].toString())
              .join(',') ??
          '',
      title: json['title'] ?? '',
      brand: json['publishing_house'] ?? '', // Map publishing_house to brand
      price: (json['price'] ?? 0).toDouble(),
      description: json['description'] ?? '',
      size: json['size'] ?? '',
      color: json['color'] ?? '',
      material: json['material'] ?? '',
      stockQuantity: json['stock_quantity'] ?? 0,
      idCategory: json['id_category'] ?? '',
      status: json['status'] ?? 'active',
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  // Chuyển Product thành JSON (phục vụ gửi dữ liệu lên API)
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'image': image,
      'title': title,
      'brand': brand,
      'price': price,
      'description': description,
      'size': size,
      'color': color,
      'material': material,
      'stock_quantity': stockQuantity,
      'id_category': idCategory,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}
