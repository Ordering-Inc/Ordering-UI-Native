import * as React from 'react';
import styled from 'styled-components/native';
import { OIcon } from './shared';
import OKeyButton from './shared/OKeyButton';
const KeyWrapper = styled.View`
    background-color: #F0F0F0C2;
    height: 280px;
    padding: 7px;
    margin-bottom: 64px;
`;
const KeyRow = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 7px;
`;
const BtnDel = styled.TouchableOpacity`
    flex: 0.32;
    height: 50px;
    align-items: center;
    justify-content: center;
`;

const NumberKey = props => {
  const onChange = val => {
    props.onChangeValue(val);
  };

  return /*#__PURE__*/React.createElement(KeyWrapper, null, /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(OKeyButton, {
    title: '1',
    onClick: () => onChange(1),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '2',
    onClick: () => onChange(2),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '3',
    onClick: () => onChange(3),
    style: {
      flex: 0.32
    }
  })), /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(OKeyButton, {
    title: '4',
    onClick: () => onChange(4),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '5',
    onClick: () => onChange(5),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '6',
    onClick: () => onChange(6),
    style: {
      flex: 0.32
    }
  })), /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(OKeyButton, {
    title: '7',
    onClick: () => onChange(7),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '8',
    onClick: () => onChange(8),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '9',
    onClick: () => onChange(9),
    style: {
      flex: 0.32
    }
  })), /*#__PURE__*/React.createElement(KeyRow, null, /*#__PURE__*/React.createElement(OKeyButton, {
    style: {
      flex: 0.32,
      backgroundColor: 'transparent'
    }
  }), /*#__PURE__*/React.createElement(OKeyButton, {
    title: '0',
    onClick: () => onChange(0),
    style: {
      flex: 0.32
    }
  }), /*#__PURE__*/React.createElement(BtnDel, {
    onPress: () => onChange(-1)
  }, /*#__PURE__*/React.createElement(OIcon, {
    src: require('../assets/icons/delete.png')
  }))));
};

export default NumberKey;
//# sourceMappingURL=NumberKey.js.map