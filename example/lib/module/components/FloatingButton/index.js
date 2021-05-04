import React from 'react';
import { FloatingButton as FloatingButtonController } from 'ordering-components/native';
import { Container, Button } from './styles';
import { OText } from '../shared';
import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

const FloatingButtonUI = props => {
  const {
    btnLeftValue,
    btnRightValue,
    btnLeftValueShow,
    btnRightValueShow,
    btnText,
    handleButtonClick,
    disabled,
    isSecondaryBtn
  } = props;
  return /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Button, {
    style: [isSecondaryBtn ? styles.secodaryBtn : styles.primaryBtn],
    onPress: handleButtonClick,
    disabled: disabled
  }, /*#__PURE__*/React.createElement(OText, {
    color: colors.white,
    size: 16,
    mLeft: 20
  }, btnLeftValueShow ? btnLeftValue : ''), /*#__PURE__*/React.createElement(OText, {
    style: styles.btnTextStyle,
    color: colors.white,
    size: 16,
    weight: "bold"
  }, btnText), /*#__PURE__*/React.createElement(OText, {
    color: colors.white,
    size: 16,
    mRight: 20
  }, btnRightValueShow ? btnRightValue : '')));
};

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: colors.primary
  },
  secodaryBtn: {
    backgroundColor: colors.textSecondary
  },
  btnTextStyle: {
    position: 'absolute',
    width: '100%',
    paddingBottom: 5,
    left: 0,
    textAlign: 'center'
  }
});
export const FloatingButton = props => {
  const floatingButtonProps = { ...props,
    UIComponent: FloatingButtonUI
  };
  return /*#__PURE__*/React.createElement(FloatingButtonController, floatingButtonProps);
};
//# sourceMappingURL=index.js.map