import React, { useState } from 'react'
import { useLanguage, useUtils } from 'ordering-components/native'
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { OButton, OIcon, OText } from '../shared'
import { Card, Logo, Information, MyOrderOptions, Status, WrappButton } from './styles'
import { colors } from '../../theme.json'
import { PreviousOrdersParams } from '../../types'

export const PreviousOrders = (props: PreviousOrdersParams) => {
  const {
    orders,
    pagination,
    onNavigationRedirect,
    loadMoreOrders,
    getOrderStatus,
    handleReorder,
    reorderLoading,
    orderID
  } = props

  const [, t] = useLanguage()
  const [reorderSelected,setReorderSelected] = useState<number | null>(null)
  const [{ parseDate, optimizeImage }] = useUtils()
  const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12]

  const handleClickViewOrder = (uuid: string) => {
    onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: uuid })
  }

  const handleClickOrderReview = (order: any) => {
    onNavigationRedirect && onNavigationRedirect('ReviewOrder', { order: { id: order?.id, business_id: order?.business_id, logo: order.business?.logo } })
  }

  const handleReorderClick = (id : number) => {
    setReorderSelected(id)
    handleReorder(id)
  }

  return (
    <ScrollView
      style={{ height: '60%', marginBottom: 30 }}
    >
      {orders.map((order: any) => (
        <Card key={order.id}>
          {!!order.business?.logo && (
            <Logo>
              <OIcon url={optimizeImage(order.business?.logo, 'h_300,c_limit')} style={styles.logo} />
            </Logo>
          )}
          <Information>
            <OText size={17} numberOfLines={1}>
              {order.business?.name}
            </OText>
            <OText size={15} color={colors.textSecondary} numberOfLines={1}>
              {order?.delivery_datetime_utc ? parseDate(order?.delivery_datetime_utc) : parseDate(order?.delivery_datetime, { utc: false })}
            </OText>
            <MyOrderOptions>
              <TouchableOpacity onPress={() => handleClickViewOrder(order?.uuid)}>
                <OText size={16} color={colors.primary} mRight={5} numberOfLines={1}>{t('MOBILE_FRONT_BUTTON_VIEW_ORDER', 'View order')}</OText>
              </TouchableOpacity>
              {
                allowedOrderStatus.includes(parseInt(order?.status)) && !order.review && (
                  <TouchableOpacity onPress={() => handleClickOrderReview(order)}>
                    <OText size={16} color={colors.primary} numberOfLines={1}>{t('REVIEW_ORDER', 'Review Order')}</OText>
                  </TouchableOpacity>
                )}
            </MyOrderOptions>
          </Information>
          <Status>
            <OText
              color={colors.primary}
              size={16}
              numberOfLines={1}
            >
              {getOrderStatus(order.status)?.value}
            </OText>
            <OButton
              text={t('REORDER', 'Reorder')}
              imgRightSrc={''}
              textStyle={styles.buttonText}
              style={reorderLoading && order.id === reorderSelected ? styles.reorderLoading : styles.reorderbutton}
              onClick={() => handleReorderClick(order.id)}
              isLoading={reorderLoading && order.id === reorderSelected}
            />
          </Status>

        </Card>
      ))}
      {pagination.totalPages && pagination.currentPage < pagination.totalPages && (
        <WrappButton>
          <OButton
            onClick={loadMoreOrders}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            imgRightSrc={null}
            textStyle={{color: colors.white}}
          />
        </WrappButton>
      )}
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  logo: {
    borderRadius: 10,
    width: 75,
    height: 75
  },
  reorderbutton: {
    width: 80,
    height: 40,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 10,
    flex: 1
  },
  reorderLoading: {
    width: 80,
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 2,
    marginRight: 2
  }
})
