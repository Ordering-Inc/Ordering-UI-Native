import * as React from 'react';
import styled from 'styled-components/native';
const Wrapper = styled.View`
    flex-direction: row;
`;
const Icon = styled.Image`
    resize-mode: contain;
    tint-color: black;
    margin-right: 3px;
`;
const Label = styled.Text`
    flex-wrap: wrap;
    color: black;
    font-size: 14px;
    font-family: 'Poppins-Regular';
`;

const OIconText = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.style
  }, props.icon ? /*#__PURE__*/React.createElement(Icon, {
    source: props.icon,
    style: {
      width: props.size ? props.size : 18,
      height: props.size ? props.size : 18,
      tintColor: props.color,
      ...props.imgStyle
    }
  }) : null, /*#__PURE__*/React.createElement(Label, {
    style: {
      fontSize: props.size ? props.size : 14,
      color: props.color,
      ...props.textStyle
    }
  }, props.text));
};

OIconText.defaultProps = {};
export default OIconText;
//# sourceMappingURL=OIconText.js.map