import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Input = ({ value, onChangeText, placeholder, secureTextEntry, style, error }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                style={[
                    styles.input, 
                    style,
                    error ? styles.inputError : null
                ]}
                placeholderTextColor="#666"
            />
            {secureTextEntry && (
                <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <Ionicons 
                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                        size={24} 
                        color="#666"
                    />
                </TouchableOpacity>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative',
        marginHorizontal: 20,
        marginTop: 15,
    },
    input: {
        height: 50,
        // borderWidth: 1,
        // borderColor: '#ddd',
        // borderRadius: 8,
        borderBottomWidth: 1,  // Chỉ có border bottom
        borderBottomColor: 'grey',
        paddingHorizontal: 15,
        fontSize: 16,
        paddingRight: 50,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        height: '100%',
        justifyContent: 'center',
    },
    inputError: {
        borderBottomColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    }
});

export default Input; 