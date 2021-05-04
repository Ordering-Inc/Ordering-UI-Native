import React from 'react';
import { ProductOption as ProductOptionController, useLanguage } from 'ordering-components/native';
import { Container, WrapHeader } from './styles';
import { OText } from '../shared';
import { colors } from '../../theme';

const ProductOptionUI = props => {
  const {
    children,
    option,
    error
  } = props;
  const [, t] = useLanguage();
  let maxMin = `(${t('MIN', 'Min')}: ${option.min} / ${t('MAX', 'Max')}: ${option.max})`;

  if (option.min === 1 && option.max === 1) {
    maxMin = t('REQUIRED', 'Required');
  } else if (option.min === 0 && option.max > 0) {
    maxMin = `(${t('MAX', 'Max')}: ${option.max})`;
  } else if (option.min > 0 && option.max === 0) {
    maxMin = `(${t('MIN', 'Min')}: ${option.min})`;
  }

  return /*#__PURE__*/React.createElement(Container, {
    style: {
      color: error ? 'orange' : colors.white
    }
  }, /*#__PURE__*/React.createElement(WrapHeader, null, /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, option.name), /*#__PURE__*/React.createElement(OText, {
    color: "#A52121"
  }, maxMin)), children);
};

export const ProductOption = props => {
  const productOptionProps = { ...props,
    UIComponent: ProductOptionUI
  };
  return /*#__PURE__*/React.createElement(ProductOptionController, productOptionProps);
};
//# sourceMappingURL=index.js.map