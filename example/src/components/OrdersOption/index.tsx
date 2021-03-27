import React, { useState, useEffect } from 'react'
import { OrderList, useLanguage, useOrder } from 'ordering-components/native'
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { ActiveOrders } from '../ActiveOrders'
import { PreviousOrders } from '../PreviousOrders'

import { OptionTitle } from './styles'
import { colors } from '../../theme'
import { OrdersOptionParams } from '../../types'

import ContentLoader from 'react-native-easy-content-loader';
import {
  Placeholder,
  PlaceholderMedia,
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
    onNavigationRedirect
  } = props

  const [, t] = useLanguage()
  const [, { reorder }] = useOrder()
  const { loading, error, orders: values } = orderList

  const imageFails = activeOrders
    ? require('../../assets/images/empty_active_orders.png')
    : require('../../assets/images/empty_past_orders.png')

  const orders = customArray || values

  const [ordersSorted, setOrdersSorted] = useState<Array<any>>([])

  const [reorderLoading, setReorderLoading] = useState(false)

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
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver') }
    ]

    const objectStatus = orderStatus.find((o) => o.key === status)

    return objectStatus && objectStatus
  }

  useEffect(() => {
    const ordersSorted = orders.sort((a: any, b: any) => {
      if (activeOrders) {
        return Math.abs(new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }
      return Math.abs(new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    })
    setOrdersSorted(ordersSorted)
  }, [orders])

  return (
    <>
      {(orders.length > 0) && (
        <>
          <OptionTitle>
            <OText color={colors.textSecondary} mBottom={10} >
              {titleContent || (activeOrders
                ? t('ACTIVE_ORDERS', 'Active Orders')
                : t('PREVIOUS_ORDERS', 'Previous Orders'))}
            </OText>
          </OptionTitle>
          {!loading && ordersSorted.length === 0 && (
            <NotFoundSource
              content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
              image={imageFails}
              conditioned
            />
          )}
        </>
      )}
      {loading && (
        <>
          {activeOrders ? (
            <Placeholder style={{marginTop: 30}} Animation={Fade}>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                <PlaceholderLine width={20} height={70} style={{ marginRight: 20, marginBottom: 30 }} />
                <Placeholder>
                  <PlaceholderLine width={30} style={{ marginTop: 5 }} />
                  <PlaceholderLine width={50} />
                  <PlaceholderLine width={70} />
                </Placeholder>
              </View>
            </Placeholder>
          ) : (
            <View style={{marginTop: 30}}>
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
            orders={ordersSorted}
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
            orders={ordersSorted}
            pagination={pagination}
            loadMoreOrders={loadMoreOrders}
            getOrderStatus={getOrderStatus}
            onNavigationRedirect={onNavigationRedirect}
          />
        )
      )}
    </>
  )
}

export const OrdersOption = (props) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    orderStatus: props.activeOrders ? [0, 3, 4, 7, 8, 9] : [1, 2, 5, 6, 10, 11, 12],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 10,
      controlType: 'infinity'
    }
  }

  return <OrderList {...MyOrdersProps} />

}
