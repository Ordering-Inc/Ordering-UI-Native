import React, { useEffect } from 'react';
import { AddressList as AddressListController, useLanguage, useOrder, useSession } from 'ordering-components/native';
import { AddressListContainer, AddressItem } from './styles';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme';
import { OButton, OText, OAlert } from '../shared';
import { Container } from '../../layouts/Container';
import { NotFoundSource } from '../NotFoundSource';
import NavBar from '../NavBar';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const addIcon = require('../../assets/icons/add-circular-outlined-button.png');

const AddressListUI = props => {
  var _route$params2, _route$params3, _route$params4, _addressList$addresse, _addressList$error$, _route$params5, _route$params6, _addressList$addresse2;

  const {
    navigation,
    route,
    addressList,
    isFromProfile,
    nopadding,
    handleSetDefault,
    handleDelete,
    setAddressList,
    isGoBack,
    actionStatus,
    isFromBusinesses,
    isFromProductsList
  } = props;
  const [orderState] = useOrder();
  const [, t] = useLanguage();
  const [{
    auth
  }] = useSession();

  const onNavigatorRedirect = () => {
    var _route$params;

    if (route && (isFromBusinesses || isGoBack)) {
      isGoBack ? goToBack() : onNavigationRedirect('BottomTab');
      return;
    }

    if (route && route !== null && route !== void 0 && (_route$params = route.params) !== null && _route$params !== void 0 && _route$params.isFromCheckout) {
      onNavigationRedirect('CheckoutPage');
      return;
    }

    onNavigationRedirect('BottomTab');
  };

  const uniqueAddressesList = addressList.addresses && addressList.addresses.filter((address, i, self) => i === self.findIndex(obj => address.address === obj.address && address.address_notes === obj.address_notes && address.zipcode === obj.zipcode && address.internal_number === obj.internal_number)) || [];

  const checkAddress = address => {
    var _orderState$options;

    if (!(orderState !== null && orderState !== void 0 && (_orderState$options = orderState.options) !== null && _orderState$options !== void 0 && _orderState$options.address)) return true;
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number'];
    const values = [];
    props.forEach(prop => {
      if (address[prop]) {
        if (prop === 'location') {
          var _orderState$options2, _orderState$options2$, _orderState$options3, _orderState$options3$;

          values.push(address[prop].lat === (orderState === null || orderState === void 0 ? void 0 : (_orderState$options2 = orderState.options) === null || _orderState$options2 === void 0 ? void 0 : (_orderState$options2$ = _orderState$options2.address[prop]) === null || _orderState$options2$ === void 0 ? void 0 : _orderState$options2$.lat) && address[prop].lng === (orderState === null || orderState === void 0 ? void 0 : (_orderState$options3 = orderState.options) === null || _orderState$options3 === void 0 ? void 0 : (_orderState$options3$ = _orderState$options3.address[prop]) === null || _orderState$options3$ === void 0 ? void 0 : _orderState$options3$.lng));
        } else {
          var _orderState$options4;

          values.push(address[prop] === (orderState === null || orderState === void 0 ? void 0 : (_orderState$options4 = orderState.options) === null || _orderState$options4 === void 0 ? void 0 : _orderState$options4.address[prop]));
        }
      } else {
        var _orderState$options5, _orderState$options6;

        values.push((orderState === null || orderState === void 0 ? void 0 : (_orderState$options5 = orderState.options) === null || _orderState$options5 === void 0 ? void 0 : _orderState$options5.address[prop]) === null || (orderState === null || orderState === void 0 ? void 0 : (_orderState$options6 = orderState.options) === null || _orderState$options6 === void 0 ? void 0 : _orderState$options6.address[prop]) === '');
      }
    });
    return values.every(value => value);
  };

  const addressIcon = tag => {
    switch (tag) {
      case 'other':
        return 'plus';

      case 'office':
        return 'office-building';

      case 'home':
        return 'home';

      case 'favorite':
        return 'heart';

      default:
        return 'plus';
    }
  };

  const handleSetAddress = address => {
    var _orderState$options7;

    if (address.id === (orderState === null || orderState === void 0 ? void 0 : (_orderState$options7 = orderState.options) === null || _orderState$options7 === void 0 ? void 0 : _orderState$options7.address_id)) return;
    handleSetDefault(address);
  };

  const handleSaveAddress = address => {
    let found = false;
    const addresses = addressList.addresses.map(_address => {
      if ((_address === null || _address === void 0 ? void 0 : _address.id) === (address === null || address === void 0 ? void 0 : address.id)) {
        Object.assign(_address, address);
        found = true;
      } else if (address.default) {
        _address.default = false;
      }

      return _address;
    });

    if (!found) {
      addresses.push(address);
    }

    setAddressList({ ...addressList,
      addresses
    });
  };

  const goToBack = () => navigation.goBack();

  const onNavigationRedirect = (route, params) => navigation.navigate(route, params);

  useEffect(() => {
    var _orderState$options$a;

    if (orderState.loading && auth && (_orderState$options$a = orderState.options.address) !== null && _orderState$options$a !== void 0 && _orderState$options$a.location) {
      onNavigatorRedirect();
    }
  }, [orderState.options.address]);
  return /*#__PURE__*/React.createElement(Container, {
    nopadding: nopadding
  }, /*#__PURE__*/React.createElement(Spinner, {
    visible: actionStatus.loading || orderState.loading || addressList.loading && !isFromBusinesses && !isFromProfile
  }), (!addressList.loading || isFromProductsList || isFromBusinesses || isFromProfile) && /*#__PURE__*/React.createElement(AddressListContainer, null, isFromProfile && /*#__PURE__*/React.createElement(OText, {
    size: 24,
    mBottom: 20
  }, t('SAVED_PLACES', 'My saved places')), route && ((route === null || route === void 0 ? void 0 : (_route$params2 = route.params) === null || _route$params2 === void 0 ? void 0 : _route$params2.isFromBusinesses) || (route === null || route === void 0 ? void 0 : (_route$params3 = route.params) === null || _route$params3 === void 0 ? void 0 : _route$params3.isFromCheckout) || (route === null || route === void 0 ? void 0 : (_route$params4 = route.params) === null || _route$params4 === void 0 ? void 0 : _route$params4.isFromProductsList)) && !isFromProfile && /*#__PURE__*/React.createElement(NavBar, {
    title: t('ADDRESS_LIST', 'Address List'),
    titleAlign: 'center',
    onActionLeft: () => goToBack(),
    showCall: false,
    btnStyle: {
      paddingLeft: 0
    },
    paddingTop: 0
  }), addressList.loading && /*#__PURE__*/React.createElement(React.Fragment, null, [...Array(5)].map((item, i) => /*#__PURE__*/React.createElement(Placeholder, {
    key: i,
    style: {
      padding: 20
    },
    Animation: Fade
  }, /*#__PURE__*/React.createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 20,
    height: 60,
    style: {
      marginBottom: 0,
      marginRight: 15
    }
  }), /*#__PURE__*/React.createElement(Placeholder, null, /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 70
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 40
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    width: 70
  })))))), !addressList.error && (addressList === null || addressList === void 0 ? void 0 : (_addressList$addresse = addressList.addresses) === null || _addressList$addresse === void 0 ? void 0 : _addressList$addresse.length) > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, uniqueAddressesList.map(address => /*#__PURE__*/React.createElement(AddressItem, {
    key: address.id,
    isSelected: checkAddress(address),
    onPress: () => handleSetAddress(address)
  }, /*#__PURE__*/React.createElement(MaterialIcon, {
    name: addressIcon(address === null || address === void 0 ? void 0 : address.tag),
    size: 32,
    color: colors.primary,
    style: styles.icon
  }), /*#__PURE__*/React.createElement(OText, {
    style: styles.address
  }, address.address), /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "pencil-outline",
    size: 28,
    color: colors.green,
    onPress: () => {
      var _orderState$options8, _orderState$options8$;

      return onNavigationRedirect('AddressForm', {
        address: address,
        isEditing: true,
        addressesList: addressList,
        onSaveAddress: handleSaveAddress,
        isSelectedAfterAdd: true,
        isFromProductsList: isFromProductsList,
        hasAddressDefault: !!((_orderState$options8 = orderState.options) !== null && _orderState$options8 !== void 0 && (_orderState$options8$ = _orderState$options8.address) !== null && _orderState$options8$ !== void 0 && _orderState$options8$.location)
      });
    }
  }), /*#__PURE__*/React.createElement(OAlert, {
    title: t('DELETE_ADDRESS', 'Delete Address'),
    message: t('QUESTION_DELETE_ADDRESS', 'Are you sure to you wants delete the selected address'),
    onAccept: () => handleDelete(address),
    disabled: checkAddress(address)
  }, /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "trash-can-outline",
    size: 28,
    color: !checkAddress(address) ? colors.primary : colors.disabled
  }))))), !addressList.loading && addressList.error && addressList.error.length > 0 && /*#__PURE__*/React.createElement(NotFoundSource, {
    content: ((_addressList$error$ = addressList.error[0]) === null || _addressList$error$ === void 0 ? void 0 : _addressList$error$.message) || addressList.error[0] || t('NETWORK_ERROR', 'Network Error, please reload the app')
  }), !addressList.loading && !addressList.error && /*#__PURE__*/React.createElement(React.Fragment, null, !(route && (route !== null && route !== void 0 && (_route$params5 = route.params) !== null && _route$params5 !== void 0 && _route$params5.isFromBusinesses || route !== null && route !== void 0 && (_route$params6 = route.params) !== null && _route$params6 !== void 0 && _route$params6.isFromCheckout)) && !isFromProfile && /*#__PURE__*/React.createElement(OText, {
    size: 24
  }, t('WHERE_DELIVER_NOW', 'Where do we deliver you?')), /*#__PURE__*/React.createElement(OButton, {
    text: t('ADD_NEW_ADDRESS', 'Add new Address'),
    imgRightSrc: "",
    imgLeftSrc: addIcon,
    bgColor: colors.white,
    imgLeftStyle: styles.buttonIcon,
    style: styles.button,
    borderColor: colors.primary,
    onClick: () => {
      var _orderState$options9, _orderState$options9$;

      return onNavigationRedirect('AddressForm', {
        address: null,
        onSaveAddress: handleSaveAddress,
        addressesList: addressList === null || addressList === void 0 ? void 0 : addressList.addresses,
        nopadding: true,
        isSelectedAfterAdd: true,
        hasAddressDefault: !!((_orderState$options9 = orderState.options) !== null && _orderState$options9 !== void 0 && (_orderState$options9$ = _orderState$options9.address) !== null && _orderState$options9$ !== void 0 && _orderState$options9$.location)
      });
    }
  })), !isFromProfile && (addressList === null || addressList === void 0 ? void 0 : (_addressList$addresse2 = addressList.addresses) === null || _addressList$addresse2 === void 0 ? void 0 : _addressList$addresse2.length) > 0 && /*#__PURE__*/React.createElement(OButton, {
    text: t('CONTINUE', 'Continue'),
    style: styles.button,
    onClick: () => onNavigatorRedirect(),
    textStyle: {
      color: colors.white
    }
  })));
};

const styles = StyleSheet.create({
  address: {
    flex: 1,
    marginHorizontal: 5
  },
  icon: {
    flex: 0.2
  },
  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    left: 20,
    position: 'absolute'
  },
  button: {
    marginVertical: 30
  }
});
export const AddressList = props => {
  const addressListProps = { ...props,
    UIComponent: AddressListUI
  };
  return /*#__PURE__*/React.createElement(AddressListController, addressListProps);
};
//# sourceMappingURL=index.js.map