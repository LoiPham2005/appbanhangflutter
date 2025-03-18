import React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TabInventory from './inventory/TabInventory';
import TabProducts from './product_crud/TabProducts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

const renderScene = SceneMap({
  first: TabProducts,
  center: TabInventory,
});

const ProductScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const { t } = useTranslation();
  const { theme, isDarkMode } = useTheme();

  const routes = [
    { key: 'first', title: t('productManagement.products') },
    { key: 'center', title: t('productManagement.inventory') }
  ];

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      style={{
        backgroundColor: theme.backgroundColor,
      }}
      indicatorStyle={{
        backgroundColor: 'red',
      }}
      activeColor={theme.textColor}
      inactiveColor={isDarkMode ? '#888' : '#aaa'}
      labelStyle={{
        fontSize: 14,
        fontWeight: '600',
      }}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default ProductScreen;
