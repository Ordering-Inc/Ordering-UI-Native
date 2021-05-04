import * as React from 'react';
import styled from 'styled-components/native';
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

const OChatBubble = props => {
  return /*#__PURE__*/React.createElement(Wrapper, {
    style: props.side == DIRECTION.RIGHT ? {
      borderBottomRightRadius: 0,
      backgroundColor: props.bgColor ? props.bgColor : colors.primary,
      alignSelf: 'flex-end'
    } : {
      borderBottomLeftRadius: 0,
      backgroundColor: props.bgColor ? props.bgColor : colors.backgroundGray,
      alignSelf: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(OText, {
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