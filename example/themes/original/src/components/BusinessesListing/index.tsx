
import React, { useState, useEffect } from 'react'
import { useOrder, useSession } from 'ordering-components/native';

import { useTheme } from 'styled-components/native'
import { IOScrollView } from 'react-native-intersection-observer'
import { BusinessesListing as OriginalBusinessListing } from './Layout/Original'
import { BusinessesListing as AppointmentBusinessListing } from './Layout/Appointment'

export const BusinessesListing = (props: any) => {
  const theme = useTheme()
  const layout = theme?.layout?.businessListing?.layout?.type || 'original'
  const [{ auth }] = useSession()
  const [, { getLastOrderHasNoReview }] = useOrder();
  const [, setIsReviewed] = useState(false)
  const handleOrderReview = (order: any) => {
    props?.navigation && props.navigation.navigate(
      'ReviewOrder',
      {
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
        setIsReviewed
      }
    )
  }

  const _getLastOrderHasNoReview = async () => {
    const lastOrderHasNoReview = await getLastOrderHasNoReview()
    lastOrderHasNoReview && handleOrderReview(lastOrderHasNoReview)
  }

  useEffect(() => {
    auth && _getLastOrderHasNoReview()
  }, [auth])

  return (
    <IOScrollView rootMargin={{ top: 0, bottom: 0 }}>
      {(layout === 'original') && <OriginalBusinessListing {...props} />}
      {(layout === 'appointment') && <AppointmentBusinessListing {...props} />}
    </IOScrollView>
  )
}
