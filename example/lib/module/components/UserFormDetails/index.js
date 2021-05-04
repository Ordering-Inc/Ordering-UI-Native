import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSession, useLanguage } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';
import { UDForm, UDLoader, UDWrapper, WrapperPhone } from './styles';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { OText, OButton, OInput } from '../shared';
import { colors } from '../../theme';
import { IMAGES } from '../../config/constants';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { sortInputFields } from '../../utils';
export const UserFormDetailsUI = props => {
  var _validationFields$fie, _validationFields$fie2, _validationFields$fie3, _validationFields$fie4, _validationFields$fie11, _validationFields$fie12;

  const {
    isEdit,
    formState,
    showField,
    cleanFormState,
    onCloseProfile,
    isRequiredField,
    validationFields,
    handleChangeInput,
    handleButtonUpdateClick,
    phoneUpdate
  } = props;
  const [, t] = useLanguage();
  const {
    showToast
  } = useToast();
  const {
    handleSubmit,
    control,
    errors,
    setValue
  } = useForm();
  const [{
    user
  }] = useSession();
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });
  const showInputPhoneNumber = (_validationFields$fie = validationFields === null || validationFields === void 0 ? void 0 : (_validationFields$fie2 = validationFields.fields) === null || _validationFields$fie2 === void 0 ? void 0 : (_validationFields$fie3 = _validationFields$fie2.checkout) === null || _validationFields$fie3 === void 0 ? void 0 : (_validationFields$fie4 = _validationFields$fie3.cellphone) === null || _validationFields$fie4 === void 0 ? void 0 : _validationFields$fie4.enabled) !== null && _validationFields$fie !== void 0 ? _validationFields$fie : false;

  const getInputRules = field => {
    const rules = {
      required: isRequiredField(field.code) ? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field.name} is required`).replace('_attribute_', t(field.name, field.code)) : null
    };

    if (field.code && field.code === 'email') {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email'))
      };
    }

    return rules;
  };

  const setUserCellPhone = (isEdit = false) => {
    if (userPhoneNumber && !userPhoneNumber.includes('null') && !isEdit) {
      setUserPhoneNumber(userPhoneNumber);
      return;
    }

    if (user !== null && user !== void 0 && user.cellphone) {
      let phone = null;

      if (user !== null && user !== void 0 && user.country_phone_code) {
        phone = `+${user === null || user === void 0 ? void 0 : user.country_phone_code} ${user === null || user === void 0 ? void 0 : user.cellphone}`;
      } else {
        phone = user === null || user === void 0 ? void 0 : user.cellphone;
      }

      setUserPhoneNumber(phone);
      setPhoneInputData({ ...phoneInputData,
        phone: {
          country_phone_code: (user === null || user === void 0 ? void 0 : user.country_phone_code) || null,
          cellphone: (user === null || user === void 0 ? void 0 : user.cellphone) || null
        }
      });
      return;
    }

    setUserPhoneNumber((user === null || user === void 0 ? void 0 : user.cellphone) || '');
  };

  const onSubmit = () => {
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (Object.keys(formState.changes).length > 0) {
      var _formState$changes, _validationFields$fie5, _validationFields$fie6, _validationFields$fie7, _validationFields$fie8, _validationFields$fie9, _validationFields$fie10;

      if (((_formState$changes = formState.changes) === null || _formState$changes === void 0 ? void 0 : _formState$changes.cellphone) === null && validationFields !== null && validationFields !== void 0 && (_validationFields$fie5 = validationFields.fields) !== null && _validationFields$fie5 !== void 0 && (_validationFields$fie6 = _validationFields$fie5.checkout) !== null && _validationFields$fie6 !== void 0 && (_validationFields$fie7 = _validationFields$fie6.cellphone) !== null && _validationFields$fie7 !== void 0 && _validationFields$fie7.enabled && validationFields !== null && validationFields !== void 0 && (_validationFields$fie8 = validationFields.fields) !== null && _validationFields$fie8 !== void 0 && (_validationFields$fie9 = _validationFields$fie8.checkout) !== null && _validationFields$fie9 !== void 0 && (_validationFields$fie10 = _validationFields$fie9.cellphone) !== null && _validationFields$fie10 !== void 0 && _validationFields$fie10.required) {
        showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.'));
        return;
      }

      let changes = null;

      if (user !== null && user !== void 0 && user.cellphone && !userPhoneNumber) {
        changes = {
          country_phone_code: '',
          cellphone: ''
        };
      }

      handleButtonUpdateClick(changes);
    }
  };

  const handleChangePhoneNumber = number => {
    setPhoneInputData(number);
    let phoneNumber = {
      country_phone_code: {
        name: 'country_phone_code',
        value: number.phone.country_phone_code
      },
      cellphone: {
        name: 'cellphone',
        value: number.phone.cellphone
      }
    };
    handleChangeInput(phoneNumber, true);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors);

      if (phoneInputData.error) {
        list.push({
          message: phoneInputData.error
        });
      }

      let stringError = '';
      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);
  useEffect(() => {
    var _formState$result;

    if (!(formState !== null && formState !== void 0 && formState.loading) && formState !== null && formState !== void 0 && (_formState$result = formState.result) !== null && _formState$result !== void 0 && _formState$result.error) {
      var _formState$result2, _formState$result3;

      ((_formState$result2 = formState.result) === null || _formState$result2 === void 0 ? void 0 : _formState$result2.result) && showToast(ToastType.Error, (_formState$result3 = formState.result) === null || _formState$result3 === void 0 ? void 0 : _formState$result3.result[0]);
    }
  }, [formState === null || formState === void 0 ? void 0 : formState.loading]);
  useEffect(() => {
    if (!isEdit && onCloseProfile) {
      onCloseProfile();
    }

    if ((user || !isEdit) && !(formState !== null && formState !== void 0 && formState.loading)) {
      setUserCellPhone();

      if (!isEdit && !(formState !== null && formState !== void 0 && formState.loading)) {
        cleanFormState && cleanFormState({
          changes: {}
        });
        setUserCellPhone(true);
      }
    }
  }, [user, isEdit]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(UDForm, null, !(validationFields !== null && validationFields !== void 0 && validationFields.loading) && sortInputFields({
    values: (_validationFields$fie11 = validationFields.fields) === null || _validationFields$fie11 === void 0 ? void 0 : _validationFields$fie11.checkout
  }).length > 0 && /*#__PURE__*/React.createElement(UDWrapper, null, sortInputFields({
    values: (_validationFields$fie12 = validationFields.fields) === null || _validationFields$fie12 === void 0 ? void 0 : _validationFields$fie12.checkout
  }).map(field => showField && showField(field.code) && /*#__PURE__*/React.createElement(React.Fragment, {
    key: field.id
  }, /*#__PURE__*/React.createElement(Controller, {
    key: field.id,
    control: control,
    render: () => {
      var _ref, _formState$changes$fi;

      return /*#__PURE__*/React.createElement(OInput, {
        name: field.code,
        placeholder: t(field.code.toUpperCase(), field === null || field === void 0 ? void 0 : field.name),
        style: styles.inputStyle,
        icon: field.code === 'email' ? IMAGES.email : IMAGES.user,
        autoCapitalize: field.code === 'email' ? 'none' : 'sentences',
        isDisabled: !isEdit,
        value: (_ref = (_formState$changes$fi = formState === null || formState === void 0 ? void 0 : formState.changes[field.code]) !== null && _formState$changes$fi !== void 0 ? _formState$changes$fi : user && user[field.code]) !== null && _ref !== void 0 ? _ref : '',
        onChange: val => {
          field.code !== 'email' ? setValue(field.code, val.target.value) : setValue(field.code, val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
          field.code !== 'email' ? handleChangeInput(val) : handleChangeInput({
            target: {
              name: 'email',
              value: val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, '')
            }
          });
        },
        autoCorrect: field.code === 'email' && false,
        type: field.code === 'email' ? 'email-address' : 'default',
        isSecured: field.code === 'email'
      });
    },
    name: field.code,
    rules: getInputRules(field),
    defaultValue: user && user[field.code]
  }))), !!showInputPhoneNumber && /*#__PURE__*/React.createElement(WrapperPhone, null, /*#__PURE__*/React.createElement(PhoneInputNumber, {
    data: phoneInputData,
    handleData: val => handleChangePhoneNumber(val),
    defaultValue: phoneUpdate ? '' : user === null || user === void 0 ? void 0 : user.cellphone
  }), phoneUpdate && /*#__PURE__*/React.createElement(OText, {
    color: colors.error,
    style: {
      marginHorizontal: 10,
      textAlign: 'center'
    }
  }, t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone'), ": ", user === null || user === void 0 ? void 0 : user.cellphone))), (validationFields === null || validationFields === void 0 ? void 0 : validationFields.loading) && /*#__PURE__*/React.createElement(UDLoader, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, "Loading..."))), (formState && Object.keys(formState === null || formState === void 0 ? void 0 : formState.changes).length > 0 && isEdit || (formState === null || formState === void 0 ? void 0 : formState.loading)) && /*#__PURE__*/React.createElement(OButton, {
    text: formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update'),
    bgColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    borderColor: colors.primary,
    isDisabled: formState.loading,
    imgRightSrc: null,
    onClick: handleSubmit(onSubmit)
  }));
};
const styles = StyleSheet.create({
  btnOutline: {
    backgroundColor: '#FFF',
    color: colors.primary
  },
  inputStyle: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.disabled
  }
});
//# sourceMappingURL=index.js.map