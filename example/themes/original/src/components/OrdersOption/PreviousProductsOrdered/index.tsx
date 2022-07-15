import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import {
  ListWrapper
} from './styles'

import { SingleProductCard } from '../../SingleProductCard'
import { PreviousProductsOrderedParams } from '../../../types'

export const PreviousProductsOrdered = (props : PreviousProductsOrderedParams) => {
  const {
    products,
    onProductClick,
    isBusinessesSearchList
  } = props

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });

  const ProductList = ({ style }: any) => {
    return (
      <>
        {products?.map((product: any) => (
          <SingleProductCard
            key={product?.id}
            isSoldOut={(product.inventoried && !product.quantity)}
            product={product}
            businessId={product?.business?.id}
            onProductClick={onProductClick}
            style={style}
            productAddedToCartLength={0}
          />
        ))}
      </>
    )
  }
  return (
    <ScrollView horizontal={isBusinessesSearchList} style={styles.container} showsVerticalScrollIndicator={false}>
      {isBusinessesSearchList ? (
        <ProductList style={{ width: 320, marginRight: 20 }} />
      ) : (
        <ListWrapper isBusinessesSearchList={isBusinessesSearchList}>
          <ProductList />
        </ListWrapper>
      )}
    </ScrollView>
  )
}
