function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import styled, { css } from 'styled-components/native';
const SText = styled.Text`
  color: ${props => props.color || 'black'};
  font-family: 'Poppins-Regular';
  font-size: ${props => props.size ? `${props.size}px` : '14px'};
  flex-wrap: wrap;
  margin-bottom: ${props => props.hasBottom ? '10px' : props.mBottom ? `${props.mBottom}px` : 0};
  margin-right: ${props => props.hasBottom ? '10px' : props.mRight ? `${props.mRight}px` : 0};
  margin-left: ${props => props.hasBottom ? '10px' : props.mLeft ? `${props.mLeft}px` : 0};
  ${props => props.weight && css`
      font-weight: ${props.weight};
    `};
  ${props => props.isWrap && css`
      flex: ${props.weight ? 1 : 0};
    `};
`;

const OText = props => {
  return /*#__PURE__*/React.createElement(SText, _extends({}, props, {
    style: props.style
  }), props.children, props.space && ' ');
};

export default OText;
//# sourceMappingURL=OText.js.map