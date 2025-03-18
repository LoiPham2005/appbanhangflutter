import React, { Fragment, Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import imageWorldBook from '../../../assets/world_book.png'
import imageCart from '../../../assets/cart_book.png'
import imagePeopleRead from '../../../assets/people_read.png'

export default function Introduce() {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const handleSkip = () => {
        navigation.navigate('Login');
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkip}
            >
                <Text style={styles.skipText}>{t('introduce.skip')}</Text>
            </TouchableOpacity>

            <Swiper style={styles.wrapper} showsButtons>
                <View style={styles.slide1}>
                    <Text style={styles.text}>{t('introduce.slide1.title')}</Text>
                    <Text style={styles.text1}>{t('introduce.slide1.subtitle')}</Text>
                    <Image
                        source={imageWorldBook}
                        style={styles.image} />
                </View>
                <View style={styles.slide2}>
                    <Text style={styles.text}>{t('introduce.slide2.title')}</Text>
                    <Text style={styles.text1}>{t('introduce.slide2.subtitle')}</Text>
                    <Image
                        source={imagePeopleRead}
                        style={styles.image} />
                </View>
                <View style={styles.slide3}>
                    <Text style={styles.text}>{t('introduce.slide3.title')}</Text>
                    <Text style={styles.text1}>{t('introduce.slide3.subtitle')}</Text>
                    <Image
                        source={imageCart}
                        style={styles.image} />
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginButtonText}>{t('introduce.getStarted')}</Text>
                    </TouchableOpacity>
                </View>
            </Swiper>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {},
    skipButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    skipText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginTop: 20,
        position: 'absolute',
        bottom: 70,
    },
    loginButtonText: {
        color: '#92BBD9',
        fontSize: 18,
        fontWeight: '600',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    text1: {
        color: '#fff',
        fontSize: 15,
        marginTop: 20,
        // fontWeight: 'bold'
        textAlign: 'center'
    },
    image: {
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
        width: 400, // Chiều rộng của ảnh (200 pixel)
        height: 400, // Chiều cao của ảnh (200 pixel)
        resizeMode: 'contain', // Giữ nguyên tỷ lệ hình ảnh
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
    paginationStyle: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    paginationText: {
        color: 'white',
        fontSize: 20
    }
});