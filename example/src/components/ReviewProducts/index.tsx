import React, { useState } from 'react'
import { useLanguage } from 'ordering-components/native'
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

export const ReviewProducts = (props: ReviewProductParams) => {
  const {
    navigation,
    order,
    onNavigationRedirect
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()

  return (
    <>
      <ReviewProductsContainer>
        <NavBar
          title={t('REVIEW_PRODUCT', 'Review product')}
          titleAlign={'center'}
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          paddingTop={0}
        />
        {order?.products.map((product: any) => (
          <SingleProductReview
            key={product.id}
            product={product}
          />
        ))}
      </ReviewProductsContainer>

      <FloatingBottomContainer>
        <ActionContainer>
          <SkipButton
            onPress={() => onNavigationRedirect('ReviewDriver', { order: order })}
          >
            <OText weight={700} size={18}>{t('FRONT_VISUALS_SKIP', 'Skip')}</OText>
          </SkipButton>
          <OButton
            textStyle={{ color: theme.colors.white, paddingRight: 10 }}
            text={t('CONTINUE', 'Continue')}
            style={{ borderRadius: 8 }}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            // onClick={handleSubmit(onSubmit)}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}
