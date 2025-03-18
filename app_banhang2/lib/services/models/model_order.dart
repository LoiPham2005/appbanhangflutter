class ModelOrder {
  final String idUser;
  final List<Map<String, dynamic>> items;
  final double totalPrice;
  final double shippingFee;
  final double discount;
  final double finalTotal;
  final String paymentMethod;
  final String shippingAddress;
  final String? voucherId;

  ModelOrder({
    required this.idUser,
    required this.items,
    required this.totalPrice,
    required this.shippingFee,
    required this.discount,
    required this.finalTotal,
    required this.paymentMethod,
    required this.shippingAddress,
    this.voucherId,
  });

  Map<String, dynamic> toJson() => {
    'id_user': idUser,
    'items': items.map((item) => {
      'id_product': item['product']['_id'],
      'purchaseQuantity': item['purchaseQuantity'],
      'price': item['product']['price'],
    }).toList(),
    'totalPrice': totalPrice,
    'shippingFee': shippingFee,
    'discount': discount,
    'finalTotal': finalTotal,
    'paymentMethod': paymentMethod,
    'shippingAddress': shippingAddress,
    if (voucherId != null) 'voucherId': voucherId,
  };
}