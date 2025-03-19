import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:app_banhang2/components/loading.dart';
import 'package:app_banhang2/services/service_user.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final ImagePicker _picker = ImagePicker();
  final ApiService _apiService = ApiService();
  bool _isLoading = false;

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();

  Map<String, dynamic> userData = {
    'avatar': null,
    'username': '',
    'sex': '',
    'phone': '',
    'birthDate': DateTime.now(),
  };

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        userData = {
          'avatar': prefs.getString('userAvatar'),
          'username': prefs.getString('userName') ?? '',
          'sex': prefs.getString('userSex') ?? '',
          'phone': prefs.getString('userPhone') ?? '',
          'birthDate': DateTime.parse(prefs.getString('userBirthDate') ??
              DateTime.now().toIso8601String()),
        };
        _usernameController.text = userData['username'];
        _phoneController.text = userData['phone'];
      });
    } catch (e) {
      print('Error loading user data: $e');
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _handleImagePick() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        setState(() {
          userData['avatar'] = image.path;
        });
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  Future<void> _handleSave() async {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('common.confirm'.tr()),
        content: Text('profile.editProfile.confirmMessage'.tr()),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('common.cancel'.tr()),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await _updateProfile();
            },
            child: Text('common.save'.tr()),
          ),
        ],
      ),
    );
  }

  Future<void> _updateProfile() async {
    setState(() => _isLoading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('userId');

      if (userId == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: Please login again')),
        );
        return;
      }

      String? uploadedImageUrl;
      // Only upload if it's a new image (local file path)
      if (userData['avatar'] != null &&
          !userData['avatar'].startsWith('http')) {
        print('Uploading new image...'); // Debug log
        uploadedImageUrl = await _apiService.uploadImage(userData['avatar']);
        if (uploadedImageUrl == null) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Error uploading image')),
            );
          }
          return;
        }
        print('Image uploaded successfully: $uploadedImageUrl'); // Debug log
      }

      // Prepare update data
      Map<String, dynamic> updateData = {
        'username': _usernameController.text.trim(),
        'sex': userData['sex'],
        'phone': _phoneController.text.trim(),
        'birth_date': userData['birthDate'].toIso8601String(),
      };

      // Only include avatar if there's a new one or an existing URL
      if (uploadedImageUrl != null ||
          (userData['avatar'] != null &&
              userData['avatar'].startsWith('http'))) {
        updateData['avatar'] = uploadedImageUrl ?? userData['avatar'];
      }

      print('Sending update request with data: $updateData'); // Debug log

      final result = await _apiService.updateProfile(userId, updateData);

      if (result != null && result['status'] == 200) {
        // Update SharedPreferences with new values
        await prefs.setString('userName', updateData['username']);
        await prefs.setString('userSex', updateData['sex'] ?? '');
        await prefs.setString('userPhone', updateData['phone'] ?? '');
        await prefs.setString('userBirthDate', updateData['birth_date']);
        if (uploadedImageUrl != null) {
          await prefs.setString('userAvatar', uploadedImageUrl);
        }

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('profile.updateSuccess'.tr())),
          );
          Navigator.pop(context, true);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('profile.updateError'.tr())),
          );
        }
      }
    } catch (e) {
      print('Error in _updateProfile: $e'); // Debug log
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('profile.updateError'.tr())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return LoadingOverlay(
      isLoading: _isLoading,
      child: Scaffold(
        appBar: AppBar(
          title: Text('profile.editProfile.title'.tr()),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Avatar Section
              Center(
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 60,
                      backgroundColor: Colors.grey[300],
                      backgroundImage: userData['avatar'] != null
                          ? (userData['avatar'].startsWith('http')
                              ? NetworkImage(userData['avatar'])
                              : FileImage(File(userData['avatar']))
                                  as ImageProvider)
                          : null,
                      child: userData['avatar'] == null
                          ? const Icon(Icons.person,
                              size: 60, color: Colors.grey)
                          : null,
                    ),
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: GestureDetector(
                        onTap: _handleImagePick,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          child:
                              Icon(Icons.edit, color: Colors.white, size: 20),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 30),

              // Form Fields
              TextField(
                controller: _usernameController,
                decoration: InputDecoration(
                  labelText: 'profile.username'.tr(),
                  border: OutlineInputBorder(),
                ),
                onChanged: (value) =>
                    setState(() => userData['username'] = value),
              ),
              const SizedBox(height: 20),

              // Gender Selection
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('profile.sex'.tr(), style: TextStyle(fontSize: 16)),
                  const SizedBox(height: 10),
                  Row(
                    children: ['male', 'female', 'other'].map((sex) {
                      return Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => userData['sex'] = sex),
                          child: Container(
                            margin: const EdgeInsets.symmetric(horizontal: 5),
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: userData['sex'] == sex
                                    ? Colors.red
                                    : Colors.grey,
                              ),
                              borderRadius: BorderRadius.circular(8),
                              color: userData['sex'] == sex ? Colors.red : null,
                            ),
                            child: Center(
                              child: Text(
                                'profile.${sex}'.tr(),
                                style: TextStyle(
                                  color: userData['sex'] == sex
                                      ? Colors.white
                                      : Colors.black,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Phone Number
              TextField(
                controller: _phoneController,
                decoration: InputDecoration(
                  labelText: 'profile.phone'.tr(),
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.phone,
                onChanged: (value) => setState(() => userData['phone'] = value),
              ),
              const SizedBox(height: 20),

              // Birth Date
              GestureDetector(
                onTap: () async {
                  final DateTime? picked = await showDatePicker(
                    context: context,
                    initialDate: userData['birthDate'],
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) {
                    setState(() => userData['birthDate'] = picked);
                  }
                },
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('dd/MM/yyyy').format(userData['birthDate']),
                        style: TextStyle(fontSize: 16),
                      ),
                      Icon(Icons.calendar_today),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // Save Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _handleSave,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    padding: const EdgeInsets.symmetric(vertical: 15),
                  ),
                  child: Text(
                    'profile.save'.tr(),
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
