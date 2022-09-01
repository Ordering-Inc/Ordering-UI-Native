
import React, { useState, useEffect } from 'react'
import {
  openSettings,
  checkNotifications
} from 'react-native-permissions';

import { useOrder, useSession, useLanguage, useOrderingTheme } from 'ordering-components/native';

import { useTheme } from 'styled-components/native'
import { BusinessesListing as OriginalBusinessListing } from './Layout/Original'
import { BusinessesListing as AppointmentBusinessListing } from './Layout/Appointment'
import { OBottomPopup } from '../shared';
import { ReviewTrigger } from '../ReviewTrigger';
import { NotificationSetting } from '../../../../../src/components/NotificationSetting';

export const BusinessesListing = (props: any) => {
  const { logosLayout } = props
  const theme = useTheme()
  const [orderingTheme] = useOrderingTheme()
  const layout = orderingTheme?.theme?.business_listing_view?.components?.layout?.type || 'original'
  const [, t] = useLanguage();
  const [{ auth }] = useSession()
  const [, { getLastOrderHasNoReview }] = useOrder();

  const [, setIsReviewed] = useState()
  const [checkNotificationStatus, setCheckNotificationStatus] = useState({ open: false, checked: false })
  const defaultOrder = {
    id: 0,
    business_id: 0,
    business_name: '',
    logo: '',
    driver: {},
    products: [],
    review: {},
    user_review: {},
    delivery_datetime: ''
  }
  const [lastOrderReview, setLastOrderReview] = useState({
    isReviewOpen: false,
    order: defaultOrder,
    defaultStar: 5,
  })

  const requestLocationPermission = async () => {
    const notificationStatus = await checkNotifications()
    if (notificationStatus?.status === 'blocked') {
      setCheckNotificationStatus({ open: true, checked: false })
      return
    }
    setCheckNotificationStatus({ open: false, checked: true })
  };

  const callOpenSettings = () => {
    openSettings().catch(() => console.warn('cannot open settings'));
    setCheckNotificationStatus({ open: false, checked: true })
  }

  const _getLastOrderHasNoReview = async () => {
    const lastOrderHasNoReview = await getLastOrderHasNoReview()
    lastOrderHasNoReview && OrderReviewRequired(lastOrderHasNoReview)
  }

  const OrderReviewRequired = (order: any) => {
    setLastOrderReview({
      isReviewOpen: true,
      order: {
        id: order?.id,
        business_id: order?.business_id,
        business_name: order?.business?.name,
        logo: order.business?.logo,
        driver: order?.driver,
        products: order?.products,
        review: order?.review,
        user_review: order?.user_review,
        delivery_datetime: order?.delivery_datetime_utc
      },
      defaultStar: 5
    })
  }

  const handleOpenOrderReview = (star: number) => {
    setLastOrderReview({
      ...lastOrderReview, isReviewOpen: false, order: defaultOrder
    })
    props?.navigation && props.navigation.navigate(
      'ReviewOrder',
      {
        order: lastOrderReview.order,
        defaultStar: star || 5,
        setIsReviewed
      }
    )
  }

  useEffect(() => {
    auth && requestLocationPermission()
  }, [auth])

  useEffect(() => {
    checkNotificationStatus?.checked && _getLastOrderHasNoReview()
  }, [checkNotificationStatus])

  return (
    <>
      {((layout === 'original') || logosLayout) && <OriginalBusinessListing {...props} />}
      {(layout === 'appointment') && !logosLayout && <AppointmentBusinessListing {...props} />}

      {lastOrderReview?.isReviewOpen && (
        <OBottomPopup
          open={lastOrderReview?.isReviewOpen}
          transparent={true}
          onClose={() => setLastOrderReview({ ...lastOrderReview, isReviewOpen: false, order: defaultOrder })}
          title={t('HEY', 'Hey! ') + t('HOW_WAS_YOUR_ORDER', 'How was your order?')}
          bottomContainerStyle={{ height: 'auto', borderRadius: 10 }}
          titleStyle={{ textAlign: 'center' }}
          closeIcon={theme.images.general.close}
        >
          {lastOrderReview?.order && <ReviewTrigger order={lastOrderReview?.order} handleOpenOrderReview={handleOpenOrderReview} />}

        </OBottomPopup>
      )}
      {checkNotificationStatus && (
        <OBottomPopup
          open={checkNotificationStatus?.open}
          transparent={true}
          onClose={() => setCheckNotificationStatus({ open: false, checked: true })}
          title={t('ENABLE_NOTIFICATIONS', 'Enable notifications')}
          bottomContainerStyle={{ height: 'auto', borderRadius: 10 }}
          titleStyle={{ textAlign: 'center' }}
        >
          <NotificationSetting actFunction={() => callOpenSettings()} />
        </OBottomPopup>
      )}
    </>
  )
}
