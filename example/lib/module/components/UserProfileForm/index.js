import React, { useEffect, useState } from 'react';
import { UserFormDetails as UserProfileController, useSession, useLanguage } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View } from 'react-native';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { sortInputFields } from '../../utils';
import { AddressList } from '../AddressList';
import { LogoutButton } from '../LogoutButton';
import { LanguageSelector } from '../LanguageSelector';
import { PhoneInputNumber } from '../PhoneInputNumber';
import { OIcon, OIconButton, OInput, OText, OButton } from '../../components/shared';
import { CenterView, UserData, Names, EditButton, Actions, WrapperPhone } from './styles';

const ProfileUI = props => {
  var _validationFields$fie7;

  const {
    navigation,
    isEdit,
    formState,
    validationFields,
    showField,
    isRequiredField,
    toggleIsEdit,
    cleanFormState,
    handleChangeInput,
    handleButtonUpdateClick
  } = props;
  const [{
    user
  }] = useSession();
  const [, t] = useLanguage();
  const {
    showToast
  } = useToast();
  const {
    handleSubmit,
    errors,
    setValue,
    control
  } = useForm();
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null
    }
  });
  const [phoneUpdate, setPhoneUpdate] = useState(false);

  const onSubmit = values => {
    var _validationFields$fie, _validationFields$fie2, _validationFields$fie3, _validationFields$fie4, _validationFields$fie5, _validationFields$fie6;

    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }

    if (formState.changes.cellphone === '' && validationFields !== null && validationFields !== void 0 && (_validationFields$fie = validationFields.fields) !== null && _validationFields$fie !== void 0 && (_validationFields$fie2 = _validationFields$fie.checkout) !== null && _validationFields$fie2 !== void 0 && (_validationFields$fie3 = _validationFields$fie2.cellphone) !== null && _validationFields$fie3 !== void 0 && _validationFields$fie3.enabled && validationFields !== null && validationFields !== void 0 && (_validationFields$fie4 = validationFields.fields) !== null && _validationFields$fie4 !== void 0 && (_validationFields$fie5 = _validationFields$fie4.checkout) !== null && _validationFields$fie5 !== void 0 && (_validationFields$fie6 = _validationFields$fie5.cellphone) !== null && _validationFields$fie6 !== void 0 && _validationFields$fie6.required) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_MOBILE_PHONE_REQUIRED', 'The field Phone Number is required.'));
      return;
    }

    if (formState.changes.password && formState.changes.password.length < 8) {
      showToast(ToastType.Error, t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.').replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8));
      return;
    }

    handleButtonUpdateClick(values);
  };

  const handleImagePicker = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 200,
      maxWidth: 200,
      includeBase64: true
    }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response.uri) {
          const url = `data:${response.type};base64,${response.base64}`;
          handleButtonUpdateClick(null, true, url);
        } else {
          showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
        }
      }
    });
  };

  const handleCancelEdit = () => {
    cleanFormState({
      changes: {}
    });
    toggleIsEdit();
    setPhoneInputData({
      error: '',
      phone: {
        country_phone_code: null,
        cellphone: null
      }
    });
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

  useEffect(() => {
    if (formState.result.result && !formState.loading) {
      var _formState$result;

      if ((_formState$result = formState.result) !== null && _formState$result !== void 0 && _formState$result.error) {
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
    if (user !== null && user !== void 0 && user.cellphone && !(user !== null && user !== void 0 && user.country_phone_code)) {
      setPhoneUpdate(true);
    } else {
      setPhoneUpdate(false);
    }
  }, [user === null || user === void 0 ? void 0 : user.country_phone_code]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Actions, null, /*#__PURE__*/React.createElement(LanguageSelector, null), /*#__PURE__*/React.createElement(LogoutButton, null)), /*#__PURE__*/React.createElement(CenterView, null, /*#__PURE__*/React.createElement(OIcon, {
    url: user === null || user === void 0 ? void 0 : user.photo,
    width: 100,
    height: 100,
    style: {
      borderRadius: 12
    }
  }), /*#__PURE__*/React.createElement(OIconButton, {
    icon: IMAGES.camera,
    borderColor: colors.clear,
    iconStyle: {
      width: 30,
      height: 30
    },
    style: {
      maxWidth: 40
    },
    onClick: () => handleImagePicker()
  })), /*#__PURE__*/React.createElement(Spinner, {
    visible: formState === null || formState === void 0 ? void 0 : formState.loading
  }), !isEdit ? /*#__PURE__*/React.createElement(UserData, null, /*#__PURE__*/React.createElement(Names, null, /*#__PURE__*/React.createElement(OText, {
    space: true
  }, user === null || user === void 0 ? void 0 : user.name), /*#__PURE__*/React.createElement(OText, null, user === null || user === void 0 ? void 0 : user.lastname)), (!!(user !== null && user !== void 0 && user.middle_name) || !!(user !== null && user !== void 0 && user.second_lastname)) && /*#__PURE__*/React.createElement(Names, null, /*#__PURE__*/React.createElement(OText, {
    space: true
  }, user === null || user === void 0 ? void 0 : user.middle_name), /*#__PURE__*/React.createElement(OText, null, user === null || user === void 0 ? void 0 : user.second_lastname)), /*#__PURE__*/React.createElement(OText, null, user === null || user === void 0 ? void 0 : user.email), !!(user !== null && user !== void 0 && user.cellphone) && /*#__PURE__*/React.createElement(OText, null, user === null || user === void 0 ? void 0 : user.cellphone), !!phoneUpdate && /*#__PURE__*/React.createElement(OText, {
    color: colors.error
  }, t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number'))) : /*#__PURE__*/React.createElement(View, {
    style: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, sortInputFields({
    values: (_validationFields$fie7 = validationFields.fields) === null || _validationFields$fie7 === void 0 ? void 0 : _validationFields$fie7.checkout
  }).map(field => showField && showField(field.code) && /*#__PURE__*/React.createElement(Controller, {
    key: field.id,
    control: control,
    render: () => /*#__PURE__*/React.createElement(OInput, {
      key: field.id,
      name: field.code,
      placeholder: t(field.code.toUpperCase(), field === null || field === void 0 ? void 0 : field.name),
      icon: field.code === 'email' ? IMAGES.email : IMAGES.user,
      borderColor: colors.whiteGray,
      style: styles.inputbox,
      onChange: val => {
        field.code !== 'email' ? setValue(field.code, val.target.value) : setValue(field.code, val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
        field.code !== 'email' ? handleChangeInput(val) : handleChangeInput({
          target: {
            name: 'email',
            value: val.target.value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, '')
          }
        });
      },
      value: user && user[field.code],
      autoCapitalize: field.code === 'email' ? 'none' : 'sentences',
      autoCorrect: field.code === 'email' && false,
      type: field.code === 'email' ? 'email-address' : '',
      isSecured: field.code === 'email'
    }),
    name: field.code,
    defaultValue: user && user[field.code],
    rules: getInputRules(field)
  })), /*#__PURE__*/React.createElement(WrapperPhone, null, /*#__PURE__*/React.createElement(PhoneInputNumber, {
    data: phoneInputData,
    handleData: val => handleChangePhoneNumber(val),
    defaultValue: phoneUpdate ? '' : user === null || user === void 0 ? void 0 : user.cellphone
  }), phoneUpdate && /*#__PURE__*/React.createElement(OText, {
    color: colors.error,
    style: {
      marginHorizontal: 10,
      textAlign: 'center'
    }
  }, t('YOUR_PREVIOUS_CELLPHONE', 'Your previous cellphone'), ": ", user === null || user === void 0 ? void 0 : user.cellphone)), /*#__PURE__*/React.createElement(OInput, {
    name: "password",
    isSecured: true,
    placeholder: t('PASSWORD', 'Password'),
    icon: IMAGES.lock,
    borderColor: colors.whiteGray,
    style: styles.inputbox,
    onChange: val => {
      handleChangeInput(val);
    }
  })), !validationFields.loading && /*#__PURE__*/React.createElement(EditButton, null, !isEdit ? /*#__PURE__*/React.createElement(OButton, {
    text: t('EDIT', 'Edit'),
    bgColor: colors.white,
    borderColor: colors.primary,
    isDisabled: formState.loading,
    imgRightSrc: null,
    textStyle: {
      fontSize: 20
    },
    style: { ...styles.editButton
    },
    onClick: toggleIsEdit
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    text: t('CANCEL', 'Cancel'),
    bgColor: colors.white,
    borderColor: colors.primary,
    isDisabled: formState.loading,
    imgRightSrc: null,
    style: { ...styles.editButton
    },
    onClick: handleCancelEdit
  })), (formState && Object.keys(formState === null || formState === void 0 ? void 0 : formState.changes).length > 0 && isEdit || (formState === null || formState === void 0 ? void 0 : formState.loading)) && /*#__PURE__*/React.createElement(View, {
    style: {
      flex: 1,
      marginLeft: 5
    }
  }, /*#__PURE__*/React.createElement(OButton, {
    text: formState.loading ? t('UPDATING', 'Updating...') : t('UPDATE', 'Update'),
    bgColor: colors.primary,
    textStyle: {
      color: formState.loading ? 'black' : 'white'
    },
    borderColor: colors.primary,
    isDisabled: formState.loading,
    imgRightSrc: null,
    style: { ...styles.editButton
    },
    onClick: handleSubmit(onSubmit)
  })))), (user === null || user === void 0 ? void 0 : user.id) && /*#__PURE__*/React.createElement(AddressList, {
    nopadding: true,
    isFromProfile: true,
    userId: user.id,
    navigation: navigation
  }));
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: colors.whiteGray,
    height: 50,
    borderRadius: 25,
    marginTop: 16
  },
  inputbox: {
    marginVertical: 8,
    width: '90%'
  },
  editButton: {
    // flex:0,
    borderRadius: 25,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 1,
    color: colors.primary,
    // width: 100,
    // height: 50,
    marginVertical: 8 // flex: 1,

  }
});
export const UserProfileForm = props => {
  const profileProps = { ...props,
    UIComponent: ProfileUI
  };
  return /*#__PURE__*/React.createElement(UserProfileController, profileProps);
};
//# sourceMappingURL=index.js.map