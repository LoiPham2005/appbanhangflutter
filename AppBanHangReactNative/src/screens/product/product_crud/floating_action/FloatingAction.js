import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const {t, i18n} = useTranslation();
  const {theme, isDarkMode} = useTheme();
  const navigation = useNavigation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    Animated.timing(animation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      {/* Overlay để làm tối màn hình */}
      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      <View style={styles.container}>
        {/* Menu Items */}
        <Animated.View
          style={[
            styles.menuContainer,
            {
              opacity: animation,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate("AddProduct");
              toggleMenu();
            }}
          >
            <Text style={styles.menuText}>{t('productManagement.addProduct.title')}</Text>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>A</Text>
            </View>
          </TouchableOpacity>

          {/* Thêm các menu item khác tương tự */}
        </Animated.View>
        

        {/* FAB Button */}
        <TouchableOpacity
          style={[styles.fab, isOpen && styles.fabOpen]}
          onPress={toggleMenu}
        >
          <Icon name={isOpen ? "close" : "add"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  },
  container: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 2
  },
  menuContainer: {
    position: 'absolute',
    bottom: 70,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 250,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6200EE",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabOpen: {
    backgroundColor: "#7E57C2",
  },
  // ... các styles khác giữ nguyên
  menuText: {
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 5,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200EE",
  },
});

export default FloatingActionButton;
