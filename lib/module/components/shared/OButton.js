import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import * as React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../theme';
const StyledButton = styled.View`
  background-color: ${colors.primary};
  border-radius: 26px;
  border-width: 2px;
  height: 52px;
  border-color: ${colors.primary};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 2px #00000020;
  elevation: 2;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
`;
const StyledButtonDisabled = styled(StyledButton)`
  background-color: ${colors.backgroundDark};
  border-color: ${colors.backgroundDark};
`;
const StyledText = styled.Text`
  font-size: 16px;
  color: ${colors.btnFont};
  margin-left: 10px;
  margin-right: 10px;
  font-family: 'Poppins-Regular';
`;
const StyledTextDisabled = styled(StyledText)`
  color: ${colors.mediumGray};
`;
const StyledImage = styled.Image`
  width: 24px;
  height: 24px;
  resize-mode: contain;
`;
const EndImage = styled.Image`
  width: 15px;
  height: 15px;
  resize-mode: contain;
  right 20px;
  position: absolute;
  right: 20px;
`;

const OButton = props => {
  var _props$style;

  if (props.isDisabled) {
    return /*#__PURE__*/React.createElement(View, {
      style: props.parentStyle
    }, /*#__PURE__*/React.createElement(StyledButtonDisabled, {
      style: props.style
    }, /*#__PURE__*/React.createElement(StyledTextDisabled, {
      style: props.textStyle
    }, props.text)));
  }

  if (props.isLoading) {
    return /*#__PURE__*/React.createElement(StyledButton, {
      style: props.style
    }, /*#__PURE__*/React.createElement(ActivityIndicator, {
      size: "small",
      color: props.indicatorColor
    }));
  }

  return /*#__PURE__*/React.createElement(TouchableOpacity, {
    testID: props.testID,
    activeOpacity: props.activeOpacity,
    onPress: props.onClick,
    style: {
      width: props.isCircle ? 52 : (_props$style = props.style) === null || _props$style === void 0 ? void 0 : _props$style.width,
      ...props.parentStyle
    }
  }, /*#__PURE__*/React.createElement(StyledButton, {
    style: props.bgColor ? { ...props.style,
      backgroundColor: props.bgColor,
      borderColor: props.borderColor
    } : props.style
  }, props.imgLeftSrc ? /*#__PURE__*/React.createElement(StyledImage, {
    style: props.imgLeftStyle,
    source: props.imgLeftSrc
  }) : null, props.text ? /*#__PURE__*/React.createElement(StyledText, {
    style: props.textStyle
  }, props.text) : null, props.imgRightSrc ? /*#__PURE__*/React.createElement(EndImage, {
    style: props.imgRightStyle,
    source: props.imgRightSrc
  }) : null));
};

OButton.defaultProps = {
  isLoading: false,
  isDisabled: false,
  indicatorColor: 'white',
  activeOpacity: 0.5,
  imgRightSrc: require('../../assets/icons/arrow_right.png')
};
export default OButton;
//# sourceMappingURL=OButton.js.map