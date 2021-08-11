import React from 'react'
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native'
import { I18nManager, ScrollView, StyleSheet, View } from 'react-native'
import { colors } from '../../theme.json'
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
    loading,
	 contentStyle,
  } = props

  return (
    <ScrollView horizontal contentContainerStyle={contentStyle} style={{...styles.container, borderBottomWidth: loading ? 0 : 1}} showsHorizontalScrollIndicator={false}>
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
				style={{...(category.id === 'featured') && !featured && styles.featuredStyle}}
          >
            <OText
              color={categorySelected?.id === category.id ? colors.textPrimary : colors.textSecondary}
              >
              {category.name}
            </OText>
				<View style={categorySelected?.id === category.id ? styles.tabStyle : styles.tabDeactived} />
          </Tab>
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0,
	 borderBottomColor: colors.clear,
  },
  featuredStyle: {
    display: 'none'
  },
  tabStyle: {
	marginTop: 10,
	height: 4,
	borderTopStartRadius: 4,
	borderTopEndRadius: 4,
	backgroundColor: colors.textPrimary,
  },
  tabDeactived: {
	marginTop: 10,
	height: 4
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
