import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { productService } from '../../../../services/productService';
import { categoryService } from '../../../../services/CategoryService';
import { useTranslation } from 'react-i18next';
import RNPickerSelect from 'react-native-picker-select';
import { API_URL } from '../../../../services/URL_API';
import ImageWithDelete from '../../../../components/ImageWithDelete';
import LoadingOverlay from '../../../../components/LoadingOverlay';

const EditProduct = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { product } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  // Convert existing media to new format
  const initialMedia = product.media?.map(item => ({
    type: item.type || 'image',
    uri: item.url
  })) || [];

  const [mediaFiles, setMediaFiles] = useState(initialMedia);
  const [title, setTitle] = useState(product.title || '');
  const [author, setAuthor] = useState(product.publishing_house || '');
  const [price, setPrice] = useState(product.price ? product.price.toString() : '0');
  const [description, setDescription] = useState(product.description || '');
  const [quantity, setQuantity] = useState(product.stock_quantity ? product.stock_quantity.toString() : '0');
  const [category, setCategory] = useState(product.id_category || '');
  const [status, setStatus] = useState(product.status || '');
  const [categories, setCategories] = useState([]);

  // Status options
  const statusOptions = [
    { label: t('product.active'), value: 'active' },
    { label: t('product.outOfStock'), value: 'out of stock' },
    { label: t('product.importingGoods'), value: 'importing goods' },
    { label: t('product.stopSelling'), value: 'stop selling' },
  ];

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const result = await categoryService.getCategory();
      if (result.success) {
        const formattedCategories = result.data.map(cat => ({
          label: cat.name,
          value: cat._id
        }));
        setCategories(formattedCategories);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('editProduct.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets ? result.assets : [result];
        const newMediaFiles = selectedImages.map(image => ({
          type: 'image',
          uri: image.uri
        }));
        setMediaFiles(prev => [...prev, ...newMediaFiles]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert(t('common.error'), t('editProduct.errorSelectingImage'));
    }
  };

  const handleVideoPick = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('editProduct.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedVideos = result.assets ? result.assets : [result];
        const newMediaFiles = selectedVideos.map(video => ({
          type: 'video',
          uri: video.uri
        }));
        setMediaFiles(prev => [...prev, ...newMediaFiles]);
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert(t('common.error'), t('editProduct.errorSelectingVideo'));
    }
  };

  const uploadMedia = async (file) => {
    try {
      const formData = new FormData();
      const fileName = file.uri.split('/').pop();

      formData.append('media', {
        uri: file.uri,
        type: file.type === 'video' ? 'video/mp4' : 'image/jpeg',
        name: fileName
      });

      const response = await fetch(`${API_URL}/api/upload/media`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.mediaUrls[0];
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    // if (!title || !author || !price || !description || !category || !status || mediaFiles.length === 0) {
    //   Alert.alert(t('common.error'), t('editProduct.fillAllFields'));
    //   return;
    // }

    if (!title.trim()) {
      Alert.alert(t('common.error'), t('editProduct.titleRequired'));
      return;
    }
    if (!author.trim()) {
      Alert.alert(t('common.error'), t('editProduct.authorRequired'));
      return;
    }
    if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert(t('common.error'), t('editProduct.priceInvalid'));
      return;
    }
    if (!quantity.trim() || isNaN(quantity) || parseInt(quantity) < 0) {
      Alert.alert(t('common.error'), t('editProduct.quantityInvalid'));
      return;
    }
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('editProduct.descriptionRequired'));
      return;
    }
    if (!category) {
      Alert.alert(t('common.error'), t('editProduct.categoryRequired'));
      return;
    }
    if (!status) {
      Alert.alert(t('common.error'), t('editProduct.statusRequired'));
      return;
    }
    if (mediaFiles.length === 0) {
      Alert.alert(t('common.error'), t('editProduct.mediaRequired'));
      return;
    }

    Alert.alert(
      t('productManagement.editProduct.confirmTitle'),
      t('productManagement.editProduct.confirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              setIsLoading(true);

              const uploadedMedia = [];
              await Promise.all(mediaFiles.map(async (file) => {
                if (!file.uri.startsWith('http')) {
                  const uploadResult = await uploadMedia(file);
                  if (uploadResult) {
                    uploadedMedia.push({
                      type: file.type,
                      url: uploadResult.url
                    });
                  }
                } else {
                  uploadedMedia.push({
                    type: file.type,
                    url: file.uri
                  });
                }
              }));

              const updatedProduct = {
                title,
                publishing_house: author,
                price: parseFloat(price),
                description,
                stock_quantity: parseInt(quantity),
                id_category: category,
                status,
                media: uploadedMedia
              };

              const result = await productService.updateProduct(product._id, updatedProduct);

              if (result.status === 200) {
                Alert.alert(
                  t('common.success'),
                  t('productManagement.editProduct.success'),
                  [{
                    text: 'OK',
                    onPress: () => {
                      navigation.goBack();
                      navigation.getParent()?.setParams({ refresh: Date.now() });
                    }
                  }]
                );
              } else {
                Alert.alert(t('common.error'), t('productManagement.editProduct.error'));
              }
            } catch (error) {
              console.error("Error updating product:", error);
              Alert.alert(t('common.error'), t('productManagement.editProduct.error'));
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteMedia = (index) => {
    Alert.alert(
      "Xác nhận xóa", // Title
      "Bạn có chắc chắn muốn xóa ảnh này không?", // Message
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: () => {
            setMediaFiles(prev => prev.filter((_, i) => i !== index));
          },
          style: "destructive" // Màu đỏ cho nút xóa
        }
      ]
    );
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>{t('productManagement.editProduct.title')}</Text>

          {mediaFiles.map((media, index) => (
            <View key={index}>
              {media.type === 'image' ? (
                <ImageWithDelete
                  uri={media.uri}
                  onDelete={() => handleDeleteMedia(index)}
                />
              ) : (
                <View style={styles.videoContainer}>
                  <View style={styles.videoInfo}>
                    <Feather name="video" size={24} color="#666" />
                    <Text style={styles.videoText}>
                      {t('videoSelected')} #{index + 1}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteVideoBtn}
                    onPress={() => handleDeleteMedia(index)}
                  >
                    <Text style={styles.deleteButton}>{t('delete')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          <View style={styles.buttonGroup}>
            <Button title={t('chooseImage')} onPress={handleImagePick} />
            <View style={styles.buttonSpacing} />
            <Button title={t('chooseVideo')} onPress={handleVideoPick} />
          </View>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t('title')}
          />

          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder={t('author')}
          />

          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder={t('price')}
          />

          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder={t('description')}
            multiline
          />

          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder={t('quantity')}
          />

          <RNPickerSelect
            placeholder={{ label: t('selectCategory'), value: null }}
            items={categories}
            onValueChange={setCategory}
            value={category}
            style={{
              inputIOS: styles.inputIOS,
              inputAndroid: styles.inputAndroid
            }}
          />

          <RNPickerSelect
            placeholder={{ label: t('selectStatus'), value: null }}
            items={statusOptions}
            onValueChange={setStatus}
            value={status}
            style={{
              inputIOS: styles.inputIOS,
              inputAndroid: styles.inputAndroid
            }}
          />

          <Button title={t('save')} onPress={handleSubmit} />
        </View>
      </ScrollView>

      <LoadingOverlay
        visible={isLoading}
        message={t('productManagement.editProduct.uploading')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  inputIOS: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
  inputAndroid: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonGroup: {
    marginVertical: 20,
  },
  buttonSpacing: {
    height: 10,
  },
  videoContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  videoText: {
    fontSize: 16,
    color: '#666',
  },
  deleteVideoBtn: {
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default EditProduct;
