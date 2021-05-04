import React, { useState } from 'react';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { BusinessAndProductList, useLanguage, useOrder, useSession, useUtils } from 'ordering-components/native';
import { OModal, OText } from '../shared';
import { BusinessBasicInformation } from '../BusinessBasicInformation';
import { SearchBar } from '../SearchBar';
import { BusinessProductsCategories } from '../BusinessProductsCategories';
import { BusinessProductsList } from '../BusinessProductsList';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { WrapHeader, TopHeader, AddressInput, WrapSearchBar, WrapContent, BusinessProductsListingContainer } from './styles';
import { colors } from '../../theme';
import { FloatingButton } from '../FloatingButton';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';

const BusinessProductsListingUI = props => {
  var _Object$values$find, _currentCart$products, _orderState$options2, _orderState$options2$, _businessState$busine, _business$categories, _currentCart$products2, _currentCart$products3, _currentCart$products4, _currentCart$products5;

  const {
    navigation,
    errors,
    businessState,
    categoryState,
    handleChangeSearch,
    categorySelected,
    searchValue,
    handleChangeCategory,
    handleSearchRedirect,
    featuredProducts,
    errorQuantityProducts
  } = props;
  const [, t] = useLanguage();
  const [{
    auth
  }] = useSession();
  const [orderState] = useOrder();
  const [{
    parsePrice
  }] = useUtils();
  const {
    business,
    loading,
    error
  } = businessState;
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false);
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false);
  const [curProduct, setCurProduct] = useState(null);
  const [openUpselling, setOpenUpselling] = useState(false);
  const [canOpenUpselling, setCanOpenUpselling] = useState(false);
  const currentCart = (_Object$values$find = Object.values(orderState.carts).find(cart => {
    var _cart$business;

    return (cart === null || cart === void 0 ? void 0 : (_cart$business = cart.business) === null || _cart$business === void 0 ? void 0 : _cart$business.slug) === (business === null || business === void 0 ? void 0 : business.slug);
  })) !== null && _Object$values$find !== void 0 ? _Object$values$find : {};

  const onRedirect = (route, params) => {
    navigation.navigate(route, params);
  };

  const onProductClick = product => {
    setCurProduct(product);
  };

  const handleCancel = () => {
    setIsOpenSearchBar(false);
    handleChangeSearch('');
  };

  const handleCloseProductModal = () => {
    setCurProduct(null);
  };

  const handlerProductAction = () => {
    handleCloseProductModal();
  };

  const handleUpsellingPage = () => {
    onRedirect('CheckoutNavigator', {
      cartUuid: currentCart === null || currentCart === void 0 ? void 0 : currentCart.uuid
    });
    setOpenUpselling(false);
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BusinessProductsListingContainer, {
    style: styles.mainContainer,
    isActiveFloatingButtom: (currentCart === null || currentCart === void 0 ? void 0 : (_currentCart$products = currentCart.products) === null || _currentCart$products === void 0 ? void 0 : _currentCart$products.length) > 0 && categoryState.products.length !== 0
  }, loading && !error && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BusinessBasicInformation, {
    businessState: {
      business: {},
      loading: true
    },
    openBusinessInformation: openBusinessInformation
  }), /*#__PURE__*/React.createElement(BusinessProductsCategories, {
    categories: [],
    categorySelected: categorySelected,
    onClickCategory: handleChangeCategory,
    featured: featuredProducts,
    openBusinessInformation: openBusinessInformation,
    loading: loading
  }), /*#__PURE__*/React.createElement(WrapContent, null, /*#__PURE__*/React.createElement(BusinessProductsList, {
    categories: [],
    category: categorySelected,
    categoryState: categoryState,
    isBusinessLoading: loading,
    errorQuantityProducts: errorQuantityProducts
  }))), !loading && (business === null || business === void 0 ? void 0 : business.id) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WrapHeader, null, /*#__PURE__*/React.createElement(TopHeader, null, !isOpenSearchBar && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(View, {
    style: { ...styles.headerItem,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => navigation.goBack()
  }, /*#__PURE__*/React.createElement(IconAntDesign, {
    name: "arrowleft",
    color: colors.white,
    style: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 50,
      marginRight: 20
    },
    size: 25
  })), /*#__PURE__*/React.createElement(AddressInput, {
    onPress: () => {
      var _orderState$options;

      return auth ? onRedirect('AddressList', {
        isGoBack: true,
        isFromProductsList: true
      }) : onRedirect('AddressForm', {
        address: (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.address
      });
    }
  }, /*#__PURE__*/React.createElement(OText, {
    color: colors.white,
    numberOfLines: 1
  }, orderState === null || orderState === void 0 ? void 0 : (_orderState$options2 = orderState.options) === null || _orderState$options2 === void 0 ? void 0 : (_orderState$options2$ = _orderState$options2.address) === null || _orderState$options2$ === void 0 ? void 0 : _orderState$options2$.address))), !errorQuantityProducts && /*#__PURE__*/React.createElement(View, {
    style: { ...styles.headerItem,
      width: 30
    }
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => setIsOpenSearchBar(true)
  }, /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "search",
    color: colors.white,
    size: 25
  })))), isOpenSearchBar && /*#__PURE__*/React.createElement(WrapSearchBar, null, /*#__PURE__*/React.createElement(SearchBar, {
    onSearch: handleChangeSearch,
    onCancel: () => handleCancel(),
    isCancelButtonShow: true,
    noBorderShow: true,
    placeholder: t('SEARCH_PRODUCTS', 'Search Products'),
    lazyLoad: businessState === null || businessState === void 0 ? void 0 : (_businessState$busine = businessState.business) === null || _businessState$busine === void 0 ? void 0 : _businessState$busine.lazy_load_products_recommended
  }))), /*#__PURE__*/React.createElement(BusinessBasicInformation, {
    businessState: businessState
  })), !((business === null || business === void 0 ? void 0 : (_business$categories = business.categories) === null || _business$categories === void 0 ? void 0 : _business$categories.length) === 0) && /*#__PURE__*/React.createElement(BusinessProductsCategories, {
    categories: [{
      id: null,
      name: t('ALL', 'All')
    }, {
      id: 'featured',
      name: t('FEATURED', 'Featured')
    }, ...(business === null || business === void 0 ? void 0 : business.categories.sort((a, b) => a.rank - b.rank))],
    categorySelected: categorySelected,
    onClickCategory: handleChangeCategory,
    featured: featuredProducts,
    openBusinessInformation: openBusinessInformation
  }), /*#__PURE__*/React.createElement(WrapContent, null, /*#__PURE__*/React.createElement(BusinessProductsList, {
    categories: [{
      id: null,
      name: t('ALL', 'All')
    }, {
      id: 'featured',
      name: t('FEATURED', 'Featured')
    }, ...(business === null || business === void 0 ? void 0 : business.categories.sort((a, b) => a.rank - b.rank))],
    category: categorySelected,
    categoryState: categoryState,
    businessId: business.id,
    errors: errors,
    onProductClick: onProductClick,
    handleSearchRedirect: handleSearchRedirect,
    featured: featuredProducts,
    searchValue: searchValue,
    handleClearSearch: handleChangeSearch,
    errorQuantityProducts: errorQuantityProducts
  })))), !loading && auth && (currentCart === null || currentCart === void 0 ? void 0 : (_currentCart$products2 = currentCart.products) === null || _currentCart$products2 === void 0 ? void 0 : _currentCart$products2.length) > 0 && categoryState.products.length !== 0 && /*#__PURE__*/React.createElement(FloatingButton, {
    btnText: (currentCart === null || currentCart === void 0 ? void 0 : currentCart.subtotal) >= (currentCart === null || currentCart === void 0 ? void 0 : currentCart.minimum) ? !openUpselling ? t('VIEW_ORDER', 'View Order') : t('LOADING', 'Loading') : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart === null || currentCart === void 0 ? void 0 : currentCart.minimum)}`,
    isSecondaryBtn: (currentCart === null || currentCart === void 0 ? void 0 : currentCart.subtotal) < (currentCart === null || currentCart === void 0 ? void 0 : currentCart.minimum),
    btnLeftValueShow: (currentCart === null || currentCart === void 0 ? void 0 : currentCart.subtotal) >= (currentCart === null || currentCart === void 0 ? void 0 : currentCart.minimum) && !openUpselling && (currentCart === null || currentCart === void 0 ? void 0 : (_currentCart$products3 = currentCart.products) === null || _currentCart$products3 === void 0 ? void 0 : _currentCart$products3.length) > 0,
    btnRightValueShow: (currentCart === null || currentCart === void 0 ? void 0 : currentCart.subtotal) >= (currentCart === null || currentCart === void 0 ? void 0 : currentCart.minimum) && !openUpselling && (currentCart === null || currentCart === void 0 ? void 0 : (_currentCart$products4 = currentCart.products) === null || _currentCart$products4 === void 0 ? void 0 : _currentCart$products4.length) > 0,
    btnLeftValue: currentCart === null || currentCart === void 0 ? void 0 : (_currentCart$products5 = currentCart.products) === null || _currentCart$products5 === void 0 ? void 0 : _currentCart$products5.length,
    btnRightValue: parsePrice(currentCart === null || currentCart === void 0 ? void 0 : currentCart.total),
    disabled: openUpselling || (currentCart === null || currentCart === void 0 ? void 0 : currentCart.subtotal) < (currentCart === null || currentCart === void 0 ? void 0 : currentCart.minimum),
    handleClick: () => setOpenUpselling(true)
  }), /*#__PURE__*/React.createElement(OModal, {
    open: !!curProduct,
    onClose: handleCloseProductModal,
    entireModal: true,
    customClose: true
  }, /*#__PURE__*/React.createElement(ProductForm, {
    product: curProduct,
    businessSlug: business.slug,
    businessId: business.id,
    onClose: handleCloseProductModal,
    navigation: navigation,
    onSave: handlerProductAction
  })), openUpselling && /*#__PURE__*/React.createElement(UpsellingProducts, {
    businessId: currentCart === null || currentCart === void 0 ? void 0 : currentCart.business_id,
    business: currentCart === null || currentCart === void 0 ? void 0 : currentCart.business,
    cartProducts: currentCart === null || currentCart === void 0 ? void 0 : currentCart.products,
    handleUpsellingPage: handleUpsellingPage,
    openUpselling: openUpselling,
    canOpenUpselling: canOpenUpselling,
    setCanOpenUpselling: setCanOpenUpselling
  }));
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  BackIcon: {
    paddingRight: 20
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20
  }
});
export const BusinessProductsListing = props => {
  const businessProductslistingProps = { ...props,
    UIComponent: BusinessProductsListingUI
  };
  return /*#__PURE__*/React.createElement(BusinessAndProductList, businessProductslistingProps);
};
//# sourceMappingURL=index.js.map