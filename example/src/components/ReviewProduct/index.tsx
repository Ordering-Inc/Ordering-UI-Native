import React from 'react'
import { useLanguage } from 'ordering-components/native'
import { OText } from '../shared'
import NavBar from '../NavBar'
import { ReviewProductParams } from '../../types'

export const ReviewProduct = (props: ReviewProductParams) => {
  const {
    navigation
  } = props
  const [, t] = useLanguage()
  return (
    <>
      <NavBar
        title={t('REVIEW_ORDER', 'Review your Order')}
        titleAlign={'center'}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
        showCall={false}
        btnStyle={{ paddingLeft: 0 }}
        paddingTop={0}
      />
      <OText>review product</OText>
    </>
  )
}
