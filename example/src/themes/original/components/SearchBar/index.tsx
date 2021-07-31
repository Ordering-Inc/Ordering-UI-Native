import React from 'react'
import { StyleSheet, View, TouchableOpacity, ImageStore, Platform, TextInput } from 'react-native'
import { colors, images } from '../../theme.json'
import { OInput, OButton } from '../../../../components/shared'
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
	 height,
	 inputStyle
  } = props

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
    <View style={[styles.container, {height: height}]}>
      <OInput
        value={searchValue}
        onChange={onChangeSearch}
        style={styles.inputStyle}
        placeholder={placeholder}
        icon={images.general.search}
		  iconStyle={{width: 12}}
        returnKeyType='done'
		  inputStyle={inputStyle}
      />
      {isCancelButtonShow && (
        <OButton
          imgRightSrc=''
          text={t('CANCEL', 'Cancel')}
          bgColor='transparent'
          borderColor={colors.lightGray}
          style={styles.buttonStyle}
          onClick={onCancel || handleClear}
        />
      )}
      {isCancelXButtonShow && (
        <TouchableOpacity
          onPress={onCancel || handleClear}
			 style={{position: 'absolute', end: 10}}
        >
          <Icon
            name='x-circle'
				color={colors.disabled}
            size={16}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 1,
	 maxHeight: 44,
	 height: 44,
	 borderColor: colors.clear
  },
  borderStyle: {
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 7.6,
  },
  inputStyle: {
    height: '100%',
	 borderRadius: 7.6,
	 paddingHorizontal: 10,
	 backgroundColor: colors.backgroundGray100,
  },
  buttonStyle: {
    maxHeight: 40,
    paddingRight: 5,
	 backgroundColor: 'red'
  }
})
