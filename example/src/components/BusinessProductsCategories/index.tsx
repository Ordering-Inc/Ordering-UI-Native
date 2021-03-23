import React from 'react'
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native'
import { ScrollView, StyleSheet } from 'react-native'
import { colors } from '../../theme'
import { Tab } from './styles'
import { OText } from '../shared'
import { BusinessProductsCategoriesParams } from '../../types'

const BusinessProductsCategoriesUI = (props: any) => {
  const {
    featured,
    categories,
    handlerClickCategory,
    categorySelected,
  } = props

  return (
    <ScrollView horizontal style={styles.container}>
      {
        categories && categories.length && categories.map(category => (
          <Tab
            key={category.name}
            onPress={() => handlerClickCategory(category)}
            style={(category.id === 'featured') && !featured && styles.featuredStyle}
          >
            <OText
              color={categorySelected?.id === category.id ? colors.primary: ''}
            >
              {category.name}
            </OText>
          </Tab>
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  featuredStyle: {
    display: 'none'
  }
})

export const BusinessProductsCategories = (props: BusinessProductsCategoriesParams) => {
  const businessProductsCategoriesProps = {
    ...props,
    UIComponent: BusinessProductsCategoriesUI
  }

  return (
    <ProductsCategories {...businessProductsCategoriesProps} />
  )
}
