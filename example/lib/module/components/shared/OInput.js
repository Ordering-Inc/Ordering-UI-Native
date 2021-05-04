import * as React from 'react';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import { colors } from '../../theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const Wrapper = styled.View`
  background-color: ${colors.backgroundLight};
  border-radius: 25px;
  border-width: 1px;
  padding-horizontal: 16px;
  height: 50px;
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: center;
`;
const Input = styled.TextInput`
  flex-grow: 1;
  flex: 1;
  min-height: 30px;
  font-size: 15px;
  font-family: 'Poppins-Regular';
`;

const OInput = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      backgroundColor: props.bgColor,
      borderColor: props.borderColor,
      ...props.style
    }
  }, props.icon ? /*#__PURE__*/React.createElement(OIcon, {
    src: props.icon,
    color: props.iconColor,
    width: 20,
    height: 20,
    style: {
      marginRight: 10
    }
  }) : null, props.vertorIcon && /*#__PURE__*/React.createElement(MaterialIcon, {
    name: props === null || props === void 0 ? void 0 : props.vertorIcon,
    size: 20,
    color: props === null || props === void 0 ? void 0 : props.vectorIconColor,
    style: {
      marginHorizontal: 10
    }
  }), /*#__PURE__*/React.createElement(Input, {
    name: props.name,
    secureTextEntry: props.isSecured,
    onChangeText: txt => props.name ? props.onChange({
      target: {
        name: props.name,
        value: txt
      }
    }) : props.onChange(txt),
    defaultValue: props.value,
    placeholder: props.placeholder ? props.placeholder : '',
    keyboardType: props.type || 'default',
    multiline: props.multiline,
    scrollEnabled: props.multiline,
    editable: !props.isDisabled,
    autoCapitalize: props.autoCapitalize,
    autoCompleteType: props.autoCompleteType,
    autoCorrect: props.autoCorrect
  }), props.iconRight && /*#__PURE__*/React.createElement(OIcon, {
    src: props.iconRight,
    color: props.iconRightColor,
    width: 20,
    height: 20,
    style: { ...props.iconRightStyle
    }
  }), props.iconCustomRight);
};

OInput.defaultProps = {
  iconColor: '#959595',
  bgColor: 'white',
  borderColor: 'white'
};
export default OInput;
//# sourceMappingURL=OInput.js.map