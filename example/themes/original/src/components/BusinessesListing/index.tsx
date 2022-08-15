
import React, { useState, useEffect } from 'react'
import { useOrder, useSession, useLanguage } from 'ordering-components/native';

import { useTheme } from 'styled-components/native'
import { BusinessesListing as OriginalBusinessListing } from './Layout/Original'
import { BusinessesListing as AppointmentBusinessListing } from './Layout/Appointment'
import { OBottomPopup } from '../shared';
import { ReviewOrderModal, ReviewProductsModal, ReviewDriverModal } from '../Reviews'

export const BusinessesListing = (props: any) => {
  const theme = useTheme()
	const layout = theme?.layouts?.business_listing_view?.components?.layout?.type || 'original'
  const [, t] = useLanguage();
  const [{ auth }] = useSession()
  const [, { getLastOrderHasNoReview }] = useOrder();

  const [lastOrderReview, setLastOrderReview] = useState({
    isReviewOpen: false,
    order: {
      id: 0,
      business_id: 0,
      business_name: '',
      delivery_datetime: '',
      logo: '',
      driver: null,
      products: [],
      review: null,
      user_review: null
    },
    reviewStatus: { order: false, product: false, driver: false },
    reviewed: { isOrderReviewed: false, isProductReviewed: false, isDriverReviewed: false }
  })

  const _getLastOrderHasNoReview = async () => {
    const lastOrderHasNoReview = await getLastOrderHasNoReview()
    lastOrderHasNoReview && handleOrderReview(lastOrderHasNoReview)
  }

  const handleOrderReview = (order: any) => {
    setLastOrderReview({
      isReviewOpen: true,
      order: {
        id: order?.id,
        business_id: order?.business_id,
        business_name: order?.business?.name,
        delivery_datetime: order?.delivery_datetime,
        logo: order.business?.logo,
        driver: order?.driver,
        products: order?.products,
        review: order?.review,
        user_review: order?.user_review
      },
      reviewStatus: { order: true, product: false, driver: false },
      reviewed: { isOrderReviewed: false, isProductReviewed: false, isDriverReviewed: false }
    })
  }

  const handleCloseReivew = () => {
    setLastOrderReview({
      ...lastOrderReview,
      isReviewOpen: false,
      reviewStatus: { order: false, product: false, driver: false }
    })
  }

  const setIsReviewed = (reviewType: string) => {
    const _reviewStatus = { ...lastOrderReview?.reviewed }
    setLastOrderReview({
      ...lastOrderReview,
      reviewed: { ..._reviewStatus, [reviewType]: true }
    })
  }

  const closeReviewOrder = () => {
    if (!lastOrderReview?.reviewed?.isProductReviewed) setLastOrderReview({ ...lastOrderReview, reviewStatus: { order: false, product: true, driver: false } })
    else if (lastOrderReview?.order?.driver && !lastOrderReview?.order?.user_review && !lastOrderReview?.reviewed?.isDriverReviewed) setLastOrderReview({ ...lastOrderReview, reviewStatus: { order: false, product: false, driver: true } })
    else handleCloseReivew()
  }

  const closeReviewProduct = () => {
    if (lastOrderReview?.order?.driver && !lastOrderReview?.order?.user_review && !lastOrderReview?.reviewed?.isDriverReviewed) setLastOrderReview({ ...lastOrderReview, reviewStatus: { order: false, product: false, driver: true } })
    else {
      setIsReviewed('isDriverReviewed')
      handleCloseReivew()
    }
  }

  useEffect(() => {
    auth && _getLastOrderHasNoReview()
  }, [auth])

  return (
    <>
      {(layout === 'original') && <OriginalBusinessListing {...props} />}
      {(layout === 'appointment') && <AppointmentBusinessListing {...props} />}

      {lastOrderReview?.isReviewOpen && (
        <OBottomPopup
          open={lastOrderReview?.isReviewOpen}
          onClose={handleCloseReivew}
          title={lastOrderReview?.order
            ? (lastOrderReview?.reviewStatus?.order
              ? t('HEY', 'Hey! ') + t('HOW_WAS_YOUR_ORDER', 'How was your order?')
              : (lastOrderReview?.reviewStatus?.product
                ? t('REVIEW_PRODUCT', 'Review Product')
                : t('REVIEW_DRIVER', 'Review Driver')))
            : t('LOADING', 'Loading...')}
          bottomContainerStyle={{ height: 'auto' }}
          titleStyle={{ textAlign: 'center' }}
          closeIcon={theme.images.general.close}
        >
          {
            lastOrderReview?.reviewStatus?.order
              ? <ReviewOrderModal order={lastOrderReview?.order} closeReviewOrder={closeReviewOrder} skipReview={handleCloseReivew} setIsReviewed={() => setIsReviewed('isOrderReviewed')} />
              : (lastOrderReview?.reviewStatus?.product
                ? <ReviewProductsModal order={lastOrderReview?.order} closeReviewProduct={closeReviewProduct} setIsProductReviewed={() => setIsReviewed('isProductReviewed')} />
                : <ReviewDriverModal order={lastOrderReview?.order} closeReviewDriver={handleCloseReivew} setIsDriverReviewed={() => setIsReviewed('isDriverReviewed')} />)
          }

        </OBottomPopup>
      )}
    </>
  )
}