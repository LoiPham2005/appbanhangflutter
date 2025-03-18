import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../services/URL_API'; // Add this import

const AccountScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_URL}/api/users/list`, { // Modify the fetch call
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        const userAccounts = data.filter(user => user.role === 'user');
        setUsers(userAccounts);
        setFilteredUsers(userAccounts);
      } else {
        console.error('Invalid data format:', data);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => 
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const renderUserItem = ({ item }) => (
    <View style={[styles.userCard, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={[styles.username, { color: theme.textColor }]}>
            {item.username}
          </Text>
          <Text style={[styles.userRole, { color: theme.textColor }]}>
            {item.role}
          </Text>
        </View>
        <Text style={[styles.email, { color: theme.textColor }]}>
          {item.email}
        </Text>
        <Text style={[styles.phone, { color: theme.textColor }]}>
          {item.phone || t('account.noPhone')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={theme.textColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.textColor }]}
          placeholder={t('account.search')}
          placeholderTextColor={theme.textColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <Text style={[styles.emptyText, { color: theme.textColor }]}>
              {t('common.noResults')}
            </Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default AccountScreen;