import * as React from 'react';
import styled from 'styled-components/native';
import OText from './OText';
const Wrapper = styled.TouchableOpacity`
    background-color: white;
    border-radius: 4px;
    height: 50px;
    align-items: center;
    justify-content: center;
`;

const OKeyButton = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.style,
    onPress: props.onClick
  }, /*#__PURE__*/React.createElement(OText, {
    size: 22
  }, props.title), props.subTitle ? /*#__PURE__*/React.createElement(OText, null, props.subTitle) : null);
};

export default OKeyButton;
//# sourceMappingURL=OKeyButton.js.map