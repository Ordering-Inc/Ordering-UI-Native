import React from 'react';
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';
import { Tab } from './styles';
import { OText } from '../shared';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const BusinessProductsCategoriesUI = props => {
  const {
    featured,
    categories,
    handlerClickCategory,
    categorySelected,
    loading
  } = props;
  return /*#__PURE__*/React.createElement(ScrollView, {
    horizontal: true,
    style: { ...styles.container,
      borderBottomWidth: loading ? 0 : 1
    }
  }, loading && /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, [...Array(4)].map((item, i) => /*#__PURE__*/React.createElement(PlaceholderLine, {
    key: i,
    width: 10,
    style: {
      marginRight: 5
    }
  })))), !loading && categories && categories.length && categories.map(category => /*#__PURE__*/React.createElement(Tab, {
    key: category.name,
    onPress: () => handlerClickCategory(category),
    style: category.id === 'featured' && !featured && styles.featuredStyle
  }, /*#__PURE__*/React.createElement(OText, {
    color: (categorySelected === null || categorySelected === void 0 ? void 0 : categorySelected.id) === category.id ? colors.primary : ''
  }, category.name))));
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomColor: colors.lightGray
  },
  featuredStyle: {
    display: 'none'
  }
});
export const BusinessProductsCategories = props => {
  const businessProductsCategoriesProps = { ...props,
    UIComponent: BusinessProductsCategoriesUI
  };
  return /*#__PURE__*/React.createElement(ProductsCategories, businessProductsCategoriesProps);
};
//# sourceMappingURL=index.js.map