import * as React from 'react';
import styled from 'styled-components/native';
import { colors } from '../../theme';
const Wrapper = styled.View``;
const SImage = styled.Image`
  tint-color: ${colors.primary};
`;

const OImage = props => {
  var _props$style, _props$style2;

  return /*#__PURE__*/React.createElement(Wrapper, {
    style: {
      borderRadius: (_props$style = props.style) === null || _props$style === void 0 ? void 0 : _props$style.borderRadius,
      overflow: 'hidden',
      marginHorizontal: (_props$style2 = props.style) === null || _props$style2 === void 0 ? void 0 : _props$style2.marginHorizontal
    }
  }, /*#__PURE__*/React.createElement(SImage, {
    source: props.src ? props.src : props.url ? {
      uri: props.url
    } : props.dummy ? props.dummy : require('../../assets/icons/lunch.png'),
    style: {
      tintColor: props.color,
      flex: props.isWrap ? 1 : 0,
      width: props.width,
      height: props.height,
      marginHorizontal: 0,
      borderRadius: props.borderRadius,
      ...props.style
    },
    resizeMode: props.cover ? 'cover' : 'contain'
  }, props.children));
};

OImage.defaultProps = {
  width: 26,
  height: 26
};
export default OImage;
//# sourceMappingURL=OIcon.js.map