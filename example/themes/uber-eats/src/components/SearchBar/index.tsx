import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OInput, OButton } from '../../../../../components/shared'
import { useLanguage } from 'ordering-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'

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
    borderStyle
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
      borderWidth: 1,
      borderRadius: 0,
      borderColor: theme.colors.gray,
    },
    buttonStyle: {
      maxHeight: 40,
      paddingRight: 5,
      paddingLeft: 5,
    },
    cancelBtnStyle: {
      position: 'absolute',
      right: 10
    }
  })

  const [,t] = useLanguage()

  const handleClear = () => {
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
        style={styles.inputStyle}
        placeholder={placeholder}
        vertorIcon='search'
        vectorIconColor={theme.colors.disabled}
        returnKeyType='done'
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
          style={styles.cancelBtnStyle}
        >
          <Icon
            name='x-circle'
            size={30}
            style={{ marginRight: 5 }}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}
