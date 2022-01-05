import React, { useRef } from 'react'
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OInput, OButton } from '../shared'
import { useLanguage } from 'ordering-components/native'
import Icon from 'react-native-vector-icons/Feather'

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
    inputWrapStyle
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 1,
    },
    borderStyle: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      borderRadius: 10,
    },
    inputStyle: {
      flex: 1,
    },
    buttonStyle: {
      maxHeight: 30,
      paddingRight: 5,
      paddingLeft: 5,
    }
  })

  const [, t] = useLanguage()
  const inputRef = useRef<TextInput>();

  const handleClear = () => {
    if (inputRef !== undefined && inputRef.current) {
      inputRef?.current?.clear();
    }
    onSearch('')
  }

  let timeout: null | any = null
  const onChangeSearch = (e: any) => {
    if (!lazyLoad) {
      onSearch(e)
    } else {
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        onSearch(e)
      }, 750)
    }
  }

  return (
    <View style={[styles.container, !noBorderShow && (borderStyle || styles.borderStyle)]}>
      <OInput
        value={searchValue}
        onChange={onChangeSearch}
        style={{ ...styles.inputStyle, ...inputWrapStyle }}
        placeholder={placeholder}
        icon={theme.images.general.search}
        iconStyle={{ width: 16 }}
        returnKeyType='done'
        forwardRef={inputRef}
      />
      {isCancelButtonShow && (
        <OButton
          imgRightSrc=''
          text={t('CANCEL', 'Cancel')}
          bgColor='transparent'
          borderColor={theme.colors.lightGray}
          style={styles.buttonStyle}
          onClick={onCancel || handleClear}
        />
      )}
      {isCancelXButtonShow && (
        <TouchableOpacity
          onPress={onCancel || handleClear}
        >
          <Icon
            name='x-circle'
            size={16}
            color={theme.colors.disabled}
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}
