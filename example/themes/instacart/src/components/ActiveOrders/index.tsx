import React from 'react'
import { useLanguage, useUtils, useConfig } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { OButton, OIcon, OText } from '../shared'
import { ActiveOrdersContainer, Card, Map, Information, Logo, OrderInformation, BusinessInformation, Price } from './styles'
import { View, StyleSheet } from 'react-native'
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

  const theme = useTheme()
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const [{ parseDate, parsePrice, optimizeImage }] = useUtils()

  const handleClickCard = (uuid: string) => {
    onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: uuid })
  }

  const Order = ({ order, index }: { order: any, index: number }) => (
    <React.Fragment>
      <Card
        isMiniCard={configs?.google_maps_api_key?.value}
        onPress={() => handleClickCard(order?.uuid)}
      >
        {!!(configs?.google_maps_api_key?.value) && (
          <Map>
            <OIcon
              url={getGoogleMapImage(order?.business?.location, configs?.google_maps_api_key?.value)}
              height={100}
              width={320}
              style={{ resizeMode: 'cover', borderTopRightRadius: 3, borderTopLeftRadius: 3 }}
            />
          </Map>
        )}
        <Information>
          {!!order.business?.logo && (
            <Logo>
              <OIcon
                url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
                style={styles.logo}
              />
            </Logo>
          )}
          <OrderInformation>
            <BusinessInformation style={{ width: '60%' }}>
              <View>
                <OText
                  size={16}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  {order.business?.name}
                </OText>
              </View>
              <View style={styles.orderNumber}>
                <OText size={12} space color={theme.colors.textSecondary}>{t('ORDER_NUMBER', 'Order No.')}</OText>
                <OText size={12} color={theme.colors.textSecondary}>{order.id}</OText>
              </View>
              <OText size={12} color={theme.colors.textSecondary}>{order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}</OText>
            </BusinessInformation>
            <Price>
              <OText size={16}>{parsePrice(order?.summary?.total || order?.total)}</OText>
              {order?.status !== 0 && (
                <OText color={theme.colors.primary} size={12} numberOfLines={2}>{getOrderStatus(order.status)?.value}</OText>
              )}
            </Price>
          </OrderInformation>
        </Information>
      </Card>
      {pagination?.totalPages && pagination?.currentPage < pagination?.totalPages && index === (10 * pagination?.currentPage) - 1 && (
        <Card
          style={{ ...styles.loadOrders, height: configs?.google_maps_api_key?.value ? 200 : 100 }}
          onPress={loadMoreOrders}
        >
          <OButton
            bgColor={theme.colors.white}
            textStyle={{ color: theme.colors.primary, fontSize: 20 }}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            borderColor={theme.colors.white}
            style={{ paddingLeft: 30, paddingRight: 30 }}
            onClick={loadMoreOrders}
          />
        </Card>
      )}
    </React.Fragment>
  )

  return (
    <ActiveOrdersContainer
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal
      isMiniCards={configs?.google_maps_api_key?.value}
      contentContainerStyle={{ paddingHorizontal: 40 }}
    >
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
