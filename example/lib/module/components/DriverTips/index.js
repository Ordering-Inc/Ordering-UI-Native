import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { DriverTips as DriverTipsController } from 'ordering-components/native';
import { OText } from '../shared';
import { DTContainer, DTCard } from './styles';

const DriverTipsUI = props => {
  const {
    driverTipsOptions,
    optionSelected,
    handlerChangeOption
  } = props;
  return /*#__PURE__*/React.createElement(DTContainer, null, (driverTipsOptions === null || driverTipsOptions === void 0 ? void 0 : driverTipsOptions.length) > 0 && driverTipsOptions.map((option, i) => /*#__PURE__*/React.createElement(TouchableOpacity, {
    key: i,
    onPress: () => handlerChangeOption(option)
  }, /*#__PURE__*/React.createElement(DTCard, {
    style: style.circle,
    isActive: option === optionSelected
  }, /*#__PURE__*/React.createElement(OText, {
    size: 14,
    color: option === optionSelected ? '#FFF' : '#000'
  }, `${option}%`)))));
};

const style = StyleSheet.create({
  circle: {
    borderRadius: 100 / 2
  }
});
export const DriverTips = props => {
  const driverTipsProps = { ...props,
    UIComponent: DriverTipsUI
  };
  return /*#__PURE__*/React.createElement(DriverTipsController, driverTipsProps);
};
//# sourceMappingURL=index.js.map