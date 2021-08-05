import React from 'react'
import { ProductsList, useLanguage } from 'ordering-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { NotFoundSource } from '../../../../../components/NotFoundSource'
import { BusinessProductsListParams } from '../../../../../types'
import { OText } from '../../../../../components/shared'
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
              <OText size={18} weight='bold' mBottom={10} style={{ textAlign: 'left' }}>{t('FEATURED', 'Featured')}</OText>
              <>
                {categoryState.products?.map((product: any) => product.featured && (
                  <SingleProductCard
                    key={product.id}
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
          const products = categoryState.products?.filter((product: any) => product.category_id === category.id) || []
          return (
            <View key={category.id} style={{alignItems: 'flex-start'}}>
              {
                products.length > 0 && (
                  <>
                    <OText size={18} weight='600' mBottom={10} style={{ textAlign: 'left' }}>{category.name}</OText>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Placeholder style={{ width: '70%', paddingVertical: 10 }}>
                    <PlaceholderLine width={60} style={{ marginBottom: 25 }}/>
                    <PlaceholderLine width={20} />
                  </Placeholder>
                  <PlaceholderLine width={24} height={80} style={{ marginBottom: 10, borderRadius: 0 }} />
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
