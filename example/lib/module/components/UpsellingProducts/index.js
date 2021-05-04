import React, { useState, useEffect } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';
import { UpsellingPage as UpsellingPageController, useUtils, useLanguage } from 'ordering-components/native';
import { OText, OIcon, OModal, OBottomPopup, OButton } from '../shared';
import { colors } from '../../theme';
import { Container, UpsellingContainer, Item, Details, AddButton, CloseUpselling } from './styles';
import { ProductForm } from '../ProductForm';

const UpsellingProductsUI = props => {
  var _upsellingProducts$pr3, _actualProduct$api;

  const {
    isCustomMode,
    upsellingProducts,
    business,
    handleUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling
  } = props;
  const [actualProduct, setActualProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [{
    parsePrice
  }] = useUtils();
  const [, t] = useLanguage();
  useEffect(() => {
    if (!isCustomMode) {
      var _upsellingProducts$pr, _upsellingProducts$pr2;

      if (upsellingProducts !== null && upsellingProducts !== void 0 && (_upsellingProducts$pr = upsellingProducts.products) !== null && _upsellingProducts$pr !== void 0 && _upsellingProducts$pr.length && !upsellingProducts.loading) {
        setCanOpenUpselling && setCanOpenUpselling(true);
      } else if (!(upsellingProducts !== null && upsellingProducts !== void 0 && (_upsellingProducts$pr2 = upsellingProducts.products) !== null && _upsellingProducts$pr2 !== void 0 && _upsellingProducts$pr2.length) && !upsellingProducts.loading && !canOpenUpselling && openUpselling) {
        handleUpsellingPage && handleUpsellingPage();
      }
    }
  }, [upsellingProducts.loading, upsellingProducts === null || upsellingProducts === void 0 ? void 0 : upsellingProducts.products.length]);

  const handleFormProduct = product => {
    setActualProduct(product);
    setModalIsOpen(true);
  };

  const handleSaveProduct = () => {
    setActualProduct(null);
    setModalIsOpen(false);
  };

  const UpsellingLayout = () => {
    return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(UpsellingContainer, {
      horizontal: true,
      showsHorizontalScrollIndicator: false
    }, !upsellingProducts.loading ? /*#__PURE__*/React.createElement(React.Fragment, null, !upsellingProducts.error ? upsellingProducts.products.map(product => /*#__PURE__*/React.createElement(Item, {
      key: product.id
    }, /*#__PURE__*/React.createElement(OIcon, {
      url: product.images,
      style: styles.imageStyle
    }), /*#__PURE__*/React.createElement(Details, null, /*#__PURE__*/React.createElement(OText, {
      size: 12,
      numberOfLines: 1,
      ellipsizeMode: "tail"
    }, product.name), /*#__PURE__*/React.createElement(OText, {
      color: colors.primary,
      weight: "bold"
    }, parsePrice(product.price))), /*#__PURE__*/React.createElement(AddButton, {
      onPress: () => handleFormProduct(product)
    }, /*#__PURE__*/React.createElement(MaterialComIcon, {
      name: "plus-circle",
      color: colors.primary,
      size: 35
    })))) : /*#__PURE__*/React.createElement(OText, null, upsellingProducts.message)) : /*#__PURE__*/React.createElement(Spinner, {
      visible: upsellingProducts.loading
    })));
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, isCustomMode ? /*#__PURE__*/React.createElement(UpsellingLayout, null) : /*#__PURE__*/React.createElement(React.Fragment, null, !canOpenUpselling || (upsellingProducts === null || upsellingProducts === void 0 ? void 0 : (_upsellingProducts$pr3 = upsellingProducts.products) === null || _upsellingProducts$pr3 === void 0 ? void 0 : _upsellingProducts$pr3.length) === 0 ? null : /*#__PURE__*/React.createElement(OBottomPopup, {
    title: t('WANT_SOMETHING_ELSE', 'Do you want something else?'),
    open: openUpselling,
    onClose: () => handleUpsellingPage()
  }, /*#__PURE__*/React.createElement(UpsellingLayout, null), /*#__PURE__*/React.createElement(CloseUpselling, null, /*#__PURE__*/React.createElement(OButton, {
    imgRightSrc: "",
    text: t('NO_THANKS', 'No Thanks'),
    style: styles.closeUpsellingButton,
    onClick: () => handleUpsellingPage()
  })))), /*#__PURE__*/React.createElement(OModal, {
    open: modalIsOpen,
    onClose: () => setModalIsOpen(false),
    entireModal: true,
    customClose: true
  }, actualProduct && /*#__PURE__*/React.createElement(ProductForm, {
    product: actualProduct,
    businessId: actualProduct === null || actualProduct === void 0 ? void 0 : (_actualProduct$api = actualProduct.api) === null || _actualProduct$api === void 0 ? void 0 : _actualProduct$api.businessId,
    businessSlug: business.slug,
    onSave: () => handleSaveProduct(),
    onClose: () => setModalIsOpen(false)
  })));
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 120,
    height: 90,
    resizeMode: 'cover',
    borderRadius: 10
  },
  closeUpsellingButton: {
    borderRadius: 25,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 1,
    height: 42,
    marginBottom: 10
  },
  upsellingModal: {
    height: '50%',
    top: 250
  }
});
export const UpsellingProducts = props => {
  const upsellingProductsProps = { ...props,
    UIComponent: UpsellingProductsUI
  };
  return /*#__PURE__*/React.createElement(UpsellingPageController, upsellingProductsProps);
};
//# sourceMappingURL=index.js.map