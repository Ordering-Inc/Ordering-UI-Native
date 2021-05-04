import * as React from 'react';
import styled from 'styled-components/native';
import { OIcon } from '.';
import { DIRECTION } from '../../config/constants';
import { colors } from '../../theme';
import OText from './OText';
const Wrapper = styled.View`
    flex: 1;
    border-radius: 35px;
    min-height: 50px;
    padding-horizontal: 25px;
    padding-vertical: 10px;
    max-width: 80%;
    margin-bottom: 14px;
`;
const ImageContainer = styled.TouchableOpacity`
  flex: 1;
`;

const OChatBubble = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props !== null && props !== void 0 && props.side ? props.side === DIRECTION.RIGHT ? {
      borderBottomRightRadius: 0,
      backgroundColor: props.bgColor ? props.bgColor : colors.primary,
      alignSelf: 'flex-end'
    } : {
      borderBottomLeftRadius: 0,
      backgroundColor: props.bgColor ? props.bgColor : colors.backgroundGray,
      alignSelf: 'flex-start'
    } : {
      borderRadius: 5,
      backgroundColor: props.bgColor ? props.bgColor : colors.backgroundGray,
      alignSelf: 'center'
    }
  }, (props === null || props === void 0 ? void 0 : props.image) && /*#__PURE__*/React.createElement(ImageContainer, {
    onPress: props.onClick
  }, /*#__PURE__*/React.createElement(OIcon, {
    cover: true,
    url: props.image,
    width: 250,
    height: 250
  })), /*#__PURE__*/React.createElement(OText, {
    color: props.textColor ? props.textColor : props.side == DIRECTION.RIGHT ? colors.white : 'black'
  }, props.contents), /*#__PURE__*/React.createElement(OText, {
    color: props.textColor ? props.textColor : props.side == DIRECTION.RIGHT ? colors.white : 'black',
    style: {
      textAlign: 'right'
    },
    size: 9
  }, props.datetime));
};

export default OChatBubble;
//# sourceMappingURL=OChatBubble.js.map