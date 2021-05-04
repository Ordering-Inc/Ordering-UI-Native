import * as React from 'react';
import styled from 'styled-components/native';
import { parsePrice } from '../providers/Utilities';
import { OText, OIcon } from './shared';
const Wrapper = styled.View`
    flex: 1;
    padding-vertical: 10px;
    flex-direction: row;
    align-items: center;
`;
const PInner = styled.View`
    flex: 1;
    flex-grow: 1;
`;
const Price = styled.View`
    align-items: flex-start;
`;

const OProductCell = props => {
  const getExtras = options => {
    var str = '';
    options.map(opt => {
      str += opt.name + '\n';
      opt.suboptions.map(s => {
        str += ' ' + s.name + '\n';
      });
    });
    return str;
  };

  return /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(OText, {
    style: {
      marginVertical: 10,
      minWidth: 10
    },
    size: 14,
    weight: '500'
  }, props.data.quantity || '1'), /*#__PURE__*/React.createElement(OIcon, {
    url: props.data.images,
    style: {
      borderRadius: 15,
      marginHorizontal: 10
    },
    width: 80,
    height: 80
  }), /*#__PURE__*/React.createElement(PInner, null, /*#__PURE__*/React.createElement(OText, {
    size: 17,
    weight: '500'
  }, props.data.name || 'Pepperoni Pizza'), props.data.options.length > 0 ? /*#__PURE__*/React.createElement(OText, {
    size: 14,
    weight: '300'
  }, getExtras(props.data.options) || '') : null), /*#__PURE__*/React.createElement(Price, null, /*#__PURE__*/React.createElement(OText, null, `${parsePrice(props.data.price)}` || '$30.00')));
};

OProductCell.defaultProps = {};
export default OProductCell;
//# sourceMappingURL=OProductCell.js.map