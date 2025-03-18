import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

const AboutUsScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.section}>
        <Text style={[styles.title, { color: theme.textColor }]}>{t('aboutUs.title')}</Text>
        <Text style={[styles.description, { color: theme.textColor }]}>{t('aboutUs.description')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('aboutUs.content.mission')}</Text>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('aboutUs.content.vision')}</Text>
        <Text style={[styles.sectionText, { color: theme.textColor }]}>{t('aboutUs.content.story')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.featureTitle, { color: theme.textColor }]}>Features:</Text>
        <Text style={[styles.feature, { color: theme.textColor }]}>• {t('aboutUs.features.variety')}</Text>
        <Text style={[styles.feature, { color: theme.textColor }]}>• {t('aboutUs.features.service')}</Text>
        <Text style={[styles.feature, { color: theme.textColor }]}>• {t('aboutUs.features.delivery')}</Text>
        <Text style={[styles.feature, { color: theme.textColor }]}>• {t('aboutUs.features.payment')}</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default AboutUsScreen;