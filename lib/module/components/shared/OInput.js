import * as React from 'react';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import { colors } from '../../theme';
const Wrapper = styled.View`
    background-color: ${colors.backgroundLight};
    border-radius: 25px;
    border-width: 1px;
    padding-horizontal: 16px;
    height: 50px;
    flex-direction: row;
    align-items: center;
`;
const Input = styled.TextInput`
    flex-grow: 1;
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
      marginHorizontal: 10
    }
  }) : null, /*#__PURE__*/React.createElement(Input, {
    secureTextEntry: props.isSecured,
    onChangeText: txt => props.onChange(txt),
    defaultValue: props.value,
    placeholder: props.placeholder ? props.placeholder : ''
  }));
};

OInput.defaultProps = {
  iconColor: '#959595',
  bgColor: 'white',
  borderColor: 'white'
};
export default OInput;
//# sourceMappingURL=OInput.js.map