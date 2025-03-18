import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { Feather } from '@expo/vector-icons';

const SupportScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.textColor }]}>{t('support.title')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>{t('support.contact.title')}</Text>
        <Text style={[styles.text, { color: theme.textColor }]}>{t('support.contact.email')}</Text>
        <Text style={[styles.text, { color: theme.textColor }]}>{t('support.contact.phone')}</Text>
        <Text style={[styles.text, { color: theme.textColor }]}>{t('support.contact.hours')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>{t('support.faq.title')}</Text>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={[styles.faqText, { color: theme.textColor }]}>{t('support.faq.shipping')}</Text>
          <Feather name="chevron-right" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={[styles.faqText, { color: theme.textColor }]}>{t('support.faq.returns')}</Text>
          <Feather name="chevron-right" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.faqItem}>
          <Text style={[styles.faqText, { color: theme.textColor }]}>{t('support.faq.payment')}</Text>
          <Feather name="chevron-right" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.helpSection}>
        <Text style={[styles.helpTitle, { color: theme.textColor }]}>{t('support.help.title')}</Text>
        <Text style={[styles.helpText, { color: theme.textColor }]}>{t('support.help.description')}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  faqText: {
    fontSize: 16,
  },
  helpSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  helpText: {
    fontSize: 16,
  },
});

export default SupportScreen;