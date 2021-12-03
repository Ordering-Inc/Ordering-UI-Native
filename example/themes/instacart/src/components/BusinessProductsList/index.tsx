import React from 'react'
import { ProductsList, useLanguage } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessProductsListParams } from '../../types'
import { OText } from '../shared'
import {
  ProductsContainer,
  ErrorMessage,
  WrapperNotFound
} from './styles'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { Platform, View, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import { ScrollView } from 'react-native-gesture-handler'

const BusinessProductsListUI = (props: BusinessProductsListParams) => {
  const {
    errors,
    businessId,
    category,
    categories,
    categoryState,
    onProductClick,
    featured,
    searchValue,
    isBusinessLoading,
    handleSearchRedirect,
    handleClearSearch,
    errorQuantityProducts,
    handleCancelSearch,
    handlerClickCategory
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()

  return (
    <ProductsContainer>
      {category.id && (
        categoryState.products?.map((product: any) => (
          <SingleProductCard
            key={product.id}
            isSoldOut={(product.inventoried && !product.quantity)}
            product={product}
            businessId={businessId}
            onProductClick={() => onProductClick(product)}
          />
        ))
      )}

      {
        !category.id && (
          featured && categoryState?.products?.find((product: any) => product.featured) && (
            <>
              <TouchableOpacity
                onPress={() => handlerClickCategory({ id: 'featured', name: 'Featured' })}
              >
                <OText style={{...theme.labels.subtitle, fontWeight: Platform.OS == 'ios' ? '600' : 'bold'}} mBottom={10}>{t('FEATURED', 'Featured')}</OText>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoryState.products?.map((product: any) => product.featured && (
                  <SingleProductCard
                    key={product.id}
                    isSoldOut={(product.inventoried && !product.quantity)}
                    product={product}
                    businessId={businessId}
                    onProductClick={onProductClick}
                  />
                ))}
              </ScrollView>
            </>
          )
        )
      }

      {
        !category.id && categories && categories.filter(category => category.id !== null).map((category, i, _categories) => {
          const products = categoryState.products?.filter((product: any) => product.category_id === category.id) || []
          return (
            <View key={category.id} style={{alignItems: 'flex-start'}}>
              {
                products.length > 0 && (
                  <>
                    <TouchableOpacity
                      onPress={() => handlerClickCategory(category)}
                    >
                      <OText style={{...theme.labels.subtitle, fontWeight: Platform.OS === 'ios' ? '600' : 'bold'}} mBottom={10}>{category.name}</OText>
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {
                        products.map((product: any) => (
                          <SingleProductCard
                            key={product.id}
                            isSoldOut={product.inventoried && !product.quantity}
                            businessId={businessId}
                            product={product}
                            onProductClick={onProductClick}
                          />
                        ))
                      }
                    </ScrollView>
                  </>
                )
              }
            </View>
          )
        })
      }

      {
        (categoryState.loading || isBusinessLoading) && (
          <>
            {[...Array(categoryState?.pagination?.nextPageItems).keys()].map((item, i) => (
              <Placeholder key={i} style={{ padding: 5, marginBottom: 20 }} Animation={Fade}>
                <PlaceholderLine width={50} height={20} style={{ marginBottom: 20 }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{flexBasis: '47%'}}>
                    <PlaceholderLine width={80} height={100} style={{ marginBottom: 10 }} />
                    <Placeholder>
                        <PlaceholderLine width={60} style={{marginBottom: 12}}/>
                        <PlaceholderLine width={20} />
                    </Placeholder>
                  </View>
                  <View style={{flexBasis: '47%'}}>
                    <PlaceholderLine width={80} height={100} style={{ marginBottom: 10 }} />
                    <Placeholder>
                        <PlaceholderLine width={60} style={{marginBottom: 25}}/>
                        <PlaceholderLine width={20} />
                    </Placeholder>
                  </View>
                </View>
              </Placeholder>
            ))}
          </>
        )
      }
      {
        !categoryState.loading && !isBusinessLoading && categoryState.products.length === 0 && !errors && !((searchValue && errorQuantityProducts) || (!searchValue && !errorQuantityProducts)) && (
          <WrapperNotFound>
            <NotFoundSource
              content={!searchValue ? t('ERROR_NOT_FOUND_PRODUCTS_TIME', 'No products found at this time') : t('ERROR_NOT_FOUND_PRODUCTS', 'No products found, please change filters.')}
              btnTitle={!searchValue ? t('SEARCH_REDIRECT', 'Go to Businesses') : t('CLEAR_FILTERS', 'Clear filters')}
              onClickButton={() => !searchValue ? handleSearchRedirect && handleSearchRedirect() : handleCancelSearch && handleCancelSearch()}
            />
          </WrapperNotFound>
        )
      }

      {errors && errors.length > 0 && (
        errors.map((e: any, i: number) => (
          <ErrorMessage key={i}>
            <OText space>ERROR:</OText>
            <OText>{e}</OText>
          </ErrorMessage>
        ))
      )}
    </ProductsContainer>
  )
}

export const BusinessProductsList = (props: BusinessProductsListParams) => {
  const businessProductsListProps = {
    ...props,
    UIComponent: BusinessProductsListUI
  }

  return (
    <ProductsList {...businessProductsListProps} />
  )
}
