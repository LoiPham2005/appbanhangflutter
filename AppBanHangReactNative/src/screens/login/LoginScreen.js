import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View, StyleSheet, Platform, Button, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import Input from "../../components/Input";
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/AuthService';
import LoadingOverlay from "../../components/LoadingOverlay";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        // Kiểm tra email
        if (!email.trim()) {
            tempErrors.email = t('errorEmptyEmail');
            isValid = false;
        } else if (!validateEmail(email)) {
            tempErrors.email = t('errorInvalidEmail');
            isValid = false;
        }

        // Kiểm tra mật khẩu
        if (!password) {
            tempErrors.password = t('errorEmptyPassword');
            isValid = false;
        } else if (password.length < 6) {
            tempErrors.password = t('errorPasswordLength');
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleLogin = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);
                const result = await authService.login(email, password);
                
                if (result.success) {
                    // Save complete user data to AsyncStorage
                    const userInfo = {
                        _id: result.data.user._id,
                        name: result.data.user.username,
                        username: result.data.user.username,
                        email: result.data.user.email,
                        avatar: result.data.user.avatar || null,
                        role: result.data.user.role,
                        sex: result.data.user.sex || '',
                        phone: result.data.user.phone || '',
                        birth_date: result.data.user.birth_date || new Date().toISOString()
                    };
                    
                    console.log('Saving complete user info:', userInfo); // Debug log
                    
                    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                    await AsyncStorage.setItem('userId', result.data.user._id);
                    await AsyncStorage.setItem('userRole', result.data.user.role);
                    
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Drawer' }],
                    });
                } else {
                    Alert.alert(t('common.error'), result.message || t('login.failed'));
                }
            } catch (error) {
                console.error('Login error:', error);
                Alert.alert(t('common.error'), t('login.error'));
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handlePress = () => {
        navigation.navigate('Register');
    }

    const handleForgotPassword = () => {
        navigation.navigate('EnterEmail');
    };

    return (
        <>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "padding"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.contentContainer}>
                        <Text style={[styles.titleStyle, { color: theme.textColor }]}>
                            {t('auth.login.title')}
                        </Text>

                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder={t('auth.login.email')}
                            error={errors.email}
                        />

                        <Input
                            value={password}
                            onChangeText={setPassword}
                            placeholder={t('auth.login.password')}
                            secureTextEntry={true}
                            error={errors.password}
                        />

                        <TouchableOpacity 
                            style={styles.touchForgot}
                            onPress={handleForgotPassword}
                        >
                            <Text style={styles.textForgot}>{t('auth.login.forgotPassword')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.touchLogin}
                            onPress={handleLogin}
                        >
                            <Text style={styles.textLogin}>{t('auth.login.loginButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.asks}>
                    <Text>{t('auth.login.noAccount')}</Text>
                    <TouchableOpacity onPress={handlePress}
                        style={{marginLeft: 5}}>
                        <Text style={styles.textRegister}>{t('auth.login.register')}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            
            <LoadingOverlay 
                visible={isLoading} 
                message={t('auth.login.loggingIn')} 
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        // paddingHorizontal: 20
        paddingBottom: 30
    },
    contentContainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 15 : 0,
    },
    titleStyle: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 50,
        lineHeight: 35
    },

    touchForgot: {
        marginTop: 30,
        marginEnd: 20,
        alignItems: "flex-end"
    },

    touchLogin: {
        width: 140,
        marginTop: 40,
        alignSelf: 'center',
        paddingHorizontal: 17,
        paddingVertical: 10,
        backgroundColor: '#2d201c',
        borderRadius: 20
    },

    textForgot: {
        fontSize: 14,
    },

    textLogin: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    },

    asks:{
        flexDirection: 'row', 
        justifyContent: 'center',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: '#fff',
    }
});

export default LoginScreen;