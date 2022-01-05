import React from 'react'
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native'
import { ScrollView, StyleSheet, View, I18nManager, Platform } from 'react-native'
import { Tab } from './styles'
import { OText } from '../shared'
import { BusinessProductsCategoriesParams } from '../../types'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { useTheme } from 'styled-components/native'

const BusinessProductsCategoriesUI = (props: any) => {
  const {
    featured,
    categories,
    handlerClickCategory,
    categorySelected,
    loading
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: I18nManager.isRTL && Platform.OS === 'android' ? 0 : 20,
      paddingVertical: 10,
      borderBottomColor: I18nManager.isRTL && Platform.OS === 'android' ? '#fff' : theme.colors.lightGray,
      flexDirection: 'row',
      alignSelf: 'flex-start',
    },
    featuredStyle: {
      display: 'none'
    }
  })

  return (
    <ScrollView horizontal style={{...styles.container, borderBottomWidth: loading ? 0 : 1}} showsHorizontalScrollIndicator={false}>
      {loading && (
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row' }}>
            {[...Array(4)].map((_, i) => (
              <PlaceholderLine key={i} width={10} style={{marginRight: 5}}/>
              ))}
          </View>
        </Placeholder>
      )}
      {
        !loading && categories && categories.length && categories.map((category: any) => (
          <Tab
            key={category.name}
            onPress={() => handlerClickCategory(category)}
            style={(category.id === 'featured') && !featured && styles.featuredStyle}
          >
            <OText
              color={categorySelected?.id === category.id ? theme.colors.primary : ''}
              >
              {category.name}
            </OText>
          </Tab>
        ))
      }
    </ScrollView>
  )
}

export const BusinessProductsCategories = (props: BusinessProductsCategoriesParams) => {
  const businessProductsCategoriesProps = {
    ...props,
    UIComponent: BusinessProductsCategoriesUI
  }

  return (
    <ProductsCategories {...businessProductsCategoriesProps} />
  )
}
