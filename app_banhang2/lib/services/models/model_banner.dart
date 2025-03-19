class ModelBanner {
  final List<String> homeBanner;

  ModelBanner({required this.homeBanner});

  factory ModelBanner.fromJson(Map<String, dynamic> json) {
    return ModelBanner(
      homeBanner: List<String>.from(json['banner_image'] ?? []),
    );
  }
}