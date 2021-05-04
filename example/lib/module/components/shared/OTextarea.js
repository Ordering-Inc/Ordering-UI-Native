import * as React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../theme';
const Wrapper = styled.View`
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${colors.lightGray};
`;
const Inner = styled.TextInput`
    height: 150px;
`;

const OTextarea = props => {
  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Inner, {
    placeholder: props.placeholder,
    placeholderTextColor: colors.lightGray,
    numberOfLines: props.lines,
    underlineColorAndroid: 'transparent',
    value: props.value,
    multiline: true
  }));
};

export default OTextarea;
//# sourceMappingURL=OTextarea.js.map