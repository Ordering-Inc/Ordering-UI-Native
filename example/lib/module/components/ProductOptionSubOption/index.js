import React, { useState, useEffect } from 'react';
import { ProductOptionSuboption as ProductSubOptionController, useUtils, useLanguage } from 'ordering-components/native';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Container, IconControl, QuantityControl, Checkbox, PositionControl, Circle } from './styles';
import { colors } from '../../theme';
import { OText } from '../shared';
export const ProductOptionSubOptionUI = props => {
  const {
    state,
    increment,
    decrement,
    balance,
    option,
    suboption,
    toggleSelect,
    changePosition,
    disabled
  } = props;
  const [, t] = useLanguage();
  const [{
    parsePrice
  }] = useUtils();
  const [showMessage, setShowMessage] = useState(false);

  const handleIncrement = () => {
    increment();
  };

  const handleDecrement = () => {
    decrement();
  };

  const handlePosition = position => {
    changePosition(position);
  };

  const handleSuboptionClick = () => {
    var _option$suboptions;

    toggleSelect();

    if (balance === (option === null || option === void 0 ? void 0 : option.max) && (option === null || option === void 0 ? void 0 : (_option$suboptions = option.suboptions) === null || _option$suboptions === void 0 ? void 0 : _option$suboptions.length) > balance && !((option === null || option === void 0 ? void 0 : option.min) === 1 && (option === null || option === void 0 ? void 0 : option.max) === 1)) {
      setShowMessage(true);
    }
  };

  useEffect(() => {
    var _option$suboptions2;

    if (!(balance === (option === null || option === void 0 ? void 0 : option.max) && (option === null || option === void 0 ? void 0 : (_option$suboptions2 = option.suboptions) === null || _option$suboptions2 === void 0 ? void 0 : _option$suboptions2.length) > balance && !((option === null || option === void 0 ? void 0 : option.min) === 1 && (option === null || option === void 0 ? void 0 : option.max) === 1))) {
      setShowMessage(false);
    }
  }, [balance]);
  const disableIncrement = option !== null && option !== void 0 && option.limit_suboptions_by_max ? balance === (option === null || option === void 0 ? void 0 : option.max) : state.quantity === (suboption === null || suboption === void 0 ? void 0 : suboption.max) || !state.selected && balance === (option === null || option === void 0 ? void 0 : option.max);
  const price = option !== null && option !== void 0 && option.with_half_option && suboption !== null && suboption !== void 0 && suboption.half_price && state.position !== 'whole' ? suboption === null || suboption === void 0 ? void 0 : suboption.half_price : suboption === null || suboption === void 0 ? void 0 : suboption.price;
  return /*#__PURE__*/React.createElement(Container, {
    onPress: () => handleSuboptionClick(),
    disabled: disabled
  }, /*#__PURE__*/React.createElement(IconControl, null, (option === null || option === void 0 ? void 0 : option.min) === 0 && (option === null || option === void 0 ? void 0 : option.max) === 1 || (option === null || option === void 0 ? void 0 : option.max) > 1 ? state !== null && state !== void 0 && state.selected ? /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "checkbox-marked",
    color: colors.primary,
    size: 24
  }) : /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "checkbox-blank-outline",
    color: colors.backgroundDark,
    size: 24
  }) : state !== null && state !== void 0 && state.selected ? /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "radiobox-marked",
    color: colors.primary,
    size: 24
  }) : /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "radiobox-blank",
    color: colors.backgroundDark,
    size: 24
  }), /*#__PURE__*/React.createElement(OText, {
    mLeft: 10,
    style: {
      flex: 1
    }
  }, suboption === null || suboption === void 0 ? void 0 : suboption.name)), showMessage && /*#__PURE__*/React.createElement(OText, {
    mLeft: 10,
    mRight: 10,
    style: {
      flex: 1,
      textAlign: 'center'
    },
    color: colors.primary
  }, `${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option === null || option === void 0 ? void 0 : option.max}`), (option === null || option === void 0 ? void 0 : option.allow_suboption_quantity) && /*#__PURE__*/React.createElement(QuantityControl, null, /*#__PURE__*/React.createElement(Checkbox, {
    disabled: state.quantity === 0,
    onPress: handleDecrement
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "minus-circle-outline",
    size: 24,
    color: state.quantity === 0 ? colors.backgroundDark : colors.primary
  })), /*#__PURE__*/React.createElement(OText, {
    mLeft: 5,
    mRight: 5
  }, state.quantity), /*#__PURE__*/React.createElement(Checkbox, {
    disabled: disableIncrement,
    onPress: handleIncrement
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "plus-circle-outline",
    size: 24,
    color: disableIncrement ? colors.backgroundDark : colors.primary
  }))), (option === null || option === void 0 ? void 0 : option.with_half_option) && /*#__PURE__*/React.createElement(PositionControl, null, /*#__PURE__*/React.createElement(Circle, {
    onPress: () => handlePosition('left')
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "circle-half-full",
    color: state.selected && state.position === 'left' ? colors.primary : colors.backgroundDark,
    size: 24,
    style: styles.inverse
  })), /*#__PURE__*/React.createElement(Circle, {
    onPress: () => handlePosition('whole')
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "checkbox-blank-circle",
    color: state.selected && state.position === 'whole' ? colors.primary : colors.backgroundDark,
    size: 24
  })), /*#__PURE__*/React.createElement(Circle, {
    onPress: () => handlePosition('right')
  }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "circle-half-full",
    color: state.selected && state.position === 'right' ? colors.primary : colors.backgroundDark,
    size: 24
  }))), /*#__PURE__*/React.createElement(OText, {
    color: "#555"
  }, "+ ", parsePrice(price)));
};
const styles = StyleSheet.create({
  inverse: {
    transform: [{
      rotateY: '180deg'
    }]
  }
});
export const ProductOptionSubOption = props => {
  const productOptionSubOptionProps = { ...props,
    UIComponent: ProductOptionSubOptionUI
  };
  return /*#__PURE__*/React.createElement(ProductSubOptionController, productOptionSubOptionProps);
};
//# sourceMappingURL=index.js.map