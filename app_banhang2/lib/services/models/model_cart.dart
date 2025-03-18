class ModelCart {
  String id;
  String id_user;
  String id_product;
  int purchaseQuantity;
  DateTime? createdAt;
  DateTime? updatedAt;

  ModelCart({
    this.id = '',
    required this.id_user,
    required this.id_product,
    required this.purchaseQuantity,
    this.createdAt,
    this.updatedAt,
  });

  factory ModelCart.fromJson(Map<String, dynamic> json) {
    return ModelCart(
      id: json['_id'] ?? '',
      id_user: json['id_user'] ?? '',
      id_product: json['id_product'] ?? '',
      purchaseQuantity: json['purchaseQuantity'] ?? 0,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id_user': id_user,
    'id_product': id_product,
    'purchaseQuantity': purchaseQuantity,
  };
}