import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OInput, OButton } from '../shared'
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
    borderStyle,
	 inputStyle
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
		paddingStart: 0,
		height: 40
    },
    buttonStyle: {
      maxHeight: 30,
      paddingRight: 5,
      paddingLeft: 5,
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
        icon={theme.images.general.tab_explore}
		  iconStyle={{width: 16, height: 16}}
        returnKeyType='done'
		  inputStyle={inputStyle}
		  clearButtonMode={isCancelXButtonShow ? 'while-editing' : 'never'}
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
      {/* {isCancelXButtonShow && (
        <TouchableOpacity
          onPress={onCancel || handleClear}
        >
          <Icon
            name='x-circle'
            size={16}
            style={{ marginRight: 5 }}
				color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )} */}
    </View>
  )
}
