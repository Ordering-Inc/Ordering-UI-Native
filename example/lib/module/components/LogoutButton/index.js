import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LogoutAction } from 'ordering-components/native';
import { OIcon } from '../shared';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';

const LogoutButtonUI = props => {
  const {
    handleLogoutClick
  } = props;
  return /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: () => handleLogoutClick()
  }, /*#__PURE__*/React.createElement(OIcon, {
    src: IMAGES.menulogout,
    width: 28,
    height: 28,
    color: colors.disabledContrast
  }));
};

export const LogoutButton = props => {
  const logoutProps = { ...props,
    isNative: true,
    UIComponent: LogoutButtonUI
  };
  return /*#__PURE__*/React.createElement(LogoutAction, logoutProps);
};
//# sourceMappingURL=index.js.map