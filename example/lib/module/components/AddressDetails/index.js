import React from 'react';
import { View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AddressDetails as AddressDetailsController, useOrder } from 'ordering-components/native';
import { ADContainer, ADHeader, ADAddress, ADMap } from './styles';
import { colors } from '../../theme';
import { OText, OIcon } from '../shared';

const AddressDetailsUI = props => {
  var _orderState$options, _orderState$options$a, _orderState$options2;

  const {
    navigation,
    addressToShow,
    isCartPending,
    googleMapsUrl
  } = props;
  const [orderState] = useOrder();
  return /*#__PURE__*/React.createElement(ADContainer, null, /*#__PURE__*/React.createElement(ADHeader, null, /*#__PURE__*/React.createElement(ADAddress, null, /*#__PURE__*/React.createElement(OText, {
    size: 20,
    numberOfLines: 1,
    ellipsizeMode: "tail",
    style: {
      width: '85%'
    }
  }, addressToShow || (orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : (_orderState$options$a = _orderState$options.address) === null || _orderState$options$a === void 0 ? void 0 : _orderState$options$a.address)), /*#__PURE__*/React.createElement(View, null, (orderState === null || orderState === void 0 ? void 0 : (_orderState$options2 = orderState.options) === null || _orderState$options2 === void 0 ? void 0 : _orderState$options2.type) === 1 && !isCartPending && /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "pencil-outline",
    size: 28,
    color: colors.editColor,
    style: {
      marginBottom: 5,
      marginLeft: 5
    },
    onPress: () => navigation.navigate('AddressList', {
      isFromCheckout: true
    })
  })))), /*#__PURE__*/React.createElement(ADMap, null, /*#__PURE__*/React.createElement(OIcon, {
    url: googleMapsUrl,
    style: {
      borderRadius: 15,
      width: '100%'
    },
    height: 162
  })));
};

export const AddressDetails = props => {
  const addressDetailsProps = { ...props,
    UIComponent: AddressDetailsUI
  };
  return /*#__PURE__*/React.createElement(AddressDetailsController, addressDetailsProps);
};
//# sourceMappingURL=index.js.map