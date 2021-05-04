import * as React from 'react';
import styled from 'styled-components/native';
import { ORDER_STATUS } from '../config/constants';
import { getOrderStatus, getStatusColor } from '../providers/Utilities';
import { colors } from '../theme';
import { OText, OIcon, OButton } from './shared';
const Wrapper = styled.TouchableOpacity`
    flex: 1;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 2px #00000020;
    border-left-width: 5px;
    padding: 10px;
    margin-bottom: 12px;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 3px;
`;
const InnerWrapper = styled.View`
    flex: 1;    
    flex-direction: row;    
`;
const InfoWrapper = styled.View`
    flex-grow: 1;
`;
const Avatar = styled.Image`
    width: 80px;
    height: 80px;
    resize-mode: contain;
    margin-top: 8px;
    margin-right: 8px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
`;
const Status = styled.View`
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    flex-direction: row;
`;
const Address = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`;
const OrderNumber = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
const StatusAction = styled.View`
    flex-grow: 1;
    flex-basis: 0;
    border: 1px solid ${colors.lightGray}
    height: 42px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
`;

const OrderItem = props => {
  const [curItem, onSelectItem] = React.useState(null);
  const [is_online, changOnline] = React.useState(props.isOnline);
  React.useEffect(() => {
    changOnline(props.isOnline);
  }, [props.isOnline]);

  let onClickItem = item => {
    props.onClick(item);
    onSelectItem(item);
  };

  return /*#__PURE__*/React.createElement(Wrapper, {
    onPress: () => onClickItem(props.data),
    style: {
      borderLeftColor: getStatusColor(props.data.status)
    }
  }, /*#__PURE__*/React.createElement(InnerWrapper, null, /*#__PURE__*/React.createElement(OIcon, {
    url: props.data.business.logo,
    width: 80,
    height: 80,
    style: {
      borderRadius: 10,
      borderColor: '#e5e5e5',
      borderWidth: 1,
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(InfoWrapper, null, /*#__PURE__*/React.createElement(OrderNumber, null, /*#__PURE__*/React.createElement(OText, {
    size: 22,
    weight: '600'
  }, `#${props.data.id}`), /*#__PURE__*/React.createElement(OText, {
    color: 'grey'
  }, props.data.date)), /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: '500',
    style: {
      marginTop: -6
    }
  }, props.data.business.name), /*#__PURE__*/React.createElement(Address, null, /*#__PURE__*/React.createElement(OIcon, {
    src: require('../assets/icons/pin_outline.png'),
    width: 15,
    style: {
      marginRight: 4
    }
  }), /*#__PURE__*/React.createElement(OText, {
    isWrap: true,
    weight: '300',
    size: 12.5
  }, props.data.business.address)))), /*#__PURE__*/React.createElement(Status, null, /*#__PURE__*/React.createElement(StatusAction, null, /*#__PURE__*/React.createElement(OText, {
    color: colors.primary
  }, getOrderStatus(props.data.status))), props.data.status == ORDER_STATUS.PENDING ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    style: {
      width: 10
    }
  }, ''), /*#__PURE__*/React.createElement(OButton, {
    onClick: () => {},
    style: {
      shadowColor: 'transparent',
      height: 42,
      borderRadius: 10
    },
    parentStyle: {
      flex: 1
    },
    textStyle: {
      fontSize: 14,
      color: 'white'
    },
    bgColor: colors.primary,
    borderColor: colors.primary,
    isDisabled: !is_online,
    text: 'Accept',
    imgRightSrc: null
  })) : null));
};

OrderItem.defaultProps = {};
export default OrderItem;
//# sourceMappingURL=OrderItem.js.map