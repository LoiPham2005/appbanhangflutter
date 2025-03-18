import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Image, Alert, ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { reviewService } from '../../services/ReviewService';
import { API_URL } from '../../services/URL_API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { orderService } from '../../services/OrderService'; // Thêm dòng này

export default function ReviewOrder({ route, navigation }) {
    const { orderId, items, onReviewComplete } = route.params;
    const { t } = useTranslation();
    const { theme } = useTheme();

    // Cải thiện việc khởi tạo state reviews
    const [reviews, setReviews] = useState(() => {
        console.log('ReviewOrder - Received items:', JSON.stringify(items, null, 2));

        // Kiểm tra và lọc các sản phẩm hợp lệ trước khi tạo state
        if (!items || !Array.isArray(items) || items.length === 0) {
            console.log('No items provided to ReviewOrder');
            return [];
        }

        // Thay đổi giá trị rating ban đầu từ 5 thành 0
        return items.map(item => {
            const productId = item.id_product._id || (typeof item.id_product === 'string' ? item.id_product : null);

            if (!productId) {
                console.log('Invalid product ID:', item.id_product);
                return null;
            }

            return {
                id_product: productId,
                rating: 0, // Thay đổi từ 5 thành 0
                comment: '',
                images: []
            };
        }).filter(Boolean);
    });

    // Thêm state để theo dõi sản phẩm hợp lệ
    const [validProducts, setValidProducts] = useState([]);

    // Add error state
    const [error, setError] = useState(null);

    // Cải thiện useEffect để kiểm tra sản phẩm
    useEffect(() => {
        console.log('ReviewOrder - useEffect - items:', items?.length);
        console.log('ReviewOrder - useEffect - reviews:', reviews.length);

        if (!items || !Array.isArray(items) || items.length === 0) {
            setError(t('review.error.noItems'));
            return;
        }

        if (reviews.length === 0) {
            setError(t('review.error.noItems'));
            return;
        }

        // Lọc và lưu trữ các sản phẩm hợp lệ
        const validItems = items.filter(item =>
            item &&
            item.id_product &&
            (item.id_product._id || typeof item.id_product === 'string')
        );

        console.log('Valid items count:', validItems.length);
        setValidProducts(validItems);

        if (validItems.length === 0) {
            setError(t('review.error.noItems'));
        } else if (validItems.length < items.length) {
            console.log('Some products are invalid');
            setError(t('review.error.unavailableProducts'));
        } else {
            // Xóa lỗi nếu mọi thứ đều hợp lệ
            setError(null);
        }
    }, [items, reviews, t]);

    const [loading, setLoading] = useState(false);

    const handleImagePick = async (index) => {
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
                setReviews(prevReviews => {
                    const newReviews = [...prevReviews];
                    newReviews[index] = {
                        ...newReviews[index],
                        images: [...newReviews[index].images, ...selectedImages]
                    };
                    return newReviews;
                });
            }
        } catch (error) {
            console.error('Error picking images:', error);
            Alert.alert(t('common.error'), t('review.imageError'));
        }
    };

    // Thêm hàm uploadImage để xử lý việc tải ảnh lên
    const uploadImage = async (uri) => {
        try {
            const formData = new FormData();
            formData.append('media', {
                uri: uri,
                type: 'image/jpeg',
                name: `review_image_${Date.now()}.jpg`
            });

            const response = await fetch(`${API_URL}/api/upload/media`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            if (result.status === 200 && result.mediaUrls && result.mediaUrls.length > 0) {
                return result.mediaUrls[0].url;
            } else {
                console.error('Upload failed:', result);
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const submitReviews = async () => {
        try {
            // Kiểm tra các reviews
            const hasZeroRating = reviews.some(review => review.rating === 0);
            if (hasZeroRating) {
                Alert.alert(t('common.error'), t('review.error.noRating'));
                return;
            }

            const emptyComments = reviews.some(review => !review.comment.trim());
            if (emptyComments) {
                Alert.alert(t('common.error'), t('review.commentRequired'));
                return;
            }

            setLoading(true);
            const userId = await AsyncStorage.getItem('userId');

            // Xử lý từng review riêng biệt
            for (const review of reviews) {
                try {
                    // Upload ảnh cho review hiện tại
                    let uploadedImageUrls = [];
                    if (review.images && review.images.length > 0) {
                        const uploadPromises = review.images.map(async (image) => {
                            try {
                                const formData = new FormData();
                                formData.append('media', {
                                    uri: image.uri,
                                    type: 'image/jpeg',
                                    name: `review_image_${Date.now()}.jpg`
                                });

                                const response = await fetch(`${API_URL}/api/upload/media`, {
                                    method: 'POST',
                                    body: formData,
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                    },
                                });

                                const result = await response.json();
                                if (result.status === 200 && result.mediaUrls && result.mediaUrls.length > 0) {
                                    return result.mediaUrls[0].url;
                                }
                                throw new Error('Image upload failed');
                            } catch (error) {
                                console.error('Error uploading image:', error);
                                return null;
                            }
                        });

                        uploadedImageUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);
                    }

                    // Gửi review cho sản phẩm hiện tại
                    const reviewData = {
                        id_user: userId,
                        id_order: orderId,
                        id_product: review.id_product,
                        rating: review.rating,
                        comment: review.comment,
                        images: uploadedImageUrls
                    };

                    const response = await reviewService.addReview(reviewData);
                    if (response.status !== 200) {
                        throw new Error(response.message || 'Failed to submit review');
                    }
                } catch (error) {
                    console.error('Error processing review:', error);
                    throw error;
                }
            }

            // Cập nhật trạng thái đơn hàng sau khi tất cả reviews đã được gửi thành công
            await orderService.updateOrderStatus(orderId, { status: 'reviewed' });

            if (onReviewComplete) {
                await onReviewComplete();
            }

            Alert.alert(t('common.success'), t('review.success'), [{
                text: 'OK',
                onPress: () => navigation.goBack()
            }]);

        } catch (error) {
            console.error('Error submitting reviews:', error);
            Alert.alert(t('common.error'), t('review.error.generalError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textColor }]}>
                    {t('review.title')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.textColor }]}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>
                            {t('common.back')}
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <ScrollView style={styles.content}>
                        {items.map((item, index) => (
                            item.id_product && ( // Add condition to check if product exists
                                <View key={index} style={styles.reviewItem}>
                                    <View style={styles.productInfo}>
                                        <Image
                                            source={{
                                                uri: item.id_product.media?.[0]?.url || 'default_image_url'
                                            }}
                                            style={styles.productImage}
                                            defaultSource={require('../../../assets/placeholder.png')}
                                        />
                                        <Text style={[styles.productName, { color: theme.textColor }]}>
                                            {item.id_product.title || 'Product Name Not Available'}
                                        </Text>
                                    </View>

                                    <View style={styles.ratingContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity
                                                key={star}
                                                onPress={() => {
                                                    setReviews(prev => {
                                                        const newReviews = [...prev];
                                                        newReviews[index].rating = star;
                                                        return newReviews;
                                                    });
                                                }}
                                            >
                                                <Feather
                                                    name="star"
                                                    size={30}
                                                    color={reviews[index].rating >= star ? "#FFD700" : "#ddd"}
                                                    style={[
                                                        styles.starIcon,
                                                        reviews[index].rating >= star && styles.selectedStar
                                                    ]}
                                                />
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <TextInput
                                        style={[styles.commentInput, {
                                            color: theme.textColor,
                                            borderColor: theme.isDark ? '#444' : '#ddd',
                                            backgroundColor: theme.isDark ? '#2d2d2d' : '#fff'
                                        }]}
                                        placeholder={t('review.commentPlaceholder')}
                                        placeholderTextColor={theme.textSecondary}
                                        value={reviews[index].comment}
                                        onChangeText={(text) => {
                                            setReviews(prev => {
                                                const newReviews = [...prev];
                                                newReviews[index].comment = text;
                                                return newReviews;
                                            });
                                        }}
                                        multiline
                                        textAlignVertical="top"
                                    />

                                    <TouchableOpacity
                                        style={[styles.addImageButton, {
                                            borderColor: theme.isDark ? '#444' : '#ddd'
                                        }]}
                                        onPress={() => handleImagePick(index)}
                                    >
                                        <Feather name="camera" size={24} color={theme.textColor} />
                                        <Text style={[styles.buttonText, { color: theme.textColor }]}>
                                            {t('review.addImages')}
                                        </Text>
                                    </TouchableOpacity>

                                    <ScrollView
                                        horizontal
                                        style={styles.imagePreviewContainer}
                                        showsHorizontalScrollIndicator={false}
                                    >
                                        {reviews[index].images.map((image, imgIndex) => (
                                            <View key={imgIndex} style={styles.imagePreview}>
                                                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                                                <TouchableOpacity
                                                    style={styles.removeImage}
                                                    onPress={() => {
                                                        setReviews(prev => {
                                                            const newReviews = [...prev];
                                                            newReviews[index].images = newReviews[index].images.filter(
                                                                (_, i) => i !== imgIndex
                                                            );
                                                            return newReviews;
                                                        });
                                                    }}
                                                >
                                                    <Feather name="x" size={20} color="white" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            )
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
                        onPress={submitReviews}
                        disabled={loading || error}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {t('review.submit')}
                            </Text>
                        )}
                    </TouchableOpacity>
                </>
            )}
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
    reviewItem: {
        marginBottom: 24,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    productName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        alignItems: 'center',  // Căn chỉnh các ngôi sao theo chiều dọc
    },
    commentInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        minHeight: 100,
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
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    starIcon: {
        marginHorizontal: 4,
        backgroundColor: 'transparent',  // Đảm bảo nền trong suốt
        margin: 2,  // Thêm khoảng cách giữa các ngôi sao
    },
    selectedStar: {
        transform: [{ scale: 1.2 }],  // Tăng kích thước ngôi sao đã chọn
    }
});