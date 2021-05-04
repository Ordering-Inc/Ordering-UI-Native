import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors } from '../../theme';
import { OInput, OButton } from '../shared';
import { useLanguage } from 'ordering-components/native';
import Icon from 'react-native-vector-icons/Feather';
export const SearchBar = props => {
  const {
    searchValue,
    placeholder,
    onSearch,
    onCancel,
    lazyLoad,
    isCancelButtonShow,
    isCancelXButtonShow,
    noBorderShow,
    borderStyle
  } = props;
  const [, t] = useLanguage();

  const handleClear = () => {
    onSearch('');
  };

  let timeout = null;

  const onChangeSearch = e => {
    if (!lazyLoad) {
      onSearch(e);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        onSearch(e);
      }, 750);
    }
  };

  return /*#__PURE__*/React.createElement(View, {
    style: [styles.container, !noBorderShow && (borderStyle || styles.borderStyle)]
  }, /*#__PURE__*/React.createElement(OInput, {
    value: searchValue,
    onChange: onChangeSearch,
    style: styles.inputStyle,
    placeholder: placeholder,
    vertorIcon: "search",
    vectorIconColor: colors.disabled
  }), isCancelButtonShow && /*#__PURE__*/React.createElement(OButton, {
    imgRightSrc: "",
    text: t('CANCEL', 'Cancel'),
    bgColor: "transparent",
    borderColor: colors.lightGray,
    style: styles.buttonStyle,
    onClick: onCancel || handleClear
  }), isCancelXButtonShow && /*#__PURE__*/React.createElement(TouchableOpacity, {
    onPress: onCancel || handleClear
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x-circle",
    size: 30,
    style: {
      marginRight: 5
    }
  })));
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 1
  },
  borderStyle: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10
  },
  inputStyle: {
    flex: 1
  },
  buttonStyle: {
    maxHeight: 40,
    paddingRight: 5,
    paddingLeft: 5
  }
});
//# sourceMappingURL=index.js.map