import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
    Text, 
    View, 
    StyleSheet, 
    Platform, 
    TouchableOpacity, 
    Alert,
    KeyboardAvoidingView,
    ScrollView 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '../../context/ThemeContext'; // Thêm useTheme
import Input from "../../components/Input";
import { authService } from '../../services/AuthService';
import LoadingOverlay from "../../components/LoadingOverlay";

const RegisterScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const { theme } = useTheme(); // Thêm theme
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        // Kiểm tra tên
        if (!name.trim()) {
            tempErrors.name = t('errorEmptyName');
            isValid = false;
        }

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

        // Kiểm tra xác nhận mật khẩu
        if (!confirmPassword) {
            tempErrors.confirmPassword = t('errorEmptyConfirmPassword');
            isValid = false;
        } else if (confirmPassword !== password) {
            tempErrors.confirmPassword = t('errorPasswordMatch');
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            try {
                setIsLoading(true);
                const userData = {
                    username: name,
                    email,
                    password
                };

                const result = await authService.register(userData);

                if (result.success) {
                    Alert.alert(
                        t('common.success'),
                        t('register.success'),
                        [
                            {
                                text: 'OK',
                                onPress: () => navigation.navigate('Login')
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        t('common.error'),
                        result.message || t('register.failed')
                    );
                }
            } catch (error) {
                console.error('Registration error:', error);
                Alert.alert(
                    t('common.error'),
                    t('register.error')
                );
            } finally {
                setIsLoading(false);
            }
        }
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
                            {t('auth.register.title')}
                        </Text>

                        <Input
                            value={name}
                            onChangeText={setName}
                            placeholder={t('auth.register.name')}
                            error={errors.name}
                        />

                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder={t('auth.register.email')}
                            error={errors.email}
                        />

                        <Input
                            value={password}
                            onChangeText={setPassword}
                            placeholder={t('auth.register.password')}
                            secureTextEntry={true}
                            error={errors.password}
                        />

                        <Input
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder={t('auth.register.confirmPassword')}
                            secureTextEntry={true}
                            error={errors.confirmPassword}
                        />

                        <TouchableOpacity 
                            style={styles.touchLogin}
                            onPress={handleRegister}
                        >
                            <Text style={styles.textLogin}>{t('auth.register.registerButton')}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.asks}>
                    <Text style={{ color: theme.textColor }}>{t('auth.register.haveAccount')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.textRegister}> {t('auth.register.login')}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            
            <LoadingOverlay 
                visible={isLoading} 
                message={t('auth.register.registering')} 
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
    touchLogin: {
        width: 140,
        marginTop: 40,
        alignSelf: 'center',
        paddingHorizontal: 17,
        paddingVertical: 10,
        backgroundColor: '#2d201c',
        borderRadius: 20
    },
    textLogin: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    },
    asks: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: '#fff',
    },
    textRegister: {
        color: '#2d201c'
    },

});

export default RegisterScreen;