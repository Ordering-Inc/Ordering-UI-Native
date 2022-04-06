import React, { useState, useEffect } from 'react'
import { OrderList, useLanguage, useOrder, ToastType, useToast } from 'ordering-components/native'
import { OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { ActiveOrders } from '../ActiveOrders'
import { PreviousOrders } from '../PreviousOrders'

import { OptionTitle } from './styles'
import { OrdersOptionParams } from '../../types'

import {
  Placeholder,
  PlaceholderLine,
  Fade
} from "rn-placeholder";
import { View } from 'react-native'
import { useTheme } from 'styled-components/native'

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    navigation,
    activeOrders,
    orderList,
    pagination,
    titleContent,
    customArray,
    onNavigationRedirect,
    orderStatus,
    loadMoreOrders,
    loadOrders,
    ordersLength,
    setOrdersLength,
		businessId,
		preOrders,
    sortOrders
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [, { reorder }] = useOrder()
  const [, { showToast }] = useToast()
  const { loading, error, orders: values } = orderList

  const imageFails = activeOrders
    ? theme.images.general.emptyActiveOrders
    : theme.images.general.emptyPastOrders

  let [orders, setOrders] = useState(values)

  const [reorderLoading, setReorderLoading] = useState(false)
  const [isLoadingFirstRender, setIsLoadingFirstRender] = useState(false)
  const [screen, setScreen] = useState({ name: '', uuid: null })
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

    } catch (err: any) {
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
      { key: 13, value: t('PREORDER', 'PreOrder') },
      { key: 14, value: t('ORDER_NOT_READY', 'Order not ready') },
      { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer') },
      { key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer') },
      { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer') },
      { key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business') },
      { key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer') },
      { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business') },
      { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business') },
      { key: 22, value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver') },
      { key: 23, value: t('ORDER_DRIVER_ON_WAY', 'Driver on way') }
    ]

    const objectStatus = orderStatus.find((o) => o.key === status)

    return objectStatus && objectStatus
  }

  useEffect(() => {
    setOrdersLength && setOrdersLength({
      ...ordersLength,
      [activeOrders ? 'activeOrdersLength' : 'previousOrdersLength']: values.length
    })
  }, [values.length])

  useEffect(() => {
    setOrders(
      sortOrders(
        values.filter((order: any) => orderStatus.includes(order.status))
      )
    )
  }, [values])

  return (
    <>
      <OptionTitle>
        {orders.length > 0 && !isLoadingFirstRender && (
          <OText
            size={16}
            color={theme.colors.textPrimary}
            mBottom={10}
            style={activeOrders ? { paddingHorizontal: 0 } : {}}
          >
            {titleContent || (
							preOrders ? t('UPCOMING', 'Upcoming')
							: activeOrders ? t('ACTIVE', 'Active')
              : t('PAST', 'Past'))}
          </OText>
        )}
      </OptionTitle>
      {!loading &&
        orders.length === 0 &&
        !isLoadingFirstRender &&
        ordersLength.previousOrdersLength === 0 &&
        ordersLength.activeOrdersLength === 0 &&
      (
        <NotFoundSource
          content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
          image={imageFails}
          conditioned
        />
      )}
      {loading && (
        <>
          {activeOrders ? (
						<>
						{[...Array(2)].map((_, idx) => 
							<Placeholder key={idx} Animation={Fade}>
								<View style={{ width: '100%', flexDirection: 'row' }}>
									<PlaceholderLine width={20} height={70} style={{ marginRight: 20, marginBottom: 35 }} />
									<Placeholder>
										<PlaceholderLine width={30} style={{ marginTop: 5 }} />
										<PlaceholderLine width={50} />
										<PlaceholderLine width={70} />
									</Placeholder>
								</View>
							</Placeholder>
						)}
						</>
          ) : (
            <View style={{ marginTop: 30 }}>
              {[...Array(3)].map((item, i) => (
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
      {!loading && !error && orders.length > 0 && !isLoadingFirstRender && (
        activeOrders ? (
          <ActiveOrders
            orders={orders.filter((order: any) => businessId !== null ? order?.business_id === parseInt(businessId) : true)}
            pagination={pagination}
            loadMoreOrders={loadMoreOrders}
            reorderLoading={reorderLoading}
            customArray={customArray}
            getOrderStatus={getOrderStatus}
            onNavigationRedirect={onNavigationRedirect}
            setScreen={setScreen}
            screen={screen}
          />
				) : (
					<>
            {preOrders ?
              <ActiveOrders
                orders={orders.filter((order: any) => businessId !== null ? order?.business_id === parseInt(businessId) : true)}
                pagination={pagination}
                loadMoreOrders={loadMoreOrders}
                reorderLoading={reorderLoading}
                customArray={customArray}
                getOrderStatus={getOrderStatus}
                onNavigationRedirect={onNavigationRedirect}
                setScreen={setScreen}
                screen={screen}
                isPreorders
              />
            : <PreviousOrders
                reorderLoading={reorderLoading}
                orders={orders.filter((order: any) => businessId !== null ? order?.business_id === parseInt(businessId) : true)}
                pagination={pagination}
                loadMoreOrders={loadMoreOrders}
                getOrderStatus={getOrderStatus}
                onNavigationRedirect={onNavigationRedirect}
                handleReorder={handleReorder}
              />
            }
					</>
        )
      )}
    </>
  )
}

export const OrdersOption = (props: OrdersOptionParams) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    orderStatus: props.preOrders ? [13] : props.activeOrders
      ? [0, 3, 4, 7, 8, 9, 14, 15, 18, 19, 20, 21, 22, 23]
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
