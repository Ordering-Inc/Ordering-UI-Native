import * as React from 'react';
import styled from 'styled-components/native';
import { colors } from '../theme';
import { OText, OIconText, OIcon, OIconButton } from './shared';
const KindItems = styled.View`
    flex: 1;
    padding-vertical: 10px;
`;
const KInner = styled.View`
    flex: 1;    
    flex-direction: row;
`;
const KInfoWrap = styled.View`
    flex: 1;
    padding-horizontal: 10px;
`;
const KActions = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`;

const OInfoCell = props => {
  return /*#__PURE__*/React.createElement(KindItems, null, /*#__PURE__*/React.createElement(OText, {
    style: {
      textTransform: 'uppercase',
      marginVertical: 10
    },
    size: 15,
    weight: '500'
  }, props.title), /*#__PURE__*/React.createElement(KInner, null, /*#__PURE__*/React.createElement(OIcon, {
    url: props.logo,
    dummy: props.dummy,
    style: {
      borderRadius: 12
    },
    width: 100,
    height: 100
  }), /*#__PURE__*/React.createElement(KInfoWrap, null, /*#__PURE__*/React.createElement(OText, {
    size: 19,
    weight: '500'
  }, props.name), /*#__PURE__*/React.createElement(OIconText, {
    icon: require('../assets/icons/pin_outline.png'),
    text: props.address
  }), /*#__PURE__*/React.createElement(KActions, null, /*#__PURE__*/React.createElement(OIconButton, {
    icon: require('../assets/icons/speech-bubble.png'),
    title: 'Chat',
    borderColor: colors.primary,
    bgColor: 'white',
    onClick: props.onChat
  }), /*#__PURE__*/React.createElement(OIconButton, {
    icon: require('../assets/icons/phone.png'),
    title: 'Call',
    borderColor: colors.primary,
    bgColor: 'white',
    style: {
      marginHorizontal: 10
    },
    onClick: props.onCall
  })))));
};

OInfoCell.defaultProps = {};
export default OInfoCell;
//# sourceMappingURL=OInfoCell.js.map