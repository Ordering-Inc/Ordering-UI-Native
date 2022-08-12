import React, { useState, useEffect } from 'react'
import { useLanguage, useToast, ToastType, ReviewProduct as ReviewProductController } from 'ordering-components/native'
import { OText, OButton } from '../../shared'
import { ReviewProductParams } from '../../../types'
import { FloatingBottomContainer } from '../../../layouts/FloatingBottomContainer'
import { useTheme } from 'styled-components/native'
import { SingleProductReview } from '../../SingleProductReview'

import {
  ReviewProductsContainer,
  ActionContainer,
  SkipButton
} from './styles'

const ReviewProductsUI = (props: ReviewProductParams) => {
  const {
    navigation,
    order,
    formState,
    handleChangeFormState,
    handleSendProductReview,
    closeReviewProduct
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
      closeReviewProduct && closeReviewProduct()
    }
  }, [formState])

  return (
    <>
      <ReviewProductsContainer>
        {order?.products?.map((product: any) => (
          <SingleProductReview
            key={product.id}
            product={product}
            formState={formState}
            handleChangeFormState={handleChangeFormState}
          />
        ))}
      </ReviewProductsContainer>

      <FloatingBottomContainer>
        <ActionContainer>
          <SkipButton
            onPress={() => closeReviewProduct && closeReviewProduct()}
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
