import React, { useState, useEffect } from 'react'
import { ProductsList, useLanguage } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessProductsListParams } from '../../types'
import { OText } from '../shared'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { Platform, View, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import {
  ProductsContainer,
  ErrorMessage,
  WrapperNotFound,
  ProductsWrapper
} from './styles'
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
  const [allProducts, setAllProducts] = useState([])

  useEffect(() => {
    if (category?.id) return
    if (Array.isArray(categoryState?.products)) {
      if (categoryState?.products.length > allProducts.length) {
        setAllProducts(categoryState?.products.sort((a: any, b: any) => a.id - b.id))
      }
      if (searchValue) {
        setAllProducts(categoryState?.products.sort((a: any, b: any) => a.id - b.id))
      }
    }
  }, [category, categoryState, searchValue])

  return (
    <ProductsContainer>
      {/* {category.id && (
        categoryState.products?.map((product: any, index: number) => (
          <SingleProductCard
            key={index}
            isSoldOut={(product.inventoried && !product.quantity)}
            product={product}
            businessId={businessId}
            onProductClick={() => onProductClick(product)}
          />
        ))
      )} */}

      {
        featured && allProducts?.find((product: any) => product.featured) && (
          <>
            <TouchableOpacity
              onPress={() => handlerClickCategory({ id: 'featured', name: 'Featured' })}
            >
              <OText style={{...theme.labels.subtitle, fontWeight: Platform.OS == 'ios' ? '600' : 'bold'}} mBottom={10}>{t('FEATURED', 'Featured')}</OText>
            </TouchableOpacity>
            <ProductsWrapper>
              {allProducts?.map((product: any, index: number) => product.featured && (
                <SingleProductCard
                  key={index}
                  isSoldOut={(product.inventoried && !product.quantity)}
                  product={product}
                  businessId={businessId}
                  onProductClick={onProductClick}
                />
              ))}
            </ProductsWrapper>
          </>
        )
      }

      {
        categories && categories.filter(category => category.id !== null).map((category, i, _categories) => {
          const products = allProducts?.filter((product: any) => product.category_id === category.id) || []
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
                    <ProductsWrapper>
                      {
                        products.map((product: any, index: number) => (
                          <SingleProductCard
                            key={index}
                            isSoldOut={product.inventoried && !product.quantity}
                            businessId={businessId}
                            product={product}
                            onProductClick={onProductClick}
                          />
                        ))
                      }
                    </ProductsWrapper>
                  </>
                )
              }
            </View>
          )
        })
      }

      {
        (categoryState.loading || isBusinessLoading) && (
          <Placeholder style={{ padding: 5, marginBottom: 20 }} Animation={Fade}>
            <PlaceholderLine width={50} height={16} style={{ marginBottom: 20 }} />
            {[...Array(categoryState?.pagination?.nextPageItems).keys()].map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{flexBasis: '47%'}}>
                  <PlaceholderLine width={80} height={100} style={{ marginBottom: 10 }} />
                  <Placeholder>
                      <PlaceholderLine width={20} />
                      <PlaceholderLine width={60} style={{marginBottom: 12}}/>
                  </Placeholder>
                </View>
                <View style={{flexBasis: '47%'}}>
                  <PlaceholderLine width={80} height={100} style={{ marginBottom: 10 }} />
                  <Placeholder>
                      <PlaceholderLine width={20} />
                      <PlaceholderLine width={60} style={{marginBottom: 25}}/>
                  </Placeholder>
                </View>
              </View>
            ))}
          </Placeholder>
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
