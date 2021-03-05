import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../../theme'
import { OInput } from '../shared'
import {useLanguage} from 'ordering-components/native'
import {SearchBarParams} from '../../types'

export const SearchBar = (props: SearchBarParams) => {

  const { searchValue, onSearch, lazyLoad } = props

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
    <OInput
      value={searchValue}
      onChange={onChangeSearch}
      style={styles.inputStyle}
      placeholder={t('FIND_RESTAURANT_OR_DISH', 'Find a restaurant or Dish')}
      vertorIcon='search'
      vectorIconColor={colors.disabled}
    />
  )
}

const styles = StyleSheet.create({
  inputStyle: {
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1
  } 
})
