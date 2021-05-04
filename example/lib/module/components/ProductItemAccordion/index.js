import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useUtils, useLanguage, useOrder } from 'ordering-components/native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Accordion, AccordionSection, ProductInfo, ProductQuantity, ContentInfo, ProductImage, AccordionContent, ProductOptionsList, ProductOption, ProductSubOption, ProductComment } from './styles';
import { OIcon, OText, OAlert } from '../shared';
import { colors } from '../../theme';
import Spinner from 'react-native-loading-spinner-overlay';
export const ProductItemAccordion = props => {
  var _product$valid;

  const {
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    onDeleteProduct,
    onEditProduct
  } = props;
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{
    parsePrice
  }] = useUtils();
  const [isActive, setActiveState] = useState(false);
  const [setHeight, setHeightState] = useState({
    height: new Animated.Value(0)
  });
  const [setRotate, setRotateState] = useState({
    angle: new Animated.Value(0)
  });

  const productInfo = () => {
    if (isCartProduct) {
      var _product$ingredients, _product$options;

      const ingredients = JSON.parse(JSON.stringify(Object.values((_product$ingredients = product.ingredients) !== null && _product$ingredients !== void 0 ? _product$ingredients : {})));
      let options = JSON.parse(JSON.stringify(Object.values((_product$options = product.options) !== null && _product$options !== void 0 ? _product$options : {})));
      options = options.map(option => {
        var _option$suboptions;

        option.suboptions = Object.values((_option$suboptions = option.suboptions) !== null && _option$suboptions !== void 0 ? _option$suboptions : {});
        return option;
      });
      return { ...productInfo,
        ingredients,
        options
      };
    }

    return product;
  };
  /* const toggleAccordion = () => {
     if ((!product?.valid_menu && isCartProduct)) return
     if (isActive) {
       Animated.timing(setHeight.height, {
         toValue: 100,
         duration: 500,
         easing: Easing.linear,
         useNativeDriver: false,
       }).start()
     } else {
       setHeightState({height: new Animated.Value(0)})
     }
   }*/


  const handleChangeQuantity = value => {
    if (parseInt(value) === 0) {
      onDeleteProduct && onDeleteProduct(product);
    } else {
      changeQuantity && changeQuantity(product, parseInt(value));
    }
  };

  const getFormattedSubOptionName = ({
    quantity,
    name,
    position,
    price
  }) => {
    const pos = position ? `(${position})` : '';
    return `${quantity} x ${name} ${pos} +${price}`;
  };
  /*useEffect(() => {
    toggleAccordion()
  }, [isActive])*/


  const productOptions = getProductMax && [...Array(getProductMax(product) + 1)].map((_, opt) => {
    return {
      label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
      value: opt.toString()
    };
  });
  return /*#__PURE__*/React.createElement(AccordionSection, null, /*#__PURE__*/React.createElement(Spinner, {
    visible: orderState.loading
  }), /*#__PURE__*/React.createElement(Accordion, {
    isValid: (_product$valid = product === null || product === void 0 ? void 0 : product.valid) !== null && _product$valid !== void 0 ? _product$valid : true,
    onPress: () => setActiveState(!isActive)
  }, /*#__PURE__*/React.createElement(ProductInfo, null, isCartProduct && !isCartPending && getProductMax ? /*#__PURE__*/React.createElement(RNPickerSelect, {
    items: productOptions,
    onValueChange: handleChangeQuantity,
    value: product.quantity.toString(),
    style: pickerStyle,
    useNativeAndroidPickerStyle: false,
    placeholder: {},
    Icon: () => /*#__PURE__*/React.createElement(AntIcon, {
      name: "caretdown",
      style: pickerStyle.icon
    }),
    disabled: orderState.loading
  }) : /*#__PURE__*/React.createElement(ProductQuantity, null, /*#__PURE__*/React.createElement(OText, null, product === null || product === void 0 ? void 0 : product.quantity))), /*#__PURE__*/React.createElement(ContentInfo, null, (product === null || product === void 0 ? void 0 : product.images) && /*#__PURE__*/React.createElement(ProductImage, null, /*#__PURE__*/React.createElement(OIcon, {
    url: product === null || product === void 0 ? void 0 : product.images,
    style: styles.productImage
  })), /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 0.8
    }
  }, /*#__PURE__*/React.createElement(OText, null, product.name)), /*#__PURE__*/React.createElement(View, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(OText, null, parsePrice(product.total || product.price)), (productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "chevron-down",
    size: 18
  })), /*#__PURE__*/React.createElement(View, {
    style: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }, onEditProduct && isCartProduct && !isCartPending && /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "pencil-outline",
    size: 20,
    color: colors.green,
    onPress: () => onEditProduct(product)
  }), onDeleteProduct && isCartProduct && !isCartPending && /*#__PURE__*/React.createElement(OAlert, {
    title: t('DELETE_PRODUCT', 'Delete Product'),
    message: t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?'),
    onAccept: () => onDeleteProduct(product)
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "trash-can-outline",
    size: 20,
    color: colors.red
  })))))), /*#__PURE__*/React.createElement(View, {
    style: {
      display: isActive ? 'flex' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Animated.View, null, /*#__PURE__*/React.createElement(AccordionContent, null, productInfo().ingredients.length > 0 && productInfo().ingredients.some(ingredient => !ingredient.selected) && /*#__PURE__*/React.createElement(ProductOptionsList, null, /*#__PURE__*/React.createElement(OText, null, t('INGREDIENTS', 'Ingredients')), productInfo().ingredients.map(ingredient => !ingredient.selected && /*#__PURE__*/React.createElement(OText, {
    key: ingredient.id,
    style: {
      marginLeft: 10
    }
  }, t('NO', 'No'), " ", ingredient.name))), productInfo().options.length > 0 && /*#__PURE__*/React.createElement(ProductOptionsList, null, productInfo().options.map(option => /*#__PURE__*/React.createElement(ProductOption, {
    key: option.id
  }, /*#__PURE__*/React.createElement(OText, null, option.name), option.suboptions.map(suboption => /*#__PURE__*/React.createElement(ProductSubOption, {
    key: suboption.id
  }, /*#__PURE__*/React.createElement(OText, null, getFormattedSubOptionName({
    quantity: suboption.quantity,
    name: suboption.name,
    position: suboption.position !== 'whole' ? t(suboption.position.toUpperCase(), suboption.position) : '',
    price: parsePrice(suboption.price)
  }))))))), product.comment && /*#__PURE__*/React.createElement(ProductComment, null, /*#__PURE__*/React.createElement(OText, null, t('SPECIAL_COMMENT', 'Special Comment')), /*#__PURE__*/React.createElement(OText, null, product.comment))))));
};
const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    width: 50
  },
  icon: {
    width: 10,
    height: 10,
    top: 17,
    right: 10,
    position: 'absolute'
  },
  placeholder: {
    color: colors.secundaryContrast
  }
});
const styles = StyleSheet.create({
  productImage: {
    borderRadius: 10,
    width: 75,
    height: 75
  },
  test: {
    overflow: 'hidden'
  }
});
//# sourceMappingURL=index.js.map