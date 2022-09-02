import React from 'react'
import { OText } from '../shared'
import { useLanguage } from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { SingleProductCard } from '../SingleProductCard'
import { OrderItAgainParams } from '../../types'
import { ScrollView, Dimensions } from 'react-native'
import {
  Container,
  ProductWrapper
} from './styles'

export const OrderItAgain = (props: OrderItAgainParams) => {
  const {
    onProductClick,
    productList,
    businessId,
    categoryState,
    currentCart,
    handleUpdateProducts,
    navigation
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const { width } = Dimensions.get('window');

  return (
    <Container>
      <OText
        size={16}
        lineHeight={24}
        color={theme.colors.textNormal}
        style={{
          fontWeight: '600',
          marginBottom: 6
        }}
      >
        {t('ORDER_IT_AGAIN', 'Order it again')}
      </OText>
      <OText
        size={12}
        lineHeight={18}
        color={theme.colors.disabled}
      >
        {t('ORDER_IT_AGAIN_DESC', 'Quickly add items from your past orders.')}
      </OText>
      <ScrollView
        horizontal
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {productList?.length > 0 && productList?.map((product: any, i: number) => (
          <ProductWrapper key={'prod_' + product.id + `_${i}`} style={{ width: width - 120, }}>
            <SingleProductCard
              isSoldOut={product.inventoried && !product.quantity}
              product={product}
              businessId={businessId}
              categoryState={categoryState}
              onProductClick={() => onProductClick(product)}
              productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
              handleUpdateProducts={handleUpdateProducts}
              navigation={navigation}
              isPreviously
            />
          </ProductWrapper>
        ))}
      </ScrollView>
    </Container>
  )
}
