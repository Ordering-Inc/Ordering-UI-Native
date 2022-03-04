import React from 'react'
import { useLanguage, useConfig, useOrder, useUtils } from 'ordering-components/native'
import { SingleProductCardParams } from '../../types'
import {
  CardContainer,
  CardInfo,
  SoldOut,
  PricesContainer
} from './styles'
import { StyleSheet } from 'react-native'
import { OText, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'

export const SingleProductCard = (props: SingleProductCardParams) => {
  const {
    businessId,
    product,
    isSoldOut,
    onProductClick
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.lightGray,
      marginBottom: 15,
    },
    textStyle: {
      flex: 1,
    },
    soldOutBackgroundStyle: {
      backgroundColor: '#B8B8B8',
    },
    soldOutTextStyle : {
      textTransform: 'uppercase'
    },
    productStyle: {
      width: 75,
      height: 75,
      borderRadius: 10,
    },
    regularPriceStyle: {
      fontSize: 12,
      color: '#808080',
      textDecorationLine: 'line-through',
      marginLeft: 7,
      marginRight: 7
    }
  })

  const [, t] = useLanguage()
  const [stateConfig] = useConfig()
  const [{ parsePrice, optimizeImage }] = useUtils()
  const [orderState] = useOrder()

  const editMode = typeof product?.code !== 'undefined'

  const removeToBalance = editMode ? product?.quantity : 0
  const cart = orderState.carts[`businessId:${businessId}`]
  const productCart = cart?.products?.find((prod: any) => prod.id === product?.id)
  const totalBalance = (productCart?.quantity || 0) - removeToBalance

  const maxCartProductConfig = (stateConfig.configs.max_product_amount ? parseInt(stateConfig.configs.max_product_amount) : 100) - totalBalance

  const productBalance = (cart?.products?.reduce((sum: any, _product: any) => sum + (product && _product.id === product?.id ? _product.quantity : 0), 0) || 0) - removeToBalance
  let maxCartProductInventory = (product?.inventoried ? product?.quantity : undefined) - productBalance
  maxCartProductInventory = !isNaN(maxCartProductInventory) ? maxCartProductInventory : maxCartProductConfig

  const maxProductQuantity = Math.min(maxCartProductConfig, maxCartProductInventory)

  return (
    <CardContainer
      style={[styles.container, (isSoldOut || maxProductQuantity <= 0) && styles.soldOutBackgroundStyle]}
      activeOpacity={1}
      onPress={() => onProductClick?.(product)}
    >
      <OIcon
        url={optimizeImage(product?.images, 'h_200,c_limit')}
        style={styles.productStyle}
      />
      <CardInfo>
        <OText numberOfLines={1} ellipsizeMode='tail' style={styles.textStyle}>{product?.name}</OText>
        <OText size={12} numberOfLines={2} ellipsizeMode='tail' style={styles.textStyle}>{product?.description}</OText>
        <PricesContainer>
          <OText color={theme.colors.primary}>{parsePrice(product?.price)}</OText>
          {!!product?.offer_price !== null && product?.in_offer && (
            <OText style={styles.regularPriceStyle}>{parsePrice(product?.offer_price)}</OText>
          )}
        </PricesContainer>
      </CardInfo>

      {(isSoldOut || maxProductQuantity <= 0) && (
        <SoldOut>
          <OText weight='bold' style={styles.soldOutTextStyle}>{t('SOLD_OUT', 'SOLD OUT')}</OText>
        </SoldOut>
      )}
    </CardContainer>
  )
}
