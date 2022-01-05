import React, { useState, useRef, useEffect } from 'react'
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native'
import { ScrollView, StyleSheet, View, I18nManager, Platform, Dimensions } from 'react-native'
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
    loading,

    scrollViewRef,
    productListLayout,
    categoriesLayout,
		selectedCategoryId,
    lazyLoadProductsRecommended
  } = props

  const theme = useTheme()

  const windowWidth = Dimensions.get('window').width
	const [tabLayouts, setTabLayouts] = useState<any>({})
	const [scrollOffsetX, setScrollOffsetX] = useState<any>(0)
	const tabsRef = useRef<any>(null)

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

  const handleCategoryScroll = (category: any) => {
		if (!lazyLoadProductsRecommended) {
			if (category?.id) {
				scrollViewRef.current.scrollTo({
					y: categoriesLayout[`cat_${category?.id}`]?.y + productListLayout?.y - 40,
					animated: true
				})
			} else {
				scrollViewRef.current.scrollTo({
					y: productListLayout?.y - 70,
					animated: true
				})
			}
		} else {
			handlerClickCategory(category)
		}
	}

	const handleOnLayout = (event: any, categoryId: any) => {
    const _tabLayouts = { ...tabLayouts }
    const categoryKey = 'cat_' + categoryId
    _tabLayouts[categoryKey] = event.nativeEvent.layout
    setTabLayouts(_tabLayouts)
  }

	useEffect(() => {
		if (!selectedCategoryId || Object.keys(tabLayouts).length === 0) return
		tabsRef.current.scrollTo({
			x: tabLayouts[selectedCategoryId]?.x,
			animated: true
		})
	}, [selectedCategoryId, tabLayouts])

  return (
    <ScrollView
			ref={tabsRef}
      horizontal
      style={{...styles.container, borderBottomWidth: loading ? 0 : 1}}
      showsHorizontalScrollIndicator={false}
      onScroll={(e: any) => setScrollOffsetX(e.nativeEvent.contentOffset.x)}
			scrollEventThrottle={16}
    >
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
            onPress={() => handleCategoryScroll(category)}
            style={[
							category.id === 'featured' && !featured && styles.featuredStyle,
							{
								borderColor:
									(!lazyLoadProductsRecommended
										?	(selectedCategoryId === (category.id ? `cat_${category.id}` : null))
										:	(categorySelected?.id === category.id))
											? theme.colors.secundary
											: theme.colors.primary
							},
						]}
						onLayout={(event: any) => handleOnLayout(event, category.id)}
          >
            <OText
              color={
								(!lazyLoadProductsRecommended
									?	(selectedCategoryId === (category.id ? `cat_${category.id}` : null))
									:	(categorySelected?.id === category.id))
										? theme.colors.secundary
										: theme.colors.primary
							}
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
