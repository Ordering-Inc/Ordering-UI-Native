function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { AddressForm as AddressFormController } from '../components/AddressForm';
import { SafeAreaContainer } from '../layouts/SafeAreaContainer';
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
  flex-shrink: 1
`;

const AddressForm = ({
  navigation,
  route
}) => {
  var _route$params, _route$params2, _route$params2$addres, _route$params3, _route$params4, _route$params5, _route$params6, _route$params7, _route$params8, _route$params9;

  const AddressFormProps = {
    navigation: navigation,
    route: route,
    address: route === null || route === void 0 ? void 0 : (_route$params = route.params) === null || _route$params === void 0 ? void 0 : _route$params.address,
    addressId: route === null || route === void 0 ? void 0 : (_route$params2 = route.params) === null || _route$params2 === void 0 ? void 0 : (_route$params2$addres = _route$params2.address) === null || _route$params2$addres === void 0 ? void 0 : _route$params2$addres.id,
    isEditing: route === null || route === void 0 ? void 0 : (_route$params3 = route.params) === null || _route$params3 === void 0 ? void 0 : _route$params3.isEditing,
    addressesList: route === null || route === void 0 ? void 0 : (_route$params4 = route.params) === null || _route$params4 === void 0 ? void 0 : _route$params4.addressList,
    onSaveAddress: route === null || route === void 0 ? void 0 : (_route$params5 = route.params) === null || _route$params5 === void 0 ? void 0 : _route$params5.onSaveAddress,
    isSelectedAfterAdd: true,
    isGuestUser: route === null || route === void 0 ? void 0 : (_route$params6 = route.params) === null || _route$params6 === void 0 ? void 0 : _route$params6.isGuestUser,
    isFromBusinesses: route === null || route === void 0 ? void 0 : (_route$params7 = route.params) === null || _route$params7 === void 0 ? void 0 : _route$params7.isFromBusinesses,
    isFromProductsList: route === null || route === void 0 ? void 0 : (_route$params8 = route.params) === null || _route$params8 === void 0 ? void 0 : _route$params8.isFromProductsList,
    hasAddressDefault: route === null || route === void 0 ? void 0 : (_route$params9 = route.params) === null || _route$params9 === void 0 ? void 0 : _route$params9.hasAddressDefault
  };
  return /*#__PURE__*/React.createElement(SafeAreaContainer, null, /*#__PURE__*/React.createElement(KeyboardView, {
    enabled: true,
    behavior: Platform.OS === 'ios' ? 'padding' : 'height'
  }, /*#__PURE__*/React.createElement(AddressFormController, _extends({}, AddressFormProps, {
    useValidationFileds: true
  }))));
};

export default AddressForm;
//# sourceMappingURL=AddressForm.js.map