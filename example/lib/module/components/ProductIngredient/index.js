import React from 'react';
import { ProductIngredient as ProductIngredientController } from 'ordering-components/native';
import { Container } from './styles';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';
import { OText } from '../shared';
import { colors } from '../../theme';

const ProductIngredientUI = props => {
  const {
    state,
    ingredient,
    toggleSelect
  } = props;
  return /*#__PURE__*/React.createElement(Container, {
    onPress: () => toggleSelect()
  }, /*#__PURE__*/React.createElement(View, null, state !== null && state !== void 0 && state.selected ? /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "checkbox-marked",
    color: colors.primary,
    size: 24
  }) : /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "checkbox-blank-outline",
    color: colors.backgroundDark,
    size: 24
  })), /*#__PURE__*/React.createElement(OText, {
    mLeft: 10
  }, ingredient.name));
};

export const ProductIngredient = props => {
  const productIngredientProps = { ...props,
    UIComponent: ProductIngredientUI
  };
  return /*#__PURE__*/React.createElement(ProductIngredientController, productIngredientProps);
};
//# sourceMappingURL=index.js.map