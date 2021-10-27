import React, { useState, useEffect } from 'react'
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
import { Platform, View } from 'react-native'

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
    sortBy
  } = props

  const [, t] = useLanguage()
  const [sort, setSort] = useState(sortBy);
  const [allProducts, setAllProducts] = useState(categoryState.products);

  useEffect(() => {
    if (categoryState?.products) {
      setAllProducts([...categoryState.products.sort((a: any,b:any) => sort == 'alphabet' ? a.name > b.name : a?.rank > b?.rank)])
      console.log(sortBy)
    }
  }, [categoryState, sortBy]);

  return (
    <ProductsContainer>
      {category.id && (
        allProducts?.map((product: any) => (
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
          featured && allProducts?.find((product: any) => product.featured) && (
            <>
              <OText size={16} weight={Platform.OS == 'ios' ? '600' : 'bold'} mBottom={20}>{t('FEATURED', 'Featured')}</OText>
              {allProducts?.map((product: any) => product.featured && (
                <SingleProductCard
                  key={product.id}
                  isSoldOut={(product.inventoried && !product.quantity)}
                  product={product}
                  businessId={businessId}
                  onProductClick={onProductClick}
                />
              ))}
            </>
          )
        )
      }

      {
        !category.id && categories && categories.filter(category => category.id !== null).map((category, i, _categories) => {
          const products = allProducts?.filter((product: any) => product.category_id === category.id) || []
          return (
            <View key={category.id} style={{alignItems: 'flex-start'}}>
              {
                products.length > 0 && (
                  <>
                    <OText size={16} weight={Platform.OS == 'ios' ? '600' : 'bold'} mBottom={20}>{category.name}</OText>
                    <>
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
                    </>
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
              <Placeholder key={i} style={{ padding: 5 }} Animation={Fade}>
                <View style={{ flexDirection: 'row' }}>
                  <PlaceholderLine width={24} height={70} style={{ marginRight: 10, marginBottom: 10 }} />
                  <Placeholder style={{ paddingVertical: 10 }}>
                      <PlaceholderLine width={60} style={{marginBottom: 25}}/>
                      <PlaceholderLine width={20} />
                  </Placeholder>
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
