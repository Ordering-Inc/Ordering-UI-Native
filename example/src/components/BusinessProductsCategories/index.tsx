import React from 'react'
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native'
import { ScrollView, StyleSheet, View } from 'react-native'
import { colors } from '../../theme'
import { Tab } from './styles'
import { OText } from '../shared'
import { BusinessProductsCategoriesParams } from '../../types'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'

const BusinessProductsCategoriesUI = (props: any) => {
  const {
    featured,
    categories,
    handlerClickCategory,
    categorySelected,
    loading
  } = props

  return (
    <ScrollView horizontal style={{...styles.container, borderBottomWidth: loading ? 0 : 1}}>
      {loading && (
        <Placeholder Animation={Fade}>
          <View style={{ flexDirection: 'row' }}>
            {[...Array(4)].map((item, i) => (
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
              color={categorySelected?.id === category.id ? colors.primary : ''}
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
