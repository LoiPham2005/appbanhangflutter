class ModelVoucher {
  final String id;
  final String name;
  final String code;
  final String discountType;
  final double discountValue;
  final String? condition;
  final DateTime startDate;
  final DateTime endDate;
  final int quantity;

  ModelVoucher({
    required this.id,
    required this.name,
    required this.code,
    required this.discountType,
    required this.discountValue,
    this.condition,
    required this.startDate,
    required this.endDate,
    required this.quantity,
  });

  factory ModelVoucher.fromJson(Map<String, dynamic> json) {
    return ModelVoucher(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      code: json['code'] ?? '',
      discountType: json['discountType'] ?? 'percentage',
      discountValue: double.tryParse(json['discountValue'].toString()) ?? 0.0,
      condition: json['condition'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      quantity: json['quantity'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'name': name,
        'code': code,
        'discountType': discountType,
        'discountValue': discountValue,
        'condition': condition,
        'startDate': startDate.toIso8601String(),
        'endDate': endDate.toIso8601String(),
        'quantity': quantity,
      };

  bool isValid() {
    final now = DateTime.now();
    return now.isAfter(startDate) && 
           now.isBefore(endDate) && 
           quantity > 0;
  }
}