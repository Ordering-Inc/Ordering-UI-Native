import React from 'react';
import { LanguageSelector as LanguageSelectorController, useOrder } from 'ordering-components/native';
import { Platform, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Container } from './styles';
import { colors } from '../../theme';
import AntIcon from 'react-native-vector-icons/AntDesign';

const LanguageSelectorUI = props => {
  var _languagesState$langu;

  const [orderState] = useOrder();
  const {
    languagesState,
    currentLanguage,
    handleChangeLanguage
  } = props;

  const _languages = languagesState === null || languagesState === void 0 ? void 0 : (_languagesState$langu = languagesState.languages) === null || _languagesState$langu === void 0 ? void 0 : _languagesState$langu.map(language => {
    return {
      value: language === null || language === void 0 ? void 0 : language.code,
      label: language === null || language === void 0 ? void 0 : language.name,
      inputLabel: language === null || language === void 0 ? void 0 : language.code.toUpperCase()
    };
  });

  _languages && _languages.sort((a, b) => a.content > b.content ? 1 : b.content > a.content ? -1 : 0);
  return /*#__PURE__*/React.createElement(Container, null, (languagesState === null || languagesState === void 0 ? void 0 : languagesState.languages) && /*#__PURE__*/React.createElement(RNPickerSelect, {
    onValueChange: handleChangeLanguage,
    items: _languages || [],
    value: currentLanguage,
    style: pickerStyle,
    useNativeAndroidPickerStyle: false,
    placeholder: {},
    Icon: () => /*#__PURE__*/React.createElement(AntIcon, {
      name: "caretdown",
      style: pickerStyle.icon
    }),
    disabled: orderState.loading
  }));
};

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    width: 60,
    borderWidth: 1,
    borderColor: colors.secundaryContrast,
    borderRadius: 20,
    paddingHorizontal: 10
  },
  inputIOS: {
    color: colors.secundaryContrast,
    paddingEnd: 20,
    height: 30,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.backgroundGray
  },
  icon: {
    width: 10,
    height: 10,
    top: Platform.OS === 'ios' ? 8 : 17,
    right: Platform.OS === 'ios' ? 7 : 10,
    position: 'absolute'
  },
  placeholder: {
    color: colors.secundaryContrast
  }
});
export const LanguageSelector = props => {
  const LanguageProps = { ...props,
    UIComponent: LanguageSelectorUI
  };
  return /*#__PURE__*/React.createElement(LanguageSelectorController, LanguageProps);
};
//# sourceMappingURL=index.js.map