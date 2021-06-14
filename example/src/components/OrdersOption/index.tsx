import React, { useState } from 'react'
import { OrderList, useLanguage, useOrder } from 'ordering-components/native'
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { ActiveOrders } from '../ActiveOrders'
import { PreviousOrders } from '../PreviousOrders'

import { OptionTitle } from './styles'
import { colors, images } from '../../theme.json'
import { OrdersOptionParams } from '../../types'
import { ToastType, useToast } from '../../providers/ToastProvider'

import {
  Placeholder,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import { View } from 'react-native'

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    activeOrders,
    orderList,
    pagination,
    titleContent,
    customArray,
    loadMoreOrders,
    onNavigationRedirect,
    orderStatus
  } = props

  const [, t] = useLanguage()
  const [, { reorder }] = useOrder()
  const { showToast } = useToast()
  const { loading, error, orders: values } = orderList

  const imageFails = activeOrders
    ? images.general.emptyActiveOrders
    : images.general.emptyPastOrders

  const orders = customArray || values || []

  const [reorderLoading, setReorderLoading] = useState(false)


  const handleReorder = async (orderId: number) => {
    setReorderLoading(true)
    try {
      const { error, result } = await reorder(orderId)
      if (!error) {
        onNavigationRedirect && onNavigationRedirect('CheckoutNavigator', { cartUuid: result.uuid })
        setReorderLoading(false)
        return
      }
      setReorderLoading(false)

    } catch (err) {
      showToast(ToastType.Error, t('ERROR', err.message))
      setReorderLoading(false)
    }
  }

  const getOrderStatus = (s: string) => {
    const status = parseInt(s)
    const orderStatus = [
      { key: 0, value: t('PENDING', 'Pending') },
      { key: 1, value: t('COMPLETED', 'Completed') },
      { key: 2, value: t('REJECTED', 'Rejected') },
      { key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business') },
      { key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed') },
      { key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business') },
      { key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver') },
      { key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business') },
      { key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver') },
      { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver') },
      { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver') },
      { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver') },
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver') },
      { key: 13, value: t('PREORDER', 'PreOrder')},
      { key: 14, value: t('ORDER_NOT_READY', 'Order not ready')},
      { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer') },
      { key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancel },led by customer')},
      { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer')  },
      { key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business') },
      { key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer') },
      { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business') },
      { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business')}
    ]

    const objectStatus = orderStatus.find((o) => o.key === status)

    return objectStatus && objectStatus
  }

  return (
    <>
      {(orders.length > 0) && (
        <>
          <OptionTitle>
            <OText size={16} color={colors.textSecondary} mBottom={10} >
              {titleContent || (activeOrders
                ? t('ACTIVE_ORDERS', 'Active Orders')
                : t('PREVIOUS_ORDERS', 'Previous Orders'))}
            </OText>
          </OptionTitle>
        </>
      )}
      {!loading && orders.length === 0 && (
        <NotFoundSource
          content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
          image={imageFails}
          conditioned
        />
      )}
      {loading && (
        <>
          {activeOrders ? (
            <Placeholder style={{ marginTop: 30 }} Animation={Fade}>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <PlaceholderLine width={20} height={70} style={{ marginRight: 20, marginBottom: 35 }} />
                <Placeholder>
                  <PlaceholderLine width={30} style={{ marginTop: 5 }} />
                  <PlaceholderLine width={50} />
                  <PlaceholderLine width={70} />
                </Placeholder>
              </View>
            </Placeholder>
          ) : (
            <View style={{ marginTop: 30 }}>
              {[...Array(5)].map((item, i) => (
                <Placeholder key={i} Animation={Fade}>
                  <View style={{ width: '100%', flexDirection: 'row' }}>
                    <PlaceholderLine width={20} height={70} style={{ marginRight: 20, marginBottom: 20 }} />
                    <Placeholder>
                      <PlaceholderLine width={30} style={{ marginTop: 5 }} />
                      <PlaceholderLine width={50} />
                      <PlaceholderLine width={20} />
                    </Placeholder>
                  </View>
                </Placeholder>
              ))}
            </View>
          )}
        </>
      )}
      {!loading && !error && orders.length > 0 && (
        activeOrders ? (
          <ActiveOrders
            orders={orders.filter((order: any) => orderStatus.includes(order.status))}
            pagination={pagination}
            loadMoreOrders={loadMoreOrders}
            reorderLoading={reorderLoading}
            customArray={customArray}
            getOrderStatus={getOrderStatus}
            onNavigationRedirect={onNavigationRedirect}
          />
        ) : (
          <PreviousOrders
            reorderLoading={reorderLoading}
            orders={orders.filter((order: any) => orderStatus.includes(order.status))}
            pagination={pagination}
            loadMoreOrders={loadMoreOrders}
            getOrderStatus={getOrderStatus}
            onNavigationRedirect={onNavigationRedirect}
            handleReorder={handleReorder}
          />
        )
      )}
    </>
  )
}

export const OrdersOption = (props: OrdersOptionParams) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    orderStatus: props.activeOrders
      ? [0, 3, 4, 7, 8, 9, 13, 14, 15, 18, 19, 20, 21]
      : [1, 2, 5, 6, 10, 11, 12, 16, 17],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 10,
      controlType: 'infinity'
    }
  }

  return <OrderList {...MyOrdersProps} />

}
