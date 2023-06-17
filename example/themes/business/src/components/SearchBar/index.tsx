import React, { useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OInput, OButton, OIconButton } from '../shared';

export const SearchBar = (props: any) => {
  const {
    searchValue,
    placeholder,
    onSearch,
    onCancel,
    lazyLoad,
    isCancelButtonShow,
    isCancelXButtonShow,
    noBorderShow,
    borderStyle,
    containerStyle
  } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const inputRef = useRef<any>();

  const handleClear = () => {
    onSearch('');
  };

  const handleActiveInput = () => {
    inputRef?.current?.focus?.();
  };

  let timeout: null | any = null;
  const onChangeSearch = (e: any) => {
    if (!lazyLoad) {
      onSearch(e);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        onSearch(e);
      }, 1000);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: 225,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 7.6,
      backgroundColor: theme.colors.inputDisabled,
    },
    borderStyle: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 10,
    },
    inputStyle: {
      borderRadius: 7.6,
      backgroundColor: theme.colors.transparent,
      borderColor: theme.colors.transparent,
      borderWidth: 0,
    },
    buttonStyle: {
      maxHeight: 20,
    },
  });

  return (
    <View style={{ ...styles.container, ...containerStyle}}>
      <OInput
        forwardRef={inputRef}
        value={searchValue}
        onChange={onChangeSearch}
        style={styles.inputStyle}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.arrowColor}
        selectionColor={theme.colors.primary}
        color={theme.colors.textGray}
        returnKeyType="done"
        blurOnSubmit
      />

      {isCancelButtonShow && (
        <OButton
          imgRightSrc=""
          text={t('CANCEL', 'Cancel')}
          bgColor={theme.colors.clear}
          borderColor={theme.colors.lightGray}
          style={styles.buttonStyle}
          onClick={onCancel || handleClear}
        />
      )}

      {isCancelXButtonShow && (
        <TouchableOpacity onPress={onCancel || handleClear}>
          <Icon name="x-circle" size={22} color={theme.colors.unselectText} />
        </TouchableOpacity>
      )}

      <OIconButton
        icon={theme.images.general.search}
        borderColor={theme.colors.clear}
        iconStyle={{ width: 25, height: 25 }}
        style={{ maxWidth: 40 }}
        onClick={() => {
          handleActiveInput();
        }}
      />
    </View>
  );
};
