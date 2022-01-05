import React from 'react'
import { View, useWindowDimensions } from 'react-native'
import { useTheme } from 'styled-components/native'
import { useLanguage, OrderVerticalList } from 'ordering-components/native'
import { Placeholder, PlaceholderLine, Fade } from "rn-placeholder";
import { OButton, OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { OrderListOption } from '../OrderListOption'

const OrdersListingUI = (props: any) => {
  const {
    ordersGroup,
    reorderLoading,
    loadMoreOrders,
    handleReorder,
    onNavigationRedirect,
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const { height } = useWindowDimensions()

  const imageFails = theme.images.general.emptyActiveOrders

  return (
    <>
      <OText size={20} style={{ marginTop: 20 }}>
        {t('MY_ORDERS', 'My Orders')}
      </OText>

      {!ordersGroup.error && ordersGroup.all?.orders?.length > 0 && (
        <>
          {ordersGroup.upcoming?.orders?.length > 0 && (
            <OrderListOption
              titleContent={t('UPCOMING', 'Upcoming')}
              typeStyle={1}
              orders={ordersGroup.upcoming?.orders}
              onNavigationRedirect={onNavigationRedirect}
            />
          )}
          {ordersGroup.active?.orders?.length > 0 && (
            <OrderListOption
              titleContent={t('ACTIVE', 'Active')}
              typeStyle={1}
              orders={ordersGroup.active?.orders}
              onNavigationRedirect={onNavigationRedirect}
            />
          )}
          {ordersGroup.past?.orders?.length > 0 && (
            <OrderListOption
              titleContent={t('PAST', 'Past')}
              typeStyle={2}
              orders={ordersGroup.past?.orders}
              allowedOrderStatus={[1, 2, 5, 6, 10, 11, 12]}
              isLoadingReorder={reorderLoading}
              handleReorder={handleReorder}
              onNavigationRedirect={onNavigationRedirect}
            />
          )}
          {!ordersGroup.loading &&
            ordersGroup?.pagination?.totalPages &&
            ordersGroup?.pagination?.currentPage < ordersGroup?.pagination?.totalPages &&
          (
            <View>
              <OButton
                text={t('LOAD_MORE_ORDERS', 'Load more orders')}
                imgRightSrc={null}
                textStyle={{ color: theme.colors.white }}
                style={{ borderRadius: 8, shadowOpacity: 0, marginTop: 20 }}
                onClick={loadMoreOrders}
              />
            </View>
          )}
        </>
      )}

      {ordersGroup.loading && (
        <View style={{ marginTop: 20 }}>
          {[...Array(6)].map((_, i) => (
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

      {!ordersGroup.loading && ordersGroup.all?.orders?.length === 0 && (
        <View style={{ height: height * 0.7, justifyContent: 'center' }}>
          <NotFoundSource
            content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
            image={imageFails}
          />
        </View>
      )}
    </>
  )
}

export const OrdersListing = (props: any) => {
  const ordersProps = {
    ...props,
    UIComponent: OrdersListingUI,
  }
  return <OrderVerticalList {...ordersProps} />
}
