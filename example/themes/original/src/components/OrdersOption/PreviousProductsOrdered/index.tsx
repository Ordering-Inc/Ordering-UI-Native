import React from 'react'
import { ScrollView, StyleSheet, Dimensions } from 'react-native'
import {
  ListWrapper
} from './styles'

import { SingleProductCard } from '../../SingleProductCard'
import { PreviousProductsOrderedParams } from '../../../types'

export const PreviousProductsOrdered = (props: PreviousProductsOrderedParams) => {
  const {
    products,
    onProductClick,
    handleUpdateProducts,
    isBusinessesSearchList
  } = props

  const windowWidth = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });

  const ProductList = ({ style }: any) => {
    return (
      <>
        {products?.filter((product : any) => product?.business?.available)?.map((product: any) => (
            <SingleProductCard
              key={product?.id}
              isProductId
              isSoldOut={(product.inventoried && !product.quantity)}
              product={product}
              businessId={product?.business?.id}
              onProductClick={onProductClick}
              style={style}
              productAddedToCartLength={0}
              handleUpdateProducts={handleUpdateProducts}
            />
        ))}
      </>
    )
  }
  return (
    <ScrollView horizontal={isBusinessesSearchList} style={styles.container} showsVerticalScrollIndicator={false}>
      {isBusinessesSearchList ? (
        <ProductList style={{ width: windowWidth - 80, marginRight: 20 }} />
      ) : (
        <ListWrapper isBusinessesSearchList={isBusinessesSearchList}>
          <ProductList />
        </ListWrapper>
      )}
    </ScrollView>
  )
}
