import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

const ImageWithDelete = ({ uri, onDelete, style }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.image, style]} />
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Feather name="x" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  deleteButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ImageWithDelete;