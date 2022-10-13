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
import { View } from 'react-native'

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
    handleCancelSearch
  } = props

  const [, t] = useLanguage()

  return (
    <ProductsContainer>
      {category.id && (
        categoryState.products?.sort((a: any, b: any) => a.rank - b.rank).map((product: any, index: number) => (
          <SingleProductCard
            key={`category${category.id}-${product.id}-${index}`}
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
              <OText size={18} weight='bold' mBottom={10}>{t('FEATURED', 'Featured')}</OText>
              <>
                {categoryState.products?.sort((a: any, b: any) => a.rank - b.rank).map((product: any, index: number) => product.featured && (
                  <SingleProductCard
                    key={`featured${product.id}-${index}`}
                    isSoldOut={(product.inventoried && !product.quantity)}
                    product={product}
                    businessId={businessId}
                    onProductClick={onProductClick}
                  />
                ))}
              </>
            </>
          )
        )
      }

      {
        !category.id && categories && categories.filter(category => category.id !== null).map((category, i, _categories) => {
          const products = categoryState.products?.filter((product: any) => category?.children?.some((cat: any) => cat?.category_id === product?.category_id) || product.category_id === category.id) || []
          return (
            <View key={`category${category.id}`} style={{ alignItems: 'flex-start', flex: 1 }}>
              {
                products.length > 0 && (
                  <>
                    <OText size={18} weight='bold' mBottom={10}>{category.name}</OText>
                    <>
                      {
                        products?.sort((a: any, b: any) => a.rank - b.rank).map((product: any, index: number) => (
                          <SingleProductCard
                            key={`all${product.id}-${index}`}
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
                    <PlaceholderLine width={60} style={{ marginBottom: 25 }} />
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
