import React from 'react'
import { useLanguage, useUtils, useConfig } from 'ordering-components/native'
import { OButton, OIcon, OText } from '../shared'
import { ActiveOrdersContainer, Card, Map, Information, Logo, OrderInformation, BusinessInformation, Price } from './styles'
import { View, StyleSheet } from 'react-native'
import { colors } from '../../theme'
import { getGoogleMapImage } from '../../utils'

import { ActiveOrdersParams } from '../../types'

export const ActiveOrders = (props: ActiveOrdersParams) => {

  const {
    onNavigationRedirect,
    orders,
    pagination,
    loadMoreOrders,
    getOrderStatus
  } = props

  const [{configs}] = useConfig()
  const [, t] = useLanguage()
  const [{ parseDate, parsePrice }] = useUtils()

  const handleClickCard = (uuid: string) => {
    onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: uuid })
  }

  const Order = ({ order, index }: { order: any, index: number }) => (
    <React.Fragment>
      <Card onPress={() => handleClickCard(order?.uuid)} isMiniCard={configs?.google_maps_api_key?.value}>
        {(configs?.google_maps_api_key?.value) && (
          <Map>
            <OIcon
              url={getGoogleMapImage(order?.business?.location, configs?.google_maps_api_key?.value)}
              height={100}
              width={340}
              style={{resizeMode: 'cover', borderTopRightRadius: 24, borderTopLeftRadius: 24}}
            />
          </Map>
        )}
        <Information>
          {order.business?.logo && (
            <Logo>
              <OIcon url={order.business?.logo} style={styles.logo} />
            </Logo>
          )}
          <OrderInformation>
            <BusinessInformation>
              <OText size={16}>{order.business?.name}</OText>
              <View style={styles.orderNumber}>
                <OText size={12} space color={colors.textSecondary}>{t('ORDER_NUMBER', 'Order No.')}</OText>
                <OText size={12} color={colors.textSecondary}>{order.id}</OText>
              </View>
              <OText size={12} color={colors.textSecondary}>{order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}</OText>
            </BusinessInformation>
            <Price>
              <OText size={16}>{parsePrice(order?.summary?.total || order?.total)}</OText>
              {order?.status !== 0 && (
                <OText color={colors.primary} size={12} numberOfLines={2}>{getOrderStatus(order.status)?.value}</OText>
              )}
            </Price>
          </OrderInformation>
        </Information>
      </Card>
      {pagination?.totalPages && pagination?.currentPage < pagination?.totalPages && index === (10 * pagination?.currentPage) - 1 && (
        <Card
          style={styles.loadOrders}
        >
          <OButton
            bgColor={colors.white}
            textStyle={{ color: colors.primary }}
            onClick={loadMoreOrders}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            borderColor={colors.white}
            style={{ paddingLeft: 30, paddingRight: 30 }}
          />
        </Card>
      )}
    </React.Fragment>
  )

  return (
    <ActiveOrdersContainer horizontal isMiniCards={configs?.google_maps_api_key?.value}>
      {orders.length > 0 && (
        orders.map((order: any, index: any) => (
          <Order
            key={order?.id || order?.uuid}
            order={order}
            index={index}
          />
        ))
      )}
    </ActiveOrdersContainer>
  )
}

const styles = StyleSheet.create({
  logo: {
    borderRadius: 10,
    width: 75,
    height: '100%'
  },
  orderNumber: {
    flexDirection: 'row'
  },
  loadOrders: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 230
  }
})
