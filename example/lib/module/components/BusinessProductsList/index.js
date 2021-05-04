import React from 'react';
import { ProductsList, useLanguage } from 'ordering-components/native';
import { SingleProductCard } from '../SingleProductCard';
import { NotFoundSource } from '../NotFoundSource';
import { OText } from '../shared';
import { ProductsContainer, ErrorMessage, WrapperNotFound } from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { View } from 'react-native';

const BusinessProductsListUI = props => {
  var _categoryState$produc, _categoryState$produc2, _categoryState$produc3, _categoryState$pagina;

  const {
    errors,
    businessId,
    category,
    categories,
    categoryState,
    onProductClick,
    featured,
    searchValue,
    isBusinessLoading,
    handleSearchRedirect,
    handleClearSearch,
    errorQuantityProducts
  } = props;
  const [, t] = useLanguage();
  return /*#__PURE__*/React.createElement(ProductsContainer, null, category.id && ((_categoryState$produc = categoryState.products) === null || _categoryState$produc === void 0 ? void 0 : _categoryState$produc.map(product => /*#__PURE__*/React.createElement(SingleProductCard, {
    key: product.id,
    isSoldOut: product.inventoried && !product.quantity,
    product: product,
    businessId: businessId,
    onProductClick: () => onProductClick(product)
  }))), !category.id && featured && (categoryState === null || categoryState === void 0 ? void 0 : (_categoryState$produc2 = categoryState.products) === null || _categoryState$produc2 === void 0 ? void 0 : _categoryState$produc2.find(product => product.featured)) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold",
    mBottom: 10
  }, t('FEATURED', 'Featured')), /*#__PURE__*/React.createElement(React.Fragment, null, (_categoryState$produc3 = categoryState.products) === null || _categoryState$produc3 === void 0 ? void 0 : _categoryState$produc3.map(product => product.featured && /*#__PURE__*/React.createElement(SingleProductCard, {
    key: product.id,
    isSoldOut: product.inventoried && !product.quantity,
    product: product,
    businessId: businessId,
    onProductClick: onProductClick
  })))), !category.id && categories && categories.filter(category => category.id !== null).map((category, i, _categories) => {
    var _categoryState$produc4;

    const products = ((_categoryState$produc4 = categoryState.products) === null || _categoryState$produc4 === void 0 ? void 0 : _categoryState$produc4.filter(product => product.category_id === category.id)) || [];
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: category.id
    }, products.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
      size: 18,
      weight: "bold",
      mBottom: 10
    }, category.name), /*#__PURE__*/React.createElement(React.Fragment, null, products.map(product => /*#__PURE__*/React.createElement(SingleProductCard, {
      key: product.id,
      isSoldOut: product.inventoried && !product.quantity,
      businessId: businessId,
      product: product,
      onProductClick: onProductClick
    })))));
  }), (categoryState.loading || isBusinessLoading) && /*#__PURE__*/React.createElement(React.Fragment, null, [...Array(categoryState === null || categoryState === void 0 ? void 0 : (_categoryState$pagina = categoryState.pagination) === null || _categoryState$pagina === void 0 ? void 0 : _categoryState$pagina.nextPageItems).keys()].map((item, i) => /*#__PURE__*/React.createElement(Placeholder, {
    key: i,
    style: {
      padding: 5
    },
    Animation: Fade
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 24,
    height: 70,
    style: {
      marginRight: 10,
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement(Placeholder, {
    style: {
      paddingVertical: 10
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 60,
    style: {
      marginBottom: 25
    }
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 20
  })))))), !categoryState.loading && !isBusinessLoading && categoryState.products.length === 0 && !errors && !(searchValue && errorQuantityProducts || !searchValue && !errorQuantityProducts) && /*#__PURE__*/React.createElement(WrapperNotFound, null, /*#__PURE__*/React.createElement(NotFoundSource, {
    content: !searchValue ? t('ERROR_NOT_FOUND_PRODUCTS_TIME', 'No products found at this time') : t('ERROR_NOT_FOUND_PRODUCTS', 'No products found, please change filters.'),
    btnTitle: !searchValue ? t('SEARCH_REDIRECT', 'Go to Businesses') : t('CLEAR_FILTERS', 'Clear filters'),
    onClickButton: () => !searchValue ? handleSearchRedirect && handleSearchRedirect() : handleClearSearch && handleClearSearch('')
  })), errors && errors.length > 0 && errors.map((e, i) => /*#__PURE__*/React.createElement(ErrorMessage, {
    key: i
  }, /*#__PURE__*/React.createElement(OText, {
    space: true
  }, "ERROR:"), /*#__PURE__*/React.createElement(OText, null, e))));
};

export const BusinessProductsList = props => {
  const businessProductsListProps = { ...props,
    UIComponent: BusinessProductsListUI
  };
  return /*#__PURE__*/React.createElement(ProductsList, businessProductsListProps);
};
//# sourceMappingURL=index.js.map