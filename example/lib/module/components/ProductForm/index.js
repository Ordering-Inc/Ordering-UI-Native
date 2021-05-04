import React from 'react';
import { ProductForm as ProductOptions, useSession, useLanguage, useOrder, useUtils } from 'ordering-components/native';
import { ProductIngredient } from '../ProductIngredient';
import { ProductOption } from '../ProductOption';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ProductHeader, WrapHeader, TopHeader, WrapContent, ProductTitle, ProductDescription, ProductEditions, SectionTitle, WrapperIngredients, WrapperSubOption, ProductComment, ProductActions } from './styles';
import { colors } from '../../theme';
import { OButton, OInput, OText } from '../shared';
import { ScrollView } from 'react-native-gesture-handler';
import { ProductOptionSubOption } from '../ProductOptionSubOption';
import Spinner from 'react-native-loading-spinner-overlay';
import { NotFoundSource } from '../NotFoundSource';
const windowHeight = Dimensions.get('window').height;
export const ProductOptionsUI = props => {
  var _orderState$options, _orderState$options2, _error$;

  const {
    navigation,
    editMode,
    isSoldOut,
    productCart,
    increment,
    decrement,
    showOption,
    maxProductQuantity,
    errors,
    handleSave,
    handleChangeIngredientState,
    handleChangeSuboptionState,
    handleChangeCommentState,
    productObject,
    onClose
  } = props;
  const [{
    parsePrice
  }] = useUtils();
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{
    auth
  }] = useSession();
  const {
    product,
    loading,
    error
  } = productObject;

  const isError = id => {
    let bgColor = colors.white;

    if (errors[`id:${id}`]) {
      bgColor = 'rgba(255, 0, 0, 0.05)';
    }

    if (isSoldOut || maxProductQuantity <= 0) {
      bgColor = 'hsl(0, 0%, 72%)';
    }

    return bgColor;
  };

  const handleSaveProduct = () => {
    const isErrors = Object.values(errors).length > 0;

    if (!isErrors) {
      handleSave && handleSave();
      return;
    }
  };

  const handleRedirectLogin = () => {
    onClose();
    navigation.navigate('Login');
  };

  const saveErrors = orderState.loading || maxProductQuantity === 0 || Object.keys(errors).length > 0;
  return /*#__PURE__*/React.createElement(ScrollView, {
    style: styles.mainContainer
  }, /*#__PURE__*/React.createElement(Spinner, {
    visible: loading
  }), !loading && !error && product && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WrapHeader, null, /*#__PURE__*/React.createElement(TopHeader, null, /*#__PURE__*/React.createElement(View, {
    style: styles.headerItem
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => onClose()
  }, /*#__PURE__*/React.createElement(IconAntDesign, {
    name: "arrowleft",
    color: colors.white,
    style: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 50
    },
    size: 25
  })))), /*#__PURE__*/React.createElement(ProductHeader, {
    source: {
      uri: (product === null || product === void 0 ? void 0 : product.images) || (productCart === null || productCart === void 0 ? void 0 : productCart.images)
    }
  })), /*#__PURE__*/React.createElement(WrapContent, null, /*#__PURE__*/React.createElement(ProductTitle, null, /*#__PURE__*/React.createElement(OText, {
    size: 20,
    style: {
      flex: 1
    }
  }, (product === null || product === void 0 ? void 0 : product.name) || productCart.name), /*#__PURE__*/React.createElement(OText, {
    size: 20,
    color: colors.primary
  }, productCart.price ? parsePrice(productCart.price) : '')), /*#__PURE__*/React.createElement(ProductDescription, null, /*#__PURE__*/React.createElement(OText, null, (product === null || product === void 0 ? void 0 : product.description) || (productCart === null || productCart === void 0 ? void 0 : productCart.description)), ((product === null || product === void 0 ? void 0 : product.sku) && (product === null || product === void 0 ? void 0 : product.sku) !== '-1' && (product === null || product === void 0 ? void 0 : product.sku) !== '1' || (productCart === null || productCart === void 0 ? void 0 : productCart.sku) && (productCart === null || productCart === void 0 ? void 0 : productCart.sku) !== '-1' && (productCart === null || productCart === void 0 ? void 0 : productCart.sku) !== '1') && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('SKU', 'Sku')), /*#__PURE__*/React.createElement(OText, null, (product === null || product === void 0 ? void 0 : product.sku) || (productCart === null || productCart === void 0 ? void 0 : productCart.sku)))), /*#__PURE__*/React.createElement(ProductEditions, null, (product === null || product === void 0 ? void 0 : product.ingredients.length) > 0 && /*#__PURE__*/React.createElement(View, {
    style: styles.optionContainer
  }, /*#__PURE__*/React.createElement(SectionTitle, null, /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, t('INGREDIENTS', 'Ingredients'))), /*#__PURE__*/React.createElement(WrapperIngredients, {
    style: {
      backgroundColor: isSoldOut || maxProductQuantity <= 0 ? 'hsl(0, 0%, 72%)' : colors.white
    }
  }, product === null || product === void 0 ? void 0 : product.ingredients.map(ingredient => /*#__PURE__*/React.createElement(ProductIngredient, {
    key: ingredient.id,
    ingredient: ingredient,
    state: productCart.ingredients[`id:${ingredient.id}`],
    onChange: handleChangeIngredientState
  })))), product === null || product === void 0 ? void 0 : product.extras.map(extra => extra.options.map(option => {
    const currentState = productCart.options[`id:${option.id}`] || {};
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: option.id
    }, showOption(option) && /*#__PURE__*/React.createElement(View, {
      style: styles.optionContainer
    }, /*#__PURE__*/React.createElement(ProductOption, {
      option: option,
      currentState: currentState,
      error: errors[`id:${option.id}`]
    }, /*#__PURE__*/React.createElement(WrapperSubOption, {
      style: {
        backgroundColor: isError(option.id)
      }
    }, option.suboptions.map(suboption => {
      var _productCart$options$, _productCart$options$2;

      const currentState = ((_productCart$options$ = productCart.options[`id:${option.id}`]) === null || _productCart$options$ === void 0 ? void 0 : _productCart$options$.suboptions[`id:${suboption.id}`]) || {};
      const balance = ((_productCart$options$2 = productCart.options[`id:${option.id}`]) === null || _productCart$options$2 === void 0 ? void 0 : _productCart$options$2.balance) || 0;
      return /*#__PURE__*/React.createElement(ProductOptionSubOption, {
        key: suboption.id,
        onChange: handleChangeSuboptionState,
        balance: balance,
        option: option,
        suboption: suboption,
        state: currentState,
        disabled: isSoldOut || maxProductQuantity <= 0
      });
    })))));
  })), /*#__PURE__*/React.createElement(ProductComment, null, /*#__PURE__*/React.createElement(SectionTitle, null, /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, t('SPECIAL_COMMENT', 'Special comment'))), /*#__PURE__*/React.createElement(OInput, {
    multiline: true,
    placeholder: t('SPECIAL_COMMENT', 'Special comment'),
    value: productCart.comment,
    onChange: val => handleChangeCommentState({
      target: {
        value: val
      }
    }),
    isDisabled: !(productCart && !isSoldOut && maxProductQuantity),
    style: styles.comment
  })))), /*#__PURE__*/React.createElement(ProductActions, null, productCart && !isSoldOut && maxProductQuantity > 0 && /*#__PURE__*/React.createElement(View, {
    style: styles.quantityControl
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: decrement,
    disabled: productCart.quantity === 1 || isSoldOut
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "minus-circle-outline",
    size: 32,
    color: productCart.quantity === 1 || isSoldOut ? colors.backgroundGray : colors.backgroundDark
  })), /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, productCart.quantity), /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: increment,
    disabled: maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "plus-circle-outline",
    size: 32,
    color: maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut ? colors.backgroundGray : colors.backgroundDark
  }))), /*#__PURE__*/React.createElement(View, {
    style: {
      width: isSoldOut || maxProductQuantity <= 0 ? '100%' : '70%'
    }
  }, productCart && !isSoldOut && maxProductQuantity > 0 && auth && ((_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.address_id) && /*#__PURE__*/React.createElement(OButton, {
    onClick: () => handleSaveProduct(),
    imgRightSrc: "",
    text: `${orderState.loading ? t('LOADING', 'Loading') : editMode ? t('UPDATE', 'Update') : t('ADD_TO_CART', 'Add to Cart')} ${productCart.total ? parsePrice(productCart === null || productCart === void 0 ? void 0 : productCart.total) : ''}`,
    textStyle: {
      color: saveErrors ? colors.primary : colors.white
    },
    style: {
      backgroundColor: saveErrors ? colors.white : colors.primary,
      opacity: saveErrors ? 0.3 : 1
    }
  }), auth && !((_orderState$options2 = orderState.options) !== null && _orderState$options2 !== void 0 && _orderState$options2.address_id) && (orderState.loading ? /*#__PURE__*/React.createElement(OButton, {
    isDisabled: true,
    text: t('LOADING', 'Loading'),
    imgRightSrc: ""
  }) : /*#__PURE__*/React.createElement(OButton, {
    onClick: navigation.navigate('AddressList')
  })), (!auth || isSoldOut || maxProductQuantity <= 0) && /*#__PURE__*/React.createElement(OButton, {
    isDisabled: isSoldOut || maxProductQuantity <= 0,
    onClick: () => handleRedirectLogin(),
    text: isSoldOut || maxProductQuantity <= 0 ? t('SOLD_OUT', 'Sold out') : t('LOGIN_SIGNUP', 'Login / Sign Up'),
    imgRightSrc: "",
    textStyle: {
      color: colors.primary
    },
    style: {
      borderColor: colors.primary,
      backgroundColor: colors.white
    }
  })))), error && error.length > 0 && /*#__PURE__*/React.createElement(NotFoundSource, {
    content: ((_error$ = error[0]) === null || _error$ === void 0 ? void 0 : _error$.message) || error[0]
  }));
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: windowHeight
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
    zIndex: 1
  },
  optionContainer: {
    marginBottom: 20
  },
  comment: {
    borderWidth: 1,
    borderRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: '#DBDCDB',
    height: 100,
    alignItems: 'flex-start'
  },
  quantityControl: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  }
});
export const ProductForm = props => {
  const productOptionsProps = { ...props,
    UIComponent: ProductOptionsUI
  };
  return /*#__PURE__*/React.createElement(ProductOptions, productOptionsProps);
};
//# sourceMappingURL=index.js.map