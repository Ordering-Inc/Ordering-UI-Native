function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UDContainer, UDHeader, UDInfo } from './styles';
import { UserFormDetails as UserFormController, useLanguage, useSession } from 'ordering-components/native';
import { OText } from '../shared';
import { colors } from '../../theme';
import { UserFormDetailsUI } from '../UserFormDetails';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const UserDetailsUI = props => {
  var _formState$result;

  const {
    isEdit,
    formState,
    cleanFormState,
    cartStatus,
    toggleIsEdit,
    validationFields,
    isUserDetailsEdit,
    phoneUpdate,
    togglePhoneUpdate
  } = props;
  const [, t] = useLanguage();
  const [{
    user
  }] = useSession();
  const userData = props.userData || !formState.result.error && ((_formState$result = formState.result) === null || _formState$result === void 0 ? void 0 : _formState$result.result) || user;
  useEffect(() => {
    if (isUserDetailsEdit) {
      !isEdit && toggleIsEdit();
    }
  }, [isUserDetailsEdit]);

  const toggleEditState = () => {
    toggleIsEdit();
    cleanFormState({
      changes: {}
    });
  };

  useEffect(() => {
    if (user !== null && user !== void 0 && user.cellphone && !(user !== null && user !== void 0 && user.country_phone_code)) {
      togglePhoneUpdate(true);
    } else {
      togglePhoneUpdate(false);
    }
  }, [user === null || user === void 0 ? void 0 : user.country_phone_code]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, (validationFields.loading || formState.loading) && /*#__PURE__*/React.createElement(Placeholder, {
    Animation: Fade
  }, /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 20,
    width: 70
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 60
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 60
  }), /*#__PURE__*/React.createElement(PlaceholderLine, {
    height: 15,
    width: 80,
    style: {
      marginBottom: 20
    }
  })), !(validationFields.loading || formState.loading) && /*#__PURE__*/React.createElement(UDContainer, null, /*#__PURE__*/React.createElement(UDHeader, null, /*#__PURE__*/React.createElement(OText, {
    size: 20
  }, t('CUSTOMER_DETAILS', 'Customer Details')), cartStatus !== 2 && (!isEdit ? /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "pencil-outline",
    size: 28,
    color: colors.editColor,
    style: {
      marginBottom: 10,
      marginLeft: 5
    },
    onPress: () => toggleIsEdit()
  }) : /*#__PURE__*/React.createElement(MaterialIcon, {
    name: "cancel",
    color: colors.cancelColor,
    size: 24,
    style: {
      marginBottom: 5,
      marginLeft: 5
    },
    onPress: () => toggleEditState()
  }))), !isEdit ? /*#__PURE__*/React.createElement(UDInfo, null, /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('NAME', 'Name'), ":", ' '), userData === null || userData === void 0 ? void 0 : userData.name, " ", userData === null || userData === void 0 ? void 0 : userData.middle_name, " ", userData === null || userData === void 0 ? void 0 : userData.lastname, " ", userData === null || userData === void 0 ? void 0 : userData.second_lastname), /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('EMAIL', 'Email'), ":", ' '), userData === null || userData === void 0 ? void 0 : userData.email), ((userData === null || userData === void 0 ? void 0 : userData.cellphone) || (user === null || user === void 0 ? void 0 : user.cellphone)) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OText, {
    size: 16
  }, /*#__PURE__*/React.createElement(OText, {
    size: 18,
    weight: "bold"
  }, t('CELLPHONE', 'Cellphone'), ":", ' '), (userData === null || userData === void 0 ? void 0 : userData.country_phone_code) && `+${userData === null || userData === void 0 ? void 0 : userData.country_phone_code} `, userData === null || userData === void 0 ? void 0 : userData.cellphone), phoneUpdate && /*#__PURE__*/React.createElement(OText, {
    color: colors.error,
    style: {
      textAlign: 'center'
    }
  }, t('NECESSARY_UPDATE_COUNTRY_PHONE_CODE', 'It is necessary to update your phone number')))) : /*#__PURE__*/React.createElement(UserFormDetailsUI, _extends({}, props, {
    phoneUpdate: phoneUpdate,
    togglePhoneUpdate: togglePhoneUpdate
  }))));
};

export const UserDetails = props => {
  const userDetailsProps = { ...props,
    UIComponent: UserDetailsUI
  };
  return /*#__PURE__*/React.createElement(UserFormController, userDetailsProps);
};
//# sourceMappingURL=index.js.map