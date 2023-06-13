import React, { useEffect } from 'react'
import {
  UpsellingPage as UpsellingPageController,
  useOrder,
} from 'ordering-components/native'
import { OBottomPopup } from '../shared'
import { UpsellingProductsParams } from '../../types'

import { UpsellingLayout } from './UpsellingLayout';
import { UpsellingContent } from './UpsellingContent';

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
  const {
    isCustomMode,
    upsellingProducts,
    handleUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling,
    isFromCart
  } = props

  const [{ carts }] = useOrder()

  const cart = carts?.[`businessId:${props.businessId}`] ?? {}
  const cartProducts = cart?.products?.length
  ? cart?.products.map((product: any) => product.id)
  : []

  const productsList = !upsellingProducts.loading && !upsellingProducts.error
  ? upsellingProducts?.products?.length
      ? upsellingProducts?.products.filter((product: any) => !cartProducts.includes(product.id))
      : (props?.products ?? []).filter((product: any) => !cartProducts.includes(product.id)) ?? []
  : []

  useEffect(() => {
    if (!isCustomMode && !props.products) {
      if (!upsellingProducts?.loading) {
        if (upsellingProducts?.products?.length && !isFromCart) {
          setCanOpenUpselling && setCanOpenUpselling(true)
        } else {
          handleUpsellingPage && handleUpsellingPage(cart)
        }
      }
    }
  }, [upsellingProducts?.loading, upsellingProducts?.products?.length])

  return (
    <>
      {isCustomMode ? (
        <UpsellingLayout {...props} productsList={productsList} />
      ) : (
        <>
          {props.isPage ? (
            <UpsellingContent {...props} cart={cart} productsList={productsList} />
          ) : (
            canOpenUpselling && (
              <OBottomPopup
                title={''}
                open={openUpselling}
                onClose={() => handleUpsellingPage(cart)}
                isStatusBar
              >
                <UpsellingContent {...props} productsList={productsList} />
              </OBottomPopup>
            )
          )}
        </>
      )}
    </>
  )
}

export const UpsellingProducts = (props: UpsellingProductsParams) => {
  const upsellingProductsProps = {
    ...props,
    UIComponent: UpsellingProductsUI
  }
  return (
    <UpsellingPageController {...upsellingProductsProps} />
  )
}
