import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  TextInput,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { searchHistoryService } from '../../services/SearchHistoryService'; // Add this import

const SearchScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchText, setSearchText] = React.useState('');
  const [searchHistory, setSearchHistory] = React.useState([]);

  const handleSearch = async () => {
    if (searchText.trim()) {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                // Save search history
                await searchHistoryService.addSearchHistory(userId, searchText.trim());
            }
            navigation.navigate('SearchResults', { searchQuery: searchText });
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }
  };

  // Load search history
  const loadSearchHistory = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
            const response = await searchHistoryService.getUserSearchHistory(userId);
            if (response.success) {
                setSearchHistory(response.data);
            }
        }
    } catch (error) {
        console.error('Error loading search history:', error);
    }
  };

  React.useEffect(() => {
    loadSearchHistory();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
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
  }
});

export default SearchScreen;