class ModelBanner {
  final String id;
  final List<String> homeBanner;

  ModelBanner({
    required this.id,
    required this.homeBanner,
  });

  factory ModelBanner.fromJson(Map<String, dynamic> json) {
    return ModelBanner(
      id: json['_id'] ?? '',
      homeBanner: (json['homeBanner'] as List<dynamic>?)?.cast<String>() ?? [],
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'homeBanner': homeBanner,
      };
}
