import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input';
import { productService } from '../../services/productService';
import LoadingOverlay from '../../components/LoadingOverlay';

const SearchResults = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Nhận searchQuery từ route params và set vào searchText
    useEffect(() => {
        if (route.params?.searchQuery) {
            setSearchText(route.params.searchQuery);
            performSearch(route.params.searchQuery); // Thực hiện tìm kiếm ngay khi nhận được query
        }
    }, [route.params?.searchQuery]);

    const handleClick = () => {
        navigation.goBack();
    };

    const performSearch = async (query) => {
        try {
            setLoading(true);
            const result = await productService.searchProducts({ key: query });
            if (result.success) {
                setSearchResults(result.data);
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            performSearch(searchText);
        }
    };

    const renderItem = ({ item }) => {
        const imageUrl = item.media && item.media.length > 0 ? item.media[0].url : null;

        return (
            <TouchableOpacity
                style={styles.productItem}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
                <Image
                    source={imageUrl ? { uri: imageUrl } : require('../../../assets/placeholder.png')}
                    style={styles.productImage}
                    defaultSource={require('../../../assets/placeholder.png')}
                />
                <View style={styles.productInfo}>
                    <Text style={[styles.productTitle, { color: theme.textColor }]} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.productAuthor}>{item.publishing_house}</Text>
                    <Text style={styles.productPrice}>
                        {item.price?.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        })}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={24} color={theme.textColor} />
                </TouchableOpacity>

                <TextInput
                    style={[styles.searchInput, { 
                        backgroundColor: theme.secondaryBackground,
                        color: theme.textColor
                    }]}
                    placeholder={t('search.placeholder')}
                    placeholderTextColor={theme.placeholderColor}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />

                <TouchableOpacity 
                    style={[styles.searchButton, { backgroundColor: '#2196F3' }]}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>{t('search.searchButton')}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={searchResults}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={() => (
                    <Text style={[styles.emptyText, { color: theme.textColor }]}>
                        {loading ? t('search.searching') : t('search.noResults')}
                    </Text>
                )}
            />

            <LoadingOverlay visible={loading} message={t('search.searching')} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 10 : 0,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    searchButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    listContent: {
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    productItem: {
        width: '48%',
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 10,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    productAuthor: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E53935',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    }
});

export default SearchResults;