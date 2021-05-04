import React, { useEffect, useState, useRef } from 'react';
import { AddressForm as AddressFormController, useLanguage, useConfig, useSession, useOrder } from 'ordering-components/native';
import { StyleSheet, View, TouchableOpacity, Keyboard } from 'react-native';
import { OInput, OButton, OText, OModal } from '../shared';
import { getTraduction } from '../../utils';
import NavBar from '../NavBar';
import { colors } from '../../theme';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AddressFormContainer, AutocompleteInput, IconsContainer, GoogleMapContainer, FormInput } from './styles';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useForm, Controller } from 'react-hook-form';
import { GoogleMap } from '../GoogleMap';
import Spinner from 'react-native-loading-spinner-overlay';
const inputNames = [{
  name: 'address',
  code: 'Address'
}, {
  name: 'internal_number',
  code: 'Internal number'
}, {
  name: 'zipcode',
  code: 'Zipcode'
}, {
  name: 'address_notes',
  code: 'Address notes'
}];
const tagsName = [{
  icon: 'home',
  value: 'home'
}, {
  icon: 'office-building',
  value: 'office'
}, {
  icon: 'heart',
  value: 'favorite'
}, {
  icon: 'plus',
  value: 'other'
}];

const AddressFormUI = props => {
  var _addressState$address, _addressState$address2, _formState$changes$lo, _formState$changes, _configState$configs, _configState$configs$, _configState$configs2, _configState$configs3, _configState$configs4, _configState$configs5, _configState$configs6, _configState$configs7, _formState$changes20, _addressState$address7, _formState$changes22, _formState$changes23, _formState$changes25, _formState$changes27, _orderState$options3, _orderState$options3$;

  const {
    navigation,
    updateChanges,
    address,
    formState,
    isEditing,
    handleChangeInput,
    addressState,
    addressesList,
    saveAddress,
    userCustomerSetup,
    isGuestUser,
    isRequiredField,
    isFromProductsList,
    hasAddressDefault
  } = props;
  const [, t] = useLanguage();
  const [{
    auth
  }] = useSession();
  const {
    showToast
  } = useToast();
  const [configState] = useConfig();
  const [orderState] = useOrder();
  const {
    handleSubmit,
    errors,
    control,
    setValue
  } = useForm();
  const [toggleMap, setToggleMap] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    content: [],
    key: null
  });
  const [addressTag, setAddressTag] = useState(addressState === null || addressState === void 0 ? void 0 : (_addressState$address = addressState.address) === null || _addressState$address === void 0 ? void 0 : _addressState$address.tag);
  const [firstLocationNoEdit, setFirstLocationNoEdit] = useState({
    value: {
      lat: null,
      lng: null
    },
    address: null
  });
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [locationChange, setLocationChange] = useState(isEditing ? addressState === null || addressState === void 0 ? void 0 : (_addressState$address2 = addressState.address) === null || _addressState$address2 === void 0 ? void 0 : _addressState$address2.location : (_formState$changes$lo = (_formState$changes = formState.changes) === null || _formState$changes === void 0 ? void 0 : _formState$changes.location) !== null && _formState$changes$lo !== void 0 ? _formState$changes$lo : null);
  const [saveMapLocation, setSaveMapLocation] = useState(false);
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [isSignUpEffect, setIsSignUpEffect] = useState(false);
  const googleInput = useRef(null);
  const googleMapsApiKey = configState === null || configState === void 0 ? void 0 : (_configState$configs = configState.configs) === null || _configState$configs === void 0 ? void 0 : (_configState$configs$ = _configState$configs.google_maps_api_key) === null || _configState$configs$ === void 0 ? void 0 : _configState$configs$.value;
  const isLocationRequired = ((_configState$configs2 = configState.configs) === null || _configState$configs2 === void 0 ? void 0 : (_configState$configs3 = _configState$configs2.google_autocomplete_selection_required) === null || _configState$configs3 === void 0 ? void 0 : _configState$configs3.value) === '1' || ((_configState$configs4 = configState.configs) === null || _configState$configs4 === void 0 ? void 0 : (_configState$configs5 = _configState$configs4.google_autocomplete_selection_required) === null || _configState$configs5 === void 0 ? void 0 : _configState$configs5.value) === 'true';
  const maxLimitLocation = configState === null || configState === void 0 ? void 0 : (_configState$configs6 = configState.configs) === null || _configState$configs6 === void 0 ? void 0 : (_configState$configs7 = _configState$configs6.meters_to_change_address) === null || _configState$configs7 === void 0 ? void 0 : _configState$configs7.value;

  const continueAsGuest = () => navigation.navigate('BusinessList');

  const goToBack = () => navigation.goBack();

  const onSubmit = () => {
    var _formState$changes2, _addressState$address3, _formState$changes3, _formState$changes4, _addressesList$addres, _arrayList$map$some;

    if (!auth && (formState === null || formState === void 0 ? void 0 : (_formState$changes2 = formState.changes) === null || _formState$changes2 === void 0 ? void 0 : _formState$changes2.address) === '' && addressState !== null && addressState !== void 0 && (_addressState$address3 = addressState.address) !== null && _addressState$address3 !== void 0 && _addressState$address3.address) {
      setAlertState({
        open: true,
        content: [t('VALIDATION_ERROR_ADDRESS_REQUIRED', 'The field Address is required')]
      });
      return;
    }

    if (formState !== null && formState !== void 0 && (_formState$changes3 = formState.changes) !== null && _formState$changes3 !== void 0 && _formState$changes3.address && !(formState !== null && formState !== void 0 && (_formState$changes4 = formState.changes) !== null && _formState$changes4 !== void 0 && _formState$changes4.location)) {
      if (isLocationRequired) {
        setAlertState({
          open: true,
          content: [t('ADDRESS_REQUIRE_LOCATION', 'The address needs a location, please select one of the suggested')]
        });
        return;
      }
    }

    const arrayList = isEditing ? (addressesList === null || addressesList === void 0 ? void 0 : (_addressesList$addres = addressesList.addresses) === null || _addressesList$addres === void 0 ? void 0 : _addressesList$addres.filter(address => {
      var _addressState$address4;

      return address.id !== (addressState === null || addressState === void 0 ? void 0 : (_addressState$address4 = addressState.address) === null || _addressState$address4 === void 0 ? void 0 : _addressState$address4.id);
    })) || [] : addressesList || [];
    const addressToCompare = isEditing ? { ...addressState.address,
      ...formState.changes
    } : formState === null || formState === void 0 ? void 0 : formState.changes;
    const isAddressAlreadyExist = (_arrayList$map$some = arrayList.map(address => checkAddress(address, addressToCompare)).some(value => value)) !== null && _arrayList$map$some !== void 0 ? _arrayList$map$some : false;

    if (!isAddressAlreadyExist) {
      saveAddress();

      if (isGuestUser) {
        continueAsGuest();
      }

      if (!isGuestUser && !auth) {
        !isFromProductsList ? navigation.navigate('Business') : navigation.goBack();
      }

      return;
    }

    setAlertState({
      open: true,
      content: [t('ADDRESS_ALREADY_EXIST', 'The address already exists')]
    });
  };
  /**
   * Returns true when the user made no changes
   * @param {object} address
   */


  const checkAddress = (address, addressToCompare) => {
    const props = ['address', 'address_notes', 'zipcode', 'location', 'internal_number'];
    const values = [];
    props.forEach(prop => {
      if (addressToCompare[prop]) {
        if (prop === 'location') {
          var _address$prop, _addressToCompare$pro, _address$prop2, _addressToCompare$pro2;

          values.push(((_address$prop = address[prop]) === null || _address$prop === void 0 ? void 0 : _address$prop.lat) === ((_addressToCompare$pro = addressToCompare[prop]) === null || _addressToCompare$pro === void 0 ? void 0 : _addressToCompare$pro.lat) && ((_address$prop2 = address[prop]) === null || _address$prop2 === void 0 ? void 0 : _address$prop2.lng) === ((_addressToCompare$pro2 = addressToCompare[prop]) === null || _addressToCompare$pro2 === void 0 ? void 0 : _addressToCompare$pro2.lng));
        } else {
          values.push(address[prop] === addressToCompare[prop]);
        }
      } else {
        values.push(!address[prop]);
      }
    });
    return values.every(value => value);
  };

  const handleChangeAddress = (data, details) => {
    var _details$geometry;

    const addressSelected = {
      address: (data === null || data === void 0 ? void 0 : data.description) || (data === null || data === void 0 ? void 0 : data.address),
      location: details === null || details === void 0 ? void 0 : (_details$geometry = details.geometry) === null || _details$geometry === void 0 ? void 0 : _details$geometry.location,
      utc_offset: (details === null || details === void 0 ? void 0 : details.utc_offset) || null,
      map_data: {
        library: 'google',
        place_id: data.place_id
      },
      zip_code: (data === null || data === void 0 ? void 0 : data.zip_code) || null
    };
    updateChanges(addressSelected);
  };

  const handleAddressTag = tag => {
    setAddressTag(tag);
    handleChangeInput({
      target: {
        name: 'tag',
        value: tag
      }
    });
  };

  const handleToggleMap = () => {
    setToggleMap(!toggleMap);
  };

  useEffect(() => {
    if (orderState.loading && !addressesList && orderState.options.address && auth) {
      !isFromProductsList ? navigation.navigate('BottomTab') : navigation.navigate('Business');
    }
  }, [orderState.options.address]);
  useEffect(() => {
    if (alertState.open && (alertState === null || alertState === void 0 ? void 0 : alertState.key) !== 'ERROR_MAX_LIMIT_LOCATION') {
      alertState.content && showToast(ToastType.Error, alertState.content);
    }
  }, [alertState.content]);
  useEffect(() => {
    var _formState$result, _ref, _formState$changes$ad, _formState$changes5, _addressState$address5;

    if (!auth) {
      inputNames.forEach(field => {
        var _orderState$options, _orderState$options2;

        return setValue(field.name, (formState === null || formState === void 0 ? void 0 : formState.changes[field.name]) || (orderState === null || orderState === void 0 ? void 0 : (_orderState$options = orderState.options) === null || _orderState$options === void 0 ? void 0 : _orderState$options.address) && (orderState === null || orderState === void 0 ? void 0 : (_orderState$options2 = orderState.options) === null || _orderState$options2 === void 0 ? void 0 : _orderState$options2.address[field.name]) || '');
      });
      return;
    }

    if (!formState.loading && (_formState$result = formState.result) !== null && _formState$result !== void 0 && _formState$result.error) {
      var _formState$result2;

      setAlertState({
        open: true,
        content: ((_formState$result2 = formState.result) === null || _formState$result2 === void 0 ? void 0 : _formState$result2.result) || [t('ERROR', 'Error')]
      });
    }

    setValue('address', (_ref = (_formState$changes$ad = formState === null || formState === void 0 ? void 0 : (_formState$changes5 = formState.changes) === null || _formState$changes5 === void 0 ? void 0 : _formState$changes5.address) !== null && _formState$changes$ad !== void 0 ? _formState$changes$ad : (_addressState$address5 = addressState.address) === null || _addressState$address5 === void 0 ? void 0 : _addressState$address5.address) !== null && _ref !== void 0 ? _ref : '');

    if (!isEditing) {
      var _formState$changes6, _formState$changes7, _formState$changes8, _formState$changes9, _formState$changes10, _formState$changes11, _formState$changes11$, _firstLocationNoEdit$, _formState$changes12, _formState$changes12$, _firstLocationNoEdit$2;

      (formState === null || formState === void 0 ? void 0 : (_formState$changes6 = formState.changes) === null || _formState$changes6 === void 0 ? void 0 : _formState$changes6.address) && setLocationChange(formState === null || formState === void 0 ? void 0 : (_formState$changes7 = formState.changes) === null || _formState$changes7 === void 0 ? void 0 : _formState$changes7.location);

      if (formState !== null && formState !== void 0 && (_formState$changes8 = formState.changes) !== null && _formState$changes8 !== void 0 && _formState$changes8.address && (formState === null || formState === void 0 ? void 0 : (_formState$changes9 = formState.changes) === null || _formState$changes9 === void 0 ? void 0 : _formState$changes9.address) !== (firstLocationNoEdit === null || firstLocationNoEdit === void 0 ? void 0 : firstLocationNoEdit.address) && formState !== null && formState !== void 0 && (_formState$changes10 = formState.changes) !== null && _formState$changes10 !== void 0 && _formState$changes10.location && (formState === null || formState === void 0 ? void 0 : (_formState$changes11 = formState.changes) === null || _formState$changes11 === void 0 ? void 0 : (_formState$changes11$ = _formState$changes11.location) === null || _formState$changes11$ === void 0 ? void 0 : _formState$changes11$.lat) !== ((_firstLocationNoEdit$ = firstLocationNoEdit.value) === null || _firstLocationNoEdit$ === void 0 ? void 0 : _firstLocationNoEdit$.lat) && (formState === null || formState === void 0 ? void 0 : (_formState$changes12 = formState.changes) === null || _formState$changes12 === void 0 ? void 0 : (_formState$changes12$ = _formState$changes12.location) === null || _formState$changes12$ === void 0 ? void 0 : _formState$changes12$.lng) !== ((_firstLocationNoEdit$2 = firstLocationNoEdit.value) === null || _firstLocationNoEdit$2 === void 0 ? void 0 : _firstLocationNoEdit$2.lng)) {
        var _formState$changes13, _formState$changes14;

        setFirstLocationNoEdit({
          value: formState === null || formState === void 0 ? void 0 : (_formState$changes13 = formState.changes) === null || _formState$changes13 === void 0 ? void 0 : _formState$changes13.location,
          address: formState === null || formState === void 0 ? void 0 : (_formState$changes14 = formState.changes) === null || _formState$changes14 === void 0 ? void 0 : _formState$changes14.address
        });
      }
    }

    if (isEditing) {
      var _formState$changes15;

      if (formState !== null && formState !== void 0 && (_formState$changes15 = formState.changes) !== null && _formState$changes15 !== void 0 && _formState$changes15.location) {
        var _formState$changes16, _formState$changes16$, _formState$changes17, _formState$changes17$;

        const prevLocation = {
          lat: Math.trunc(locationChange.lat),
          lng: Math.trunc(locationChange.lng)
        };
        const newLocation = {
          lat: Math.trunc(formState === null || formState === void 0 ? void 0 : (_formState$changes16 = formState.changes) === null || _formState$changes16 === void 0 ? void 0 : (_formState$changes16$ = _formState$changes16.location) === null || _formState$changes16$ === void 0 ? void 0 : _formState$changes16$.lat),
          lng: Math.trunc(formState === null || formState === void 0 ? void 0 : (_formState$changes17 = formState.changes) === null || _formState$changes17 === void 0 ? void 0 : (_formState$changes17$ = _formState$changes17.location) === null || _formState$changes17$ === void 0 ? void 0 : _formState$changes17$.lng)
        };

        if (prevLocation.lat !== newLocation.lat && prevLocation.lng !== newLocation.lng) {
          var _formState$changes18;

          setLocationChange(formState === null || formState === void 0 ? void 0 : (_formState$changes18 = formState.changes) === null || _formState$changes18 === void 0 ? void 0 : _formState$changes18.location);
        }
      }
    }
  }, [formState]);
  useEffect(() => {
    var _formState$result3;

    if (formState !== null && formState !== void 0 && (_formState$result3 = formState.result) !== null && _formState$result3 !== void 0 && _formState$result3.result && !(formState !== null && formState !== void 0 && formState.loading)) {
      var _formState$result4;

      if ((_formState$result4 = formState.result) !== null && _formState$result4 !== void 0 && _formState$result4.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [formState.result]);
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);
  useEffect(() => {
    if (googleInput !== null && googleInput !== void 0 && googleInput.current) {
      var _googleInput$current, _formState$changes19;

      googleInput === null || googleInput === void 0 ? void 0 : (_googleInput$current = googleInput.current) === null || _googleInput$current === void 0 ? void 0 : _googleInput$current.setAddressText((address === null || address === void 0 ? void 0 : address.address) || ((_formState$changes19 = formState.changes) === null || _formState$changes19 === void 0 ? void 0 : _formState$changes19.address) || addressState.address.address || '');
    }
  }, []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShow(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShow(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    if (!orderState.loading && auth && !hasAddressDefault && isSignUpEffect) {
      navigation.navigate('BottomTab');
    }

    setIsSignUpEffect(true);
  }, [orderState.loading]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NavBar, {
    title: t('ADDRESS_FORM', 'Address Form'),
    titleAlign: 'center',
    onActionLeft: goToBack,
    showCall: false,
    paddingTop: 20
  }), /*#__PURE__*/React.createElement(AddressFormContainer, {
    style: {
      height: 600,
      overflow: 'scroll'
    }
  }, /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(FormInput, null, /*#__PURE__*/React.createElement(AutocompleteInput, null, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "address",
    defaultValue: (address === null || address === void 0 ? void 0 : address.address) || ((_formState$changes20 = formState.changes) === null || _formState$changes20 === void 0 ? void 0 : _formState$changes20.address) || addressState.address.address || '',
    rules: {
      required: isRequiredField && isRequiredField('address') ? t(`VALIDATION_ERROR_ADDRESS_REQUIRED`, `The field Address is required`) : null
    },
    render: () => {
      var _addressState$address6, _formState$changes21;

      return /*#__PURE__*/React.createElement(GooglePlacesAutocomplete, {
        placeholder: t('ADD_ADDRESS', 'Add a address'),
        onPress: (data, details) => {
          handleChangeAddress(data, details);
        },
        query: {
          key: googleMapsApiKey
        },
        fetchDetails: true,
        ref: googleInput,
        textInputProps: {
          onChangeText: text => {
            if (!isFirstTime) {
              handleChangeInput({
                target: {
                  name: 'address',
                  value: text
                }
              });
              setValue('address', text);
            }

            setIsFirstTime(false);
          },
          autoCorrect: false
        },
        onFail: error => setAlertState({
          open: true,
          content: getTraduction(error)
        }),
        styles: {
          listView: {
            position: "absolute",
            marginTop: 50,
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
            elevation: 2,
            borderWidth: 1,
            borderColor: "#ddd"
          },
          container: {
            zIndex: 100
          },
          textInput: {
            borderWidth: 1,
            borderRadius: 10,
            flexGrow: 1,
            fontSize: 15,
            paddingHorizontal: 20,
            minHeight: 50,
            fontFamily: 'Poppins-Regular',
            marginBottom: !isKeyboardShow && (addressState !== null && addressState !== void 0 && (_addressState$address6 = addressState.address) !== null && _addressState$address6 !== void 0 && _addressState$address6.location || formState !== null && formState !== void 0 && (_formState$changes21 = formState.changes) !== null && _formState$changes21 !== void 0 && _formState$changes21.location) ? 10 : 20
          }
        }
      });
    }
  })), !isKeyboardShow && ((addressState === null || addressState === void 0 ? void 0 : (_addressState$address7 = addressState.address) === null || _addressState$address7 === void 0 ? void 0 : _addressState$address7.location) || (formState === null || formState === void 0 ? void 0 : (_formState$changes22 = formState.changes) === null || _formState$changes22 === void 0 ? void 0 : _formState$changes22.location)) && /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: handleToggleMap,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(OText, {
    color: colors.primary,
    style: {
      textAlign: 'center'
    }
  }, t('VIEW_MAP', 'View map to modify the exact location'))), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "internal_number",
    rules: {
      required: isRequiredField && isRequiredField('internal_number') ? t(`VALIDATION_ERROR_INTERNAL_NUMBER_REQUIRED`, `The field internal number is required`) : null
    },
    defaultValue: (address === null || address === void 0 ? void 0 : address.internal_number) || ((_formState$changes23 = formState.changes) === null || _formState$changes23 === void 0 ? void 0 : _formState$changes23.internal_number) || addressState.address.internal_number || '',
    render: () => {
      var _formState$changes24;

      return /*#__PURE__*/React.createElement(OInput, {
        name: "internal_number",
        placeholder: t('INTERNAL_NUMBER', 'Internal number'),
        onChange: text => {
          handleChangeInput(text);
          setValue('internal_number', text);
        },
        value: (address === null || address === void 0 ? void 0 : address.internal_number) || ((_formState$changes24 = formState.changes) === null || _formState$changes24 === void 0 ? void 0 : _formState$changes24.internal_number) || addressState.address.internal_number || '',
        style: styles.inputsStyle
      });
    }
  }), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "zipcode",
    rules: {
      required: isRequiredField && isRequiredField('zipcode') ? t(`VALIDATION_ERROR_ZIP_CODE_REQUIRED`, `The field Zip Code is required`) : null
    },
    defaultValue: (address === null || address === void 0 ? void 0 : address.zipcode) || ((_formState$changes25 = formState.changes) === null || _formState$changes25 === void 0 ? void 0 : _formState$changes25.zipcode) || addressState.address.zipcode || '',
    render: () => {
      var _formState$changes26;

      return /*#__PURE__*/React.createElement(OInput, {
        name: "zipcode",
        placeholder: t('ZIP_CODE', 'Zip code'),
        onChange: text => {
          handleChangeInput(text);
          setValue('zipcode', text);
        },
        value: (address === null || address === void 0 ? void 0 : address.zipcode) || ((_formState$changes26 = formState.changes) === null || _formState$changes26 === void 0 ? void 0 : _formState$changes26.zipcode) || addressState.address.zipcode || '',
        style: styles.inputsStyle
      });
    }
  }), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "address_notes",
    rules: {
      required: isRequiredField && isRequiredField('address_notes') ? t(`VALIDATION_ERROR_ADDRESS_NOTES_REQUIRED`, `The field address notes is required`) : null
    },
    defaultValue: (address === null || address === void 0 ? void 0 : address.address_notes) || ((_formState$changes27 = formState.changes) === null || _formState$changes27 === void 0 ? void 0 : _formState$changes27.address_notes) || addressState.address.address_notes || '',
    render: () => {
      var _formState$changes28;

      return /*#__PURE__*/React.createElement(OInput, {
        name: "address_notes",
        placeholder: t('ADDRESS_NOTES', 'Address notes'),
        onChange: text => {
          handleChangeInput(text);
          setValue('address_notes', text);
        },
        value: (address === null || address === void 0 ? void 0 : address.address_notes) || ((_formState$changes28 = formState.changes) === null || _formState$changes28 === void 0 ? void 0 : _formState$changes28.address_notes) || addressState.address.address_notes || '',
        multiline: true,
        style: styles.textAreaStyles
      });
    }
  })), !isKeyboardShow && /*#__PURE__*/React.createElement(IconsContainer, null, tagsName.map(tag => /*#__PURE__*/React.createElement(TouchableOpacity, {
    key: tag.value,
    onPress: () => handleAddressTag(tag.value)
  }, /*#__PURE__*/React.createElement(View, {
    style: { ...styles.iconContainer,
      backgroundColor: addressTag === tag.value ? colors.primary : colors.backgroundGray,
      borderColor: addressTag === tag.value ? colors.primary : colors.backgroundGray
    }
  }, /*#__PURE__*/React.createElement(MaterialIcon, {
    name: tag.icon,
    size: 40,
    style: { ...styles.icons
    }
  })))))), /*#__PURE__*/React.createElement(View, null, Object.keys(formState === null || formState === void 0 ? void 0 : formState.changes).length > 0 ? /*#__PURE__*/React.createElement(OButton, {
    text: !formState.loading ? isEditing || !auth && (_orderState$options3 = orderState.options) !== null && _orderState$options3 !== void 0 && (_orderState$options3$ = _orderState$options3.address) !== null && _orderState$options3$ !== void 0 && _orderState$options3$.address ? t('UPDATE', 'Update') : t('SAVE', 'Save') : t('LOADING', 'Loading'),
    imgRightSrc: "",
    onClick: handleSubmit(onSubmit),
    textStyle: {
      color: colors.white
    },
    isDisabled: formState.loading
  }) : /*#__PURE__*/React.createElement(OButton, {
    text: t('CANCEL', 'Cancel'),
    style: {
      backgroundColor: colors.white
    },
    onClick: () => navigation.goBack()
  })), /*#__PURE__*/React.createElement(OModal, {
    open: toggleMap,
    onClose: () => handleToggleMap(),
    entireModal: true,
    customClose: true
  }, locationChange && /*#__PURE__*/React.createElement(GoogleMapContainer, null, /*#__PURE__*/React.createElement(GoogleMap, {
    location: locationChange,
    handleChangeAddressMap: handleChangeAddress,
    maxLimitLocation: maxLimitLocation,
    saveLocation: saveMapLocation,
    setSaveLocation: setSaveMapLocation,
    handleToggleMap: handleToggleMap
  })), /*#__PURE__*/React.createElement(OButton, {
    text: t('SAVE', 'Save'),
    textStyle: {
      color: colors.white
    },
    imgRightSrc: null,
    style: {
      marginHorizontal: 30,
      marginBottom: 10
    },
    onClick: () => setSaveMapLocation(true)
  })), /*#__PURE__*/React.createElement(Spinner, {
    visible: saveMapLocation
  })));
};

const styles = StyleSheet.create({
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 5
  },
  icons: {
    borderRadius: 20,
    color: colors.white
  },
  inputsStyle: {
    borderColor: colors.secundaryContrast,
    borderRadius: 10,
    marginBottom: 20,
    height: 50,
    maxHeight: 50,
    minHeight: 50
  },
  textAreaStyles: {
    borderColor: colors.secundaryContrast,
    borderRadius: 10,
    marginBottom: 20,
    height: 150,
    maxHeight: 150,
    textAlignVertical: 'top',
    alignItems: 'flex-start'
  }
});
export const AddressForm = props => {
  const addressFormProps = { ...props,
    UIComponent: AddressFormUI
  };
  return /*#__PURE__*/React.createElement(AddressFormController, addressFormProps);
};
//# sourceMappingURL=index.js.map