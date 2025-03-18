import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import imageWelcome from '../../../assets/welcome.png';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const WelcomeScreen = ({ navigation }) => {
    const { t } = useTranslation();

    const handleStartPress = () => {
        navigation.navigate('Introduce');
    };

    return (
        <ImageBackground source={imageWelcome} style={styles.container}>
            <Text style={styles.titleStyle}>
                {t('welcome.title')}
            </Text>
            <Text style={styles.contentStyle}>
                {t('welcome.subtitle')}
            </Text>

            <TouchableOpacity
                style={styles.buttonStyle}
                onPress={handleStartPress}
            >
                <Text style={styles.textButton}>
                    {t('welcome.startButton')}
                </Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 70
    },

    titleStyle: {
        fontSize: 25,
        color: 'white'
    },

    contentStyle: {
        fontSize: 16,
        color: 'white',
        marginTop: 20
    },

    buttonStyle: {
        position: 'absolute',
        bottom: 60,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },

    textButton: {
        color: 'white'
    }
});

export default WelcomeScreen;