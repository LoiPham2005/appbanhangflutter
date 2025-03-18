// src/screens/settings/theme/ThemeSettings.js
import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Nếu dùng Expo, nếu không thì thay thế bằng Icon phù hợp

const ThemeSettings = () => {
    const { t } = useTranslation();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {/* Nút Back */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={theme.textColor} />
            </TouchableOpacity>

            <View style={[styles.card, { backgroundColor: theme.backgroundColor }]}>
                <View style={styles.settingItem}>
                    <Text style={[styles.text, { color: theme.textColor }]}>
                        {t('settings.darkMode.title')}
                    </Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleTheme}
                        value={isDarkMode}
                    />
                </View>
                <Text style={[styles.description, { color: theme.textColor }]}>
                    {isDarkMode ? t('settings.darkMode.dark') : t('settings.darkMode.light')}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        zIndex: 10,
        marginTop: 10
    },
    card: {
        marginTop: 50, // Dời xuống để không bị che bởi nút back
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        marginTop: 8,
        opacity: 0.7,
    }
});

export default ThemeSettings;
