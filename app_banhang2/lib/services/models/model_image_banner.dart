class ModelBanner {
  final String id;
  final String homeBanner;
  final String homeBanner1;
  final String homeBanner2;
  final String homeBanner3;
  final String homeBanner4;
  final String homeBanner5;
  final String homeBanner6;
  final String homeBanner7;
  final String disColothing;
  final String disAccess;
  final String disShoes;
  final String disCollection;

  ModelBanner({
    required this.id,
    required this.homeBanner,
    required this.homeBanner1,
    required this.homeBanner2,
    required this.homeBanner3,
    required this.homeBanner4,
    required this.homeBanner5,
    required this.homeBanner6,
    required this.homeBanner7,
    required this.disColothing,
    required this.disAccess,
    required this.disShoes,
    required this.disCollection,
  });

  factory ModelBanner.fromJson(Map<String, dynamic> json) {
    return ModelBanner(
      id: json['_id'] ?? '',
      homeBanner: json['homeBanner'],
      homeBanner1: json['homeBanner1'],
      homeBanner2: json['homeBanner2'],
      homeBanner3: json['homeBanner3'],
      homeBanner4: json['homeBanner4'],
      homeBanner5: json['homeBanner5'],
      homeBanner6: json['homeBanner6'],
      homeBanner7: json['homeBanner7'],
      disColothing: json['disColothing'],
      disAccess: json['disAccess'],
      disShoes: json['disShoes'],
      disCollection: json['disCollection'],
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'homeBanner': homeBanner,
        'homeBanner1': homeBanner1,
        'homeBanner2': homeBanner2,
        'homeBanner3': homeBanner3,
        'homeBanner4': homeBanner4,
        'homeBanner5': homeBanner5,
        'homeBanner6': homeBanner6,
        'homeBanner7': homeBanner7,
        'disColothing': disColothing,
        'disAccess': disAccess,
        'disShoes': disShoes,
        'disCollection': disCollection,
      };
}
