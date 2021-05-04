import * as React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../theme';
const Wrapper = styled.TouchableOpacity`
    height: 40px;
    border-radius: 20px;
    flex-direction: row;
    border: 1px solid white;
    padding-horizontal: 20px;
    align-items: center;
    justify-content: center;
`;
const DisabledWrapper = styled.View`
    height: 40px;
    border-radius: 20px;
    flex-direction: row;
    border: 1px solid white;
    padding-horizontal: 20px;
    align-items: center;
    justify-content: center;
`;
const Icon = styled.Image`
    width: 22px;
    height: 22px;
`;
const Title = styled.Text`
    font-size: 16px;
    margin-horizontal: 7px;
`;

const OIconButton = props => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, !props.disabled ? /*#__PURE__*/React.createElement(Wrapper, {
    onPress: props.onClick,
    style: {
      borderColor: props.borderColor || props.color,
      backgroundColor: props.isOutline ? 'white' : props.bgColor || props.color,
      height: props.height || 40,
      borderRadius: props.height ? props.height * 0.5 : 20,
      ...props.style
    }
  }, props.icon ? /*#__PURE__*/React.createElement(Icon, {
    source: props.icon,
    style: {
      tintColor: props.iconColor,
      ...props.iconStyle
    }
  }) : null, props.title ? /*#__PURE__*/React.createElement(Title, {
    style: {
      color: props.textColor || props.color,
      ...props.textStyle
    }
  }, props.title) : null) : /*#__PURE__*/React.createElement(DisabledWrapper, {
    style: {
      borderColor: colors.backgroundDark,
      backgroundColor: props.disabledColor ? props.disabledColor : colors.backgroundDark,
      height: props.height || 40,
      borderRadius: props.height ? props.height * 0.5 : 20,
      ...props.style
    }
  }, props.icon ? /*#__PURE__*/React.createElement(Icon, {
    source: props.urlIcon ? {
      uri: props.icon
    } : props.icon,
    resizeMode: props.cover ? 'cover' : 'contain',
    style: {
      tintColor: props.iconColor,
      ...props.iconStyle
    }
  }) : null, props.title ? /*#__PURE__*/React.createElement(Title, {
    style: {
      color: props.textColor || props.color,
      ...props.textStyle
    }
  }, props.title) : null));
};

OIconButton.defaultProps = {};
export default OIconButton;
//# sourceMappingURL=OIconButton.js.map