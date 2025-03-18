class ModelAddress {
  final String id;
  final String fullName;
  final String province;
  final String district;
  final String commune;
  final String receivingAddress;
  final String phone;
  final String idUser;
  final bool isDefault;

  ModelAddress({
    required this.id,
    required this.fullName,
    required this.province,
    required this.district,
    required this.commune,
    required this.receivingAddress,
    required this.phone,
    required this.idUser,
    this.isDefault = false,
  });

  factory ModelAddress.fromJson(Map<String, dynamic> json) {
    return ModelAddress(
      id: json['_id'] ?? '',
      fullName: json['fullName'] ?? '',
      province: json['province'] ?? '',
      district: json['district'] ?? '',
      commune: json['commune'] ?? '',
      receivingAddress: json['receivingAddress'] ?? '',
      phone: json['phone']?.toString() ?? '',
      idUser: json['id_user'] ?? '',
      isDefault: json['chooseDefault'] ?? false,
    );
  }
}