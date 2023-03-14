import React, { useState, useEffect } from 'react'
import { useLanguage, useToast, ToastType, ReviewProduct as ReviewProductController } from 'ordering-components/native'
import { OText, OButton } from '../shared'
import NavBar from '../NavBar'
import { ReviewProductParams } from '../../types'
import { FloatingBottomContainer } from '../../layouts/FloatingBottomContainer'
import { useTheme } from 'styled-components/native'
import { SingleProductReview } from '../SingleProductReview'

import {
  ReviewProductsContainer,
  ActionContainer,
  SkipButton
} from './styles'

const ReviewProductsUI = (props: ReviewProductParams) => {
  const {
    navigation,
    order,
    onNavigationRedirect,
    formState,
    handleChangeFormState,
    handleSendProductReview
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [, { showToast }] = useToast()

  const [isProductReviewed, setIsProductReviewed] = useState(false)
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

  const handleContinueClick = () => {
    setAlertState({ ...alertState, success: true })
    handleSendProductReview()
  }
  useEffect(() => {
    if (alertState.open) {
      alertState.content && showToast(
        ToastType.Error,
        alertState.content
      )
    }
  }, [alertState.content])

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        success: false,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
    if (!formState.loading && !formState.result?.error && alertState.success) {
      setIsProductReviewed && setIsProductReviewed(true)
      if (order?.driver && !order?.user_review) {
        onNavigationRedirect('ReviewDriver', { order: order })
      } else {
        onNavigationRedirect('BottomTab', { screen: 'MyOrders' })
      }
    }
  }, [formState])

  return (
    <>
      <ReviewProductsContainer>
        <NavBar
          title={t('REVIEW_PRODUCT', 'Review product')}
          titleAlign={'center'}
          onActionLeft={() => onNavigationRedirect('BottomTab', { screen: 'MyOrders' })}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          titleWrapStyle={{ paddingHorizontal: 0 }}
          titleStyle={{ marginRight: 0, marginLeft: 0 }}
        />
        {order?.products && order.products.length > 0 && order?.products.map(productsOrder => (
          productsOrder?.length ? productsOrder?.map((product: any, i: any) => !product?.deleted && (
            <SingleProductReview
              key={i}
              product={product}
              formState={formState}
              handleChangeFormState={handleChangeFormState}
            />
          )) : (!productsOrder?.deleted ? (
            <SingleProductReview
              product={productsOrder}
              formState={formState}
              handleChangeFormState={handleChangeFormState}
            />
          ) : null
          )
        ))}
      </ReviewProductsContainer>

      <FloatingBottomContainer>
        <ActionContainer>
          <SkipButton
            onPress={() => (order?.driver && !order?.user_review) ?
              onNavigationRedirect('ReviewDriver', { order: order }) :
              onNavigationRedirect('BottomTab', { screen: 'MyOrders' })
            }
          >
            <OText weight={700} size={18} color={theme.colors.textNormal}>{t('FRONT_VISUALS_SKIP', 'Skip')}</OText>
          </SkipButton>
          <OButton
            textStyle={{ color: theme.colors.white, paddingRight: 10 }}
            text={order?.driver && !order?.user_review ? t('CONTINUE', 'Continue') : t('SEND_REVIEW', 'Send Review')}
            style={{ borderRadius: 8 }}
            imgRightSrc={theme.images.general.arrow_right}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            isDisabled={formState.loading || formState?.changes?.length === 0}
            onClick={() => handleContinueClick()}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}

export const ReviewProducts = (props: any) => {
  const reviewProductProps = {
    ...props,
    UIComponent: ReviewProductsUI,
    isToast: true
  }
  return <ReviewProductController {...reviewProductProps} />
}
