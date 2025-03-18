import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import { orderService } from '../../services/OrderService';
import { API_URL } from '../../services/URL_API';

export default function ReasonReturn({ route, navigation }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { orderId, onReturnComplete } = route.params;
  
  const [returnReason, setReturnReason] = useState('');
  const [returnImages, setReturnImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('common.permissionDenied'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets ? result.assets : [result];
        setReturnImages([...returnImages, ...selectedImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert(t('common.error'), t('common.imagePickError'));
    }
  };

  const handleSubmit = async () => {
    if (!returnReason.trim()) {
        Alert.alert(t('order.return.reasonRequired'));
        return;
    }

    try {
        setIsLoading(true);

        // Upload images first
        const uploadedImages = await Promise.all(
            returnImages.map(async (image) => {
                const formData = new FormData();
                formData.append('media', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: `return_image_${Date.now()}.jpg`
                });

                const response = await fetch(`${API_URL}/api/upload/media`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const result = await response.json();
                // Lấy URL ảnh từ response
                return result.mediaUrls[0].url; 
            })
        );

        // Cập nhật order status và returnRequest data
        const response = await orderService.updateOrderStatus(orderId, {
            status: 'return_requested',
            returnData: {
                reason: returnReason,
                images: uploadedImages, // Mảng các URL ảnh đã upload
                requestDate: new Date().toISOString(),
                status: 'pending'
            }
        });

        if (response.status === 200) {
            Alert.alert(t('order.return.success'), '', [
                {
                    text: 'OK',
                    onPress: () => {
                        onReturnComplete?.();
                        navigation.goBack();
                    }
                }
            ]);
        } else {
            Alert.alert(t('order.return.error'));
        }
    } catch (error) {
        console.error('Error submitting return request:', error);
        Alert.alert(t('order.return.error'));
    } finally {
        setIsLoading(false);
    }
};

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          {t('order.return.title')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={[styles.reasonInput, {
            color: theme.textColor,
            borderColor: theme.isDark ? '#444' : '#ddd',
            backgroundColor: theme.isDark ? '#2d2d2d' : '#fff'
          }]}
          placeholder={t('order.return.reasonPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          value={returnReason}
          onChangeText={setReturnReason}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.addImageButton, {
            borderColor: theme.isDark ? '#444' : '#ddd'
          }]}
          onPress={handlePickImages}
        >
          <Feather name="camera" size={24} color={theme.textColor} />
          <Text style={[styles.buttonText, { color: theme.textColor }]}>
            {t('order.return.addImages')}
          </Text>
        </TouchableOpacity>

        <ScrollView 
          horizontal 
          style={styles.imagePreviewContainer}
          showsHorizontalScrollIndicator={false}
        >
          {returnImages.map((image, index) => (
            <View key={index} style={styles.imagePreview}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setReturnImages(prev => prev.filter((_, i) => i !== index))}
              >
                <Feather name="x" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitButton, { opacity: isLoading ? 0.7 : 1 }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {t('order.return.submit')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
    marginBottom: 16,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});